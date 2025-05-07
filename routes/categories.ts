import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', verifyToken, async (req, res) => {
  const { name, type, monthlyTarget } = req.body;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        type,

        monthlyTarget,
        createdById: req.user!.id,
      },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { createdById: req.user!.id },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
