import React from 'react';
import { unlockAudio, playClick } from '../utils/audio.js';

const PHASE_CARDS = [
  {
    id: 'wonder',
    emoji: '🤔',
    title: 'Wonder',
    subtitle: 'The 3x + 5 Double-Solver Mystery!',
  },
  {
    id: 'story',
    emoji: '📖',
    title: 'Story',
    subtitle: 'The Method Masters & the Vault',
  },
  {
    id: 'simulate',
    emoji: '🧪',
    title: 'Simulate',
    subtitle: '3 Interactive Lab Stations',
  },
  {
    id: 'practice',
    emoji: '🎮',
    title: 'Practice',
    subtitle: '100 Procedural Challenges',
  },
  {
    id: 'reflect',
    emoji: '📓',
    title: 'Reflect',
    subtitle: 'Mastery Badges & Journal',
  },
];

export default function IntroScreen({ onStart, onSelectPhase }) {
  return (
    <div className="intro-screen-layout">
      {/* Top Grade Pill */}
      <div className="grade-badge-pill">
        <span>✨ Grade 7 Math • Global Problem Solving</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="hero-main-title">Method Masters — Compare Solution Methods</h1>
      <h2 className="hero-subtitle">Equations, Proportions &amp; Percents • Solve It More Than One Way!</h2>

      {/* Intro Description Box */}
      <div className="hero-description-box">
        <p>
          Unlock the Golden Scale Vault! Travel across 10 world cities where every puzzle clue only counts if you can solve it in two different ways: arithmetic vs algebra, unit rate vs scale factor, and bar models vs multipliers. Learn to compare methods and choose the most efficient tool for every problem! 🌍⚖️
        </p>
      </div>

      {/* 5 Phase Cards Row */}
      <div className="phase-cards-row">
        {PHASE_CARDS.map((card) => (
          <div
            key={card.id}
            className="home-phase-card"
            onClick={() => {
              unlockAudio();
              playClick();
              if (onSelectPhase) onSelectPhase(card.id);
              else onStart();
            }}
          >
            <div className="phase-card-emoji">{card.emoji}</div>
            <h3 className="phase-card-title">{card.title}</h3>
            <span className="phase-card-subtitle">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Main CTA Button */}
      <button
        className="btn-begin-journey"
        onClick={() => {
          unlockAudio();
          playClick();
          onStart();
        }}
      >
        <span className="rocket-icon">🚀</span>
        <span>Begin Your Journey!</span>
      </button>

      {/* Bottom Feature Tags */}
      <div className="bottom-feature-tags">
        <div className="feature-tag-pill">
          <span>🎯 100 Randomized Questions</span>
        </div>
        <div className="feature-tag-pill">
          <span>⚖️ 3 Interactive Lab Stations</span>
        </div>
        <div className="feature-tag-pill">
          <span>🏆 8 Badges &amp; XP Streak</span>
        </div>
      </div>
    </div>
  );
}

