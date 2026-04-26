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
  // CRITICAL: Ensure we don't hallucinate if data is missing
  const courseList = (context.courses && context.courses.length > 0) ? JSON.stringify(context.courses) : "NONE - DO NOT MENTION ANY COURSES";
  const facultyList = (context.faculty && context.faculty.length > 0) ? JSON.stringify(context.faculty) : "NONE - DO NOT MENTION ANY NAMES";

  const defaultSystemPrompt = `
You are the professional WhatsApp Assistant for "${context.name}".
Your role is to help students with course details, fees, and booking demo classes.

STRICT RULES:
1. CONTEXT WALL: You are ONLY allowed to use information provided in the "Institute Details" below. Do NOT use general knowledge or invent specialties.
2. NO DATA FALLBACK: If "Verified Courses" is "NONE", you MUST say: "We are currently updating our official course list. Please check back tomorrow for full details."
3. ENTITY LOCKING: If "Verified Faculty" is "NONE", do NOT mention any names or guides. 
4. LOCATION LOCKING: Mention the location only as provided in "Location" below (Default: Lucknow).
5. NO HALLUCINATION: Never mention BCA, MCA, Engineering, or Computer Science unless they are in the "Verified Courses" list.
6. CONCISE: Keep replies short (1–3 sentences). Ask only ONE follow-up question.

Institute Details:
Name: ${context.name}
Location: ${context.location}
Verified Faculty: ${facultyList}
Verified Courses: ${courseList}
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
      temperature: 0.1, // Even lower temperature for maximum accuracy
    });

    let response = completion.choices[0].message?.content || "";

    // OUTPUT GUARD: Final Hallucination filter
    const bannedPatterns = [
      /kumar/i, /sharma/i, /gupta/i, /bca/i, /mca/i, /computer science/i, /college/i, /university/i
    ];

    for (const pattern of bannedPatterns) {
      if (pattern.test(response) && !courseList.toLowerCase().includes(pattern.toString().replace(/\//g,'').replace('i',''))) {
        console.warn(`[SAFETY] Detected Hallucinated Term: ${pattern}. Replacing with safe response.`);
        response = `I have noted your interest in our courses at ${context.name}. Since we are currently finalizing our new batch details, may I know which class or subject you are looking for specifically?`;
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
          content: 'Classify if the student message shows high intent (fees, demos, joining). Reply with ONLY "YES" or "NO".' 
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
