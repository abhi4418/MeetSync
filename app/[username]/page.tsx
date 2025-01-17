import { getUserByUserName } from "@/actions/users";
import { EventCard } from "@/components/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";

export async function generateMetadata({params} : {
    params : Promise<{
        username : string ,
    }>
}) {
    const {username} = await params ;
    const user = await getUserByUserName(username) ;
    if(!user){
        return  {
            title : "User Not Found",
        }
    }

    return {
        title : `${user.name}'s Profile | Meetsync`,
        description : `Book an event with ${user.name} on Meetsync. View available public events and schedules`,
    }
}

export default async function UserPage({params} : {
    params : Promise<{
        username : string ,
    }>
}){
    const {username} = await params ;
    const user = await getUserByUserName(username) ;
    if(!user){
        notFound() ;
    }
    return <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.imageUrl || ""} alt={user.name || ""} />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 text-center">
            Welcome to my scheduling page. Please select an event below to book a call with me.
        </p>
        </div>

        {user.events.length === 0? (
            <p className="text-center text-gray-600">
                No Public events available.
            </p>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {user.events.map((event)=>{
                    //@ts-expect-error
                    return <EventCard key={event.id} event = {event}
                    username={username}
                    isPublic />
                })}
            </div>
        )}
    </div>
}