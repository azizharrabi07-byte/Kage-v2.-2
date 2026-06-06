const fs = require('fs');
const path = require('path');

const filesToAppend = [
  'src/types.ts',
  'src/assets.ts',
  'src/audio.ts',
  'src/components/ThreeDCard.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/main.tsx'
];

let output = '\n\n--------------------------------------------------\n7. FULL SOURCE CODE\n--------------------------------------------------\n';

for (const file of filesToAppend) {
  const absolutePath = path.resolve(__dirname, file);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf8');
    output += `\n\n### FILE: ${file} ###\n\`\`\`tsx\n${content}\n\`\`\`\n`;
    console.log(`Appended ${file}`);
  } else {
    console.log(`Could not find ${absolutePath}`);
  }
}

fs.appendFileSync(path.resolve(__dirname, 'kage_v2_design.txt'), output);
console.log('Done!');
