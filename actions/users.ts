"use server"
import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function updateUsername(username : string){
    const {userId} = await auth() ;
    if(!userId){
        throw new Error("unauthenticated")
    }

    const existingUser = await db.user.findUnique({
        where : {
            username
        }
    })

    if(existingUser && existingUser.id !== userId){
        throw new Error("username already exists");
    }

    await db.user.update({
        where : {
            clerkUserId : userId
        },
        data : {
            username
        }
    }) ;

    (await clerkClient()).users.updateUser(userId , {
        username
    })

    return  {succcess : true} ;
}