import { getAvailability } from "@/actions/availability"
import { defaultAvailability } from "./data";
import { AvailabilityForm } from "./_components/AvailabilityForm";

export default async function AvailabilityPage(){
    const availability = await getAvailability() ;
    return <AvailabilityForm initialData = {availability || defaultAvailability} />
}   