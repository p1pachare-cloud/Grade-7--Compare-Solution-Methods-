import { randInt, pick } from '../rng.js';
import { finalizeOptions } from '../distractors.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ6(rng, tier, ctx) {
  const k = randInt(rng, 3, 9);
  const x1 = 2;
  const x2 = 4;
  const x3 = 5;
  const targetX = randInt(rng, 7, 12);

  const y1 = x1 * k;
  const y2 = x2 * k;
  const y3 = x3 * k;
  const targetY = targetX * k;

  const askK = pick(rng, [false, false, true]);

  const tableData = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
    { x: targetX, y: '?' },
  ];

  let rawStem, ans, wrongList;
  if (askK) {
    rawStem = `The table shows a proportional relationship «y = kx|y equals k x». What is the constant of proportionality k?`;
    ans = k;
    wrongList = [k + 2, Math.max(1, k - 1), Math.round(y1 - x1), k + 4];
  } else {
    rawStem = `The ratio table shows values where «y = kx|y equals k x». Using the table, what is the value of y when x = ${targetX}?`;
    ans = targetY;
    wrongList = [
      y3 + (targetX - x3),
      targetY - k,
      targetY + k,
      targetX + k,
    ];
  }

  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };
  const options = finalizeOptions(wrongList, ans, 4, rng);

  return {
    type: 'ratio_table',
    family: 'proportion',
    tier,
    signature: `Q6|${k}|${targetX}|${askK ? 'k' : 'y'}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: ans,
    options,
    visual: 'ratioTable',
    visualData: { rows: tableData, k, targetX, targetY, askK },
    hint1: {
      display: `Find the constant ratio: divide y by x for any complete column (${y1} ÷ ${x1}).`,
      speech: `Divide y by x for any column to find the constant multiplier.`,
    },
    hint2: {
      display: `Each y is ${k} times its x (k = ${k}). For x = ${targetX}, compute ${targetX} × ${k}.`,
      speech: `Each y is ${k} times its x. Multiply ${targetX} by ${k}.`,
    },
    explanation: {
      display: `The constant of proportionality is k = ${y1} ÷ ${x1} = ${k}. In this proportional relationship, y = ${k}x. For x = ${targetX}, y = ${targetX} × ${k} = ${targetY}.`,
      speech: `The constant of proportionality is ${k}, so y equals ${targetY}.`,
    },
  };
}
