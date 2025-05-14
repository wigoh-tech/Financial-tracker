import { sendBudgetRevenueAlert } from '@/controllers/checkDue';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sendBudgetRevenueAlert();
    return NextResponse.json({ message: 'Budget alert checked.' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send budget alert' }, { status: 500 });
  }
}
 