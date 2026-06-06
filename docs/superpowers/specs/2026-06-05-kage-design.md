# KAGE DESIGN DOCUMENT

### Date: 2026-06-05
### Version: 2.0 (Design Phase)

---

## 1. Design Philosophy

- **Ghost of Tsushima minimalism**: diegetic UI, minimal HUD, purposeful kanji usage, no "fortune cookie" clichés
- **Dark mode default**: bg `#0B1A2E`, accent `#C8102E` (red), gold `#C9A84C`
- **Glassmorphism cards** with frosted borders (`rgba(255,255,255,0.03-0.08)`)
- **3D buttons** with shadow + elevation + press scale animation
- **Animated particle backgrounds** (subtle, Reanimated)
- **Japanese warrior theme** feels authentic, not cliché
- **All features work offline** (SQLite local storage, media bundled as assets)
- **Zero-equipment, zero-gym, zero-cost training focus**

---

## 2. Tab Architecture (6 Tabs)

| # | Tab | Kanji Icon | Content |
|---|-----|-----------|---------|
| 1 | Home | 家 | Dashboard: streak, Battle Cry status, Sensei greeting, KPI grid, week calendar |
| 2 | Train | 武 | Workout hub + Diet section: program selection, active workout, rest timer, Lock-In mode, macros, water, meals, plans |
| 3 | Dojo | 道 | Warrior Pact hub: Battle Cry (active timer + history), Pact Status Card, Active Pacts list, Squad Leaderboard, Forge New Pact |
| 4 | Evolve | 昇 | Progression: rank ladder, XP breakdown, attribute rings, recovery heatmap, PRs, history, measurements |
| 5 | Soul | 魂 | Profile + Settings: avatar, stats grid, attributes, timeline, profile photo upload, collapsible settings |
| 6 | Sensei | 先 | Full AI coach: free chat interface, Gemini integration, offline fallback to canned quotes |

---

## 3. Detailed Screen Specifications

### 3.1 Home Tab

- Current implementation mostly stays as-is
- **Add**: Battle Cry status badge (top-right, shows when active Battle Cry exists from any pact)
- **Add**: Partner activity widget (shows "Your pact partner trained today ✅" or "Partner hasn't trained yet ⏳")
- **Remove**: attribute rings (moved to Evolve tab)
- **Keep**: hero header, streak card, Sensei inline greeting, KPI grid (2x3 Stats), week calendar, InkDivider, Lock-In button (moved but still accessible)

### 3.2 Train Tab

- Current workout flow stays: idle (program selection) → active (exercise + sets) → rest (timer) → complete (XP summary)
- **Add Diet section below program selection**:
  - **Macro Rings**: animated circular progress for Protein, Carbs, Fat, Calories. Auto-adapts to active program macros.
  - **Water Tracker**: 8 cup/day goal, tap to add, visual progress bar, daily reset
  - **Today's Meals**: timeline showing logged meals (breakfast, lunch, dinner, snacks) with calorie counts. "+" button to add meal with photo + text
  - **Meal Plans**: 7-day warrior meal plan, viewable by day, shows recipes + ingredients
- **Add**: Zero-equipment filter toggle for program list
- **Lock-In mode** available as session variant

### 3.3 Dojo Tab (NEW — Viral Differentiator)

Layout order (top to bottom):

**A. Battle Cry Section** (dynamic)

- When **ACTIVE**: 15-minute countdown timer (red, pulsing), "RESPOND NOW" CTA button, camera opens on tap → take photo + write message → submit
  - Post-to-view mechanic: partner's response hidden until you submit
  - Both responded → mutual reveal → added to history
- When **INACTIVE**: compact "Last Battle Cry" summary showing last result
- **Battle Cry History**: scrollable timeline of past Battle Cries, each entry shows both responses, timestamp, reaction button

**B. Pact Status Card**

- Two circles connected by animated chain (Reanimated link animation)
- Left circle: you (avatar, streak number)
- Right circle: partner (avatar, streak number)
- Chain glowing gold when both active, red when one misses
- **Combined Shield Progress Bar**: fills as both train consistently
- **Shield Levels**: Bronze (7d) → Silver (30d) → Gold (90d) → Onyx (365d)
- Each level unlocks visual shield evolution
- If one misses: chain turns red, crack animation, countdown to destruction (24h warning)

**C. Active Pacts**

- Flat list of up to 5 parallel pacts
- Each row: shield icon, partner name, streak number, status badge
- Status colors: 🟢 Safe | 🟡 Warning | 🔴 Danger | 💀 Breaking
- Tap row → open pact detail modal (partner profile, joint history, streak graph)

**D. Squad Leaderboard**

- Top 20 pacts ranked by combined streak
- Current user's pact highlighted with gold border
- Pull-to-refresh
- Shows: rank #, partner names, combined streak, shield level

**E. Forge New Pact**

- "Forge New Pact" button (3D gold variant)
- Tapping opens forge modal:
  - Option A: Generate invite code (shareable)
  - Option B: Enter partner's username/code to accept
