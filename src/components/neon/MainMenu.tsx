'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNeon, fmtTime } from '@/lib/neon/store';
import { MODES, CLASSES, MAPS } from '@/lib/neon/data';

export function MainMenu({ onPlay, onNav }: { onPlay: (mode: string) => void; onNav: (s: string) => void }) {
  const meta = useNeon(s => s.meta);
  const cls = CLASSES.find(c => c.id === meta.classId) || CLASSES[0];
  const currentMap = MAPS.find(m => m.id === meta.settings.selectedMap) || MAPS[0];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasDailyRewards = (meta.dailyQuests || []).some(q => {
    const prog = meta.dailyProgress[q.id] || 0;
    return prog >= q.target && !q.claimed;
  });

  const coreNavs: { id: string; label: string; icon: string; color: string; badge?: boolean }[] = [
    { id: 'shop', label: 'SHOP', icon: '🛒', color: 'var(--neon-grn)' },
    { id: 'classes', label: 'CLASSES', icon: '⚡', color: 'var(--neon-pur)' },
    { id: 'multiplayer', label: 'MULTIPLAYER', icon: '🌐', color: 'var(--neon-cyan)' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️', color: 'var(--neon-txt-dim)' },
  ];
  const advancedNavs: { id: string; label: string; icon: string; color: string; badge?: boolean }[] = [
    { id: 'friends', label: 'FRIENDS', icon: '👥', color: 'var(--neon-grn)' },
    { id: 'stats', label: 'STATS', icon: '📊', color: 'var(--neon-cyan)' },
    { id: 'arsenal', label: 'ARSENAL', icon: '🔫', color: 'var(--neon-mag)' },
    { id: 'bestiary', label: 'BESTIARY', icon: '👹', color: 'var(--neon-red)' },
    { id: 'achievements', label: 'AWARDS', icon: '🏆', color: 'var(--neon-yel)' },
    { id: 'daily', label: 'DAILY', icon: '📅', color: 'var(--neon-cyan)', badge: hasDailyRewards },
    { id: 'challenges', label: 'CHALLENGES', icon: '⚔️', color: 'var(--neon-mag)' },
    { id: 'news', label: 'NEWS', icon: '📰', color: 'var(--neon-grn)' },
    { id: 'howto', label: 'HOW TO PLAY', icon: '❓', color: 'var(--neon-yel)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6"
    >
      {/* header */}
      <div className="text-center mb-6">
        <h1 className="neon-holo-title font-display font-black text-3xl sm:text-5xl tracking-wider">NEON SURVIVOR</h1>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* ---- profile sidebar ---- */}
        <div className="neon-glass p-5 h-fit lg:sticky lg:top-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl neon-float"
              style={{ background: 'linear-gradient(135deg,rgba(34,230,255,.15),rgba(155,92,255,.15))', border: '1px solid var(--neon-brd-hi)' }}>
              {cls.icon}
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm tracking-wider" style={{ color: 'var(--neon-cyan)' }}>{cls.name}</div>
              <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest">OPERATIVE</div>
            </div>
          </div>

          <div className="neon-panel p-3 mb-3 text-center">
            <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest mb-1">CREDITS</div>
            <div className="font-display text-2xl neon-text-glow" style={{ color: 'var(--neon-yel)' }}>⚡ {meta.credits}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="neon-panel p-2.5 text-center">
              <div className="font-mono-neon text-[9px] neon-text-faint tracking-widest">PRESTIGE</div>
              <div className="font-display text-lg" style={{ color: 'var(--neon-mag)' }}>{meta.prestige}</div>
            </div>
            <div className="neon-panel p-2.5 text-center">
              <div className="font-mono-neon text-[9px] neon-text-faint tracking-widest">ASCENSION</div>
              <div className="font-display text-lg" style={{ color: 'var(--neon-pur)' }}>{meta.ascension}</div>
            </div>
          </div>

          <div className="neon-divider" />

          <div className="space-y-1.5 mb-4">
            <ProfileStat label="BEST LEVEL" val={String(meta.stats.bestLevel)} />
            <ProfileStat label="BEST TIME" val={fmtTime(meta.stats.bestTime)} />
            <ProfileStat label="TOTAL KILLS" val={meta.stats.totalKills.toLocaleString()} />
            <ProfileStat label="RUNS" val={String(meta.stats.totalRuns)} />
          </div>

          {/* current map preview */}
          <div className="neon-panel p-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm" style={{ background: `${currentMap.accent}20`, border: `1px solid ${currentMap.accent}55` }}>
                {currentMap.icon}
              </div>
              <div>
                <div className="font-mono-neon text-[9px] neon-text-faint tracking-widest">ARENA</div>
                <div className="font-display text-xs" style={{ color: currentMap.accent }}>{currentMap.name}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onNav('shop')} className="neon-btn-ghost py-2 text-xs">🛒 SHOP</button>
            <button onClick={() => onNav('classes')} className="neon-btn-ghost py-2 text-xs">⚡ CLASS</button>
          </div>
        </div>

        {/* ---- main column ---- */}
        <div className="space-y-4">
          {/* HUGE play button — the hero */}
          <motion.button
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPlay('endless')}
            className="w-full p-8 sm:p-10 text-center relative overflow-hidden group block rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(34,230,255,.2), rgba(155,92,255,.15), rgba(255,43,214,.1))',
              border: '2px solid rgba(34,230,255,.4)',
              boxShadow: '0 0 40px rgba(34,230,255,.15), inset 0 0 30px rgba(34,230,255,.05)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,230,255,.15), transparent 70%)' }} />
            <div className="relative">
              <div className="text-5xl sm:text-6xl mb-3 neon-float">♾️</div>
              <div className="font-display font-black text-4xl sm:text-5xl mb-2 neon-holo-title">PLAY</div>
              <div className="font-mono-neon text-xs tracking-[0.3em] neon-text-dim mb-1">ENDLESS MODE</div>
              <div className="text-sm neon-text-dim">Survive endless waves. Auto-fire. Just move and dodge.</div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="neon-chip" style={{ color: currentMap.accent, borderColor: currentMap.accent }}>{currentMap.icon} {currentMap.name}</span>
                <span className="neon-chip" style={{ color: 'var(--neon-pur)', borderColor: 'var(--neon-pur)' }}>{cls.icon} {cls.name}</span>
              </div>
            </div>
          </motion.button>

          {/* map + mode quick picks */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNav('mapselect')}
              className="neon-card p-4 text-left group">
              <div className="text-2xl mb-1">{currentMap.icon}</div>
              <div className="font-display text-sm" style={{ color: currentMap.accent }}>CHANGE ARENA</div>
              <div className="font-mono-neon text-[9px] neon-text-faint">{currentMap.name}</div>
            </button>
            <button onClick={() => onNav('classes')}
              className="neon-card p-4 text-left group">
              <div className="text-2xl mb-1">{cls.icon}</div>
              <div className="font-display text-sm" style={{ color: 'var(--neon-pur)' }}>CHANGE CLASS</div>
              <div className="font-mono-neon text-[9px] neon-text-faint">{cls.name}</div>
            </button>
          </div>

          {/* core nav — only 3 essential buttons */}
          <div className="grid grid-cols-4 gap-2">
            {coreNavs.map(n => (
              <button key={n.id} onClick={() => onNav(n.id)} className="neon-btn-ghost py-3 px-2 flex flex-col items-center gap-1.5 group relative">
                <span className="text-xl group-hover:scale-110 transition" style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}>{n.icon}</span>
                <span className="text-[10px] font-semibold tracking-wider">{n.label}</span>
              </button>
            ))}
          </div>

          {/* advanced features toggle */}
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-center py-2 font-mono-neon text-[10px] tracking-widest neon-text-faint hover:neon-text-dim transition">
            {showAdvanced ? '▾ LESS' : '▸ MORE FEATURES'}
          </button>

          {showAdvanced && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-hidden">
              {advancedNavs.map(n => (
                <button key={n.id} onClick={() => onNav(n.id)} className="neon-btn-ghost py-3 px-2 flex flex-col items-center gap-1.5 group relative">
                  <span className="text-xl group-hover:scale-110 transition" style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}>{n.icon}</span>
                  <span className="text-[10px] font-semibold tracking-wider">{n.label}</span>
                  {n.badge && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--neon-yel)', boxShadow: '0 0 6px var(--neon-yel)' }} />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="neon-footer mt-6 px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-2 font-mono-neon text-[10px] tracking-widest neon-text-faint">
        <span className="hidden sm:inline">WASD · MOUSE · SPACE</span>
        <span>NEON SURVIVOR</span>
        <span className="hidden sm:inline">v2.1</span>
      </div>
    </motion.div>
  );
}

function ProfileStat({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono-neon text-[10px] neon-text-faint tracking-widest">{label}</span>
      <span className="font-display text-sm" style={{ color: 'var(--neon-txt)' }}>{val}</span>
    </div>
  );
}
