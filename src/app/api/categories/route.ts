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

    logger.info(`Fetching categories for user: ${userId}`);

    const categories = await prisma.category.findMany({
      where: { userId },
    });

    logger.info(`Found ${categories.length} categories`);
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
    logger.info(`Creating category for user ${userId}: ${JSON.stringify(body)}`);

    const category = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        monthlyTarget: parseFloat(body.monthlyTarget),
        userId,
      },
    });

    logger.info(`Category created: ${category.id}`);
    return NextResponse.json(category);
  } catch (error) {
    logger.error(`POST /api/categories failed: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



