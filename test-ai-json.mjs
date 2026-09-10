import { config } from 'dotenv';
// import { findMeScheme } from './src/actions/ai-finder.js'; // wait, it's a server action, it imports from "@/lib/supabase/server" etc which might fail in node

// A manual test script using fetch to the AI
import OpenAI from 'openai';

config({ path: '.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function run() {
  const candidateSchemes = [
    { id: "uuid-1", title: "PM-KISAN", eligibility: "Farmers" },
    { id: "uuid-2", title: "SSY", eligibility: "Girl child under 10" }
  ];
  const userPrompt = "I am a farmer looking for financial support.";
  
  const systemPrompt = `You are a scheme matching assistant.
    
    You will receive a list of Candidate Schemes and a User's Prompt.
    Task: Find up to 5 schemes that match the user's needs.
    Output your response STRICTLY as a JSON array of objects. Do NOT include markdown tags or any other text.
    Format:
    [
      { "scheme_id": "UUID", "relevance_score": 90, "explanation": "Why..." }
    ]`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Candidate Schemes: ${JSON.stringify(candidateSchemes)}\n\nUser Prompt: ${userPrompt}`,
        },
      ],
      temperature: 0.2,
    });
    console.log(response.choices[0].message.content);
  } catch(e) {
    console.error(e);
  }
}
run();
