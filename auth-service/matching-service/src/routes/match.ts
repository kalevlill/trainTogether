import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

type Params = { userId: string };

const getUserMatches: RequestHandler<{ userId: string }> = async (req, res): Promise<void> => {
  const { userId } = req.params;

 const currentUser = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    sports: {
      include: {
        sport: true, 
      },
    },
  },
})

  if (!currentUser) {
    res.status(404).json({ error: 'User nicht gefunden' });
  }

  const matches = await prisma.user.findMany({
  where: {
    id: { not: userId },
    sports: {
      some: {
        sport: {
          name: {
            in: currentUser!.sports.map((s: any) => s.sport.name),
          },
        },
      },
    },
  },
  select: {
    id: true,
    name: true,
    email: true,
    location: true,
    level: true,
    sports: true,
  },
});
  res.json(matches);
};

router.get('/:userId', getUserMatches);

export default router;
