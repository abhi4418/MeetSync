"use server"
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {addDays, addMinutes, format, isBefore, parseISO, startOfDay} from "date-fns"

export async function getAvailability() {
    const { userId } = await auth();
        if (!userId) {
          throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include : {
            availability : {
                include : {
                    days : true
                }
            }
        }
    });
    
    if (!user || !user.availability) {
        return null ;
    }

    const availabilityData =  {
        timeGap : user.availability.timeGap
    } ;

    [   "monday" ,
        "tuesday" ,
        "wednesday" ,
        "thursday" ,
        "friday" ,
        "saturday" ,
        "sunday"
    ].forEach(day => {
        const dayAvailability = user.availability?.days.find((d) => d.day === day.toUpperCase()) ;
        // @ts-ignore
        availabilityData[day] = {
            isAvailable : !!dayAvailability ,
            startTime : dayAvailability ? dayAvailability.startTime.toISOString().slice(11,16) :
            "09:00" ,
            endTime : dayAvailability ? dayAvailability.startTime.toISOString().slice(11,16) :
            "19:00" ,
        }
    }) ;

    return availabilityData ;
}

export async function updateAvailability(data : any){
    const { userId } = await auth();
        if (!userId) {
          throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include : {
            availability : true 
        }
    });
    
    if (!user) {
        throw new Error("User not found");
    }   

    const availabilityData = Object.entries(data).flatMap(([day , {isAvailable , startTime , endTime}] : any) => {
        if(isAvailable){
            const baseDate = new Date().toISOString().split("T")[0] ;
            return [{
                day : day.toUpperCase() ,
                startTime : new Date(`${baseDate}T${startTime}:00Z`) ,
                endTime : new Date(`${baseDate}T${endTime}:00Z`)
            }]
        }
        return [] ;
    })
    
    if(user.availability){
        await db.availability.update({
            where : {
                id : user.availability.id
            } ,
            data : {
                timeGap : data.timeGap ,
                days : {
                    deleteMany : {} ,
                    create : availabilityData
                }
            }
        })
    }
    else {
        await db.availability.create({
            data : {
                userId : user.id ,
                timeGap : data.timeGap ,
                days : {
                    create : availabilityData
                }
            }
        })
    }

    return {success : true} ;
}

export async function getEventAvailability(eventId : string){
    const event = await db.event.findUnique({
        where  : {
            id : eventId
        } ,
        include : {
            user : {
                include : {
                    availability : {
                        select : {
                            days : true ,
                            timeGap : true
                        }
                    }  , 
                    bookings : {
                        select : {
                            startTime : true ,
                            endTime : true
                        }
                    }
                }
            }
        }
    })

    if(!event || !event.user.availability){
        return [] ;
    }

    const {availability , bookings} = event.user ;
    const startDate = startOfDay(new Date()) ;
    const endDate = addDays(startDate , 30) ;

    const availableDates = [] ;
    
    for(let date = startDate ; date <= endDate ; date = addDays(date , 1)){
        const dayofWeek = format(date , "EEEE").toUpperCase();
        const dayAvailability = availability.days.find((d)=>{
            return d.day === dayofWeek
        })

        if(dayAvailability){
            const dateStr = format(date , "yyyy-MM-dd") ;

            const slots = generateAvailableTimeSlots(
                dayAvailability.startTime ,
                dayAvailability.endTime ,
                event.duration ,
                bookings  ,
                dateStr ,
                availability.timeGap
            );

            availableDates.push({
                date : dateStr ,
                slots
            })
        }
    }
    return availableDates ;
}

type BookingType = {
    startTime : Date
    endTime : Date
}

const generateAvailableTimeSlots = (
    startTime : Date ,
    endTime : Date ,
    duration : number ,
    bookings : BookingType[] ,
    dateStr : string ,
    timeGap = 0
) =>{

    const slots = [];
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // If the date is today, start from the next available slot after the current time
  const now = new Date();
  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEnd;
  }

  return slots;
}