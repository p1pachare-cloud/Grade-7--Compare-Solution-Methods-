import React from 'react';

const SYMBOLS = [
  { text: '⚖️', top: '8%', left: '6%', size: '2.5rem', delay: '0s' },
  { text: 'x', top: '18%', left: '88%', size: '3.2rem', delay: '2s' },
  { text: 'px + q', top: '45%', left: '4%', size: '2.2rem', delay: '4s' },
  { text: '=', top: '75%', left: '12%', size: '3.5rem', delay: '1s' },
  { text: 'y = kx', top: '82%', left: '85%', size: '2.4rem', delay: '5s' },
  { text: '%', top: '25%', left: '78%', size: '3rem', delay: '3s' },
  { text: '÷', top: '60%', left: '92%', size: '3rem', delay: '2.5s' },
  { text: '3x + 5', top: '35%', left: '16%', size: '2rem', delay: '1.5s' },
  { text: '10%', top: '68%', left: '78%', size: '2.2rem', delay: '4.5s' },
  { text: '2/3', top: '12%', left: '48%', size: '2.2rem', delay: '3.5s' },
];

export default function FloatingGeometry() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {SYMBOLS.map((s, idx) => (
        <span
          key={idx}
          className="floating-number"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: s.delay,
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}

