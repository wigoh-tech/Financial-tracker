import { NextResponse } from 'next/server';
import { checkDueTransactionsAndNotify } from '@/controllers/checkDue';

export async function GET() {
  try {
    const count = await checkDueTransactionsAndNotify();
    return NextResponse.json({ message: `Sent reminders for ${count} transactions.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}
