import { randInt, pick, shuffle } from '../rng.js';
import { toDisplay, toSpeech } from '../../utils/mathText.js';

export function genQ10(rng, tier, ctx) {
  const scenario = pick(rng, ['distribute_divide', 'proportion_scale', 'percent_benchmark']);

  let rawStem, correctMethod, options, reason, detail, signature;

  if (scenario === 'distribute_divide') {
    const p = randInt(rng, 3, 7);
    const q = randInt(rng, 2, 9);
    const x = randInt(rng, 3, 12);
    const r = p * (x + q);
    const eq = `${p}(x + ${q}) = ${r}`;

    rawStem = `To solve «${eq}|${eq}», which solution method is the most efficient and why?`;
    correctMethod = `Divide both sides by ${p} first, because ${r} divides cleanly and takes fewer steps`;
    const wrong1 = `Distribute ${p} first, because multiplying always gives smaller numbers`;
    const wrong2 = `Guess and test, because equations with brackets cannot be divided directly`;
    const wrong3 = `Subtract ${q} first, because brackets must be solved from inside out`;
    options = shuffle(rng, [correctMethod, wrong1, wrong2, wrong3]);
    reason = `Sofia’s divide-first method takes only 2 steps (x + ${q} = ${r / p} → x = ${x}) compared to 3 steps for distributing!`;
    detail = { eq, p, q, r, x, scenario };
    signature = `Q10|div|${p}|${q}|${x}`;
  } else if (scenario === 'proportion_scale') {
    const a = randInt(rng, 3, 6);
    const b = randInt(rng, 5, 12) * a;
    const factor = randInt(rng, 2, 5);
    const c = a * factor;
    const d = b * factor;

    rawStem = `If ${a} tokens buy ${b} tickets, how much do ${c} tickets cost? Which method is easiest without fractions?`;
    correctMethod = `Scale factor method, because ${c} is an exact whole multiple (${factor}×) of ${a}`;
    const wrong1 = `Unit rate method, because finding ${b} ÷ ${a} is always simpler`;
    const wrong2 = `Addition method, add ${c - a} tokens to ${b}`;
    const wrong3 = 'Cross subtraction method';
    options = shuffle(rng, [correctMethod, wrong1, wrong2, wrong3]);
    reason = `Since ${c} is exactly ${factor} × ${a}, multiplying ${b} × ${factor} = ${d} avoids working with intermediate decimals!`;
    detail = { a, b, c, d, factor, scenario };
    signature = `Q10|prop|${a}|${b}|${c}`;
  } else {
    const whole = randInt(rng, 4, 15) * 10;
    const pct = pick(rng, [10, 20, 25, 50]);
    const ans = Math.round((pct / 100) * whole);

    rawStem = `To find ${pct}% of ${whole} tokens, which method is fastest?`;
    correctMethod = `Benchmark mental math: break into ${pct === 10 ? 'one-tenth' : pct === 20 ? 'two tenths' : pct === 25 ? 'one-quarter' : 'one-half'} to get ${ans} directly`;
    const wrong1 = `Long multiplication: calculate ${(pct / 100).toFixed(2)} × ${whole} using column alignment`;
    const wrong2 = 'Fraction addition: add benchmarks fifty times';
    const wrong3 = 'Ratio table with 10 rows';
    options = shuffle(rng, [correctMethod, wrong1, wrong2, wrong3]);
    reason = `${pct}% is an easy benchmark of ${whole}, so calculating ${ans} takes a single mental step!`;
    detail = { whole, pct, ans, scenario };
    signature = `Q10|pct|${pct}|${whole}`;
  }

  const stem = { display: toDisplay(rawStem), speech: toSpeech(rawStem) };

  return {
    type: 'efficiency',
    family: scenario === 'distribute_divide' ? 'equation' : scenario === 'proportion_scale' ? 'proportion' : 'percent',
    tier,
    signature,
    stem,
    answerFormat: 'mcq',
    format: 'mcq',
    correctAnswer: correctMethod,
    options,
    visual: 'methodColumns',
    visualData: detail,
    hint1: {
      display: 'Look for the road that avoids messy fractions, decimals, or extra steps!',
      speech: 'Look for the road that avoids extra steps or fractions.',
    },
    hint2: {
      display: 'Smart math solvers look at the numbers first before choosing their tool!',
      speech: 'Check which method gives the simplest mental calculation.',
    },
    explanation: {
      display: `Efficiency Master! ${reason}`,
      speech: `Efficiency Master! Choosing the road that fits the numbers saves time and prevents errors.`,
    },
  };
}
