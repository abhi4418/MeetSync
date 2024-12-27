import { useState } from "react"

export const useFetch = (cb : any) =>{
    const [data , setData] = useState<any>(null) ;
    const [loading , setLoading] = useState<any>(null) ;
    const [error , setError] = useState<any>(null) ;

    const fn = async (...args : any) => {
        setLoading(true) ;
        setError(null) ;

        try {
            const response = await cb(...args) ;
            setData(response) ;
            setError(null) ;
        } catch (error) {
            setError(error) ;
        }
        finally {
            setLoading(false) ;
        }
    }

    return {
        data ,
        loading ,
        error , 
        fn
    }
}