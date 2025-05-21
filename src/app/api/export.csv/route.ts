// File: src/app/api/export/route.ts

import { PrismaClient } from '@prisma/client';
import { format } from '@fast-csv/format';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');

  if (!month) {
    return new Response('Missing "month" query parameter', { status: 400 });
  }

  const [year, mon] = month.split('-').map(Number);
  const startDate = new Date(year, mon - 1, 1);
  const endDate = new Date(year, mon, 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      dueDate: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      category: true,
    },
  });

  // 1. Prepare file path
  const filename = `transactions-${month}.csv`;
  const filePath = path.join('/tmp', filename); // Using OS tmp dir is good for serverless

  // 2. Write to file using createWriteStream
  const ws = fs.createWriteStream(filePath);
  const csvStream = format({ headers: true });

  for (const tx of transactions) {
    csvStream.write({
      ID: tx.id,
      Amount: tx.amount,
      Description: tx.description,
      Type: tx.type,
      Category: tx.category?.name || 'N/A',
      DueDate: tx.dueDate.toISOString().split('T')[0],
      IsPaid: tx.isPaid ? 'Yes' : 'No',
      Recurring: tx.isRecurring ? tx.recurrence || 'Yes' : 'No',
    });
  }

  csvStream.end();

  // Wait for file to finish writing before reading it
  await new Promise<void>(resolve => {
    ws.on('finish', () => resolve());
    csvStream.pipe(ws);
  });

  // 3. Read file back as stream
  const fileStream = fs.createReadStream(filePath);
  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of fileStream) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
