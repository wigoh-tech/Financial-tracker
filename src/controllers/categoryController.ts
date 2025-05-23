// controllers/categoryController.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function getCategories() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await prisma.category.findMany({ where: { userId } });
  return NextResponse.json(categories);
}

export async function createCategory(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      type: body.type,
      monthlyTarget: parseFloat(body.monthlyTarget),
      userId,
    },
  });

  return NextResponse.json(category);
}
