import { randInt, pick, shuffle } from '../rng.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ2(rng, tier, ctx) {
  const p = randInt(rng, 2, 8);
  const q = randInt(rng, 3, 15);
  const x = randInt(rng, 3, 10);
  const isAdd = pick(rng, [true, false]);

  const r = isAdd ? p * x + q : p * x - q;
  const eqText = isAdd ? `${p}x + ${q} = ${r}` : `${p}x − ${q} = ${r}`;

  const correctOp = isAdd
    ? `Subtract ${q} from both sides, then divide both sides by ${p}`
    : `Add ${q} to both sides, then divide both sides by ${p}`;

  const wrong1 = isAdd
    ? `Divide both sides by ${p}, then subtract ${q}`
    : `Divide both sides by ${p}, then add ${q}`;

  const wrong2 = isAdd
    ? `Add ${q} to both sides, then divide both sides by ${p}`
    : `Subtract ${q} from both sides, then divide both sides by ${p}`;

  const wrong3 = isAdd
    ? `Subtract ${q} from both sides, then multiply both sides by ${p}`
    : `Add ${q} to both sides, then multiply both sides by ${p}`;

  const options = shuffle(rng, [correctOp, wrong1, wrong2, wrong3]);

  const rawStem = `Which is the correct sequence of inverse operations to solve «${eqText}|${eqText}»?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  return {
    type: 'inverse_ops',
    family: 'equation',
    tier,
    signature: `Q2|${isAdd ? 'add' : 'sub'}|${p}|${q}|${r}`,
    stem,
    answerFormat: 'mcq',
    format: 'mcq',
    correctAnswer: correctOp,
    options,
    visual: 'balance',
    visualData: { p, q, r, isAdd },
    hint1: {
      display: `Look at the side with x. First undo the ${isAdd ? 'addition of ' + q : 'subtraction of ' + q}.`,
      speech: `Look at the side with x. First undo the ${isAdd ? 'addition of ' + q : 'subtraction of ' + q}.`,
    },
    hint2: {
      display: `To undo ${isAdd ? '+' + q : '−' + q}, use ${isAdd ? '−' + q : '+' + q}. Then undo multiplication by ${p} with division.`,
      speech: `To undo ${isAdd ? 'plus ' + q : 'minus ' + q}, use ${isAdd ? 'minus ' + q : 'plus ' + q}. Then divide by ${p}.`,
    },
    explanation: {
      display: `Correct! ${correctOp}. This isolates the term with x first, then isolates x itself to get x = ${x}.`,
      speech: `Correct! ${correctOp}. This isolates x to get ${x}.`,
    },
  };
}

