import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Mascot from '../Mascot.jsx';

export default function FeedbackOverlay({
  isCorrect,
  xpEarned,
  explanation,
  onContinue,
  correctAnswer,
}) {
  return (
    <div className="feedback-overlay-backdrop">
      <div className={`feedback-modal-card ${isCorrect ? 'correct' : 'incorrect'}`}>
        <Mascot mood={isCorrect ? 'celebrating' : 'thinking'} size="large" />

        <h2 className="feedback-title">
          {isCorrect ? 'Brilliant Reasoning!' : 'Let’s Compare the Roads!'}
        </h2>

        {isCorrect ? (
          <div className="feedback-xp-callout">
            <Sparkles size={18} />
            <span>+{xpEarned} XP Earned</span>
          </div>
        ) : (
          <div style={{ color: '#ffd54f', fontWeight: 700, fontSize: '1.05rem' }}>
            {correctAnswer !== undefined && (
              <span>Correct Answer: {String(correctAnswer)}</span>
            )}
          </div>
        )}

        {explanation && (
          <div className="feedback-explanation-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {isCorrect ? <CheckCircle2 size={18} color="#00e676" /> : <AlertCircle size={18} color="#ffd54f" />}
              <strong style={{ color: '#ffffff' }}>Method Breakdown:</strong>
            </div>
            <p>{explanation.display || explanation}</p>
          </div>
        )}

        <button className="btn-primary" onClick={onContinue}>
          <span>Continue Journey</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

