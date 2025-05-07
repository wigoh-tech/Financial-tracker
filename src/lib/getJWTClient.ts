// src/lib/getJWTClient.ts
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export default async function getJWTClient(req: NextRequest): Promise<string | null> {
  const { getToken } = getAuth(req);
  return await getToken({ template: "default" });
}
