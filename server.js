// server.js
import fs from "fs";
import { updateResumeTech } from "./agents/aiAgent.js";

// Paths
const resumePath = "./resume/input.tex";
const jobDescPath = "./resume/job.txt";
const outputPath = "./resume/output.tex";

// Read files
let resumeTex = fs.readFileSync(resumePath, "utf8");
const jobDesc = fs.readFileSync(jobDescPath, "utf8");

// Step 1: Replace any email with dummy email
resumeTex = resumeTex.replace(
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  "project@htn2025.com"
);

async function main() {
  try {
    // Step 2: Use AI agent to update technical/framework sections
    const updatedTex = await updateResumeTech(resumeTex, jobDesc);

    // Step 3: Write final output
    fs.writeFileSync(outputPath, updatedTex, "utf8");
    console.log("output.tex generated successfully with email replaced and AI-updated tech stack.");
  } catch (err) {
    console.error("Error updating resume:", err);
  }
}

main();
