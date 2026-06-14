export interface Exercise {
  id: string;
  name: string;
  kanji: string;
  description: string;
  category: 'strength' | 'cardio' | 'stretching' | 'bodyweight' | 'calisthenics';
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  instructions: string[];
  tips: string[];
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  benefits: string[];
}

export interface ExerciseCategory {
  id: string;
  name: string;
  kanji: string;
  description: string;
}
