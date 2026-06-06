-- Seed 10 workout templates
-- Template 1: Path of the Ronin
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000001', 'Path of the Ronin', '浪', 'A balanced full-body journey for the solitary warrior', 'beginner', 30, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name='Shadow Push' LIMIT 1), 1, 3, 12),
('t1000000-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name='Ronin Lunge' LIMIT 1), 2, 3, 10),
('t1000000-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name='Samurai Row' LIMIT 1), 3, 3, 10),
('t1000000-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name='Temple Plank' LIMIT 1), 4, 3, 30);

-- Template 2: Shadow Strike
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000002', 'Shadow Strike', '影', 'Upper body power-focused routine', 'intermediate', 40, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name='Crimson Press' LIMIT 1), 1, 4, 8),
('t1000000-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name='Shadow Push' LIMIT 1), 2, 4, 15),
('t1000000-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name='Blade Curl' LIMIT 1), 3, 3, 12),
('t1000000-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name='Dojo Dip' LIMIT 1), 4, 3, 12),
('t1000000-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name='Iron Fist' LIMIT 1), 5, 3, 30);

-- Template 3: Oni Legion
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000003', 'Oni Legion', '鬼', 'Advanced full-body gauntlet for the dedicated warrior', 'warrior', 50, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Storm Burpee' LIMIT 1), 1, 5, 10),
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Warrior Pull-up' LIMIT 1), 2, 5, 8),
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Steel Deadlift' LIMIT 1), 3, 5, 8),
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Thunder Clap' LIMIT 1), 4, 4, 10),
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Oni Slam' LIMIT 1), 5, 4, 12),
('t1000000-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name='Dragon Fly' LIMIT 1), 6, 3, 45);

-- Template 4: Rising Sun
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000004', 'Rising Sun', '昇', 'Lower body focus for building the foundation', 'beginner', 35, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name='Iron Squat' LIMIT 1), 1, 4, 15),
('t1000000-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name='Ronin Lunge' LIMIT 1), 2, 3, 12),
('t1000000-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name='Rising Sun' LIMIT 1), 3, 4, 20),
('t1000000-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name='Fudo Stance' LIMIT 1), 4, 3, 45);

-- Template 5: Dragon Path
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000005', 'Dragon Path', '龍', 'Push-focused routine for upper body power', 'intermediate', 40, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name='Ichiban Closer' LIMIT 1), 1, 4, 10),
('t1000000-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name='Shadow Push' LIMIT 1), 2, 4, 15),
('t1000000-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name='Crimson Press' LIMIT 1), 3, 3, 10),
('t1000000-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name='Dojo Dip' LIMIT 1), 4, 3, 12),
('t1000000-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name='Kensei Press' LIMIT 1), 5, 3, 12);

-- Template 6: Silent Night
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000006', 'Silent Night', '静', 'Core and recovery focused flow', 'beginner', 25, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name='Silent Stretch' LIMIT 1), 1, 3, 30),
('t1000000-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name='Crane Balance' LIMIT 1), 2, 3, 30),
('t1000000-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name='Lotus Hold' LIMIT 1), 3, 2, 60);

-- Template 7: Thunder Dojo
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000007', 'Thunder Dojo', '雷', 'Explosive power and agility training', 'warrior', 45, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Thunder Clap' LIMIT 1), 1, 5, 8),
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Storm Burpee' LIMIT 1), 2, 5, 10),
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Fire Breath' LIMIT 1), 3, 4, 45),
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Shadow Spar' LIMIT 1), 4, 4, 30),
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Dawn Breaker' LIMIT 1), 5, 4, 8),
('t1000000-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name='Wind Cutter' LIMIT 1), 6, 3, 20);

-- Template 8: Zen Flow
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000008', 'Zen Flow', '禅', 'Mindful full-body movement for focus and flow', 'beginner', 30, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name='Zen Reach' LIMIT 1), 1, 3, 12),
('t1000000-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name='Silent Stretch' LIMIT 1), 2, 3, 30),
('t1000000-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name='Temple Plank' LIMIT 1), 3, 3, 30),
('t1000000-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name='Rising Sun' LIMIT 1), 4, 3, 15);

-- Template 9: Crimson Legion
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000009', 'Crimson Legion', '紅', 'Pull-focused routine for back and arm strength', 'intermediate', 40, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000009', (SELECT id FROM exercises WHERE name='Warrior Pull-up' LIMIT 1), 1, 4, 8),
('t1000000-0000-0000-0000-000000000009', (SELECT id FROM exercises WHERE name='Samurai Row' LIMIT 1), 2, 4, 10),
('t1000000-0000-0000-0000-000000000009', (SELECT id FROM exercises WHERE name='Water Flow' LIMIT 1), 3, 3, 12),
('t1000000-0000-0000-0000-000000000009', (SELECT id FROM exercises WHERE name='Blade Curl' LIMIT 1), 4, 3, 12),
('t1000000-0000-0000-0000-000000000009', (SELECT id FROM exercises WHERE name='Void Pull' LIMIT 1), 5, 3, 15);

-- Template 10: Shadow Emperor
INSERT INTO workout_templates (id, name, kanji, description, difficulty, duration, is_custom) VALUES
('t1000000-0000-0000-0000-000000000010', 'Shadow Emperor', '影帝', 'The ultimate full-body gauntlet for masters', 'warrior', 55, false);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps) VALUES
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Storm Burpee' LIMIT 1), 1, 5, 12),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Steel Deadlift' LIMIT 1), 2, 5, 10),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Warrior Pull-up' LIMIT 1), 3, 5, 10),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Oni Slam' LIMIT 1), 4, 4, 12),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Rising Dragon' LIMIT 1), 5, 4, 8),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Dragon Fly' LIMIT 1), 6, 3, 30),
('t1000000-0000-0000-0000-000000000010', (SELECT id FROM exercises WHERE name='Hollow Hold' LIMIT 1), 7, 3, 30);
