// Exact rational arithmetic helpers to avoid floating-point errors

export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export const Q = (n, d = 1) => {
  if (d === 0) throw new Error('Division by zero in Q');
  const g = gcd(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};

export const qAdd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
export const qSub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
export const qMul = (a, b) => Q(a.n * b.n, a.d * b.d);
export const qDiv = (a, b) => Q(a.n * b.d, a.d * b.n);
export const qEq = (a, b) => a.n === b.n && a.d === b.d;
export const qIsInt = (a) => a.d === 1;
export const qToNumber = (a) => a.n / a.d;
export const qFormat = (a) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);

