import { randInt, pick, shuffle } from '../rng.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ9(rng, tier, ctx) {
  const p = randInt(rng, 2, 5);
  const q = randInt(rng, 3, 7);
  const x = randInt(rng, 3, 8);
  const r = p * (x + q);

  // Injected fault: forgot to distribute p to q
  // Correct Step 1: p*x + p*q = r
  // Faulty Step 1: p*x + q = r
  const faultyStep1 = `${p}x + ${q} = ${r}`;
  const faultyStep2 = `${p}x = ${r - q}`;
  const faultyAnswer = Math.round(((r - q) / p) * 10) / 10;
  const faultyStep3 = `x = ${faultyAnswer}`;

  const stepsList = [
    { label: 'Step 1', text: faultyStep1, isFaulty: true, reason: `Failed to multiply ${q} by ${p}. It should be ${p}x + ${p * q} = ${r}.` },
    { label: 'Step 2', text: faultyStep2, isFaulty: false },
    { label: 'Step 3', text: faultyStep3, isFaulty: false },
  ];

  const rawStem = `${ctx.name} tried to solve «${p}(x + ${q}) = ${r}|${p} times, open bracket, x plus ${q}, close bracket, equals ${r}» and got x = ${faultyAnswer}. In which step did ${ctx.name} make a mistake?`;
  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  const options = ['Step 1: Forgot to distribute to the second term', 'Step 2: Subtracted incorrectly', 'Step 3: Divided incorrectly', 'No error was made'];

  return {
    type: 'error_analysis',
    family: 'equation',
    tier,
    signature: `Q9|${p}|${q}|${x}|${r}`,
    stem,
    answerFormat: 'mcq',
    format: 'mcq',
    correctAnswer: 'Step 1: Forgot to distribute to the second term',
    options,
    visual: 'methodColumns',
    visualData: {
      steps: stepsList,
      correctSteps: [
        `Step 1: ${p}x + ${p * q} = ${r}`,
        `Step 2: ${p}x = ${r - p * q}`,
        `Step 3: x = ${x}`,
      ],
    },
    hint1: {
      display: `Check Step 1 carefully: when distributing ${p}(x + ${q}), did ${p} multiply both terms?`,
      speech: `Check Step 1: did ${p} multiply both terms inside the bracket?`,
    },
    hint2: {
      display: `${p} × x = ${p}x, but ${p} × ${q} = ${p * q}, not ${q}!`,
      speech: `${p} times ${q} equals ${p * q}, not ${q}.`,
    },
    explanation: {
      display: `Mistake in Step 1! The number outside the bracket (${p}) must be distributed to BOTH terms: ${p}(x + ${q}) = ${p}x + ${p * q}. The correct answer is x = ${x}.`,
      speech: `Mistake in Step 1! The number outside must multiply both terms.`,
    },
  };
}

