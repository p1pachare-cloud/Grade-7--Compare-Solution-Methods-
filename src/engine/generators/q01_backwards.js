import { Q, qEq } from '../exact.js';
import { randInt, pick } from '../rng.js';
import { solveBackwards, solveAlgebraic } from '../solvers/linear.js';
import { linearDistractors } from '../distractors.js';
import { toDisplay, toSpeech, M } from '../../utils/mathText.js';

const LINEAR_TIERS = {
  1: { p: [2, 6], x: [2, 10], q: [1, 12], forms: ['mul_add'] },
  2: { p: [2, 9], x: [2, 14], q: [2, 20], forms: ['mul_add', 'mul_sub'] },
  3: { p: [3, 12], x: [2, 18], q: [3, 25], forms: ['mul_add', 'mul_sub'] },
};

export function genQ1(rng, tier, ctx) {
  const T = LINEAR_TIERS[tier] || LINEAR_TIERS[1];
  const form = pick(rng, T.forms);
  const p = randInt(rng, ...T.p);
  const x = randInt(rng, ...T.x);
  const q = randInt(rng, ...T.q);

  let r, eqText, backSteps, aVal, bVal;
  if (form === 'mul_add') {
    r = p * x + q;
    eqText = `${p}x + ${q} = ${r}`;
    backSteps = [{ op: 'sub', n: q }, { op: 'div', n: p }];
    aVal = Q(p);
    bVal = Q(q);
  } else {
    r = p * x - q;
    eqText = `${p}x − ${q} = ${r}`;
    backSteps = [{ op: 'add', n: q }, { op: 'div', n: p }];
    aVal = Q(p);
    bVal = Q(-q);
  }

  const solA = solveBackwards(r, backSteps);
  const solB = solveAlgebraic({ a: aVal, b: bVal, r: Q(r) });

  const rawStem = `${ctx.name} solves the equation «${eqText}|${eqText}» by working backwards without writing algebra. What is the value of x?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  const options = linearDistractors({ form, p, q, r, x, rng });

  return {
    type: 'solve_backwards',
    family: 'equation',
    tier,
    signature: `Q1|${form}|${p}|${q}|${x}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: x,
    options,
    visual: 'machine',
    visualData: { form, p, q, r, x },
    solverResults: [solA.x, solB.x],
    check: (ans) => {
      const v = Number(ans);
      return form === 'mul_add' ? p * v + q === r : p * v - q === r;
    },
    methods: [
      {
        id: 'arithmetic',
        label: 'Arithmetic (Backwards)',
        steps: [
          { display: `Start at ${r}`, speech: `Start at ${r}` },
          {
            display: form === 'mul_add' ? `Subtract ${q} to get ${r - q}` : `Add ${q} to get ${r + q}`,
            speech: form === 'mul_add' ? `Subtract ${q} to get ${r - q}` : `Add ${q} to get ${r + q}`,
          },
          {
            display: `Divide by ${p} to get x = ${x}`,
            speech: `Divide by ${p} to get x equals ${x}`,
          },
        ],
      },
      {
        id: 'algebraic',
        label: 'Algebraic (Balance)',
        steps: [
          { display: eqText, speech: eqText },
          {
            display: form === 'mul_add' ? `${p}x = ${r - q}` : `${p}x = ${r + q}`,
            speech: form === 'mul_add' ? `${p}x equals ${r - q}` : `${p}x equals ${r + q}`,
          },
          { display: `x = ${x}`, speech: `x equals ${x}` },
        ],
      },
    ],
    hint1: {
      display: `Work backwards from ${r}: undo the ${form === 'mul_add' ? '+' : '−'} ${q} first!`,
      speech: `Work backwards from ${r}: undo the ${form === 'mul_add' ? 'plus' : 'minus'} ${q} first!`,
    },
    hint2: {
      display: form === 'mul_add' ? `${r} − ${q} = ${r - q}, then divide by ${p}.` : `${r} + ${q} = ${r + q}, then divide by ${p}.`,
      speech: form === 'mul_add' ? `${r} minus ${q} equals ${r - q}, then divide by ${p}.` : `${r} plus ${q} equals ${r + q}, then divide by ${p}.`,
    },
    explanation: {
      display: `Both roads lead to ${x}! Arithmetic: undo the operations backwards (${r} ${form === 'mul_add' ? '−' : '+'} ${q} = ${form === 'mul_add' ? r - q : r + q}, then ÷ ${p} = ${x}). Algebraic: isolate x using inverse operations.`,
      speech: `Both roads lead to ${x}! By undoing operations backwards or using inverse operations, x is ${x}.`,
    },
  };
}

