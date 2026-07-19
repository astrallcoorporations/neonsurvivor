'use client';

/**
 * Neon Survivor — meta store
 * Reads/writes the SAME localStorage key ('neon_survivor_meta_v3') the
 * in-iframe game uses, so the React shell and the game stay in sync.
 */
import { create } from 'zustand';

const STORAGE_KEY = 'neon_survivor_meta_v3';

export interface MetaStats {
  totalKills: number;
  totalRuns: number;
  totalBosses: number;
  bestTime: number;
  bestWave: number;
  bestLevel: number;
  bestScore: number;
  totalCredits: number;
  totalPlaytime: number;
}
export interface DailyQuest {
  id: string; name: string; target: number; reward: number; type: string;
  claimed?: boolean;
}
export interface MasteryEntry { level: number; xp: number; }

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  bloom: boolean;
  scanlines: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
  reducedMotion: boolean;
  particleQuality: 'low' | 'medium' | 'high';
}

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.65,
  musicVolume: 0.32,
  sfxVolume: 0.7,
  bloom: true,
  scanlines: true,
  screenShake: true,
  damageNumbers: true,
  reducedMotion: false,
  particleQuality: 'high',
};

export interface MetaData {
  credits: number;
  prestige: number;
  ascension: number;
  classId: string;
  classOwned: string[];
  shopOwned: string[];
  weaponMastery: Record<string, MasteryEntry>;
  minimapLevel: number;
  relicSlots: number;
  relicsOwned: string[];
  itemsDiscovered: string[];
  dailyQuests: DailyQuest[];
  dailyProgress: Record<string, number>;
  dailyDate: string;
  stats: MetaStats;
  settings: GameSettings;
}

function defaultMeta(): MetaData {
  return {
    credits: 0, prestige: 0, ascension: 0,
    classId: 'soldier', classOwned: ['soldier'],
    shopOwned: [], weaponMastery: {}, minimapLevel: 0,
    relicSlots: 1, relicsOwned: [], itemsDiscovered: [],
    dailyQuests: [], dailyProgress: {}, dailyDate: '',
    stats: { totalKills:0, totalRuns:0, totalBosses:0, bestTime:0, bestWave:0, bestLevel:0, bestScore:0, totalCredits:0, totalPlaytime:0 },
    settings: { ...DEFAULT_SETTINGS },
  };
}

function loadMeta(): MetaData {
  if (typeof window === 'undefined') return defaultMeta();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMeta();
    const parsed = JSON.parse(raw);
    return {
      ...defaultMeta(), ...parsed,
      stats: { ...defaultMeta().stats, ...(parsed.stats||{}) },
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings||{}) },
    };
  } catch { return defaultMeta(); }
}

function saveMeta(m: MetaData) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)); } catch {}
}

interface NeonState {
  meta: MetaData;
  reload: () => void;
  persist: () => void;
  spendCredits: (n: number) => boolean;
  addCredits: (n: number) => void;
  buyShopItem: (id: string, cost: number) => boolean;
  setClass: (id: string) => void;
  unlockClass: (id: string, cost: number) => boolean;
  claimDaily: () => number;
  doPrestige: () => boolean;
  doAscend: () => boolean;
  updateSettings: (patch: Partial<GameSettings>) => void;
  clearData: () => void;
  _set: (updater: (m: MetaData) => MetaData) => void;
}

export const useNeon = create<NeonState>((set, get) => ({
  meta: loadMeta(),

  reload: () => set({ meta: loadMeta() }),
  persist: () => saveMeta(get().meta),

  _set: (updater) => {
    const next = updater({ ...get().meta });
    saveMeta(next);
    set({ meta: next });
  },

  spendCredits: (n) => {
    const m = get().meta;
    if (m.credits < n) return false;
    get()._set(prev => ({ ...prev, credits: prev.credits - n }));
    return true;
  },

  addCredits: (n) => {
    get()._set(prev => ({
      ...prev,
      credits: prev.credits + n,
      stats: { ...prev.stats, totalCredits: (prev.stats.totalCredits||0) + n },
    }));
  },

  buyShopItem: (id, cost) => {
    const m = get().meta;
    if (m.shopOwned.includes(id)) return false;
    if (m.credits < cost) return false;
    get()._set(prev => {
      const next: MetaData = {
        ...prev,
        credits: prev.credits - cost,
        shopOwned: [...prev.shopOwned, id],
        minimapLevel: id.startsWith('minimap') ? prev.minimapLevel + 1 : prev.minimapLevel,
        relicSlots: id === 'relic_slot' ? prev.relicSlots + 1 : prev.relicSlots,
      };
      return next;
    });
    return true;
  },

  setClass: (id) => {
    get()._set(prev => ({ ...prev, classId: id }));
  },

  unlockClass: (id, cost) => {
    const m = get().meta;
    if (m.classOwned.includes(id)) { get().setClass(id); return true; }
    if (m.credits < cost) return false;
    get()._set(prev => ({
      ...prev,
      credits: prev.credits - cost,
      classOwned: [...prev.classOwned, id],
      classId: id,
    }));
    return true;
  },

  claimDaily: () => {
    let total = 0;
    get()._set(prev => {
      const quests = prev.dailyQuests.map(q => {
        const prog = prev.dailyProgress[q.id] || 0;
        if (prog >= q.target && !q.claimed) { total += q.reward; return { ...q, claimed: true }; }
        return q;
      });
      return {
        ...prev,
        dailyQuests: quests,
        credits: prev.credits + total,
        stats: { ...prev.stats, totalCredits: (prev.stats.totalCredits||0) + total },
      };
    });
    return total;
  },

  doPrestige: () => {
    const m = get().meta;
    if (m.stats.totalRuns < 5 || m.prestige >= 10) return false;
    get()._set(prev => ({
      ...prev,
      prestige: prev.prestige + 1,
      credits: prev.credits + 200,
      shopOwned: [], weaponMastery: {}, minimapLevel: 0,
      relicSlots: 1, relicsOwned: [],
      classOwned: ['soldier'], classId: 'soldier',
    }));
    return true;
  },

  doAscend: () => {
    const m = get().meta;
    if (m.stats.bestLevel < 40 || m.ascension >= 5) return false;
    get()._set(prev => ({ ...prev, ascension: prev.ascension + 1, credits: prev.credits + 500 }));
    return true;
  },

  updateSettings: (patch) => {
    get()._set(prev => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  },

  clearData: () => {
    const fresh = defaultMeta();
    saveMeta(fresh);
    set({ meta: fresh });
  },
}));

/** Convenience selector hook for formatted time */
export function fmtTime(s: number): string {
  const m = Math.floor(s/60), ss = Math.floor(s%60);
  return m + ':' + (ss < 10 ? '0' : '') + ss;
}
