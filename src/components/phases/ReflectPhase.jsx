import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2, RotateCcw, Share2, Compass } from 'lucide-react';
import Mascot from '../Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { getArchitectTitle } from '../../utils/scoring.js';
import { reflectNarration } from '../../utils/narration.js';
import { narrate, playChime } from '../../utils/audio.js';

export default function ReflectPhase({
  onRestart,
  audioEnabled,
  xp,
  worldScores = [],
  unlockedBadges = [],
}) {
  const [reflectionText, setReflectionText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    narrate(reflectNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleSaveJournal = () => {
    playChime();
    setSaved(true);
  };

  const totalCorrect = worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
  const architectTitle = getArchitectTitle(xp);

  return (
    <div className="phase-container reflect-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 5 — REFLECT</span>
            <h2>Lesson Completion &amp; Mastery Journal</h2>
          </div>
          <span style={{ color: '#ffd54f', fontWeight: 800 }}>
            Golden Scale Vault Opened! 🏛️⚖️
          </span>
        </div>

        {/* Certificate Card */}
        <div className="completion-certificate-card glass-card">
          <div className="cert-header">
            <Mascot mood="celebrating" size="large" />
            <div>
              <span className="phase-tag" style={{ background: 'rgba(255,193,7,0.2)', color: '#ffd54f' }}>
                {architectTitle}
              </span>
              <h1 className="cert-title">Global Method Master!</h1>
              <p className="cert-subtitle">Compare Solution Methods — Grade 7 Mathematics</p>
            </div>
          </div>

          <div className="cert-stats-row">
            <div className="cert-stat-box">
              <span className="stat-value">{xp}</span>
              <span className="stat-label">Total XP Earned</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{totalCorrect}/100</span>
              <span className="stat-label">Questions Correct</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{unlockedBadges.length}/{BADGES.length}</span>
              <span className="stat-label">Badges Unlocked</span>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="badges-grid-container" style={{ width: '100%' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.3rem', marginBottom: 12, textAlign: 'center' }}>
              🏅 Method Master Badges
            </h3>
            <div className="badges-flex-row">
              {BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`badge-chip-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
                    title={badge.description}
                  >
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflection Journal Prompt */}
          <div className="reflection-journal-box">
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.25rem' }}>
              📓 Method Master’s Problem Solving Journal
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Tell Balo about a problem you encountered today where one solution method was clearly more efficient than another (such as divide-first vs distribute, unit rate vs scale factor, or benchmark percentages). Why was that method faster or easier to check?"
            </p>

            <textarea
              className="reflection-textarea"
              placeholder="Write your mathematical reflection here... (e.g. When numbers divide cleanly, divide-first saves a whole step!)"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button className="btn-secondary" onClick={handleSaveJournal} disabled={saved}>
                {saved ? <CheckCircle2 size={16} color="#00e676" /> : <Sparkles size={16} />}
                <span>{saved ? 'Saved to Your Portfolio!' : 'Save Reflection'}</span>
              </button>

              <button className="btn-primary" onClick={onRestart}>
                <RotateCcw size={16} />
                <span>Restart Journey</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

