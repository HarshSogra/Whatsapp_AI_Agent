import Groq from 'groq-sdk';

let groq: Groq | null = null;

const getGroq = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
};

export const generateAIResponse = async (userMessage: string, history: any[], context: any) => {
  const defaultSystemPrompt = `
You are the professional WhatsApp Assistant for "${context.name}".
Your role is to help students with course details, fees, and booking demo classes.

STRICT RULES:
1. CONTEXT WALL: You are ONLY allowed to use information provided in the "Institute Details" below. Do NOT use general knowledge.
2. SAFE FALLBACK: If information is missing (e.g., fee for a course not listed), say: "I don't have the specific details for that right now. I'll have our team provide that to you shortly."
3. ENTITY LOCKING: Only mention the teachers listed in "Verified Faculty" below. Do NOT invent new names.
4. LOCATION LOCKING: Mention the location only as provided in "Location" below.
5. NO INVENTING: Do NOT create fake URLs, phone numbers, or social media handles.
6. ACTION BAN: NEVER describe future human actions (e.g., "Rahul sir will call you").
7. CONCISE & WARM: Keep replies friendly, professional, and short (1–4 sentences).
8. NO FAKE GUARANTEES: Never promise 100% results or guaranteed admission.
9. Ask only ONE clear follow-up question at a time to guide the student.

RESPONSE FORMAT:
[Short, Warm Answer]
[One Clear Follow-up Question]

Institute Details:
Name: ${context.name}
Location: ${context.location}
Verified Faculty: ${JSON.stringify(context.faculty)}
Verified Courses: ${JSON.stringify(context.courses)}
  `;

  const systemPrompt = context.systemPrompt || defaultSystemPrompt;

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      temperature: 0.3,
    });

    let response = completion.choices[0].message?.content || "";

    // OUTPUT GUARD: Safety Net for Banned Patterns
    const bannedPatterns = [
      /will call you/i,
      /will contact you/i,
      /our team will/i,
      /counselor will/i,
      /callback/i,
      /staff will/i,
      /life/i
    ];

    for (const pattern of bannedPatterns) {
      if (pattern.test(response)) {
        console.warn(`[SAFETY] Banned pattern detected: ${pattern}. Replacing with fallback.`);
        response = "I can help you with course details or demo class timing. Please tell me your preference.";
        break;
      }
    }

    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};

export const classifyIntentAI = async (message: string): Promise<boolean> => {
  try {
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { 
          role: 'system', 
          content: 'Classify if the student message shows high intent (e.g., asking about joining, fees, demos, or center visits). Reply with ONLY "YES" or "NO".' 
        },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 5,
    });

    const result = response.choices[0].message?.content?.trim().toUpperCase();
    return result === 'YES';
  } catch (error) {
    console.error('Error in classifyIntentAI:', error);
    return false;
  }
};
