import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { isPaid } = await req.json();

  try {
    const updated = await prisma.transaction.update({
      where: { id: Number(params.id) },
      data: { isPaid },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update transaction", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
