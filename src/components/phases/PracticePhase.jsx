import React, { useState, useEffect } from 'react';
import { Flame, Zap, Star, ArrowRight } from 'lucide-react';
import WorldMap from '../quiz/WorldMap.jsx';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { WORLDS } from '../../data/worlds.js';
import { buildSession } from '../../engine/buildWorld.js';
import { calcXP, calcStars } from '../../utils/scoring.js';
import { narrate, playChime, playBuzz } from '../../utils/audio.js';
import { correctNarration, incorrectNarration } from '../../utils/narration.js';

export default function PracticePhase({
  onNext,
  audioEnabled,
  xp,
  setXp,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  worldScores,
  setWorldScores,
  onErrorDetectiveSolved,
  onEfficiencySolved,
}) {
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentWorld, setCurrentWorld] = useState(0);
  const [questionIdxInWorld, setQuestionIdxInWorld] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Generate 100 questions session once
  useEffect(() => {
    const questions = buildSession();
    setSessionQuestions(questions);
  }, []);

  const worldQuestions = sessionQuestions.slice(currentWorld * 10, (currentWorld + 1) * 10);
  const currentQuestion = worldQuestions[questionIdxInWorld] || worldQuestions[0];
  const worldMeta = WORLDS[currentWorld] || WORLDS[0];

  const handleSelectAnswer = (answer) => {
    if (!currentQuestion) return;
    const isCorrect =
      String(answer).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      playChime();
      const xpEarned = calcXP(attemptCount + 1, 0, streak);
      setXp((prev) => prev + xpEarned);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const updatedScores = [...worldScores];
      updatedScores[currentWorld] = (updatedScores[currentWorld] || 0) + 1;
      setWorldScores(updatedScores);

      if (currentQuestion.type === 'error_analysis' && onErrorDetectiveSolved) {
        onErrorDetectiveSolved();
      }
      if (currentQuestion.type === 'efficiency' && attemptCount === 0 && onEfficiencySolved) {
        onEfficiencySolved();
      }

      narrate(correctNarration(), audioEnabled);
      setFeedback({
        isCorrect: true,
        xpEarned,
        explanation: currentQuestion.explanation,
        correctAnswer: currentQuestion.correctAnswer,
      });
    } else {
      playBuzz();
      setStreak(0);
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);

      narrate(incorrectNarration(), audioEnabled);
      if (nextAttempt >= 3) {
        setFeedback({
          isCorrect: false,
          xpEarned: 0,
          explanation: currentQuestion.explanation,
          correctAnswer: currentQuestion.correctAnswer,
        });
      }
    }
  };

  const handleContinueFeedback = () => {
    setFeedback(null);
    setAttemptCount(0);

    if (questionIdxInWorld < worldQuestions.length - 1) {
      setQuestionIdxInWorld((prev) => prev + 1);
    } else {
      // Completed world
      if (currentWorld < 9) {
        setCurrentWorld((prev) => prev + 1);
        setQuestionIdxInWorld(0);
      } else {
        // Completed all 10 worlds
        onNext();
      }
    }
  };

  const currentScore = worldScores[currentWorld] || 0;
  const currentStars = calcStars(currentScore);

  return (
    <div className="phase-container practice-phase">
      <div className="glass-card phase-card">
        {/* Practice Stats Bar */}
        <div className="play-stats-bar">
          <div className="stat-pill xp-pill">
            <Zap size={18} />
            <span>{xp} XP</span>
          </div>

          <div className="stat-pill streak-pill">
            <Flame size={18} />
            <span>{streak} Streak 🔥</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              World {currentWorld + 1} Stars:
            </span>
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                size={18}
                className={s <= currentStars ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
        </div>

        {/* 10 World Map */}
        <WorldMap
          worldScores={worldScores}
          currentWorld={currentWorld}
          onSelectWorld={(wIdx) => {
            setCurrentWorld(wIdx);
            setQuestionIdxInWorld(0);
            setAttemptCount(0);
          }}
        />

        {/* Question Counter Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1rem' }}>
            {worldMeta.landmark} • Question {questionIdxInWorld + 1} of 10
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Overall Challenge {currentWorld * 10 + questionIdxInWorld + 1} / 100
          </span>
        </div>

        {/* Question Renderer */}
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            onSelectAnswer={handleSelectAnswer}
            attemptCount={attemptCount}
            audioEnabled={audioEnabled}
          />
        )}

        {/* Feedback Overlay Modal */}
        {feedback && (
          <FeedbackOverlay
            isCorrect={feedback.isCorrect}
            xpEarned={feedback.xpEarned}
            explanation={feedback.explanation}
            correctAnswer={feedback.correctAnswer}
            onContinue={handleContinueFeedback}
          />
        )}
      </div>
    </div>
  );
}

