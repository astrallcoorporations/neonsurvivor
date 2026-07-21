/* ============================================================
   NEON SURVIVOR — bootstrap.js
   Defines meta-progression (Meta), classes, shop, challenges,
   relics, and the postMessage bridge to the parent React shell.
   Loaded synchronously BEFORE the inline game script.
   Shares localStorage key 'neon_survivor_meta_v3' with shell.
   ============================================================ */
(function(){
"use strict";

/* -------------------- CLASSES (6) -------------------- */
window.CLASSES=[
  {id:'soldier',name:'SOLDIER',icon:'🔫',cost:0,desc:'Balanced all-rounder. +10% dmg, +20 HP.',
    apply:p=>{p.dmgMul*=1.10;p.maxhp+=20;p.hp+=20;}},
  {id:'gunner',name:'GUNNER',icon:'🌀',cost:600,desc:'+18% fire rate, -10% dmg.',
    apply:p=>{p.fireRateMul*=1.18;p.dmgMul*=0.90;}},
  {id:'tank',name:'TANK',icon:'🛡️',cost:900,desc:'+80 HP, +6 armor, -8% speed.',
    apply:p=>{p.maxhp+=80;p.hp+=80;p.armor+=6;p.moveMul*=0.92;}},
  {id:'mage',name:'ARCHON',icon:'🔮',cost:1200,desc:'+35% ability power, -20% HP.',
    apply:p=>{p.abilityMul*=1.35;p.maxhp*=0.80;p.hp=Math.min(p.hp,p.maxhp);}},
  {id:'scout',name:'SCOUT',icon:'💨',cost:800,desc:'+25% speed, +4 luck, -15% HP.',
    apply:p=>{p.moveMul*=1.25;p.luck+=4;p.maxhp*=0.85;p.hp=Math.min(p.hp,p.maxhp);}},
  {id:'berserker',name:'BERSERKER',icon:'😡',cost:1500,desc:'+30% dmg below 40% HP, +50 HP.',
    apply:p=>{p.berserk=true;p.maxhp+=50;p.hp+=50;}},
];

/* -------------------- SHOP ITEMS -------------------- */
window.SHOP_ITEMS=[
  {id:'start_drone',name:'Starter Drone',cost:300},
  {id:'magnet_up',name:'Magnet Booster +25%',cost:250},
  {id:'hp_up',name:'Max HP +30',cost:400},
  {id:'dmg_up',name:'Damage +10%',cost:500},
  {id:'rate_up',name:'Fire Rate +10%',cost:500},
  {id:'speed_up',name:'Move Speed +12%',cost:450},
  {id:'armor_up',name:'Armor +3',cost:350},
  {id:'regen_up',name:'Regen +1.0/s',cost:400},
  {id:'crit_up',name:'Crit +5%',cost:550},
  {id:'luck_up',name:'Luck +3',cost:500},
  {id:'minimap1',name:'Minimap: Show Elites',cost:200},
  {id:'minimap2',name:'Minimap: Show Loot',cost:300},
  {id:'minimap3',name:'Minimap: Fog of War',cost:400},
  {id:'relic_slot',name:'+1 Relic Slot',cost:1200},
  {id:'dash_charge',name:'+1 Dash Charge',cost:800},
  {id:'cdr',name:'-15% Ability CD',cost:700},
  {id:'drone_dmg',name:'+30% Drone DMG',cost:600},
  {id:'overdrive',name:'Overdrive +50%',cost:650},
];

/* -------------------- CHALLENGES -------------------- */
window.CHALLENGES=[
  {id:'pacifist',name:'GLASS WALKER',desc:'0.5x HP, 3x XP, no drones',mul:{hp:0.5,xp:3,credits:2}},
  {id:'onegun',name:'ONE GUN',desc:'Single weapon only, 2x dmg',mul:{dmg:2,oneGun:1,credits:1.5}},
  {id:'nodash',name:'NO ESCAPE',desc:'No dash, +4 armor, 2.5x credits',mul:{dash:0,armor:4,credits:2.5}},
  {id:'speedrun',name:'BLITZ',desc:'2x enemy speed, 3x credits',mul:{credits:3}},
  {id:'nightmare',name:'TRUE NIGHTMARE',desc:'0.3x HP, 4x credits',mul:{hp:0.3,credits:4}},
  {id:'lucky',name:'FORTUNE',desc:'+12 luck, 1.5x credits',mul:{luck:12,credits:1.5}},
];

/* -------------------- RELIC POOL -------------------- */
window.RELIC_POOL=[
  {id:'adrenal_core',name:'Adrenal Core',desc:'+15% dmg, +10% rate',apply:p=>{p.dmgMul*=1.15;p.fireRateMul*=1.10;}},
  {id:'phase_lens',name:'Phase Lens',desc:'+8% crit, +30% crit dmg',apply:p=>{p.crit=Math.min(0.95,p.crit+0.08);p.critDmg+=0.30;}},
  {id:'iron_sigil',name:'Iron Sigil',desc:'+60 HP, +5 armor',apply:p=>{p.maxhp+=60;p.hp+=60;p.armor+=5;}},
  {id:'flux_capacitor',name:'Flux Capacitor',desc:'-25% ability CD',apply:p=>{p.abilityCDmul=(p.abilityCDmul||1)*0.75;}},
  {id:'vampiric',name:'Vampiric Sigil',desc:'+8% lifesteal',apply:p=>{p.lifesteal+=0.08;}},
  {id:'glasscannon',name:'Glass Cannon',desc:'+50% dmg, -30% HP',apply:p=>{p.dmgMul*=1.5;p.maxhp*=0.7;p.hp=Math.min(p.hp,p.maxhp);}},
  {id:'swift',name:'Swift Aura',desc:'+20% move & fire rate',apply:p=>{p.moveMul*=1.2;p.fireRateMul*=1.2;}},
  {id:'magnetar',name:'Magnetar Core',desc:'+60% pickup, +20% XP',apply:p=>{p.pickupBonus+=0.6;p.xpMul*=1.2;}},
  {id:'overload',name:'Overload Cell',desc:'+1 proj, +1 pierce',apply:p=>{p.projAdd+=1;p.pierceAdd+=1;}},
  {id:'regen',name:'Regen Field',desc:'+3 regen/s',apply:p=>{p.regen+=3;}},
  {id:'thorns',name:'Thorned Plating',desc:'+20 thorns, +4 armor',apply:p=>{p.thorns+=20;p.armor+=4;}},
  {id:'berserk',name:'Berserker Soul',desc:'+40% dmg below 40% HP',apply:p=>{p.berserk=true;}},
];

/* -------------------- META -------------------- */
const STORAGE_KEY='neon_survivor_meta_v3';

function defaultData(){
  return {
    credits:0, prestige:0, ascension:0,
    classId:'soldier', classOwned:['soldier'],
    shopOwned:[], weaponMastery:{}, minimapLevel:0,
    relicSlots:1, relicsOwned:[], itemsDiscovered:[],
    dailyQuests:[], dailyProgress:{}, dailyDate:'',
    stats:{ totalKills:0, totalRuns:0, totalBosses:0, bestTime:0, bestWave:0, bestLevel:0, bestScore:0, totalCredits:0, totalPlaytime:0 }
  };
}

function genDaily(){
  const pool=[
    {id:'dk',name:'Kill 50 enemies',target:50,reward:40,type:'kills'},
    {id:'db',name:'Defeat 1 boss',target:1,reward:60,type:'bosses'},
    {id:'dt',name:'Survive 3 minutes',target:180,reward:50,type:'time'},
    {id:'dl',name:'Reach level 10',target:10,reward:45,type:'level'},
    {id:'dw',name:'Reach wave 5',target:5,reward:55,type:'wave'},
    {id:'dab',name:'Use 10 abilities',target:10,reward:35,type:'abilities'},
  ];
  const shuffled=pool.slice().sort(()=>Math.random()-0.5);
  return shuffled.slice(0,4);
}

const Meta={
  data:defaultData(),
  load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){const parsed=JSON.parse(raw);this.data=Object.assign(defaultData(),parsed);
        if(!this.data.stats)this.data.stats=defaultData().stats;}
    }catch(e){console.warn('Meta load failed',e);}
  },
  save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(this.data));}catch(e){}
  },
  clearData(){
    this.data=defaultData();
    this.save();
  },
  spendCredits(n){
    if(this.data.credits>=n){this.data.credits-=n;this.save();return true;}
    return false;
  },
  addCredits(n){
    this.data.credits+=n;
    this.data.stats.totalCredits=(this.data.stats.totalCredits||0)+n;
    this.save();
  },
  buyShopItem(id){
    const it=(window.SHOP_ITEMS||[]).find(s=>s.id===id);
    if(!it||this.data.shopOwned.includes(id))return false;
    if(!this.spendCredits(it.cost))return false;
    this.data.shopOwned.push(id);
    if(id.startsWith('minimap'))this.data.minimapLevel++;
    if(id==='relic_slot')this.data.relicSlots++;
    this.save();return true;
  },
  applyRunStart(P){
    // class
    const cls=(window.CLASSES||[]).find(c=>c.id===this.data.classId)||window.CLASSES[0];
    if(cls&&cls.apply)cls.apply(P);
    // shop bonuses
    const owned=this.data.shopOwned;
    if(owned.includes('magnet_up'))P.pickupBonus+=0.25;
    if(owned.includes('hp_up')){P.maxhp+=30;P.hp+=30;}
    if(owned.includes('dmg_up'))P.dmgMul*=1.10;
    if(owned.includes('rate_up'))P.fireRateMul*=1.10;
    if(owned.includes('speed_up'))P.moveMul*=1.12;
    if(owned.includes('armor_up'))P.armor+=3;
    if(owned.includes('regen_up'))P.regen+=1.0;
    if(owned.includes('crit_up'))P.crit=Math.min(0.95,P.crit+0.05);
    if(owned.includes('luck_up'))P.luck+=3;
    if(owned.includes('dash_charge')){P.dashMax++;P.dashCharges++;}
    if(owned.includes('cdr'))P.abilityCDmul=(P.abilityCDmul||1)*0.85;
    if(owned.includes('drone_dmg'))P.droneDmgMul*=1.30;
    if(owned.includes('overdrive'))P.odBonus=(P.odBonus||0)+0.08;
    // prestige & ascension bonuses
    P.dmgMul*=1+this.data.prestige*0.04;
    P.maxhp*=1+this.data.prestige*0.03;P.hp=P.maxhp;
    P.xpMul*=1+this.data.ascension*0.05;
  },
  applyRelics(P,ids){
    (ids||[]).forEach(id=>{const r=(window.RELIC_POOL||[]).find(x=>x.id===id);if(r&&r.apply)r.apply(P);});
  },
  endRun(res){
    // res: {kills,bossesKilled,gameTime,level,score,weapon,loot,challengeCredits}
    const credMul=(res.challengeCredits||1);
    const earned=Math.round((res.score*0.05+res.kills*0.5+res.bossesKilled*15+res.gameTime*0.2+res.level*3)*credMul*(1+this.data.prestige*0.1));
    this.addCredits(earned);
    // weapon mastery
    const wk=String(res.weapon);
    const m=this.data.weaponMastery[wk]||{level:1,xp:0};
    m.xp+=res.kills+res.bossesKilled*20;
    while(m.xp>=m.level*100){m.xp-=m.level*100;m.level++;}
    this.data.weaponMastery[wk]=m;
    // stats
    const s=this.data.stats;
    s.totalKills+=res.kills;s.totalRuns++;s.totalBosses+=res.bossesKilled;
    s.bestTime=Math.max(s.bestTime||0,res.gameTime);
    s.bestWave=Math.max(s.bestWave||0,res.wave||0);
    s.bestLevel=Math.max(s.bestLevel||0,res.level);
    s.bestScore=Math.max(s.bestScore||0,res.score);
    s.totalPlaytime=(s.totalPlaytime||0)+res.gameTime;
    // daily progress
    this._updateDaily('kills',res.kills);
    this._updateDaily('bosses',res.bossesKilled);
    this._updateDaily('time',res.gameTime);
    this._updateDaily('level',res.level);
    this._updateDaily('wave',res.wave||0);
    this.save();
    return earned;
  },
  _updateDaily(type,val){
    if(!this.data.dailyQuests)return;
    this.data.dailyQuests.forEach(q=>{
      if(q.type===type){
        this.data.dailyProgress[q.id]=Math.min(q.target,(this.data.dailyProgress[q.id]||0)+val);
      }
    });
  },
  trackAbility(){this._updateDaily('abilities',1);},
  ensureDaily(){
    const today=new Date().toDateString();
    if(this.data.dailyDate!==today){
      this.data.dailyDate=today;
      this.data.dailyQuests=genDaily();
      this.data.dailyProgress={};
      this.save();
    }
  },
  claimDailyRewards(){
    let total=0;
    this.ensureDaily();
    this.data.dailyQuests.forEach(q=>{
      const prog=this.data.dailyProgress[q.id]||0;
      if(prog>=q.target && !q.claimed){q.claimed=true;total+=q.reward;}
    });
    if(total>0){this.addCredits(total);this.save();}
    return total;
  },
  canAscend(){return (this.data.stats.bestLevel||0)>=40 && this.data.ascension<5;},
  doAscend(){
    if(!this.canAscend())return false;
    this.data.ascension++;this.data.credits+=500;
    this.save();return true;
  },
  canPrestige(){return this.data.prestige<10;}
  ,doPrestige(runInfo){
    if(!this.canPrestige())return false;
    const gt=runInfo?.gameTime||0,lv=runInfo?.level||0;
    if(gt<300&&lv<20)return false;
    this.data.prestige++;this.data.credits+=200;
    // reset run-progression but keep prestige/ascension
    this.data.shopOwned=[];this.data.weaponMastery={};this.data.minimapLevel=0;
    this.data.relicSlots=1;this.data.relicsOwned=[];
    this.data.classOwned=['soldier'];this.data.classId='soldier';
    this.save();return true;
  }
};
Meta.load();
window.Meta=Meta;

