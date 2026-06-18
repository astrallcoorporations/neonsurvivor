'use client';

import { motion } from 'framer-motion';
import { useNeon, fmtTime } from '@/lib/neon/store';
import { MODES, CLASSES } from '@/lib/neon/data';

export function MainMenu({ onPlay, onNav }: { onPlay: (mode: string) => void; onNav: (s: string) => void }) {
  const meta = useNeon(s => s.meta);
  const cls = CLASSES.find(c => c.id === meta.classId) || CLASSES[0];
  const featured = MODES[0];
  const secondary = MODES.slice(1);

  const navs: { id: string; label: string; icon: string; color: string }[] = [
    { id: 'stats', label: 'STATS', icon: '📊', color: 'var(--neon-cyan)' },
    { id: 'arsenal', label: 'ARSENAL', icon: '🔫', color: 'var(--neon-mag)' },
    { id: 'bestiary', label: 'BESTIARY', icon: '👹', color: 'var(--neon-red)' },
    { id: 'achievements', label: 'AWARDS', icon: '🏆', color: 'var(--neon-yel)' },
    { id: 'shop', label: 'SHOP', icon: '🛒', color: 'var(--neon-grn)' },
    { id: 'classes', label: 'CLASSES', icon: '⚡', color: 'var(--neon-pur)' },
    { id: 'daily', label: 'DAILY', icon: '📅', color: 'var(--neon-cyan)' },
    { id: 'challenges', label: 'CHALLENGES', icon: '⚔️', color: 'var(--neon-mag)' },
    { id: 'news', label: 'NEWS', icon: '📰', color: 'var(--neon-grn)' },
    { id: 'howto', label: 'HOW TO PLAY', icon: '❓', color: 'var(--neon-yel)' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️', color: 'var(--neon-txt-dim)' },
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

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onNav('shop')} className="neon-btn-ghost py-2 text-xs">🛒 SHOP</button>
            <button onClick={() => onNav('classes')} className="neon-btn-ghost py-2 text-xs">⚡ CLASS</button>
          </div>
        </div>

        {/* ---- main column ---- */}
        <div className="space-y-4">
          {/* featured mode hero */}
          <motion.button
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => onPlay(featured.id)}
            className="neon-glass w-full p-6 text-left relative overflow-hidden group block"
            style={{ background: `linear-gradient(120deg, ${featured.accent}, rgba(8,6,22,.92) 60%)` }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl sm:text-8xl opacity-30 group-hover:opacity-50 transition neon-float">
              {featured.icon}
            </div>
            <div className="relative">
              <div className="font-mono-neon text-[10px] tracking-[0.3em] neon-text-dim mb-2">▶ FEATURED MODE</div>
              <div className="font-display font-black text-4xl sm:text-5xl mb-2" style={{ color: featured.color }}>{featured.name}</div>
              <div className="font-mono-neon text-xs tracking-widest mb-3 neon-text-dim uppercase">{featured.tagline}</div>
              <div className="text-sm neon-text-dim max-w-md mb-4">{featured.desc}</div>
              <span className="neon-btn inline-block px-6 py-2 text-sm" style={{ borderColor: featured.color, color: featured.color }}>
                PLAY NOW ▶
              </span>
            </div>
          </motion.button>

          {/* secondary modes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {secondary.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlay(m.id)}
                className="neon-card p-4 text-left group"
              >
                <div className="text-2xl mb-2 neon-float">{m.icon}</div>
                <div className="font-display text-sm tracking-wider" style={{ color: m.color }}>{m.name}</div>
                <div className="font-mono-neon text-[9px] neon-text-faint uppercase tracking-wider mt-0.5">{m.tagline}</div>
              </motion.button>
            ))}
          </div>

          {/* nav grid */}
          <div className="neon-card p-4">
            <div className="neon-section-head">
              <span className="ico" style={{ color: 'var(--neon-cyan)' }}>◇</span>
              <span className="lbl">COMMAND DECK</span>
              <span className="sub">META · PROGRESSION · INFO</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {navs.map(n => (
                <button key={n.id} onClick={() => onNav(n.id)} className="neon-btn-ghost py-3 px-2 flex flex-col items-center gap-1.5 group">
                  <span className="text-xl group-hover:scale-110 transition" style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}>{n.icon}</span>
                  <span className="text-[10px] font-semibold tracking-wider">{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="neon-footer mt-6 px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-2 font-mono-neon text-[10px] tracking-widest neon-text-faint">
        <span>WASD · MOUSE · SPACE · 1-9 · Q/E · T · I · ESC</span>
        <span>NEON SURVIVOR v2.1</span>
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
