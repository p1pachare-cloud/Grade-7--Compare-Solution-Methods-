import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Layers, Sparkles, RefreshCw } from 'lucide-react';
import { playChime, playClick, playBuzz } from '../../utils/audio.js';

const ROUNDS_DATA = [
  {
    title: 'Round 1: Equations · 3x + 5 = 20',
    family: 'Equations',
    problem: 'Solve 3x + 5 = 20',
    methodAName: 'Algebraic Balance (Sarah)',
    methodBName: 'Arithmetic Reverse (Mike)',
    steps: [
      { id: 'a1', method: 'A', text: 'Subtract 5 from both sides: 3x = 15', twinId: 'b1' },
      { id: 'a2', method: 'A', text: 'Divide both sides by 3: x = 5', twinId: 'b2' },
      { id: 'b1', method: 'B', text: 'Undo +5: subtract 5 from 20 = 15', twinId: 'a1' },
      { id: 'b2', method: 'B', text: 'Undo ×3: divide 15 into 3 groups = 5', twinId: 'a2' },
      { id: 'd1', method: 'decoy', text: 'Add 5 to 20: 20 + 5 = 25 (Decoy Step)' },
    ],
    decoyReason: '⚠️ Decoy rejected! Adding 5 adds more tokens instead of undoing the admission fee.',
  },
  {
    title: 'Round 2: Proportions · 4 Cups Feeds 6 People',
    family: 'Proportions',
    problem: 'Find cups needed for 15 people',
    methodAName: 'Unit Rate Method (Priya)',
    methodBName: 'Scale Factor Method (Yuki)',
    steps: [
      { id: 'a1', method: 'A', text: 'Find unit rate: 4 ÷ 6 = 2/3 cup per person', twinId: 'b1' },
      { id: 'a2', method: 'A', text: 'Multiply for 15 people: 15 × 2/3 = 10 cups', twinId: 'b2' },
      { id: 'b1', method: 'B', text: 'Find scale factor: 15 ÷ 6 = 2.5× guests', twinId: 'a1' },
      { id: 'b2', method: 'B', text: 'Scale ingredients: 4 × 2.5 = 10 cups', twinId: 'a2' },
      { id: 'd1', method: 'decoy', text: 'Add 15 − 6 = 9 extra cups to 4 = 13 cups (Decoy Step)' },
    ],
    decoyReason: '⚠️ Additive misconception rejected! Ratios must be scaled multiplicatively, not by simple subtraction/addition.',
  },
  {
    title: 'Round 3: Percents · 25% Off 80 Tokens',
    family: 'Percents',
    problem: 'Find final price after 25% discount',
    methodAName: 'Bar Model / Benchmark (Emma)',
    methodBName: 'Decimal Multiplier (Noah)',
    steps: [
      { id: 'a1', method: 'A', text: 'Find 25% (one quarter of 80): 80 ÷ 4 = 20 tokens off', twinId: 'b1' },
      { id: 'a2', method: 'A', text: 'Subtract discount from total: 80 − 20 = 60 tokens', twinId: 'b2' },
      { id: 'b1', method: 'B', text: 'Find percent paid: 100% − 25% = 75% (0.75)', twinId: 'a1' },
      { id: 'b2', method: 'B', text: 'Multiply by decimal: 0.75 × 80 = 60 tokens', twinId: 'a2' },
      { id: 'd1', method: 'decoy', text: 'Subtract 25 tokens from 80 = 55 tokens (Decoy Step)' },
    ],
    decoyReason: '⚠️ Base error rejected! 25% means 25 out of every 100, not 25 tokens subtracted directly from the price.',
  },
];

