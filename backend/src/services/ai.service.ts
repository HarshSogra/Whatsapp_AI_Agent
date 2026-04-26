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
  const hasData = context.courses && context.courses.length > 0;

  const defaultSystemPrompt = `
You are the professional WhatsApp Assistant for "${context.name}".
Keep your replies warm, professional, and very short (1-2 sentences).

RULES:
1. If you have course details below, use them. 
2. If you don't have details (Verified Courses is empty), just say: "We're currently updating our batch schedule. May I know which course you are looking for so I can notify you?"
3. Be helpful but don't make up specific fees or names if they aren't listed below.

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

    return completion.choices[0].message?.content || "";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm here to help! Could you please repeat that?";
  }
};

export const classifyIntentAI = async (message: string): Promise<boolean> => {
  try {
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { 
          role: 'system', 
          content: 'Reply YES if the user is asking about fees, joining, or demos. Otherwise reply NO.' 
        },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 5,
    });

    const result = response.choices[0].message?.content?.trim().toUpperCase();
    return result === 'YES';
  } catch (error) {
    return false;
  }
};
