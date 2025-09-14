// texCompiler.js
import { exec } from "child_process";
import path from "path";

export function compileLatexToPdf(texFile, outDir = "./resume") {
  const absoluteTexPath = path.resolve(texFile);
  const pdfFile = path.join(outDir, path.basename(texFile, ".tex") + ".pdf");

  exec(`pdflatex -interaction=nonstopmode -output-directory=${outDir} "${absoluteTexPath}"`);
  return pdfFile;
}
