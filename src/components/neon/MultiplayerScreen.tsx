'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenShell } from './screens';

type NetConfig = { role: 'host' | 'join'; name: string; code?: string };

export function MultiplayerScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (config: NetConfig) => void;
}) {
  const [step, setStep] = useState<'pick' | 'host' | 'join'>('pick');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleHost = useCallback(() => {
    if (!name.trim()) { setError('Enter your name'); return; }
    setError('');
    onStart({ role: 'host', name: name.trim() });
  }, [name, onStart]);

  const handleJoin = useCallback(() => {
    if (!code.trim() || code.trim().length !== 4) { setError('Enter a 4-letter room code'); return; }
    if (!name.trim()) { setError('Enter your name'); return; }
    setError('');
    onStart({ role: 'join', name: name.trim(), code: code.trim().toUpperCase() });
  }, [name, code, onStart]);

  return (
    <ScreenShell icon="🌐" title="MULTIPLAYER" sub="ONLINE CO-OP" onBack={onBack}>
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {step === 'pick' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-2 gap-4"
            >
              <button
                onClick={() => setStep('host')}
                className="neon-card p-6 text-center group hover:scale-[1.02] transition-transform"
                style={{ borderColor: 'rgba(255,179,71,.4)' }}
              >
                <div className="text-4xl mb-3">🏠</div>
                <div className="font-display text-xl mb-1" style={{ color: 'var(--neon-yel)' }}>HOST</div>
                <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest">
                  CREATE A ROOM
                </div>
                <div className="font-mono-neon text-[10px] neon-text-faint mt-2">
                  Share the 4-letter code with friends
                </div>
              </button>

              <button
                onClick={() => setStep('join')}
                className="neon-card p-6 text-center group hover:scale-[1.02] transition-transform"
                style={{ borderColor: 'rgba(67,255,158,.4)' }}
              >
                <div className="text-4xl mb-3">🔗</div>
                <div className="font-display text-xl mb-1" style={{ color: 'var(--neon-grn)' }}>JOIN</div>
                <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest">
                  ENTER A ROOM CODE
                </div>
                <div className="font-mono-neon text-[10px] neon-text-faint mt-2">
                  Connect to a friend&apos;s hosted game
                </div>
              </button>
            </motion.div>
          )}

          {step === 'host' && (
            <motion.div
              key="host"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="neon-glass p-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">🏠</div>
                <div className="font-display text-lg" style={{ color: 'var(--neon-yel)' }}>HOST A GAME</div>
                <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest mt-1">
                  YOU&apos;LL CREATE A ROOM AND CONTROL THE GAME
                </div>
              </div>

              <div className="mb-4">
                <label className="font-mono-neon text-[10px] neon-text-faint tracking-widest block mb-1.5">YOUR NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  maxLength={16}
                  placeholder="Host"
                  className="w-full bg-transparent border rounded-lg px-4 py-2.5 font-display text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: 'rgba(255,179,71,.4)', color: 'var(--neon-txt)' }}
                  onKeyDown={e => { if (e.key === 'Enter') handleHost(); }}
                  autoFocus
                />
              </div>

              {error && (
                <div className="font-mono-neon text-[11px] mb-3 text-center" style={{ color: 'var(--neon-red)' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setStep('pick')} className="neon-btn-ghost py-2.5 text-sm">◀ BACK</button>
                <button onClick={handleHost} className="neon-btn py-2.5 text-sm" style={{ borderColor: 'var(--neon-yel)', color: 'var(--neon-yel)' }}>
                  CREATE ROOM
                </button>
              </div>
            </motion.div>
          )}

          {step === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="neon-glass p-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-display text-lg" style={{ color: 'var(--neon-grn)' }}>JOIN A GAME</div>
                <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest mt-1">
                  ENTER THE 4-LETTER CODE YOUR HOST SHARED
                </div>
              </div>

              <div className="mb-4">
                <label className="font-mono-neon text-[10px] neon-text-faint tracking-widest block mb-1.5">ROOM CODE</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 4)); setError(''); }}
                  maxLength={4}
                  placeholder="ABCD"
                  className="w-full bg-transparent border rounded-lg px-4 py-2.5 font-display text-lg text-center tracking-[0.4em] uppercase focus:outline-none focus:ring-1"
                  style={{ borderColor: 'rgba(67,255,158,.4)', color: 'var(--neon-grn)' }}
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="font-mono-neon text-[10px] neon-text-faint tracking-widest block mb-1.5">YOUR NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  maxLength={16}
                  placeholder="Player"
                  className="w-full bg-transparent border rounded-lg px-4 py-2.5 font-display text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: 'rgba(67,255,158,.4)', color: 'var(--neon-txt)' }}
                  onKeyDown={e => { if (e.key === 'Enter') handleJoin(); }}
                />
              </div>

              {error && (
                <div className="font-mono-neon text-[11px] mb-3 text-center" style={{ color: 'var(--neon-red)' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setStep('pick')} className="neon-btn-ghost py-2.5 text-sm">◀ BACK</button>
                <button onClick={handleJoin} className="neon-btn py-2.5 text-sm" style={{ borderColor: 'var(--neon-grn)', color: 'var(--neon-grn)' }}>
                  JOIN ROOM
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="neon-panel p-4 mt-6">
          <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest mb-2">HOW IT WORKS</div>
          <div className="space-y-1.5 font-mono-neon text-[11px] neon-text-dim">
            <div>1. Host creates a room and gets a 4-letter code</div>
            <div>2. Share the code with friends</div>
            <div>3. Friends join using the code</div>
            <div>4. Host starts the game when ready</div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
