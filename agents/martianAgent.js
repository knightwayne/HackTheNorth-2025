import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MARTIAN_API_KEY = process.env.MARTIAN_API_KEY;
const MARTIAN_API_URL = "https://api.withmartian.com/v1/chat/completions";

export async function updateResumeTech(resumeTex, jobDesc) {
  // Shorten the section if needed
  const prompt = `
edit all projects and work experience in Resume to match with the tech stack in Job_Desc, dont change latex .tex format, 
Just give .tex code, no auxillary information, start with /documentclass as your response,
and end with \end{document}, no latex and code block formatting

Resume: """${resumeTex}"""
Job_Desc: """${jobDesc}"""
`;

  try {
    const response = await axios.post(
      MARTIAN_API_URL,
      {
        model: "martian/code",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${MARTIAN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Martian agent error:", err.message);
    return resumeTex; // fallback
  }
}
