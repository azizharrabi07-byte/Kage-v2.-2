export interface WorkoutProgram {
  id: string;
  nameKanji: string;
  nameEnglish: string;
  difficulty: number;
  duration: string;
  workoutCount: number;
  equipmentNeeded: boolean;
  description: string;
  moves: { name: string; image: string; sets?: number; reps?: number }[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: number;
  equipmentNeeded: boolean;
  moves?: { name: string; sets: number; reps: number }[];
}

export interface UserProgram {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  goal: string;
  exercises: { name: string; sets: number; reps: number }[];
  equipmentNeeded: boolean;
  createdAt: number;
}

export interface Meal {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}

export interface LoggedSet {
  reps: number;
  weight: number;
  timestamp: number;
}

export interface ExerciseLog {
  name: string;
  sets: LoggedSet[];
  targetSets: number;
  targetReps: number;
}

export interface WorkoutSession {
  id: string;
  programName: string;
  date: string;
  duration: number;
  exercises: ExerciseLog[];
  verified: boolean;
  verificationMethod?: 'pushupAI' | 'gymPhoto' | 'none';
}

export interface Pact {
  partnerName: string;
  partnerLevel: number;
  avatar: string;
  sharedStreak: number;
  shieldIntact: boolean;
  jointWorkoutCount: number;
  targetCount: number;
  history: { date: string; workoutName: string; duration: string }[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  streak: number;
  honorPoints: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  timestamp: string;
  isProverb?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardXP?: number;
  rewardTitle?: string;
  rewardSkin?: string;
  condition: (stats: AchievementStats) => boolean;
  progress?: (stats: AchievementStats) => number;
}

export interface AchievementStats {
  totalWorkouts: number;
  verifiedWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  bestStreak: number;
  totalXP: number;
  hydrationDays: number;
  pactWorkouts: number;
  bestFormScore: number;
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imagePlaceholder: string;
  imageUrl?: string;
}

export interface ExercisePR {
  max1RM: number;
  maxWeight: number;
  maxReps: number;
  bestSet: LoggedSet | null;
  history: { date: string; weight: number; reps: number; estimated1RM: number }[];
}

export interface NutritionLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  time: string;
}

export interface NutritionDay {
  date: string;
  meals: NutritionLog[];
  waterCups: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export type TabName = '家' | '武' | '道' | '造' | '先' | '异' | '魂';
