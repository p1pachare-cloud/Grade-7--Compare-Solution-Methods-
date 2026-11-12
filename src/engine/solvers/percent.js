import { Q, qAdd, qMul } from '../exact.js';

// Method 1 — Decimal Multiplier: value = (pct / 100) * whole
export const decimalMultiplier = (pct, whole) => qMul(Q(pct, 100), Q(whole));

// Method 2 — Bar Model / Benchmarks (10%, 5%, 1% blocks)
export function benchmark(pct, whole) {
  const tenth = qMul(Q(1, 10), Q(whole));
  const twentieth = qMul(Q(1, 20), Q(whole));
  let rest = pct;
  let total = Q(0);

  const tens = Math.floor(rest / 10);
  total = qAdd(total, qMul(Q(tens), tenth));
  rest -= tens * 10;

  const fives = Math.floor(rest / 5);
  total = qAdd(total, qMul(Q(fives), twentieth));
  rest -= fives * 5;

  if (rest !== 0) {
    total = qAdd(total, qMul(Q(rest, 100), Q(whole)));
  }

  return { value: total, tens, fives, ones: rest };
}

