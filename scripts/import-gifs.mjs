#!/usr/bin/env node
import https from 'https';
import fs from 'fs';
import path from 'path';

const GIFS_DATA_URL = 'https://raw.githubusercontent.com/azilRababe/Exercises_Dataset/main/gifs_data.json';
const OUTPUT_DIR = path.resolve('public/gifs/exercises');
const MAPPING_FILE = path.resolve('src/data/gifMapping.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, r => {
      if (r.statusCode !== 200) return reject(new Error(`HTTP ${r.statusCode}`));
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract exercise names and IDs from the TypeScript data
function parseExercises(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  const exercises = [];
  const idPattern = /id:\s*['"]([^'"]+)['"]/g;
  const namePattern = /name:\s*['"]([^'"]+)['"]/g;
  const gifPattern = /gifUrl:\s*['"]([^'"]+)['"]/g;

  const ids = [...src.matchAll(idPattern)].map(m => m[1]);
  const names = [...src.matchAll(namePattern)].map(m => m[1]);
  const gifs = [...src.matchAll(gifPattern)].map(m => m[1]);

  // First 10 entries are categories (Chest, Back, etc.), skip them
  for (let i = 10; i < ids.length; i++) {
    exercises.push({
      id: ids[i],
      name: names[i],
      gifPath: gifs[i]?.replace('/gifs/exercises/', '') || '',
    });
  }
  return exercises;
}

// Best-effort title matching
function findBestMatch(exerciseName, gifEntries) {
  const exNorm = normalize(exerciseName);
  const exWords = exNorm.split(' ').filter(Boolean);

  // Score each entry by title similarity
  let best = null;
  let bestScore = 0;

  for (const entry of gifEntries) {
    const titleNorm = normalize(entry.title);
    const titleWords = titleNorm.split(' ').filter(Boolean);

    // Count matching words
    const matchCount = exWords.filter(w => titleWords.includes(w)).length;
    const totalWords = Math.max(exWords.length, titleWords.length);
    const score = matchCount / totalWords;

    // Weighted: prefer exact matches, then partial
    const exactBonus = exNorm === titleNorm ? 0.3 : 0;
    const finalScore = score + exactBonus;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      best = { entry, score: finalScore };
    }
  }

  return best && best.score > 0.35 ? best : null;
}

async function main() {
  console.log('⏳ Fetching GIF dataset from GitHub...');
  const gifEntries = await fetch(GIFS_DATA_URL);
  console.log(`✅ Loaded ${gifEntries.length} GIF entries`);

  const exercises = parseExercises('src/data/exercises.ts');
  console.log(`📋 Our exercises (excluding categories): ${exercises.length}`);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const mapping = {};
  let matched = 0;
  let notFound = [];
  let skipped = 0;

  for (const ex of exercises) {
    const match = findBestMatch(ex.name, gifEntries);

    if (match) {
      mapping[ex.id] = match.entry.gif_url;
      matched++;

      // Download the GIF
      const destPath = path.join(OUTPUT_DIR, `${ex.id}.gif`);
      if (fs.existsSync(destPath)) {
        skipped++;
        continue;
      }

      try {
        await new Promise((resolve, reject) => {
          https.get(match.entry.gif_url, res => {
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP ${res.statusCode} for ${ex.name}`));
              return;
            }
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
          }).on('error', reject);
        });
        process.stdout.write('.');
      } catch (err) {
        notFound.push({ exercise: ex.name, id: ex.id, error: err.message });
        process.stdout.write('x');
      }
    } else {
      notFound.push({ exercise: ex.name, id: ex.id, error: 'No title match' });
      process.stdout.write('_');
    }
  }

  // Save the mapping file
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`\n\n✅ Done!`);
  console.log(`   Matched + downloaded: ${matched}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Not found/failed: ${notFound.length}`);

  // Print unmatched for manual review
  const unmatchedLog = notFound.filter(n => n.error === 'No title match');
  if (unmatchedLog.length > 0) {
    console.log(`\n📌 Exercises without GIF match (${unmatchedLog.length}):`);
    unmatchedLog.slice(0, 30).forEach(n => console.log(`   ${n.id}: ${n.exercise}`));
    if (unmatchedLog.length > 30) console.log(`   ... and ${unmatchedLog.length - 30} more`);
  }

  // Write a quick-mapping script for unmatched exercises
  if (notFound.length > 0) {
    const easyMap = notFound.filter(n => n.error !== 'No title match').slice(0, 10);
    if (easyMap.length > 0) {
      console.log(`\n⚠️ Download failures for ${easyMap.length} exercises (check URLs):`);
      easyMap.forEach(n => console.log(`   ${n.id}: ${n.exercise} - ${n.error}`));
    }
  }
}

main().catch(console.error);
