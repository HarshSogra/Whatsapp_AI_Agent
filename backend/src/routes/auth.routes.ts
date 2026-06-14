import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { instituteName, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const institute = await prisma.institute.create({
      data: { name: instituteName },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
        instituteId: institute.id,
      },
    });

    const token = jwt.sign(
      { userId: user.id, instituteId: user.instituteId, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
