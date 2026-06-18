'use client';

/**
 * Neon Survivor — iframe bridge hook
 * Sends commands to / receives state from the in-iframe game.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

export interface HudState {
  hp: number; maxhp: number;
  xp: number; xpNext: number; level: number;
  wave: number; kills: number; gameTime: number; dps: number; score: number;
  mode: string; running: boolean; paused: boolean; over: boolean;
  bossesKilled: number;
  weapon: string; weaponIdx: number;
  abilities: number[]; abilityMax: number[];
  boss: { name: string; hp: number; maxhp: number } | null;
  relics: string[]; drones: number; skillPoints: number;
}

export type GameEvent =
  | { type: 'ready' }
  | { type: 'hud'; state: HudState }
  | { type: 'event'; event: string; args: any[] }
  | { type: 'meta'; data: any };

export function useNeonBridge(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [ready, setReady] = useState(false);
  const [hud, setHud] = useState<HudState | null>(null);
  const [lastEvent, setLastEvent] = useState<{ event: string; t: number } | null>(null);
  const listenersRef = useRef<((e: GameEvent) => void)[]>([]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== 'neon-survivor') return;
      if (d.type === 'ready') setReady(true);
      else if (d.type === 'hud') setHud(d.state ?? d);
      else if (d.type === 'event') setLastEvent({ event: d.event, t: Date.now() });
      listenersRef.current.forEach(fn => fn(d));
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const send = useCallback((action: string, payload: any = {}) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ target: 'neon-survivor', action, ...payload }, '*');
  }, [iframeRef]);

  const startGame = useCallback((mode: string) => send('start', { mode }), [send]);
  const pause = useCallback(() => send('pause'), [send]);
  const resume = useCallback(() => send('resume'), [send]);
  const quit = useCallback(() => send('quit'), [send]);
  const focusGame = useCallback(() => send('focus'), [send]);
  const queryMeta = useCallback(() => send('queryMeta'), [send]);

  return { ready, hud, lastEvent, startGame, pause, resume, quit, focusGame, queryMeta, send };
}
