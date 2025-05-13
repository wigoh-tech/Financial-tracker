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
import { prisma } from '@/lib/db';

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      type: body.type,
      monthlyTarget: parseFloat(body.monthlyTarget),
    },
  });
  return NextResponse.json(category);
}
