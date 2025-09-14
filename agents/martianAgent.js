import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const MARTIAN_API_KEY = process.env.MARTIAN_API_KEY;
const MARTIAN_API_URL = "https://api.withmartian.com/v1/chat/completions";

export async function updateResumeTech(resumeTex, jobDesc) {
  // Shorten the section if needed
  const prompt = `
Update only the technical/framework part of this LaTeX resume based on the job description, keeping all other text intact. Return only the .tex content.

Example:
Resume snippet: "MVC project with Node.js, Express framework, MongoDB, React frontend"
Job Description: "C# developer, experience with ASP.NET Core and Blazor"
Updated Resume: "MVC project with C#, ASP.NET Core framework, MySQL Server DB, Blazor Pages frontend"

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
