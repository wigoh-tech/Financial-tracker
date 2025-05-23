import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function getTransactions() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(transactions);
}

export async function createTransaction(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(body.amount),
      description: body.description,
      dueDate: new Date(body.dueDate),
      type: body.type,
      categoryId: body.categoryId ? parseInt(body.categoryId) : null,
      isRecurring: body.isRecurring || false,
      recurrence: body.recurrence || null,
      userId,
    },
  });

  return NextResponse.json(transaction);
}
