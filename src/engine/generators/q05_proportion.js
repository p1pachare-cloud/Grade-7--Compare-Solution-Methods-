import { randInt, pick } from '../rng.js';
import { unitRate, scaleFactor } from '../solvers/proportion.js';
import { proportionDistractors } from '../distractors.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ5(rng, tier, ctx) {
  // a items cost b tokens. How many tokens do c items cost? (d)
  const k = randInt(rng, 2, 8); // unit rate
  const a = randInt(rng, 2, 6);
  const b = a * k;
  const factor = randInt(rng, 2, 5);
  const c = a * factor;
  const d = c * k;

  const solUnit = unitRate(a, b, c);
  const solScale = scaleFactor(a, b, c);

  const rawStem = `At the ${ctx.theme.item || 'market'}, ${a} ${ctx.theme.singular || 'items'} cost ${b} tokens. How many tokens do ${c} ${ctx.theme.singular || 'items'} cost?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  const options = proportionDistractors({ a, b, c, d, rng });

  return {
    type: 'proportion',
    family: 'proportion',
    tier,
    signature: `Q5|${a}|${b}|${c}|${d}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: d,
    options,
    solverResults: [solUnit.d, solScale.d],
    visual: 'doubleLine',
    visualData: { a, b, c, d, k, factor, unit: ctx.theme.singular || 'item' },
    methods: [
      {
        id: 'unitRate',
        label: 'Unit Rate (Priya)',
        steps: [
          { display: `Find cost of 1: ${b} ÷ ${a} = ${k} tokens each`, speech: `Cost of 1 is ${k} tokens` },
          { display: `Multiply by ${c}: ${c} × ${k} = ${d} tokens`, speech: `Multiply by ${c} to get ${d} tokens` },
        ],
      },
      {
        id: 'scaleFactor',
        label: 'Scale Factor (Yuki)',
        steps: [
          { display: `Find scale factor: ${c} ÷ ${a} = ${factor}× as many`, speech: `Scale factor is ${factor}` },
          { display: `Multiply cost: ${b} × ${factor} = ${d} tokens`, speech: `Multiply ${b} by ${factor} to get ${d} tokens` },
        ],
      },
    ],
    hint1: {
      display: `You can find the cost of 1 item first (${b} ÷ ${a}), or see how many times more items are being bought (${c} ÷ ${a}).`,
      speech: `Find the cost of 1 item first, or find the scale factor.`,
    },
    hint2: {
      display: `1 item costs ${k} tokens. For ${c} items, calculate ${c} × ${k}.`,
      speech: `Calculate ${c} times ${k}.`,
    },
    explanation: {
      display: `Both Priya's unit rate and Yuki's scale factor give ${d} tokens! Priya: ${b} ÷ ${a} = ${k} tokens each, and ${c} × ${k} = ${d}. Yuki: ${c} is ${factor}× greater than ${a}, so cost is ${b} × ${factor} = ${d} tokens.`,
      speech: `Both unit rate and scale factor lead to ${d} tokens.`,
    },
  };
}

