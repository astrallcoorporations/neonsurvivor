/**
 * Neon Survivor — static game data (mirrors the in-game definitions)
 * Used by the React shell to render galleries / bestiary / mode select
 * without having to query the iframe.
 */

export type Rarity = 'common'|'uncommon'|'rare'|'epic'|'legendary'|'mythic'|'ancient';

export const RARITY: Record<Rarity,{n:string;c:string}> = {
  common:{n:'COMMON',c:'#b8c4d8'},
  uncommon:{n:'UNCOMMON',c:'#43ff9e'},
  rare:{n:'RARE',c:'#3aa0ff'},
  epic:{n:'EPIC',c:'#b15cff'},
  legendary:{n:'LEGENDARY',c:'#ffb347'},
  mythic:{n:'MYTHIC',c:'#ff3b8e'},
  ancient:{n:'ANCIENT',c:'#9efffb'},
};

export interface ModeDef{ id:string; name:string; tagline:string; desc:string; icon:string; color:string; accent:string; }
export const MODES: ModeDef[] = [
  { id:'endless',  name:'ENDLESS',     tagline:'Survive forever',          desc:'The classic. Endless waves, escalating difficulty. How long can you last?', icon:'♾️', color:'#22e6ff', accent:'rgba(34,230,255,.18)' },
  { id:'survival', name:'SURVIVAL',    tagline:'Denser swarms',            desc:'Greater enemy cap, tougher scaling. For veterans who want pressure.',       icon:'🌊', color:'#43ff9e', accent:'rgba(67,255,158,.18)' },
  { id:'bossrush', name:'BOSS RUSH',   tagline:'Back-to-back bosses',      desc:'A boss every few seconds. Pure bullet-hell practice.',                      icon:'👹', color:'#ff2bd6', accent:'rgba(255,43,214,.18)' },
  { id:'nightmare',name:'NIGHTMARE',   tagline:'Brutal scaling',           desc:'1.7× difficulty. For ascension-tested survivors only.',                     icon:'💀', color:'#ff3b5c', accent:'rgba(255,59,92,.18)' },
  { id:'custom',   name:'CHAOS',       tagline:'x2 XP, pre-armed',         desc:'Start with 5 weapons, a drone, and double XP. Pure power fantasy.',         icon:'⚡', color:'#ffe24a', accent:'rgba(255,226,74,.18)' },
];

export interface WeaponDef{ name:string; desc:string; col:[number,number,number]; icon:string; }
export const WEAPONS: WeaponDef[] = [
  { name:'BLASTER',         desc:'Rapid neon bolts',         col:[0.2,0.9,1],    icon:'🔫' },
  { name:'SHOTGUN',          desc:'Wide close-range burst',   col:[1,0.7,0.2],    icon:'💥' },
  { name:'SMG',              desc:'Spray of fast rounds',     col:[0.6,1,0.4],    icon:'🌀' },
  { name:'MINIGUN',          desc:'Relentless lead storm',    col:[1,0.85,0.3],   icon:'⚙️' },
  { name:'RAILGUN',          desc:'Piercing hyper-rail',      col:[0.5,0.5,1],    icon:'📏' },
  { name:'SNIPER',           desc:'Massive crit headshots',   col:[1,0.3,0.4],    icon:'🎯' },
  { name:'LASER RIFLE',      desc:'Continuous cutting beam',  col:[1,0.2,0.9],    icon:'🔴' },
  { name:'PLASMA CANNON',    desc:'Slow orbs that detonate',  col:[0.3,1,0.8],    icon:'🟢' },
  { name:'ROCKET LAUNCHER',  desc:'Explosive splash damage',  col:[1,0.5,0.15],   icon:'🚀' },
  { name:'LIGHTNING GUN',    desc:'Arcs between foes',        col:[0.7,0.9,1],    icon:'⚡' },
  { name:'FLAMETHROWER',     desc:'Burning short-range cone', col:[1,0.45,0.1],   icon:'🔥' },
];

