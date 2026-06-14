import type { Exercise } from '../types/exercise';

/**
 * Category → gradient color stops for SVG placeholders.
 * Each entry is [startColor, endColor] hex strings.
 */
export const exerciseCategoryColors: Record<string, [string, string]> = {
  chest: ['#DC2626', '#991B1B'],
  back: ['#2563EB', '#1E3A8A'],
  shoulders: ['#9333EA', '#581C87'],
  legs: ['#16A34A', '#14532D'],
  arms: ['#D97706', '#92400E'],
  core: ['#991B1B', '#450A0A'],
  cardio: ['#06B6D4', '#155E75'],
  fullbody: ['#7C3AED', '#4C1D95'],
  calisthenics: ['#059669', '#064E3B'],
  stretching: ['#3B82F6', '#1E40AF'],
};

/**
 * Category → representative emoji character.
 */
export const exerciseCategoryEmojis: Record<string, string> = {
  chest: '\uD83D\uDCAA',       // 💪 flexed biceps
  back: '\uD83D\uDD19',        // 🔙 back arrow
  shoulders: '\uD83C\uDFCB',   // 🏋️ weightlifter
  legs: '\uD83E\uDDB5',        // 🦵 leg
  arms: '\uD83D\uDCAA',        // 💪 flexed biceps
  core: '\uD83D\uDD04',        // 🔄 arrows
  cardio: '\uD83C\uDFC3',      // 🏃 runner
  fullbody: '\u26A1',          // ⚡ high voltage
  calisthenics: '\uD83E\uDD38', // 🤸 cartwheel
  stretching: '\uD83E\uDDD8',   // 🧘 lotus
};

/**
 * Map an exercise's muscleGroup to a category key.
 */
export function muscleGroupToCategory(muscleGroup: string): string {
  const l = muscleGroup.toLowerCase();
  if (l.includes('chest')) return 'chest';
  if (l.includes('back') || l.includes('lat')) return 'back';
  if (l.includes('shoulder') || l.includes('delt') || l.includes('trap')) return 'shoulders';
  if (l.includes('leg') || l.includes('glute') || l.includes('quad') || l.includes('hamstring') || l.includes('calf')) return 'legs';
  if (l.includes('bicep') || l.includes('tricep') || l.includes('arm') || l.includes('forearm')) return 'arms';
  if (l.includes('core') || l.includes('ab') || l.includes('oblique')) return 'core';
  if (l.includes('cardio')) return 'cardio';
  if (l.includes('stretch') || l.includes('flex') || l.includes('mobility')) return 'stretching';
  return 'fullbody';
}

/**
 * Generate an inline SVG string for an exercise demonstration placeholder.
 *
 * The SVG is 400×300 with a category-colored gradient background,
 * a large representative emoji, the exercise name, kanji, and muscle group tag.
 */
export function generateExerciseSvg(exercise: Exercise, isLight: boolean): string {
  const cat = muscleGroupToCategory(exercise.muscleGroup);
  const [startColor, endColor] = exerciseCategoryColors[cat] ?? ['#6B7280', '#374151'];
  const emoji = exerciseCategoryEmojis[cat] ?? '\uD83C\uDFCB';
  const textColor = '#FFFFFF';
  const tagBg = 'rgba(255,255,255,0.15)';
  const tagText = textColor;
  const kanjiColor = startColor;

  // Convert emoji to SVG-safe XML
  const safeName = escapeXml(exercise.name);
  const safeKanji = escapeXml(exercise.kanji);
  const safeMuscle = escapeXml(exercise.muscleGroup);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startColor}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${endColor}" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.0)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="12" ry="12" fill="url(#bg-grad)"/>
  <rect width="400" height="300" rx="12" ry="12" fill="url(#shine)"/>
  <text x="200" y="90" text-anchor="middle" font-size="64" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${emoji}</text>
  <text x="200" y="150" text-anchor="middle" font-size="18" font-weight="bold" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif">${safeName}</text>
  <text x="200" y="178" text-anchor="middle" font-size="14" fill="${kanjiColor}" font-family="serif, Noto Serif SC, serif" opacity="0.8">${safeKanji}</text>
  <rect x="${200 - (safeMuscle.length * 4 + 12)}" y="200" width="${safeMuscle.length * 8 + 24}" height="24" rx="12" fill="${tagBg}"/>
  <text x="200" y="216" text-anchor="middle" font-size="11" fill="${tagText}" font-family="ui-monospace, SFMono-Regular, monospace" font-weight="600">${safeMuscle}</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
