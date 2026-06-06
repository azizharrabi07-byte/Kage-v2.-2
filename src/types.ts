/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkoutProgram {
  id: string;
  nameKanji: string;
  nameEnglish: string;
  difficulty: number; // 1-5 swords
  duration: string;
  workoutCount: number;
  equipmentNeeded: boolean;
  description: string;
  moves: { name: string, image: string }[];
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

export interface Pact {
  partnerName: string;
  partnerLevel: number;
  avatar: string;
  sharedStreak: number;
  shieldIntact: boolean;
  jointWorkoutCount: number;
  targetCount: number;
  history: {
    date: string;
    workoutName: string;
    duration: string;
  }[];
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
}

export type TabName = '家' | '武' | '道' | '先' | '异' | '魂'; // Home, Train, Dojo, Sensei, Evolve, Soul
