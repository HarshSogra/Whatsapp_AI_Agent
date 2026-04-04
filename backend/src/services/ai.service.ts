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

export const generateAIResponse = async (userMessage: string, context: any) => {
  const systemPrompt = `
You are a helpful AI assistant for a Coaching Institute. 
Answer student queries using the following context about the institute:
Name: ${context.name}
Courses: ${JSON.stringify(context.courses)}

Rules:
1. Never hallucinate pricing or courses not in the context.
2. Be polite, engaging, and concise. Short answers work best on WhatsApp.
3. If unsure, tell the user you will connect them to a human agent and request them to wait.
  `;

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message?.content || "";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};
