import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Zap, Clock, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { playChime, playClick, playBuzz } from '../../utils/audio.js';

const ROUNDS_C = [
  {
    title: 'Round 1: Distribute Form · 4(x + 3) = 36',
    problem: 'Solve 4(x + 3) = 36',
    methods: [
      {
        id: 'divide',
        title: 'Sofia’s Divide-First Method',
        stepsCount: 2,
        steps: ['1. Divide both sides by 4: x + 3 = 9', '2. Subtract 3 from both sides: x = 6'],
        isBest: true,
        reason: '36 divides by 4 into an exact integer (9), cutting out an entire calculation step!',
      },
      {
        id: 'distribute',
        title: 'John’s Distribute-First Method',
        stepsCount: 3,
        steps: ['1. Distribute 4 into bracket: 4x + 12 = 36', '2. Subtract 12: 4x = 24', '3. Divide by 4: x = 6'],
        isBest: false,
        reason: 'Valid and accurate, but requires 3 operations instead of 2.',
      },
    ],
    reasonsOptions: [
      '36 divides cleanly by 4, saving an entire operation',
      'Distributing produces larger numbers that are harder to multiply',
      'Equations with brackets can never be multiplied first',
    ],
    correctReasonIdx: 0,
  },
  {
    title: 'Round 2: Proportions · 4 Tickets Cost 18 Tokens',
    problem: 'How much do 12 tickets cost?',
    methods: [
      {
        id: 'scale',
        title: 'Yuki’s Scale Factor Method',
        stepsCount: 2,
        steps: ['1. Find scale factor: 12 ÷ 4 = 3× tickets', '2. Multiply cost: 18 × 3 = 54 tokens'],
        isBest: true,
        reason: '12 is an exact whole multiple (3×) of 4, completely avoiding intermediate decimal fractions!',
      },
      {
        id: 'unit',
        title: 'Priya’s Unit Rate Method',
        stepsCount: 2,
        steps: ['1. Find unit rate: 18 ÷ 4 = 4.5 tokens per ticket', '2. Multiply by 12: 12 × 4.5 = 54 tokens'],
        isBest: false,
        reason: 'Requires calculating with decimal 4.5, which is more prone to calculation error.',
      },
    ],
    reasonsOptions: [
      '12 is an exact multiple of 4 (3×), avoiding decimal calculations',
      'Unit rates can only be calculated on whole prime numbers',
      'Scale factors always divide into zero',
    ],
    correctReasonIdx: 0,
  },
  {
    title: 'Round 3: Percents · 10% of 80 Tokens',
    problem: 'Calculate 10% of 80 tokens',
    methods: [
      {
        id: 'benchmark',
        title: 'Emma’s Mental Benchmark Method',
        stepsCount: 1,
        steps: ['1. 10% is one-tenth of the whole: 80 ÷ 10 = 8 tokens'],
        isBest: true,
        reason: 'One-tenth is an instant mental calculation step that takes 1 second!',
      },
      {
        id: 'decimal',
        title: 'Noah’s Column Multiplication Method',
        stepsCount: 3,
        steps: ['1. Convert 10% to decimal: 0.10', '2. Set up column multiplication: 80 × 0.10', '3. Shift decimal points: 8.0 tokens'],
        isBest: false,
        reason: 'Works on any calculator, but column decimals are slow for common benchmarks.',
      },
    ],
    reasonsOptions: [
      '10% is one-tenth, taking a single instant mental division step',
      'Column decimals are illegal in grade 7 math',
      'Benchmarks only work on multiples of 100',
    ],
    correctReasonIdx: 0,
  },
];

