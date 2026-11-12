import React from 'react';
import { Lock, Star, MapPin } from 'lucide-react';
import { WORLDS } from '../../data/worlds.js';
import { calcStars, canUnlockNextWorld } from '../../utils/scoring.js';
import { playClick } from '../../utils/audio.js';

export default function WorldMap({ worldScores = [], currentWorld = 0, onSelectWorld }) {
  return (
    <div className="world-map-wrapper">
      <div className="world-map-header">
        <MapPin size={18} color="#00e5ff" />
        <h3>Global Tour · 10 Mystery Cities</h3>
      </div>

      <div className="world-scroll-container">
        {WORLDS.map((world, idx) => {
          const score = worldScores[idx];
          const stars = score !== null && score !== undefined ? calcStars(score) : 0;
          const isActive = idx === currentWorld;

          // Unlock logic: world 0 is unlocked. Subsequent worlds unlock if previous world score >= 6
          const isUnlocked = idx === 0 || canUnlockNextWorld(worldScores[idx - 1]);

          return (
            <div
              key={world.id}
              className={`world-card-chip ${isActive ? 'active-world' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => {
                if (isUnlocked) {
                  playClick();
                  onSelectWorld(idx);
                }
              }}
              title={isUnlocked ? `Select ${world.name}` : `Unlock by scoring >= 6 in World ${idx}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="world-num-badge">City {idx + 1}</span>
                {!isUnlocked ? <Lock size={14} color="var(--text-muted)" /> : <span>{world.flag}</span>}
              </div>

              <span className="world-landmark-title">{world.name}</span>
              <span className="world-country-name">{world.country}</span>

              <div className="world-stars-row">
                {[1, 2, 3].map((starNum) => (
                  <Star
                    key={starNum}
                    size={14}
                    className={starNum <= stars ? 'star-filled' : 'star-empty'}
                  />
                ))}
                {score !== null && score !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: '#ffd54f', marginLeft: 6, fontWeight: 700 }}>
                    {score}/10
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