export interface AbilityDef{ name:string; icon:string; cd:number; desc:string; }
export const ABILITIES: AbilityDef[] = [
  { name:'Dash',        icon:'💨', cd:1.2, desc:'Blink in aim direction. i-frames.' },
  { name:'Missiles',    icon:'🚀', cd:7,   desc:'Homing missile swarm (8 missiles).' },
  { name:'Shockwave',   icon:'🌊', cd:6,   desc:'Radial blast that knocks back foes.' },
  { name:'Heal',        icon:'➕', cd:14,  desc:'Restore 35% max HP + brief invuln.' },
  { name:'Laser',       icon:'⚡', cd:8,   desc:'Giant piercing beam. 150 ability dmg.' },
  { name:'Drones',      icon:'🛰️',cd:20,  desc:'Summon 3 temp combat drones for 10s.' },
  { name:'Time Slow',   icon:'⏳', cd:16,  desc:'Slow all enemies to 30% for 4s.' },
  { name:'Black Hole',  icon:'🕳️', cd:18,  desc:'Singularity that pulls & damages foes.' },
  { name:'Orbital',     icon:'☄️', cd:15,  desc:'10 orbital strikes rain from the sky.' },
];

export interface EnemyDef{ name:string; icon:string; hp:string; speed:string; dmg:string; desc:string; color:string; }
export const ENEMIES: EnemyDef[] = [
  { name:'GRUNT',     icon:'🟥', hp:'24',   speed:'120', dmg:'9',  desc:'The horde. Slow, weak, numerous.',           color:'#ff3b5c' },
  { name:'FAST',      icon:'🔷', hp:'14',   speed:'255', dmg:'7',  desc:'Quick strikers that flank you.',             color:'#ffb347' },
  { name:'TANK',      icon:'🟦', hp:'140',  speed:'70',  dmg:'16', desc:'Heavy bruiser. Soaks damage.',              color:'#5a7bff' },
  { name:'EXPLODER',  icon:'🟠', hp:'30',   speed:'150', dmg:'34', desc:'Detonates on contact. Kill at range.',       color:'#ff7a1a' },
  { name:'SHOOTER',   icon:'🔺', hp:'34',   speed:'95',  dmg:'8',  desc:'Kites and fires spreads of bullets.',        color:'#80ff9e' },
  { name:'SNIPER',    icon:'🔻', hp:'40',   speed:'60',  dmg:'22', desc:'Long-range aimed shots. High threat.',       color:'#ff3b80' },
  { name:'DRONE',     icon:'🔹', hp:'18',   speed:'220', dmg:'6',  desc:'Strafing flyer. Constant harassment.',       color:'#4de6ff' },
];

export interface BossDef{ name:string; icon:string; hp:string; color:string; patterns:string[]; desc:string; }
export const BOSSES: BossDef[] = [
  { name:'NEON TITAN',    icon:'🤖', hp:'2600',  color:'#9b5cff', patterns:['Radial','Summon','Aimed'],         desc:'The first wall. Radial bullet sprays and reinforcements.' },
  { name:'VOID CORE',     icon:'👾', hp:'3400',  color:'#5a7bff', patterns:['Spiral','Pull','Radial'],          desc:'Spiral hell + implosion pull. Mind the gravity well.' },
  { name:'CYBER HYDRA',   icon:'🐲', hp:'4200',  color:'#43ff9e', patterns:['Aimed Heavy','Spread Wall','Charge'],desc:'Charges and walls of bullets. Stay mobile.' },
  { name:'OVERSEER',      icon:'👁️', hp:'5200', color:'#ffb347', patterns:['Beam Sweep','Drone Swarm','Spiral'],desc:'Sweeping beams and drone swarms. Multithreat.' },
  { name:'OMEGA MACHINE', icon:'⚙️', hp:'7200', color:'#ff3b5c', patterns:['Spiral','Radial','Aimed','Summon','Beam','Charge'], desc:'The final gauntlet. Every pattern. Endure.' },
  { name:'VOID EMPEROR',  icon:'🔮', hp:'12000',color:'#9b5cff', patterns:['Radial','Beam Sweep','Summon','Aimed Heavy'], desc:'⚡ SECRET BOSS — summoned by elite hunters only. The ultimate test.' },
];

export interface ClassDef{ id:string; name:string; icon:string; cost:number; desc:string; }
export const CLASSES: ClassDef[] = [
  { id:'soldier',   name:'SOLDIER',   icon:'🔫', cost:0,    desc:'Balanced all-rounder. +10% dmg, +20 HP.' },
  { id:'gunner',    name:'GUNNER',    icon:'🌀', cost:600,  desc:'+18% fire rate, -10% dmg.' },
  { id:'tank',      name:'TANK',      icon:'🛡️', cost:900,  desc:'+80 HP, +6 armor, -8% speed.' },
  { id:'archon',    name:'ARCHON',    icon:'🔮', cost:1200, desc:'+35% ability power, -20% HP.' },
  { id:'scout',     name:'SCOUT',     icon:'💨', cost:800,  desc:'+25% speed, +4 luck, -15% HP.' },
  { id:'berserker', name:'BERSERKER', icon:'😡', cost:1500, desc:'+30% dmg below 40% HP, +50 HP.' },
];

