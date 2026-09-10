import { config } from 'dotenv';
import OpenAI from 'openai';

// Load the .env file
config({ path: '.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function main() {
  console.log(`Connecting to ${process.env.OPENAI_BASE_URL} using model ${process.env.AI_MODEL}...`);
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant. Reply exactly with 'Hello world!'" },
        { role: "user", content: "Say hello!" }
      ],
      max_tokens: 20
    });
    console.log("Success! Response from API:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error connecting to API:", error.message);
  }
}

main();
