import { Q, qSub, qDiv } from '../exact.js';

// Distribute form: p(x + q) = r
export function divideFirst(p, q, r) {
  const inner = qDiv(Q(r), Q(p));
  const x = qSub(inner, Q(q));
  return {
    x,
    steps: [
      { kind: 'divideBothSides', n: p, value: inner, display: `Divide both sides by ${p}: x + ${q} = ${inner.n / inner.d}` },
      { kind: 'subtractQ', n: q, value: x, display: `Subtract ${q}: x = ${x.n / x.d}` }
    ]
  };
}

export function distributeFirst(p, q, r) {
  const pq = p * q;
  const rhs = qSub(Q(r), Q(pq));
  const x = qDiv(rhs, Q(p));
  return {
    x,
    steps: [
      { kind: 'distribute', result: `${p}x + ${pq}`, display: `Distribute ${p}: ${p}x + ${pq} = ${r}` },
      { kind: 'subtractBothSides', n: pq, value: rhs, display: `Subtract ${pq}: ${p}x = ${rhs.n / rhs.d}` },
      { kind: 'divideBothSides', n: p, value: x, display: `Divide by ${p}: x = ${x.n / x.d}` }
    ]
  };
}

