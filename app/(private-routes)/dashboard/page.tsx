"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { usernameSchema } from "@/app/lib/validators";
import { useEffect } from "react";

export default function(){
    const {isLoaded , user} = useUser() ;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const {register , handleSubmit , setValue , formState: {errors}} = useForm({
        resolver : zodResolver(usernameSchema)
    })

    useEffect(()=>{
        setValue("username" , user?.username)
    } , [isLoaded])

    const onSubmit = async (data : any) =>{

    }

    return <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>
                    Welcome , {user?.firstName}
                </CardTitle>
            </CardHeader>
            {/* Latest Updates */}
        </Card>    

        <Card>
            <CardHeader>
                <CardTitle>Your Unique Link</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span>{origin}/</span>
                            <Input {...register("username")} placeholder="Your Username" className="w-full" />
                        </div>                        
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                            {/* @ts-ignore */}
                            {errors.username.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit">
                        Update Username
                    </Button>
                </form>
            </CardContent>
        </Card> 

    </div>
}