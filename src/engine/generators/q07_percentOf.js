import { randInt, pick } from '../rng.js';
import { decimalMultiplier, benchmark } from '../solvers/percent.js';
import { percentDistractors } from '../distractors.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ7(rng, tier, ctx) {
  // Common clean percents
  const pctChoices = tier === 1 ? [10, 20, 25, 50] : [15, 30, 35, 40, 75];
  const pct = pick(rng, pctChoices);

  // Multiples of 20 or 40 so (pct * whole) / 100 is a clean integer
  const whole = randInt(rng, 2, 10) * (pct % 25 === 0 ? 20 : 40);
  const correct = Math.round((pct / 100) * whole);

  const solDec = decimalMultiplier(pct, whole);
  const solBar = benchmark(pct, whole);

  const rawStem = `${ctx.name} needs to calculate «${pct}%|${pct} percent» of ${whole} tokens. What is the value?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  const options = percentDistractors({ whole, pct, correct, rng });

  return {
    type: 'percent_of',
    family: 'percent',
    tier,
    signature: `Q7|${pct}|${whole}|${correct}`,
    stem,
    answerFormat: 'numeric',
    format: 'numeric',
    correctAnswer: correct,
    options,
    solverResults: [solDec, solBar.value],
    visual: 'barModel',
    visualData: { whole, pct, correct },
    methods: [
      {
        id: 'barModel',
        label: 'Bar Model / Benchmark (Emma)',
        steps: [
          { display: `Find 10% of ${whole}: ${whole} ÷ 10 = ${whole / 10}`, speech: `10 percent is ${whole / 10}` },
          { display: `Combine benchmarks to get ${pct}%: = ${correct}`, speech: `Combine benchmarks to get ${correct}` },
        ],
      },
      {
        id: 'decimal',
        label: 'Decimal Multiplier (Noah)',
        steps: [
          { display: `Convert ${pct}% to decimal: ${pct / 100}`, speech: `Convert to decimal ${pct / 100}` },
          { display: `Multiply: ${pct / 100} × ${whole} = ${correct}`, speech: `Multiply to get ${correct}` },
        ],
      },
    ],
    hint1: {
      display: `Emma's method: 10% of ${whole} is ${whole / 10}. Noah's method: multiply ${whole} by ${pct / 100}.`,
      speech: `Find 10 percent first, or multiply by the decimal ${pct / 100}.`,
    },
    hint2: {
      display: `${pct / 100} × ${whole} = ${correct}.`,
      speech: `${pct / 100} times ${whole} equals ${correct}.`,
    },
    explanation: {
      display: `Both methods yield ${correct} tokens! Emma uses benchmark blocks (10% = ${whole / 10}, so ${pct}% = ${correct}). Noah uses the decimal multiplier (${pct / 100} × ${whole} = ${correct}).`,
      speech: `Both benchmark blocks and the decimal multiplier yield ${correct}.`,
    },
  };
}

