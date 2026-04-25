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
2. CONTEXT WALL: You are ONLY allowed to use information provided in the "Institute Details" below. Do NOT use general knowledge about coaching, fees, or education.
3. SAFE FALLBACK: If information is missing (e.g., fee for a course not listed), say: "I don't have the specific details for that right now. I'll have our team provide that to you shortly." NEVER guess.
4. ENTITY LOCKING: No human names, staff roles, or contact actions (e.g., "Rahul sir", "Counselor").
5. LOCATION LOCKING: No city/state mentions unless explicitly provided.
6. NO INVENTING: Do NOT create URLs, social media handles, or email addresses.
7. ACTION BAN: NEVER describe future actions (e.g., "will call", "will message").
8. CONCISE OUTPUT ONLY: Keep replies short (1–3 lines). Avoid long explanations.
9. NO FAKE GUARANTEES: Never promise results, scores, or admission.
10. USER EXPERIENCE FIRST: Be professional and calm. Only ask ONE question at a time.

RESPONSE FORMAT:
[Short Answer: 1-3 lines]
[One Clear Question - If needed]

Institute Details:
Name: ${context.name}
Location: ${context.location || "Not Provided"}
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
      /staff will/i,
      /lucknow/i,
      /india/i,
      /located in/i,
      /address/i
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
