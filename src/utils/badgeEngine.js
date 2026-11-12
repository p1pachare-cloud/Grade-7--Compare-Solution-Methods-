export const BADGES = [
  {
    id: 'method_explorer',
    label: '🏅 Method Explorer',
    description: 'Complete the Wonder mystery and the world story adventure!',
    condition: (s) => s.phaseComplete?.wonder && s.phaseComplete?.story,
  },
  {
    id: 'balance_builder',
    label: '🥈 Balance Builder',
    description: 'Complete all 3 simulation stations in the laboratory!',
    condition: (s) => Array.isArray(s.completedStations) && s.completedStations.slice(0, 3).every(Boolean),
  },
  {
    id: 'method_master',
    label: '🥇 Method Master',
    description: 'Score 80 or more total correct answers in the 100 challenges!',
    condition: (s) => (s.worldScores || []).reduce((acc, v) => acc + (v || 0), 0) >= 80,
  },
  {
    id: 'perfect_world',
    label: '💎 Perfect World',
    description: 'Score a flawless 10 out of 10 in any world city!',
    condition: (s) => (s.worldScores || []).some((score) => score === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Answer 10 questions in a row without a mistake!',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'global_solver',
    label: '🌍 Global Solver',
    description: 'Complete every phase of the Method Masters curriculum!',
    condition: (s) =>
      s.phaseComplete?.wonder &&
      s.phaseComplete?.story &&
      s.phaseComplete?.simulate &&
      s.phaseComplete?.practice &&
      s.phaseComplete?.reflect,
  },
  {
    id: 'error_detective',
    label: '🕵️ Error Detective',
    description: 'Solve 5 error analysis challenges correctly!',
    condition: (s) => (s.errorDetectiveCount || 0) >= 5,
  },
  {
    id: 'efficiency_expert',
    label: '⚡ Efficiency Expert',
    description: 'Identify the most efficient method 5 times on the first try!',
    condition: (s) => (s.efficiencyCount || 0) >= 5,
  },
];

export function checkBadges(state) {
  const currentUnlocked = state.unlockedBadges || [];
  const newlyUnlocked = [];

  for (const badge of BADGES) {
    if (!currentUnlocked.includes(badge.id)) {
      if (badge.condition(state)) {
        newlyUnlocked.push(badge.id);
      }
    }
  }

  return newlyUnlocked;
}

