'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeon, fmtTime } from '@/lib/neon/store';
import {
  WEAPONS, ABILITIES, ENEMIES, BOSSES, CLASSES, SHOP_ITEMS,
  CHALLENGES, ACHIEVEMENTS, CONTROLS, CHANGELOG,
} from '@/lib/neon/data';

/* ============ shared screen shell ============ */
export function ScreenShell({ icon, title, sub, onBack, children }: { icon: string; title: string; sub?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="neon-btn-ghost px-4 py-2 text-sm">◀ BACK</button>
        </div>
        <div className="font-mono-neon text-[10px] neon-text-faint tracking-widest">{sub}</div>
      </div>

      <div className="neon-section-head mb-6">
        <span className="ico text-3xl" style={{ color: 'var(--neon-cyan)' }}>{icon}</span>
        <div>
          <h2 className="neon-holo-title font-display text-3xl sm:text-4xl">{title}</h2>
        </div>
      </div>

      {children}

      <div className="neon-footer mt-6 px-4 py-3 rounded-xl flex items-center justify-between font-mono-neon text-[10px] tracking-widest neon-text-faint">
        <span>NEON SURVIVOR · COMMAND DECK</span>
        <span>v2.1</span>
      </div>
    </motion.div>
  );
}

function colStr(c: [number, number, number]) {
  return `rgb(${(c[0]*255)|0},${(c[1]*255)|0},${(c[2]*255)|0})`;
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
    { label: 'CREDITS EARNED', val: s.totalCredits.toLocaleString(), color: 'var(--neon-yel)', icon: '⚡' },
    { label: 'PLAYTIME', val: fmtTime(s.totalPlaytime), color: 'var(--neon-grn)', icon: '🕐' },
    { label: 'ITEMS FOUND', val: `${meta.itemsDiscovered.length} / 200`, color: 'var(--neon-mag)', icon: '💎' },
    { label: 'RELICS', val: String(meta.relicsOwned.length), color: 'var(--neon-pur)', icon: '🔮' },
    { label: 'SHOP UPGRADES', val: String(meta.shopOwned.length), color: 'var(--neon-cyan)', icon: '🛒' },
  ];

  return (
    <ScreenShell icon="📊" title="STATISTICS" sub="LIFETIME PROGRESSION" onBack={onBack}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="neon-card p-4"
          >
            <div className="text-xl mb-1.5">{c.icon}</div>
            <div className="font-display text-2xl neon-text-glow" style={{ color: c.color }}>{c.val}</div>
            <div className="font-mono-neon text-[10px] neon-text-faint uppercase tracking-widest mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-mag)' }}>◆</span>
        <span className="lbl">PRESTIGE & ASCENSION</span>
        <span className="sub">PERMANENT BUFFS</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="neon-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-display text-lg" style={{ color: 'var(--neon-mag)' }}>PRESTIGE</div>
            <span className="neon-chip" style={{ color: 'var(--neon-mag)' }}>LV {meta.prestige}</span>
          </div>
          <p className="text-xs neon-text-dim mb-3 leading-relaxed">Reset run-progression for <b style={{ color: 'var(--neon-cyan)' }}>+4% dmg</b> & <b style={{ color: 'var(--neon-grn)' }}>+3% HP</b> per level (max 10). Requires 5+ runs.</p>
          <button disabled={!canPrestige} onClick={() => { if (confirm('Prestige? Resets shop/classes/relics but keeps prestige + ascension.')) doPrestige(); }}
            className="neon-btn w-full py-2.5 disabled:opacity-30 disabled:cursor-not-allowed text-sm">
            {canPrestige ? 'PRESTIGE (+200 ⚡)' : '🔒 LOCKED · NEED 5 RUNS'}
          </button>
        </div>
        <div className="neon-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-display text-lg" style={{ color: 'var(--neon-pur)' }}>ASCENSION</div>
            <span className="neon-chip" style={{ color: 'var(--neon-pur)' }}>LV {meta.ascension}</span>
          </div>
          <p className="text-xs neon-text-dim mb-3 leading-relaxed">Permanent <b style={{ color: 'var(--neon-yel)' }}>+5% XP</b> per level (max 5). Requires reaching level 40 in a run.</p>
          <button disabled={!canAscend} onClick={() => doAscend()}
            className="neon-btn w-full py-2.5 disabled:opacity-30 disabled:cursor-not-allowed text-sm">
            {canAscend ? 'ASCEND (+500 ⚡)' : '🔒 LOCKED · NEED LV 40'}
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
    <ScreenShell icon="🔫" title="ARSENAL" sub="WEAPONS & ABILITIES" onBack={onBack}>
      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-cyan)' }}>▸</span>
        <span className="lbl">WEAPONS</span>
        <span className="sub">{WEAPONS.length} TOTAL</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {WEAPONS.map((w, i) => {
          const m = meta.weaponMastery[String(i)];
          return (
            <div key={w.name} className="neon-card p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `radial-gradient(circle, ${colStr(w.col)}22, transparent)`, border: `1px solid ${colStr(w.col)}55` }}>
                {w.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base tracking-wide" style={{ color: colStr(w.col) }}>{w.name}</div>
                <div className="text-xs neon-text-dim">{w.desc}</div>
                {m && m.level > 1 && (
                  <div className="font-mono-neon text-[10px] mt-1" style={{ color: 'var(--neon-yel)' }}>★ MASTERY LV {m.level}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-mag)' }}>▸</span>
        <span className="lbl">ABILITIES</span>
        <span className="sub">{ABILITIES.length} TOTAL</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ABILITIES.map((a, i) => (
          <div key={a.name} className="neon-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 neon-panel">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono-neon text-[10px] neon-text-faint">{i+1}</span>
                <div className="font-display text-base" style={{ color: 'var(--neon-cyan)' }}>{a.name}</div>
              </div>
              <div className="text-xs neon-text-dim">{a.desc}</div>
            </div>
            <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>{a.cd}s</span>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ BESTIARY ============ */
export function BestiaryScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell icon="👹" title="BESTIARY" sub="KNOW YOUR ENEMIES" onBack={onBack}>
      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-red)' }}>▸</span>
        <span className="lbl">ENEMIES</span>
        <span className="sub">{ENEMIES.length} TYPES</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {ENEMIES.map((e, i) => (
          <motion.div key={e.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="neon-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${e.color}22`, border: `1px solid ${e.color}55` }}>{e.icon}</div>
              <div className="font-display text-base tracking-wide" style={{ color: e.color }}>{e.name}</div>
            </div>
            <div className="text-xs neon-text-dim mb-3 leading-relaxed">{e.desc}</div>
            <div className="grid grid-cols-3 gap-1.5">
              <BestStat label="HP" val={e.hp} color="var(--neon-grn)" />
              <BestStat label="SPD" val={e.speed} color="var(--neon-cyan)" />
              <BestStat label="DMG" val={e.dmg} color="var(--neon-red)" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-mag)' }}>▸</span>
        <span className="lbl">BOSSES</span>
        <span className="sub">{BOSSES.length} TOTAL</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BOSSES.map((b, i) => (
          <motion.div key={b.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="neon-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl neon-float"
                style={{ background: `radial-gradient(circle, ${b.color}33, transparent)`, border: `1px solid ${b.color}66` }}>{b.icon}</div>
              <div>
                <div className="font-display text-base tracking-wide" style={{ color: b.color }}>{b.name}</div>
                <div className="font-mono-neon text-[10px] neon-text-faint">HP {b.hp}</div>
              </div>
            </div>
            <div className="text-xs neon-text-dim mb-3 leading-relaxed">{b.desc}</div>
            <div className="flex flex-wrap gap-1">
              {b.patterns.map(p => <span key={p} className="neon-chip" style={{ fontSize: 9, padding: '2px 7px' }}>{p}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}
function BestStat({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div className="neon-panel py-1.5 px-1 text-center">
      <div className="font-mono-neon text-[8px] neon-text-faint">{label}</div>
      <div className="font-display text-sm" style={{ color }}>{val}</div>
    </div>
  );
}

/* ============ ACHIEVEMENTS ============ */
export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell icon="🏆" title="AWARDS" sub={`${ACHIEVEMENTS.length} CHALLENGES`} onBack={onBack}>
      <p className="text-xs neon-text-dim mb-4 font-mono-neon">Earned in-run via toast notifications. Track progress through gameplay.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="neon-card p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(255,226,74,.1)', border: '1px solid rgba(255,226,74,.3)' }}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-sm tracking-wide" style={{ color: 'var(--neon-yel)' }}>{a.name}</div>
              <div className="text-xs neon-text-dim">{a.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ SHOP ============ */
export function ShopScreen({ onBack }: { onBack: () => void }) {
  const meta = useNeon(s => s.meta);
  const buy = useNeon(s => s.buyShopItem);
  const [flash, setFlash] = useState<{ msg: string; ok: boolean } | null>(null);
  const notify = (msg: string, ok: boolean) => { setFlash({ msg, ok }); setTimeout(() => setFlash(null), 1400); };
  return (
    <ScreenShell icon="🛒" title="NEON SHOP" sub="PERMANENT UPGRADES" onBack={onBack}>
      <div className="neon-panel p-3 mb-4 flex items-center justify-between">
        <span className="font-mono-neon text-xs neon-text-dim tracking-widest">YOUR CREDITS</span>
        <span className="font-display text-xl neon-text-glow" style={{ color: 'var(--neon-yel)' }}>⚡ {meta.credits}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SHOP_ITEMS.map((it, i) => {
          const owned = meta.shopOwned.includes(it.id);
          return (
            <motion.div key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="neon-card p-4">
              <div className="font-display text-sm mb-1 tracking-wide" style={{ color: owned ? 'var(--neon-grn)' : 'var(--neon-cyan)' }}>{it.name}</div>
              <div className="font-mono-neon text-[10px] neon-text-faint mb-3 tracking-widest">{owned ? '✓ OWNED' : `⚡ ${it.cost} CREDITS`}</div>
              <button
                disabled={owned}
                onClick={() => { if (buy(it.id, it.cost)) notify('✓ Purchased', true); else notify('✗ Not enough credits', false); }}
                className={owned ? 'neon-btn-ghost w-full py-2 text-sm' : 'neon-btn w-full py-2 text-sm'}
                style={owned ? { color: 'var(--neon-grn)' } : {}}
              >
                {owned ? '✓ OWNED' : 'BUY'}
              </button>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 neon-glass px-6 py-3 font-display z-50"
            style={{ color: flash.ok ? 'var(--neon-grn)' : 'var(--neon-red)' }}>
            {flash.msg}
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
    <ScreenShell icon="⚡" title="CLASSES" sub="SELECT YOUR ARCHETYPE" onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CLASSES.map((c, i) => {
          const owned = c.cost === 0 || meta.classOwned.includes(c.id);
          const sel = meta.classId === c.id;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="neon-card p-5 text-center" style={sel ? { borderColor: 'var(--neon-cyan)', boxShadow: '0 0 24px rgba(34,230,255,.2)' } : {}}>
              <div className="text-5xl mb-2 neon-float">{c.icon}</div>
              <div className="font-display text-xl mb-1 tracking-wide" style={{ color: sel ? 'var(--neon-cyan)' : 'var(--neon-txt)' }}>{c.name}</div>
              <div className="text-xs neon-text-dim mb-3 leading-relaxed min-h-[2.5rem]">{c.desc}</div>
              <button
                onClick={() => unlock(c.id, c.cost)}
                className={sel ? 'neon-btn-ghost w-full py-2 text-sm' : 'neon-btn w-full py-2 text-sm'}
                style={sel ? { color: 'var(--neon-grn)', borderColor: 'var(--neon-grn)' } : {}}
              >
                {sel ? '✓ EQUIPPED' : owned ? 'SELECT' : `⚡ ${c.cost}`}
              </button>
            </motion.div>
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
    <ScreenShell icon="📅" title="DAILY QUESTS" sub="RESETS DAILY" onBack={onBack}>
      {quests.length === 0 ? (
        <div className="neon-card p-8 text-center neon-text-dim">No daily quests yet. Start a run to generate today's quests, then return here.</div>
      ) : (
        <div className="space-y-2.5 mb-4">
          {quests.map((q, i) => {
            const prog = meta.dailyProgress[q.id] || 0;
            const done = prog >= q.target;
            const claimed = q.claimed;
            return (
              <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="neon-card p-4 flex items-center gap-4">
                <div className="text-2xl flex-shrink-0">{claimed ? '✅' : done ? '🎁' : '⏳'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm tracking-wide">{q.name}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="neon-bar flex-1"><span style={{ width: Math.min(100, prog/q.target*100) + '%', background: 'linear-gradient(90deg,#22e6ff,#9b5cff)' }} /></div>
                    <span className="font-mono-neon text-[10px] neon-text-faint">{Math.min(prog, q.target)}/{q.target}</span>
                  </div>
                </div>
                <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ {q.reward}</span>
              </motion.div>
            );
          })}
        </div>
      )}
      <button onClick={() => { const n = claim(); setGot(n); setTimeout(() => setGot(null), 1600); }} className="neon-btn w-full py-3">
        CLAIM REWARDS
      </button>
      <AnimatePresence>
        {got !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 neon-glass px-6 py-3 font-display z-50"
            style={{ color: got > 0 ? 'var(--neon-grn)' : 'var(--neon-txt-dim)' }}>
            {got > 0 ? `✓ +${got} CREDITS` : 'NOTHING TO CLAIM'}
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
    <ScreenShell icon="⚔️" title="CHALLENGE RUNS" sub="HIGH-RISK · HIGH-REWARD" onBack={onBack}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CHALLENGES.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="neon-card p-5">
            <div className="font-display text-lg mb-1 tracking-wide" style={{ color: 'var(--neon-mag)' }}>{c.name}</div>
            <div className="text-xs neon-text-dim mb-3 leading-relaxed">{c.desc}</div>
            <div className="flex items-center justify-between">
              <span className="neon-chip" style={{ color: 'var(--neon-yel)' }}>⚡ ×{c.credits}</span>
              <button onClick={onStart} className="neon-btn px-4 py-1.5 text-xs">START ▶</button>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs neon-text-faint mt-4 font-mono-neon tracking-widest">
        CHALLENGES START AN ENDLESS RUN WITH MODIFIERS · ⚡ {meta.credits} CREDITS
      </p>
    </ScreenShell>
  );
}

/* ============ NEWS / CHANGELOG ============ */
export function NewsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell icon="📰" title="PATCH NOTES" sub="WHAT'S NEW" onBack={onBack}>
      <div className="space-y-4">
        {CHANGELOG.map((c, i) => (
          <motion.div key={c.v} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="neon-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-lg tracking-wide" style={{ color: 'var(--neon-cyan)' }}>v{c.v}</div>
              <span className="neon-chip">{c.date}</span>
            </div>
            <ul className="space-y-1.5">
              {c.items.map((it, j) => (
                <li key={j} className="text-sm neon-text-dim flex gap-2"><span style={{ color: 'var(--neon-grn)' }}>▸</span>{it}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ============ HOW TO PLAY ============ */
export function HowToScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell icon="❓" title="HOW TO PLAY" sub="CONTROLS & TIPS" onBack={onBack}>
      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-cyan)' }}>⌨</span>
        <span className="lbl">CONTROLS</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
        {CONTROLS.map((c, i) => (
          <motion.div key={c.action} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="neon-card p-3 flex items-center gap-3">
            <div className="flex gap-1.5 flex-shrink-0">
              {c.keys.map(k => <kbd key={k} className="px-2.5 py-1 rounded-md font-mono-neon text-xs font-bold"
                style={{ background: 'rgba(34,230,255,.08)', border: '1px solid rgba(34,230,255,.3)', color: 'var(--neon-cyan)' }}>{k}</kbd>)}
            </div>
            <div className="text-sm neon-text-dim">{c.action}</div>
          </motion.div>
        ))}
      </div>
      <div className="neon-section-head">
        <span className="ico" style={{ color: 'var(--neon-yel)' }}>★</span>
        <span className="lbl">TIPS</span>
      </div>
      <div className="neon-card p-5 space-y-2.5 text-sm neon-text-dim leading-relaxed">
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
    <ScreenShell icon="⚙️" title="SETTINGS" sub="CONFIGURATION & DATA" onBack={onBack}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div className="neon-card p-5">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-cyan)' }}>AUDIO</div>
          <p className="text-xs neon-text-dim mb-3 leading-relaxed">In-game audio (synthwave music + SFX) is managed by the game. Click in-game to resume the audio context if muted by the browser.</p>
          <span className="neon-chip">GENERATIVE SOUNDTRACK</span>
        </div>
        <div className="neon-card p-5">
          <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-grn)' }}>PERFORMANCE</div>
          <p className="text-xs neon-text-dim mb-3 leading-relaxed">WebGL2 with bloom post-processing. The game auto-throttles particles and enemies to maintain FPS.</p>
          <span className="neon-chip">24000 INSTANCES · 300 ENEMY CAP</span>
        </div>
      </div>
      <div className="neon-card p-5">
        <div className="font-display text-lg mb-2" style={{ color: 'var(--neon-red)' }}>⚠ DANGER ZONE</div>
        <p className="text-xs neon-text-dim mb-3 leading-relaxed">Erase ALL saved progress (credits, unlocks, classes, prestige, stats). This cannot be undone.</p>
        <button
          onClick={() => { if (confirm('Erase ALL saved progress? This cannot be undone.')) clearData(); }}
          className="neon-btn w-full py-2.5 text-sm" style={{ borderColor: 'var(--neon-red)', color: '#ffb3c0' }}
        >
          CLEAR ALL DATA
        </button>
      </div>
      <div className="neon-card p-5 mt-3">
        <div className="font-display text-sm mb-2 neon-text-dim">SAVE INFO</div>
        <div className="font-mono-neon text-xs neon-text-faint space-y-1">
          <div>KEY · <span style={{ color: 'var(--neon-cyan)' }}>neon_survivor_meta_v3</span></div>
          <div>STORAGE · localStorage (shared with game)</div>
          <div>STATE · ⚡ {meta.credits} · P{meta.prestige} · A{meta.ascension}</div>
        </div>
      </div>
    </ScreenShell>
  );
}