/* expose for shell via postMessage query */
window.NeonMeta=Meta;

/* ============================================================
   postMessage BRIDGE — talk to the parent React shell
   ============================================================ */
const Bridge={
  embedded: (window.parent !== window),
  lastHud: 0,
  init(){
    if(this.embedded) document.body.classList.add('embedded');
    // wrap updateHUD to broadcast state ~10/s
    if(typeof window.updateHUD==='function'){
      const _uh=window.updateHUD;
      window.updateHUD=function(){
        _uh.apply(this,arguments);
        Bridge.maybeBroadcast();
      };
    } else {
      // poll until updateHUD exists
      const iv=setInterval(()=>{ if(typeof window.updateHUD==='function'){
        const _uh=window.updateHUD;
        window.updateHUD=function(){_uh.apply(this,arguments);Bridge.maybeBroadcast();};
        clearInterval(iv);
      }},200);
    }
    // wrap key events
    this.wrap('gameOver');
    this.wrap('spawnBoss');
    this.wrap('openLevelUp');
    this.wrap('maybeOfferRelic');
    this.wrap('popAch');
    this.wrap('startGame');
    this.wrap('togglePause');
    // listen for commands from parent
    window.addEventListener('message',e=>Bridge.onMessage(e.data));
    // announce ready
    this.send({type:'ready'});
  },
  wrap(name){
    const t=setInterval(()=>{
      if(typeof window[name]==='function'){
        const orig=window[name];
        window[name]=function(){
          const r=orig.apply(this,arguments);
          try{
            Bridge.send({type:'event',event:name,args:Bridge.sanitizeArgs(arguments)});
            // after key lifecycle events, broadcast a fresh hud snapshot so
            // the parent sees the new state immediately (e.g. gameOver → over=true)
            if(name==='gameOver'||name==='startGame'||name==='togglePause'){
              Bridge.lastHud=0; // force immediate broadcast
              Bridge.maybeBroadcast();
            }
          }catch(_){}
          return r;
        };
        clearInterval(t);
      }
    },150);
  },
  sanitizeArgs(args){
    try{
      const out=[];
      for(let i=0;i<Math.min(args.length,2);i++){
        const a=args[i];
        if(a&&typeof a==='object'){
          if(a.def&&a.def.name)out.push({name:a.def.name,boss:!!a.boss,hp:a.hp,maxhp:a.maxhp});
          else out.push('[obj]');
        } else out.push(a);
      }
      return out;
    }catch(_){return [];}
  },
  maybeBroadcast(){
    const t=performance.now();
    if(t-this.lastHud<100)return; // throttle to 10/s
    this.lastHud=t;
    try{
      const G=window.G, P=window.P;
      if(!G||!P)return;
      const payload={
        type:'hud',
        hp:Math.ceil(P.hp),maxhp:Math.ceil(P.maxhp),
        xp:P.xp,xpNext:P.xpNext,level:P.level,
        wave:G.wave,kills:G.kills,gameTime:G.gameTime,dps:G.dps,score:G.score,
        mode:G.mode,running:G.running,paused:G.paused,over:G.over,
        bossesKilled:G.bossesKilled,
        weapon: window.WEAPONS?(window.WEAPONS[P.weapon]||{}).name:'',
        weaponIdx:P.weapon,
        abilities:(P.abilityCD||[]).slice(0,9),
        abilityMax: window.ABILITIES?window.ABILITIES.map(a=>a.cd):[],
        boss: G.bossActive?{name:G.bossActive.def?G.bossActive.def.name:'BOSS',hp:G.bossActive.hp,maxhp:G.bossActive.maxhp}:null,
        relics: P.relics||[],
        drones: window.drones?window.drones.length:0,
        skillPoints: G.skillPoints
      };
      this.send(payload);
    }catch(_){}
  },
  send(msg){
    try{
      if(this.embedded) window.parent.postMessage(Object.assign({source:'neon-survivor'},msg),'*');
    }catch(_){}
  },
  onMessage(msg){
    if(!msg||msg.target!=='neon-survivor')return;
    try{
      switch(msg.action){
        case 'start':
          if(typeof window.startGame==='function'){
            if(window.Audio&&window.Audio.init)window.Audio.init();
            if(window.Audio&&window.Audio.resume)window.Audio.resume();
            if(window.Audio)window.Audio.started=true;
            window.startGame(msg.mode||'endless');
          }
          break;
        case 'pause':
          if(window.G&&G.running&&!G.paused&&typeof window.togglePause==='function')window.togglePause();
          break;
        case 'resume':
          if(window.G&&G.running&&G.paused&&typeof window.togglePause==='function')window.togglePause();
          break;
        case 'quit':
          if(window.G&&typeof window.gameOver==='function'&&!G.over){G.over=true;G.running=false;window.gameOver();}
          else if(window.G){G.running=false;G.paused=false;
            ['menu','gameover','pause','levelup','skilltree','shop','classes','daily','challenges','blackmarket','relicpick'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.remove('show');});
            const m=document.getElementById('menu');if(m)m.classList.add('show');}
          break;
        case 'queryMeta':
          this.send({type:'meta',data:Meta.data});
          break;
        case 'reloadMeta':
          Meta.load();
          this.send({type:'meta',data:Meta.data});
          break;
        case 'focus':
          window.focus();
          break;
        case 'settings':
          Bridge.applySettings(msg.settings);
          break;
        case 'setMap':
          Bridge.applyMap(msg.mapId);
          break;
        case 'netConnect':
          if(window.Net){
            const name=msg.name||'Player';
            const code=msg.code||undefined;
            Net.connect(name,code);
            window._netLobbyCb=(m)=>{
              if(m&&m.type==='created'&&window.notify){
                notify('Room code: '+m.code,'var(--cyan)');
              }
            };
          }
          break;
      }
    }catch(_){}
  },
  applySettings(s){
    if(!s)return;
    // audio volumes
    if(window.Audio){
      if(s.masterVolume!=null&&Audio.master)Audio.master.gain.value=s.masterVolume;
      if(s.musicVolume!=null&&Audio.musicGain)Audio.musicGain.gain.value=s.musicVolume;
      if(s.sfxVolume!=null&&Audio.sfxGain)Audio.sfxGain.gain.value=s.sfxVolume;
    }
    // bloom
    if(s.bloom!=null&&window.R){R.bloom=!!s.bloom;}
    // scanlines
    if(s.scanlines!=null){const el=document.getElementById('scanlines');if(el)el.style.display=s.scanlines?'':'none';}
    // pixel mode: low-res retro aesthetic
    if(s.pixelMode!=null){
      const pg=document.getElementById('pixelgrid');if(pg)pg.style.display=s.pixelMode?'':'none';
      if(window.R&&s.pixelMode){R.dpr=0.5;R.resize();}
      else if(window.R){R.dpr=Math.min(window.devicePixelRatio||1,1.75);R.resize();}
    }
    // screen shake global flag
    if(s.screenShake!=null&&window.G){G.noShake=!s.screenShake;}
    // damage numbers
    if(s.damageNumbers!=null&&window.G){G.noDmgNum=!s.damageNumbers;}
    // reduced motion
    if(s.reducedMotion!=null&&window.G){G.reducedMotion=!!s.reducedMotion;}
    // particle quality: low=0.3, medium=0.6, high=1.0
    if(s.particleQuality&&window.G){
      const m={low:0.3,medium:0.6,high:1};G.particleMul=m[s.particleQuality]||1;
    }
    // automation: auto-abilities, auto-upgrade
    if(s.autoAbilities!=null&&window.G){G.autoAbilities=!!s.autoAbilities;}
    if(s.autoUpgrade!=null&&window.G){G.autoUpgrade=!!s.autoUpgrade;}
  },
  applyMap(mapId){
    if(!mapId||!window.G)return;
    G.mapId=mapId;
    const themes={
      neon_grid:       {base:'#0a0618',ground:'#1a0530',grid:'rgba(34,230,255,0.2)',fog:'rgba(122,17,72,0.5)',gridLine:'22e6ff',fogColor:[0.48,0.07,0.28],gridAlpha:1.0},
      crimson_wastes:  {base:'#120300',ground:'#1a0800',grid:'rgba(255,59,92,0.2)',fog:'rgba(255,59,92,0.4)',gridLine:'ff3b5c',fogColor:[1.0,0.23,0.36],gridAlpha:1.0},
      void_depths:     {base:'#04011a',ground:'#06021a',grid:'rgba(155,92,255,0.15)',fog:'rgba(155,92,255,0.3)',gridLine:'9b5cff',fogColor:[0.61,0.36,1.0],gridAlpha:0.8},
      toxic_sewers:    {base:'#020d04',ground:'#040d08',grid:'rgba(67,255,158,0.2)',fog:'rgba(67,255,158,0.35)',gridLine:'43ff9e',fogColor:[0.26,1.0,0.62],gridAlpha:1.0},
      frozen_core:     {base:'#030a14',ground:'#060d18',grid:'rgba(120,200,255,0.2)',fog:'rgba(120,200,255,0.3)',gridLine:'78c8ff',fogColor:[0.47,0.78,1.0],gridAlpha:1.0},
      solar_flare:     {base:'#0e0a00',ground:'#1a1000',grid:'rgba(255,226,74,0.25)',fog:'rgba(255,226,74,0.3)',gridLine:'ffe24a',fogColor:[1.0,0.89,0.29],gridAlpha:1.0},
    };
    const t=themes[mapId]||themes.neon_grid;
    G.mapTheme=t;
    // Apply sky background via clearColor
    if(window.R&&R.gl){
      const gc=t.ground;
      const r=parseInt(gc.slice(1,3),16)/255;
      const g=parseInt(gc.slice(3,5),16)/255;
      const b=parseInt(gc.slice(5,7),16)/255;
      R.gl.clearColor(r,g,b,0);
    }
  }
};
window.NeonBridge=Bridge;
// init after DOM ready
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>Bridge.init());
else Bridge.init();

// helper for game to notify shell of ability use (for daily tracking)
window.addEventListener('keydown',e=>{
  if(e.key>='1'&&e.key<='9'&&window.G&&G.running){
    try{Meta.trackAbility();}catch(_){}
  }
});

/* modelManager stub for boss model key mapping */
window.modelManager={bossKeyForIndex:function(idx){return idx<2?'boss':'boss_extra';}};
window.onGraphicsReady=function(){};
})();
