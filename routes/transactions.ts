// import { Router } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { verifyToken } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// router.post('/', verifyToken, async (req, res) => {
//   const { amount, description, dueDate, status, isRecurring, type, categoryId } = req.body;

//   try {
//     const transaction = await prisma.transaction.create({
//       data: {
//         amount,
//         description,
//         dueDate: dueDate ? new Date(dueDate) : null,
//         status,
//         isRecurring,
//         type,
//         userId: req.user!.id,
//         categoryId,
//       },
//     });
//     res.json(transaction);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// });

// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const transactions = await prisma.transaction.findMany({
//       where: { userId: req.user!.id },
//       include: { category: true },
//     });
//     res.json(transactions);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// });

// export default router;

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';


const router = Router();
const prisma = new PrismaClient();

// POST /transactions - create new transaction
router.post('/', verifyToken, async (req, res) => {
  const {
    amount,
    description,
    dueDate,
    status = 'due',
    isRecurring = false,
    type,
    categoryId,
  } = req.body;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        isRecurring,
        type,
        userId: req.user!.id,      // From JWT middleware
        categoryId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /transactions - fetch user-specific transactions
router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        category: true, 
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

