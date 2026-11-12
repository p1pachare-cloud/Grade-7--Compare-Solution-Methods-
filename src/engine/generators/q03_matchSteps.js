import { randInt, pick, shuffle } from '../rng.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ3(rng, tier, ctx) {
  const p = randInt(rng, 2, 7);
  const q = randInt(rng, 4, 14);
  const x = randInt(rng, 2, 8);
  const r = p * x + q;
  const eq = `${p}x + ${q} = ${r}`;

  const pairs = [
    {
      algebra: `Subtract ${q} from both sides (${p}x = ${r - q})`,
      arithmetic: `Undo the extra ${q} tokens (${r} − ${q} = ${r - q})`,
    },
    {
      algebra: `Divide both sides by ${p} (x = ${x})`,
      arithmetic: `Share the remaining ${r - q} into ${p} equal groups (${r - q} ÷ ${p} = ${x})`,
    },
  ];

  // For match format: Question stem asks to match the counterpart of a specific step
  const targetPair = pick(rng, pairs);
  const askAlgebra = pick(rng, [true, false]);

  const targetStep = askAlgebra ? targetPair.algebra : targetPair.arithmetic;
  const correctMatch = askAlgebra ? targetPair.arithmetic : targetPair.algebra;

  const decoy1 = askAlgebra
    ? `Multiply ${r} by ${p}`
    : `Multiply both sides by ${p}`;
  const decoy2 = askAlgebra
    ? `Add ${q} to ${r}`
    : `Add ${q} to both sides`;
  const otherMatch = askAlgebra
    ? (targetPair === pairs[0] ? pairs[1].arithmetic : pairs[0].arithmetic)
    : (targetPair === pairs[0] ? pairs[1].algebra : pairs[0].algebra);

  const options = shuffle(rng, [correctMatch, decoy1, decoy2, otherMatch]);

  const rawStem = `In solving «${eq}|${eq}», which arithmetic step corresponds to the algebra step: "${targetStep}"?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  return {
    type: 'match_steps',
    family: 'equation',
    tier,
    signature: `Q3|${p}|${q}|${r}|${targetStep.slice(0, 10)}`,
    stem,
    answerFormat: 'mcq',
    format: 'mcq',
    correctAnswer: correctMatch,
    options,
    visual: 'methodColumns',
    visualData: { eq, p, q, r, x, pairs },
    hint1: {
      display: 'Think about what operation is happening on the numbers in both methods.',
      speech: 'Think about what operation is happening on the numbers in both methods.',
    },
    hint2: {
      display: `The algebra step modifies the number by ${targetPair === pairs[0] ? q : p}. Look for the arithmetic step that does the exact same thing!`,
      speech: `Look for the arithmetic step that does the exact same calculation.`,
    },
    explanation: {
      display: `"${targetStep}" directly matches "${correctMatch}". Every algebraic balance step has a matching arithmetic undo step!`,
      speech: `Every algebraic balance step has a matching arithmetic undo step.`,
    },
  };
}

