import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function run() {
  const candidateSchemes = [
    { id: "uuid-1", title: "PM-KISAN", eligibility: "Farmers" },
    { id: "uuid-2", title: "SSY", eligibility: "Girl child under 10" },
    { id: "uuid-3", title: "National Scholarship Portal", eligibility: "Students looking for educational scholarships" }
  ];
  const userPrompt = "I am looking for educational scholarships.";
  
  const systemPrompt = `You are an expert government scheme discovery assistant. Your job is to match the user's prompt with the best candidate schemes.
    
    You will receive a JSON list of Candidate Schemes and the User's Prompt.

    Task: Analyze the user's prompt and select up to 5 schemes that best address their needs.
    You must return a JSON array containing the selected schemes. Each object in the array must have exactly:
    - "scheme_id": The exact string of the candidate scheme's id.
    - "relevance_score": An integer from 0 to 100 indicating how well the scheme matches the user's prompt.
    - "explanation": A brief, 1-2 sentence explanation of why this scheme is a good match based on the user's prompt.

    CRITICAL: Return ONLY a valid JSON array. Do not wrap the JSON in markdown formatting, code blocks, or include any extra text. If no schemes match, return [].`;

  console.log(`Testing model: ${process.env.AI_MODEL}`);
  
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Candidate Schemes: ${JSON.stringify(candidateSchemes)}\n\nUser Prompt: ${userPrompt}`,
        },
      ],
      temperature: 0.2,
    });
    console.log("RESPONSE RECEIVED:");
    console.log(response.choices[0].message.content);
  } catch(e) {
    console.error("ERROR OCCURRED:");
    console.error(e);
  }
}
run();
