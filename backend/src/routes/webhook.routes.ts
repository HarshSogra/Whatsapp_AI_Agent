import { Router } from 'express';
import { verifyWebhook, handleIncomingMessage } from '../controllers/webhook.controller';

const router = Router();

router.get('/', verifyWebhook);
router.post('/', handleIncomingMessage);

export default router;
