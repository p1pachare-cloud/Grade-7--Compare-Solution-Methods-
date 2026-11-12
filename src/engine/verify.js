import { qEq, qToNumber, qIsInt } from './exact.js';

export function verify(q) {
  if (!q) return false;

  // 1. Dual solver agreement (if provided)
  if (Array.isArray(q.solverResults) && q.solverResults.length >= 2) {
    const [first, ...rest] = q.solverResults;
    if (!rest.every((v) => qEq(v, first))) return false;

    // Must match declared correctAnswer
    if (typeof q.correctAnswer === 'number' && Number.isFinite(q.correctAnswer)) {
      if (Math.abs(qToNumber(first) - q.correctAnswer) > 1e-6) return false;
    }
  }

  // 2. Plug-back check (if provided)
  if (typeof q.check === 'function') {
    if (!q.check(q.correctAnswer)) return false;
  }

  // 3. Clean numeric tier check
  if (q.tier < 3 && typeof q.correctAnswer === 'number') {
    if (!Number.isInteger(q.correctAnswer)) return false;
  }

  // 4. MCQ options sanity
  if (Array.isArray(q.options)) {
    const set = new Set(q.options.map(String));
    if (set.size !== q.options.length) return false;
    if (!set.has(String(q.correctAnswer))) return false;
  }

  // 5. Must have stem and hints
  if (!q.stem || !q.stem.display) return false;
  if (!q.hint1 || !q.hint2 || !q.explanation) return false;

  return true;
}

