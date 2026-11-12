import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Box, Image as ImageIcon, Volume2 } from 'lucide-react';
import Mascot from '../Mascot.jsx';
import { STORY_PANELS } from '../../data/storyContent.js';
import { getStoryNarration } from '../../utils/narration.js';
import { narrate, playClick } from '../../utils/audio.js';

export default function StoryPhase({ onNext, audioEnabled }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'model'
  const panel = STORY_PANELS[panelIndex];

  useEffect(() => {
    narrate(getStoryNarration(panelIndex), audioEnabled);
  }, [panelIndex, audioEnabled]);

  const handleNext = () => {
    playClick();
    if (panelIndex < STORY_PANELS.length - 1) {
      setPanelIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    playClick();
    if (panelIndex > 0) {
      setPanelIndex((prev) => prev - 1);
    }
  };

  const handleListen = () => {
    narrate(getStoryNarration(panelIndex), true);
  };

  return (
    <div className="phase-container story-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 2 — STORY</span>
            <h2>The Method Masters &amp; the Golden Scale</h2>
          </div>

          <div className="panel-dots">
            {STORY_PANELS.map((p, idx) => (
              <button
                key={p.id}
                className={`panel-dot ${idx === panelIndex ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setPanelIndex(idx);
                }}
                title={`Panel ${idx + 1}: ${p.title}`}
              />
            ))}
          </div>
        </div>

        <div className="story-content-wrapper">
          {/* Visual Showcase Card */}
          <div className="story-visual-card">
            <div className="story-card-top-bar">
              <div className="story-location-badge">
                <MapPin size={16} />
                <span>{panel.location}</span>
              </div>

              <div className="story-view-toggle">
                <button
                  className={`story-toggle-btn ${viewMode === 'image' ? 'active' : ''}`}
                  onClick={() => setViewMode('image')}
                >
                  <ImageIcon size={14} />
                  <span>Story Art</span>
                </button>
                <button
                  className={`story-toggle-btn ${viewMode === 'model' ? 'active' : ''}`}
                  onClick={() => setViewMode('model')}
                >
                  <Box size={14} />
                  <span>Math Model</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleListen}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    color: '#ffd54f',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Volume2 size={15} />
                  <span>Listen</span>
                </button>
                <span style={{ fontSize: '0.85rem', color: '#00e5ff', fontWeight: 700 }}>
                  Panel {panelIndex + 1} of {STORY_PANELS.length}
                </span>
              </div>
            </div>

            {/* Visual Graphic or High-Res Story Artwork */}
            <div className="visual-graphic-container" style={{ position: 'relative', minHeight: 340, padding: 0 }}>
              {viewMode === 'image' ? (
                <div style={{ width: '100%', height: 340, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="story-panel-img"
                    onError={() => setViewMode('model')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(6, 5, 23, 0.85))',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.2rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                      {panel.title}
                    </span>
                    <span style={{ background: 'rgba(0, 229, 255, 0.3)', border: '1px solid #00e5ff', padding: '4px 12px', borderRadius: 999, color: '#ffffff', fontSize: '0.8rem', fontWeight: 700 }}>
                      {panel.chip}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ width: '100%', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {panel.visualType === 'vaultIntro' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 25px #ffd54f)' }}>🏛️⚖️</div>
                      <div style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1.35rem', fontFamily: 'var(--font-display)' }}>
                        The Global Math Festival Vault
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, textAlign: 'center' }}>
                        Each lock requires a verified dual solution before the gears turn!
                      </p>
                    </div>
                  )}

                  {panel.visualType === 'cairoClue' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{ background: 'rgba(255, 112, 67, 0.2)', border: '2px solid #ff7043', borderRadius: 18, padding: '20px 36px', textAlign: 'center' }}>
                        <div style={{ color: '#ffd54f', fontSize: '2rem', fontWeight: 900, fontFamily: 'monospace' }}>
                          3x + 5 = 20
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 8 }}>
                          Ride Cost: 3 tokens/ride • Admission: 5 tokens • Total: 20 tokens
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.visualType === 'twoRoads' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 560 }}>
                      <div style={{ background: 'rgba(0, 229, 255, 0.15)', border: '2px solid #00e5ff', padding: 18, borderRadius: 14 }}>
                        <div style={{ color: '#00e5ff', fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>Sarah (Algebra Balance)</div>
                        <div style={{ fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.5 }}>
                          1. 3x + 5 = 20<br />
                          2. Subtract 5 from both: 3x = 15<br />
                          3. Divide by 3: <strong>x = 5 rides</strong>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 213, 79, 0.15)', border: '2px solid #ffd54f', padding: 18, borderRadius: 14 }}>
                        <div style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>Mike (Reverse Flow)</div>
                        <div style={{ fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.5 }}>
                          1. Start at 20 tokens<br />
                          2. Take away 5 entry fee: 15<br />
                          3. Divide into 3s: <strong>5 rides</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.visualType === 'rioProportion' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: '3.5rem' }}>🥘 ➡️ 👥</div>
                      <div style={{ color: '#00e676', fontWeight: 800, fontSize: '1.25rem' }}>
                        4 cups feeds 6 people ➔ 10 cups feeds 15 people!
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: '6px 14px', borderRadius: 8, fontSize: '0.88rem', color: '#ffffff' }}>
                          Priya (Unit Rate): 15 × (4/6) = 10 cups
                        </span>
                        <span style={{ background: 'rgba(255, 213, 79, 0.15)', border: '1px solid #ffd54f', padding: '6px 14px', borderRadius: 8, fontSize: '0.88rem', color: '#ffffff' }}>
                          Yuki (Scale Factor): 4 × 2.5 = 10 cups
                        </span>
                      </div>
                    </div>
                  )}

                  {panel.visualType === 'nyPercent' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: '3.5rem' }}>🎟️ 🏷️</div>
                      <div style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1.25rem' }}>
                        80 tokens with 25% discount = 60 tokens!
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ background: 'rgba(0, 229, 255, 0.15)', border: '1px solid #00e5ff', padding: '6px 14px', borderRadius: 8, fontSize: '0.88rem', color: '#ffffff' }}>
                          Emma (Bar Model): 80 − 20 = 60 tokens
                        </span>
                        <span style={{ background: 'rgba(255, 112, 67, 0.15)', border: '1px solid #ff7043', padding: '6px 14px', borderRadius: 8, fontSize: '0.88rem', color: '#ffffff' }}>
                          Noah (Multiplier): 0.75 × 80 = 60 tokens
                        </span>
                      </div>
                    </div>
                  )}

                  {panel.visualType === 'berlinEfficiency' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                      <div style={{ color: '#00e5ff', fontWeight: 900, fontSize: '1.6rem', fontFamily: 'monospace' }}>
                        4(x + 3) = 36
                      </div>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ background: 'rgba(0, 230, 118, 0.15)', border: '1.5px solid #00e676', padding: '10px 18px', borderRadius: 10 }}>
                          <span style={{ color: '#00e676', fontWeight: 800 }}>⚡ Sofia (Divide First):</span> x + 3 = 9 → <strong>x = 6 (2 steps)</strong>
                        </div>
                        <div style={{ background: 'rgba(255, 213, 79, 0.15)', border: '1.5px solid #ffd54f', padding: '10px 18px', borderRadius: 10 }}>
                          <span style={{ color: '#ffd54f', fontWeight: 800 }}>📦 John (Distribute First):</span> 4x + 12 = 36 → <strong>x = 6 (3 steps)</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.visualType === 'vaultOpen' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 30px #00e5ff)' }}>🔓🏆</div>
                      <div style={{ color: '#00e5ff', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
                        The Golden Scale Vault is Open!
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Narrative Text Box */}
          <div className="story-text-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="story-speaker-badge">
                <Mascot mood={panelIndex === 6 ? 'celebrating' : 'happy'} size="small" />
                <span>{panel.speaker}</span>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 999, fontSize: '0.78rem', color: '#00e5ff', fontWeight: 700 }}>
                {panel.chip}
              </span>
            </div>

            <p className="story-paragraph">{panel.text}</p>
          </div>

          {/* Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <button
              className="btn-secondary"
              onClick={handlePrev}
              disabled={panelIndex === 0}
              style={{ opacity: panelIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={18} />
              <span>Previous Panel</span>
            </button>

            <button className="btn-primary" onClick={handleNext}>
              <span>{panelIndex < STORY_PANELS.length - 1 ? 'Next Story Clue' : 'Enter the Lab (Simulate)'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
