import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to GET /api/dashboard');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info(`Generating dashboard data for user: ${userId}`);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Revenue & Expenses
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
    logger.info(`Revenue: ${totalRevenue._sum.amount || 0}, Expenses: ${totalExpenses._sum.amount || 0}`);

    // Monthly Trends
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

    // Category Breakdown
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

    logger.info(`Dashboard data prepared for user: ${userId}`);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      netProfit: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      monthlyTrends,
      categoryBreakdown: breakdown,
    });

  } catch (error) {
    logger.error(`Dashboard error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
