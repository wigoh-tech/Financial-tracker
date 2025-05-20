import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = await Promise.resolve(context);
  const id = parseInt(params.id);

  const { isPaid } = await req.json();

  if (isNaN(id) || typeof isPaid !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Optional: Fetch transaction to confirm it exists
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Reuse isPaid field for both income and expense
    const updated = await prisma.transaction.update({
      where: { id },
      data: { isPaid },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
