// testKey.js
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

console.log("API Key from .env:", process.env.OPENAI_API_KEY);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const response = await client.models.list(); // simple API call
    console.log("API call successful. Number of models:", response.data.length);
  } catch (err) {
    console.error("API call failed:", err);
  }
}

test();
