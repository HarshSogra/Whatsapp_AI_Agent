import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/whatsapp.service';
import { generateAIResponse, classifyIntentAI } from '../services/ai.service';
import { prisma } from '../index';

// Helper: Detect High Intent (Keywords)
function detectIntent(message: string): "HIGH" | "LOW" {
  const HIGH_INTENT_KEYWORDS = [
    "fee", "fees", "admission", "join", "enroll", "demo", "price", "cost", "discount", "seat", "register", "registration", 
    "admission open", "how to join", "course fee", "batch fee", "when starts", "start date"
  ];

  const lowerMsg = message.toLowerCase();
  const hasKeyword = HIGH_INTENT_KEYWORDS.some(word => lowerMsg.includes(word));

  return hasKeyword ? "HIGH" : "LOW";
}

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

async function getOrCreateStudent(instituteId: string, phone: string) {
  let student = await prisma.student.findUnique({
    where: { instituteId_phone: { instituteId, phone } }
  });

  if (!student) {
    student = await prisma.student.create({
      data: { instituteId, phone, name: `User ${phone.slice(-4)}`, status: 'COLD' }
    });
  }
  return student;
}

async function getRecentMessages(studentId: string, limit: number = 10) {
  return await prisma.message.findMany({
    where: { studentId },
    orderBy: { timestamp: 'desc' },
    take: limit
  }).then(msgs => msgs.reverse());
}

async function saveMessage(params: { studentId: string, phoneNumber: string, role: string, content: string, intent?: string, whatsappMessageId?: string }) {
  const { studentId, phoneNumber, role, content, intent, whatsappMessageId } = params;
  try {
    await prisma.message.create({
      data: { studentId, phoneNumber, role, content, intent, whatsappMessageId }
    });

    if (role === 'user') {
      await prisma.student.update({
        where: { id: studentId },
        data: { 
          followUpCount: 0,
          ...(intent === 'HIGH' && { lastHighIntentAt: new Date() })
        }
      });
    }
  } catch (error) {
    console.error(`Failed to save ${role} message:`, error);
  }
}

type ClosingIntent = "POSITIVE" | "DEMO" | "FEE" | "STRONG_BUY" | "NEGATIVE" | "CALL" | "UNKNOWN";

function detectClosingIntent(message: string): ClosingIntent {
  const msg = message.toLowerCase();
  if (["no", "not interested", "later", "no thanks", "stop"].some(k => msg.includes(k))) return "NEGATIVE";
  if (["call", "phone", "number", "contact", "talk", "callback"].some(k => msg.includes(k))) return "CALL";
  if (["how to join", "admission process", "register", "enrolment", "enrollment"].some(k => msg.includes(k))) return "STRONG_BUY";
  if (["demo", "trial class", "free class"].some(k => msg.includes(k))) return "DEMO";
  if (["fee", "price", "cost", "charge"].some(k => msg.includes(k))) return "FEE";
  if (["yes", "ok", "interested", "tell me more"].some(k => msg.includes(k))) return "POSITIVE";
  return "UNKNOWN";
}

async function handleClosingFlow(student: any, message: string, institute: any) {
  const intent = detectClosingIntent(message);
  const msg = message.toLowerCase();
  
  let response = "";
  let leadStatus = "";
  let alertTitle = "";

  switch (intent) {
    case "POSITIVE":
      response = "Great 😊 Would you like to attend a free demo class or get full details about fees and batches?";
      leadStatus = "WARM";
      break;
    case "DEMO":
      response = "Perfect 👍 Please share a suitable time for you, or I can arrange a call from our team.";
      leadStatus = "HOT";
      alertTitle = "📅 DEMO REQUEST";
      break;
    case "FEE":
      let feeInfo = "Our courses start from ₹30,000 depending on the program 😊";
      if (msg.includes("jee")) feeInfo = "The JEE course fee is ₹1,20,000 per year. We also have scholarships available 😊";
      else if (msg.includes("neet")) feeInfo = "The NEET course fee is ₹1,10,000 per year. We also have scholarships available 😊";
      response = `${feeInfo}\nWould you like to attend a demo or reserve a seat?`;
      leadStatus = "WARM";
      break;
    case "STRONG_BUY":
      response = "You can join by completing a quick registration. I can connect you with our team right away.";
      leadStatus = "HOT";
      alertTitle = "🔥 HOT LEAD - Admission Enquiry";
      break;
    case "CALL":
      const contactNum = institute.contactPhoneNumber || institute.adminPhoneNumber;
      if (contactNum) {
        const cleanNum = contactNum.replace(/\D/g, '');
        response = `Sure 😊\nYou can call us directly at +${contactNum}\nOr tap here to chat instantly: https://wa.me/${cleanNum}`;
      } else {
        response = "Our team will contact you shortly 😊";
      }
      leadStatus = "HOT";
      alertTitle = "📞 CALLBACK/CALL REQUEST";
      break;
    case "NEGATIVE":
      response = "No problem 😊 Feel free to message anytime if you need details.";
      leadStatus = "COLD";
      await prisma.student.update({ where: { id: student.id }, data: { followUpCount: 2 } });
      break;
  }

  if (leadStatus) {
    await prisma.student.update({ where: { id: student.id }, data: { leadStatus } });
    
    // Auto Booking Capture
    const timeKeywords = ["pm", "am", "clock", "tomorrow", "today"];
    if (timeKeywords.some(k => msg.includes(k)) && intent === "DEMO") {
      const firstCourse = await prisma.course.findFirst({ where: { instituteId: student.instituteId } });
      if (firstCourse) {
        await prisma.demoBooking.create({
          data: { studentId: student.id, courseId: firstCourse.id, scheduledAt: new Date(), status: "PENDING_CONFIRMATION" }
        });
      }
    }
  }

  return { response, alertTitle };
}

