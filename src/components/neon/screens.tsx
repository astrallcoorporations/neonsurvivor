'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeon, fmtTime } from '@/lib/neon/store';
import {
  MODES, WEAPONS, ABILITIES, ENEMIES, BOSSES, CLASSES, SHOP_ITEMS,
  CHALLENGES, RELICS, ACHIEVEMENTS, RARITY, CONTROLS, CHANGELOG,
} from '@/lib/neon/data';

/* ============ shared bits ============ */
export function ScreenShell({ title, sub, onBack, children }: { title: string; sub?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl neon-holo-title">{title}</h2>
          {sub && <p className="font-mono-neon text-xs opacity-60 uppercase tracking-widest mt-1">{sub}</p>}
        </div>
        <button className="neon-btn px-5 py-2 text-sm" onClick={onBack}>◀ BACK</button>
      </div>
      {children}
    </motion.div>
  );
}

function colStr(c: [number, number, number]) {
  return `rgb(${(c[0]*255)|0},${(c[1]*255)|0},${(c[2]*255)|0})`;
}

/* ============ LANDING / BOOT ============ */
export function LandingScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 cursor-pointer"
      onClick={onEnter}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="font-mono-neon text-xs sm:text-sm opacity-60 tracking-[0.4em] mb-2 neon-pulse">SYSTEM ONLINE</div>
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl neon-holo-title leading-none">
          NEON<br/>SURVIVOR
        </h1>
        <div className="font-mono-neon text-[10px] sm:text-xs opacity-50 tracking-[0.5em] mt-4">3D CYBERPUNK ROGUELITE · v2.0</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 flex flex-col items-center gap-2"
      >
        <div className="font-display text-lg neon-pulse neon-text-glow" style={{ color: 'var(--neon-cyan)' }}>▶ PRESS TO ENTER ◀</div>
        <div className="font-mono-neon text-[10px] opacity-40 tracking-widest">CLICK ANYWHERE</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-6 font-mono-neon text-[10px] opacity-30 tracking-widest text-center"
      >
        WASD MOVE · MOUSE AIM · AUTO-FIRE · 1-9 ABILITIES · SPACE DASH
      </motion.div>
    </motion.div>
  );
}

