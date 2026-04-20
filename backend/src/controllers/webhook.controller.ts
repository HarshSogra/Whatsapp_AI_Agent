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
async function saveMessage(studentId: string, phoneNumber: string, role: string, content: string, intent?: string) {
  try {
    await prisma.message.create({
      data: {
        studentId,
        phoneNumber,
        role,
        content,
        intent
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
  }

  return { response, alertTitle };
}

// Helper: Send Alert to Admin
async function sendAdminAlert(params: { adminPhoneNumber: string, studentPhone: string, message: string, title?: string }) {
  const { adminPhoneNumber, studentPhone, message, title } = params;
  const displayTitle = title || "🚀 *New Student Enquiry (High Intent)*";
  
  const alertText = `${displayTitle}\n\n*Phone:* +${studentPhone}\n*Message:* ${message}\n*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  try {
    console.log(`Sending Admin Alert to ${adminPhoneNumber}...`);
    await sendWhatsAppMessage(adminPhoneNumber, alertText);
  } catch (error) {
    console.error("Admin Alert Delivery Failed:", error);
  }
}

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
          return res.sendStatus(200);
        }

        console.log(`Institute Resolved: ${institute.name}`);

        // 1.5 Auto-Lead Capture and History Fetching
        const student = await getOrCreateStudent(institute.id, from);
        const history = await getRecentMessages(student.id, 10);

        // 1.8 Intent Detection & Admin Alert
        let finalIntentIsHigh = false;
        let closingResponse = "";
        let closingAlertTitle = "";

        if (msg_body) {
           const keywordIntent = detectIntent(msg_body);
           console.log(`Keyword Intent Detection: ${keywordIntent}`);

           finalIntentIsHigh = keywordIntent === "HIGH";

           // If Keywords fail, ask AI for "Smart Detection"
           if (!finalIntentIsHigh) {
              console.log("Low keyword intent. Asking AI for Smart Classification...");
              finalIntentIsHigh = await classifyIntentAI(msg_body);
              console.log(`AI Smart Intent Detection: ${finalIntentIsHigh ? "HIGH" : "LOW"}`);
           }

           // 1.9 Closing Flow Detection (Deterministic Conversion Logic)
           const closingResult = await handleClosingFlow(student, msg_body, institute);
           closingResponse = closingResult.response;
           closingAlertTitle = closingResult.alertTitle;

           if (finalIntentIsHigh && institute.adminPhoneNumber) {
             sendAdminAlert({
               adminPhoneNumber: institute.adminPhoneNumber,
               studentPhone: from,
               message: msg_body,
               title: closingAlertTitle // Pass specific title if Demo/Buy intent found
             });
           }
        }

        // Save incoming user message with detected intent
        await saveMessage(student.id, from, 'user', msg_body, finalIntentIsHigh ? 'HIGH' : 'LOW');

        // Prepare context for AI
        const context = {
          name: institute.name,
          courses: institute.courses.map(c => ({ name: c.name, fees: c.fees })),
          systemPrompt: institute.aiSystemPrompt
        };

        // 2. Response Generation (Closing Flow Override vs AI Fallback)
        let finalResponse = closingResponse; // Override with Closing Flow if available
        
        if (!finalResponse) {
          try {
            console.log(`Generating AI response for ${institute.name} with history (${history.length} msgs)...`);
            finalResponse = await generateAIResponse(msg_body, history, context) || "";
            console.log(`AI Success -> Response: "${finalResponse}"`);
          } catch (aiError) {
            console.error("AI Generation ERROR:", aiError);
            finalResponse = "I'm having a brief issue processing that. Please try again in 30 seconds.";
          }
        } else {
          console.log(`Closing Flow Triggered -> Response: "${finalResponse}"`);
        }

        // 3. Sending the WhatsApp Reply
        if (finalResponse) {
          try {
            console.log(`Sending WhatsApp message to ${from}...`);
            await sendWhatsAppMessage(from, finalResponse);
            console.log("WhatsApp Send SUCCESS");

            // Save response to DB
            await saveMessage(student.id, from, 'assistant', finalResponse);
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
