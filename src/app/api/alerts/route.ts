// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  const today = new Date();
  const threeDaysFromNow = addDays(today, 3);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // 1. Upcoming Due (unpaid, within 3 days)
  const upcomingDue = await prisma.transaction.findMany({
    where: {
      isPaid: false,
      dueDate: {
        lte: threeDaysFromNow,
        gte: today,
      },
    },
    include: { category: true },
  });
  
  // 2. Budget Exceeded (category-wise)
  const categories = await prisma.category.findMany({
    include: { transactions: true },
  });
  
  const budgetExceeded = categories
    .filter(cat => cat.monthlyTarget && cat.type === 'expense')
    .map(cat => {
      const total = cat.transactions
        .filter(tx =>
          tx.dueDate &&
          tx.dueDate >= monthStart &&
          tx.dueDate <= monthEnd
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
  
      return {
        id: cat.id,
        name: cat.name,
        spent: total,
        budget: cat.monthlyTarget,
      };
    })
    .filter(cat => cat.spent > cat.budget);
  
  // 3. Revenue Shortfall (< 80% of income goal)
  const incomeGoal = 5000;
  const incomeThisMonth = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      type: 'income',
      dueDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });
  
  const revenueShortfall = (incomeThisMonth._sum.amount ?? 0) < incomeGoal * 0.8;
  
  return NextResponse.json({
    upcomingDue,
    budgetExceeded,
    revenueShortfall,
    income: incomeThisMonth._sum.amount || 0,
  });
}