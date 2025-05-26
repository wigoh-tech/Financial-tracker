import { prisma } from '../lib/db';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import { sendEmail } from '../lib/emailService';

dotenv.config();

export async function checkDueTransactionsAndNotify() {
  const today = dayjs().startOf('day').toDate();
  const threeDaysFromNow = dayjs().add(3, 'day').endOf('day').toDate();

  const dueTransactions = await prisma.transaction.findMany({
    where: {
      dueDate: {
        gte: today,
        lte: threeDaysFromNow,
      },
      isPaid: false,
    },
  });

  for (const tx of dueTransactions) {
    await sendEmail({
      to: 'urssriniforever14@gmail.com',
      subject: '💰 Payment Due Reminder',
      text: `You have a payment of ₹${tx.amount} due.\nDescription: ${tx.description}\nDue Date: ${tx.dueDate.toDateString()}`,
    });
  }

  console.log(`Reminders sent for ${dueTransactions.length} transactions`);
}

export async function sendBudgetRevenueAlert() {
  const today = new Date();
  const categories = await prisma.category.findMany({ include: { transactions: true } });

  const breaches: { category: string; spent: number; budget: number }[] = [];
  let totalIncome = 0;

  for (const cat of categories) {
    const sum = cat.transactions.reduce((acc, t) => acc + t.amount, 0);
    if (cat.type === 'expense' && cat.monthlyTarget && sum > cat.monthlyTarget) {
      breaches.push({ category: cat.name, spent: sum, budget: cat.monthlyTarget });
    }
    if (cat.type === 'income') {
      totalIncome += sum;
    }
  }

  const goal = parseFloat(process.env.REVENUE_GOAL || '10000');
  const revenueAlert = totalIncome < 0.8 * goal;

  if (breaches.length || revenueAlert) {
    let html = `<h2>📊 Budget Alert Summary</h2>`;

    if (breaches.length) {
      html += `<h3>🔴 Categories over budget:</h3><ul>`;
      breaches.forEach(b => {
        html += `<li>${b.category}: Spent ₹${b.spent} / Budget ₹${b.budget}</li>`;
      });
      html += `</ul>`;
    }

    if (revenueAlert) {
      html += `<h3>🟡 Revenue Below Goal</h3><p>Income: ₹${totalIncome} / Goal: ₹${goal}</p>`;
    }

    await sendEmail({
      to: 'urssriniforever14@gmail.com',
      subject: '📢 Budget and Revenue Alert',
      html,
    });

    console.log('Budget/revenue alerts sent.');
  } else {
    console.log('✅ No budget/revenue alerts needed today.');
  }
}
