'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeonBridge, type HudState } from '@/lib/neon/bridge';
import { fmtTime, useNeon } from '@/lib/neon/store';

interface Props {
  mode: string;
  netConfig?: { role: 'host' | 'join'; name: string; code?: string } | null;
  onExit: (result: { score: number; kills: number; time: number; level: number; wave: number } | null) => void;
}

export default function PlayScreen({ mode, netConfig, onExit }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { ready, hud, startGame, pause, resume, quit, focusGame, sendSettings, sendMap, send } = useNeonBridge(iframeRef);
  const [started, setStarted] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reload = useNeon(s => s.reload);
  const meta = useNeon(s => s.meta);
  const reloadedRef = useRef(false);
  const firstRunRef = useRef(true);

  // Send settings to iframe when they change mid-game (not on initial start — that's handled above)
  useEffect(() => {
    if (started && sendSettings && !firstRunRef.current) {
      sendSettings(meta.settings);
    }
    if (started) firstRunRef.current = false;
  }, [started, meta.settings, sendSettings]);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && sendSettings) {
        sendSettings({ ...meta.settings, ...detail });
      }
    };
    window.addEventListener('neon-settings-change', onChange);
    return () => window.removeEventListener('neon-settings-change', onChange);
  }, [meta.settings, sendSettings]);

  // Start the game once the iframe reports ready — send settings/map BEFORE start
  useEffect(() => {
    if (ready && !started) {
      const t = setTimeout(() => {
        sendSettings(meta.settings);
        if (sendMap) sendMap(meta.settings.selectedMap || 'neon_grid');
        setTimeout(() => {
          startGame(mode);
          setStarted(true);
          // If multiplayer, send supabase config then connect
          if (netConfig) {
            setTimeout(() => {
              send('supabaseConfig', {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              });
              send('netConnect', { role: netConfig.role, name: netConfig.name, code: netConfig.code });
            }, 600);
          }
        }, 80);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [ready, started, mode, startGame, send, netConfig]);

  // When the game reports `over`, refresh meta once
  useEffect(() => {
    if (hud && hud.over && !reloadedRef.current) {
      reloadedRef.current = true;
      const t = setTimeout(() => reload(), 500);
      return () => clearTimeout(t);
    }
  }, [hud, reload]);

  const isOver = !!(hud && hud.over);

  // Forward keyboard + mouse events from parent window to the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const w = iframe.contentWindow as Window & { KeyboardEvent: typeof KeyboardEvent; MouseEvent: typeof MouseEvent } | null;
    if (!w) return;

    const fwdKey = (type: 'keydown' | 'keyup') => (e: KeyboardEvent) => {
      if (e.key === 'Escape') return;
      const k = e.key;
      const lower = k.length === 1 ? k.toLowerCase() : k;
      const gameKeys = ['w','a','s','d','q','e','t','i','g','b',' ','1','2','3','4','5','6','7','8','9',
        'arrowup','arrowdown','arrowleft','arrowright'];
      if (k.length === 1 && !gameKeys.includes(lower) && !/[a-z0-9]/i.test(k)) return;
      try {
        const ev = new KeyboardEvent(type, {
          key: e.key, code: e.code, keyCode: e.keyCode, which: e.which, charCode: e.charCode,
          repeat: e.repeat, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
          bubbles: true, cancelable: true,
        });
        w.dispatchEvent(ev);
      } catch {}
    };
    const fwdMouse = (type: string) => (e: MouseEvent) => {
      try {
        const ev = new MouseEvent(type, {
          clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY,
          button: e.button, buttons: e.buttons,
          ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
          bubbles: true, cancelable: true,
        });
        w.dispatchEvent(ev);
      } catch {}
    };
    const fwdTouch = (type: string) => (e: TouchEvent) => {
      try {
        const touches = e.changedTouches;
        if (touches.length > 0) {
          const touch = touches[0];
          const ev = new MouseEvent(type === 'touchstart' ? 'mousedown' : type === 'touchend' ? 'mouseup' : 'mousemove', {
            clientX: touch.clientX, clientY: touch.clientY,
            screenX: touch.screenX, screenY: touch.screenY,
            button: 0, buttons: type === 'touchend' ? 0 : 1,
            bubbles: true, cancelable: true,
          });
          w.dispatchEvent(ev);
        }
      } catch {}
    };
    const fwdTouchMove = (e: TouchEvent) => {
      try {
        const touches = e.changedTouches;
        if (touches.length > 0) {
          const touch = touches[0];
          const ev = new MouseEvent('mousemove', {
            clientX: touch.clientX, clientY: touch.clientY,
            screenX: touch.screenX, screenY: touch.screenY,
            button: 0, buttons: 1,
            bubbles: true, cancelable: true,
          });
          w.dispatchEvent(ev);
        }
      } catch {}
    };

    const kd = fwdKey('keydown'), ku = fwdKey('keyup');
    const mm = fwdMouse('mousemove'), md = fwdMouse('mousedown'), mu = fwdMouse('mouseup');
    const ts = fwdTouch('touchstart'), te = fwdTouch('touchend'), tm = fwdTouchMove;
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mousedown', md);
    window.addEventListener('mouseup', mu);
    window.addEventListener('touchstart', ts, { passive: false });
    window.addEventListener('touchend', te, { passive: false });
    window.addEventListener('touchmove', tm, { passive: false });
    const onClick = () => { try { w.focus(); } catch {} };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mousedown', md);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchend', te);
      window.removeEventListener('touchmove', tm);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (started && iframeRef.current?.contentWindow) {
      try { iframeRef.current.contentWindow.focus(); } catch {}
    }
  }, [started]);

  // Pause shortcut (Esc) — show overlay with Resume / Return to Lobby
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && started && !isOver) {
        e.preventDefault();
        if (!showPause) { pause(); setShowPause(true); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, isOver, showPause, pause]);

  const handleQuit = () => {
    quit();
    setDismissed(true);
    onExit(isOver && hud ? {
      score: hud.score, kills: hud.kills, time: hud.gameTime, level: hud.level, wave: hud.wave,
    } : null);
  };

  return (
    <div className="fixed inset-0 z-30 bg-black" style={{ overscrollBehavior: 'none' }}>
      <iframe
        ref={iframeRef}
        src="/neon-survivor.html"
        title="Neon Survivor"
        className="absolute inset-0 w-full h-full border-0"
        style={{ touchAction: 'none' }}
        allow="autoplay; fullscreen; gamepad"
        onLoad={() => focusGame()}
      />

      {/* Brief auto-fading control hint at run start. Pause is via ESC (like the game).
          No persistent overlay — keeps the game's HUD unobstructed. */}
      <AnimatePresence>
        {hud && hud.running && !isOver && !dismissed && started && (
          <RunHint key="hint" />
        )}
      </AnimatePresence>

      {/* Loading state before game reports ready */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <div className="font-display text-2xl neon-holo-title mb-3">ENTERING THE GRID</div>
              <div className="neon-boot-bar w-48 mx-auto"><span style={{ width: '100%', animation: 'neonPulse 1s infinite' }} /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {showPause && !isOver && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Game paused"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="neon-glass p-8 max-w-sm w-[90%] pointer-events-auto text-center"
            >
              <div className="font-mono-neon text-[10px] tracking-[0.4em] neon-text-faint mb-1">SYSTEM HALTED</div>
              <h2 className="font-display text-3xl neon-holo-title mb-6">PAUSED</h2>
              <div className="space-y-2.5">
                <button className="neon-btn w-full py-3" onClick={() => { resume(); setShowPause(false); }}>▶ RESUME</button>
                <button className="neon-btn-ghost w-full py-2.5 text-sm" onClick={handleQuit}>◀ ABANDON RUN</button>
              </div>
              <p className="font-mono-neon text-[10px] neon-text-faint mt-5 tracking-widest">ESC TO PAUSE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over overlay */}
      <AnimatePresence>
        {isOver && hud && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Game over"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="neon-glass p-8 max-w-lg w-[92%] pointer-events-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="font-mono-neon text-[10px] tracking-[0.4em] mb-1"
                style={{ color: 'var(--neon-red)' }}
              >
                ▰ CONNECTION LOST ▰
              </motion.div>
              <h2 className="font-display text-4xl mb-1 neon-text-glow" style={{ color: 'var(--neon-mag)' }}>RUN OVER</h2>
              <div className="font-mono-neon text-[11px] neon-text-dim mb-6 tracking-[0.3em] uppercase">{hud.mode}</div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <GoStat label="TIME" value={fmtTime(hud.gameTime)} color="var(--neon-cyan)" />
                <GoStat label="LEVEL" value={String(hud.level)} color="var(--neon-yel)" />
                <GoStat label="WAVE" value={String(hud.wave)} color="var(--neon-mag)" />
                <GoStat label="KILLS" value={String(hud.kills)} color="var(--neon-grn)" />
                <GoStat label="BOSSES" value={String(hud.bossesKilled)} color="var(--neon-red)" />
                <GoStat label="SCORE" value={hud.score.toLocaleString()} color="var(--neon-pur)" />
              </div>

              <div className="neon-panel py-3 mb-5 flex items-center justify-center gap-2">
                <span className="font-mono-neon text-xs neon-text-dim tracking-widest">CREDITS EARNED</span>
                <span className="font-display text-xl neon-text-glow" style={{ color: 'var(--neon-yel)' }}>⚡ {meta.credits}</span>
              </div>

              <button className="neon-btn w-full py-3 text-base" onClick={handleQuit}>RETURN TO BASE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="neon-panel py-2.5 px-2">
      <div className="font-mono-neon text-[9px] neon-text-faint tracking-widest mb-0.5">{label}</div>
      <div className="font-display text-lg leading-none" style={{ color }}>{value}</div>
    </div>
  );
}

/** Brief control hint that fades out after a few seconds. Non-interactive. */
function useIsTouch() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function RunHint() {
  const [show, setShow] = useState(true);
  const isTouch = useIsTouch();
  const [controlType, setControlType] = useState<'keyboard' | 'gamepad' | 'touch'>(() =>
    isTouch ? 'touch' : 'keyboard'
  );
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4200);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (isTouch) return;
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (gp && (gp.buttons.some(b => b.pressed) || gp.axes.some(a => Math.abs(a) > 0.2))) {
          setControlType('gamepad');
          return;
        }
      }
    };
    const iv = setInterval(checkGamepad, 1000);
    return () => clearInterval(iv);
  }, [isTouch]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          {controlType === 'gamepad' ? (
            <div className="neon-panel px-4 py-2 font-mono-neon text-[11px] tracking-widest neon-text-dim whitespace-nowrap">
              <span style={{ color: 'var(--neon-cyan)' }}>L-STICK</span> MOVE ·
              <span style={{ color: 'var(--neon-mag)' }}> A</span> DASH ·
              <span style={{ color: 'var(--neon-yel)' }}> ABILITIES</span> ·
              <span style={{ color: 'var(--neon-red)' }}> START</span> PAUSE
            </div>
          ) : controlType === 'touch' ? (
            <div className="neon-panel px-4 py-2 font-mono-neon text-[11px] tracking-widest neon-text-dim text-center whitespace-normal max-w-[90vw]">
              <span style={{ color: 'var(--neon-cyan)' }}>TAP</span> TO AIM ·
              <span style={{ color: 'var(--neon-mag)' }}> SWIPE</span> TO MOVE ·
              <span style={{ color: 'var(--neon-yel)' }}> TAP ABILITIES</span>
            </div>
          ) : (
            <div className="neon-panel px-4 py-2 font-mono-neon text-[11px] tracking-widest neon-text-dim whitespace-nowrap">
              <span style={{ color: 'var(--neon-cyan)' }}>WASD</span> MOVE ·
              <span style={{ color: 'var(--neon-mag)' }}> SPACE</span> DASH ·
              <span style={{ color: 'var(--neon-yel)' }}> MOUSE</span> AIM ·
              <span style={{ color: 'var(--neon-red)' }}> ESC</span> PAUSE
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
