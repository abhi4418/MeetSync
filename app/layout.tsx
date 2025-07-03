import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import {ClerkProvider} from "@clerk/nextjs";
import { CreateEventDrawer } from "@/components/create-event";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "MeetSync",
  description: "Book meetings seamlessly",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.className}`}
        >
          {/* Header */}
          <Header/>
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
          </main>
          {/* Footer */}
          <footer className="bg-blue-100 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>©{new Date().getFullYear()} MeetSync</p>
            </div>
          </footer>

          {/* create event drawer */}
          <Suspense>
            <CreateEventDrawer />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
