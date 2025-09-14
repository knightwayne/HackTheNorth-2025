// agentAI.js
import dotenv from "dotenv";
import OpenAI from "openai";

// Load .env here so process.env.OPENAI_API_KEY is available in this module
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * updateResumeTech
 * @param {string} resumeTex - Original LaTeX content
 * @param {string} jobDesc - Job description
 * @returns {string} Updated LaTeX content
 */
export async function updateResumeTech(resumeTex, jobDesc) {
const prompt = `
You are an AI agent that updates resumes in LaTeX format. 
Your task is to smartly replace only the technical/framework parts of the resume based on a given job description, while keeping all other text, formatting, and LaTeX commands intact.

Examples:

1. Original Resume Snippet:
"MVC project with Node.js, Express framework, MongoDB, React frontend"
Job Description:
"C# developer, experience with ASP.NET Core and Blazor"
Updated Resume:
"MVC project with C#, ASP.NET Core framework, MySQL Server DB, Blazor Pages frontend"

2. Original Resume Snippet:
"MVC project with Node.js, Express framework, MongoDB, React frontend"
Job Description:
"Python web developer, experience with Django and Postgres"
Updated Resume:
"MVC project with Python, Django framework, Postgres Server DB, Dynamic Template Pages frontend"

Now, given the following resume and job description, produce an updated LaTeX resume snippet:

Resume: """${resumeTex}"""
Job Description: """${jobDesc}"""
Return only the updated LaTeX content.
`;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return response.choices[0].message.content.trim();
}
