import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import Mascot from '../Mascot.jsx';
import { WONDER_HOOK } from '../../data/storyContent.js';
import { wonderNarration } from '../../utils/narration.js';
import { narrate, playChime, playClick } from '../../utils/audio.js';

export default function WonderPhase({ onNext, audioEnabled }) {
  const [revealed, setRevealed] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState('both'); // 'sarah' | 'mike' | 'both'
  const [testedX, setTestedX] = useState(5); // Interactive tester: 2, 4, 5, 7

  useEffect(() => {
    narrate(wonderNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleReveal = () => {
    playChime();
    setRevealed(true);
  };

  // Dynamic balance scale tilt for Wonder phase
  // Left: 3(x) + 5 tokens. Right: 20 tokens.
  const leftPanWeight = 3 * testedX + 5;
  const rightPanWeight = 20;
  const tiltDeg = Math.min(16, Math.max(-16, (rightPanWeight - leftPanWeight) * 2));

  return (
    <div className="phase-container wonder-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 1 — WONDER</span>
            <h2>{WONDER_HOOK.title}</h2>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            London &amp; New York · Global Wonder
          </span>
        </div>

        <div className="wonder-content-grid">
          {/* Interactive Visual Stage with Live Dynamic Tilt */}
          <div className="wonder-visual-panel">
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffd54f', marginBottom: 12 }}>
              The Puzzle Scale: 3x + 5 = 20
            </span>

            <div style={{ width: 320, height: 260, position: 'relative' }}>
              <svg viewBox="0 0 320 260" width="100%" height="100%">
                {/* Visual Fulcrum */}
                <polygon points="160,140 130,230 190,230" fill="#78909c" />
                <line x1="100" y1="230" x2="220" y2="230" stroke="#78909c" strokeWidth="8" strokeLinecap="round" />

                {/* Dynamic Balance Beam */}
                <g style={{ transform: `rotate(${tiltDeg}deg)`, transformOrigin: '160px 140px', transition: 'transform 0.4s ease-out' }}>
                  <line x1="30" y1="140" x2="290" y2="140" stroke="#ffd54f" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="160" cy="140" r="8" fill="#ff7043" />

                  {/* Left Pan: Sarah's Algebra */}
                  <line x1="60" y1="140" x2="60" y2="185" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <ellipse cx="60" cy="185" rx="42" ry="8" fill="#1a237e" stroke="#00e5ff" strokeWidth="2" />
                  <text x="60" y="175" fill="#00e5ff" fontSize="14" fontWeight="800" textAnchor="middle">
                    3({testedX}) + 5 = {leftPanWeight}
                  </text>

                  {/* Right Pan: Target 20 Tokens */}
                  <line x1="260" y1="140" x2="260" y2="185" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <ellipse cx="260" cy="185" rx="42" ry="8" fill="#1a237e" stroke="#ffd54f" strokeWidth="2" />
                  <text x="260" y="175" fill="#ffd54f" fontSize="16" fontWeight="800" textAnchor="middle">
                    20 tokens
                  </text>
                </g>

                {/* Center Status Badge */}
                <circle cx="160" cy="65" r="32" fill="#2d1b69" stroke="#00e5ff" strokeWidth="2" />
                <text x="160" y="74" fill={leftPanWeight === 20 ? '#00e676' : '#ffd54f'} fontSize={leftPanWeight === 20 ? '22' : '28'} fontWeight="900" textAnchor="middle">
                  {leftPanWeight === 20 ? 'x = 5' : leftPanWeight < 20 ? '▲ Low' : '▼ High'}
                </text>
              </svg>
            </div>

            {/* Test Different Values of x */}
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Test values for x to see the scale balance:
              </span>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {[2, 4, 5, 7].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      playClick();
                      setTestedX(val);
                      if (val === 5) playChime();
                    }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: testedX === val ? 'linear-gradient(135deg, #00e5ff, #3f51b5)' : 'rgba(255,255,255,0.08)',
                      border: testedX === val ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    x = {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Toggle Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                className={`scale-action-chip ${selectedRoad === 'sarah' ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setSelectedRoad('sarah');
                }}
              >
                Sarah's Algebra
              </button>
              <button
                className={`scale-action-chip ${selectedRoad === 'mike' ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setSelectedRoad('mike');
                }}
              >
                Mike's Reverse Flow
              </button>
              <button
                className={`scale-action-chip ${selectedRoad === 'both' ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setSelectedRoad('both');
                }}
              >
                Compare Both
              </button>
            </div>
          </div>

          {/* Wonder Details Panel */}
          <div className="wonder-details-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Mascot mood="curious" size="medium" />
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.25rem' }}>
                  Two Solvers, One Equation!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Balo is puzzled by this curious discovery.
                </p>
              </div>
            </div>

            <div className="wonder-chat-bubble">
              <p>
                <strong>Sarah (London):</strong> "I use algebra balance steps: 3x + 5 = 20 → subtract 5 from both sides: 3x = 15 → divide both sides by 3: <strong>x = 5</strong>."
              </p>
            </div>

            <div className="wonder-chat-bubble" style={{ borderLeftColor: '#ffd54f' }}>
              <p>
                <strong>Mike (New York):</strong> "I didn't write an x at all! I worked backwards: started at 20, undid the +5 to get 15, then divided 15 into 3 groups to get <strong>5</strong>."
              </p>
            </div>

            {!revealed ? (
              <button className="btn-primary" onClick={handleReveal} style={{ alignSelf: 'flex-start' }}>
                <Sparkles size={18} />
                <span>Reveal How Both Work!</span>
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: '14px 18px', borderRadius: 12, color: '#00e676', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  <CheckCircle2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                  <strong>They are identical mathematical operations!</strong> Subtracting 5 undoes the extra amount, and dividing by 3 unpacks each group. Different notation, same exact truth!
                </div>
                <button className="btn-primary" onClick={onNext} style={{ alignSelf: 'flex-start' }}>
                  <span>Enter the Story: The Golden Scale</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