export default function SideBySideSolver({ audioEnabled, onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [placedA, setPlacedA] = useState([]);
  const [placedB, setPlacedB] = useState([]);
  const [decoyAlert, setDecoyAlert] = useState(null);

  const currentRound = ROUNDS_DATA[roundIdx];

  const handleCardClick = (step) => {
    playClick();
    if (step.method === 'decoy') {
      playBuzz();
      setDecoyAlert(currentRound.decoyReason);
      return;
    }

    setDecoyAlert(null);
    if (step.method === 'A') {
      if (!placedA.includes(step.id)) {
        const next = [...placedA, step.id];
        setPlacedA(next);
        if (next.length === 2 && placedB.length === 2) playChime();
      }
    } else if (step.method === 'B') {
      if (!placedB.includes(step.id)) {
        const next = [...placedB, step.id];
        setPlacedB(next);
        if (placedA.length === 2 && next.length === 2) playChime();
      }
    }
  };

  const handleResetRound = () => {
    playClick();
    setPlacedA([]);
    setPlacedB([]);
    setDecoyAlert(null);
  };

  const isRoundComplete = placedA.length === 2 && placedB.length === 2;

  const handleNextRound = () => {
    playChime();
    if (roundIdx < ROUNDS_DATA.length - 1) {
      setRoundIdx((prev) => prev + 1);
      setPlacedA([]);
      setPlacedB([]);
      setDecoyAlert(null);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Top Banner */}
      <div className="gradual-release-banner" style={{ width: '100%' }}>
        <div className="release-stage-pill">
          <Layers size={18} color="#00e5ff" />
          <span>Station B · Side-by-Side Twin Step Matching</span>
        </div>
        <div style={{ color: '#ffd54f', fontSize: '0.88rem', fontWeight: 800 }}>
          {currentRound.title}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.6rem' }}>
          {currentRound.problem}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Tap the steps below to place them into the correct method column. Reject any decoy steps!
        </p>
      </div>

      {/* Available Cards Pool */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 840 }}>
        {currentRound.steps.map((s) => {
          const isPlaced = placedA.includes(s.id) || placedB.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => handleCardClick(s)}
              disabled={isPlaced}
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                background: isPlaced ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.09)',
                border: isPlaced ? '1.5px dashed rgba(255,255,255,0.15)' : '1.5px solid rgba(255,255,255,0.22)',
                color: isPlaced ? 'rgba(255,255,255,0.3)' : '#ffffff',
                cursor: isPlaced ? 'default' : 'pointer',
                fontSize: '0.92rem',
                fontWeight: 600,
                boxShadow: isPlaced ? 'none' : '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              {s.text}
            </button>
          );
        })}
      </div>

      {/* Decoy Alert */}
      {decoyAlert && (
        <div style={{ background: 'rgba(255, 112, 67, 0.15)', border: '1px solid #ff7043', padding: '10px 20px', borderRadius: 10, color: '#ff7043', fontWeight: 700, fontSize: '0.9rem', maxWidth: 720, textAlign: 'center' }}>
          {decoyAlert}
        </div>
      )}

      {/* Two Side-by-Side Method Columns with Glowing Twin Connectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 840, marginTop: 10 }}>
        {/* Method A Column */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 18, padding: 20, border: '1.5px solid rgba(0,229,255,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ color: '#00e5ff', fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
              {currentRound.methodAName}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#00e5ff', background: 'rgba(0,229,255,0.15)', padding: '2px 8px', borderRadius: 999 }}>
              {placedA.length}/2 Steps Placed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {placedA.map((id, idx) => {
              const step = currentRound.steps.find((s) => s.id === id);
              return (
                <div key={id} style={{ background: 'rgba(0,229,255,0.15)', border: '1.5px solid #00e5ff', padding: 12, borderRadius: 10, fontSize: '0.9rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#ffd54f', fontWeight: 800 }}>Step {idx + 1}:</span>
                  <span>{step.text}</span>
                </div>
              );
            })}
            {placedA.length < 2 && (
              <div style={{ border: '1.5px dashed rgba(255,255,255,0.15)', padding: 14, borderRadius: 10, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tap Method A cards above
              </div>
            )}
          </div>
        </div>

        {/* Method B Column */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 18, padding: 20, border: '1.5px solid rgba(255,213,79,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
              {currentRound.methodBName}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#ffd54f', background: 'rgba(255,213,79,0.15)', padding: '2px 8px', borderRadius: 999 }}>
              {placedB.length}/2 Steps Placed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {placedB.map((id, idx) => {
              const step = currentRound.steps.find((s) => s.id === id);
              return (
                <div key={id} style={{ background: 'rgba(255,213,79,0.15)', border: '1.5px solid #ffd54f', padding: 12, borderRadius: 10, fontSize: '0.9rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#00e5ff', fontWeight: 800 }}>Step {idx + 1}:</span>
                  <span>{step.text}</span>
                </div>
              );
            })}
            {placedB.length < 2 && (
              <div style={{ border: '1.5px dashed rgba(255,255,255,0.15)', padding: 14, borderRadius: 10, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tap Method B cards above
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Twin Threads Connecting Banner */}
      {isRoundComplete && (
        <div style={{ width: '100%', maxWidth: 840, background: 'rgba(0, 230, 118, 0.15)', border: '1.5px solid #00e676', padding: 16, borderRadius: 14, textAlign: 'center', color: '#00e676', fontWeight: 800 }}>
          <Sparkles size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          <span>Both paths verified! Every step in Method A directly corresponds to its twin step in Method B!</span>
        </div>
      )}

      {/* Footer Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 840, marginTop: 10 }}>
        <button className="btn-secondary" onClick={handleResetRound}>
          <RefreshCw size={15} />
          <span>Reset Steps</span>
        </button>

        {isRoundComplete && (
          <button className="btn-primary" onClick={handleNextRound}>
            <span>{roundIdx < ROUNDS_DATA.length - 1 ? 'Next Comparison Round' : 'Complete Station B!'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
