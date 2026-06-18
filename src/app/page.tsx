'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import CyberBackground from '@/components/neon/CyberBackground';
import PlayScreen from '@/components/neon/PlayScreen';
import {
  LandingScreen, MainMenu, StatsScreen, ArsenalScreen, BestiaryScreen,
  AchievementsScreen, ShopScreen, ClassesScreen, DailyScreen,
  ChallengesScreen, NewsScreen, HowToScreen, SettingsScreen,
} from '@/components/neon/screens';

type Screen = 'landing' | 'menu' | 'play' | 'stats' | 'arsenal' | 'bestiary' | 'achievements' | 'shop' | 'classes' | 'daily' | 'challenges' | 'news' | 'howto' | 'settings';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<string>('endless');

  const play = useCallback((m: string) => { setMode(m); setScreen('play'); }, []);
  const back = useCallback(() => setScreen('menu'), []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* animated background — hidden during active play to save GPU for the game */}
      {screen !== 'play' && <CyberBackground intensity={1} />}

      {/* scanlines + vignette overlay */}
      {screen !== 'play' && <div className="neon-scanlines" />}

      {/* content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <LandingScreen key="landing" onEnter={() => setScreen('menu')} />
          )}
          {screen === 'menu' && (
            <MainMenu key="menu" onPlay={play} onNav={s => setScreen(s as Screen)} />
          )}
          {screen === 'stats' && <StatsScreen key="stats" onBack={back} />}
          {screen === 'arsenal' && <ArsenalScreen key="arsenal" onBack={back} />}
          {screen === 'bestiary' && <BestiaryScreen key="bestiary" onBack={back} />}
          {screen === 'achievements' && <AchievementsScreen key="ach" onBack={back} />}
          {screen === 'shop' && <ShopScreen key="shop" onBack={back} />}
          {screen === 'classes' && <ClassesScreen key="classes" onBack={back} />}
          {screen === 'daily' && <DailyScreen key="daily" onBack={back} />}
          {screen === 'challenges' && (
            <ChallengesScreen key="ch" onBack={back} onStart={() => play('endless')} />
          )}
          {screen === 'news' && <NewsScreen key="news" onBack={back} />}
          {screen === 'howto' && <HowToScreen key="howto" onBack={back} />}
          {screen === 'settings' && <SettingsScreen key="settings" onBack={back} />}
        </AnimatePresence>

        {screen === 'play' && (
          <PlayScreen mode={mode} onExit={() => setScreen('menu')} />
        )}
      </div>
    </main>
  );
}
