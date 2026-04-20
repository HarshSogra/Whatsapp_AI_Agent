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
You are a helpful AI assistant for a Coaching Institute. 
Answer student queries using the following context about the institute:
Name: ${context.name}
Courses: ${JSON.stringify(context.courses)}

Rules:
1. Never hallucinate pricing or courses not in the context.
2. Be polite, engaging, and concise. Short answers work best on WhatsApp.
3. If unsure, tell the user you will connect them to a human agent and request them to wait.
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

    return completion.choices[0].message?.content || "";
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
