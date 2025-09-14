import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MARTIAN_API_KEY = process.env.MARTIAN_API_KEY;
const MARTIAN_API_URL = "https://api.withmartian.com/v1/chat/completions";

export async function updateResumeTech(resumeTex, jobDesc) {
  // Shorten the section if needed
  const prompt = `
Update only the technical/framework part of the projects in the .tex LaTeX files based 
on the job description, keeping all other text intact. Return only the .tex content Minimal changes overall, dont touch what isnt asked.
Change from original eg. (C#, ASP.NET) to (MERN stack) or (Python+MySQL) as asked.
Resume: """${resumeTex}"""
Job Description: """${jobDesc}"""
`;

  try {
    const response = await axios.post(
      MARTIAN_API_URL,
      {
        model: "openai/gpt-4.1-nano",
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
