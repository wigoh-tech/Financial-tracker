// // app/api/categories/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';

// export async function GET() {
//   const categories = await prisma.category.findMany();
//   return NextResponse.json(categories);
// }

// export async function POST(req: Request) {
//   const body = await req.json();
//   const category = await prisma.category.create({
//     data: { name: body.name },
//   });
//   return NextResponse.json(category);
// }
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to GET /api/categories');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const categories = await prisma.category.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    logger.error(`GET /api/categories failed: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized access to POST /api/categories');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, monthlyTarget } = body;

    // Prevent duplicate use of predefined category this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'This category already exists for this month' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        monthlyTarget: parseFloat(monthlyTarget),
        userId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    logger.error(`POST /api/categories failed: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
