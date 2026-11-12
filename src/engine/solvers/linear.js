import { Q, qAdd, qSub, qMul, qDiv } from '../exact.js';

// Method 1 — ARITHMETIC: undo operations backwards from r
export function solveBackwards(r, back /* [{op:'sub'|'add'|'mul'|'div', n}] */) {
  let v = Q(r);
  const trace = [{ from: v, op: null }];
  for (const { op, n } of back) {
    const N = Q(n);
    v =
      op === 'sub'
        ? qSub(v, N)
        : op === 'add'
        ? qAdd(v, N)
        : op === 'mul'
        ? qMul(v, N)
        : qDiv(v, N);
    trace.push({ op, n, value: v });
  }
  return { x: v, trace };
}

// Method 2 — ALGEBRAIC: balance equation ax + b = r
export function solveAlgebraic({ a, b, r }) {
  const steps = [];
  const rhs1 = qSub(r, b);
  steps.push({ kind: 'subtractBothSides', n: b, eq: { a, r: rhs1 } });
  const x = qDiv(rhs1, a);
  steps.push({ kind: 'divideBothSides', n: a, eq: { a: Q(1), r: x } });
  return { x, steps };
}

