import { Q, qMul, qDiv } from '../exact.js';

// Given (a -> b) and new input c, find output d
// Unit Rate: k = b / a, d = k * c
export const unitRate = (a, b, c) => {
  const k = qDiv(Q(b), Q(a));
  const d = qMul(k, Q(c));
  return { k, d };
};

// Scale Factor: f = c / a, d = b * f
export const scaleFactor = (a, b, c) => {
  const f = qDiv(Q(c), Q(a));
  const d = qMul(Q(b), f);
  return { f, d };
};

