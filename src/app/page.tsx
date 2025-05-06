// import Image from "next/image";
// import styles from "./page.module.css";
// import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import { json } from "stream/consumers";

export default async function Home() {
  const users = await prisma.user.findMany()
  return (
    <div>
      <h1>FINANCE TRACKER</h1>
      {JSON.stringify(users)}
   
    </div>
   
  );
}
