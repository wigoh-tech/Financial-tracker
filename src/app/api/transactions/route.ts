// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';

// export async function GET() {
//   const transactions = await prisma.transaction.findMany({
//     include: { category: true },
//     orderBy: { createdAt: 'desc' },
//   });
//   return NextResponse.json(transactions);
// }

// export async function POST(req: Request) {
//   const body = await req.json();
//   const transaction = await prisma.transaction.create({
//     data: {
//       amount: body.amount,
//       note: body.note,
//       categoryId: body.categoryId,
//     },
//   });
//   return NextResponse.json(transaction);
// }
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
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


    },
  });
  return NextResponse.json(transaction);
}
