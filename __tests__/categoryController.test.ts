
import { getCategories, createCategory } from '@/controllers/categoryController';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/db', () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));


describe('Category Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no userId on GET', async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: null });
    const res = await getCategories();
    expect(res.status).toBe(401);
  });

  it('should return categories for authenticated user', async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: 'user_123' });
    (prisma.category.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: 'Food' }]);
    const res = await getCategories();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual([{ id: 1, name: 'Food' }]);
  });

  it('should create category for authenticated user', async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: 'user_123' });
    const mockRequest = {
      json: async () => ({
        name: 'Bills',
        type: 'expense',
        monthlyTarget: '100.00',
      }),
    } as unknown as Request;

    (prisma.category.create as jest.Mock).mockResolvedValue({
      id: 2, name: 'Bills', type: 'expense', monthlyTarget: 100.00,
    });

    const res = await createCategory(mockRequest);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.name).toBe('Bills');
  });
});
