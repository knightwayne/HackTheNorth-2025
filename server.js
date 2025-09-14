import fs from "fs";
import { updateResumeTech as martianUpdate } from "./agents/martianAgent.js";

// Paths
const resumePath = "./resume/input.tex";
const jobDescPath = "./resume/job.txt";
const outputPath = "./resume/output.tex";

let resumeTex = fs.readFileSync(resumePath, "utf8");
const jobDesc = fs.readFileSync(jobDescPath, "utf8");

// Replace email
resumeTex = resumeTex.replace(
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  "project@htn2025.com"
);

async function main() {
  const updatedTex = await martianUpdate(resumeTex, jobDesc);
  console.log("Martian update succeeded.");

  fs.writeFileSync(outputPath, updatedTex, "utf8");
  console.log("Resume updated and saved to output.tex");
}

main();
