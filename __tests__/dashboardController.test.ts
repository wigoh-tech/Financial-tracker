import { getDashboardData } from '@/controllers/dashboardController';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
    },
  },
}));
describe('Dashboard Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if not authenticated', async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: null });

    const res = await getDashboardData();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: 'Unauthorized' });
  });

  it('returns total income and expenses for authenticated user', async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user_123' });

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([
      { amount: 100, type: 'income' },
      { amount: 40, type: 'expense' },
      { amount: 60, type: 'income' },
      { amount: 20, type: 'expense' },
    ]);

    const res = await getDashboardData();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      totalIncome: 160,
      totalExpense: 60,
    });
  });
});
