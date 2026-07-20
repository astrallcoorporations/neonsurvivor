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
      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-8 lg:w-12 h-8 lg:h-12 border-t-2 border-l-2 z-20" style={{ borderColor: 'rgba(34,230,255,0.35)' }} />
      <div className="absolute top-0 right-0 w-8 lg:w-12 h-8 lg:h-12 border-t-2 border-r-2 z-20" style={{ borderColor: 'rgba(34,230,255,0.35)' }} />
      <div className="absolute bottom-0 left-0 w-8 lg:w-12 h-8 lg:h-12 border-b-2 border-l-2 z-20" style={{ borderColor: 'rgba(255,43,214,0.35)' }} />
      <div className="absolute bottom-0 right-0 w-8 lg:w-12 h-8 lg:h-12 border-b-2 border-r-2 z-20" style={{ borderColor: 'rgba(255,43,214,0.35)' }} />

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b" style={{ borderColor: 'rgba(34,230,255,0.15)' }}>
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="font-mono text-white font-bold tracking-widest italic text-sm lg:text-base" style={{ color: 'rgb(34,230,255)' }}>
              NS
            </span>
            <div className="h-3 lg:h-4 w-px" style={{ backgroundColor: 'rgba(34,230,255,0.3)' }} />
            <span className="text-[9px] lg:text-[10px] font-mono tracking-wider" style={{ color: 'rgba(34,230,255,0.5)' }}>V2.1.0</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono" style={{ color: 'rgba(34,230,255,0.4)' }}>
            <span>NODE: ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(67,255,158)', boxShadow: '0 0 6px rgba(67,255,158,.6)' }} />
            <span>PING: 4ms</span>
          </div>
        </div>
      </div>

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
              className="group relative px-10 py-3.5 text-base font-display tracking-[0.3em] bg-transparent border transition-all duration-200"
              style={{
                borderColor: 'rgba(34,230,255,0.6)',
                color: 'rgb(34,230,255)',
                boxShadow: '0 0 30px rgba(34,230,255,.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(34,230,255,0.1)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(34,230,255,.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(34,230,255,.15)';
              }}
            >
              {/* corner brackets on hover */}
              <span className="absolute -top-[3px] -left-[3px] w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: 'rgb(34,230,255)' }} />
              <span className="absolute -bottom-[3px] -right-[3px] w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: 'rgb(34,230,255)' }} />
              ▶ ENTER THE GRID
            </motion.button>
            <div className="font-mono-neon text-[10px] tracking-[0.3em] neon-text-faint neon-pulse">
              CLICK OR PRESS ENTER
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* bottom hint - replaced with styled footer bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t" style={{ borderColor: 'rgba(255,43,214,0.15)' }}>
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="hidden lg:inline">WASD MOVE</span>
            <span className="lg:hidden">WASD</span>
            <div className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <span>MOUSE AIM</span>
            <div className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <span className="hidden lg:inline">AUTO-FIRE</span>
            <span className="lg:hidden">FIRE</span>
            <div className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <span>1-9 ABILITIES</span>
            <div className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <span className="hidden lg:inline">SPACE DASH</span>
            <span className="lg:hidden">DASH</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 text-[8px] lg:text-[9px] font-mono" style={{ color: 'rgba(255,43,214,0.35)' }}>
            <span>◐ RENDERING</span>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(67,255,158,0.6)' }} />
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(67,255,158,0.4)', animationDelay: '0.2s' }} />
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(67,255,158,0.2)', animationDelay: '0.4s' }} />
            </div>
            <span>SURVIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
