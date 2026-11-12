import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import DiagramFor from './DiagramFor.jsx';
import HintOverlay from './HintOverlay.jsx';
import NumberPad from '../shared/NumberPad.jsx';
import { narrate } from '../../utils/audio.js';
import { questionNarration } from '../../utils/narration.js';

export default function QuestionRenderer({
  question,
  onSelectAnswer,
  attemptCount = 0,
  audioEnabled = true,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id]);

  if (!question) return null;

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    onSelectAnswer(opt);
  };

  const handleListen = () => {
    narrate(questionNarration(question), true);
  };

  return (
    <div className="question-renderer-card glass-card">
      <div
        className="question-top-bar"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div className="question-type-badge">
          <span>Question Type: {question.type?.toUpperCase().replace(/_/g, ' ')}</span>
        </div>

        <button
          className="listen-btn"
          onClick={handleListen}
          title="Listen to question narration"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            padding: '4px 12px',
            color: '#ffd54f',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <Volume2 size={16} />
          <span>Listen</span>
        </button>
      </div>

      <h3 className="question-text-title">{question.stem?.display || question.stem}</h3>

      {/* Visual diagram scaffold if available */}
      {question.visual && question.visual !== 'none' && (
        <div className="question-visual-scaffold">
          <DiagramFor visual={question.visual} visualData={question.visualData} />
        </div>
      )}

      {/* Answer controls based on format */}
      {question.format === 'numeric' || question.answerFormat === 'numeric' ? (
        <NumberPad onSubmit={(val) => onSelectAnswer(val)} unit={question.unit} />
      ) : (
        <div className="mcq-options-grid">
          {question.options &&
            question.options.map((option, idx) => {
              const optText = typeof option === 'object' ? option.display || option.text : String(option);
              const isSelected = selectedOption === option;
              return (
                <button
                  key={idx}
                  className={`mcq-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                  <span className="option-text">{optText}</span>
                </button>
              );
            })}
        </div>
      )}

      {/* Graduated Hints */}
      <HintOverlay
        hint1={question.hint1}
        hint2={question.hint2}
        attemptCount={attemptCount}
      />
    </div>
  );
}

