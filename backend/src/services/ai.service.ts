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
- NEVER invent or mention any other names.
- If a student asks about a teacher not on the list, say you only have the verified faculty listed above.

Course Info: ${context.courses.length > 0 ? JSON.stringify(context.courses) : "Updating soon"}
Location: ${context.location}
  `;

  const systemPrompt = context.systemPrompt || defaultSystemPrompt;

  try {
    const groqClient = getGroq();
    
    // BUILD MESSAGES WITH EXPLICIT TYPES FOR TS
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({ 
        role: msg.role === 'user' ? 'user' : 'assistant', 
        content: msg.content 
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages as any, // Cast to any to bypass strict SDK type checks on railway
      temperature: 0.2,
    });

    let response = completion.choices[0].message?.content || "";

    // Hallucination Check
    const commonHallucinations = ["rohan", "arav", "kumar", "sharma", "akash"];
    for (const name of commonHallucinations) {
      if (response.toLowerCase().includes(name) && !teacherNames.some((n: string) => n.includes(name))) {
        response = `Our current expert faculty includes ${context.faculty.map((f: any) => f.name).join(' and ')}. Would you like to know about their experience or batch timings?`;
        break;
      }
    }

    return response;
  } catch (error) {
    console.error('AI Error:', error);
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
      ] as any,
      temperature: 0,
      max_tokens: 5,
    });
    return response.choices[0].message?.content?.trim().toUpperCase() === 'YES';
  } catch (error) {
    return false;
  }
};
