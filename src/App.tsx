/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Shield, 
  ShieldAlert, 
  Swords, 
  Award, 
  Dumbbell, 
  User, 
  CupSoda, 
  Send, 
  Sparkles, 
  Lock, 
  Plus, 
  Volume2, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  Target, 
  X, 
  Activity, 
  ChevronDown, 
  ChevronRight,
  RefreshCw,
  Droplet,
  Compass,
  Utensils,
  BookOpen,
  Hammer
} from 'lucide-react';

import { IMAGES } from './assets';
import { KageAudio } from './audio';
import { TabName, WorkoutProgram, Meal, Pact, LeaderboardUser, ChatMessage, Achievement, UserProgram, WorkoutSession, ExerciseLog, LoggedSet, TrainingPlan } from './types';
import { exercises } from './data/exercises';
import { setTrainingExercises, generatePrograms } from './utils/programGenerator';
import { useWorkoutHistory, useExercisePRs } from './hooks/useWorkoutHistory';
import { useAchievements } from './hooks/useAchievements';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import ThreeDCard from './components/ThreeDCard';
import TiltCard3D from './components/TiltCard3D';
import CinematicTransition, { StaggerList, StaggerItem } from './components/CinematicTransition';
import { Toaster } from 'sonner';
import { EnergySphereScene } from './components/FloatingEnergySphere';
import { ProgramCard, ProgramDetailBoard } from './components/ProgramBoard';
import RestTimer from './components/RestTimer';
import CameraCheckIn from './components/CameraCheckIn';
import PushupVerification from './components/PushupVerification';
import StatsBoard from './components/StatsBoard';
import LeaderboardBoard from './components/LeaderboardBoard';
import ParallaxHero from './components/ParallaxHero';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase } from './lib/supabaseClient';
import { Toaster as HotToaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

const EpicLanding = React.lazy(() => import('./components/EpicLanding'));
const HomeTab = React.lazy(() => import('./components/HomeTab'));
const TrainTab = React.lazy(() => import('./components/TrainTab'));
const DojoTab = React.lazy(() => import('./components/DojoTab'));
const SenseiTab = React.lazy(() => import('./components/SenseiTab'));
const FuelTab = React.lazy(() => import('./components/FuelTab'));
const SoulTab = React.lazy(() => import('./components/SoulTab'));
const BattleChallenge = React.lazy(() => import('./components/BattleChallenge'));
const PoseDetector = React.lazy(() => import('./components/PoseDetector'));
const WorkoutComplete = React.lazy(() => import('./components/WorkoutComplete'));
const ProgramBuilder = React.lazy(() => import('./components/ProgramBuilder'));

function LazyFallback({ isLight }: { isLight: boolean }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-stone-100' : 'bg-[#0A0A0F]'}`}>
      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
        {/* Pulsing logo area */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} />
          <div className={`h-4 w-28 rounded animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} />
        </div>

        {/* Pulsing content bars */}
        <div className="w-full space-y-3">
          <div className={`h-3 rounded animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} style={{ width: '92%' }} />
          <div className={`h-3 rounded animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} style={{ width: '78%' }} />
          <div className={`h-3 rounded animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} style={{ width: '85%' }} />
          <div className={`h-3 rounded animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} style={{ width: '64%' }} />
        </div>

        {/* Pulsing card skeletons */}
        <div className="w-full space-y-2.5 mt-2">
          <div className={`h-20 rounded-xl animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} />
          <div className={`h-20 rounded-xl animate-pulse ${isLight ? 'bg-stone-200' : 'bg-zinc-800/70'}`} />
        </div>

        <span className={`text-[10px] font-mono tracking-widest animate-pulse ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>LOADING DOJO...</span>
      </div>
    </div>
  );
}

// Realistic Mock Data for KAGE Premium V2
const MOCK_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'p1',
    nameKanji: '鉄体',
    nameEnglish: 'IRON PHYSICAL',
    difficulty: 5,
    duration: '45 min',
    workoutCount: 18,
    equipmentNeeded: true,
    description: 'Forge an impenetrable armor of physical strength using barbells, kettlebells, and heavy discipline.',
    moves: [
      { name: 'Barbell Cleans (5x5)', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=300' },
      { name: 'Kettlebell Red-Sun Swings (4x20)', image: 'https://images.unsplash.com/photo-1576020584289-53e390cbf063?auto=format&fit=crop&q=80&w=300' },
      { name: 'Weighted Pull-Ups (+15kg, 4x6)', image: 'https://images.unsplash.com/photo-1598971442436-1eec612a4c1f?auto=format&fit=crop&q=80&w=300' },
      { name: 'Heavy Landmine Presses (3x12)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300' }
    ]
  },
  {
    id: 'p2',
    nameKanji: '影武',
    nameEnglish: 'SHADOW WARRIOR',
    difficulty: 4,
    duration: '35 min',
    workoutCount: 12,
    equipmentNeeded: true,
    description: 'High-velocity compound movements optimized for explosive speed, fast reflex reaction, and muscle cut.',
    moves: [
      { name: 'Snatch-Grip Deadlifts (4x6)', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&q=80&w=300' },
      { name: 'Dumbbell Renegade Rows (3x12)', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300' },
      { name: 'Plyo Box Jumps (5x10)', image: 'https://images.unsplash.com/photo-1627483291617-d2eab16c8052?auto=format&fit=crop&q=80&w=300' },
      { name: 'Cable Woodchops (3x15)', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=300' }
    ]
  },
  {
    id: 'p3',
    nameKanji: '息吹',
    nameEnglish: 'PNEUMA FLOW',
    difficulty: 2,
    duration: '20 min',
    workoutCount: 8,
    equipmentNeeded: false,
    description: 'Unassisted metabolic body-sculpting focusing on spatial control, functional elasticity, and lung extension.',
    moves: [
      { name: 'Hindu Push-Ups (4x20)', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?auto=format&fit=crop&q=80&w=300' },
      { name: 'Cosmic Archer Squats (3x15)', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&q=80&w=300' },
      { name: 'Pistol Squats (3x8 per leg)', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=300' },
      { name: 'Core L-Sit Holds (4x15s)', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300' }
    ]
  },
  {
    id: 'p4',
    nameKanji: '疾風',
    nameEnglish: 'GALE-FORCE WIND',
    difficulty: 4,
    duration: '25 min',
    workoutCount: 15,
    equipmentNeeded: false,
    description: 'Aggressive bodyweight interval flows. Shred fat layers to expose the sharp sinews beneath.',
    moves: [
      { name: 'Clapping Push-Ups (4x12)', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300' },
      { name: 'Explosive Jump Lunges (4x20)', image: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&q=80&w=300' },
      { name: 'Burpee-to-Sprawl Overload (3x15)', image: 'https://images.unsplash.com/photo-1627393100177-b4297e5b6def?auto=format&fit=crop&q=80&w=300' },
      { name: 'Hollow Body Rockers (4x40s)', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300' }
    ]
  }
];

const MOCK_TRAINING_PLANS: { id: string; name: string; description: string; duration: string; difficulty: number; equipmentNeeded: boolean }[] = [
  { id: 'tp1', name: 'IRON ASCENSION', description: 'Progressive compound lifts for raw power.', duration: '55 min', difficulty: 4, equipmentNeeded: true },
  { id: 'tp2', name: 'SHRED STORM', description: 'High rep burn-out to carve definition.', duration: '35 min', difficulty: 3, equipmentNeeded: true },
  { id: 'tp3', name: 'CABLE FURY', description: 'Cable-only full body tension work.', duration: '40 min', difficulty: 2, equipmentNeeded: true },
  { id: 'tp4', name: 'CALISTHENIC GOD', description: 'Bodyweight mastery with progressive holds.', duration: '30 min', difficulty: 3, equipmentNeeded: false },
  { id: 'tp5', name: 'HIIT SAMURAI', description: 'Explosive intervals for fat loss.', duration: '20 min', difficulty: 4, equipmentNeeded: false },
  { id: 'tp6', name: 'FLEX RECOVERY', description: 'Mobility flow for joint health.', duration: '25 min', difficulty: 1, equipmentNeeded: false },
];

const MOCK_MEAL_PLANS: Record<'shred' | 'bulk' | 'maintain', Meal[]> = {
  shred: [
    { id: 'm1', name: 'Steamed Red-Sun Sea Bass', protein: 38, carbs: 12, fat: 6, calories: 250, image: '🐟' },
    { id: 'm2', name: 'Sumi Chicken Breast + Asparagus', protein: 44, carbs: 8, fat: 4, calories: 240, image: '🍗' },
    { id: 'm3', name: 'Almond Green Tempeh Stir-fry', protein: 28, carbs: 18, fat: 12, calories: 290, image: '🥗' },
    { id: 'm10', name: 'Seared Tuna & Wakame Salad', protein: 40, carbs: 6, fat: 8, calories: 260, image: '🥬' },
    { id: 'm11', name: 'Egg White & Spinach Muffins', protein: 32, carbs: 4, fat: 3, calories: 180, image: '🥚' },
    { id: 'm12', name: 'Matcha Protein Smoothie Bowl', protein: 35, carbs: 22, fat: 5, calories: 275, image: '🍵' }
  ],
  bulk: [
    { id: 'm4', name: 'Sumo Soy Beef Rice Bowl', protein: 55, carbs: 80, fat: 18, calories: 700, image: '🥩' },
    { id: 'm5', name: 'Sesame Peanut Soba with Tofu', protein: 32, carbs: 95, fat: 22, calories: 710, image: '🍜' },
    { id: 'm6', name: 'Miso Wild Egg Avocado Toast', protein: 26, carbs: 55, fat: 20, calories: 500, image: '🥑' },
    { id: 'm13', name: 'Double Chicken Teriyaki Don', protein: 65, carbs: 88, fat: 16, calories: 780, image: '🍚' },
    { id: 'm14', name: 'Salmon & Sweet Potato Hash', protein: 48, carbs: 65, fat: 22, calories: 650, image: '🍠' },
    { id: 'm15', name: 'Peanut Butter Overnight Oats', protein: 38, carbs: 72, fat: 24, calories: 620, image: '🥣' }
  ],
  maintain: [
    { id: 'm7', name: 'Teriyaki Wild Salmon Bowl', protein: 42, carbs: 45, fat: 14, calories: 470, image: '🍣' },
    { id: 'm8', name: 'Steamed Sea Shell Quinoa Mix', protein: 30, carbs: 50, fat: 10, calories: 410, image: '🍛' },
    { id: 'm9', name: 'Spiced Edamame Tofu Mash', protein: 24, carbs: 35, fat: 8, calories: 310, image: '🍡' },
    { id: 'm16', name: 'Grilled Chicken & Couscous', protein: 45, carbs: 42, fat: 12, calories: 445, image: '🍗' },
    { id: 'm17', name: 'Tuna Stuffed Bell Peppers', protein: 38, carbs: 18, fat: 9, calories: 315, image: '🌶️' },
    { id: 'm18', name: 'Greek Yogurt & Berry Parfait', protein: 28, carbs: 32, fat: 5, calories: 285, image: '🫐' }
  ]
};

const INITIAL_PACT: Pact = {
  partnerName: "Kazuma #8821",
  partnerLevel: 14,
  avatar: "🧬",
  sharedStreak: 15,
  shieldIntact: true,
  jointWorkoutCount: 22,
  targetCount: 30,
  history: [
    { date: "Yesterday, 18:42", workoutName: "IRON PHYSICAL - Day 11", duration: "45 min" },
    { date: "June 03, 07:12", workoutName: "PNEUMA FLOW - Day 8", duration: "20 min" },
    { date: "June 01, 19:30", workoutName: "GALE-FORCE WIND - Day 6", duration: "25 min" }
  ]
};

const INITIAL_MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Ryuden", level: 22, streak: 89, honorPoints: 4850, avatar: "🐉" },
  { rank: 2, name: "GhostKatana", level: 19, streak: 54, honorPoints: 3410, avatar: "⚔️" },
  { rank: 3, name: "KuroGane", level: 17, streak: 41, honorPoints: 2980, avatar: "🌋" },
  { rank: 4, name: "You (KAGE Master)", level: 16, streak: 15, honorPoints: 2450, avatar: "👺", isCurrentUser: true },
  { rank: 5, name: "Kazuma #8821", level: 14, streak: 15, honorPoints: 2110, avatar: "🧬" },
  { rank: 6, name: "SumiFist", level: 12, streak: 28, honorPoints: 1920, avatar: "👊" },
  { rank: 7, name: "Hanzo_Red", level: 11, streak: 8, honorPoints: 1440, avatar: "🏮" },
  { rank: 8, name: "SilentGlow", level: 9, streak: 12, honorPoints: 1100, avatar: "🌌" },
  { rank: 9, name: "TokyoRonin", level: 8, streak: 3, honorPoints: 850, avatar: "🏔️" },
  { rank: 10, name: "KidSaber", level: 6, streak: 1, honorPoints: 515, avatar: "🍡" }
];

export default function App() {
  const user = useAuthStore((s) => s.user);
  const authLoading = !useAuthStore((s) => s.initialized);
  const initialize = useAuthStore((s) => s.initialize);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabName>('家');

  const [landingTheme, setLandingTheme] = useState<'dark' | 'light'>('dark');
  const isLight = landingTheme === 'light';

  // App core state
  const [streak, setStreak] = useState(15);
  const [isBattleCryActive, setIsBattleCryActive] = useState(true);
  const [battleCryText, setBattleCryText] = useState('CRUSH THE MIDWEEK WEAKNESS. ROKUBON CORPS BEGINS AT 18:00!');
  const [battleCryTimer, setBattleCryTimer] = useState('11:42'); // Countdown inside 15 min
  const [pactData, setPactData] = useState<Pact>(INITIAL_PACT);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_MOCK_LEADERBOARD);
  
  // Custom stats for SVG Spider Graph
  const [stats, setStats] = useState({
    Strength: 78,
    Speed: 82,
    Spirit: 90,
    Focus: 65,
    Endurance: 74
  });

  const [waterCups, setWaterCups] = useState<boolean[]>([true, true, true, true, false, false, false, false]);

  // Persistence hooks
  const { workouts, setWorkouts, addWorkout, getTotalWorkouts, getVerifiedWorkouts, getTotalVolume, getCurrentStreak, getBestStreak, getWeeklyVolume, getMaxVolumeSession, compute1RM } = useWorkoutHistory();
  const { prs, updatePRs, checkNewPR } = useExercisePRs();
  const { achievements, setAchievements, xp, setXp, bonusXP, checkAchievements, getProgress, stats: achievementStats } = useAchievements(
    getTotalWorkouts(), getVerifiedWorkouts(), getTotalVolume(), getCurrentStreak(), waterCups.filter(c => c).length, 0, 0, 0
  );

  // User programs (Build tool)
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>(() => {
    try { return JSON.parse(localStorage.getItem('kage_user_programs') || '[]'); }
    catch { return []; }
  });
  const saveUserProgram = (prog: UserProgram) => {
    const updated = [...userPrograms, prog];
    setUserPrograms(updated);
    localStorage.setItem('kage_user_programs', JSON.stringify(updated));
  };

  // Active workout exercise logging
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimerDuration, setRestTimerDuration] = useState(90);
  const [restTimerKey, setRestTimerKey] = useState(0);

  // Training Plan Selection
  const [trainingSubTab, setTrainingSubTab] = useState<'eq' | 'zero'>('eq');
  const [trainingInnerTab, setTrainingInnerTab] = useState<'plans' | 'track' | 'build'>('plans');
  const [mealPlanType, setMealPlanType] = useState<'shred' | 'bulk' | 'maintain'>('shred');
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

  // Generated zero-equipment programs (bodyweight only)
  const [generatedZeroEquipPrograms] = useState<WorkoutProgram[]>(() => 
    generatePrograms({ goal: 'strength', difficulty: 3, duration: 8, frequency: 4, equipment: 'none' })
  );

  // Active workout execution overlay state
  const [activeRunningProgram, setActiveRunningProgram] = useState<WorkoutProgram | null>(null);
  const [runningTimer, setRunningTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Sensei Chat State
  const [queryInput, setQueryInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'sensei',
      text: 'Hail, warrior. I am your electronic Mentor. Speak with intent, and I shall sharpen your physical armor and core discipline.',
      timestamp: '15:23'
    }
  ]);
  const [isSenseiTyping, setIsSenseiTyping] = useState(false);

  // Modals management
  const [isBattleCryModalOpen, setIsBattleCryModalOpen] = useState(false);
  const [isForgeModalOpen, setIsForgeModalOpen] = useState(false);
  const [isPartnerProfileOpen, setIsPartnerProfileOpen] = useState(false);
  const [isOathOpen, setIsOathOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [alertModal, setAlertModal] = useState<{ message: string } | null>(null);
  const [showBattleChallenge, setShowBattleChallenge] = useState(false);
  const [showPoseDetector, setShowPoseDetector] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);
  const [workoutCompleteData, setWorkoutCompleteData] = useState<{
    programName: string; duration: number; totalSets: number;
    totalVolume: number; newPRs: { name: string }[]; xpEarned: number;
    achievementsUnlocked: string[];
  } | null>(null);
  const [shadowMode, setShadowMode] = useState(() => localStorage.getItem('shadow_mode') === 'true');
  const [gymPhotos, setGymPhotos] = useState<string[]>(() => {
      try { return JSON.parse(localStorage.getItem('gym_photos') || '[]').map((p: { url: string }) => p.url); } catch (error) { console.warn('[Storage] Failed to parse gym photos:', error); return []; }
  });

  // Forge code states
  const [forgeTab, setForgeTab] = useState<'create' | 'join'>('create');
  const [generatedCode, setGeneratedCode] = useState('819 025');
  const [enteredCode, setEnteredCode] = useState('');

  // 4-step Oath Wizard
  const [oathStep, setOathStep] = useState(1);

  // Sound and Ambiance toggle
  const [isMuted, setIsMuted] = useState(false);

  // Local proverbs set
  const senseiWidgetProverbs = [
    "Choose the heavy path, warrior. Sleep is sweet, but triumph lasts ages.",
    "Steel is forged on the anvil of raw fatigue. Respect the sweat.",
    "A warrior looks in the glass and sees only an unfinished sword. Stay humble.",
    "An interactive mind cannot be shattered by standard earthly noises.",
    "Water wears down raw diamond by sheer repetitious impacts. Repeat the training!"
  ];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // 3D Parallax Mouse Tracking for Premium Hero Image
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const imageScale = 1.05; 
  const xTransform = useTransform(smoothMouseX, [0, 1], ["-2%", "2%"]);
  const yTransform = useTransform(smoothMouseY, [0, 1], ["-2%", "2%"]);
  const floatX = useTransform(smoothMouseX, [0, 1], ["10px", "-10px"]);
  const floatY = useTransform(smoothMouseY, [0, 1], ["10px", "-10px"]);
  
  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (currentTab !== '家') return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleGlobalMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Battle cry timer simulated countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setBattleCryTimer(prev => {
        const [minStr, secStr] = prev.split(':');
        let m = parseInt(minStr, 10);
        let s = parseInt(secStr, 10);
        if (s > 0) {
          s--;
        } else if (m > 0) {
          m--;
          s = 59;
        } else {
          return "15:00"; // Reset
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Supabase auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Listen to user data
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (typeof data.streak === 'number') setStreak(data.streak);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });
    return () => unsub();
  }, [user]);

  // Persist shadow mode
  useEffect(() => {
    localStorage.setItem('shadow_mode', String(shadowMode));
  }, [shadowMode]);

  // Initialize program generator with exercises data
  useEffect(() => {
    setTrainingExercises(exercises);
    console.log('[KAGE] Program generator initialized with', exercises.length, 'exercises');
  }, []);

  // Active workout timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && activeRunningProgram) {
      interval = setInterval(() => {
        setRunningTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeRunningProgram]);

  // Sensei AI verification state
  const [senseiVerifyFeedback, setSenseiVerifyFeedback] = useState<string | null>(null);
  const [senseiVerifyLoading, setSenseiVerifyLoading] = useState(false);
  const [senseiVerifyError, setSenseiVerifyError] = useState(false);

  const handleSenseiVerify = async () => {
    const currentEx = exerciseLogs[currentExerciseIndex];
    if (!currentEx || currentEx.sets.length === 0) {
      setSenseiVerifyFeedback("Log at least one set first before asking Sensei to verify your form.");
      setSenseiVerifyError(true);
      return;
    }

    setSenseiVerifyLoading(true);
    setSenseiVerifyFeedback(null);
    setSenseiVerifyError(false);

    const setLog = currentEx.sets.map((s, i) =>
      `Set ${i + 1}: ${s.reps} reps${s.weight > 0 ? ` @ ${s.weight}kg` : ''}`
    ).join('\n');

    const prompt = `As a fitness Sensei/AI coach, analyze this exercise performance:

Exercise: ${currentEx.name}
Target: ${currentEx.targetSets} sets × ${currentEx.targetReps} reps
Logged sets:
${setLog}

Provide:
1. A brief form/technique tip specific to this exercise
2. Whether the logged volume is appropriate
3. One motivational push to finish strong

Keep it to 3-4 short sentences. Be direct and authoritative like a martial arts master.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: [],
        }),
      });
      const data = await response.json();
      setSenseiVerifyFeedback(data.text || 'Sensei nods in approval. Continue your path.');
      setSenseiVerifyError(false);
    } catch {
      setSenseiVerifyFeedback("Sensei's vision is clouded. Check your connection and try again, warrior.");
      setSenseiVerifyError(true);
    } finally {
      setSenseiVerifyLoading(false);
    }
  };

  // Voice command handlers
  const voiceHandlers = useMemo(() => ({
    onNextExercise: () => {
      if (currentExerciseIndex < exerciseLogs.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setRestTimerKey(prev => prev + 1);
      }
    },
    onPrevExercise: () => {
      if (currentExerciseIndex > 0) {
        setCurrentExerciseIndex(prev => prev - 1);
        setRestTimerKey(prev => prev + 1);
      }
    },
    onLogSet: () => {
      const repsInput = document.getElementById(`reps-input-${currentExerciseIndex}`) as HTMLInputElement;
      const weightInput = document.getElementById(`weight-input-${currentExerciseIndex}`) as HTMLInputElement;
      const reps = parseInt(repsInput?.value || '0') || 0;
      const weight = parseInt(weightInput?.value || '0') || 0;
      if (reps <= 0) return;
      const newSet: LoggedSet = { reps, weight, timestamp: Date.now() };
      setExerciseLogs(prev => prev.map((log, i) =>
        i === currentExerciseIndex ? { ...log, sets: [...log.sets, newSet] } : log
      ));
      updatePRs(exerciseLogs[currentExerciseIndex]?.name || '', weight, reps);
      if (repsInput) repsInput.value = String(exerciseLogs[currentExerciseIndex]?.targetReps || '10');
      if (weightInput) weightInput.value = '0';
      setRestTimerKey(prev => prev + 1);
    },
    onSkipSet: () => {
      const newSet: LoggedSet = { reps: 0, weight: 0, timestamp: Date.now() };
      setExerciseLogs(prev => prev.map((log, i) =>
        i === currentExerciseIndex ? { ...log, sets: [...log.sets, newSet] } : log
      ));
      setRestTimerKey(prev => prev + 1);
    },
    onPause: () => setIsRunning(false),
    onResume: () => setIsRunning(true),
    onFinish: () => {
      const totalSets = exerciseLogs.reduce((sum, log) => sum + log.sets.length, 0);
      if (totalSets === 0) return;
      const session: WorkoutSession = {
        id: `ws_${Date.now()}`,
        programName: activeRunningProgram?.nameEnglish || 'Workout',
        date: new Date().toISOString(),
        duration: runningTimer,
        exercises: exerciseLogs,
        verified: false,
      };
      addWorkout(session);
      setStreak(prev => prev + 1);
      setStats(s => ({
        ...s,
        Strength: Math.min(100, s.Strength + 2),
        Endurance: Math.min(100, s.Endurance + 3)
      }));
      const newUnlocks = checkAchievements();
      const totalVolume = exerciseLogs.reduce((s, log) => s + log.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0);
      setWorkoutCompleteData({
        programName: activeRunningProgram?.nameEnglish || 'Workout',
        duration: runningTimer,
        totalSets,
        totalVolume,
        newPRs: newUnlocks.length > 0 ? [{ name: 'Achievement Unlocked' }] : [],
        xpEarned: totalSets * 10 + Math.floor(runningTimer / 60),
        achievementsUnlocked: newUnlocks,
      });
      setShowWorkoutComplete(true);
    },
    onStartRestTimer: () => setRestTimerKey(prev => prev + 1),
  }), [currentExerciseIndex, exerciseLogs, activeRunningProgram, runningTimer]);

  const { isListening: voiceListening, toggleListening: voiceToggle, lastCommand, isSupported: voiceSupported } = useVoiceCommands(voiceHandlers);

  const soundSafe = useCallback((type: 'clash' | 'tap' | 'chime' | 'hum') => {
    if (isMuted) return;
    if (type === 'clash') KageAudio.playSwordClash();
    if (type === 'tap') KageAudio.playHologramTap();
    if (type === 'chime') KageAudio.playEvolveChime();
    if (type === 'hum') KageAudio.playZenHum();
  }, [isMuted]);

  const handleQuerySubmit = async (customAction?: string) => {
    const textToSend = customAction ? `Quick Diamond Select: ${customAction.toUpperCase()}` : queryInput;
    if (!textToSend.trim()) return;

    soundSafe('tap');

    const newUserMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: customAction ? `Seeking Sensei's wisdom regarding: ${customAction.toUpperCase()}` : textToSend,
      timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setQueryInput('');
    setIsSenseiTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          message: textToSend, 
          quickAction: customAction || undefined,
          history: chatMessages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        }),
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      
      const senseiReply: ChatMessage = {
        id: Math.random().toString(),
        sender: 'sensei',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }),
        isProverb: data.proverb
      };

      setChatMessages(prev => [...prev, senseiReply]);
      soundSafe('tap');
    } catch (err) {
      const offlineMsg = senseiWidgetProverbs[Math.floor(Math.random() * senseiWidgetProverbs.length)];
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'sensei',
        text: `[Hologram flickers due to signal density] My artificial synapses are static, but the inner ledger holds this truth: "${offlineMsg}"`,
        timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
      }]);
    } finally {
      setIsSenseiTyping(false);
    }
  };

  const fillWaterCup = useCallback((index: number) => {
    soundSafe('tap');
    const updated = [...waterCups];
    updated[index] = !updated[index];
    setWaterCups(updated);

    // If suddenly all cups are complete, trigger the Hydration achievement
    if (updated.every(c => c)) {
      unlockAchievement('hydration_ninja');
    }
  }, [soundSafe, waterCups]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ac => {
      if (ac.id === id && !ac.unlocked) {
        soundSafe('chime');
        // also dynamically boost the 'Spirit' level inside stats
        setStats(s => ({ ...s, Spirit: Math.min(100, s.Spirit + 5) }));
        return { ...ac, unlocked: true };
      }
      return ac;
    }));
  };

  const syncStreak = async (newStreak: number) => {
    setStreak(newStreak);
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { 
          streak: newStreak, 
          updatedAt: serverTimestamp() 
        }, { merge: true });
      } catch (e) {
        console.error("Failed to sync streak", e);
      }
    }
  };

  const handleLeaderboardRefresh = useCallback(() => {
    soundSafe('clash');
    // Simulate slight rotation of points or active user bump
    setLeaderboard(prev => prev.map(user => {
      if (user.isCurrentUser) {
        return { ...user, honorPoints: user.honorPoints + 20 };
      }
      return user;
    }));
  }, [soundSafe]);

  if (authLoading) {
    return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center"><div className="text-rose-500 animate-pulse font-mono tracking-widest text-sm">INITIALIZING KAGE...</div></div>;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LazyFallback isLight={false} />}>
          <EpicLanding
            onGoogleLogin={async () => {
              try {
                const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
                if (error) {
                  const { default: toast } = await import('react-hot-toast');
                  toast.error('Google login not enabled. Use email/password or sign up.');
                }
              } catch {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Google login unavailable. Use email/password.');
              }
            }}
            onEmailLogin={async (email, password) => {
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) {
                const { default: toast } = await import('react-hot-toast');
                toast.error(error.message || 'Login failed');
              }
            }}
            onEmailSignUp={async (email, password) => {
              const { error } = await supabase.auth.signUp({ email, password });
              if (error) {
                const { default: toast } = await import('react-hot-toast');
                toast.error(error.message || 'Sign up failed');
              } else {
                const { default: toast } = await import('react-hot-toast');
                toast.success('Account created! Check your email to confirm, or try logging in.');
              }
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isLight ? '#f5f5f0' : '#0A0A0F',
            color: isLight ? '#1c1917' : '#e4e4e7',
            border: isLight ? '1px solid #e7e5e4' : '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#f0fdf4' },
          },
          error: {
            iconTheme: { primary: '#e31e24', secondary: '#fef2f2' },
          },
        }}
      />
    <div className={`min-h-screen flex flex-col transition-all duration-500 selection:bg-rose-500/30 selection:text-white ${
      isLight ? 'bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 text-stone-900' : 'bg-gradient-to-br from-[#0A0A0F] via-[#0A0A14] to-[#1A0A0F] text-zinc-200'
    }`}>
      {/* 3D Energy Sphere Background */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isLight ? 'opacity-30 mix-blend-multiply' : 'opacity-70 mix-blend-screen'
      }`}>
        <ErrorBoundary>
          <EnergySphereScene isLight={isLight} />
        </ErrorBoundary>
      </div>
      {/* Animated Gradient Background Overlay */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${isLight ? 'bg-animate-light opacity-50' : 'bg-animate-dark opacity-60'}`} />

      {/* DIAGNOSTIC - remove after fixing */}
      <div className="fixed top-0 left-0 z-[99999] bg-rose-600 text-white text-[8px] font-mono px-2 py-0.5">KAGE APP MOUNTED</div>
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${isLight ? 'bg-gradient-to-b from-stone-100/80 via-stone-100/50 to-stone-100' : 'bg-gradient-to-b from-transparent via-[#0A0A0F]/30 to-[#0A0A0F]/80'}`} />
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${isLight ? 'opacity-[0.02]' : 'opacity-[0.03]'} bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:48px_48px]`} />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-3 transition-colors duration-500 ${
        isLight ? 'bg-stone-100/80 backdrop-blur-sm border-b border-stone-200' : 'bg-[#0A0A0F]/80 backdrop-blur-sm border-b border-zinc-800/50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className={`text-xs font-mono tracking-widest ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>DOJO ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => supabase.auth.signOut()}
            className={`text-[10px] font-mono border px-2 py-1 rounded transition-all duration-200 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'border-stone-300 text-stone-500 hover:bg-stone-200' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
          >
            LOGOUT
          </button>
          <button 
            onClick={() => { setIsMuted(!isMuted); if (isMuted) KageAudio.playZenHum(); }}
            className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-zinc-800/50 hover:bg-zinc-700/50'}`}
          >
            <Volume2 className={`w-4 h-4 ${isMuted ? (isLight ? 'text-stone-400' : 'text-zinc-600') : (isLight ? 'text-stone-600' : 'text-zinc-300')}`} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="relative w-full max-w-xl mx-auto min-h-screen z-10 flex flex-col select-none">
        
        {/* Screen/Tab Canvas */}
        <div 
          onMouseMove={handleGlobalMouseMove}
          onMouseLeave={handleGlobalMouseLeave}
          className={`flex-1 overflow-x-hidden overflow-y-auto no-scrollbar pt-16 pb-20 px-5 relative z-25 flex flex-col transition-all duration-500 ease-in-out ${isLight ? 'bg-stone-100/80 text-stone-900' : 'bg-[#0A0A0F]/80 text-zinc-200'}`}>
          <AnimatePresence mode="wait">
          {/* ======================= TAB 1: HOME (家) ======================= */}
          {currentTab === '家' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <HomeTab
                isLight={isLight}
                streak={streak}
                achievements={achievements}
                pactData={pactData}
                battleCryText={battleCryText}
                battleCryTimer={battleCryTimer}
                isBattleCryActive={isBattleCryActive}
                senseiWidgetProverbs={senseiWidgetProverbs}
                currentTipIndex={currentTipIndex}
                soundSafe={soundSafe}
                setLandingTheme={setLandingTheme}
                setActiveRunningProgram={setActiveRunningProgram}
                setExerciseLogs={setExerciseLogs}
                setCurrentExerciseIndex={setCurrentExerciseIndex}
                setRunningTimer={setRunningTimer}
                setIsRunning={setIsRunning}
                setRestTimerDuration={setRestTimerDuration}
                setRestTimerKey={setRestTimerKey}
                setIsPartnerProfileOpen={setIsPartnerProfileOpen}
                setIsBattleCryModalOpen={setIsBattleCryModalOpen}
                setCurrentTipIndex={setCurrentTipIndex}
                mockPrograms={MOCK_PROGRAMS}
              />
            </Suspense>
          )}


          {/* ======================= TAB 2: TRAIN (武) ======================= */}
          {currentTab === '武' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <TrainTab
                isLight={isLight}
                soundSafe={soundSafe}
                MOCK_PROGRAMS={MOCK_PROGRAMS}
                MOCK_TRAINING_PLANS={MOCK_TRAINING_PLANS}
                GENERATED_ZERO_EQUIP_PROGRAMS={generatedZeroEquipPrograms}
                userPrograms={userPrograms}
                trainingSubTab={trainingSubTab}
                setTrainingSubTab={setTrainingSubTab}
                trainingInnerTab={trainingInnerTab}
                setTrainingInnerTab={setTrainingInnerTab}
                setSelectedProgram={setSelectedProgram}
                setActiveRunningProgram={setActiveRunningProgram}
                setExerciseLogs={setExerciseLogs}
                setCurrentExerciseIndex={setCurrentExerciseIndex}
                setRunningTimer={setRunningTimer}
                setIsRunning={setIsRunning}
                setRestTimerDuration={setRestTimerDuration}
                setRestTimerKey={setRestTimerKey}
                saveUserProgram={saveUserProgram}
                getTotalWorkouts={getTotalWorkouts}
                getVerifiedWorkouts={getVerifiedWorkouts}
                getTotalVolume={getTotalVolume}
                getCurrentStreak={getCurrentStreak}
                getBestStreak={getBestStreak}
                getWeeklyVolume={getWeeklyVolume}
                getMaxVolumeSession={getMaxVolumeSession}
                workouts={workouts}
              />
            </Suspense>
          )}


          {/* ======================= TAB 3: DOJO (道) ======================= */}
          {currentTab === '道' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <DojoTab
                isLight={isLight}
                pactData={pactData}
                isBattleCryActive={isBattleCryActive}
                handleLeaderboardRefresh={handleLeaderboardRefresh}
                setIsBattleCryModalOpen={setIsBattleCryModalOpen}
                setIsForgeModalOpen={setIsForgeModalOpen}
                leaderboard={leaderboard}
                soundSafe={soundSafe}
              />
            </Suspense>
          )}


          {/* ======================= TAB 4: BUILD (造) ======================= */}
          {currentTab === '造' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <ProgramBuilder
                isLight={isLight}
                soundSafe={soundSafe}
                onStartTraining={(program) => {
                  setSelectedProgram(program);
                  // Auto-begin the program
                  setActiveRunningProgram(program);
                  setExerciseLogs(program.moves.map((m: any, i: number) => ({
                    name: m.name,
                    sets: [],
                    targetSets: m.sets || 3,
                    targetReps: m.reps || 10
                  })));
                  setCurrentExerciseIndex(0);
                  setRunningTimer(0);
                  setIsRunning(true);
                  setRestTimerDuration(90);
                  setRestTimerKey(prev => prev + 1);
                }}
              />
            </Suspense>
          )}

          {/* ======================= TAB 5: SENSEI (先) ======================= */}
          {currentTab === '先' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <SenseiTab
                isLight={isLight}
                chatMessages={chatMessages}
                isSenseiTyping={isSenseiTyping}
                queryInput={queryInput}
                setQueryInput={setQueryInput}
                handleQuerySubmit={handleQuerySubmit}
                soundSafe={soundSafe}
              />
            </Suspense>
          )}


          {/* ======================= TAB 6: EVOLVE (异) ======================= */}
          {currentTab === '异' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <FuelTab
                isLight={isLight}
                soundSafe={soundSafe}
                mealPlanType={mealPlanType}
                setMealPlanType={setMealPlanType}
                waterCups={waterCups}
                fillWaterCup={fillWaterCup}
                MOCK_MEAL_PLANS={MOCK_MEAL_PLANS}
              />
            </Suspense>
          )}


          {/* ======================= TAB 7: SOUL (魂) ======================= */}
          {currentTab === '魂' && (
            <Suspense fallback={<LazyFallback isLight={isLight} />}>
              <SoulTab
                isLight={isLight}
                soundSafe={soundSafe}
                getTotalWorkouts={getTotalWorkouts}
                xp={xp}
                bonusXP={bonusXP}
                getTotalVolume={getTotalVolume}
                achievements={achievements}
                stats={stats}
                setIsPremiumOpen={setIsPremiumOpen}
                setIsOathOpen={setIsOathOpen}
                setIsMuted={setIsMuted}
                isMuted={isMuted}
                prs={prs}
              />
            </Suspense>
          )}

          </AnimatePresence>

        </div>


        {/* ======================= BOTTOM TAB BAR ======================= */}
        <nav className={`fixed bottom-0 left-0 right-0 h-16 px-2 flex justify-around items-center z-30 transition-colors duration-500 ${isLight ? 'bg-stone-100/90 backdrop-blur-lg border-t border-stone-200' : 'bg-[#0A0A0F]/90 backdrop-blur-lg border-t border-zinc-800/50'}`}>
          {(['家', '武', '道', '造', '先', '异', '魂'] as TabName[]).map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                id={`tab-icon-${tab}`}
                aria-label={`${tab === '家' ? 'Home' : tab === '武' ? 'Train' : tab === '道' ? 'Dojo' : tab === '造' ? 'Build' : tab === '先' ? 'Sensei' : tab === '异' ? 'Fuel' : 'Soul'} tab`}
                onClick={() => {
                  soundSafe('tap');
                  setCurrentTab(tab);
                }}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all relative cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,59,48,0.7)]' : 'opacity-60 hover:opacity-100'}`}
              >
                {isActive && (
                  <div className="absolute -top-1 w-5 h-[2px] bg-rose-500 rounded-full" />
                )}
                <span className={`font-kanji font-black text-lg transition-colors duration-250 ${isActive ? (isLight ? 'text-rose-600' : 'text-neon-crimson') : (isLight ? 'text-stone-500' : 'text-white')}`}>
                  {tab}
                </span>
                
                {/* Visual tiny indicator dot for updates */}
                {tab === '先' && isBattleCryActive && (
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
                {tab === '武' && (
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-rose-500-custom bg-[#C44B3C]" />
                )}
              </button>
            );
          })}
        </nav>

      </div>


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 1: BATTLE CRY NETWORK ============================= */}
      {/* ========================================================================================= */}
      {isBattleCryModalOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-stone-200/90' : 'bg-void/90'} backdrop-blur-md z-50 flex flex-col items-center justify-center p-4`}>
          <div className={`${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-rose-500/40'} rounded-2xl border p-6 w-full max-w-sm space-y-6 shadow-[0_0_40px_rgba(255,59,48,0.3)]`}>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-crimson animate-bounce" />
                <h3 className={`font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'} uppercase tracking-wider text-sm`}>BATTLE CRY DISPATCH</h3>
              </div>
              <button 
                onClick={() => setIsBattleCryModalOpen(false)}
                className={`p-1 ${isLight ? 'text-stone-400 hover:text-stone-800' : 'text-zinc-500 hover:text-white'} transition-colors duration-200 cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
                aria-label="Close battle cry modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${isLight ? 'bg-stone-100 border-stone-200' : 'bg-void border-white/5'} p-4 rounded-xl text-center space-y-2 relative border`}>
              <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'} uppercase`}>REMAINING LIFE SPAN OF TRANSIENT PROVOKE</span>
              <p className="font-mono text-3xl font-black text-[#F2C94C] tracking-widest">{battleCryTimer}</p>
              <p className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'} italic`}>"Sent by Kazuma #8821"</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-rose-400 uppercase block">ACTIVE OUTCRY CORPS MESSAGE:</label>
              <textarea
                value={battleCryText}
                onChange={(e) => setBattleCryText(e.target.value)}
                rows={3}
                className={`w-full ${isLight ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-void border-white/10 text-zinc-200'} border rounded-xl p-3 text-xs font-sans focus:border-rose-500 outline-none resize-none focus-visible:ring-2 focus-visible:ring-rose-500/50`}
              />
            </div>

            <button
              onClick={() => {
                soundSafe('clash');
                setIsBattleCryActive(true);
                setIsBattleCryModalOpen(false);
              }}
              className="w-full neon-shimmer-btn py-3 rounded-lg text-white font-mono font-bold text-xs tracking-widest cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center uppercase focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
            >
              SEND OUTCRY & RALLY SOLDIER
            </button>

          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 2: FORGE ACC CONTRACTS ============================ */}
      {/* ========================================================================================= */}
      {isForgeModalOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-stone-200/90' : 'bg-void/90'} backdrop-blur-md z-50 flex flex-col items-center justify-center p-4`}>
          <div className={`${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-white/10'} rounded-2xl border p-6 w-full max-w-sm space-y-5 shadow-2xl`}>
            
            <div className="flex justify-between items-center">
              <h3 className={`font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'} uppercase tracking-widest text-sm`}>FORGE NEW CONTRACT PACT</h3>
              <button 
                onClick={() => setIsForgeModalOpen(false)}
                className={`p-1 ${isLight ? 'text-stone-400 hover:text-stone-800' : 'text-zinc-500 hover:text-white'} transition-colors duration-200 cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
                aria-label="Close forge modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Modal Tab switch */}
            <div className={`flex ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-void border-white/5'} p-1 rounded-lg border`}>
              <button
                onClick={() => setForgeTab('create')}
                className={`flex-1 text-center py-1.5 rounded-md font-mono text-xs focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${forgeTab === 'create' ? `${isLight ? 'bg-stone-200 text-stone-800' : 'bg-kachi text-white'} font-extrabold` : `${isLight ? 'text-stone-400' : 'text-zinc-500'}`}`}
              >
                CREATE CODE
              </button>
              <button
                onClick={() => setForgeTab('join')}
                className={`flex-1 text-center py-1.5 rounded-md font-mono text-xs focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${forgeTab === 'join' ? `${isLight ? 'bg-stone-200 text-stone-800' : 'bg-kachi text-white'} font-extrabold` : `${isLight ? 'text-stone-400' : 'text-zinc-500'}`}`}
              >
                ENTER KEY
              </button>
            </div>

            {forgeTab === 'create' ? (
              <div className="space-y-4 text-center">
                <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'} leading-relaxed`}>
                  Provide this 6-digit blood key to a trusted companion. When they register it, their health tracker synchronises directly.
                </p>
                <div className={`${isLight ? 'bg-stone-100' : 'bg-void'} p-5 rounded-xl border border-dashed border-rose-500/30`}>
                  <span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'} block uppercase mb-1`}>CONTRACT REGISTRY ID KEY</span>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-rose-400 tracking-wider font-mono">{generatedCode}</p>
                </div>
                <button
                  onClick={() => {
                    soundSafe('tap');
                    // randomize code
                    setGeneratedCode(`${Math.floor(Math.random()*900+100)} ${Math.floor(Math.random()*900+100)}`);
                  }}
                  className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'} uppercase underline`}
                >
                  REGENERATE SECURE VAULT KEY
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Enter the 6-digit cryptographic covenant link code generated by your training sibling:</p>
                <input
                  type="text"
                  placeholder="e.g., 556 121"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className={`w-full ${isLight ? 'bg-stone-100 border-stone-200 text-stone-800' : 'bg-void border-white/10 text-white'} border rounded-xl p-3 text-center text-lg font-mono focus:border-rose-500 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50`}
                />
                <button
                  onClick={() => {
                    soundSafe('clash');
                    if (enteredCode.trim()) {
                      setPactData({
                        ...pactData,
                        partnerName: enteredCode.length > 5 ? `Brother #${enteredCode.substring(0,4)}` : "Forced Ally",
                        sharedStreak: 1
                      });
                      setIsForgeModalOpen(false);
                    }
                  }}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold tracking-widest py-3 rounded-lg cursor-pointer active:scale-[0.97] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
                >
                  SEAL COVENANT pact
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* ======================= OVERLAY MODAL 3: COVENANT/PARTNER SHEET DETAILS ================== */}
      {isPartnerProfileOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-stone-200/90' : 'bg-void/90'} backdrop-blur-md z-50 flex flex-col items-center justify-center p-4`}>
          <div className={`${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-white/10'} rounded-2xl border p-6 w-full max-w-sm space-y-5 shadow-2xl`}>
            
            <div className="flex justify-between items-center">
              <h3 className={`font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'} uppercase tracking-wider text-xs`}>COVENANT PROFILE</h3>
              <button 
                onClick={() => setIsPartnerProfileOpen(false)}
                className={`p-1 ${isLight ? 'text-stone-400 hover:text-stone-800' : 'text-zinc-500 hover:text-white'} transition-colors duration-200 cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
                aria-label="Close partner profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <span className={`text-5xl ${isLight ? 'bg-stone-200' : 'bg-kachi'} w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#2D9C6E]`}>{pactData.avatar}</span>
              <h4 className={`font-bold text-lg ${isLight ? 'text-stone-800' : 'text-white'}`}>{pactData.partnerName}</h4>
              <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Accountability Rank Level: {pactData.partnerLevel}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2D9C6E]/10 border border-[#2D9C6E]/30 text-xs text-emerald-400 font-mono">
                <Shield className="w-4.5 h-4.5" />
                SHIELD INTACT
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono text-[#8E9EAF] uppercase tracking-widest">JOINT STRIKE TIMELINE HISTORY:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                {pactData.history.map((row, idx) => (
                  <div key={idx} className={`${isLight ? 'bg-stone-100 border-stone-200' : 'bg-void border-white/5'} p-2.5 rounded-lg border flex justify-between items-center text-xs`}>
                    <div>
                      <p className={`font-semibold ${isLight ? 'text-stone-800' : 'text-white'}`}>{row.workoutName}</p>
                      <span className={`text-[9px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{row.date}</span>
                    </div>
                    <span className="text-xs font-mono text-[#F2C94C] font-bold">{row.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundSafe('clash');
                setConfirmModal({
                  message: "Are you sure you want to fracture this shield and break your pledge oath?",
                  onConfirm: () => {
                    setPactData({
                      ...pactData,
                      partnerName: "No Pledge Active",
                      sharedStreak: 0,
                      shieldIntact: false,
                      avatar: "🌫️"
                    });
                    setIsPartnerProfileOpen(false);
                  }
                });
              }}
              className="w-full bg-[#9E2A2A] hover:bg-rose-700 text-white font-mono text-xs font-bold py-2.5 rounded-lg cursor-pointer active:scale-[0.97] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
            >
              FRACTURE OATH (BREAK PACT)
            </button>

          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 4: 4-STEP WARRIOR\'S OATH WIZARD ================= */}
      {/* ========================================================================================= */}
      {isOathOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-stone-200/90' : 'bg-void/90'} backdrop-blur-md z-50 flex flex-col items-center justify-center p-4`}>
          <div className={`${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-rose-500/30'} rounded-2xl border p-6 w-full max-w-sm space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]`}>
            
            <div className="flex justify-between items-center">
              <h3 className={`font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'} uppercase tracking-widest text-xs`}>SWEAR SHADOW OATH</h3>
              <span className="text-xs font-mono text-rose-500">{oathStep} / 4 STEPS</span>
            </div>

            <div className="min-h-[140px] flex flex-col justify-center text-center space-y-3">
              {oathStep === 1 && (
                <>
                  <span className="text-3xl">誓</span>
                  <p className={`text-sm font-semibold ${isLight ? 'text-stone-800' : 'text-white'}`}>"I swear to look inside the void before launching training, committing my muscles and heart to constant self-conquest."</p>
                </>
              )}
              {oathStep === 2 && (
                <>
                  <span className="text-3xl">武</span>
                  <p className={`text-sm font-semibold ${isLight ? 'text-stone-800' : 'text-white'}`}>"I declare that sweat is my medicine and consistency is my sword. No day shall melt without direct muscle stimulation."</p>
                </>
              )}
              {oathStep === 3 && (
                <>
                  <span className="text-3xl">道</span>
                  <p className={`text-sm font-semibold ${isLight ? 'text-stone-800' : 'text-white'}`}>"I swear to protect my covenant brother, answering their battle cry instantly and maintaining my shared combat shield."</p>
                </>
              )}
              {oathStep === 4 && (
                <>
                  <span className="text-3xl">魂</span>
                  <p className={`text-sm font-semibold ${isLight ? 'text-stone-800' : 'text-white'}`}>"Under code 432963e9 in the high temple of KAGE, I pledge my unyielding effort for the season of fury."</p>
                </>
              )}
            </div>

            <div className="flex justify-between gap-3">
              {oathStep > 1 && (
                <>
                  <button
                    onClick={() => setOathStep(oathStep - 1)}
                    className={`flex-1 py-2 rounded ${isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-700' : 'bg-[#2A2A3A] hover:bg-zinc-700 text-white'} font-mono text-xs focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
                  >
                    RETREAT
                  </button>
                  
                  {oathStep < 4 ? (
                    <button
                      onClick={() => {
                        soundSafe('tap');
                        setOathStep(oathStep + 1);
                      }}
                      className="flex-1 py-2 rounded bg-rose-500 hover:bg-rose-600 font-mono text-xs text-white focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
                    >
                      DECLARE ACCORD
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundSafe('clash');
                        setIsOathOpen(false);
                        setOathStep(1);
                      }}
                      className="flex-1 py-2 rounded bg-gradient-to-r from-[#F2C94C] to-[#E87A5D] text-black font-extrabold font-mono text-xs focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:outline-none"
                  >
                    SWEAR BLOOD BOND
                  </button>
                )}
                </>
              )}
            </div>

          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 5: PREMIUM GATE LOCK OUT =========================== */}
      {/* ========================================================================================= */}
      {isPremiumOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-stone-200/90' : 'bg-void/90'} backdrop-blur-md z-50 flex flex-col items-center justify-center p-4`}>
          <div className={`${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-yellow-600/50'} rounded-2xl border p-6 w-full max-w-md space-y-6 shadow-[0_0_60px_rgba(242,201,76,0.2)]`}>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Lock className="w-5 h-5 fill-yellow-500/20" />
                <h3 className={`font-mono font-bold uppercase tracking-widest text-sm ${isLight ? 'text-stone-800' : ''}`}>PREMIUM GATE CHAMBER</h3>
              </div>
              <button 
                onClick={() => setIsPremiumOpen(false)}
                className={`p-1 ${isLight ? 'text-stone-400 hover:text-stone-800' : 'text-zinc-500 hover:text-white'} transition-colors duration-200 cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
                aria-label="Close premium modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-200">ASCEND THE MOUNTAIN</h4>
              <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Gain live full-bandwidth Cyber-Sensei neural advice and advanced tracking stats.</p>
            </div>

            {/* Feature Comparision table */}
            <div className={`overflow-hidden border ${isLight ? 'border-stone-200 bg-white/60 divide-stone-200' : 'border-white/5 bg-void/60 divide-white/5'} rounded-xl text-xs divide-y`}>
              <div className={`grid grid-cols-3 p-2.5 font-mono text-[9px] ${isLight ? 'text-stone-400' : 'text-zinc-500'} uppercase`}>
                <span>BENEFIT PROTOCOL</span>
                <span>FREE CADET</span>
                <span className="text-yellow-500 font-bold">SOUL ELITE</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className={`${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Dojo Floor Access</span>
                <span className={`${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Standard</span>
                <span className="text-[#2D9C6E] font-bold">All 48 Modules</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className={`${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Cyber-Sensei Advice</span>
                <span className={`${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Cached Lines Only</span>
                <span className="text-cyan-400 font-mono font-bold">Live Gemini Grid</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className={`${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Simultaneous Pacts</span>
                <span className={`${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Max 1</span>
                <span className="text-[#6A4E9B] font-bold">Infinite Shadows</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className={`${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Synthesised audio loops</span>
                <span className={`${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Fallback only</span>
                <span className="text-[#F2C94C] font-bold">High Hz Zen</span>
              </div>
            </div>

            {/* Shimmering CTA gold buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  soundSafe('clash');
                  setAlertModal({ message: "Swearing allegiance to the Elite Annual pact ($29.99/yr) initiates!" });
                }}
              className="w-full gold-shimmer-btn py-3.5 rounded-xl text-black font-mono font-black tracking-widest text-xs shadow-lg uppercase focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:outline-none"
            >
              ANNUAL ASCENSION ($29.99 / YEAR)
              </button>
              <button
                onClick={() => {
                  soundSafe('clash');
                  setAlertModal({ message: "Forging lifetime supreme shadow covenant ($79.99) initiates!" });
                }}
              className={`w-full bg-gradient-to-r ${isLight ? 'from-stone-200 to-stone-300 text-stone-600 border-stone-300 hover:text-stone-800' : 'from-neutral-800 to-black text-neutral-200 hover:text-white border-neutral-700'} py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none`}
            >
              LIFETIME SOUL ENVELOPE ($79.99)
              </button>
            </div>

          </div>
        </div>
      )}


      {/* Program Detail Board Overlay */}
      {selectedProgram && (
        <ProgramDetailBoard
          program={selectedProgram}
          isLight={isLight}
          onClose={() => setSelectedProgram(null)}
          onBegin={(inputs) => {
            setSelectedProgram(null);
            setActiveRunningProgram(selectedProgram);
            setExerciseLogs(selectedProgram.moves.map((m, i) => ({
              name: m.name,
              sets: [],
              targetSets: inputs[i]?.sets || m.sets || 3,
              targetReps: inputs[i]?.reps || m.reps || 10
            })));
            setCurrentExerciseIndex(0);
            setRunningTimer(0);
            setIsRunning(true);
            setRestTimerDuration(90);
            setRestTimerKey(prev => prev + 1);
          }}
        />
      )}

      {/* ========================================================================================= */}
      {/* ======================= ACTIVE WORKOUT OVERLAY ========================================== */}
      {activeRunningProgram && (
        <div className={`fixed inset-0 z-50 flex flex-col p-6 overflow-y-auto ${
          shadowMode
            ? 'bg-black'
            : isLight ? 'bg-stone-100' : 'bg-[#0A0A0F]'
        }`}>
          {/* Header */}
          <div className="w-full max-w-sm mx-auto flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">ACTIVE PROTOCOL</span>
              <h2 className={`text-lg font-bold tracking-wider ${isLight ? 'text-stone-800' : 'text-white'}`}>{activeRunningProgram.nameEnglish}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShadowMode(!shadowMode)}
                className={`p-2 rounded-full cursor-pointer text-xs font-mono active:scale-90 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${shadowMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : isLight ? 'bg-stone-200 text-stone-500' : 'bg-zinc-800 text-zinc-400'}`}
                title="Shadow Mode"
                aria-label="Toggle shadow mode"
              >
                陰
              </button>
              <button
                onClick={() => {
                  setConfirmModal({
                  message: "Exit training? Progress will be lost!",
                  onConfirm: () => {
                    setActiveRunningProgram(null);
                    setIsRunning(false);
                  }
                });
                }}
                className={`p-2 rounded-full cursor-pointer active:scale-90 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-stone-200 hover:bg-rose-200' : 'bg-zinc-800 hover:bg-rose-500/20'}`}
                aria-label="Close workout"
              >
                <X className={`w-5 h-5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
              </button>
            </div>
          </div>

          {/* Timer + Progress */}
          <div className="w-full max-w-sm mx-auto flex items-center gap-4 mb-4">
            <div className={`flex-1 rounded-xl p-3 border ${isLight ? 'bg-white/80 border-stone-200' : 'bg-zinc-900/80 border-zinc-800/50'} flex items-center gap-3`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-mono ${isLight ? 'bg-stone-200 text-stone-700' : 'bg-zinc-800 text-white'}`}>
                {Math.floor(runningTimer / 60).toString().padStart(2, '0')}
              </div>
              <div>
                <span className={`text-[8px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>ELAPSED</span>
                <span className={`text-xs font-mono block ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{Math.floor(runningTimer / 60)}:{(runningTimer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className={`flex-1 rounded-xl p-3 border ${isLight ? 'bg-white/80 border-stone-200' : 'bg-zinc-900/80 border-zinc-800/50'} flex items-center gap-3`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-mono ${isLight ? 'bg-stone-200 text-stone-700' : 'bg-zinc-800 text-rose-400'}`}>
                {currentExerciseIndex + 1}/{exerciseLogs.length}
              </div>
              <div>
                <span className={`text-[8px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>EXERCISE</span>
                <span className={`text-xs font-mono block truncate max-w-[100px] ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{exerciseLogs[currentExerciseIndex]?.name || '...'}</span>
              </div>
            </div>
          </div>

          {/* Current Exercise Card */}
          {exerciseLogs[currentExerciseIndex] && (
            <div className={`w-full max-w-sm mx-auto rounded-xl p-4 border mb-4 ${isLight ? 'bg-white border-stone-200' : 'bg-zinc-900/80 border-zinc-800/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{exerciseLogs[currentExerciseIndex].name}</h3>
                <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  {exerciseLogs[currentExerciseIndex].targetSets} × {exerciseLogs[currentExerciseIndex].targetReps}
                </span>
              </div>

              {/* Logged Sets */}
              <div className="space-y-1.5 mb-3" aria-live="polite">
                {exerciseLogs[currentExerciseIndex].sets.length === 0 ? (
                  <p className={`text-[10px] font-mono text-center py-4 ${isLight ? 'text-stone-400' : 'text-zinc-600'}`}>No sets logged yet. Add your first set below.</p>
                ) : (
                  exerciseLogs[currentExerciseIndex].sets.map((set, si) => (
                    <div key={si} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono ${isLight ? 'bg-stone-100' : 'bg-zinc-800/50'}`}>
                      <span className={isLight ? 'text-stone-700' : 'text-zinc-300'}>Set {si + 1}</span>
                      <span className={isLight ? 'text-stone-500' : 'text-zinc-400'}>{set.reps} reps {set.weight > 0 ? `@ ${set.weight}kg` : ''}</span>
                      {checkNewPR(exerciseLogs[currentExerciseIndex].name, set.weight, set.reps) && (
                        <span className="text-amber-400 text-[8px] ml-1">🔥 PR</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Set Form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Set {exerciseLogs[currentExerciseIndex].sets.length + 1}/{exerciseLogs[currentExerciseIndex].targetSets}</span>
                  {exerciseLogs[currentExerciseIndex].sets.length >= exerciseLogs[currentExerciseIndex].targetSets && (
                    <span className="text-[10px] font-mono text-emerald-400">✓ COMPLETE</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Reps"
                    id={`reps-input-${currentExerciseIndex}`}
                    defaultValue={exerciseLogs[currentExerciseIndex].targetReps}
                    className={`w-20 rounded-lg px-2 py-2 text-xs font-mono outline-none border focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-zinc-800 border-zinc-700 text-white'}`}
                  />
                  <input
                    type="number"
                    placeholder="Weight"
                    id={`weight-input-${currentExerciseIndex}`}
                    defaultValue={0}
                    className={`w-20 rounded-lg px-2 py-2 text-xs font-mono outline-none border focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-zinc-800 border-zinc-700 text-white'}`}
                  />
                  <button
                    onClick={() => {
                      const repsInput = document.getElementById(`reps-input-${currentExerciseIndex}`) as HTMLInputElement;
                      const weightInput = document.getElementById(`weight-input-${currentExerciseIndex}`) as HTMLInputElement;
                      const reps = parseInt(repsInput?.value || '0') || 0;
                      const weight = parseInt(weightInput?.value || '0') || 0;
                      if (reps <= 0) return;
                      soundSafe('tap');
                      const newSet: LoggedSet = { reps, weight, timestamp: Date.now() };
                      setExerciseLogs(prev => prev.map((log, i) =>
                        i === currentExerciseIndex ? { ...log, sets: [...log.sets, newSet] } : log
                      ));
                      updatePRs(exerciseLogs[currentExerciseIndex].name, weight, reps);
                      repsInput.value = String(exerciseLogs[currentExerciseIndex].targetReps);
                      weightInput.value = '0';
                      setRestTimerKey(prev => prev + 1);
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
                  >
                    LOG SET
                  </button>
                  <button
                    onClick={() => {
                      soundSafe('tap');
                      const newSet: LoggedSet = { reps: 0, weight: 0, timestamp: Date.now() };
                      setExerciseLogs(prev => prev.map((log, i) =>
                        i === currentExerciseIndex ? { ...log, sets: [...log.sets, newSet] } : log
                      ));
                      setRestTimerKey(prev => prev + 1);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-stone-100 border-stone-300 text-stone-500 hover:bg-stone-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    SKIP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rest Timer */}
          <div className="w-full max-w-sm mx-auto mb-4">
            {exerciseLogs.some(e => e.sets.length > 0) && (
              <div key={restTimerKey}><RestTimer duration={restTimerDuration} autoStart isLight={isLight} /></div>
            )}
          </div>

          {/* Exercise Navigation */}
          <div className="w-full max-w-sm mx-auto flex gap-2 mb-4">
            <button
              onClick={() => {
                if (currentExerciseIndex > 0) {
                  setCurrentExerciseIndex(prev => prev - 1);
                  setRestTimerKey(prev => prev + 1);
                }
              }}
              disabled={currentExerciseIndex === 0}
              className={`flex-1 py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-stone-200 text-stone-600 disabled:opacity-30' : 'bg-zinc-800 text-zinc-400 disabled:opacity-30'}`}
            >
              ← PREV
            </button>
            <button
              onClick={() => {
                setCurrentExerciseIndex(prev => Math.min(prev + 1, exerciseLogs.length - 1));
                setRestTimerKey(prev => prev + 1);
              }}
              disabled={currentExerciseIndex >= exerciseLogs.length - 1}
              className={`flex-1 py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-stone-200 text-stone-600 disabled:opacity-30' : 'bg-zinc-800 text-zinc-400 disabled:opacity-30'}`}
            >
              NEXT →
            </button>
          </div>

          {/* Exercise Overview Dots */}
          <div className="w-full max-w-sm mx-auto flex gap-1.5 justify-center mb-4">
            {exerciseLogs.map((log, i) => {
              const isComplete = log.sets.length >= log.targetSets;
              return (
                <button key={i} onClick={() => { setCurrentExerciseIndex(i); setRestTimerKey(prev => prev + 1); }}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${i === currentExerciseIndex ? 'bg-rose-500 scale-125' : isComplete ? 'bg-emerald-400' : log.sets.length > 0 ? (isLight ? 'bg-amber-400' : 'bg-amber-500') : (isLight ? 'bg-stone-300' : 'bg-zinc-700')}`} />
              );
            })}
          </div>

            {/* Battle Challenge + AI Pose Detector + Sensei Verify Buttons */}
            <div className="w-full max-w-sm mx-auto flex gap-2 mb-3">
              <button onClick={() => setShowBattleChallenge(true)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${
                  isLight ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
                }`}>
                ⚔️ BATTLE
              </button>
              <button onClick={() => setShowPoseDetector(true)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${
                  isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                }`}>
                📷 AI VERIFY
              </button>
              <button onClick={handleSenseiVerify}
                disabled={senseiVerifyLoading || senseiVerifyFeedback !== null}
                className={`flex-1 py-3 rounded-xl text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${
                  isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100 disabled:opacity-40' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40'
                }`}>
                {senseiVerifyLoading ? '⏳ THINKING...' : senseiVerifyFeedback ? '✅ VERIFIED' : '🎯 SENSEI'}
              </button>
            </div>

            {/* Sensei Verification Feedback */}
            {senseiVerifyFeedback && (
              <div className={`w-full max-w-sm mx-auto mb-3 p-3 rounded-xl border text-xs leading-relaxed ${
                senseiVerifyError
                  ? (isLight ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-500/10 border-red-500/30 text-red-400')
                  : (isLight ? 'bg-cyan-50 border-cyan-200 text-stone-700' : 'bg-cyan-500/5 border-cyan-500/20 text-zinc-300')
              }`} aria-live="polite">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs">{senseiVerifyError ? '⚠️' : '🎯'}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${senseiVerifyError ? 'text-red-500' : 'text-cyan-500'}`}>
                      {senseiVerifyError ? 'VERIFICATION FAILED' : 'SENSEI VERDICT'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSenseiVerifyFeedback(null)}
                    className={`p-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'text-stone-400 hover:text-stone-600' : 'text-zinc-600 hover:text-zinc-400'}`}
                    aria-label="Close verification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-sans whitespace-pre-wrap">{senseiVerifyFeedback}</p>
              </div>
            )}

          {/* Voice Command Button + Status */}
          <div className="w-full max-w-sm mx-auto mb-2 flex items-center justify-center gap-2">
            {voiceSupported && (
              <button
                onClick={voiceToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${
                  voiceListening
                    ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(227,30,36,0.6)] animate-pulse'
                    : isLight ? 'bg-stone-200 text-stone-600 hover:bg-stone-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                {voiceListening ? 'LISTENING...' : 'VOICE'}
              </button>
            )}
            {lastCommand && (
              <span className={`text-[10px] font-mono px-2 py-1 rounded ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                ⌘ {lastCommand}
              </span>
            )}
          </div>

          {/* Pause / Finish */}
          <div className="w-full max-w-sm mx-auto flex gap-3">
            <button
              onClick={() => {
                soundSafe('tap');
                setIsRunning(!isRunning);
              }}
              className={`flex-1 py-4 rounded-xl font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all border focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isRunning ? 'bg-[#9E2A2A] text-white border-rose-500/30' : 'bg-[#2D9C6E] text-white border-emerald-500/30'}`}
            >
              {isRunning ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              onClick={() => {
                const totalSets = exerciseLogs.reduce((sum, log) => sum + log.sets.length, 0);
                if (totalSets === 0) {
                  setConfirmModal({
                    message: "No sets logged. Finish anyway?",
                    onConfirm: () => {
                      const session: WorkoutSession = {
                        id: `ws_${Date.now()}`,
                        programName: activeRunningProgram.nameEnglish,
                        date: new Date().toISOString(),
                        duration: runningTimer,
                        exercises: exerciseLogs,
                        verified: false,
                      };
                      addWorkout(session);
                      setStreak(prev => prev + 1);
                      setStats(s => ({
                        ...s,
                        Strength: Math.min(100, s.Strength + 2),
                        Endurance: Math.min(100, s.Endurance + 3)
                      }));
                      const newUnlocks = checkAchievements();
                      const totalVolume = exerciseLogs.reduce((s, log) => s + log.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0);
                      setWorkoutCompleteData({
                        programName: activeRunningProgram.nameEnglish,
                        duration: runningTimer,
                        totalSets,
                        totalVolume,
                        newPRs: newUnlocks.length > 0 ? [{ name: 'Achievement Unlocked' }] : [],
                        xpEarned: totalSets * 10 + Math.floor(runningTimer / 60),
                        achievementsUnlocked: newUnlocks,
                      });
                      setShowWorkoutComplete(true);
                    }
                  });
                  return;
                }
                const session: WorkoutSession = {
                  id: `ws_${Date.now()}`,
                  programName: activeRunningProgram.nameEnglish,
                  date: new Date().toISOString(),
                  duration: runningTimer,
                  exercises: exerciseLogs,
                  verified: false,
                };
                addWorkout(session);
                soundSafe('chime');
                setStreak(prev => prev + 1);
                setStats(s => ({
                  ...s,
                  Strength: Math.min(100, s.Strength + 2),
                  Endurance: Math.min(100, s.Endurance + 3)
                }));
                const newUnlocks = checkAchievements();
                const totalVolume = exerciseLogs.reduce((s, log) => s + log.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0);
                setWorkoutCompleteData({
                  programName: activeRunningProgram.nameEnglish,
                  duration: runningTimer,
                  totalSets,
                  totalVolume,
                  newPRs: newUnlocks.length > 0 ? [{ name: 'Achievement Unlocked' }] : [],
                  xpEarned: totalSets * 10 + Math.floor(runningTimer / 60),
                  achievementsUnlocked: newUnlocks,
                });
                setShowWorkoutComplete(true);
              }}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-[#F2C94C] text-black font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all uppercase focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:outline-none"
            >
              FINISH
            </button>
          </div>

          {/* Hidden gym photo input */}
          <input type="file" id="gym-photo-input" accept="image/*" className="hidden" />

        </div>
      )}

      {/* ========================================================================================= */}
      {/* ======================= OVERLAY LIGHTBOX: DESIGN SHOWROOM ZOOM =========================== */}
      {/* ========================================================================================= */}
      {zoomedPhoto !== null && (
        <div 
          className={`fixed inset-0 ${isLight ? 'bg-stone-200/98' : 'bg-void/98'} z-50 flex flex-col items-center justify-center p-4 md:p-10 backdrop-blur-xl transition-all duration-300 animate-fadeIn`}
          onClick={() => setZoomedPhoto(null)}
        >
          <div 
            className={`w-full max-w-4xl rounded-3xl border p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] transition-all relative ${
              zoomedPhoto === 'parchment'
                ? 'bg-[#EAE4D7] border-stone-400 text-stone-900'
                : `${isLight ? 'bg-white border-stone-200 text-stone-800' : 'bg-[#0B0B0C] border-rose-500/20 text-white'}`
            }`}
            onClick={(e) => e.stopPropagation()} // Stop background click from closing
          >
            {/* Close trigger button */}
            <button 
              onClick={() => setZoomedPhoto(null)}
              className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${
                zoomedPhoto === 'parchment' ? 'bg-stone-300 hover:bg-stone-400 text-stone-900' : `${isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-600' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`
              }`}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox headers */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-stone-300/40">
              <div>
                <span className="text-[10px] font-mono uppercase bg-rose-600 px-2 py-0.5 rounded text-white font-black tracking-widest">
                  {zoomedPhoto === 'parchment' ? 'REF_IMAGE_01: PARCHMENT SUMI-E' : 'REF_IMAGE_02: CYBER SHOGUNATE'}
                </span>
                <h3 className="font-display font-black text-2xl tracking-wider mt-1.5 font-mono">
                  {zoomedPhoto === 'parchment' ? 'Miyamoto Musashi Ronin Layout' : 'Shadow 影 Crimson Red Sun Banner'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono">ASSET IN PROJECT:</span>
                <span className="text-xs font-mono bg-stone-900/10 dark:bg-white/10 px-2.5 py-1 rounded font-bold underline">
                  {zoomedPhoto === 'parchment' ? 'warrior_helmet_1780673081824.png' : 'bg_samurai_1780673054908.png'}
                </span>
              </div>
            </div>

            {/* Immersive Photo Display Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Photo Area */}
              <div className="lg:col-span-7 flex justify-center">
                <div className={`relative w-full rounded-2xl border overflow-hidden p-2 shadow-2xl ${
                  zoomedPhoto === 'parchment' ? 'bg-[#F5F0E4] border-stone-300/80' : 'bg-black border-white/5'
                }`}>
                  <img 
                    src={zoomedPhoto === 'parchment' ? IMAGES.warriorHelmet : IMAGES.bgSamurai} 
                    className="w-full max-h-[480px] object-contain rounded-xl hover:scale-[1.03] transition-transform duration-500" 
                    alt="Pristine Design Reference Closeup" 
                    loading="lazy" decoding="async"
                  />
                  
                  {/* Anchor watermark overlays */}
                  <div className={`absolute bottom-4 left-4 bg-black/75 px-3 py-1.5 rounded-lg border ${isLight && zoomedPhoto !== 'parchment' ? 'border-rose-500/30' : 'border-white/10'} text-white font-mono text-[9px] flex items-center gap-1.5`}>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>ORIGINAL DESIGN FILE</span>
                  </div>
                </div>
              </div>

              {/* Guidelines Breakdown Side Panel */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="font-bold text-xs font-mono uppercase tracking-widest text-rose-500">AESTHETIC SCHEMATICS BREAKDOWN</h4>
                
                {zoomedPhoto === 'parchment' ? (
                  <div className="space-y-3.5 text-xs text-stone-800 leading-relaxed font-sans">
                    <p>
                      This theme replicates <strong className="font-bold">Miyamoto Musashi Sumi-e poster concept</strong>. It is designed to emulate physical ink & paper textures mixed with digital high-fidelity:
                    </p>
                    <ul className="space-y-2.5 list-disc list-inside bg-stone-100 p-4 rounded-xl border border-stone-300/40">
                      <li>
                        <strong className="text-stone-950 font-bold">Paper Patina (#EAE4D7):</strong> Mimics the organic, tactile feeling of crumpled canvas or parchment sheets.
                      </li>
                      <li>
                        <strong className="text-stone-950 font-bold">The Solid Crimson Sun:</strong> Provides a heavy focal contrast vector behind monochromatic silhouettes.
                      </li>
                      <li>
                        <strong className="text-stone-950 font-bold">Decentered Insets:</strong> Placement of high-contrast micro sub-cards depicting equipment blueprints adds deep visual pacing.
                      </li>
                      <li>
                        <strong className="text-stone-950 font-bold">Red Hanko Stamp (斬龍):</strong> A rotated geometric seal completes the handcrafted masterpiece feeling.
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className={`space-y-3.5 text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'} leading-relaxed`}>
                    <p>
                      This theme replicates the <strong className={`${isLight ? 'text-stone-900' : 'text-white'} font-bold`}>Cyber Samurai "Kage" Wallpaper</strong>. It leverages dramatic chiaroscuro and highly vibrant cyberpunk neon-red strokes:
                    </p>
                    <ul className={`space-y-2.5 list-disc list-inside ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-neutral-900 border-white/5'} p-4 rounded-xl border`}>
                      <li>
                        <strong className={`${isLight ? 'text-stone-900' : 'text-white'} font-bold`}>Void Charcoal canvas:</strong> A rich background gradient that focuses 100% attention on the central figure.
                      </li>
                      <li>
                        <strong className={`${isLight ? 'text-stone-900' : 'text-white'} font-bold`}>The Radiant Sun Backlight:</strong> A giant glowing circular gradient in deep scarlet/crimson.
                      </li>
                      <li>
                        <strong className={`${isLight ? 'text-stone-900' : 'text-white'} font-bold`}>Huge Calligraphic "影" (KAGE):</strong> Left-aligned, acting as a dynamic backdrop watermark that scales with negative space.
                      </li>
                      <li>
                        <strong className={`${isLight ? 'text-stone-900' : 'text-white'} font-bold`}>Saturated red-accents:</strong> Buttons, tags, and sparks emerge from the darkness like burning cinders.
                      </li>
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-300/40">
                  <button 
                    onClick={() => setZoomedPhoto(null)}
                    className={`w-full py-3 ${isLight ? 'bg-stone-800 text-white hover:bg-stone-700' : 'bg-stone-950 text-white hover:bg-stone-800'} rounded-xl font-mono text-xs font-bold font-black uppercase shadow-lg select-all`}
                  >
                    ⚖️ CONFIRM STYLE COMPREHENSION
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* ======================= BATTLE CHALLENGE MODAL ============================================= */}
      {showBattleChallenge && (
        <Suspense fallback={null}>
          <BattleChallenge
            isLight={isLight}
            onClose={() => setShowBattleChallenge(false)}
            partnerName={pactData.partnerName}
            partnerAvatar={pactData.avatar}
            sharedStreak={pactData.sharedStreak}
          />
        </Suspense>
      )}

      {/* ========================================================================================= */}
      {/* ======================= AI POSE DETECTOR MODAL ============================================ */}
      {showPoseDetector && exerciseLogs[currentExerciseIndex] && (
        <Suspense fallback={null}>
          <PoseDetector
            isLight={isLight}
            onClose={() => setShowPoseDetector(false)}
            onComplete={(count) => {
              const newSet: LoggedSet = { reps: count, weight: 0, timestamp: Date.now() };
              setExerciseLogs(prev => prev.map((log, i) =>
                i === currentExerciseIndex ? { ...log, sets: [...log.sets, newSet] } : log
              ));
              setShowPoseDetector(false);
            }}
            targetCount={10}
            exerciseName={exerciseLogs[currentExerciseIndex].name}
          />
        </Suspense>
      )}

        {/* Workout Complete Summary Modal */}
      {showWorkoutComplete && workoutCompleteData && (
        <Suspense fallback={null}>
          <WorkoutComplete
            isLight={isLight}
            programName={workoutCompleteData.programName}
            duration={workoutCompleteData.duration}
            totalSets={workoutCompleteData.totalSets}
            totalVolume={workoutCompleteData.totalVolume}
            newPRs={workoutCompleteData.newPRs}
            xpEarned={workoutCompleteData.xpEarned}
            achievementsUnlocked={workoutCompleteData.achievementsUnlocked}
            onClose={() => {
              setShowWorkoutComplete(false);
              setActiveRunningProgram(null);
              setIsRunning(false);
            }}
            onPhotoUpload={() => document.getElementById('gym-photo-input')?.click()}
          />
        </Suspense>
      )}
    </div>
    </ErrorBoundary>
  );
}
