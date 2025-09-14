// testMartian.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MARTIAN_API_KEY = process.env.MARTIAN_API_KEY;
const MARTIAN_API_URL = "https://api.withmartian.com/v1/chat/completions";

async function testMartian() {
  const prompt = "Say hello and confirm the API is working.";

  try {
    const response = await axios.post(
      MARTIAN_API_URL,
      {
        model: "auto",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${MARTIAN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Martian response:", response.data.choices[0].message.content);
  } catch (err) {
    console.error("Martian API error:", err.message);
  }
}

testMartian();
