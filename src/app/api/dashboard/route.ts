// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust this import if different
import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET() {
  const now = new Date();

  // Total revenue & expenses
  const [totalRevenue, totalExpenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: 'revenue' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: 'expense' },
      _sum: { amount: true },
    }),
  ]);

  // Monthly trends (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyTrendsRaw = await prisma.transaction.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: {
      amount: true,
      type: true,
      createdAt: true,
    },
  });

  // Process into month buckets
  const trendsMap: Record<string, { revenue: number; expense: number }> = {};
  monthlyTrendsRaw.forEach((tx) => {
    const month = format(tx.createdAt, 'yyyy-dd-MM');
    if (!trendsMap[month]) trendsMap[month] = { revenue: 0, expense: 0 };
    trendsMap[month][tx.type as 'revenue' | 'expense'] += tx.amount;
  });

  const monthlyTrends = Object.entries(trendsMap).map(([month, data]) => ({
    month,
    ...data,
  }));

  // Category breakdown
  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: {},
  });

  const categories = await prisma.category.findMany();
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
