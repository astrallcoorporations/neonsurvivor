'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeonBridge, type HudState } from '@/lib/neon/bridge';
import { fmtTime, useNeon } from '@/lib/neon/store';
import { ABILITIES } from '@/lib/neon/data';

interface Props {
  mode: string;
  onExit: (result: { score: number; kills: number; time: number; level: number; wave: number } | null) => void;
}

export default function PlayScreen({ mode, onExit }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { ready, hud, startGame, pause, resume, quit, focusGame } = useNeonBridge(iframeRef);
  const [started, setStarted] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reload = useNeon(s => s.reload);
  const meta = useNeon(s => s.meta);
  const reloadedRef = useRef(false);

  // Start the game once the iframe reports ready
  useEffect(() => {
    if (ready && !started) {
      // tiny delay so audio context can resume after user gesture
      const t = setTimeout(() => { startGame(mode); setStarted(true); }, 120);
      return () => clearTimeout(t);
    }
  }, [ready, started, mode, startGame]);

  // When the game reports `over`, refresh meta once (deferred, not synchronous setState)
  useEffect(() => {
    if (hud && hud.over && !reloadedRef.current) {
      reloadedRef.current = true;
      const t = setTimeout(() => reload(), 400);
      return () => clearTimeout(t);
    }
  }, [hud, reload]);

  const isOver = !!(hud && hud.over);

  // Forward keyboard + mouse events from parent window to the iframe so the
  // game receives input even when the parent (React overlay) has focus.
  // Escape is handled by the parent (pause overlay) — not forwarded.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const w = iframe.contentWindow;
    if (!w) return;

    const fwdKey = (type: 'keydown' | 'keyup') => (e: KeyboardEvent) => {
      if (e.key === 'Escape') return; // parent handles pause
      // ignore modifier-only & browser shortcuts
      const k = e.key;
      const lower = k.length === 1 ? k.toLowerCase() : k;
      const gameKeys = ['w','a','s','d','q','e','t','i','g','b',' ','1','2','3','4','5','6','7','8','9',
        'arrowup','arrowdown','arrowleft','arrowright'];
      if (k.length === 1 && !gameKeys.includes(lower) && !/[a-z0-9]/i.test(k)) return;
      try {
        const ev = new w.KeyboardEvent(type, {
          key: e.key, code: e.code, keyCode: e.keyCode,
          which: e.which, charCode: e.charCode,
          repeat: e.repeat, ctrlKey: e.ctrlKey, altKey: e.altKey,
          shiftKey: e.shiftKey, metaKey: e.metaKey,
          bubbles: true, cancelable: true,
        });
        w.dispatchEvent(ev);
      } catch {}
    };
    const fwdMouse = (type: string) => (e: MouseEvent) => {
      try {
        const ev = new w.MouseEvent(type, {
          clientX: e.clientX, clientY: e.clientY,
          screenX: e.screenX, screenY: e.screenY,
          button: e.button, buttons: e.buttons,
          ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
          bubbles: true, cancelable: true,
        });
        w.dispatchEvent(ev);
      } catch {}
    };
    const kd = fwdKey('keydown'), ku = fwdKey('keyup');
    const mm = fwdMouse('mousemove'), md = fwdMouse('mousedown'), mu = fwdMouse('mouseup');
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mousedown', md);
    window.addEventListener('mouseup', mu);
    // focus iframe on any click in the play area
    const onClick = () => { try { w.focus(); } catch {} };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mousedown', md);
      window.removeEventListener('mouseup', mu);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // Focus the iframe once the game starts
  useEffect(() => {
    if (started && iframeRef.current?.contentWindow) {
      try { iframeRef.current.contentWindow.focus(); } catch {}
    }
  }, [started]);

  // Pause shortcut (Esc) — toggles React overlay AND pauses/resumes the game loop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && started && !isOver) {
        e.preventDefault();
        setShowPause(s => {
          const next = !s;
          if (next) pause(); else resume();
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, isOver, pause, resume]);

  const handleQuit = () => {
    quit();
    setDismissed(true);
    onExit(isOver && hud ? {
      score: hud.score, kills: hud.kills, time: hud.gameTime, level: hud.level, wave: hud.wave,
    } : null);
  };

  return (
    <div className="fixed inset-0 z-30 bg-black">
      <iframe
        ref={iframeRef}
        src="/neon-survivor.html"
        title="Neon Survivor"
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; gamepad"
        onLoad={() => focusGame()}
      />

      {/* Live HUD overlay (only when we have state and game running) */}
      <AnimatePresence>
        {hud && hud.running && !isOver && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 left-0 right-0 z-40 pointer-events-none"
          >
            <TopBar hud={hud} onPause={() => { pause(); setShowPause(true); }} meta={meta} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {showPause && !isOver && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="neon-glass p-8 max-w-md w-[90%] pointer-events-auto">
              <h2 className="font-display text-3xl neon-holo-title text-center mb-6">PAUSED</h2>
              <div className="space-y-3">
                <button className="neon-btn w-full py-3" onClick={() => { resume(); setShowPause(false); }}>RESUME</button>
                <button className="neon-btn w-full py-3" onClick={() => { pause(); }}>PAUSE (in-game)</button>
                <button className="neon-btn w-full py-3" style={{ borderColor: 'var(--neon-red)', color: '#ffb3c0' }} onClick={handleQuit}>ABANDON RUN</button>
              </div>
              <p className="text-center text-xs opacity-50 mt-4 font-mono-neon">ESC to toggle</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over overlay */}
      <AnimatePresence>
        {isOver && hud && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="neon-glass p-8 max-w-lg w-[92%] pointer-events-auto text-center">
              <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--neon-mag)' }}>RUN OVER</h2>
              <div className="text-sm opacity-70 mb-6 font-mono-neon uppercase tracking-widest">{hud.mode}</div>
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <Stat label="Time" value={fmtTime(hud.gameTime)} color="var(--neon-cyan)" />
                <Stat label="Level" value={String(hud.level)} color="var(--neon-yel)" />
                <Stat label="Wave" value={String(hud.wave)} color="var(--neon-mag)" />
                <Stat label="Kills" value={String(hud.kills)} color="var(--neon-grn)" />
                <Stat label="Bosses" value={String(hud.bossesKilled)} color="var(--neon-red)" />
                <Stat label="Score" value={hud.score.toLocaleString()} color="var(--neon-pur)" />
              </div>
              <div className="neon-chip w-full justify-center mb-4" style={{ borderColor: 'var(--neon-yel)', color: 'var(--neon-yel)' }}>
                ⚡ CREDITS: {meta.credits}
              </div>
              <button className="neon-btn w-full py-3" onClick={handleQuit}>RETURN TO BASE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopBar({ hud, onPause, meta }: { hud: HudState; onPause: () => void; meta: any }) {
  const hpPct = Math.max(0, Math.min(100, (hud.hp / hud.maxhp) * 100));
  const xpPct = Math.max(0, Math.min(100, (hud.xp / hud.xpNext) * 100));
  return (
    <div className="flex items-start justify-between gap-3 p-3 sm:p-4">
      {/* Left: HP/XP/Level/Wave */}
      <div className="flex flex-col gap-2 min-w-[220px] sm:min-w-[300px] pointer-events-auto">
        <div className="neon-glass px-3 py-2">
          <div className="flex items-center justify-between text-[10px] font-mono-neon mb-1">
            <span style={{ color: 'var(--neon-red)' }} className="neon-text-glow">HP</span>
            <span>{hud.hp}/{hud.maxhp}</span>
          </div>
          <div className="neon-bar">
            <span style={{ width: hpPct + '%', background: 'linear-gradient(90deg,#ff3b5c,#ff8aa0)', boxShadow: '0 0 10px rgba(255,59,92,.6)' }} />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono-neon mt-2 mb-1">
            <span style={{ color: 'var(--neon-cyan)' }} className="neon-text-glow">XP</span>
            <span>LV {hud.level}</span>
          </div>
          <div className="neon-bar" style={{ height: 5 }}>
            <span style={{ width: xpPct + '%', background: 'linear-gradient(90deg,#22e6ff,#9b5cff)', boxShadow: '0 0 8px rgba(34,230,255,.5)' }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>LV {hud.level}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-mag)' }}>WAVE {hud.wave}</span>
          <span className="neon-chip">{fmtTime(hud.gameTime)}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-grn)' }}>KILLS {hud.kills}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-cyan)' }}>DPS {hud.dps}</span>
        </div>
      </div>

      {/* Center: boss bar */}
      {hud.boss && (
        <div className="hidden sm:flex flex-col items-center gap-1 pt-1 pointer-events-auto">
          <div className="font-display text-sm neon-text-glow" style={{ color: 'var(--neon-mag)' }}>{hud.boss.name}</div>
          <div className="w-64 neon-bar" style={{ height: 12 }}>
            <span style={{ width: Math.max(0, (hud.boss.hp / hud.boss.maxhp) * 100) + '%', background: 'linear-gradient(90deg,#ff2bd6,#ff8a5c,#ffe24a)' }} />
          </div>
        </div>
      )}

      {/* Right: credits + weapon + pause */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex gap-1.5">
          <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ {meta.credits}</span>
          <button className="neon-chip neon-btn !py-1.5 !px-3" onClick={onPause} style={{ cursor: 'pointer' }}>⏸ PAUSE</button>
        </div>
        <div className="neon-glass px-3 py-2 text-right">
          <div className="font-display text-xs" style={{ color: 'var(--neon-cyan)' }}>{hud.weapon}</div>
          <div className="text-[10px] font-mono-neon opacity-60">Q/E swap · 1-9 abilities</div>
        </div>
        {hud.boss && (
          <div className="sm:hidden neon-chip" style={{ color: 'var(--neon-mag)' }}>BOSS: {Math.round(hud.boss.hp/hud.boss.maxhp*100)}%</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="neon-glass px-3 py-2">
      <div className="text-[10px] font-mono-neon opacity-60 uppercase">{label}</div>
      <div className="font-display text-lg" style={{ color }}>{value}</div>
    </div>
  );
}