export interface ShopItemDef{ id:string; name:string; cost:number; }
export const SHOP_ITEMS: ShopItemDef[] = [
  { id:'start_drone', name:'Starter Drone',         cost:300 },
  { id:'magnet_up',   name:'Magnet Booster +25%',   cost:250 },
  { id:'hp_up',       name:'Max HP +30',            cost:400 },
  { id:'dmg_up',      name:'Damage +10%',           cost:500 },
  { id:'rate_up',     name:'Fire Rate +10%',        cost:500 },
  { id:'speed_up',    name:'Move Speed +12%',       cost:450 },
  { id:'armor_up',    name:'Armor +3',              cost:350 },
  { id:'regen_up',    name:'Regen +1.0/s',          cost:400 },
  { id:'crit_up',     name:'Crit +5%',              cost:550 },
  { id:'luck_up',     name:'Luck +3',               cost:500 },
  { id:'minimap1',    name:'Minimap: Show Elites',  cost:200 },
  { id:'minimap2',    name:'Minimap: Show Loot',    cost:300 },
  { id:'minimap3',    name:'Minimap: Fog of War',   cost:400 },
  { id:'relic_slot',  name:'+1 Relic Slot',         cost:1200 },
  { id:'dash_charge', name:'+1 Dash Charge',        cost:800 },
  { id:'cdr',         name:'-15% Ability CD',       cost:700 },
  { id:'drone_dmg',   name:'+30% Drone DMG',        cost:600 },
  { id:'overdrive',   name:'Overdrive +50%',        cost:650 },
];

export interface ChallengeDef{ id:string; name:string; desc:string; credits:number; }
export const CHALLENGES: ChallengeDef[] = [
  { id:'pacifist',  name:'GLASS WALKER',   desc:'0.5× HP, 3× XP, no drones',          credits:2 },
  { id:'onegun',    name:'ONE GUN',        desc:'Single weapon only, 2× dmg',         credits:1.5 },
  { id:'nodash',    name:'NO ESCAPE',      desc:'No dash, +4 armor',                  credits:2.5 },
  { id:'speedrun',  name:'BLITZ',          desc:'2× enemy speed',                     credits:3 },
  { id:'nightmare', name:'TRUE NIGHTMARE', desc:'0.3× HP',                            credits:4 },
  { id:'lucky',     name:'FORTUNE',        desc:'+12 luck',                           credits:1.5 },
];

export interface RelicDef{ id:string; name:string; desc:string; }
export const RELICS: RelicDef[] = [
  { id:'adrenal_core',   name:'Adrenal Core',    desc:'+15% dmg, +10% rate' },
  { id:'phase_lens',     name:'Phase Lens',      desc:'+8% crit, +30% crit dmg' },
  { id:'iron_sigil',     name:'Iron Sigil',      desc:'+60 HP, +5 armor' },
  { id:'flux_capacitor', name:'Flux Capacitor',  desc:'-25% ability CD' },
  { id:'vampiric',       name:'Vampiric Sigil',  desc:'+8% lifesteal' },
  { id:'glasscannon',    name:'Glass Cannon',    desc:'+50% dmg, -30% HP' },
  { id:'swift',          name:'Swift Aura',      desc:'+20% move & fire rate' },
  { id:'magnetar',       name:'Magnetar Core',   desc:'+60% pickup, +20% XP' },
  { id:'overload',       name:'Overload Cell',   desc:'+1 proj, +1 pierce' },
  { id:'regen',          name:'Regen Field',     desc:'+3 regen/s' },
  { id:'thorns',         name:'Thorned Plating', desc:'+20 thorns, +4 armor' },
  { id:'berserk',        name:'Berserker Soul',  desc:'+40% dmg below 40% HP' },
];

