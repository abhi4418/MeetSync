import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar, Clock, Video } from "lucide-react"
import CancelMeetingButton from "./cancel-meeting"

export function MeetingList({meetings , type} : {
    // have to fix the type here
    meetings : any
    type : "upcoming" | "past"
}) {

    if(meetings.length === 0){
        return <div>No {type} meetings found</div>
    }

    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting : any)=>{
            return  (
                <Card className="flex flex-col justify-between" key = {meeting.id}>
                <CardHeader>
                    <CardTitle>{meeting.event.title}</CardTitle>
                    <CardDescription>with {meeting.name}</CardDescription>
                    <CardDescription>&quot;{meeting.additionalInfo}&quot;</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                            {format(new Date(meeting.startTime), "MMMM d, yyyy")}
                        </span>
                    </div>
                    <div className="flex items-center mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                        {format(new Date(meeting.startTime), "hh:mm a")} -{" "}
                        {format(new Date(meeting.endTime), "hh:mm a")}
                        </span>
                    </div>
                    {meeting.meetLink && (
                        <div className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            <a
                            className = "text-blue-500 hover:underline" 
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer">
                                Join Meeting
                            </a>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <CancelMeetingButton meetingId={meeting.id} />
                </CardFooter>
                </Card>
            )
        })}
    </div>
}