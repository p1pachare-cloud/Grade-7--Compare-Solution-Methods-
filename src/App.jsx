import React, { useState, useEffect, useCallback } from 'react';
import { Home, BookOpen, Volume2, VolumeX } from 'lucide-react';
import FloatingGeometry from './components/FloatingGeometry.jsx';
import JourneyBar from './components/JourneyBar.jsx';
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PracticePhase from './components/phases/PracticePhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import FormulaPanel from './components/shared/FormulaPanel.jsx';
import { checkBadges } from './utils/badgeEngine.js';
import { stopNarration, setMuted } from './utils/audio.js';

const STORAGE_KEY = 'intellia_g7_compare_methods_v1';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [worldScores, setWorldScores] = useState(Array(10).fill(null));
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [completedStations, setCompletedStations] = useState([false, false, false]);
  const [errorDetectiveCount, setErrorDetectiveCount] = useState(0);
  const [efficiencyCount, setEfficiencyCount] = useState(0);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [phaseComplete, setPhaseComplete] = useState({
    wonder: false,
    story: false,
    simulate: false,
    practice: false,
    reflect: false,
  });

  // Stop any voice narration on mount
  useEffect(() => {
    stopNarration();
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 86400000) {
          if (parsed.phase) setPhase(parsed.phase);
          if (parsed.xp) setXp(parsed.xp);
          if (parsed.streak) setStreak(parsed.streak);
          if (parsed.maxStreak) setMaxStreak(parsed.maxStreak);
          if (parsed.worldScores) setWorldScores(parsed.worldScores);
          if (parsed.unlockedBadges) setUnlockedBadges(parsed.unlockedBadges);
          if (parsed.phaseComplete) setPhaseComplete(parsed.phaseComplete);
          if (parsed.completedStations) setCompletedStations(parsed.completedStations);
        }
      }
    } catch (e) {
      console.warn('Session restore failed:', e);
    }
  }, []);

  // Save session state on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          phase,
          xp,
          streak,
          maxStreak,
          worldScores,
          unlockedBadges,
          phaseComplete,
          completedStations,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Session save failed:', e);
    }
  }, [phase, xp, streak, maxStreak, worldScores, unlockedBadges, phaseComplete, completedStations]);

  // Check and unlock badges automatically
  useEffect(() => {
    const currentState = {
      phaseComplete,
      completedStations,
      worldScores: worldScores.map((s) => s || 0),
      maxStreak,
      unlockedBadges,
      errorDetectiveCount,
      efficiencyCount,
    };
    const newBadges = checkBadges(currentState);
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges]);
    }
  }, [phaseComplete, completedStations, worldScores, maxStreak, errorDetectiveCount, efficiencyCount, unlockedBadges]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setMuted(next);
      setAudioEnabled(!next);
      return next;
    });
  }, []);

  const goHome = useCallback(() => {
    stopNarration();
    setPhase('intro');
  }, []);

  const handleNextPhase = (nextPhaseName) => {
    stopNarration();

    if (phase === 'wonder') setPhaseComplete((p) => ({ ...p, wonder: true }));
    if (phase === 'story') setPhaseComplete((p) => ({ ...p, story: true }));
    if (phase === 'simulate') setPhaseComplete((p) => ({ ...p, simulate: true }));
    if (phase === 'practice') setPhaseComplete((p) => ({ ...p, practice: true }));

    setPhase(nextPhaseName);
  };

  return (
    <div className="app-container">
      <FloatingGeometry />

      {/* Top Header Controls */}
      <div className="top-header-controls">
        {phase !== 'intro' && (
          <button className="home-btn" onClick={goHome} title="Return to Intro">
            <Home size={18} />
            <span>Home</span>
          </button>
        )}

        <div className="top-right-actions">
          <button
            className={`top-mute-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute voice and sound effects' : 'Mute voice and sound effects'}
            aria-label={isMuted ? 'Unmute voice and sound effects' : 'Mute voice and sound effects'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {phase !== 'intro' && (
            <button
              className="top-glossary-btn"
              onClick={() => setIsGlossaryOpen(true)}
              title="Open Method Glossary"
            >
              <BookOpen size={18} />
              <span>Method Cards</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Journey Bar */}
      <JourneyBar
        currentPhase={phase}
        onSelectPhase={(selectedPhase) => {
          stopNarration();
          setPhase(selectedPhase);
        }}
        completedPhases={phaseComplete}
      />

      {/* Method Cards Glossary Drawer */}
      <FormulaPanel
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Main Content Stage */}
      <main className="main-stage">
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            onSelectPhase={(targetPhase) => {
              stopNarration();
              setPhase(targetPhase);
            }}
          />
        )}

        {phase === 'wonder' && (
          <WonderPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('story')}
          />
        )}

        {phase === 'story' && (
          <StoryPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('simulate')}
          />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('practice')}
            completedStations={completedStations}
            setCompletedStations={setCompletedStations}
            onSimulationsComplete={() => {
              setPhaseComplete((p) => ({ ...p, simulate: true }));
            }}
          />
        )}

        {phase === 'practice' && (
          <PracticePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('reflect')}
            xp={xp}
            setXp={setXp}
            streak={streak}
            setStreak={setStreak}
            maxStreak={maxStreak}
            setMaxStreak={setMaxStreak}
            worldScores={worldScores}
            setWorldScores={setWorldScores}
            onErrorDetectiveSolved={() => setErrorDetectiveCount((prev) => prev + 1)}
            onEfficiencySolved={() => setEfficiencyCount((prev) => prev + 1)}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            audioEnabled={audioEnabled}
            onRestart={() => {
              stopNarration();
              setPhase('intro');
            }}
            xp={xp}
            worldScores={worldScores}
            unlockedBadges={unlockedBadges}
          />
        )}
      </main>
    </div>
  );
}

