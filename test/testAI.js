// testGPT.js
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // Load API key from .env

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",   // Free tier model
      messages: [{ role: "user", content: "Say hello in one line." }],
      max_tokens: 10             // minimal usage
    });

    console.log("GPT Response:", response.choices[0].message.content.trim());
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
