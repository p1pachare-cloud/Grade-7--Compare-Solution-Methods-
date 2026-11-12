import React from 'react';

export default function Mascot({ mood = 'idle', size = 'medium', className = '' }) {
  const sizePx = size === 'large' ? 120 : size === 'medium' ? 80 : 50;

  return (
    <div
      className={`mascot-robot mascot-mood-${mood} ${className}`}
      style={{ width: sizePx, height: sizePx, display: 'inline-block' }}
      title={`Balo the Balance Robot (${mood})`}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="baloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#3f51b5" />
            <stop offset="100%" stopColor="#7c5cbf" />
          </linearGradient>
          <linearGradient id="scaleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ff7043" />
          </linearGradient>
          <filter id="baloGlow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Balance Scale Antenna Beam on head */}
        <line x1="25" y1="14" x2="75" y2={mood === 'thinking' ? 10 : mood === 'curious' ? 18 : 14} stroke="#ffd54f" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="14" r="3" fill="#ffd54f" />
        {/* Left Pan */}
        <line x1="25" y1="14" x2="25" y2="24" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <path d="M 18 24 Q 25 28 32 24" fill="none" stroke="#ffd54f" strokeWidth="2" />
        {/* Right Pan */}
        <line x1="75" y1={mood === 'thinking' ? 10 : mood === 'curious' ? 18 : 14} x2="75" y2={mood === 'thinking' ? 20 : mood === 'curious' ? 28 : 24} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <path d={`M 68 ${mood === 'thinking' ? 20 : mood === 'curious' ? 28 : 24} Q 75 ${mood === 'thinking' ? 24 : mood === 'curious' ? 32 : 28} 82 ${mood === 'thinking' ? 20 : mood === 'curious' ? 28 : 24}`} fill="none" stroke="#ffd54f" strokeWidth="2" />

        {/* Robot Head and Body */}
        <rect
          x="20"
          y="28"
          width="60"
          height="54"
          rx="18"
          fill="url(#baloGrad)"
          filter="url(#baloGlow)"
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        {/* Visor Screen */}
        <ellipse cx="50" cy="52" rx="22" ry="14" fill="#0b0826" stroke="#00e5ff" strokeWidth="1.5" />

        {/* Eyes based on mood */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <path d="M 38 51 Q 43 44 48 51" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 52 51 Q 57 44 62 51" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' || mood === 'curious' ? (
          <>
            <circle cx="42" cy="50" r="3.5" fill="#ffd54f" />
            <ellipse cx="58" cy="48" rx="4.5" ry="2.5" fill="#ffd54f" />
          </>
        ) : (
          <>
            <circle cx="41" cy="51" r="3.5" fill="#00e5ff" />
            <circle cx="59" cy="51" r="3.5" fill="#00e5ff" />
          </>
        )}

        {/* Smile based on mood */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <path d="M 43 59 Q 50 66 57 59" stroke="#ff4081" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <line x1="45" y1="59" x2="55" y2="58" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 44 59 Q 50 63 56 59" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Little Chest Equal Sign Emblem */}
        <line x1="44" y1="72" x2="56" y2="72" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        <line x1="44" y1="76" x2="56" y2="76" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

