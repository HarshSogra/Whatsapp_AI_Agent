import OpenAI from 'openai';

const openai = new OpenAI();
// OpenAI automatically uses process.env.OPENAI_API_KEY

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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};
