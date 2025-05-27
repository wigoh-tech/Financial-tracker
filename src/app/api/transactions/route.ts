import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import logger from '@/lib/logger';

// Helper: Start of current month
function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to GET /api/transactions');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info(`Fetching transactions for user: ${userId}`);

    // Step 1: Find recurring monthly transactions (templates)
    const recurringTemplates = await prisma.transaction.findMany({
      where: {
        userId,
        isRecurring: true,
        recurrence: 'monthly',
      },
    });

    const startOfThisMonth = getStartOfMonth();

    // Step 2: For each template, check if transaction for this month exists, else create it
    for (const template of recurringTemplates) {
      const existing = await prisma.transaction.findFirst({
        where: {
          userId,
          categoryId: template.categoryId,
          description: template.description,
          type: template.type,
          dueDate: {
            gte: startOfThisMonth,
            lt: new Date(startOfThisMonth.getFullYear(), startOfThisMonth.getMonth() + 1, 1),
          },
        },
      });

      if (!existing) {
        logger.info(`Creating recurring transaction for user ${userId} for month ${startOfThisMonth.toISOString()}`);

        await prisma.transaction.create({
          data: {
            amount: template.amount,
            description: template.description,
            dueDate: startOfThisMonth,
            type: template.type,
            categoryId: template.categoryId,
            isRecurring: true,
            recurrence: 'monthly',
            userId,
          },
        });
      }
    }

    // Step 3: Fetch and return all transactions
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
      include: { category: true },
    });

    logger.info(`Transaction created with ID: ${transaction.id} for user: ${userId}`);

    // Check if amount exceeds category monthlyTarget
    if (
      transaction.type === 'expense' &&
      transaction.category &&
      transaction.amount > transaction.category.monthlyTarget
    ) {
      logger.warn(`Transaction amount ${transaction.amount} exceeds category target ${transaction.category.monthlyTarget}`);
      // Return a flag so frontend can show alert
      return NextResponse.json(
        { transaction, alert: `Warning: Transaction amount exceeds monthly target of ₹${transaction.category.monthlyTarget}` },
        { status: 201 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    logger.error(`Transaction POST error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
