import { Suspense } from "react";

export default function EventsPage({children} : {
    children : React.ReactNode
}){
    return (
        <div className="mx-auto">
            <Suspense fallback={<div>Loading Availability...</div>}>
                {children}
            </Suspense>
        </div>
    )
}