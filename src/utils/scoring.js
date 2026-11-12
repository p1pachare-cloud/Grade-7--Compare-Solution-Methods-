export const calcXP = (attemptNumber = 1, hintsUsed = 0, streak = 0) => {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
};

export const calcStars = (correctCount = 0) => {
  if (correctCount >= 9) return 3;
  if (correctCount >= 7) return 2;
  if (correctCount >= 6) return 1;
  return 0;
};

export const canUnlockNextWorld = (score) => score !== null && score >= 6;

export const calcTotalStars = (worldScores = []) =>
  worldScores.reduce((sum, score) => sum + (score !== null ? calcStars(score) : 0), 0);

export const getArchitectTitle = (xp = 0) => {
  if (xp >= 900) return 'Global Method Grandmaster 👑';
  if (xp >= 700) return 'Dual Path Master Strategist 🌟';
  if (xp >= 500) return 'Balance Scale Specialist ⚖️';
  if (xp >= 300) return 'Method Practitioner 🚀';
  if (xp >= 100) return 'Apprentice Solver 🔍';
  return 'Curious Explorer 🧭';
};

