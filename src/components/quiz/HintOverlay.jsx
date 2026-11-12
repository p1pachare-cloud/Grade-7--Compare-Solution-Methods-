import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function HintOverlay({ hint1, hint2, attemptCount = 0 }) {
  if (attemptCount === 0) return null;

  return (
    <div className="hint-overlay-container">
      {attemptCount >= 1 && hint1 && (
        <div className="hint-pill">
          <HelpCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Hint 1:</strong> {hint1.display || hint1}
          </div>
        </div>
      )}

      {attemptCount >= 2 && hint2 && (
        <div className="hint-pill" style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'rgba(0, 229, 255, 0.3)', color: '#00e5ff' }}>
          <Sparkles size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Hint 2:</strong> {hint2.display || hint2}
          </div>
        </div>
      )}
    </div>
  );
}

