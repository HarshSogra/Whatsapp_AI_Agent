import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/whatsapp.service';
import { generateAIResponse, classifyIntentAI } from '../services/ai.service';
import { prisma } from '../index';

// Helper: Detect High Intent (Keywords)
function detectIntent(message: string): "HIGH" | "LOW" {
  const HIGH_INTENT_KEYWORDS = [
    "fee",
    "fees",
    "admission",
    "join",
    "enroll",
    "demo",
    "price",
    "cost",
    "discount",
    "seat",
    "register",
    "registration",
    "admission open",
    "how to join",
    "course fee",
    "batch fee",
    "when starts",
    "start date"
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

// Helper: Get or Create Student (Auto-Lead Capture)
async function getOrCreateStudent(instituteId: string, phone: string) {
  let student = await prisma.student.findUnique({
    where: {
      instituteId_phone: { instituteId, phone }
    }
  });

  if (!student) {
    console.log(`Creating new student record for: ${phone}`);
    student = await prisma.student.create({
      data: {
        instituteId,
        phone,
        name: `User ${phone.slice(-4)}`, // Basic placeholder name
        status: 'COLD'
      }
    });
  }
  return student;
}

// Helper: Get recent messages for context
async function getRecentMessages(studentId: string, limit: number = 10) {
  return await prisma.message.findMany({
    where: { studentId },
    orderBy: { timestamp: 'desc' },
    take: limit
  }).then(msgs => msgs.reverse()); // Oldest first for AI
}

// Helper: Save message to DB
async function saveMessage(params: { studentId: string, phoneNumber: string, role: string, content: string, intent?: string, whatsappMessageId?: string }) {
  const { studentId, phoneNumber, role, content, intent, whatsappMessageId } = params;
  try {
    await prisma.message.create({
      data: {
        studentId,
        phoneNumber,
        role,
        content,
        intent,
        whatsappMessageId
      }
    });

    // If student replies, reset follow-up count
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
  if (["how to join", "admission process", "register", "enrolment", "enrollment", "how to admission"].some(k => msg.includes(k))) return "STRONG_BUY";
  if (["demo", "trial class", "free class", "attend class"].some(k => msg.includes(k))) return "DEMO";
  if (["fee", "price", "cost", "charge", "payment"].some(k => msg.includes(k))) return "FEE";
  if (["yes", "ok", "interested", "tell me more", "sure", "yeah"].some(k => msg.includes(k))) return "POSITIVE";
  
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
      // Course specific fee detection (hardcoded defaults based on user feedback)
      let feeInfo = "Our courses start from ₹30,000 depending on the program 😊";
      if (msg.includes("jee")) feeInfo = "The JEE course fee is ₹50,000. We also have limited-time scholarship available 😊";
      else if (msg.includes("neet")) feeInfo = "The NEET course fee is ₹55,000. We also have limited-time scholarship available 😊";
      else if (msg.includes("foundation")) feeInfo = "The Foundation course fee is ₹25,000. We also have limited-time scholarship available 😊";
      
      response = `${feeInfo}\nWould you like to attend a demo or reserve a seat?`;
      leadStatus = "WARM";
      break;
      
    case "STRONG_BUY":
      response = "You can easily join by completing a quick registration. I can connect you with our team right away or guide you here.";
      leadStatus = "HOT";
      alertTitle = "🔥 HOT LEAD - Admission Enquiry";
      break;
      
    case "CALL":
      const contactNum = institute.contactPhoneNumber || institute.adminPhoneNumber;
      
      if (contactNum) {
        // Clean number for wa.me link (remove +, spaces, etc.)
        const cleanNum = contactNum.replace(/\D/g, '');
        
        response = `Sure 😊\nYou can call us directly at +${contactNum}\nOr tap here to chat instantly: https://wa.me/${cleanNum}`;
        
        // Bonus: If user specifically asked for a callback
        if (msg.includes("call me") || msg.includes("callback")) {
          response += "\n\nPlease share your preferred time for a callback 😊";
        }
      } else {
        response = "Our team will contact you shortly 😊";
      }
      
      leadStatus = "HOT";
      alertTitle = "📞 CALLBACK/CALL REQUEST";
      break;
      
    case "NEGATIVE":
      response = "No problem 😊 Feel free to message anytime if you need details.";
      leadStatus = "COLD";
      // No follow-ups for negative intent
      await prisma.student.update({
        where: { id: student.id },
        data: { followUpCount: 2 } // Maxing out to stop further follow-ups
      });
      break;
  }

  if (leadStatus) {
    await prisma.student.update({
      where: { id: student.id },
      data: { leadStatus }
    });

    // AUTO-BOOKING: If student mentioned a time, try to record it
    const timeKeywords = ["pm", "am", "clock", "tomorrow", "today", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const hasTime = timeKeywords.some(k => msg.includes(k));
    
    if (hasTime && intent === "DEMO") {
      try {
        // Try to find the first course to link the booking
        const firstCourse = await prisma.course.findFirst({ where: { instituteId: student.instituteId } });
        if (firstCourse) {
          await prisma.demoBooking.create({
            data: {
              studentId: student.id,
              courseId: firstCourse.id,
              scheduledAt: new Date(), // We store now as a placeholder, admin can see text in logs
              status: "PENDING_CONFIRMATION"
            }
          });
          console.log("Demo Booking Logged ✅");
        }
      } catch (err) {
        console.error("Booking failed:", err);
      }
    }
  }

  return { response, alertTitle };
}

// Helper: Send Alert to Admin
async function sendAdminAlert(params: { adminPhoneNumber: string, studentPhone: string, message: string, title?: string, token?: string, phoneId?: string }) {
  const { adminPhoneNumber, studentPhone, message, title, token, phoneId } = params;
  const displayTitle = title || "🚀 *New Student Enquiry (High Intent)*";
  
  const alertText = `${displayTitle}\n\n*Phone:* +${studentPhone}\n*Message:* ${message}\n*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  try {
    console.log(`Sending Admin Alert to ${adminPhoneNumber}...`);
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

      // Discard invalid messages or non-text messages early
      if (!message || !message.text?.body) {
        return res.sendStatus(200);
      }

      // 1. Acknowledge immediately to stop Meta from retrying (which causes multiple bubbles)
      res.sendStatus(200);

      // 2. Process logic asynchronously
      (async () => {
        try {
          const from = message.from;
          const msg_body = message.text.body;
          const msg_id = message.id;
          const metadata = value.metadata;
          const phoneNumberId = metadata.phone_number_id;

          // Deduplication Check
          const existingMessage = await prisma.message.findUnique({
            where: { whatsappMessageId: msg_id }
          });

          if (existingMessage) {
            console.log(`Ignoring duplicate message: ${msg_id}`);
            return;
          }

          console.log(`Processing Message -> PhoneID: ${phoneNumberId}, Sender: ${from}, Content: "${msg_body}", ID: ${msg_id}`);

          // Resolve Institute from database
          const institute = await prisma.institute.findUnique({
            where: { whatsappPhoneNumberId: phoneNumberId },
            include: { 
              courses: true,
              faculty: true
            }
          });

          if (!institute) {
            console.error(`ERROR: No institute found for WhatsApp Phone ID: ${phoneNumberId}`);
            return;
          }

          // 1.5 Auto-Lead Capture and History Fetching
          const student = await getOrCreateStudent(institute.id, from);
          const history = await getRecentMessages(student.id, 10);

          // 1.8 Intent Detection & Admin Alert
          let finalIntentIsHigh = false;
          let closingResponse = "";
          let closingAlertTitle = "";

          const keywordIntent = detectIntent(msg_body);
          finalIntentIsHigh = keywordIntent === "HIGH";

          // If Keywords fail, ask AI for "Smart Detection"
          if (!finalIntentIsHigh) {
            finalIntentIsHigh = await classifyIntentAI(msg_body);
          }

          // 1.9 Closing Flow Detection
          const closingResult = await handleClosingFlow(student, msg_body, institute);
          closingResponse = closingResult.response;
          closingAlertTitle = closingResult.alertTitle;

          if (finalIntentIsHigh && institute.adminPhoneNumber) {
            sendAdminAlert({
              adminPhoneNumber: institute.adminPhoneNumber,
              studentPhone: from,
              message: msg_body,
              title: closingAlertTitle,
              token: institute.whatsappAccessToken || undefined,
              phoneId: phoneNumberId
            });
          }

          // Save incoming user message
          await saveMessage({ 
            studentId: student.id, 
            phoneNumber: from, 
            role: 'user', 
            content: msg_body, 
            intent: finalIntentIsHigh ? 'HIGH' : 'LOW',
            whatsappMessageId: msg_id
          });

          // Prepare context for AI
          const context = {
            name: institute.name,
            location: institute.address || "Lucknow, India", // Default if not found
            courses: institute.courses.map(c => ({ name: c.name, fees: c.fees, duration: c.duration })),
            faculty: institute.faculty.map(f => ({ name: f.name, subject: f.subject, exp: f.experience })),
            systemPrompt: institute.aiSystemPrompt
          };

          // 2. Response Generation
          let finalResponse = closingResponse;
          
          if (!finalResponse) {
            finalResponse = await generateAIResponse(msg_body, history, context) || "";
          }

          // 3. Sending the WhatsApp Reply
          if (finalResponse) {
            await sendWhatsAppMessage({ 
              to: from, 
              message: finalResponse,
              token: institute.whatsappAccessToken || undefined,
              phoneId: phoneNumberId
            });
            await saveMessage({ 
              studentId: student.id, 
              phoneNumber: from, 
              role: 'assistant', 
              content: finalResponse 
            });
          }
        } catch (innerError) {
          console.error('Async Webhook Processing Error:', innerError);
        }
      })();
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('CRITICAL Webhook Handler Error:', error);
    if (!res.headersSent) res.sendStatus(500);
  }
};