- **7-Day Initiation**: once accepted, both must train 7 consecutive days to "seal" the pact

**Data Models for Dojo:**

```typescript
interface WarriorPact {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  streak: number;
  combinedStreak: number;
  shieldLevel: 'bronze' | 'silver' | 'gold' | 'onyx';
  shieldProgress: number; // 0-1
  lastWorkoutDate: string;
  partnerLastWorkoutDate: string;
  status: 'safe' | 'warning' | 'danger' | 'breaking';
  createdAt: string;
}

interface BattleCry {
  id: string;
  pactId: string;
  triggeredAt: string;
  respondedAt?: string;
  myResponse?: { text: string; photoUrl?: string };
  partnerResponse?: { text: string; photoUrl?: string };
  status: 'pending' | 'responded' | 'expired';
}
```

### 3.4 Evolve Tab

- Enhanced from current Progress screen
- **Keep**: rank badge (hero position), journey stats (XP, level, workouts, streak), XP breakdown bars, recovery heatmap, rank progression ladder, recent workouts
- **Move** attribute rings here from Home (5 animated rings: STR, DIS, END, FOC, REC)
- **Add**: Achievement showcase (unlocked badges: "First Blood" for first workout, "Century" for 100 workouts, etc.)
- **Add**: Weekly/monthly trend charts (workouts per week, XP per week)
- **Keep** navigation buttons: PRs, History, Measurements

### 3.5 Soul Tab

- Enhanced from current Profile screen
- **Keep**: kanji avatar, name/title, XP badge, journey stats grid (2x3), attribute bars, timeline
- **Add**: profile photo upload (from camera or gallery)
- **Add**: achievement badges display (grid of earned badges from Evolve)
- **Add**: pact count ("Bound with X warriors")
- **Merge Settings** as collapsible section at bottom (appearance toggle, clear data, about)
- **Remove** separate settings modal — everything accessible inline

### 3.6 Sensei Tab (NEW)

- Full-screen chat interface
- Scrollable message history
- User types question → sends to backend → Gemini responds → displays in chat
- Quick topic buttons as suggestion chips (not required, just helpful)
- **Offline mode**: Sensei shows "I'm meditating right now. Ask me again when we're connected." + displays random wisdom quotes
- Inline Sensei quotes remain on Home and Train dashboards as they currently are
- **Data flow**: User → API → FastAPI → Gemini → Response → Display

---

## 4. New Modal Screens

| Screen | File | Purpose |
|--------|------|---------|
| Battle Cry Response | `app/dojo/battle-cry.tsx` | Camera + text input, 15-min timer, submit response |
| Pact Invite | `app/dojo/invite/[code].tsx` | Accept/decline pact invitation |
| Forge Pact | `app/dojo/forge.tsx` | Create invite code or enter partner code |
| Pact Detail | `app/dojo/pact/[id].tsx` | Partner profile, joint history, streak graph |
| Warrior Oath | `app/warrior-oath.tsx` | 7-day initiation onboarding flow for new pacts |

---

## 5. User Flows (Key Scenarios)

### Battle Cry Flow

```
Server triggers Battle Cry (random, both partners simultaneous)
  → Push notification to both
  → User opens app → Dojo tab badge indicator shows
  → Battle Cry section at top of Dojo: 15:00 timer + "RESPOND" button
  → Tap "RESPOND" → camera opens (take photo) + text field → submit
  → Partner's post hidden until they respond
  → Partner responds → mutual reveal → both see each other's post
  → Added to Battle Cry History with timestamp
  → Both partners can like/react to the Battle Cry entry
```

### Forge Pact Flow

```
Tap "Forge New Pact" → choose method:
  → Send Invite: generates shareable code → share via any app
  → Accept Code: enter received code → preview partner profile
  → Confirm → 7-Day Initiation begins
  → Both must train 7 consecutive days
  → Day 7 → Pact sealed! Shield appears. Streak starts counting.
  → If either misses during initiation → pact breaks, must restart
```

### Offline Handling

- Dojo state stored in SQLite locally
- Battle Cries queued for sync when online
- Pact data synced on app open + periodic background sync
- Leaderboard requires connectivity (shows cached version when offline)

---

## 6. Component Tree

