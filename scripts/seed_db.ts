/**
 * Seed script — inserts exercises and programs into Supabase.
 * Uses deterministic UUIDs, ONLY writes to columns that exist
 * (name, muscle_group, equipment, difficulty, instructions, image_url).
 * After running 010_fix_schema.sql, run again for full data.
 *
 * Usage: cd /tmp/kage-v2 && npx tsx scripts/seed_db.ts
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://onkubggcahallhxdnttj.supabase.co';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ua3ViZ2djYWhhbGxoeGRudHRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA0NTY1NSwiZXhwIjoyMDk1NjIxNjU1fQ.vSa4cGtM4zWt92KgAIMcORbtDMFnL_goTV_c-ROzVU8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const BATCH = 50;

const seenIds = new Map<string, number>();

function mapDifficulty(d: string): string {
  if (d === 'expert') return 'advanced';
  return ['beginner', 'intermediate', 'advanced'].includes(d) ? d : 'intermediate';
}

function slugToUuid(slug: string): string {
  const count = seenIds.get(slug) || 0;
  seenIds.set(slug, count + 1);
  const deduped = count > 0 ? `${slug}-${count}` : slug;
  const hash = createHash('md5').update(deduped).digest('hex');
  return [
    hash.slice(0, 8), hash.slice(8, 12),
    hash.slice(12, 16), hash.slice(16, 20),
    hash.slice(20, 32),
  ].join('-');
}

async function seedExercises() {
  seenIds.clear();
  const { exercises } = await import('../src/data/exercises.ts');
  console.log(`Exercises: ${exercises.length} found`);

  let ok = 0;
  for (let i = 0; i < exercises.length; i += BATCH) {
    const rows = exercises.slice(i, i + BATCH).map((ex: any) => ({
      id: slugToUuid(ex.id),
      name: ex.name,
      muscle_group: ex.muscleGroup || '',
      equipment: ex.equipment || 'bodyweight',
      difficulty: mapDifficulty(ex.difficulty),
      instructions: Array.isArray(ex.instructions) ? ex.instructions : [ex.instructions || ''],
      image_url: ex.imageUrl || '',
    }));
    const { error } = await supabase.from('exercises').upsert(rows, { onConflict: 'id' });
    if (error) { console.error(`\n  ❌ Batch error: ${error.message}`); process.exit(1); }
    ok += rows.length;
    process.stdout.write(`  ${ok}/${exercises.length}\r`);
  }

  const { count } = await supabase.from('exercises').select('id', { count: 'exact', head: true });
  console.log(`\n  ✅ ${count} exercises in DB`);
}

async function seedPrograms() {
  seenIds.clear();
  const { REAL_PROGRAMS } = await import('../src/data/programs.ts');
  console.log(`Programs: ${REAL_PROGRAMS.length} found`);

  let ok = 0;
  while (ok < REAL_PROGRAMS.length) {
    const batch = REAL_PROGRAMS.slice(ok, ok + BATCH);
    const rows = batch.map((p: any) => ({
      id: slugToUuid(p.id),
      name: p.name,
      description: p.description || '',
      difficulty: p.difficulty || 'intermediate',
      evidence_level: p.evidenceLevel || 'B',
      duration_weeks: parseInt(String(p.duration || '4')) || 4,
      sessions_per_week: parseInt(String(p.frequency || '3')) || 3,
      image_url: '',
    }));
    const { error } = await supabase.from('programs').upsert(rows, { onConflict: 'id' });
    if (error) { console.error(`\n  ❌ Batch error: ${error.message}`); process.exit(1); }
    ok += rows.length;
    process.stdout.write(`  ${ok}/${REAL_PROGRAMS.length}\r`);
  }

  const { count } = await supabase.from('programs').select('id', { count: 'exact', head: true });
  console.log(`\n  ✅ ${count} programs in DB`);
}

async function main() {
  console.log('🌱 KAGE DB Seeder\n');
  console.log('⚠️  Only writing to existing columns. Run 010_fix_schema.sql then re-run for full data.\n');
  await seedExercises();
  await seedPrograms();
  console.log('\n🎉 Done!');
}

main().catch(console.error);
