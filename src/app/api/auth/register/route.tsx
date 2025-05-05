import { NextResponse } from 'next/server';
import { registerUser } from '@/controllers/authController';
import { prisma} from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const result = await registerUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
    try {
      const clients = await prisma.client.findMany();
      return NextResponse.json(clients);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }