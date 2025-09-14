import fs from "fs";
import express from "express";
import { updateResumeTech as martianUpdate } from "./agents/martianAgent.js";
import { compileLatexToPdf } from "./texCompiler.js";

const app = express();
const PORT = 3000;

// Serve PDFs directly
app.use("/resume", express.static("resume"));

// Paths
const resumePath = "./resume/input.tex";
const jobDescPath = "./resume/desc.txt";
const originalTexPath = "./resume/original.tex";
const outputPath = "./resume/output.tex";

app.get("/", async (req, res) => {
  try {
    let resumeTex = fs.readFileSync(resumePath, "utf8");
    const jobDesc = fs.readFileSync(jobDescPath, "utf8");

    // Replace email
    resumeTex = resumeTex.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "project@htn2025.com"
    );

    // Save original tex and compile
    fs.writeFileSync(originalTexPath, resumeTex, "utf8");
    const originalPdf = await compileLatexToPdf(originalTexPath);
    console.log("Original PDF generated at:", originalPdf);

    // Only proceed if original compiled successfully
    let updatedPdf = null;
    if (fs.existsSync(originalPdf)) {
      const updatedTex = await martianUpdate(resumeTex, jobDesc);
      fs.writeFileSync(outputPath, updatedTex, "utf8");
      console.log("Resume updated and saved to output.tex");

      updatedPdf = await compileLatexToPdf(outputPath);
      console.log("Updated PDF generated at:", updatedPdf);
    }

    // Simple HTML display
    const html = `
      <html>
        <head><title>Resume Comparison</title></head>
        <body>
          <h2>Resume Comparison</h2>
          <div style="display:flex; gap:20px;">
            <div style="flex:1">
              <h3>Original</h3>
              <embed src="/resume/original.pdf" type="application/pdf" width="100%" height="600px"/>
            </div>
            <div style="flex:1">
              <h3>Updated</h3>
              ${
                updatedPdf
                  ? `<embed src="/resume/output.pdf" type="application/pdf" width="100%" height="600px"/>`
                  : "<p>Updated version not available.</p>"
              }
            </div>
          </div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
