const fs = require('fs');
let data = fs.readFileSync('src/data/exercises.ts', 'utf8');
data = data.replace(/(kanji: '[^']+',\s*)(category: ')/g, '$1description: \'Train with disciplined intent.\', $2');
fs.writeFileSync('src/data/exercises.ts', data);
console.log('Fixed missing descriptions');