/* ============ MAIN MENU ============ */
export function MainMenu({ onPlay, onNav }: { onPlay: (mode: string) => void; onNav: (s: string) => void }) {
  const meta = useNeon(s => s.meta);
  const cls = CLASSES.find(c => c.id === meta.classId) || CLASSES[0];

  const navs: { id: string; label: string; icon: string }[] = [
    { id: 'stats', label: 'STATS', icon: '📊' },
    { id: 'arsenal', label: 'ARSENAL', icon: '🔫' },
    { id: 'bestiary', label: 'BESTIARY', icon: '👹' },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: '🏆' },
    { id: 'shop', label: 'SHOP', icon: '🛒' },
    { id: 'classes', label: 'CLASSES', icon: '⚡' },
    { id: 'daily', label: 'DAILY', icon: '📅' },
    { id: 'challenges', label: 'CHALLENGES', icon: '⚔️' },
    { id: 'news', label: 'NEWS', icon: '📰' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️' },
    { id: 'howto', label: 'HOW TO PLAY', icon: '❓' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="font-display font-black text-4xl sm:text-6xl neon-holo-title">NEON SURVIVOR</h1>
        <div className="font-mono-neon text-xs opacity-60 tracking-[0.4em] mt-2 neon-pulse">3D CYBERPUNK ROGUELITE</div>
      </div>

      {/* Profile bar */}
      <div className="neon-glass p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ {meta.credits}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-mag)' }}>PRESTIGE {meta.prestige}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-pur)' }}>ASCENSION {meta.ascension}</span>
          <span className="neon-chip" style={{ color: 'var(--neon-cyan)' }}>{cls.icon} {cls.name}</span>
        </div>
        <div className="flex gap-2 text-[10px] font-mono-neon opacity-70">
          <span> best LV {meta.stats.bestLevel}</span>
          <span>· best {fmtTime(meta.stats.bestTime)}</span>
          <span>· {meta.stats.totalRuns} runs</span>
        </div>
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {MODES.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPlay(m.id)}
            className="neon-glass p-4 text-left group relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${m.accent}, rgba(8,6,22,.92))` }}
          >
            <div className="text-3xl mb-2 neon-float">{m.icon}</div>
            <div className="font-display text-lg" style={{ color: m.color }}>{m.name}</div>
            <div className="font-mono-neon text-[10px] opacity-60 uppercase tracking-wider mt-1">{m.tagline}</div>
            <div className="text-xs opacity-70 mt-2 leading-snug">{m.desc}</div>
            <div className="absolute bottom-2 right-3 font-display text-xs opacity-0 group-hover:opacity-100 transition" style={{ color: m.color }}>PLAY ▶</div>
          </motion.button>
        ))}
      </div>

      {/* Nav grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {navs.map(n => (
          <button key={n.id} onClick={() => onNav(n.id)} className="neon-btn py-3 px-2 text-xs sm:text-sm flex flex-col items-center gap-1">
            <span className="text-lg">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center mt-6 font-mono-neon text-[10px] opacity-40 tracking-widest">
        WASD MOVE · MOUSE AIM · AUTO-FIRE ON · L-CLICK OVERDRIVE · SPACE DASH · 1-9 ABILITIES · Q/E SWAP · T TREE · I INV · ESC PAUSE
      </div>
    </motion.div>
  );
}

/* ============ STATS DASHBOARD ============ */
export function StatsScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  const doPrestige = useNeon(s => s.doPrestige);
  const doAscend = useNeon(s => s.doAscend);
  const s = meta.stats;
  const canPrestige = s.totalRuns >= 5 && meta.prestige < 10;
  const canAscend = s.bestLevel >= 40 && meta.ascension < 5;

  const cards = [
    { label: 'TOTAL KILLS', val: s.totalKills.toLocaleString(), color: 'var(--neon-red)', icon: '💀' },
    { label: 'TOTAL RUNS', val: String(s.totalRuns), color: 'var(--neon-cyan)', icon: '🎮' },
    { label: 'BOSSES SLAIN', val: String(s.totalBosses), color: 'var(--neon-mag)', icon: '👹' },
    { label: 'BEST TIME', val: fmtTime(s.bestTime), color: 'var(--neon-grn)', icon: '⏱️' },
    { label: 'BEST WAVE', val: String(s.bestWave), color: 'var(--neon-pur)', icon: '🌊' },
    { label: 'BEST LEVEL', val: String(s.bestLevel), color: 'var(--neon-yel)', icon: '⬆️' },
    { label: 'BEST SCORE', val: s.bestScore.toLocaleString(), color: 'var(--neon-cyan)', icon: '🏆' },
    { label: 'TOTAL CREDITS', val: s.totalCredits.toLocaleString(), color: 'var(--neon-yel)', icon: '⚡' },
    { label: 'PLAYTIME', val: fmtTime(s.totalPlaytime), color: 'var(--neon-grn)', icon: '🕐' },
    { label: 'ITEMS FOUND', val: `${meta.itemsDiscovered.length} / 200`, color: 'var(--neon-mag)', icon: '💎' },
    { label: 'RELICS', val: String(meta.relicsOwned.length), color: 'var(--neon-pur)', icon: '🔮' },
    { label: 'SHOP UPGRADES', val: String(meta.shopOwned.length), color: 'var(--neon-cyan)', icon: '🛒' },
  ];

  return (
    <ScreenShell title="STATISTICS" sub="LIFETIME PROGRESSION" onBack={onBack}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {cards.map(c => (
          <div key={c.label} className="neon-glass p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{c.icon}</span>
            </div>
            <div className="font-display text-2xl" style={{ color: c.color }}>{c.val}</div>
            <div className="font-mono-neon text-[10px] opacity-60 uppercase tracking-wider mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="neon-glass p-4">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-mag)' }}>PRESTIGE · LV {meta.prestige}</div>
          <p className="text-xs opacity-70 mb-3">Reset run-progression for +4% dmg & +3% HP per level (max 10). Requires 5+ runs.</p>
          <button disabled={!canPrestige} onClick={() => { if (confirm('Prestige? This resets shop/classes/relics but keeps prestige level + ascension.')) doPrestige(); }}
            className="neon-btn w-full py-2 disabled:opacity-30 disabled:cursor-not-allowed">
            {canPrestige ? 'PRESTIGE (+200 ⚡)' : 'LOCKED'}
          </button>
        </div>
        <div className="neon-glass p-4">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-pur)' }}>ASCENSION · LV {meta.ascension}</div>
          <p className="text-xs opacity-70 mb-3">Permanent +5% XP per level (max 5). Requires reaching level 40 in a run.</p>
          <button disabled={!canAscend} onClick={() => doAscend()}
            className="neon-btn w-full py-2 disabled:opacity-30 disabled:cursor-not-allowed">
            {canAscend ? 'ASCEND (+500 ⚡)' : 'LOCKED'}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ============ ARSENAL ============ */
export function ArsenalScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  return (
    <ScreenShell title="ARSENAL" sub="WEAPONS & ABILITIES" onBack={onBack}>
      <h3 className="font-display text-lg mb-3" style={{ color: 'var(--neon-cyan)' }}>WEAPONS ({WEAPONS.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {WEAPONS.map((w, i) => {
          const m = meta.weaponMastery[String(i)];
          return (
            <div key={w.name} className="neon-glass p-4 flex items-center gap-3">
              <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${colStr(w.col)})` }}>{w.icon}</div>
              <div className="flex-1">
                <div className="font-display text-base" style={{ color: colStr(w.col) }}>{w.name}</div>
                <div className="text-xs opacity-70">{w.desc}</div>
                {m && m.level > 1 && (
                  <div className="font-mono-neon text-[10px] mt-1" style={{ color: 'var(--neon-yel)' }}>★ MASTERY LV {m.level}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="font-display text-lg mb-3" style={{ color: 'var(--neon-mag)' }}>ABILITIES ({ABILITIES.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ABILITIES.map((a, i) => (
          <div key={a.name} className="neon-glass p-4 flex items-center gap-3">
            <div className="text-3xl">{a.icon}</div>
            <div className="flex-1">
              <div className="font-display text-base" style={{ color: 'var(--neon-cyan)' }}>{i+1}. {a.name}</div>
              <div className="text-xs opacity-70">{a.desc}</div>
            </div>
            <div className="neon-chip" style={{ color: 'var(--neon-yel)' }}>{a.cd}s</div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ BESTIARY ============ */
export function BestiaryScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell title="BESTIARY" sub="KNOW YOUR ENEMIES" onBack={onBack}>
      <h3 className="font-display text-lg mb-3" style={{ color: 'var(--neon-red)' }}>ENEMIES</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {ENEMIES.map(e => (
          <div key={e.name} className="neon-glass p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${e.color})` }}>{e.icon}</div>
              <div className="font-display text-base" style={{ color: e.color }}>{e.name}</div>
            </div>
            <div className="text-xs opacity-70 mb-2">{e.desc}</div>
            <div className="flex gap-2 flex-wrap">
              <span className="neon-chip">HP {e.hp}</span>
              <span className="neon-chip">SPD {e.speed}</span>
              <span className="neon-chip" style={{ color: 'var(--neon-red)' }}>DMG {e.dmg}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-display text-lg mb-3" style={{ color: 'var(--neon-mag)' }}>BOSSES</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BOSSES.map(b => (
          <div key={b.name} className="neon-glass p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl neon-float" style={{ filter: `drop-shadow(0 0 10px ${b.color})` }}>{b.icon}</div>
              <div>
                <div className="font-display text-base" style={{ color: b.color }}>{b.name}</div>
                <div className="font-mono-neon text-[10px] opacity-60">HP {b.hp}</div>
              </div>
            </div>
            <div className="text-xs opacity-70 mb-2">{b.desc}</div>
            <div className="flex flex-wrap gap-1.5">
              {b.patterns.map(p => <span key={p} className="neon-chip" style={{ fontSize: 9 }}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ ACHIEVEMENTS ============ */
export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell title="ACHIEVEMENTS" sub={`${ACHIEVEMENTS.length} CHALLENGES TO UNLOCK`} onBack={onBack}>
      <p className="text-xs opacity-60 mb-4 font-mono-neon">Earned in-run. Track them via the in-game toast notifications.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map(a => (
          <div key={a.id} className="neon-glass p-4 flex items-center gap-3">
            <div className="text-3xl">{a.icon}</div>
            <div className="flex-1">
              <div className="font-display text-sm" style={{ color: 'var(--neon-yel)' }}>{a.name}</div>
              <div className="text-xs opacity-70">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ SHOP ============ */
export function ShopScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  const buy = useNeon(s => s.buyShopItem);
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <ScreenShell title="NEON SHOP" sub={`⚡ ${meta.credits} CREDITS`} onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SHOP_ITEMS.map(it => {
          const owned = meta.shopOwned.includes(it.id);
          return (
            <div key={it.id} className="neon-glass p-4">
              <div className="font-display text-base mb-1" style={{ color: owned ? 'var(--neon-grn)' : 'var(--neon-cyan)' }}>{it.name}</div>
              <div className="font-mono-neon text-xs opacity-60 mb-3">{owned ? 'OWNED' : `⚡ ${it.cost}`}</div>
              <button
                disabled={owned}
                onClick={() => {
                  if (buy(it.id, it.cost)) { setFlash('✓ Purchased'); setTimeout(() => setFlash(null), 1200); }
                  else { setFlash('✗ Not enough credits'); setTimeout(() => setFlash(null), 1200); }
                }}
                className="neon-btn w-full py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {owned ? '✓ OWNED' : 'BUY'}
              </button>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 neon-glass px-6 py-3 font-display z-50">
            {flash}
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}

/* ============ CLASSES ============ */
export function ClassesScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  const unlock = useNeon(s => s.unlockClass);
  return (
    <ScreenShell title="CLASSES" sub="SELECT YOUR ARCHETYPE" onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CLASSES.map(c => {
          const owned = c.cost === 0 || meta.classOwned.includes(c.id);
          const sel = meta.classId === c.id;
          return (
            <div key={c.id} className="neon-glass p-5 text-center" style={sel ? { borderColor: 'var(--neon-cyan)', boxShadow: '0 0 24px rgba(34,230,255,.3)' } : {}}>
              <div className="text-5xl mb-2 neon-float">{c.icon}</div>
              <div className="font-display text-xl mb-1" style={{ color: sel ? 'var(--neon-cyan)' : '#dfe9ff' }}>{c.name}</div>
              <div className="text-xs opacity-70 mb-3">{c.desc}</div>
              <button
                onClick={() => unlock(c.id, c.cost)}
                className="neon-btn w-full py-2 text-sm"
                style={sel ? { borderColor: 'var(--neon-grn)', color: 'var(--neon-grn)' } : {}}
              >
                {sel ? '✓ EQUIPPED' : owned ? 'SELECT' : `⚡ ${c.cost}`}
              </button>
            </div>
          );
        })}
      </div>
    </ScreenShell>
  );
}

/* ============ DAILY ============ */
export function DailyScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  const claim = useNeon(s => s.claimDaily);
  const [got, setGot] = useState<number | null>(null);
  const quests = meta.dailyQuests || [];
  return (
    <ScreenShell title="DAILY QUESTS" sub="RESETS DAILY · EARN CREDITS" onBack={onBack}>
      {quests.length === 0 ? (
        <div className="neon-glass p-8 text-center opacity-60">Visit the in-game menu to generate today's quests, then return here.</div>
      ) : (
        <div className="space-y-3 mb-4">
          {quests.map(q => {
            const prog = meta.dailyProgress[q.id] || 0;
            const done = prog >= q.target;
            const claimed = q.claimed;
            return (
              <div key={q.id} className="neon-glass p-4 flex items-center gap-4">
                <div className="text-2xl">{claimed ? '✅' : done ? '🎁' : '⏳'}</div>
                <div className="flex-1">
                  <div className="font-display text-sm">{q.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="neon-bar flex-1"><span style={{ width: Math.min(100, prog/q.target*100) + '%', background: 'linear-gradient(90deg,#22e6ff,#9b5cff)' }} /></div>
                    <span className="font-mono-neon text-[10px] opacity-70">{Math.min(prog, q.target)}/{q.target}</span>
                  </div>
                </div>
                <div className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ {q.reward}</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={() => { const n = claim(); setGot(n); setTimeout(() => setGot(null), 1500); }} className="neon-btn w-full py-3">
        CLAIM REWARDS
      </button>
      <AnimatePresence>
        {got !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 neon-glass px-6 py-3 font-display z-50">
            {got > 0 ? `✓ +${got} credits` : 'Nothing to claim'}
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}

/* ============ CHALLENGES ============ */
export function ChallengesScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const meta = useNeon(s => s.meta);
  return (
    <ScreenShell title="CHALLENGE RUNS" sub="HIGH-RISK, HIGH-REWARD MODIFIERS" onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CHALLENGES.map(c => (
          <div key={c.id} className="neon-glass p-5">
            <div className="font-display text-lg mb-1" style={{ color: 'var(--neon-mag)' }}>{c.name}</div>
            <div className="text-xs opacity-70 mb-3">{c.desc}</div>
            <div className="flex items-center justify-between">
              <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ ×{c.credits} credits</span>
              <button onClick={onStart} className="neon-btn px-4 py-1.5 text-xs">START ▶</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs opacity-50 mt-4 font-mono-neon">
        Challenges start an Endless run with modifiers applied. You have ⚡ {meta.credits} credits.
      </p>
    </ScreenShell>
  );
}

/* ============ NEWS / CHANGELOG ============ */
export function NewsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell title="PATCH NOTES" sub="WHAT'S NEW" onBack={onBack}>
      <div className="space-y-4">
        {CHANGELOG.map(c => (
          <div key={c.v} className="neon-glass p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="font-display text-lg" style={{ color: 'var(--neon-cyan)' }}>v{c.v}</div>
              <div className="font-mono-neon text-xs opacity-60">{c.date}</div>
            </div>
            <ul className="space-y-1.5">
              {c.items.map((it, i) => (
                <li key={i} className="text-sm opacity-80 flex gap-2"><span style={{ color: 'var(--neon-grn)' }}>▸</span>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ HOW TO PLAY ============ */
export function HowToScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell title="HOW TO PLAY" sub="CONTROLS & TIPS" onBack={onBack}>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {CONTROLS.map(c => (
          <div key={c.action} className="neon-glass p-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              {c.keys.map(k => <kbd key={k} className="px-2 py-1 rounded bg-black/50 border border-cyan-400/40 font-mono-neon text-xs" style={{ color: 'var(--neon-cyan)' }}>{k}</kbd>)}
            </div>
            <div className="text-sm opacity-80">{c.action}</div>
          </div>
        ))}
      </div>
      <div className="neon-glass p-5 space-y-2 text-sm opacity-80">
        <p><b style={{ color: 'var(--neon-cyan)' }}>Survive:</b> Enemies spawn in waves and chase you. Auto-fire handles aiming — focus on movement and positioning.</p>
        <p><b style={{ color: 'var(--neon-yel)' }}>Level up:</b> Collect XP orbs. Each level lets you pick 1 of 3 upgrades. Every 5th level grants a skill point.</p>
        <p><b style={{ color: 'var(--neon-mag)' }}>Bosses:</b> A boss spawns every ~75s. Defeat them for loot, relics, and big credit payouts.</p>
        <p><b style={{ color: 'var(--neon-grn)' }}>Items:</b> 200 stacking passive items drop from elites/bosses. Build synergies: lifesteal + glass cannon, orbit blades + multishot, etc.</p>
        <p><b style={{ color: 'var(--neon-pur)' }}>Meta:</b> Earn credits per run → spend in shop → prestige/ascend for permanent buffs. Unlock classes & relics.</p>
      </div>
    </ScreenShell>
  );
}

/* ============ SETTINGS ============ */
export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const clearData = useNeon(s => s.clearData);
  const meta = useNeon(s => s.meta);
  return (
    <ScreenShell title="SETTINGS" sub="CONFIGURATION & DATA" onBack={onBack}>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="neon-glass p-5">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-cyan)' }}>AUDIO</div>
          <p className="text-xs opacity-70 mb-2">In-game audio (music + SFX) is managed by the game itself. Click anywhere in-game to resume audio context if muted.</p>
          <div className="neon-chip">Auto-generated synthwave soundtrack</div>
        </div>
        <div className="neon-glass p-5">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-grn)' }}>PERFORMANCE</div>
          <p className="text-xs opacity-70 mb-2">The game uses WebGL2 with bloom post-processing. Disable browser hardware-acceleration limits if FPS drops.</p>
          <div className="neon-chip">24000 max instances · 300 enemy cap</div>
        </div>
      </div>
      <div className="neon-glass p-5">
        <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-red)' }}>DANGER ZONE</div>
        <p className="text-xs opacity-70 mb-3">Erase ALL saved progress (credits, unlocks, classes, prestige, stats). This cannot be undone.</p>
        <button
          onClick={() => { if (confirm('Erase ALL saved progress? This cannot be undone.')) clearData(); }}
          className="neon-btn w-full py-2" style={{ borderColor: 'var(--neon-red)', color: '#ffb3c0' }}
        >
          ⚠ CLEAR ALL DATA
        </button>
      </div>
      <div className="neon-glass p-5 mt-3">
        <div className="font-display text-sm mb-2 opacity-70">SAVE INFO</div>
        <div className="font-mono-neon text-xs opacity-60 space-y-1">
          <div>Key: <span style={{ color: 'var(--neon-cyan)' }}>neon_survivor_meta_v3</span></div>
          <div>Storage: localStorage (shared with game iframe)</div>
          <div>Credits: ⚡ {meta.credits} · Prestige {meta.prestige} · Ascension {meta.ascension}</div>
        </div>
      </div>
    </ScreenShell>
  );
}