export default function PickAndProve({ audioEnabled, onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedReasonIdx, setSelectedReasonIdx] = useState(null);

  const currentRound = ROUNDS_C[roundIdx];

  const handleSelectMethod = (id) => {
    playClick();
    setSelectedMethodId(id);
    setSelectedReasonIdx(null);
    if (id === currentRound.methods.find((m) => m.isBest)?.id) {
      playChime();
    }
  };

  const handleSelectReason = (idx) => {
    playClick();
    setSelectedReasonIdx(idx);
    if (idx === currentRound.correctReasonIdx) {
      playChime();
    } else {
      playBuzz();
    }
  };

  const isRoundProved =
    selectedMethodId === currentRound.methods.find((m) => m.isBest)?.id &&
    selectedReasonIdx === currentRound.correctReasonIdx;

  const handleNextRound = () => {
    playChime();
    if (roundIdx < ROUNDS_C.length - 1) {
      setRoundIdx((prev) => prev + 1);
      setSelectedMethodId(null);
      setSelectedReasonIdx(null);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      {/* Top Banner */}
      <div className="gradual-release-banner" style={{ width: '100%' }}>
        <div className="release-stage-pill">
          <Zap size={18} color="#ffd54f" />
          <span>Station C · Efficiency &amp; Method Comparison</span>
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
          Select the most efficient method card, inspect the step count, and justify your choice!
        </p>
      </div>

      {/* Method Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 840 }}>
        {currentRound.methods.map((m) => {
          const isSelected = selectedMethodId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => handleSelectMethod(m.id)}
              style={{
                background: isSelected ? 'rgba(0, 229, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)',
                border: isSelected ? '2px solid #00e5ff' : '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 18,
                padding: 22,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: m.isBest ? '#00e676' : '#ffd54f',
                    background: m.isBest ? 'rgba(0,230,118,0.15)' : 'rgba(255,213,79,0.15)',
                    padding: '3px 10px',
                    borderRadius: 999,
                  }}
                >
                  ⚡ {m.stepsCount} Calculation {m.stepsCount === 1 ? 'Step' : 'Steps'}
                </span>
                {isSelected && <CheckCircle size={18} color="#00e5ff" />}
              </div>

              <h4 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.25rem' }}>
                {m.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.steps.map((st, i) => (
                  <div key={i} style={{ fontSize: '0.88rem', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: 8 }}>
                    {st}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Justification Reason Picker */}
      {selectedMethodId && (
        <div style={{ width: '100%', maxWidth: 840, background: 'rgba(0,0,0,0.3)', padding: 22, borderRadius: 16, border: '1.5px solid rgba(255,213,79,0.3)' }}>
          <h4 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 12 }}>
            Why is this method the most efficient?
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentRound.reasonsOptions.map((reasonText, idx) => {
              const isSelected = selectedReasonIdx === idx;
              const isCorrect = idx === currentRound.correctReasonIdx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectReason(idx)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 12,
                    background: isSelected
                      ? isCorrect
                        ? 'rgba(0, 230, 118, 0.2)'
                        : 'rgba(255, 112, 67, 0.2)'
                      : 'rgba(255,255,255,0.06)',
                    border: isSelected
                      ? isCorrect
                        ? '2px solid #00e676'
                        : '2px solid #ff7043'
                      : '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    textAlign: 'left',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ color: '#ffd54f', marginRight: 8, fontWeight: 800 }}>{String.fromCharCode(65 + idx)}.</span>
                  <span>{reasonText}</span>
                </button>
              );
            })}
          </div>

          {isRoundProved && (
            <div style={{ marginTop: 16, background: 'rgba(0, 230, 118, 0.15)', border: '1.5px solid #00e676', padding: 14, borderRadius: 10, color: '#00e676', fontWeight: 800, textAlign: 'center' }}>
              <Sparkles size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
              <span>Master Reason Verified! You proved the mathematical efficiency trade-off!</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: 840, marginTop: 10 }}>
        {isRoundProved && (
          <button className="btn-primary" onClick={handleNextRound}>
            <span>{roundIdx < ROUNDS_C.length - 1 ? 'Next Efficiency Challenge' : 'Complete Station C & Unlock Practice!'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