async function sendAdminAlert(params: { adminPhoneNumber: string, studentPhone: string, message: string, title?: string, token?: string, phoneId?: string }) {
  const { adminPhoneNumber, studentPhone, message, title, token, phoneId } = params;
  const displayTitle = title || "🚀 *New Student Enquiry (High Intent)*";
  const alertText = `${displayTitle}\n\n*Phone:* +${studentPhone}\n*Message:* ${message}\n*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  try {
    await sendWhatsAppMessage({ to: adminPhoneNumber, message: alertText, token, phoneId });
  } catch (error) {
    console.error("Admin Alert Delivery Failed:", error);
  }
}

export const handleIncomingMessage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (!message || !message.text?.body) return res.sendStatus(200);

      res.sendStatus(200); // Quick Acknowledge

      (async () => {
        try {
          const from = message.from;
          const msg_body = message.text.body;
          const msg_id = message.id;
          const phoneNumberId = value.metadata.phone_number_id;

          const existingMessage = await prisma.message.findUnique({ where: { whatsappMessageId: msg_id } });
          if (existingMessage) return;

          const institute = await prisma.institute.findUnique({
            where: { whatsappPhoneNumberId: phoneNumberId },
            include: { courses: true, faculty: true }
          });

          if (!institute) return;

          const student = await getOrCreateStudent(institute.id, from);
          const history = await getRecentMessages(student.id, 10);

          // Prepare Context
          const context = {
            name: institute.name,
            location: institute.address || "Lucknow, India",
            courses: institute.courses.map(c => ({ name: c.name, fees: c.fees, duration: c.duration })),
            faculty: institute.faculty.map(f => ({ name: f.name, subject: f.subject, exp: f.experience })),
            systemPrompt: institute.aiSystemPrompt
          };

          const keywordIntent = detectIntent(msg_body);
          const closingResult = await handleClosingFlow(student, msg_body, institute);

          // PARALLEL AI PROCESSING
          const [aiIntent, aiAiResponse] = await Promise.all([
            keywordIntent === "HIGH" ? Promise.resolve(true) : classifyIntentAI(msg_body),
            closingResult.response ? Promise.resolve("") : generateAIResponse(msg_body, history, context)
          ]);

          const finalIntentIsHigh = keywordIntent === "HIGH" || aiIntent;
          const finalResponse = closingResult.response || aiAiResponse || "";

          if (finalIntentIsHigh && institute.adminPhoneNumber) {
            sendAdminAlert({
              adminPhoneNumber: institute.adminPhoneNumber,
              studentPhone: from,
              message: msg_body,
              title: closingResult.alertTitle,
              token: institute.whatsappAccessToken || undefined,
              phoneId: phoneNumberId
            });
          }

          await saveMessage({ 
            studentId: student.id, 
            phoneNumber: from, 
            role: 'user', 
            content: msg_body, 
            intent: finalIntentIsHigh ? 'HIGH' : 'LOW',
            whatsappMessageId: msg_id
          });

          if (finalResponse) {
            await sendWhatsAppMessage({ 
              to: from, 
              message: finalResponse,
              token: institute.whatsappAccessToken || undefined,
              phoneId: phoneNumberId
            });
            await saveMessage({ studentId: student.id, phoneNumber: from, role: 'assistant', content: finalResponse });
          }
        } catch (innerError) {
          console.error('Async Webhook Error:', innerError);
        }
      })();
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('CRITICAL Webhook Error:', error);
    if (!res.headersSent) res.sendStatus(500);
  }
};
