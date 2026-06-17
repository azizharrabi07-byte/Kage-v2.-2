/**
 * Seed script — inserts 509 exercises and 205 programs into Supabase.
 * Uses deterministic UUIDs for primary keys, stores string IDs in `slug`.
 *
 * Prerequisite: Run supabase/migrations/008_full_schema.sql first.
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

function slugToUuid(slug: string): string {
  const hash = createHash('md5').update(slug).digest('hex');
  return [
    hash.slice(0, 8), hash.slice(8, 12),
    hash.slice(12, 16), hash.slice(16, 20),
    hash.slice(20, 32),
  ].join('-');
}

function toJson(val: unknown): string {
  return JSON.stringify(val ?? []);
}

async function seedExercises() {
  const { exercises } = await import('../src/data/exercises.ts');
  console.log(`Exercises: ${exercises.length} found`);

  let ok = 0;
  for (let i = 0; i < exercises.length; i += BATCH) {
    const rows = exercises.slice(i, i + BATCH).map((ex: any) => ({
      id: slugToUuid(ex.id),
      slug: ex.id,
      name: ex.name,
      kanji: ex.kanji || '',
      description: ex.description || '',
      category: ex.category || 'strength',
      muscle_group: ex.muscleGroup || '',
      secondary_muscles: toJson(ex.secondaryMuscles),
      equipment: ex.equipment || 'bodyweight',
      difficulty: ex.difficulty || 'intermediate',
      instructions: Array.isArray(ex.instructions) ? ex.instructions.join('\n') : (ex.instructions || ''),
      tips: toJson(ex.tips),
      default_sets: ex.defaultSets ?? 3,
      default_reps: ex.defaultReps ?? '10',
      rest_seconds: ex.restSeconds ?? 60,
      benefits: toJson(ex.benefits),
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
  const { REAL_PROGRAMS } = await import('../src/data/programs.ts');
  console.log(`Programs: ${REAL_PROGRAMS.length} found`);

  let ok = 0;
  for (let i = 0; i < REAL_PROGRAMS.length; i += BATCH) {
    const rows = REAL_PROGRAMS.slice(i, i + BATCH).map((p: any) => ({
      id: slugToUuid(p.id),
      slug: p.id,
      name: p.name,
      kanji: '',
      description: p.description || '',
      category: p.category || 'strength',
      goal: p.goal || '',
      difficulty: p.difficulty || 'intermediate',
      duration: p.duration || '4 weeks',
      duration_weeks: parseInt(String(p.duration || '4')) || 4,
      frequency: p.frequency || '3x/week',
      sessions_per_week: parseInt(String(p.frequency || '3')) || 3,
      equipment: p.equipment || 'bodyweight',
      scientific_basis: p.scientificBasis || '',
      evidence_level: p.evidenceLevel || 'B',
      what_you_will_gain: p.whatYouWillGain || '',
      sample_exercises: toJson(p.sampleExercises),
      target_muscles: toJson(p.targetMuscles),
      proven_by: p.provenBy || '',
      popularity: p.popularity || 'modern',
      recommended_diet_program_id: p.recommendedDietProgramId || '',
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
  await seedExercises();
  await seedPrograms();
  console.log('\n🎉 Done!');
}

main().catch(console.error);
