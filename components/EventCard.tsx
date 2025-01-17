"use client"
import { Event } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Link, Trash2 } from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useFetch } from "@/hooks/use-fetch"
import { deleteEvent } from "@/actions/events"

export function EventCard({event , username , isPublic=false} : {
    event : Event & {_count : {bookings : number}}
    username : string | null
    isPublic? : boolean
}) {

    const [isCopied , setIsCopied] = useState(false)
    const router = useRouter() ;
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event.id}`) ;
            setIsCopied(true) ;
            setTimeout(()=>{
                setIsCopied(false) ;
            } , 2000)
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    }

    const {loading , fn: fnDeleteEvent} = useFetch(deleteEvent) ;

    const handleDelete = async () =>{
        if (window?.confirm("Are you sure you want to delete this event?")) {
            await fnDeleteEvent(event.id);
            router.refresh();
        }
    }

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== "BUTTON" && target.tagName !== "SVG") {
            window?.open(`${window.location.origin}/${username}/${event.id}`, "_blank");
        }
    };

    return <div>
        <Card onClick={handleCardClick} className="flex flex-col justify-between cursor-pointer">
        <CardHeader>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription className="flex justify-between">
                <span>
                {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
                </span>
                
                <span>
                    {event._count.bookings} Bookings
                </span>
            </CardDescription>
        </CardHeader>
        <CardContent>
        <p>
        {event.description?.includes(".") 
            ? event.description.substring(0, event.description.indexOf("."))
            : event.description}
        </p>
        </CardContent>
        {!isPublic && <CardFooter className="flex gap-2">
            <Button onClick={handleCopy} className="flex items-center"
            variant={"outline"}><Link className="mr-2 h-4 w-4" />{isCopied? "Copied!" : "Copy Link"}</Button>
            <Button onClick={handleDelete}
            disabled = {loading}
            className="flex items-center"
            variant={"destructive"}><Trash2 className="mr-2 h-4 w-4" /> {loading ? "Deleting..." : "Delete"}</Button>
        </CardFooter>}
        </Card>
    </div>
}