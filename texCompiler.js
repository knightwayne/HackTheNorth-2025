import { exec } from "child_process";
import path from "path";

export function compileLatexToPdf(texFile, pdfFile) {
  return new Promise((resolve, reject) => {
    const outDir = path.dirname(pdfFile);
    exec(`pdflatex -interaction=nonstopmode -output-directory="${outDir}" "${texFile}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(stdout);
        console.error(stderr);
        return reject(new Error("LaTeX compilation failed"));
      }
      resolve(pdfFile);
    });
  });
}
