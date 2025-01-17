"use client"
import { bookingSchema } from "@/app/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Event } from "@prisma/client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import "react-day-picker/style.css"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from "@/hooks/use-fetch"
import { createBooking } from "@/actions/bookings"

export function BookingForm({event , availability} : {
    event : Event ,
    availability : {
        date : string ,
        slots : string[]
    }[]
}){

    const {register , handleSubmit ,setValue ,  formState : {errors}} = useForm({
        resolver : zodResolver(bookingSchema)
    })

    const [selectedDate , setSelectedDate] = useState<any>(null) ;
    const [selectedTime , setSelectedTime] = useState<string  | null>(null) ;

    const availableDays = availability.map((day) => new Date(day.date));

    const timeSlots = selectedDate? 
    availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

    useEffect(()=>{
        if(selectedDate){
            setValue("date" , format(selectedDate , "yyyy-MM-dd"))
        }
    } , [selectedDate , setValue])

    useEffect(()=>{
        if(selectedTime){
            setValue("time" , selectedTime)
        }
    } , [selectedTime , setValue])

    const {loading , data , fn : fnCreateBooking} = useFetch(createBooking)

    const onSubmit = async (data : any) => {

        if(!selectedDate || !selectedTime){
            console.error("Date or time not selected")
            return ;
        }

        const startTime = new Date(`${format(selectedDate , "yyyy-MM-dd")}T${selectedTime}`) ;
        const endTime = new Date(startTime.getTime() + event.duration * 60000) ;

        const bookingData = {
            eventId : event.id ,
            name : data.name ,
            email : data.email ,
            startTime : startTime.toISOString() ,
            endTime : endTime.toISOString() ,
            additionalInfo : data.additionalInfo
        }

        await fnCreateBooking(bookingData) ;
    }

    if (data) {
        return (
          <div className="text-center p-10 border bg-white">
            <h2 className="text-2xl font-bold mb-4">Booking successful!</h2>
            {data.meetLink && (
              <p>
                Join the meeting:{" "}
                <a
                  href={data.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {data.meetLink}
                </a>
              </p>
            )}
          </div>
        );
      }
    return <div className="flex flex-col gap-8 p-10 border bg-white">
        <div className="md:h-96 flex flex-col md:flex-row gap-5">
            <div>
                <DayPicker
                mode = "single"
                selected={selectedDate}
                onSelect={(date)=>{
                    setSelectedDate(date) ;
                    setSelectedTime(null) ;
                }}
                disabled = {[{before : new Date()}]}
                modifiers={{
                    available: availableDays
                }}
                modifiersStyles={{
                    available :{
                        background : "lightblue",
                        borderRadius: 100
                    }
                }}
                />
            </div>
            <div className="h-full w-full md:overflow-scroll no-scrollbar">
                {selectedDate && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {timeSlots.map((slot)=>{
                                return (
                                    <Button onClick={()=>{
                                        setSelectedTime(slot) ;
                                    }}
                                    key={slot}
                                    variant = {selectedTime === slot ? "default" : "outline"}
                                    >{slot}</Button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {selectedTime && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Input {...register("name")} placeholder="Your Name" />
                    {errors.name &&  (
                        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
                    )}
                </div>
                <div>
                    <Input {...register("email")} type="email" placeholder="Your Email" />
                    {errors.email &&  (
                        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
                    )}
                </div>

                <div>
                    <Textarea {...register("additionalInfo")} placeholder="Additional Info" />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Scheduling..." : "Schedule Event"}
                </Button>
            </form>
        )}
    </div>
}