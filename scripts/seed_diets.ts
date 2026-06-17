/**
 * Seed diet programs from frontend data into diet_programs table.
 * Requires 010_fix_schema.sql to have been run (creates diet_programs table).
 *
 * Usage: cd /tmp/kage-v2 && npx tsx scripts/seed_diets.ts
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
  return [hash.slice(0, 8), hash.slice(8, 12), hash.slice(12, 16), hash.slice(16, 20), hash.slice(20, 32)].join('-');
}

function toJson(v: unknown): string { return JSON.stringify(v ?? []); }

async function main() {
  console.log('🌱 KAGE Diet Program Seeder\n');

  // Check if table exists
  try {
    await supabase.from('diet_programs').select('id').limit(1);
  } catch {
    console.log('❌ diet_programs table not found. Run 010_fix_schema.sql first.');
    process.exit(1);
  }

  const { DIET_PROGRAMS } = await import('../src/data/dietPrograms.ts');
  console.log(`Found ${DIET_PROGRAMS.length} diet programs\n`);

  let ok = 0;
  for (let i = 0; i < DIET_PROGRAMS.length; i += BATCH) {
    const batch = DIET_PROGRAMS.slice(i, i + BATCH);
    const rows = batch.map((d: any) => ({
      id: slugToUuid(d.id),
      slug: d.id,
      name: d.name,
      category: d.category || 'fat-loss',
      goal: d.goal || '',
      difficulty: d.difficulty || 'beginner',
      description: d.description || '',
      scientific_basis: d.scientificBasis || '',
      what_you_will_gain: d.whatYouWillGain || '',
      typical_macros: toJson(d.typicalMacros),
      sample_meals: toJson(d.sampleMeals),
      pros: toJson(d.pros),
      cons: toJson(d.cons),
      best_for: d.bestFor || '',
      proven_by: d.provenBy || '',
      recommended_program_types: toJson(d.recommendedProgramTypes),
    }));
    const { error } = await supabase.from('diet_programs').upsert(rows, { onConflict: 'id' });
    if (error) { console.error(`\n❌ Batch error: ${error.message}`); process.exit(1); }
    ok += rows.length;
    process.stdout.write(`  ${ok}/${DIET_PROGRAMS.length}\r`);
  }

  const { count } = await supabase.from('diet_programs').select('id', { count: 'exact', head: true });
  console.log(`\n✅ ${count} diet programs in DB`);
}

main().catch(console.error);
