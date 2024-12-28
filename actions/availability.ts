"use server"
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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