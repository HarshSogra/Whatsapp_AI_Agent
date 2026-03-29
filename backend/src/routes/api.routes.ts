import { Router } from 'express';
import { login, getStudents, getCourses } from '../controllers/api.controller';
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

router.post('/auth/login', login);
router.get('/students', authMiddleware, getStudents);
router.get('/courses', authMiddleware, getCourses);

export default router;
