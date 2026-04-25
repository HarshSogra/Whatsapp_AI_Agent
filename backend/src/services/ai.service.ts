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
STRICT RULES:
1. Always reply in ONE single consolidated message.
2. ENTITY LOCKING: You are NOT allowed to generate or assume any human names, staff roles, or contact actions unless explicitly provided in the input context.
3. Treat the following as FORBIDDEN CATEGORIES: staff names, counselor names, call-back promises, admission guarantees.
4. ACTION BAN: You must NEVER describe future actions performed by humans or system agents (e.g., call, message, contact, will reach out).
5. CONCISE OUTPUT ONLY: Keep replies short (1–5 lines max).
6. NO SPAM / NO LOOPING QUESTIONS: Ask only ONE question at a time. Wait for a response.
7. USER EXPERIENCE FIRST: Tone must be calm, professional, and non-pushy. Do NOT push admission repeatedly.
8. If course selection is needed, show options once in a clean list. Do not repeat lists.
9. If a demo class is already booked (check history), do not re-ask for time preference.

RESPONSE FORMAT:
[Short Greeting - Optional]
[Main Answer: 1-5 lines max]
[One Clear Question - If needed]

Institute Details:
Name: ${context.name}
Courses: ${JSON.stringify(context.courses)}
  `;

  const systemPrompt = context.systemPrompt || defaultSystemPrompt;

  // Format history and current message for chat API
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
      /rahul sir/i,
      /sanjay sir/i,
      /will call you/i,
      /will contact you/i,
      /our team will/i,
      /counselor will/i,
      /callback/i,
      /staff will/i
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

/**
 * Classifies if a message shows high intent to enroll or inquire about courses.
 * Simple YES/NO classification to keep it fast.
 */
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
    return false; // Default to false to avoid spamming admin on error
  }
};
