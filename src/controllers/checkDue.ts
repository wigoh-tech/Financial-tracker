import { prisma } from '../lib/db';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import dotenv from 'dotenv';

dotenv.config(); // Load env vars if not already

// Configure nodemailer with your email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,          // 🔒 hardcoded sender email
    pass: process.env.MAIL_PASS,     // ⛔ keep password in .env
  },
});

export async function checkDueTransactionsAndNotify() {
  const today = dayjs().startOf('day').toDate();

  // Find transactions that are due and unpaid
  const dueTransactions = await prisma.transaction.findMany({
    where: {
      dueDate: { lte: today },
      isPaid: false,
    },
  });

  for (const tx of dueTransactions) {
    await transporter.sendMail({
      to: 'shreenusri@gmail.com', // ✅ your email to receive all reminders
      subject: '💰 Payment Due Reminder',
      text: `You have a payment of $${tx.amount} due.\nDescription: ${tx.description}\nDue Date: ${tx.dueDate.toDateString()}`,
    });
  }

  console.log(`Reminders sent for ${dueTransactions.length} transactions`);
}
