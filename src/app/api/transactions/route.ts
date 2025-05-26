import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to GET /api/transactions');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info(`Fetching transactions for user: ${userId}`);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    logger.info(`Fetched ${transactions.length} transactions for user: ${userId}`);
    return NextResponse.json(transactions);
  } catch (error) {
    logger.error(`Transaction GET error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to POST /api/transactions');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    logger.info(`Creating transaction for user: ${userId}`, { body });

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

    logger.info(`Transaction created with ID: ${transaction.id} for user: ${userId}`);
    return NextResponse.json(transaction);
  } catch (error) {
    logger.error(`Transaction POST error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
