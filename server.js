// index.js
const fs = require('fs');

// Paths
const inputPath = './input.tex';
const outputPath = './output.tex';

// Read the input file
const originalTex = fs.readFileSync(inputPath, 'utf8');

// Replace any email with dummy email
const updatedTex = originalTex.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    'project@htn2025.com'
);

// Write the updated content to output.tex
fs.writeFileSync(outputPath, updatedTex, 'utf8');

console.log('output.tex generated successfully.');
