import { randInt, pick } from '../rng.js';
import { percentDistractors } from '../distractors.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ8(rng, tier, ctx) {
  const changeType = pick(rng, ['discount', 'increase', 'tip']);
  const pct = pick(rng, [10, 15, 20, 25, 30]);
  const whole = randInt(rng, 2, 8) * (pct === 15 || pct === 25 ? 40 : 20);

  const delta = Math.round((pct / 100) * whole);
  let correct, promptText;

  if (changeType === 'discount') {
    correct = whole - delta;
    promptText = `A concert jacket originally priced at ${whole} tokens is on a «${pct}% discount|${pct} percent discount». What is the sale price?`;
  } else if (changeType === 'increase') {
    correct = whole + delta;
    promptText = `A collectable festival pass costs ${whole} tokens. The price increases by «${pct}%|${pct} percent». What is the new price?`;
  } else {
    // tip
    correct = whole + delta;
    promptText = `At the festival cafe, ${ctx.name}'s meal costs ${whole} tokens. With an added «${pct}% tip|${pct} percent tip», what is the total paid?`;
  }

  const stem = { display: toDisplay(promptText), speech: toSpeech(promptText) };
  const options = percentDistractors({
    whole,
    pct,
    correct,
    isChange: true,
    changeType,
    rng,
  });

  return {
    type: 'percent_change',
    family: 'percent',
    tier,
    signature: `Q8|${changeType}|${pct}|${whole}|${correct}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: correct,
    options,
    visual: 'barModel',
    visualData: { whole, pct, delta, correct, changeType },
    methods: [
      {
        id: 'twoStep',
        label: 'Method 1: Two-Step (Find & Combine)',
        steps: [
          { display: `Find ${pct}% of ${whole}: ${delta} tokens`, speech: `${pct} percent is ${delta} tokens` },
          {
            display: changeType === 'discount' ? `${whole} − ${delta} = ${correct}` : `${whole} + ${delta} = ${correct}`,
            speech: changeType === 'discount' ? `${whole} minus ${delta} equals ${correct}` : `${whole} plus ${delta} equals ${correct}`,
          },
        ],
      },
      {
        id: 'oneStep',
        label: 'Method 2: One-Step (Single Multiplier)',
        steps: [
          {
            display: changeType === 'discount' ? `Paying (100 − ${pct})% = ${100 - pct}%` : `Total is (100 + ${pct})% = ${100 + pct}%`,
            speech: changeType === 'discount' ? `Paying ${100 - pct} percent` : `Paying ${100 + pct} percent`,
          },
          {
            display: `Multiply: ${(changeType === 'discount' ? 100 - pct : 100 + pct) / 100} × ${whole} = ${correct}`,
            speech: `Multiply to get ${correct}`,
          },
        ],
      },
    ],
    hint1: {
      display: `First calculate ${pct}% of ${whole} (${delta} tokens). Then ${changeType === 'discount' ? 'subtract it from' : 'add it to'} ${whole}.`,
      speech: `Calculate ${pct} percent of ${whole}, then ${changeType === 'discount' ? 'subtract' : 'add'}.`,
    },
    hint2: {
      display: changeType === 'discount' ? `${whole} − ${delta} = ${correct} tokens.` : `${whole} + ${delta} = ${correct} tokens.`,
      speech: changeType === 'discount' ? `${whole} minus ${delta} equals ${correct}.` : `${whole} plus ${delta} equals ${correct}.`,
    },
    explanation: {
      display: `Both the two-step method (${whole} ${changeType === 'discount' ? '−' : '+'} ${delta} = ${correct}) and the single multiplier method (${(changeType === 'discount' ? 100 - pct : 100 + pct) / 100} × ${whole} = ${correct}) give the correct final amount of ${correct} tokens!`,
      speech: `The final amount is ${correct} tokens.`,
    },
  };
}

