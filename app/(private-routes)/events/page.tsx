import { getUserEvents } from "@/actions/events";
import { EventCard } from "@/components/EventCard";
import { Suspense } from "react"

export default function EventsPage(){
    return (
        <Suspense fallback={<div>Loading Events...</div>}>
            <Events />
        </Suspense>
    )
}

async function Events(){
    const {events , username} = await getUserEvents() ;

    if(events.length === 0){
        return <div>You haven't created any events yet.</div>
    }

    return <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {events.map((event)=>(
            <EventCard key={event.id} event = {event} username = {username} />
        ))}
    </div>
}