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
      res.status(200).send(challenge);
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

    // 1. Detailed Logging of the Incoming payload
    console.log('--- Incoming Webhook Event ---');
    console.log('Full Payload:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      console.log("Valid WhatsApp event received ✅");
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const metadata = value?.metadata;
      const message = value?.messages?.[0];

      if (message && metadata?.phone_number_id) {
        const from = message.from; 
        const msg_body = message.text?.body;
        const phoneNumberId = metadata.phone_number_id;

        console.log(`Routing Message -> PhoneID: ${phoneNumberId}, Sender: ${from}, Content: "${msg_body}"`);

        // Resolve Institute from database
        const institute = await prisma.institute.findUnique({
          where: { whatsappPhoneNumberId: phoneNumberId },
          include: { courses: true }
        });

        if (!institute) {
          console.error(`ERROR: No institute found for WhatsApp Phone ID: ${phoneNumberId}`);
          return res.sendStatus(200); // Still return 200 to Meta to avoid retries
        }

        console.log(`Institute Resolved: ${institute.name}`);

        // Prepare context for AI
        const context = {
          name: institute.name,
          courses: institute.courses.map(c => ({ name: c.name, fees: c.fees })),
          systemPrompt: institute.aiSystemPrompt
        };

        // 2. AI Response Generation
        let aiResponse = "";
        try {
          console.log(`Generating AI response for ${institute.name}...`);
          aiResponse = await generateAIResponse(msg_body, context) || "";
          console.log(`AI Success -> Response: "${aiResponse}"`);
        } catch (aiError) {
          console.error("AI Generation ERROR:", aiError);
          aiResponse = "I'm having a brief issue processing that. Please try again in 30 seconds.";
        }

        // 3. Sending the WhatsApp Reply
        if (aiResponse) {
          try {
            console.log(`Sending WhatsApp message to ${from}...`);
            await sendWhatsAppMessage(from, aiResponse);
            console.log("WhatsApp Send SUCCESS");
          } catch (whatsappError) {
            console.error("WhatsApp API ERROR:", whatsappError);
          }
        }
      } else {
        console.log("Payload ignored: Missing message or metadata.");
      }
      return res.sendStatus(200);
    } else {
      console.log("Payload rejected: Not a 'whatsapp_business_account' object.");
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error('CRITICAL Webhook Handler Error:', error);
    return res.sendStatus(500);
  }
};
