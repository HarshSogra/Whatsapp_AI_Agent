import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, fees, duration } = req.body;
    const course = await prisma.course.create({
      data: {
        name,
        description,
        fees: Number(fees),
        duration,
        instituteId: (req as any).user.instituteId,
      },
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, fees, duration } = req.body;
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course || course.instituteId !== (req as any).user.instituteId) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { name, description, fees: fees !== undefined ? Number(fees) : undefined, duration },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course || course.instituteId !== (req as any).user.instituteId) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
