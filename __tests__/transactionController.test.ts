import { getTransactions, createTransaction } from '@/controllers/transactionController';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/db');

describe('Transaction Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no userId on GET', async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: null });
    const res = await getTransactions();
    expect(res.status).toBe(401);
  });

  it('should return transactions for authenticated user', async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user_123' });

    const mockTransactions = [
      {
        id: 1,
        amount: 50.0,
        description: 'Groceries',
        dueDate: new Date().toISOString(),
        type: 'expense',
        categoryId: 1,
        isRecurring: false,
        recurrence: null,
        userId: 'user_123',
        category: { id: 1, name: 'Food', type: 'expense' },
        createdAt: new Date().toISOString(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const res = await getTransactions();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(mockTransactions);
  });

  it('should create transaction for authenticated user', async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'user_123' });

    const mockRequest = {
      json: async () => ({
        amount: '25.00',
        description: 'Coffee',
        dueDate: '2025-05-23',
        type: 'expense',
        categoryId: '2',
        isRecurring: true,
        recurrence: 'monthly',
      }),
    } as unknown as Request;

    const createdTransaction = {
      id: 2,
      amount: 25.0,
      description: 'Coffee',
      dueDate: new Date('2025-05-23'),
      type: 'expense',
      categoryId: 2,
      isRecurring: true,
      recurrence: 'monthly',
      userId: 'user_123',
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue(createdTransaction);

    const res = await createTransaction(mockRequest);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.description).toBe('Coffee');
    expect(json.amount).toBe(25.0);
    expect(json.isRecurring).toBe(true);
    expect(json.recurrence).toBe('monthly');
  });
});
