/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  BookOpen
} from 'lucide-react';

import { IMAGES } from './assets';
import { KageAudio } from './audio';
import { TabName, WorkoutProgram, Meal, Pact, LeaderboardUser, ChatMessage, Achievement } from './types';
import ThreeDCard from './components/ThreeDCard';
import TiltCard3D from './components/TiltCard3D';
import CinematicTransition, { StaggerList, StaggerItem } from './components/CinematicTransition';
import { EnergySphereScene } from './components/FloatingEnergySphere';
import { ProgramCard, ProgramDetailBoard } from './components/ProgramBoard';
import StatsBoard from './components/StatsBoard';
import LeaderboardBoard from './components/LeaderboardBoard';
import ParallaxHero from './components/ParallaxHero';
import ErrorBoundary from './components/ErrorBoundary';
import EpicLanding from './components/EpicLanding';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

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

const MOCK_MEAL_PLANS: Record<'shred' | 'bulk' | 'maintain', Meal[]> = {
  shred: [
    { id: 'm1', name: 'Steamed Red-Sun Sea Bass', protein: 38, carbs: 12, fat: 6, calories: 250, image: '🐟' },
    { id: 'm2', name: 'Sumi Chicken Breast + Asparagus', protein: 44, carbs: 8, fat: 4, calories: 240, image: '🍗' },
    { id: 'm3', name: 'Almond Green Tempeh Stir-fry', protein: 28, carbs: 18, fat: 12, calories: 290, image: '🥗' }
  ],
  bulk: [
    { id: 'm4', name: 'Sumo Soy Beef Rice Bowl', protein: 55, carbs: 80, fat: 18, calories: 700, image: '🥩' },
    { id: 'm5', name: 'Sesame Peanut Soba with Tofu', protein: 32, carbs: 95, fat: 22, calories: 710, image: '🍜' },
    { id: 'm6', name: 'Miso Wild Egg Avocado Toast', protein: 26, carbs: 55, fat: 20, calories: 500, image: '🥑' }
  ],
  maintain: [
    { id: 'm7', name: 'Teriyaki Wild Salmon Bowl', protein: 42, carbs: 45, fat: 14, calories: 470, image: '🍣' },
    { id: 'm8', name: 'Steamed Sea Shell Quinoa Mix', protein: 30, carbs: 50, fat: 10, calories: 410, image: '🍛' },
    { id: 'm9', name: 'Spiced Edamame Tofu Mash', protein: 24, carbs: 35, fat: 8, calories: 310, image: '🍡' }
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

const INITIAL_MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ac1', title: 'First Drop of Sweat', description: 'Complete 1 individual Dojo Training.', icon: '💧', unlocked: true, rarity: 'common' },
  { id: 'ac2', title: 'Two Shadows Collide', description: 'Forge a blood Pact with a combat brother.', icon: '🤝', unlocked: true, rarity: 'common' },
  { id: 'ac3', title: 'Crimson Fortitude', description: 'Reach a 15-Day workout streak with active state.', icon: '🔥', unlocked: true, rarity: 'rare' },
  { id: 'ac4', title: 'Golden Pact Seal', description: 'Complete a 30-Day Joint Workout Target.', icon: '🛡️', unlocked: false, rarity: 'epic' },
  { id: 'ac5', title: 'Hologram\'s Disciple', description: 'Query the cybernetic Sensei 5 times.', icon: '🔮', unlocked: true, rarity: 'common' },
  { id: 'ac6', title: 'The Iron Scabbard', description: 'Execute the high-difficulty IRON PHYSICAL program fully.', icon: '⛩️', unlocked: false, rarity: 'epic' },
  { id: 'ac7', title: 'Tear the Sky', description: 'Achieve level 20 with over 4,000 Honour Points.', icon: '⚡', unlocked: false, rarity: 'legendary' },
  { id: 'ac8', title: 'Lotus Focus', description: 'Complete a 15-minute sound guided shadow meditation.', icon: '🧘', unlocked: false, rarity: 'rare' },
  { id: 'ac9', title: 'Void Dweller', description: 'Maintain dark theme mode for entire season.', icon: '🌌', unlocked: true, rarity: 'rare' },
  { id: 'ac10', title: 'Hydration General', description: 'Drink 8 full glasses of water in a single day.', icon: '🌊', unlocked: true, rarity: 'common' },
  { id: 'ac11', title: 'Sensei\'s Seal', description: 'Receive an AI-certified form rating score of over 95%.', icon: '💮', unlocked: false, rarity: 'legendary' },
  { id: 'ac12', title: 'Steel Shred', description: 'Accumulate 10,000 burned calories in Bulk module.', icon: '🔱', unlocked: false, rarity: 'legendary' }
];

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_MOCK_ACHIEVEMENTS);
  
  // Custom stats for SVG Spider Graph
  const [stats, setStats] = useState({
    Strength: 78,
    Speed: 82,
    Spirit: 90,
    Focus: 65,
    Endurance: 74
  });

  // Training Plan Selection
  const [trainingSubTab, setTrainingSubTab] = useState<'eq' | 'zero'>('eq');
  const [mealPlanType, setMealPlanType] = useState<'shred' | 'bulk' | 'maintain'>('shred');
  const [waterCups, setWaterCups] = useState<boolean[]>([true, true, true, true, false, false, false, false]);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

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
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

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

  // Listen to auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              name: u.displayName || 'Unknown Warrior',
              level: 1,
              streak: 0,
              honorPoints: 0,
              avatar: '👺',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        } catch (e) {
          console.error("Auth init error:", e);
        }
      }
    });
    return () => unsub();
  }, []);

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

  // Active workout timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && activeRunningProgram) {
      interval = setInterval(() => {
        setRunningTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeRunningProgram]);

  const soundSafe = (type: 'clash' | 'tap' | 'chime' | 'hum') => {
    if (isMuted) return;
    if (type === 'clash') KageAudio.playSwordClash();
    if (type === 'tap') KageAudio.playHologramTap();
    if (type === 'chime') KageAudio.playEvolveChime();
    if (type === 'hum') KageAudio.playZenHum();
  };

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          quickAction: customAction || undefined 
        }),
      });
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

  const fillWaterCup = (index: number) => {
    soundSafe('tap');
    const updated = [...waterCups];
    updated[index] = !updated[index];
    setWaterCups(updated);

    // If suddenly all cups are complete, trigger the Hydration achievement
    if (updated.every(c => c)) {
      unlockAchievement('ac10');
    }
  };

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

  const handleLeaderboardRefresh = () => {
    soundSafe('clash');
    // Simulate slight rotation of points or active user bump
    setLeaderboard(prev => prev.map(user => {
      if (user.isCurrentUser) {
        return { ...user, honorPoints: user.honorPoints + 20 };
      }
      return user;
    }));
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center"><div className="text-rose-500 animate-pulse font-mono tracking-widest text-sm">INITIALIZING KAGE...</div></div>;
  }

  // Guest user for local development
  const guestUser: FirebaseUser = {
    uid: 'guest-001',
    displayName: 'Guest Warrior',
    email: 'guest@kage.dojo',
    emailVerified: true,
    isAnonymous: false,
    photoURL: null,
    phoneNumber: null,
    providerData: [],
    metadata: {} as any,
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'guest-token',
    getIdTokenResult: async () => ({ token: 'guest-token', signInProvider: null, expirationTime: '', issuedAtTime: '', authTime: '', claims: {} }),
    reload: async () => {},
    toJSON: () => ({}),
  } as FirebaseUser;

  if (!user) {
    return (
      <EpicLanding
        onGoogleLogin={async () => {
          try {
            await signInWithPopup(auth, new GoogleAuthProvider());
          } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
              console.log('Login cancelled by user.');
            } else {
              console.error('Login error:', err);
            }
          }
        }}
        onGuestLogin={() => setUser(guestUser)}
      />
    );
  }

  return (
    <ErrorBoundary>
    <div className={`min-h-screen flex flex-col transition-all duration-500 selection:bg-rose-500/30 selection:text-white ${
      isLight ? 'bg-stone-100 text-stone-900' : 'bg-[#0A0A0F] text-zinc-200'
    }`}>
      {/* 3D Energy Sphere Background */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isLight ? 'opacity-30 mix-blend-multiply' : 'opacity-70 mix-blend-screen'
      }`}>
        <ErrorBoundary>
          <EnergySphereScene isLight={isLight} />
        </ErrorBoundary>
      </div>
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
            onClick={() => signOut(auth)}
            className={`text-[10px] font-mono border px-2 py-1 rounded transition-colors ${
              isLight ? 'border-stone-300 text-stone-500 hover:bg-stone-200' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            LOGOUT
          </button>
          <button 
            onClick={() => { setIsMuted(!isMuted); if (isMuted) KageAudio.playZenHum(); }}
            className={`p-1.5 rounded-lg transition-all ${
              isLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-zinc-800/50 hover:bg-zinc-700/50'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isMuted ? (isLight ? 'text-stone-400' : 'text-zinc-600') : (isLight ? 'text-stone-700' : 'text-zinc-300')}`} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="relative w-full max-w-xl mx-auto min-h-screen z-10 flex flex-col select-none">
        
        {/* Screen/Tab Canvas */}
        <div 
          onMouseMove={handleGlobalMouseMove}
          onMouseLeave={handleGlobalMouseLeave}
          className={`flex-1 overflow-x-hidden overflow-y-auto no-scrollbar pt-16 pb-20 px-5 relative z-25 flex flex-col transition-all duration-500 ease-in-out ${
            isLight ? 'bg-stone-100/60 text-stone-800' : 'bg-[#0A0A0F]/80 text-zinc-200'
          }`}>
          <AnimatePresence mode="wait">
          {/* ======================= TAB 1: HOME (家) ======================= */}
          {currentTab === '家' && (
            <motion.div key="tab-home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5 flex-1 flex flex-col relative">
              
              {/* Theme Toggle */}
              <div className="flex justify-center">
                <div className={`inline-flex p-0.5 rounded-full transition-colors ${
                  isLight ? 'bg-stone-200' : 'bg-zinc-800/60'
                }`}>
                  <button onClick={() => setLandingTheme('dark')} className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all ${!isLight ? 'bg-rose-600 text-white shadow' : 'text-stone-500 hover:text-stone-800'}`}>DARK</button>
                  <button onClick={() => setLandingTheme('light')} className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all ${isLight ? 'bg-amber-600 text-white shadow' : 'text-stone-500 hover:text-stone-800'}`}>LIGHT</button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-lg">
                <motion.img 
                  src={IMAGES.bgSamurai} 
                  className="w-full h-full object-cover" 
                  style={{ scale: imageScale }}
                  alt="Kage Dojo" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/90 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-end gap-3">
                  <div>
                    <span className="font-kanji font-black text-5xl text-rose-500 drop-shadow-[0_0_15px_rgba(227,30,36,0.6)]">影</span>
                    <p className={`text-[10px] font-mono tracking-widest mt-1 ${isLight ? 'text-stone-300' : 'text-zinc-400'}`}>KAGE PREMIUM DOJO V2</p>
                  </div>
                  <div className="flex gap-1 ml-auto">
                    <img src={IMAGES.warriorHelmet} className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow" />
                    <img src={IMAGES.hologramSensei} className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'LEVEL', value: '16', icon: '⭐', color: 'text-amber-400' },
                  { label: 'STREAK', value: `${streak}d`, icon: '🔥', color: 'text-rose-500' },
                  { label: 'HONOR', value: '2,450', icon: '⚔️', color: 'text-cyan-400' },
                  { label: 'PACT', value: '22', icon: '🤝', color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-2.5 text-center transition-colors ${
                    isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
                  }`}>
                    <div className={`text-base ${stat.color}`}>{stat.icon}</div>
                    <div className={`text-sm font-extrabold mt-0.5 ${isLight ? 'text-stone-800' : 'text-white'}`}>{stat.value}</div>
                    <div className={`text-[7px] font-mono tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Streak Card + Photos */}
              <div className={`flex items-center justify-between rounded-xl p-4 transition-colors ${
                isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden">
                    <img src={IMAGES.warriorHelmet} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>FLAME STREAK</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">{streak}</span>
                      <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>DAYS</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Flame className="w-8 h-8 text-rose-500 drop-shadow-[0_0_10px_rgba(255,59,48,0.6)]" />
                  <div className="text-right">
                    <div className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>BEST</div>
                    <div className="text-xs font-bold text-amber-400">89d</div>
                  </div>
                </div>
              </div>

              {/* Progress Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-xl p-3 transition-colors ${
                  isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
                }`}>
                  <div className="flex items-center gap-2">
                    <Award className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                    <span className={`text-[9px] font-mono tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>ACHIEVEMENTS</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-amber-400">{achievements.filter(a => a.unlocked).length}</span>
                    <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>/ {achievements.length}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-zinc-700/30 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }} />
                  </div>
                </div>
                <div className={`rounded-xl p-3 transition-colors ${
                  isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
                }`}>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <span className={`text-[9px] font-mono tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>THIS WEEK</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xl font-extrabold text-emerald-400">5</span>
                    <span className={`text-[10px] ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>workouts</span>
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    {[1,1,1,1,0,0,0].map((d, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${d ? 'bg-emerald-500' : isLight ? 'bg-stone-200' : 'bg-zinc-700/50'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* BEGIN TRAINING */}
              <button
                onClick={() => {
                  soundSafe('clash');
                  setActiveRunningProgram(MOCK_PROGRAMS[0]);
                  setRunningTimer(0);
                  setIsRunning(true);
                }}
                className="w-full py-4 rounded-xl font-bold font-mono tracking-widest bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-[0_4px_20px_rgba(227,30,36,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Swords className="w-5 h-5" />
                BEGIN TRAINING
              </button>

              {/* Pact + Battle Cry Row */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setIsPartnerProfileOpen(true)}
                  className={`rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-all ${
                    isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{pactData.avatar}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>{pactData.partnerName}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{pactData.sharedStreak}d streak</p>
                    </div>
                  </div>
                </div>
                <div 
                  onClick={() => setIsBattleCryModalOpen(true)}
                  className={`rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-all ${
                    isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className={`text-xs font-semibold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>BATTLE CRY</p>
                      <p className={`text-[9px] font-mono truncate ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{battleCryText}</p>
                    </div>
                  </div>
                  {isBattleCryActive && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 animate-ping" />}
                </div>
              </div>

              {/* Sensei Widget */}
              <div 
                onClick={() => setCurrentTipIndex((currentTipIndex + 1) % senseiWidgetProverbs.length)}
                className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-all ${
                  isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/40 border border-zinc-800/40'
                }`}
              >
                <img src={IMAGES.hologramSensei} alt="" className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-cyan-400 tracking-widest">SENSEI</span>
                  <p className={`text-xs truncate ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>"{senseiWidgetProverbs[currentTipIndex]}"</p>
                </div>
              </div>

              {/* Photo Gallery Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl overflow-hidden h-20">
                  <img src={IMAGES.warriorHelmet} className="w-full h-full object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden h-20">
                  <img src={IMAGES.bgSamurai} className="w-full h-full object-cover" />
                </div>
                <div className="rounded-xl overflow-hidden h-20">
                  <img src={IMAGES.hologramSensei} className="w-full h-full object-cover" />
                </div>
              </div>

            </motion.div>
          )}


          {/* ======================= TAB 2: TRAIN (武) ======================= */}
          {currentTab === '武' && (
            <motion.div key="tab-train" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2">
              
              <div className="text-center py-2 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-kanji font-black text-rose-500 text-3xl">武</span>
                  <h2 className="text-xl font-bold text-white tracking-widest">DOJO FLOOR</h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-[10px] text-rose-400 font-mono">BETA</span>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex bg-void p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => { soundSafe('tap'); setTrainingSubTab('eq'); }}
                  className={`flex-1 text-center py-2 rounded-md font-mono text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${trainingSubTab === 'eq' ? 'bg-kachi text-rose-500 font-bold border border-rose-500/10' : 'text-zinc-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  EQUIPMENT
                </button>
                <button
                  onClick={() => { soundSafe('tap'); setTrainingSubTab('zero'); }}
                  className={`flex-1 text-center py-2 rounded-md font-mono text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${trainingSubTab === 'zero' ? 'bg-kachi text-hisui font-bold border border-hisui/10' : 'text-zinc-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-hisui animate-pulse" />
                  ZERO-EQUIPMENT
                </button>
              </div>

              {/* CARD CAROUSEL (Vertical snap or dynamic selectable items) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">AVAILABLE COMBAT MODULES</p>
                  <span className="text-[10px] text-zinc-500">SWORD RANKS INDENTED</span>
                </div>

                <div className="space-y-3">
                  {MOCK_PROGRAMS
                    .filter(p => trainingSubTab === 'eq' ? p.equipmentNeeded : !p.equipmentNeeded)
                    .map(prog => (
                      <ProgramCard
                        key={prog.id}
                        program={prog}
                        onSelect={(p) => {
                          soundSafe('tap');
                          setSelectedProgram(p);
                        }}
                      />
                    ))}
                </div>
              </div>

              {/* DIET SECTION BELOW CAROUSEL */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Utensils className="w-4 h-4 text-[#F2C94C]" />
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E9EAF]">WARRIOR\'S FUEL</h3>
                  </div>
                  <select 
                    value={mealPlanType}
                    onChange={(e) => {
                      soundSafe('tap');
                      setMealPlanType(e.target.value as any);
                    }}
                    className="bg-void text-xs font-mono text-zinc-300 border border-white/10 rounded px-2 py-1 outline-none"
                  >
                    <option value="shred">SHRED (Low Cal)</option>
                    <option value="bulk">BULK (High Pro)</option>
                    <option value="maintain">MAINTAIN</option>
                  </select>
                </div>

                {/* MacroRings Indicator (Protein / Carbs / Fat) */}
                <div className="grid grid-cols-3 gap-3 bg-kachi/50 rounded-xl p-4">
                  {/* Protein Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="26" className="stroke-void fill-none" strokeWidth="4" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="26" 
                          className="stroke-rose-500 fill-none transition-all duration-1000" 
                          strokeWidth="4" 
                          strokeDasharray={163.3}
                          strokeDashoffset={163.3 * (1 - (mealPlanType === 'bulk' ? 0.9 : mealPlanType === 'shred' ? 0.8 : 0.65))}
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-xs font-bold text-white font-mono">{mealPlanType === 'bulk' ? '180g' : '150g'}</span>
                        <p className="text-[8px] text-rose-400 font-mono">PROTEIN</p>
                      </div>
                    </div>
                  </div>

                  {/* Carbs Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="26" className="stroke-void fill-none" strokeWidth="4" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="26" 
                          className="stroke-[#F2C94C] fill-none transition-all duration-1000" 
                          strokeWidth="4" 
                          strokeDasharray={163.3}
                          strokeDashoffset={163.3 * (1 - (mealPlanType === 'bulk' ? 0.95 : mealPlanType === 'shred' ? 0.25 : 0.5))}
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-xs font-bold text-white font-mono">{mealPlanType === 'bulk' ? '320g' : '90g'}</span>
                        <p className="text-[8px] text-yellow-400 font-mono">CARBS</p>
                      </div>
                    </div>
                  </div>

                  {/* Fat Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="26" className="stroke-void fill-none" strokeWidth="4" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="26" 
                          className="stroke-[#2D9C6E] fill-none transition-all duration-1000" 
                          strokeWidth="4" 
                          strokeDasharray={163.3}
                          strokeDashoffset={163.3 * (1 - (mealPlanType === 'bulk' ? 0.7 : mealPlanType === 'shred' ? 0.45 : 0.6))}
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-xs font-bold text-white font-mono">{mealPlanType === 'bulk' ? '80g' : '55g'}</span>
                        <p className="text-[8px] text-emerald-400 font-mono">LIPID</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WATER TRACKER (Grid of cups) */}
                <div className="bg-kachi/30 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-xs font-mono text-zinc-200">HYDRO-LEDGER</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {waterCups.filter(c => c).length} / 8 GLASSES
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-mono uppercase">HYDRATION PREVENTS CORE MUSCLE FAILURES. TAP TO DRINK MILK OR SPRING WATER:</p>
                  
                  {/* Grid of cups */}
                  <div className="grid grid-cols-8 gap-2">
                    {waterCups.map((filled, idx) => (
                      <button
                        key={idx}
                        onClick={() => fillWaterCup(idx)}
                        className={`aspect-square rounded border transition-all flex items-center justify-center relative overflow-hidden cursor-pointer ${filled ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-void border-zinc-700 hover:border-cyan-500/30'}`}
                      >
                        {filled ? (
                          <div className="absolute inset-0 bg-cyan-400 opacity-20 animate-pulse" />
                        ) : null}
                        <CupSoda className={`w-4 h-4 ${filled ? 'text-cyan-400 animate-bounce' : 'text-zinc-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* MealCard List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">SUGGESTED COMBAT RECIPES FOR TODAY:</span>
                  {MOCK_MEAL_PLANS[mealPlanType].map(meal => (
                    <div key={meal.id} className="bg-kachi/50 rounded-xl p-3 flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meal.image}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{meal.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-amber-500">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>

              </div>

            </motion.div>
          )}


          {/* ======================= TAB 3: DOJO (道) ======================= */}
          {currentTab === '道' && (
            <motion.div key="tab-dojo" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2">
              
              <div className="text-center py-2 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-kanji font-black text-rose-500 text-3xl">道</span>
                  <h2 className="text-xl font-bold text-white tracking-widest">SACRED ARENA</h2>
                </div>
                <button
                  onClick={handleLeaderboardRefresh}
                  className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition-all text-rose-400 flex items-center gap-1.5 text-[10px] font-mono cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  STRIKE CLASH
                </button>
              </div>

              {/* Top 60% — Warrior Pact Section */}
              <div className="space-y-4">
                <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">YOUR BLOOD PACT ALLY</p>
                
                <div className="bg-gradient-to-br from-sumi to-void rounded-2xl border border-white/10 p-5 space-y-4 relative overflow-hidden shadow-2xl">
                  {/* Glowing core indicator */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500 opacity-5 blur-[40px] pointer-events-none" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-kachi w-14 h-14 rounded-full flex items-center justify-center border-2 border-hisui/60">{pactData.avatar}</span>
                      <div>
                        <h4 className="font-bold text-md text-white tracking-wide">{pactData.partnerName}</h4>
                        <p className="text-xs text-hisui font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          SHIELD LEVEL: {pactData.partnerLevel} INTACT
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">SHARED STREAK</span>
                      <p className="text-2xl font-black text-[#F2C94C] flex items-center justify-end gap-1 font-mono">
                        <Flame className="w-5 h-5 fill-[#F2C94C]" />
                        {pactData.sharedStreak}D
                      </p>
                    </div>
                  </div>

                  {/* Shared shield progress bar info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">Joint Workout Target</span>
                      <span className="text-zinc-500">{pactData.jointWorkoutCount} / {pactData.targetCount} days</span>
                    </div>
                    <div className="h-2 w-full bg-void rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-[#2196F3] via-hisui to-emerald-500 rounded-full" style={{ width: `${(pactData.jointWorkoutCount / pactData.targetCount) * 100}%` }} />
                    </div>
                  </div>

                  {/* ChainStreak Visual (🏅 chain links glow gold at milestones) */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">CHAINSTREAK PROTOCOL MILSTONES:</p>
                    <div className="flex justify-between items-center bg-void p-2.5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 flex-1 justify-around">
                        <div className="flex flex-col items-center">
                          <Award className="w-5 h-5 text-zinc-500" />
                          <span className="text-[8px] font-mono text-zinc-500 mt-1">7 DAYS</span>
                        </div>
                        <div className="h-0.5 bg-zinc-700 flex-1 mx-2" />
                        <div className="flex flex-col items-center">
                          <Award className="w-5 h-5 text-zinc-300 animate-pulse" />
                          <span className="text-[8px] font-mono text-rose-400 mt-1">15 DAYS</span>
                        </div>
                        <div className="h-0.5 bg-zinc-700 flex-1 mx-2" />
                        <div className="flex flex-col items-center">
                          <Award className="w-5 h-5 text-zinc-700" />
                          <span className="text-[8px] font-mono text-zinc-700 mt-1">30 DAYS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setIsBattleCryModalOpen(true)}
                      className="text-center py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all font-mono font-bold text-xs text-rose-400 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      SEND BATTLE CRY
                    </button>
                    <button
                      onClick={() => setIsForgeModalOpen(true)}
                      className="text-center py-2 rounded-lg bg-indigo/30 hover:bg-indigo/40 border border-indigo/40 transition-all font-mono font-bold text-xs text-indigo-400 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      FORGE PACT
                    </button>
                  </div>
                </div>
              </div>

              {/* Mid Section — Discipline Calendar */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  HISTORIC DISCIPLINE RECORD
                </p>
                <div className="bg-kachi/30 rounded-2xl border border-white/5 p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase shadow-sm">JUNE 2026</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-[0_0_8px_rgba(227,30,36,0.5)]"></span><span className="text-[9px] text-zinc-400 font-mono">COMPLETE</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded border border-rose-500/50 border-dashed"></span><span className="text-[9px] text-zinc-400 font-mono">SCHEDULED</span></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                       <div key={i} className="text-center text-[10px] text-zinc-500 font-mono font-bold">{day}</div>
                    ))}
                    {Array.from({length: 30}).map((_, i) => {
                       const isPast = i < 5;
                       const isToday = i === 5;
                       const isScheduled = i === 7 || i === 9 || i === 12 || i === 14;
                       const isCompleted = isPast && (i === 0 || i === 1 || i === 3 || i === 4);
                       
                       return (
                         <div key={i} className={`aspect-square rounded-md flex items-center justify-center font-mono text-xs transition-all relative group cursor-pointer ${
                           isToday ? 'bg-rose-500 text-white border border-rose-400 shadow-[0_0_15px_rgba(227,30,36,0.6)] z-10 scale-105' : 
                           isCompleted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' :
                           isScheduled ? 'bg-void border border-rose-500/30 border-dashed text-zinc-400 hover:bg-white/5' :
                           'bg-void/40 border border-white/5 text-zinc-700 hover:bg-white/5'
                         }`}>
                           {i + 1}
                           
                           {/* Tooltip on hover */}
                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-lacquer-black text-white text-[9px] rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                             {isToday ? 'TODAY: SHRED DUPLEX' : isCompleted ? 'LOG: IRON PHYSICAL' : isScheduled ? 'SCHEDULED DRILL' : 'REST / NO RECORD'}
                           </div>
                         </div>
                       )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom 40% — Leaderboard Section */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">LEADERBOARD_INDEX (TOP 10)</p>
                  <span className="text-[9px] text-[#2D9C6E] font-mono">STATUS: CALCULATED LIVE</span>
                </div>
                <LeaderboardBoard data={leaderboard} />
              </div>

            </motion.div>
          )}


          {/* ======================= TAB 4: SENSEI (先) ======================= */}
          {currentTab === '先' && (
            <motion.div key="tab-sensei" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex-1 flex flex-col h-full space-y-4 pt-2">
              
              <div className="text-center py-2 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-kanji font-black text-rose-500 text-3xl">先</span>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-widest text-left">CYBER-SENSEI</h2>
                    <p className="text-[8px] text-cyan-400 font-mono text-left uppercase">GEMINI NEURAL GRID MODULE ADAPTIVE</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-[#F2C94C]/10 border border-[#F2C94C]/20 text-[9px] text-yellow-500 font-mono animate-pulse">
                  MASTER STATUS
                </div>
              </div>

              {/* Holographic Big Floating Avatar */}
              <div className="flex flex-col items-center py-4 relative bg-sumi/30 rounded-2xl border border-indigo/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
                
                {/* Visual grid lines for holograms */}
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse" />

                <div className="relative w-36 h-36 flex items-center justify-center z-10 select-none">
                  {/* Glowing pulses */}
                  <div className="absolute w-28 h-28 rounded-full border border-cyan-500/30 animate-ping pointer-events-none" />
                  <div className="absolute w-32 h-32 rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
                  <img 
                    src={IMAGES.hologramSensei} 
                    alt="Cybermaster" 
                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" 
                  />
                </div>
                
                <h3 className="text-xs font-mono text-center text-cyan-400 tracking-wider font-extrabold uppercase mt-2 z-10">UNIT-IV COVENANT SENSEI</h3>
                <p className="text-[10px] text-zinc-400 text-center font-mono z-10 px-4 mt-1">"The sword cut determines your essence."</p>
              </div>

              {/* 6 Quick Action Gems */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuerySubmit('inspire')}
                  className="bg-kachi/50 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#F2C94C] mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">INSPIRE</span>
                </button>
                <button
                  onClick={() => handleQuerySubmit('form')}
                  className="bg-kachi/50 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <Dumbbell className="w-4 h-4 text-rose-500 mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">FORM CHECK</span>
                </button>
                <button
                  onClick={() => handleQuerySubmit('diet')}
                  className="bg-kachi/50 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <Utensils className="w-4 h-4 text-emerald-400 mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">DIET TIPS</span>
                </button>
                <button
                  onClick={() => handleQuerySubmit('lore')}
                  className="bg-kachi/50 hover:bg-[#6A4E9B]/20 border border-white/5 hover:border-[#6A4E9B]/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-purple-400 mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">SHADOW LORE</span>
                </button>
                <button
                  onClick={() => handleQuerySubmit('meditate')}
                  className="bg-kachi/50 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <Compass className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">MEDITATE</span>
                </button>
                <button
                  onClick={() => handleQuerySubmit('random')}
                  className="bg-kachi/50 hover:bg-[#E87A5D]/20 border border-white/5 hover:border-[#E87A5D]/30 rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95"
                >
                  <Activity className="w-4 h-4 text-orange-400 mb-1 shrink-0" />
                  <span className="text-[9px] font-mono text-zinc-300">SHADOW REAP</span>
                </button>
              </div>

              {/* Chat Window with Glassmorphic visual boxes */}
              <div className="flex-1 min-h-[160px] max-h-[300px] overflow-y-auto no-scrollbar bg-kachi/30 rounded-xl border border-white/5 p-3 space-y-3 flex flex-col justify-end">
                <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[280px]">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                          msg.sender === 'user' 
                            ? 'bg-[#1A1A24]/90 border border-rose-500/30 text-white rounded-tr-none' 
                            : 'bg-void/40 backdrop-blur-md border border-cyan-500/10 text-cyan-50 font-sans rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                        <span className="block text-[8px] text-zinc-500 font-mono text-right mt-1.5">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  
                  {isSenseiTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-xl rounded-tl-none p-3 bg-void/50 border border-cyan-500/20 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
                        <span>SENSEI RETRIEVING CHRONICLES...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive bottom writing field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask and learn our code..."
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuerySubmit();
                  }}
                  className="flex-1 bg-void text-xs font-mono text-zinc-200 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500/50 outline-none"
                />
                <button
                  onClick={() => handleQuerySubmit()}
                  className="bg-rose-500 hover:bg-rose-600 rounded-xl p-3 text-white transition-colors cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}


          {/* ======================= TAB 5: EVOLVE (异) ======================= */}
          {currentTab === '异' && (
            <motion.div key="tab-evolve" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2">
              
              <div className="text-center py-2 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-kanji font-black text-rose-500 text-3xl">异</span>
                  <h2 className="text-xl font-bold text-white tracking-widest">ASCENSION CHAMBER</h2>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[#F2C94C]/10 border border-[#F2C94C]/30 text-[10px] text-yellow-500 font-mono flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  LEVEL 16
                </div>
              </div>

              {/* Header Badging Rank title */}
              <div className="bg-gradient-to-r from-void via-kachi to-void p-4 rounded-xl text-center border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">CURRENT ASCENSION SEAL</span>
                <p className="font-display font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-[#E87A5D] tracking-widest mt-0.5">IRON FIST SHADOW</p>
                <div className="text-[9px] font-mono text-rose-500 mt-1 uppercase">REACH STAGE 17 TO FORGE CHRONOCROSS SPELL</div>
              </div>

              {/* Dynamic SVGs Radar Radar Chart 5-Axis (Strength, Speed, Spirit, Focus, Endurance) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">CAPABILITY SPECTRUM MAP</p>
                  <button 
                    onClick={() => {
                      soundSafe('tap');
                      // Custom interactive stats generator simulation
                      setStats({
                        Strength: Math.floor(Math.random() * 40) + 60,
                        Speed: Math.floor(Math.random() * 40) + 60,
                        Spirit: Math.floor(Math.random() * 30) + 70,
                        Focus: Math.floor(Math.random() * 45) + 55,
                        Endurance: Math.floor(Math.random() * 35) + 65
                      });
                    }}
                    className="text-[9px] font-mono text-rose-400 uppercase tracking-widest border-b border-rose-500/20"
                  >
                    TAP TO DRILL STATS
                  </button>
                </div>

                <div className="bg-kachi/40 rounded-2xl border border-white/10 p-5 flex flex-col items-center">
                  <StatsBoard stats={stats} />
                </div>
              </div>

              {/* Season Track Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">🍂 SEASON: AUTUMN OF FURY</span>
                  <span className="text-rose-500 font-bold">14 DAYS LEFT</span>
                </div>
                <div className="bg-kachi/50 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mb-1.5">
                    <span>SECTOR A</span>
                    <span>SECTOR B (MILSTONE)</span>
                    <span>ASCENSION</span>
                  </div>
                  <div className="h-3 bg-void rounded-full overflow-hidden border border-white/10 relative">
                    <div className="absolute top-0 bottom-0 left-[25%] w-[1.5px] bg-sky-400" />
                    <div className="absolute top-0 bottom-0 left-[50%] w-[1.5px] bg-[#F2C94C]" />
                    <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-rose-500" />
                    <div className="h-full bg-gradient-to-r from-indigo via-rose-500 to-[#F2C94C] rounded-full" style={{ width: '61%' }} />
                  </div>
                </div>
              </div>

              {/* Achievements Medal matrix 6x2 */}
              <div className="space-y-3">
                <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">6X2 MEDALLION ENCLAVE (TAP TO EARN)</p>
                <div className="grid grid-cols-6 gap-2 bg-kachi/25 border border-white/5 rounded-2xl p-4">
                  {achievements.map((ac) => (
                    <div
                      key={ac.id}
                      onClick={() => unlockAchievement(ac.id)}
                      className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative cursor-pointer active:scale-90 transition-all ${
                        ac.unlocked 
                          ? 'bg-gradient-to-br from-sumi via-kachi to-sumi border-rose-500/40 shadow-[0_0_10px_rgba(255,59,48,0.2)]' 
                          : 'bg-void border-zinc-950 opacity-40 grayscale'
                      }`}
                      title={`${ac.title}: ${ac.description}`}
                    >
                      {ac.unlocked && ac.rarity === 'legendary' && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
                      )}
                      <span className="text-xl">{ac.icon}</span>
                      <span className={`text-[6px] font-mono tracking-tighter mt-1 text-center truncate w-[90%] ${ac.unlocked ? 'text-zinc-300' : 'text-zinc-600'}`}>{ac.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}


          {/* ======================= TAB 6: SOUL (魂) ======================= */}
          {currentTab === '魂' && (
            <motion.div key="tab-soul" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2">
              
              <div className="text-center py-2 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-kanji font-black text-rose-500 text-3xl">魂</span>
                  <h2 className="text-xl font-bold text-white tracking-widest">INNER SANCTUM</h2>
                </div>
                <button
                  onClick={() => setIsPremiumOpen(true)}
                  className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-[#F2C94C] text-xs font-mono font-bold text-black rounded-lg gold-shimmer-btn shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  PREMIUM
                </button>
              </div>

              {/* Profile Card overlay config */}
              <div className="bg-gradient-to-br from-[#1A1A24] to-void rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-rose-500/10 border border-rose-500/30 text-[9px] font-mono text-rose-400 px-2 py-0.5 rounded-full">
                  SOUL STAGE 16
                </div>

                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                  <img src={IMAGES.warriorHelmet} className="w-full h-full bg-kachi/75 rounded-full border-2 border-rose-500/40 object-cover" alt="KAGE Avatar" />
                  <div className="absolute bottom-0 right-0 p-1.5 bg-neutral-800 rounded-full border border-neutral-700 cursor-pointer text-xs" title="Edit avatar">
                    📸
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white font-mono tracking-wider">You (KAGE Master)</h3>
                <p className="text-xs text-rose-400 font-mono">CODE_ID: #432963e9</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">SWORN UNDER OATH ON 2026-06-05</p>
              </div>

              {/* 4 Lifetime Stats Grid Cards */}
              <div className="grid grid-cols-2 gap-3">
                <ThreeDCard className="p-3.5" glowColor="rgba(255, 255, 255, 0.05)">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">LIFETIME WORKOUTS</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">112 STRIKES</p>
                </ThreeDCard>
                <ThreeDCard className="p-3.5" glowColor="rgba(255, 255, 255, 0.05)">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">HONOUR POINTS</span>
                  <p className="text-xl font-bold font-mono text-[#F2C94C] mt-1">2,450 HP</p>
                </ThreeDCard>
                <ThreeDCard className="p-3.5" glowColor="rgba(255, 255, 255, 0.05)">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">TOTAL CALORIES</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">34,180 KCAL</p>
                </ThreeDCard>
                <ThreeDCard className="p-3.5" glowColor="rgba(255, 255, 255, 0.05)">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">ACTIVE PROTOCOL</span>
                  <p className="text-xs font-bold font-mono text-sky-400 mt-2 truncate">SHRED DUPLEX</p>
                </ThreeDCard>
              </div>

              {/* Accordion Expandables: Personal Records */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-[#8E9EAF] uppercase tracking-wide">SHADOW RECORDS MAXIMUMS</p>
                
                <div className="divide-y divide-white/5 bg-kachi/20 rounded-xl border border-white/5">
                  <details className="group p-3">
                    <summary className="list-none flex justify-between items-center cursor-pointer text-xs font-semibold text-white">
                      <span>⛩️ PUSH-UPS (Max 1-Min reps)</span>
                      <span className="text-rose-500 font-mono font-bold flex items-center gap-1.5 uppercase">
                        64 REPS
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform" />
                      </span>
                    </summary>
                    <p className="text-[10px] text-zinc-400 font-mono mt-2 leading-relaxed">
                      Executed during GALE-FORCE Wind session on Phase 12. Score validated by physical pact checker brother.
                    </p>
                  </details>

                  <details className="group p-3">
                    <summary className="list-none flex justify-between items-center cursor-pointer text-xs font-semibold text-white">
                      <span>⛩️ PULL-UPS (Heaviest Weight Added)</span>
                      <span className="text-rose-500 font-mono font-bold flex items-center gap-1.5 uppercase">
                        +20 KG
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform" />
                      </span>
                    </summary>
                    <p className="text-[10px] text-zinc-400 font-mono mt-2 leading-relaxed">
                      Sought highest point of lift using standard weighted armor structure. Tested in Sumi dungeon.
                    </p>
                  </details>

                  <details className="group p-3">
                    <summary className="list-none flex justify-between items-center cursor-pointer text-xs font-semibold text-white">
                      <span>⛩️ MEDITATION QUIET SITTING</span>
                      <span className="text-[#2D9C6E] font-mono font-bold flex items-center gap-1.5 uppercase">
                        45 MINS
                        <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform" />
                      </span>
                    </summary>
                    <p className="text-[10px] text-zinc-400 font-mono mt-2 leading-relaxed">
                      Held perfect spinal alignment, deep breathing cycle guided by low synthesised frequencies.
                    </p>
                  </details>
                </div>
              </div>

              {/* Fast Dashboard Settings Row */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono text-zinc-500 uppercase">SANCTUM SETTINGS</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsOathOpen(true)}
                    className="py-2.5 rounded-lg bg-kachi/50 hover:bg-rose-500/10 border border-white/5 font-mono text-xs text-zinc-300 transition-all cursor-pointer active:scale-95"
                  >
                    ⚖️ DECLARE OATH
                  </button>
                  <button 
                    onClick={() => {
                      soundSafe('tap');
                      setIsMuted(!isMuted);
                    }}
                    className="py-2.5 rounded-lg bg-kachi/50 hover:bg-rose-500/10 border border-white/5 font-mono text-xs text-zinc-300 transition-all cursor-pointer active:scale-95"
                  >
                    🔊 SFX: {isMuted ? 'MUTED' : 'ACTIVE'}
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          </AnimatePresence>

        </div>


        {/* ======================= BOTTOM TAB BAR ======================= */}
        <nav className={`fixed bottom-0 left-0 right-0 h-16 px-2 flex justify-around items-center z-30 transition-colors duration-500 ${
          isLight ? 'bg-stone-100/90 backdrop-blur-lg border-t border-stone-200' : 'bg-[#0A0A0F]/90 backdrop-blur-lg border-t border-zinc-800/50'
        }`}>
          {(['家', '武', '道', '先', '异', '魂'] as TabName[]).map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                id={`tab-icon-${tab}`}
                onClick={() => {
                  soundSafe('tap');
                  setCurrentTab(tab);
                }}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all relative cursor-pointer active:scale-95 ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,59,48,0.7)]' : 'opacity-60 hover:opacity-100'}`}
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
        <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A24] rounded-2xl border border-rose-500/40 p-6 w-full max-w-sm space-y-6 shadow-[0_0_40px_rgba(255,59,48,0.3)]">
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-crimson animate-bounce" />
                <h3 className="font-mono font-bold text-white uppercase tracking-wider text-sm">BATTLE CRY DISPATCH</h3>
              </div>
              <button 
                onClick={() => setIsBattleCryModalOpen(false)}
                className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-void p-4 rounded-xl text-center space-y-2 relative border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">REMAINING LIFE SPAN OF TRANSIENT PROVOKE</span>
              <p className="font-mono text-3xl font-black text-[#F2C94C] tracking-widest">{battleCryTimer}</p>
              <p className="text-[10px] text-zinc-400 italic">"Sent by Kazuma #8821"</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-rose-400 uppercase block">ACTIVE OUTCRY CORPS MESSAGE:</label>
              <textarea
                value={battleCryText}
                onChange={(e) => setBattleCryText(e.target.value)}
                rows={3}
                className="w-full bg-void border border-white/10 rounded-xl p-3 text-xs font-sans text-zinc-200 focus:border-rose-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={() => {
                soundSafe('clash');
                setIsBattleCryActive(true);
                setIsBattleCryModalOpen(false);
              }}
              className="w-full neon-shimmer-btn py-3 rounded-lg text-white font-mono font-bold text-xs tracking-widest cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center uppercase"
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
        <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A24] rounded-2xl border border-white/10 p-6 w-full max-w-sm space-y-5 shadow-2xl">
            
            <div className="flex justify-between items-center">
              <h3 className="font-mono font-bold text-white uppercase tracking-widest text-sm">FORGE NEW CONTRACT PACT</h3>
              <button 
                onClick={() => setIsForgeModalOpen(false)}
                className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Modal Tab switch */}
            <div className="flex bg-void p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setForgeTab('create')}
                className={`flex-1 text-center py-1.5 rounded-md font-mono text-xs ${forgeTab === 'create' ? 'bg-kachi text-white font-extrabold' : 'text-zinc-500'}`}
              >
                CREATE CODE
              </button>
              <button
                onClick={() => setForgeTab('join')}
                className={`flex-1 text-center py-1.5 rounded-md font-mono text-xs ${forgeTab === 'join' ? 'bg-kachi text-white font-extrabold' : 'text-zinc-500'}`}
              >
                ENTER KEY
              </button>
            </div>

            {forgeTab === 'create' ? (
              <div className="space-y-4 text-center">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Provide this 6-digit blood key to a trusted companion. When they register it, their health tracker synchronises directly.
                </p>
                <div className="bg-void p-5 rounded-xl border border-dashed border-rose-500/30">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">CONTRACT REGISTRY ID KEY</span>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-rose-400 tracking-wider font-mono">{generatedCode}</p>
                </div>
                <button
                  onClick={() => {
                    soundSafe('tap');
                    // randomize code
                    setGeneratedCode(`${Math.floor(Math.random()*900+100)} ${Math.floor(Math.random()*900+100)}`);
                  }}
                  className="text-[10px] font-mono text-zinc-500 uppercase underline"
                >
                  REGENERATE SECURE VAULT KEY
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">Enter the 6-digit cryptographic covenant link code generated by your training sibling:</p>
                <input
                  type="text"
                  placeholder="e.g., 556 121"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full bg-void border border-white/10 rounded-xl p-3 text-center text-lg font-mono text-white focus:border-rose-500 outline-none"
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
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold tracking-widest py-3 rounded-lg cursor-pointer"
                >
                  SEAL COVENANT pact
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 3: COVENANT/PARTNER SHEET DETAILS ================== */}
      {/* ========================================================================================= */}
      {isPartnerProfileOpen && (
        <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A24] rounded-2xl border border-white/10 p-6 w-full max-w-sm space-y-5 shadow-2xl">
            
            <div className="flex justify-between items-center">
              <h3 className="font-mono font-bold text-white uppercase tracking-wider text-xs">COVENANT PROFILE</h3>
              <button 
                onClick={() => setIsPartnerProfileOpen(false)}
                className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-5xl bg-kachi w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#2D9C6E]">{pactData.avatar}</span>
              <h4 className="font-bold text-lg text-white">{pactData.partnerName}</h4>
              <p className="text-xs text-zinc-400">Accountability Rank Level: {pactData.partnerLevel}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2D9C6E]/10 border border-[#2D9C6E]/30 text-xs text-emerald-400 font-mono">
                <Shield className="w-4.5 h-4.5" />
                SHIELD INTACT
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono text-[#8E9EAF] uppercase tracking-widest">JOINT STRIKE TIMELINE HISTORY:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                {pactData.history.map((row, idx) => (
                  <div key={idx} className="bg-void p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-white">{row.workoutName}</p>
                      <span className="text-[9px] text-zinc-500">{row.date}</span>
                    </div>
                    <span className="text-xs font-mono text-[#F2C94C] font-bold">{row.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundSafe('clash');
                // Destructive prompt
                if(confirm("Are you sure you want to fracture this shield and break your pledge oath?")) {
                  setPactData({
                    ...pactData,
                    partnerName: "No Pledge Active",
                    sharedStreak: 0,
                    shieldIntact: false,
                    avatar: "🌫️"
                  });
                  setIsPartnerProfileOpen(false);
                }
              }}
              className="w-full bg-[#9E2A2A] hover:bg-rose-700 text-white font-mono text-xs font-bold py-2.5 rounded-lg cursor-pointer"
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
        <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A24] rounded-2xl border border-rose-500/30 p-6 w-full max-w-sm space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            <div className="flex justify-between items-center">
              <h3 className="font-mono font-bold text-white uppercase tracking-widest text-xs">SWEAR SHADOW OATH</h3>
              <span className="text-xs font-mono text-rose-500">{oathStep} / 4 STEPS</span>
            </div>

            <div className="min-h-[140px] flex flex-col justify-center text-center space-y-3">
              {oathStep === 1 && (
                <>
                  <span className="text-3xl">誓</span>
                  <p className="text-sm font-semibold text-white">"I swear to look inside the void before launching training, committing my muscles and heart to constant self-conquest."</p>
                </>
              )}
              {oathStep === 2 && (
                <>
                  <span className="text-3xl">武</span>
                  <p className="text-sm font-semibold text-white">"I declare that sweat is my medicine and consistency is my sword. No day shall melt without direct muscle stimulation."</p>
                </>
              )}
              {oathStep === 3 && (
                <>
                  <span className="text-3xl">道</span>
                  <p className="text-sm font-semibold text-white">"I swear to protect my covenant brother, answering their battle cry instantly and maintaining my shared combat shield."</p>
                </>
              )}
              {oathStep === 4 && (
                <>
                  <span className="text-3xl">魂</span>
                  <p className="text-sm font-semibold text-white">"Under code 432963e9 in the high temple of KAGE, I pledge my unyielding effort for the season of fury."</p>
                </>
              )}
            </div>

            <div className="flex justify-between gap-3">
              {oathStep > 1 && (
                <button
                  onClick={() => setOathStep(oathStep - 1)}
                  className="flex-1 py-2 rounded bg-[#2A2A3A] hover:bg-zinc-700 font-mono text-xs text-white"
                >
                  RETREAT
                </button>
              )}
              
              {oathStep < 4 ? (
                <button
                  onClick={() => {
                    soundSafe('tap');
                    setOathStep(oathStep + 1);
                  }}
                  className="flex-1 py-2 rounded bg-rose-500 hover:bg-rose-600 font-mono text-xs text-white"
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
                  className="flex-1 py-2 rounded bg-gradient-to-r from-[#F2C94C] to-[#E87A5D] text-black font-extrabold font-mono text-xs"
                >
                  SWEAR BLOOD BOND
                </button>
              )}
            </div>

          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* ======================= OVERLAY MODAL 5: PREMIUM GATE LOCK OUT =========================== */}
      {/* ========================================================================================= */}
      {isPremiumOpen && (
        <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1A1A24] rounded-2xl border border-yellow-600/50 p-6 w-full max-w-md space-y-6 shadow-[0_0_60px_rgba(242,201,76,0.2)]">
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Lock className="w-5 h-5 fill-yellow-500/20" />
                <h3 className="font-mono font-bold uppercase tracking-widest text-sm">PREMIUM GATE CHAMBER</h3>
              </div>
              <button 
                onClick={() => setIsPremiumOpen(false)}
                className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-200">ASCEND THE MOUNTAIN</h4>
              <p className="text-xs text-zinc-400">Gain live full-bandwidth Cyber-Sensei neural advice and advanced tracking stats.</p>
            </div>

            {/* Feature Comparision table */}
            <div className="overflow-hidden border border-white/5 rounded-xl text-xs bg-void/60 divide-y divide-white/5">
              <div className="grid grid-cols-3 p-2.5 font-mono text-[9px] text-zinc-500 uppercase">
                <span>BENEFIT PROTOCOL</span>
                <span>FREE CADET</span>
                <span className="text-yellow-500 font-bold">SOUL ELITE</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-300">Dojo Floor Access</span>
                <span className="text-zinc-500">Standard</span>
                <span className="text-[#2D9C6E] font-bold">All 48 Modules</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-300">Cyber-Sensei Advice</span>
                <span className="text-zinc-500">Cached Lines Only</span>
                <span className="text-cyan-400 font-mono font-bold">Live Gemini Grid</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-300">Simultaneous Pacts</span>
                <span className="text-zinc-500">Max 1</span>
                <span className="text-[#6A4E9B] font-bold">Infinite Shadows</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-300">Synthesised audio loops</span>
                <span className="text-zinc-500">Fallback only</span>
                <span className="text-[#F2C94C] font-bold">High Hz Zen</span>
              </div>
            </div>

            {/* Shimmering CTA gold buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  soundSafe('clash');
                  alert("Swearing allegiance to the Elite Annual pact ($29.99/yr) initiates!");
                }}
                className="w-full gold-shimmer-btn py-3.5 rounded-xl text-black font-mono font-black tracking-widest text-xs shadow-lg uppercase"
              >
                ANNUAL ASCENSION ($29.99 / YEAR)
              </button>
              <button
                onClick={() => {
                  soundSafe('clash');
                  alert("Forging lifetime supreme shadow covenant ($79.99) initiates!");
                }}
                className="w-full bg-gradient-to-r from-neutral-800 to-black text-neutral-200 hover:text-white border border-neutral-700 py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all"
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
          onClose={() => {
            setSelectedProgram(null);
            setActiveRunningProgram(selectedProgram);
            setRunningTimer(0);
            setIsRunning(true);
          }}
        />
      )}

      {/* ========================================================================================= */}
      {/* ======================= ACTIVE RUNNING TIMER SCREEN OVERLAY ============================= */}
      {activeRunningProgram && (
        <div className="fixed inset-0 bg-void z-50 flex flex-col items-center justify-between p-6">
          <div className="w-full max-w-sm flex justify-between items-center mt-4">
            <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-[9px] uppercase tracking-widest">RUNNING COMBAT TIMER</span>
            <button
              onClick={() => {
                if(confirm("Exit training sequence? This breaks today\'s fire progression!")) {
                  setActiveRunningProgram(null);
                  setIsRunning(false);
                }
              }}
              className="p-1.5 rounded-full bg-kachi/50 hover:bg-rose-500/10 cursor-pointer"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Master 3D focus clock */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer Glowing spinning circle */}
              <div className={`absolute inset-0 rounded-full border-4 border-dashed border-rose-500/10 ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '40s' }} />
              <div className="absolute w-48 h-48 rounded-full bg-gradient-to-b from-sumi to-void shadow-[inset_0_4px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(255,59,48,0.25)] flex flex-col items-center justify-center relative">
                
                <span className="text-xs uppercase text-zinc-500 tracking-widest font-mono">ELAPSED TIME</span>
                <span className="text-4xl font-mono font-black tracking-widest text-white mt-1">
                  {Math.floor(runningTimer / 60).toString().padStart(2, '0')}:{Math.floor(runningTimer % 60).toString().padStart(2, '0')}
                </span>
                
                <span className="text-[10px] text-[#2D9C6E] font-mono mt-1 font-bold animate-pulse">WARRIOR FIRE ACTIVE</span>
              </div>
            </div>

            <div className="text-center">
              <span className="font-kanji font-black text-rose-500 text-lg">{activeRunningProgram.nameKanji}</span>
              <h2 className="text-xl font-extrabold text-white tracking-widest mt-0.5">{activeRunningProgram.nameEnglish}</h2>
              <p className="text-xs text-zinc-400 max-w-xs mt-1">{activeRunningProgram.description}</p>
            </div>
          </div>

          {/* Next drills list */}
          <div className="w-full max-w-sm bg-kachi/30 rounded-2xl border border-white/5 p-4 space-y-3">
            <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block">STEEL PATTERNS & DRILLS:</span>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {activeRunningProgram.moves.map((move, i) => (
                <div key={i} className="flex items-center gap-3 bg-void/50 p-2 rounded-lg border border-white/5 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundImage: `url(${move.image})` }}></div>
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-[10px] text-rose-500 font-bold relative z-10">{i+1}</span>
                  <span className="text-xs text-white font-mono relative z-10 drop-shadow-md">{move.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Control Triggers */}
          <div className="w-full max-w-sm flex gap-3 mb-6">
            <button
              onClick={() => {
                soundSafe('tap');
                setIsRunning(!isRunning);
              }}
              className={`flex-1 text-center py-4 rounded-xl font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all uppercase border ${isRunning ? 'bg-[#9E2A2A] text-white border-rose-500/30' : 'bg-[#2D9C6E] text-white border-emerald-500/30'}`}
            >
              {isRunning ? 'PAUSE STEEL FLOW' : 'RESUME DRILL CLASH'}
            </button>
            <button
              onClick={() => {
                soundSafe('chime');
                unlockAchievement('ac1');
                // complete
                setStreak(prev => prev + 1);
                // random stats bump
                setStats(s => ({
                  ...s,
                  Strength: Math.min(100, s.Strength + 2),
                  Endurance: Math.min(100, s.Endurance + 3)
                }));
                alert(`CONGRATULATIONS WARRIOR! You successfully completed [${activeRunningProgram.nameEnglish}]. Live points and streak counters updated within the ledger.`);
                setActiveRunningProgram(null);
                setIsRunning(false);
              }}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-[#F2C94C] text-black font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all uppercase"
            >
              FINISH PROTOCOL
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* ======================= OVERLAY LIGHTBOX: DESIGN SHOWROOM ZOOM =========================== */}
      {/* ========================================================================================= */}
      {zoomedPhoto !== null && (
        <div 
          className="fixed inset-0 bg-void/98 z-50 flex flex-col items-center justify-center p-4 md:p-10 backdrop-blur-xl transition-all duration-300 animate-fadeIn"
          onClick={() => setZoomedPhoto(null)}
        >
          <div 
            className={`w-full max-w-4xl rounded-3xl border p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] transition-all relative ${
              zoomedPhoto === 'parchment'
                ? 'bg-[#EAE4D7] border-stone-400 text-stone-900'
                : 'bg-[#0B0B0C] border-rose-500/20 text-white'
            }`}
            onClick={(e) => e.stopPropagation()} // Stop background click from closing
          >
            {/* Close trigger button */}
            <button 
              onClick={() => setZoomedPhoto(null)}
              className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
                zoomedPhoto === 'parchment' ? 'bg-stone-300 hover:bg-stone-400 text-stone-900' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
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
                  />
                  
                  {/* Anchor watermark overlays */}
                  <div className="absolute bottom-4 left-4 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 text-white font-mono text-[9px] flex items-center gap-1.5">
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
                  <div className="space-y-3.5 text-xs text-zinc-400 leading-relaxed">
                    <p>
                      This theme replicates the <strong className="text-white font-bold">Cyber Samurai "Kage" Wallpaper</strong>. It leverages dramatic chiaroscuro and highly vibrant cyberpunk neon-red strokes:
                    </p>
                    <ul className="space-y-2.5 list-disc list-inside bg-neutral-900 p-4 rounded-xl border border-white/5">
                      <li>
                        <strong className="text-white font-bold">Void Charcoal canvas:</strong> A rich background gradient that focuses 100% attention on the central figure.
                      </li>
                      <li>
                        <strong className="text-white font-bold">The Radiant Sun Backlight:</strong> A giant glowing circular gradient in deep scarlet/crimson.
                      </li>
                      <li>
                        <strong className="text-white font-bold">Huge Calligraphic "影" (KAGE):</strong> Left-aligned, acting as a dynamic backdrop watermark that scales with negative space.
                      </li>
                      <li>
                        <strong className="text-white font-bold">Saturated red-accents:</strong> Buttons, tags, and sparks emerge from the darkness like burning cinders.
                      </li>
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-300/40">
                  <button 
                    onClick={() => setZoomedPhoto(null)}
                    className="w-full py-3 bg-stone-950 text-white hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-500 rounded-xl font-mono text-xs font-bold font-black uppercase shadow-lg select-all"
                  >
                    ⚖️ CONFIRM STYLE COMPREHENSION
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
    </ErrorBoundary>
  );
}
