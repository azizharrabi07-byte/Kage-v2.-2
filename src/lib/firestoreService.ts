import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc, updateDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import type { WorkoutSession, UserProgram, NutritionDay, NutritionLog, ExercisePR, LoggedSet } from '../types';

function getUserId(): string {
  const { auth } = require('../firebase');
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  return user.uid;
}

async function safeGet<T>(path: string): Promise<T | null> {
  try {
    const snap = await getDoc(doc(db, path));
    return snap.exists() ? (snap.data() as T) : null;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, path);
    return null;
  }
}

async function safeSet<T>(path: string, data: T): Promise<void> {
  try {
    await setDoc(doc(db, path), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, path);
  }
}

export const firestoreService = {
  // === Workout Sessions ===
  async addWorkout(uid: string, session: WorkoutSession) {
    const ref = doc(collection(db, 'users', uid, 'workouts'));
    await setDoc(ref, { ...session, id: ref.id, createdAt: serverTimestamp() });
    return ref.id;
  },

  async getWorkouts(uid: string): Promise<WorkoutSession[]> {
    try {
      const q = query(collection(db, 'users', uid, 'workouts'), orderBy('date', 'desc'), limit(200));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as unknown as WorkoutSession));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}/workouts`);
      return [];
    }
  },

  async getRecentWorkouts(uid: string, count = 10): Promise<WorkoutSession[]> {
    try {
      const q = query(collection(db, 'users', uid, 'workouts'), orderBy('date', 'desc'), limit(count));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as unknown as WorkoutSession));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}/workouts`);
      return [];
    }
  },

  async updateWorkout(uid: string, workoutId: string, data: Partial<WorkoutSession>) {
    return safeSet(`users/${uid}/workouts/${workoutId}`, data);
  },

  // === User Programs ===
  async saveProgram(uid: string, program: UserProgram) {
    const ref = doc(collection(db, 'users', uid, 'programs'));
    await setDoc(ref, { ...program, id: ref.id, createdAt: serverTimestamp() });
    return ref.id;
  },

  async getPrograms(uid: string): Promise<UserProgram[]> {
    try {
      const q = query(collection(db, 'users', uid, 'programs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as unknown as UserProgram));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}/programs`);
      return [];
    }
  },

  async deleteProgram(uid: string, programId: string) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'programs', programId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/programs/${programId}`);
    }
  },

  // === Nutrition ===
  async logMeal(uid: string, meal: NutritionLog) {
    const ref = doc(collection(db, 'users', uid, 'meals'));
    await setDoc(ref, { ...meal, id: ref.id, createdAt: serverTimestamp() });
    return ref.id;
  },

  async getMealsByDate(uid: string, date: string): Promise<NutritionLog[]> {
    try {
      const q = query(collection(db, 'users', uid, 'meals'), where('date', '==', date));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as unknown as NutritionLog));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}/meals`);
      return [];
    }
  },

  async deleteMeal(uid: string, mealId: string) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'meals', mealId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/meals/${mealId}`);
    }
  },

  // === Nutrition Days (aggregated) ===
  async getNutritionDay(uid: string, date: string): Promise<NutritionDay | null> {
    return safeGet(`users/${uid}/nutritionDays/${date}`);
  },

  async saveNutritionDay(uid: string, day: NutritionDay) {
    return safeSet(`users/${uid}/nutritionDays/${day.date}`, day);
  },

  // === Achievements ===
  async getAchievements(uid: string) {
    try {
      const snap = await getDoc(doc(db, 'users', uid, 'progress', 'achievements'));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}/progress/achievements`);
      return null;
    }
  },

  async saveAchievements(uid: string, data: Record<string, unknown>) {
    return safeSet(`users/${uid}/progress/achievements`, data);
  },

  // === Exercise PRs ===
  async getPRs(uid: string): Promise<Record<string, ExercisePR> | null> {
    return safeGet(`users/${uid}/progress/prs`);
  },

  async savePRs(uid: string, prs: Record<string, ExercisePR>) {
    return safeSet(`users/${uid}/progress/prs`, prs);
  },

  // === User Settings (Ronin mode, shadow mode, etc.) ===
  async getSettings(uid: string): Promise<Record<string, unknown> | null> {
    return safeGet(`users/${uid}/settings`);
  },

  async saveSettings(uid: string, settings: Record<string, unknown>) {
    return safeSet(`users/${uid}/settings`, settings);
  },

  // === Bounties ===
  async getBounties(uid: string) {
    try {
      const q = query(collection(db, 'bounties'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'bounties');
      return [];
    }
  },

  async claimBounty(uid: string, bountyId: string) {
    return safeSet(`users/${uid}/bounties/${bountyId}`, { claimedAt: serverTimestamp() });
  },

  // === Weekly Challenges ===
  async getWeeklyChallenge() {
    try {
      const q = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'challenges');
      return null;
    }
  },
};
