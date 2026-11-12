import { randInt, pick } from '../rng.js';
import { divideFirst, distributeFirst } from '../solvers/distribute.js';
import { finalizeOptions } from '../distractors.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ4(rng, tier, ctx) {
  const p = randInt(rng, 2, 6);
  const q = randInt(rng, 2, 8);
  const x = randInt(rng, 2, 10);
  const r = p * (x + q); // Ensures r % p === 0

  const eq = `${p}(x + ${q}) = ${r}`;
  const solDiv = divideFirst(p, q, r);
  const solDist = distributeFirst(p, q, r);

  const styleChoice = pick(rng, ['divide_first', 'distribute_first', 'both']);
  let promptText = `Solve «${eq}|${eq}». Find x by dividing first or distributing first.`;
  if (styleChoice === 'divide_first') {
    promptText = `${ctx.name} solves «${eq}|${eq}» by dividing first: x + ${q} = ${r / p}. What is x?`;
  } else if (styleChoice === 'distribute_first') {
    promptText = `${ctx.name} distributes first: ${p}x + ${p * q} = ${r}. What is x?`;
  }

  const stem = { display: toDisplay(promptText), speech: toSpeech(promptText) };

  const wrongCandidates = [
    x + q,
    Math.max(1, x - 2),
    Math.round((r - q) / p),
    r / p,
    Math.max(1, r - p * q),
  ];

  const options = finalizeOptions(wrongCandidates, x, 4, rng);

  return {
    type: 'distribute',
    family: 'equation',
    tier,
    signature: `Q4|${p}|${q}|${x}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: x,
    options,
    solverResults: [solDiv.x, solDist.x],
    visual: 'balance',
    visualData: { p, q, r, x, eq },
    methods: [
      {
        id: 'divideFirst',
        label: 'Method 1: Divide First (Sofia)',
        steps: [
          { display: `Divide both sides by ${p}: x + ${q} = ${r / p}`, speech: `Divide both sides by ${p}: x plus ${q} equals ${r / p}` },
          { display: `Subtract ${q}: x = ${x}`, speech: `Subtract ${q}: x equals ${x}` },
        ],
      },
      {
        id: 'distributeFirst',
        label: 'Method 2: Distribute First (John)',
        steps: [
          { display: `Distribute ${p}: ${p}x + ${p * q} = ${r}`, speech: `Distribute ${p}: ${p}x plus ${p * q} equals ${r}` },
          { display: `Subtract ${p * q}: ${p}x = ${r - p * q}`, speech: `Subtract ${p * q}: ${p}x equals ${r - p * q}` },
          { display: `Divide by ${p}: x = ${x}`, speech: `Divide by ${p}: x equals ${x}` },
        ],
      },
    ],
    hint1: {
      display: `Notice that ${r} divides cleanly by ${p}! ${r} ÷ ${p} = ${r / p}.`,
      speech: `Notice that ${r} divides cleanly by ${p}!`,
    },
    hint2: {
      display: `If x + ${q} = ${r / p}, subtract ${q} from ${r / p} to find x.`,
      speech: `Subtract ${q} from ${r / p} to find x.`,
    },
    explanation: {
      display: `Both methods give x = ${x}! Sofia's divide-first method only took 2 steps (${r} ÷ ${p} = ${r / p}, then ${r / p} − ${q} = ${x}). John's distribute-first method took 3 steps (${p}x + ${p * q} = ${r} → ${p}x = ${r - p * q} → x = ${x}).`,
      speech: `Both methods arrive at x equals ${x}.`,
    },
  };
}
