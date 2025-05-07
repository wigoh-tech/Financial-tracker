// src/app/api/auth-check/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return new NextResponse(`Authenticated as user ${userId}`, { status: 200 });
}