```
App
├── TabNavigator (6 tabs)
│   ├── HomeScreen
│   │   ├── ParticleBackground
│   │   ├── HeroHeader
│   │   ├── BattleCryBadge (new)
│   │   ├── StreakCard
│   │   ├── Sensei (inline compact)
│   │   ├── RankAndXP
│   │   ├── KPIGrid (2x3)
│   │   ├── PartnerActivity (new)
│   │   ├── WeekCalendar
│   │   └── LockInButton
│   │
│   ├── TrainScreen
│   │   ├── [idle] ProgramList
│   │   │   ├── ZeroEquipmentFilter (new)
│   │   │   ├── DietSection (new)
│   │   │   │   ├── MacroRings
│   │   │   │   ├── WaterTracker
│   │   │   │   ├── MealLog
│   │   │   │   └── MealPlans
│   │   │   └── ProgramCards (existing)
│   │   ├── [active] ExerciseView
│   │   │   ├── ExerciseCard
│   │   │   ├── SetRow
│   │   │   └── ProgressBar
│   │   ├── [rest] RestTimer
│   │   └── [complete] WorkoutComplete
│   │
│   ├── DojoScreen (new)
│   │   ├── BattleCrySection
│   │   │   ├── ActiveTimer (when active)
│   │   │   └── CryHistory
│   │   ├── PactStatusCard
│   │   │   ├── ChainAnimation
│   │   │   ├── PartnerCircle
│   │   │   └── ShieldProgress
│   │   ├── ActivePactsList
│   │   ├── SquadLeaderboard
│   │   └── ForgePactButton
│   │
│   ├── EvolveScreen
│   │   ├── RankBadge (hero)
│   │   ├── JourneyStats
│   │   ├── AttributeRings (moved from Home)
│   │   ├── XPOverview
│   │   ├── RecoveryHeatmap
│   │   ├── Achievements (new)
│   │   ├── RankLadder
│   │   ├── TrendCharts (new)
│   │   ├── NavButtons (PRs, History, Measurements)
│   │   └── RecentWorkouts
│   │
│   ├── SoulScreen
│   │   ├── ProfileCard
│   │   │   ├── PhotoUpload (new)
│   │   │   ├── Avatar
│   │   │   ├── Name/Title
│   │   │   └── XP Badge
│   │   ├── StatsGrid
│   │   ├── Achievements (new)
│   │   ├── PactCount (new)
│   │   ├── Attributes
│   │   ├── Timeline
│   │   └── SettingsSection (collapsible, new)
│   │
│   └── SenseiScreen (new)
│       ├── ChatHistory
│       ├── QuickTopics (chips)
│       └── MessageInput
│
├── Modals
│   ├── BattleCryModal
│   ├── ForgePactModal
│   ├── AcceptInviteModal
│   ├── PactDetailModal
│   ├── WarriorOath
│   ├── LockInSession
│   ├── PersonalRecords
│   ├── WorkoutHistory
│   └── BodyMeasurements
```

---

## 7. Visual Design System

### Colors (Dark Mode Default)

```
Background:        #0B1A2E (navy-black)
Surface Glass:     rgba(255,255,255,0.03-0.08)
Accent Red:        #C8102E (primary CTA, danger, active)
Accent Gold:       #C9A84C (achievements, premium)
Status Green:      #00CC88 (safe, completed)
Warning Amber:     #D4A030 (warning)
Recovery Blue:     #3B82F6 (recovery stats)
Text Primary:      #F5F0E8 (cream white)
Text Muted:        rgba(245,240,232,0.28)
```

### Typography

```
Display/Headings:  NotoSansJP (Japanese warrior feel)
Body:              Inter (clean readability)
Kanji:             NotoSansJP-Bold (for kanji icons)
Monospace:         Menlo/monospace (for numbers)
```

### Spacing Scale

```
xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
```

### Tab Bar Design

```
Height: 85px, transparent bg with glass effect
Active tab: red accent (#C8102E), kanji icon
Inactive tab: muted opacity (0.5)
Dot indicator under active tab (4px circle)
```

---

## 8. Implementation Priorities (MVP Order)

### Phase 1: Foundation (Dojo + Battle Cry — the viral hook)

1. Create Dojo tab + tab navigator update (6 tabs)
2. Build Pact Status Card component
3. Build Battle Cry system (trigger, timer, response, reveal)
4. Build Active Pacts list + pact detail modal
5. Build Squad Leaderboard
6. Build Forge Pact flow

### Phase 2: Sensei Tab

1. Create Sensei tab with chat UI
2. Wire backend Gemini endpoint
3. Offline fallback quotes

### Phase 3: Diet Section (in Train)

1. Build Macro Rings component
2. Build Water Tracker component
3. Build Meal Log component
4. Build Meal Plans viewer

### Phase 4: Enhancements

1. Move attribute rings from Home → Evolve
2. Add Battle Cry badge to Home
3. Add Partner activity widget to Home
4. Add Achievements to Evolve + Soul
5. Merge Settings into Soul
6. Add profile photo upload to Soul

### Phase 5: Polish

1. 7-Day Initiation onboarding flow
2. Chain animation for pact status
3. Photo capture for Battle Cry
4. Push notification integration
5. Offline queue for Battle Cries

---

## 9. Offline Strategy

- All Dojo state stored in SQLite locally
- Battle Cry responses queued when offline, sent on reconnect
- Pact status cached and updated on app foreground
- Leaderboard shows cached version when offline with "Offline" indicator
- Sensei falls back to canned quotes when offline
- Diet data stored entirely locally (no sync needed)
- Photos stored locally, uploaded when connected

---

*End of Design Document — KAGE v2.0*
