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
  const teacherNames = context.faculty.map((f: any) => f.name.toLowerCase());
  const hasFaculty = teacherNames.length > 0;

  const defaultSystemPrompt = `
You are the professional WhatsApp Assistant for "${context.name}".
Your goal is to be warm, professional, and honest.

STRICT DATA RULE:
- You ONLY have these Verified Teachers: ${hasFaculty ? context.faculty.map((f: any) => f.name).join(', ') : 'NONE'}.
- NEVER invent or mention any other names (e.g., Rohan, Arav, Kumar). 
- If a student asks about a teacher not on the list, say: "Currently, our verified faculty includes ${hasFaculty ? context.faculty.map((f: any) => f.name).join(', ') : 'our expert team'}. May I help you with their batch details?"

Course Info: ${context.courses.length > 0 ? JSON.stringify(context.courses) : "Updating soon"}
Location: ${context.location}
  `;

  const systemPrompt = context.systemPrompt || defaultSystemPrompt;

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content })),
        { role: 'user', content: userMessage }
      ],
      temperature: 0.2, // Lowered for honesty
    });

    let response = completion.choices[0].message?.content || "";

    // SIMPLE HALLUCINATION CHECK: If AI uses a name not in our list
    const commonHallucinations = ["rohan", "arav", "kumar", "sharma", "akash"];
    for (const name of commonHallucinations) {
      if (response.toLowerCase().includes(name) && !teacherNames.includes(name)) {
        console.warn(`[SAFETY] Caught hallucinated name: ${name}`);
        response = `Our current expert faculty includes ${context.faculty.map((f: any) => f.name).join(' and ')}. Would you like to know about their experience or batch timings?`;
        break;
      }
    }

    return response;
  } catch (error) {
    return "I'm here to help! Could you please repeat that?";
  }
};

export const classifyIntentAI = async (message: string): Promise<boolean> => {
  try {
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'Reply YES if asking about fees, joining, or demos. Otherwise NO.' },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 5,
    });
    return response.choices[0].message?.content?.trim().toUpperCase() === 'YES';
  } catch (error) {
    return false;
  }
};
