const RONIN_KEY = 'kage_ronin_mode';
const RONIN_START_KEY = 'kage_ronin_start';

export interface RoninState {
  enabled: boolean;
  startDate: number | null;
  completedDays: number;
}

export function getRoninState(): RoninState {
  try {
    const enabled = localStorage.getItem(RONIN_KEY) === 'true';
    const startDate = parseInt(localStorage.getItem(RONIN_START_KEY) || '0', 10) || null;
    const completedDays = parseInt(localStorage.getItem('kage_ronin_days') || '0', 10);
    return { enabled, startDate, completedDays };
  } catch {
    return { enabled: false, startDate: null, completedDays: 0 };
  }
}

export function enableRoninMode(): void {
  localStorage.setItem(RONIN_KEY, 'true');
  localStorage.setItem(RONIN_START_KEY, String(Date.now()));
  localStorage.setItem('kage_ronin_days', '0');
}

export function disableRoninMode(): boolean {
  const state = getRoninState();
  if (!state.enabled || !state.startDate) return false;

  const daysSinceStart = Math.floor((Date.now() - state.startDate) / (1000 * 60 * 60 * 24));
  if (daysSinceStart < 7) return false;

  localStorage.setItem(RONIN_KEY, 'false');
  localStorage.removeItem(RONIN_START_KEY);
  return true;
}

export function roninDaysRemaining(): number {
  const state = getRoninState();
  if (!state.enabled || !state.startDate) return 0;
  const daysSinceStart = Math.floor((Date.now() - state.startDate) / (1000 * 60 * 60 * 24));
  return Math.max(0, 7 - daysSinceStart);
}

export function isRoninComplete(): boolean {
  return roninDaysRemaining() === 0 && getRoninState().enabled;
}

export function incrementRoninDay(): void {
  const current = parseInt(localStorage.getItem('kage_ronin_days') || '0', 10);
  localStorage.setItem('kage_ronin_days', String(current + 1));
}

export function roninRestrictions(): { skipRestTimer: boolean; requireGymPhoto: boolean; requireVerification: boolean } {
  const state = getRoninState();
  if (!state.enabled) {
    return { skipRestTimer: true, requireGymPhoto: false, requireVerification: false };
  }
  return { skipRestTimer: false, requireGymPhoto: true, requireVerification: true };
}