export interface AchievementDef{ id:string; name:string; desc:string; icon:string; }
export const ACHIEVEMENTS: AchievementDef[] = [
  { id:'k10',     name:'Slayer 10',       desc:'Kill 10 enemies',         icon:'💀' },
  { id:'k100',    name:'Slayer 100',      desc:'Kill 100 enemies',        icon:'💀' },
  { id:'k1000',   name:'Slayer 1000',     desc:'Kill 1000 enemies',       icon:'💀' },
  { id:'k5000',   name:'Slayer 5000',     desc:'Kill 5000 enemies',       icon:'💀' },
  { id:'l10',     name:'Level 10',        desc:'Reach level 10',          icon:'⬆️' },
  { id:'l25',     name:'Level 25',        desc:'Reach level 25',          icon:'⬆️' },
  { id:'l40',     name:'Ascended',        desc:'Reach level 40',          icon:'👑' },
  { id:'w5',      name:'Wave 5',          desc:'Reach wave 5',            icon:'🌊' },
  { id:'w25',     name:'Wave 25',         desc:'Reach wave 25',           icon:'🌊' },
  { id:'b1',      name:'Boss Hunter',     desc:'Defeat 1 boss',           icon:'👹' },
  { id:'b5',      name:'Boss Slayer',     desc:'Defeat 5 bosses',         icon:'⚔️' },
  { id:'b20',     name:'Boss Nemesis',    desc:'Defeat 20 bosses',        icon:'🏆' },
  { id:'t300',    name:'Survivor',        desc:'Survive 5 minutes',       icon:'⏱️' },
  { id:'t600',    name:'Endurance',       desc:'Survive 10 minutes',      icon:'⏱️' },
  { id:'t1200',   name:'Marathoner',      desc:'Survive 20 minutes',      icon:'⏱️' },
  { id:'arsenal', name:'Arsenal',         desc:'Unlock 5 weapons',        icon:'🔫' },
  { id:'fullarsenal', name:'Gunsmith',    desc:'Unlock all 11 weapons',   icon:'🛠️' },
  { id:'drones6', name:'Hive Mind',       desc:'Field 6 drones',          icon:'🐝' },
  { id:'tank',    name:'Tanky',           desc:'Reach 300 max HP',        icon:'❤️' },
  { id:'crit',    name:'Critical',        desc:'Reach 40% crit',          icon:'🎯' },
  { id:'glass',   name:'Glass Cannon',    desc:'Reach 3× damage',         icon:'💥' },
  { id:'speed',   name:'Speedster',       desc:'Reach 1.5× move speed',   icon:'🏃' },
  { id:'mythic',  name:'Mythic Find',     desc:'Collect a mythic item',   icon:'🌟' },
  { id:'skillful',name:'Mastermind',      desc:'Spend 12 skill points',   icon:'🧠' },
  { id:'rich2',   name:'Big Spender',     desc:'Fill the skill tree',     icon:'🌳' },
];

export const CONTROLS = [
  { keys:['WASD'], action:'Move' },
  { keys:['Mouse'], action:'Aim (auto-fire ON)' },
  { keys:['L-Click'], action:'Overdrive (hold for 2× fire rate)' },
  { keys:['Space'], action:'Dash' },
  { keys:['1','9'], action:'Abilities' },
  { keys:['Q','E'], action:'Swap weapon' },
  { keys:['T'], action:'Skill tree' },
  { keys:['I'], action:'Inventory' },
  { keys:['G'], action:'Toggle local co-op (P2)' },
  { keys:['Esc'], action:'Pause' },
];

export const CHANGELOG = [
  { v:'2.0.0', date:'CRAZY REDESIGN', items:[
    'Holographic chromatic title + animated gradient borders',
    'CRT scanline overlay & glassmorphism panels',
    'Orbitron / Rajdhani / Share Tech Mono typography',
    'New React meta-shell: stats dashboard, weapon gallery, bestiary, achievements, settings',
    'Live HUD sync via postMessage bridge',
    'Persistent meta-progression shared across shell & game',
    '6 classes, 18 shop upgrades, 12 relics, 6 challenge runs',
    'Polished ability cooldowns, level-up cards, boss bars',
  ]},
  { v:'1.x', date:'Legacy', items:[
    '3D WebGL2 renderer with bloom post-processing',
    '11 weapons, 9 abilities, 5+1 bosses, 200 stacking items',
    'Skill tree (4 branches), local co-op, daily quests',
    'Prestige & ascension meta loops',
  ]},
];
