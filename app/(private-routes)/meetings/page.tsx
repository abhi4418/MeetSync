import { getUserMeetings } from "@/actions/meetings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeetingList } from "./_components/meeting-list";
import { Suspense } from "react";

export const metadata = {
    title : "Your Meetings | Meetsync" ,
    description : "View and manage your upcoming and past meetings"
}

export default function(){
    return <div>
        <Tabs defaultValue="upcoming">
            <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <Suspense fallback={<div>Loading upcoming meetings...</div>}>
                    <UpcomingMeetings />
                </Suspense>
            </TabsContent>
            <TabsContent value="past">
                <Suspense fallback={<div>Loading past meetings...</div>}>
                <PastMeetings />    
                </Suspense>
            </TabsContent>
        </Tabs>
    </div>
}

async function UpcomingMeetings(){
    const meetings = await getUserMeetings({type : "upcoming"}) ;
    return <MeetingList meetings={meetings} type="upcoming" />
}

async function PastMeetings(){
    const meetings = await getUserMeetings({type : "past"}) ;
    return <MeetingList meetings={meetings} type="past" />
}