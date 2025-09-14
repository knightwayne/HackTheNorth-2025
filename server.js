import express from "express";
import fs from "fs";
import path from "path";
import { compileLatexToPdf } from "./texCompiler.js";
import { updateResumeTech as martianUpdate } from "./agents/martianAgent.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PDF folder
const pdfDir = path.resolve("./pdf");
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// Serve generated PDFs
app.use("/pdf", express.static(pdfDir));

// Paths
const inputTexPath = path.join(pdfDir, "input.tex");
const outputTexPath = path.join(pdfDir, "output.tex");
const descPath = "./resume/desc.txt";

// Serve HTML directly
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Resume Tweaker</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f9f9f9; color: #333; }
    h1 { text-align: center; color: #2c3e50; }
    h2 { margin-bottom: 5px; color: #34495e; }
    .container { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
    .box { flex: 1; min-width: 400px; display: flex; flex-direction: column; gap: 10px; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    textarea { width: 100%; height: 200px; font-family: monospace; font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; resize: vertical; }
    embed { width: 100%; height: 400px; border: 1px solid #ccc; border-radius: 5px; }
    .btn { padding: 10px; cursor: pointer; margin-top: 5px; border: none; border-radius: 5px; background-color: #3498db; color: #fff; transition: background 0.3s; }
    .btn:hover { background-color: #2980b9; }
    #jobSection { margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    #jobDesc { height: 120px; }
    .button-group { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px; }
  </style>
</head>
<body>
<h1>Resume Tweaker</h1>

<div id="jobSection">
  <h2>Job Description</h2>
  <textarea id="jobDesc" placeholder="Enter job description here..."></textarea>
  <div class="button-group">
    <button class="btn" onclick="generateOutputTex()">Generate Output TEX</button>
  </div>
</div>

<div class="container">
  <div class="box">
    <h2>Input TEX</h2>
    <textarea id="inputTex"></textarea>
    <div class="button-group">
      <button class="btn" onclick="compileInputPdf()">Compile Input PDF</button>
      <button class="btn" onclick="showInputPdf()">Show Input PDF</button>
    </div>
    <embed id="inputPdf" type="application/pdf">
  </div>

  <div class="box">
    <h2>Output TEX</h2>
    <textarea id="outputTex"></textarea>
    <div class="button-group">
      <button class="btn" onclick="compileOutputPdf()">Compile Output PDF</button>
      <button class="btn" onclick="showOutputPdf()">Show Output PDF</button>
    </div>
    <embed id="outputPdf" type="application/pdf">
  </div>
</div>

<script>
async function fetchInputTex(){
  const txt = await fetch('/tex/input').then(r=>r.text());
  document.getElementById('inputTex').value = txt;
}
async function fetchJobDesc(){
  const txt = await fetch('/desc').then(r=>r.text());
  document.getElementById('jobDesc').value = txt;
}

async function generateOutputTex(){
  const tex = document.getElementById('inputTex').value;
  const desc = document.getElementById('jobDesc').value;
  const res = await fetch('/generate-tex',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({texContent: tex, jobDesc: desc})
  });
  const data = await res.json();
  document.getElementById('outputTex').value = data.outputTex;
}

async function compileInputPdf(){
  const tex = document.getElementById('inputTex').value;
  const res = await fetch('/compile/input',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({texContent: tex})
  });
  if(res.ok){
    alert("Input PDF generated successfully!");
  }
}

async function compileOutputPdf(){
  const tex = document.getElementById('outputTex').value;
  const res = await fetch('/compile/output',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({texContent: tex})
  });
  if(res.ok){
    alert("Output PDF generated successfully!");
  }
}

function showInputPdf(){
  document.getElementById('inputPdf').src = '/pdf/input.pdf?' + Date.now();
}
function showOutputPdf(){
  document.getElementById('outputPdf').src = '/pdf/output.pdf?' + Date.now();
}

// initial load
fetchInputTex();
fetchJobDesc();
</script>

</body>
</html>
  `);
});

// Serve input.tex
app.get("/tex/input", (req,res)=>{
  const txt = fs.existsSync(inputTexPath) ? fs.readFileSync(inputTexPath,'utf8') : '';
  res.send(txt);
});

// Serve desc.txt
app.get("/desc", (req,res)=>{
  const txt = fs.existsSync(descPath) ? fs.readFileSync(descPath,'utf8') : '';
  res.send(txt);
});

// Generate output.tex via Martian
app.post("/generate-tex", async (req,res)=>{
  try {
    const { texContent, jobDesc } = req.body;
    const updatedTex = await martianUpdate(texContent, jobDesc);
    fs.writeFileSync(outputTexPath, updatedTex, "utf8");
    console.log("Output TEX generated");
    res.json({ outputTex: updatedTex });
  } catch(err){
    console.error("Error generating output TEX:", err);
    res.status(500).json({ error: err.message });
  }
});

// Compile PDFs
app.post("/compile/input", async (req,res)=>{
  try{
    fs.writeFileSync(inputTexPath, req.body.texContent,"utf8");
    console.log("Compiling input TEX to PDF...");
    await compileLatexToPdf(inputTexPath, path.join(pdfDir,'inputResume.pdf'));
    console.log("Input PDF generated");
    res.json({ status:'ok', path:'/pdf/inputResume.pdf' });
  } catch(err){
    console.error("Error compiling input PDF:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/compile/output", async (req,res)=>{
  try{
    fs.writeFileSync(outputTexPath, req.body.texContent,"utf8");
    console.log("Compiling output TEX to PDF...");
    await compileLatexToPdf(outputTexPath, path.join(pdfDir,'outputResume.pdf'));
    console.log("Output PDF generated");
    res.json({ status:'ok', path:'/pdf/outputResume.pdf' });
  } catch(err){
    console.error("Error compiling output PDF:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, ()=>console.log(`Server running at http://localhost:${PORT}`));
