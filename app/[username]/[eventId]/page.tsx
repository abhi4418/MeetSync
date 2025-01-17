import { getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventDetails} from "./_components/event-details";
import { BookingForm } from "./_components/booking-form";
import { getEventAvailability } from "@/actions/availability";

export async function generateMetadata({params} : {
    params : Promise<{
        username : string ,
        eventId : string ,
    }>
}) {
    const { username, eventId } = await params;
    const event = await getEventDetails(username , eventId) ;
    if(!event){
        return  {
            title : "Event Not Found",
        }
    }

    return {
        title : `Book ${event.title} with ${event.user.name} | Meetsync`,
        description : `Schedule a ${event.duration}-minute event with ${event.user.name} on Meetsync.`,
    }
}

export default async function ({params} : {
    params : Promise<{
        username : string ,
        eventId : string ,
    }>
}){
    const { username, eventId } = await params;
    const event = await getEventDetails(username , eventId) ;
    const availability = await getEventAvailability(eventId) ;
    if(!event){
        notFound() ;
    }
    return <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
        {/* @ts-expect-error */}
        <EventDetails event = {event} />
        <Suspense fallback={<div>Loading Booking form...</div>}>
            <BookingForm event = {event} availability = {availability} />
        </Suspense>
    </div>
}