import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { STATIONS } from '../../data/stationContent.js';
import BalanceScaleLab from '../simulations/BalanceScaleLab.jsx';
import SideBySideSolver from '../simulations/SideBySideSolver.jsx';
import PickAndProve from '../simulations/PickAndProve.jsx';
import { stationLearnNarration } from '../../utils/narration.js';
import { narrate } from '../../utils/audio.js';

export default function SimulatePhase({
  onNext,
  audioEnabled,
  completedStations = [false, false, false],
  setCompletedStations,
  onSimulationsComplete,
}) {
  const [stationIdx, setStationIdx] = useState(0);

  const handleStationComplete = (index) => {
    const updated = [...completedStations];
    updated[index] = true;
    if (setCompletedStations) setCompletedStations(updated);

    if (index < 2) {
      setStationIdx(index + 1);
      narrate(stationLearnNarration(index + 1), audioEnabled);
    } else {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
      if (onSimulationsComplete) onSimulationsComplete();
    }
  };

  const allDone = completedStations.slice(0, 3).every(Boolean);

  return (
    <div className="phase-container simulate-phase">
      <div className="glass-card simulate-main-card phase-card">
        {/* Phase Header */}
        <div className="simulate-phase-top-bar">
          <div className="simulate-title-group">
            <span className="phase-tag">PHASE 3 — SIMULATE</span>
            <h2 className="simulate-main-title">The Method Comparison Laboratory</h2>
            <p className="simulate-tagline">
              Master the 3 core mathematical discoveries before entering the Practice challenges! Complete each lab station to earn the Balance Builder badge.
            </p>
          </div>

          {/* 3 Stations Hub Tabs */}
          <div className="simulate-stations-hub">
            {STATIONS.map((st, i) => {
              const isActive = i === stationIdx;
              const isDone = completedStations[i];
              return (
                <div
                  key={st.id}
                  className={`station-hub-card ${isActive ? 'is-active-station' : ''} ${isDone ? 'is-station-done' : ''}`}
                  onClick={() => {
                    setStationIdx(i);
                    narrate(stationLearnNarration(i), audioEnabled);
                  }}
                >
                  <div className="station-card-icon-row">
                    <span className="station-icon-badge">{st.icon}</span>
                    <span className="station-tag-label">{st.tag}</span>
                    {isDone && <CheckCircle size={16} className="done-check-icon" />}
                  </div>
                  <h4 className="station-hub-name">{st.name}</h4>
                  <p className="station-hub-desc">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Station Stage */}
        <div className="simulation-active-stage">
          {stationIdx === 0 && (
            <BalanceScaleLab
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(0)}
            />
          )}

          {stationIdx === 1 && (
            <SideBySideSolver
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(1)}
            />
          )}

          {stationIdx === 2 && (
            <PickAndProve
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(2)}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            onClick={onNext}
            style={{
              background: allDone
                ? 'linear-gradient(135deg, #00e676, #00e5ff)'
                : 'linear-gradient(135deg, #00e5ff, #3f51b5)',
            }}
          >
            <span>{allDone ? 'Proceed to 100 Practice Challenges!' : 'Jump to Practice'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

