'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  'INITIALIZING NEURAL LINK',
  'CALIBRATING WEAPON SYSTEMS',
  'LOADING ENEMY DATABASE',
  'SYNCING META-PROGRESSION',
  'RENDERING NEON GRID',
  'SYSTEM READY',
];

export function LandingScreen({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 7 + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setReady(true), 400); }
      setProgress(p);
      setLineIdx(Math.min(BOOT_LINES.length - 1, Math.floor(p / (100 / BOOT_LINES.length))));
    }, 110);
    return () => clearInterval(iv);
  }, []);

  // allow Enter to skip / proceed once ready; also any key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (ready && (e.key === 'Enter' || e.key === ' ')) onEnter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, onEnter]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 cursor-pointer"
      onClick={() => { if (ready) onEnter(); }}
    >
      {/* top tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 font-mono-neon text-[10px] tracking-[0.5em] neon-text-faint"
      >
        NEON SURVIVOR · v2.1 · CYBERPUNK ROGUELITE
      </motion.div>

      {/* title block */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center"
      >
        <div className="font-mono-neon text-[10px] sm:text-xs tracking-[0.4em] mb-3 neon-pulse" style={{ color: 'var(--neon-cyan)' }}>
          ▰▰▰ SYSTEM ONLINE ▰▰▰
        </div>
        <h1
          className="neon-glitch neon-holo-title font-display font-black leading-[0.85]"
          data-text="NEON SURVIVOR"
          style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
        >
          NEON SURVIVOR
        </h1>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="font-mono-neon text-[10px] sm:text-xs tracking-[0.5em] mt-4 neon-text-faint"
        >
          3D · CYBERPUNK · ROGUELITE
        </motion.div>
      </motion.div>

      {/* boot progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="mt-16 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-2 font-mono-neon text-[10px] tracking-widest">
          <span style={{ color: 'var(--neon-cyan)' }} className="neon-text-glow">
            {BOOT_LINES[lineIdx]}<span className="neon-pulse">_</span>
          </span>
          <span className="neon-text-faint">{Math.floor(progress)}%</span>
        </div>
        <div className="neon-boot-bar">
          <span style={{ width: progress + '%' }} />
        </div>
      </motion.div>

      {/* enter prompt */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <motion.button
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              onClick={onEnter}
              className="neon-btn px-10 py-3.5 text-base font-display tracking-[0.3em]"
              style={{ boxShadow: '0 0 30px rgba(34,230,255,.4)' }}
            >
              ▶ ENTER THE GRID
            </motion.button>
            <div className="font-mono-neon text-[10px] tracking-[0.3em] neon-text-faint neon-pulse">
              CLICK OR PRESS ENTER
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* bottom hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-6 font-mono-neon text-[10px] tracking-[0.25em] neon-text-faint text-center px-4"
      >
        WASD MOVE · MOUSE AIM · AUTO-FIRE · 1-9 ABILITIES · SPACE DASH
      </motion.div>
    </motion.div>
  );
}
