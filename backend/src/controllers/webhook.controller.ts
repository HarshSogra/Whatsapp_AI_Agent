import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/whatsapp.service';
import { generateAIResponse } from '../services/ai.service';
import { prisma } from '../index';

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).json(Number(challenge));
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

export const handleIncomingMessage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const from = body.entry[0].changes[0].value.messages[0].from; 
        const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

        // Retrieve dynamic context (Dummy values for MVP initialization step)
        const mockContext = {
          name: "Bright Futures Coaching",
          courses: [
             { name: "JEE Mains Foundation", fees: "50,000 INR" }, 
             { name: "NEET Crash Course", fees: "60,000 INR" }
          ]
        };

        // Get AI Response
        const aiResponse = await generateAIResponse(msg_body, mockContext);

        // Send Reply
        if (aiResponse) {
           await sendWhatsAppMessage(from, aiResponse);
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};
