import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import webhookRoutes from './routes/webhook.routes';
import apiRoutes from './routes/api.routes';
import { initCronJobs } from './services/cron.service';

import { buildAdminRouter } from './admin/admin.config';

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Required for AdminJS if using default helmet
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

async function start() {
  // Mount AdminJS
  const adminRouter = await buildAdminRouter();
  app.use('/admin', adminRouter);

  // Routes
  app.use('/webhook', webhookRoutes);
  app.use('/api', apiRoutes);

  // Initialize Schedulers
  initCronJobs();

  // Basic health check
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
      console.log(`Admin dashboard available at http://localhost:${PORT}/admin`);
    });
  }
}

start().catch(err => {
  console.error("Failed to start server:", err);
});

export default app;