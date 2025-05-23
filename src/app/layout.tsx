// src/app/layout.tsx

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar"; // create this next
import Header from "@/components/header/page";



const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Finance Tracker",
  description: "Next.js app with Clerk + PostgreSQL + Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {



  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50`}>
       
          <Header/>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
