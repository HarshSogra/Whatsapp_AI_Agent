import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import webhookRoutes from './routes/webhook.routes';
import apiRoutes from './routes/api.routes';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import { initCronJobs } from './services/cron.service';

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Initialize Schedulers
initCronJobs();

// Basic health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Startup Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;