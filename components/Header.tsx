import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import { UserMenu } from "./user-menu";
import { checkUser } from "@/lib/checkUser";

export async function Header() {
  await checkUser() ;
  return (
    <nav className="mx-auto px-4 flex justify-between items-center shadow-md border-b-2">
        <Link href={'/'} className="flex items-center">
            <Image
            src='/logo.png'
            width={100}
            height={80}
            alt="Meetsync Logo"
            className="w-auto" />
        </Link>

        <div className="flex items-center gap-4">
            <Link href={'/events?create=true'}>
                <Button className="flex items-center gap-2">
                    <PenBox size={18} /> Create Event
                </Button>
            </Link>
            <SignedOut>
                <SignInButton forceRedirectUrl={'/dashboard'}>
                    <Button variant="outline">Login</Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserMenu />
            </SignedIn>
        </div>
    </nav>
  )
}