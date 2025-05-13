// Removed duplicate import of checkDueTransactionsAndNotify
// scripts/cron.ts
import 'dotenv/config';
import cron from 'node-cron';

import {checkDueTransactionsAndNotify} from '../controllers/checkDue';


 
cron.schedule('* * * * *', async () => {
  console.log('[CRON] Running daily due check...');
  console.log(`[CRON] Job executed at ${new Date().toISOString()}`);

  await checkDueTransactionsAndNotify();
});

