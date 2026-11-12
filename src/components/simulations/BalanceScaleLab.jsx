import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, CheckCircle, Sparkles, Scale, Play, RefreshCw, Eye, Users, UserCheck } from 'lucide-react';
import Mascot from '../Mascot.jsx';
import { playChime, playClick, playBuzz } from '../../utils/audio.js';

export default function BalanceScaleLab({ audioEnabled, onComplete }) {
  const [round, setRound] = useState(0); // 0: Equation, 1: Proportion, 2: Percent
  const [stage, setStage] = useState('try'); // 'watch' | 'together' | 'try'

  // Round 0: Equation Balance State
  const [pVal, setPVal] = useState(3);
  const [qVal, setQVal] = useState(5);
  const [rVal, setRVal] = useState(20);
  const [leftUnits, setLeftUnits] = useState(5);
  const [leftBlocks, setLeftBlocks] = useState(3);
  const [rightUnits, setRightUnits] = useState(20);
  const [machineStep, setMachineStep] = useState(0); // 0: start, 1: undo q, 2: undo p
  const [equationSolved, setEquationSolved] = useState(false);

  // Round 1: Proportion State
  const [propA, setPropA] = useState(4);
  const [propB, setPropB] = useState(6);
  const [propFactor, setPropFactor] = useState(1);
  const [propTargetFactor, setPropTargetFactor] = useState(2.5);

  // Round 2: Percent State
  const [pctWhole, setPctWhole] = useState(80);
  const [targetPct, setTargetPct] = useState(25);
  const [shadedTenths, setShadedTenths] = useState(0);
  const [shadedFives, setShadedFives] = useState(0);

  // Tilt angle calculation based on weights (x is 5)
  const leftWeight = leftBlocks * 5 + leftUnits;
  const rightWeight = rightUnits;
  const rawTilt = Math.min(18, Math.max(-18, (rightWeight - leftWeight) * 2));

  // Reset or initialize rounds
  const initRound = (rIdx) => {
    if (rIdx === 0) {
      setLeftBlocks(3);
      setLeftUnits(5);
      setRightUnits(20);
      setMachineStep(0);
      setEquationSolved(false);
    } else if (rIdx === 1) {
      setPropFactor(1);
    } else if (rIdx === 2) {
      setShadedTenths(0);
      setShadedFives(0);
    }
  };

  useEffect(() => {
    initRound(round);
  }, [round]);

  // Balance scale actions
  const handleRemoveUnitsBothSides = () => {
    playClick();
    if (leftUnits > 0 && rightUnits >= leftUnits) {
      const removed = leftUnits;
      setRightUnits((prev) => prev - removed);
      setLeftUnits(0);
      setMachineStep(1);
      playChime();
    }
  };

  const handleDivideBothSides = () => {
    playClick();
    if (leftUnits === 0 && leftBlocks > 1 && rightUnits % leftBlocks === 0) {
      const singleX = rightUnits / leftBlocks;
      setLeftBlocks(1);
      setRightUnits(singleX);
      setMachineStep(2);
      setEquationSolved(true);
      playChime();
    }
  };

  const handleOneSidedAction = () => {
    playBuzz();
    // Simulate tipping the balance when student acts on one side only
    setLeftUnits((prev) => prev + 3);
  };

  const handleNextRound = () => {
    playChime();
    if (round < 2) {
      setRound((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="balance-scale-stage" style={{ width: '100%' }}>
      {/* Station Top Mode Bar */}
      <div className="gradual-release-banner" style={{ width: '100%', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="release-stage-pill">
            <Scale size={18} color="#00e5ff" />
            <span style={{ color: '#00e5ff' }}>Station A · Concrete Physical Model</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'watch', label: 'Watch Demo', icon: Eye },
              { id: 'together', label: 'Try Together', icon: Users },
              { id: 'try', label: 'Interactive Lab', icon: UserCheck },
            ].map((st) => {
              const Icon = st.icon;
              const isActive = stage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    playClick();
                    setStage(st.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: isActive ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    border: isActive ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isActive ? '#00e5ff' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={13} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ color: '#ffd54f', fontSize: '0.88rem', fontWeight: 800 }}>
          Round {round + 1} of 3: {round === 0 ? 'Equations (3x + 5 = 20)' : round === 1 ? 'Proportion Scaling' : 'Percent Bar Model'}
        </div>
      </div>

      {/* ROUND 0: EQUATIONS (BALANCE SCALE + FUNCTION MACHINE) */}
      {round === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.6rem' }}>
              Balance Scale vs Reverse Function Machine
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Notice how subtracting 5 from both pans on the scale performs the exact same operation as undoing the machine's +5 step!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, width: '100%', alignItems: 'center' }}>
            {/* SVG Balance Scale with Realistic Physical Tilt */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '0.85rem', color: '#ffd54f', fontWeight: 800, marginBottom: 8 }}>
                PHYSICAL SCALE: {leftWeight === rightWeight ? '⚖️ PERFECTLY BALANCED' : '⚠️ UNBALANCED (TILTED)'}
              </div>

              <div style={{ width: '100%', height: 230, position: 'relative' }}>
                <svg viewBox="0 0 420 220" width="100%" height="100%">
                  {/* Fulcrum Stand */}
                  <polygon points="210,120 180,210 240,210" fill="#546e7a" stroke="#ffffff" strokeWidth="1" />
                  <line x1="150" y1="210" x2="270" y2="210" stroke="#78909c" strokeWidth="8" strokeLinecap="round" />

                  {/* Beam with animated dynamic tilt */}
                  <g style={{ transform: `rotate(${rawTilt}deg)`, transformOrigin: '210px 120px', transition: 'transform 0.4s ease-out' }}>
                    <line x1="40" y1="120" x2="380" y2="120" stroke="#ffd54f" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="210" cy="120" r="8" fill="#ff7043" />

                    {/* Left Pan */}
                    <line x1="70" y1="120" x2="70" y2="165" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                    <ellipse cx="70" cy="165" rx="55" ry="12" fill="#1a237e" stroke="#00e5ff" strokeWidth="2" />
                    {/* Left Pan Blocks & Units */}
                    <g transform="translate(30, 130)">
                      {Array.from({ length: leftBlocks }).map((_, i) => (
                        <rect key={i} x={i * 26} y={0} width="22" height="22" rx="4" fill="#00e5ff" stroke="#ffffff" strokeWidth="1.5" />
                      ))}
                      {leftUnits > 0 && (
                        <circle cx="75" cy="11" r="10" fill="#ffd54f" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                    </g>

                    {/* Right Pan */}
                    <line x1="350" y1="120" x2="350" y2="165" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                    <ellipse cx="350" cy="165" rx="55" ry="12" fill="#1a237e" stroke="#ffd54f" strokeWidth="2" />
                    {/* Right Pan Weights */}
                    <g transform="translate(320, 130)">
                      <circle cx="30" cy="11" r="14" fill="#ffd54f" stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  </g>

                  {/* Pan Status Labels */}
                  <text x="70" y="195" fill="#00e5ff" fontSize="14" fontWeight="800" textAnchor="middle">
                    {leftBlocks}x {leftUnits > 0 ? `+ ${leftUnits}` : ''} ({leftWeight} wt)
                  </text>
                  <text x="350" y="195" fill="#ffd54f" fontSize="14" fontWeight="800" textAnchor="middle">
                    {rightUnits} tokens ({rightWeight} wt)
                  </text>
                </svg>
              </div>

              {/* Interactive Balance Controls */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
                {leftUnits > 0 ? (
                  <button className="btn-primary" onClick={handleRemoveUnitsBothSides} style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                    <span>Remove 5 from BOTH sides</span>
                  </button>
                ) : leftBlocks > 1 ? (
                  <button className="btn-primary" onClick={handleDivideBothSides} style={{ padding: '8px 18px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #00e676, #00e5ff)' }}>
                    <span>Divide BOTH sides into 3 groups</span>
                  </button>
                ) : (
                  <div style={{ color: '#00e676', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={18} />
                    <span>Solved! 1x block = {rightUnits} tokens</span>
                  </div>
                )}

                <button className="btn-secondary" onClick={() => initRound(0)} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Function Machine (Forward & Reverse) */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 20, border: '1px solid rgba(255,213,79,0.25)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', color: '#ffd54f', fontWeight: 800 }}>
                  ⚙️ REVERSE FUNCTION MACHINE
                </span>
                <span style={{ fontSize: '0.78rem', color: '#00e5ff', background: 'rgba(0,229,255,0.15)', padding: '2px 8px', borderRadius: 999 }}>
                  Arithmetic Path
                </span>
              </div>

              {/* Machine Flow Diagram */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: machineStep >= 0 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)', border: machineStep === 0 ? '2px solid #00e5ff' : '1px solid rgba(255,255,255,0.15)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '0.85rem' }}>Step 1: Start at Output</span>
                  <div style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>20 tokens</div>
                </div>

                <div style={{ background: machineStep >= 1 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)', border: machineStep === 1 ? '2px solid #00e5ff' : '1px solid rgba(255,255,255,0.15)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '0.85rem' }}>Step 2: Undo +5 (Subtract 5)</span>
                  <div style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>20 − 5 = 15 tokens</div>
                </div>

                <div style={{ background: machineStep >= 2 ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.05)', border: machineStep === 2 ? '2px solid #00e676' : '1px solid rgba(255,255,255,0.15)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '0.85rem' }}>Step 3: Undo ×3 (Divide by 3)</span>
                  <div style={{ fontSize: '1.1rem', color: '#00e676', fontWeight: 800 }}>15 ÷ 3 = 5 tokens (x)</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                💡 <strong>Twin Connection:</strong> The balance scale subtracted 5 from both sides, then divided by 3. The function machine did the exact same steps in reverse!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROUND 1: PROPORTIONS (DOUBLE NUMBER LINE & SCALE FACTOR) */}
      {round === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.6rem' }}>
              Double Number Line &amp; Ratio Scaling
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              At Carlos's Rio kitchen, 4 cups of rice feeds 6 people. Adjust the scale multiplier to feed 15 people!
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: 680, background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 24, border: '1px solid rgba(0,229,255,0.25)' }}>
            {/* Multiplier Slider / Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span style={{ color: '#ffd54f', fontWeight: 800 }}>Scale Multiplier:</span>
              {[1, 1.5, 2, 2.5, 3].map((fac) => (
                <button
                  key={fac}
                  onClick={() => {
                    playClick();
                    setPropFactor(fac);
                    if (fac === 2.5) playChime();
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    background: propFactor === fac ? 'linear-gradient(135deg, #00e5ff, #3f51b5)' : 'rgba(255,255,255,0.08)',
                    border: propFactor === fac ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  {fac}×
                </button>
              ))}
            </div>

            {/* SVG Double Number Line */}
            <div style={{ width: '100%', height: 140 }}>
              <svg viewBox="0 0 600 130" width="100%" height="100%">
                {/* Line 1: Cups of Rice */}
                <line x1="40" y1="40" x2="560" y2="40" stroke="#00e5ff" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="40" r="6" fill="#00e5ff" />
                <text x="100" y="25" fill="#00e5ff" fontSize="13" fontWeight="800" textAnchor="middle">4 cups (base)</text>

                <circle cx={100 + propFactor * 140} cy="40" r="8" fill="#ffd54f" stroke="#ffffff" strokeWidth="2" />
                <text x={100 + propFactor * 140} y="25" fill="#ffd54f" fontSize="15" fontWeight="900" textAnchor="middle">
                  {propA * propFactor} cups
                </text>

                {/* Line 2: People Fed */}
                <line x1="40" y1="95" x2="560" y2="95" stroke="#ffd54f" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="95" r="6" fill="#ffd54f" />
                <text x="100" y="118" fill="#ffd54f" fontSize="13" fontWeight="800" textAnchor="middle">6 people</text>

                <circle cx={100 + propFactor * 140} cy="95" r="8" fill="#00e676" stroke="#ffffff" strokeWidth="2" />
                <text x={100 + propFactor * 140} y="122" fill="#00e676" fontSize="15" fontWeight="900" textAnchor="middle">
                  {propB * propFactor} people
                </text>

                {/* Vertical Ratio Linker */}
                <line
                  x1={100 + propFactor * 140}
                  y1="40"
                  x2={100 + propFactor * 140}
                  y2="95"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              </svg>
            </div>

            {/* Method Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid #00e5ff', borderRadius: 12, padding: 14 }}>
                <span style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.88rem' }}>Priya: Unit Rate</span>
                <p style={{ color: '#ffffff', fontSize: '0.85rem', marginTop: 4 }}>
                  4 ÷ 6 = 2/3 cup per person.<br />
                  For 15 people: 15 × (2/3) = <strong>10 cups</strong>.
                </p>
              </div>

              <div style={{ background: 'rgba(255,213,79,0.1)', border: '1px solid #ffd54f', borderRadius: 12, padding: 14 }}>
                <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '0.88rem' }}>Yuki: Scale Factor</span>
                <p style={{ color: '#ffffff', fontSize: '0.85rem', marginTop: 4 }}>
                  15 ÷ 6 = 2.5× scale factor.<br />
                  For rice: 4 × 2.5 = <strong>10 cups</strong>.
                </p>
              </div>
            </div>

            {propFactor === 2.5 && (
              <div style={{ marginTop: 16, background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: 12, borderRadius: 10, color: '#00e676', fontWeight: 800, textAlign: 'center' }}>
                🎉 Match Confirmed! Both Unit Rate and Scale Factor give exactly 10 cups for 15 guests!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROUND 2: PERCENTS (INTERACTIVE BAR MODEL & DECIMAL MULTIPLIER) */}
      {round === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '1.6rem' }}>
              Interactive Bar Model &amp; Multiplier Synchronizer
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Find 25% of an 80 token ticket! Tap two 10% blocks and one 5% block to assemble the benchmark.
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: 680, background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,213,79,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.95rem' }}>
                Ticket Whole: 80 tokens (100%)
              </span>
              <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '0.95rem' }}>
                Target: 25% Discount
              </span>
            </div>

            {/* 10-Segment Interactive Bar Model */}
            <div style={{ display: 'flex', gap: 6, width: '100%', height: 60, marginBottom: 14 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => {
                const isSelected = idx <= shadedTenths;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      playClick();
                      const next = idx === shadedTenths ? idx - 1 : idx;
                      setShadedTenths(next);
                      if (next === 2 && shadedFives === 1) playChime();
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      background: isSelected ? 'linear-gradient(135deg, #00e5ff, #3f51b5)' : 'rgba(255,255,255,0.06)',
                      border: isSelected ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
                      10%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isSelected ? '#ffd54f' : 'rgba(255,255,255,0.3)' }}>
                      8 tok
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 5% Half-Block Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
              <button
                onClick={() => {
                  playClick();
                  const next = shadedFives === 1 ? 0 : 1;
                  setShadedFives(next);
                  if (shadedTenths === 2 && next === 1) playChime();
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: shadedFives === 1 ? 'linear-gradient(135deg, #ffd54f, #ff7043)' : 'rgba(255,255,255,0.08)',
                  border: shadedFives === 1 ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                {shadedFives === 1 ? '✓ 5% Half-Block Selected (4 tokens)' : '+ Add 5% Half-Block (4 tokens)'}
              </button>
            </div>

            {/* Total Readout */}
            {(() => {
              const currentTotalPct = shadedTenths * 10 + shadedFives * 5;
              const currentTokenVal = shadedTenths * 8 + shadedFives * 4;
              const isTargetMatched = currentTotalPct === 25;

              return (
                <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.05rem', fontWeight: 800 }}>
                    <span style={{ color: '#00e5ff' }}>Shaded: {currentTotalPct}%</span>
                    <span style={{ color: '#ffd54f' }}>Value: {currentTokenVal} tokens</span>
                    <span style={{ color: 'var(--text-muted)' }}>Ticket Price: {80 - currentTokenVal} tokens</span>
                  </div>

                  <div style={{ marginTop: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <strong>Noah’s Decimal Multiplier Twin:</strong> 0.25 × 80 = 20 tokens discount. (Paying 75%: 0.75 × 80 = 60 tokens).
                  </div>

                  {isTargetMatched && (
                    <div style={{ marginTop: 12, background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: 10, borderRadius: 8, color: '#00e676', fontWeight: 800, textAlign: 'center' }}>
                      🎉 Perfect! 25% of 80 is 20 tokens. Sale price is 60 tokens!
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Station Bottom Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 24 }}>
        <button className="btn-primary" onClick={handleNextRound}>
          <span>{round < 2 ? 'Next Discovery Round' : 'Complete Station A!'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
