import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export async function GET() {
  const { userId } =  await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();

  const [totalRevenue, totalExpenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: 'revenue', userId },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: 'expense', userId },
      _sum: { amount: true },
    }),
  ]);

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyTrendsRaw = await prisma.transaction.findMany({
    where: { createdAt: { gte: sixMonthsAgo }, userId },
    select: { amount: true, type: true, createdAt: true },
  });

  const trendsMap: Record<string, { revenue: number; expense: number }> = {};
  monthlyTrendsRaw.forEach((tx) => {
    const month = format(tx.createdAt, 'yyyy-MM');
    if (!trendsMap[month]) trendsMap[month] = { revenue: 0, expense: 0 };
    trendsMap[month][tx.type as 'revenue' | 'expense'] += tx.amount;
  });

  const monthlyTrends = Object.entries(trendsMap).map(([month, data]) => ({
    month,
    ...data,
  }));

  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: { userId },
  });

  const categories = await prisma.category.findMany({ where: { userId } });
  const breakdown = categoryBreakdown.map((item) => {
    const cat = categories.find((c) => c.id === item.categoryId);
    return {
      category: cat?.name || 'Unknown',
      amount: item._sum.amount || 0,
      type: cat?.type || 'unknown',
    };
  });

  return NextResponse.json({
    totalRevenue: totalRevenue._sum.amount || 0,
    totalExpenses: totalExpenses._sum.amount || 0,
    netProfit: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0),
    monthlyTrends,
    categoryBreakdown: breakdown,
  });
}
