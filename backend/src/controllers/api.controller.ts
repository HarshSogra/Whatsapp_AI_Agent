import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, instituteId: user.instituteId, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { instituteId: (req as any).user.instituteId },
      include: { bookings: true, messages: { orderBy: { timestamp: 'asc' } } }
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { instituteId: (req as any).user.instituteId }
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
