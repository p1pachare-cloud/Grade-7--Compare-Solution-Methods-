import { shuffle } from './rng.js';

export function finalizeOptions(wrongCandidates, correctVal, count = 4, rng = Math.random) {
  const options = [correctVal];
  const seen = new Set([String(correctVal)]);

  for (const c of wrongCandidates) {
    if (c === null || c === undefined || Number.isNaN(c)) continue;
    const rounded = Number.isInteger(c) ? c : Math.round(c * 10) / 10;
    const key = String(rounded);
    if (!seen.has(key)) {
      seen.add(key);
      options.push(rounded);
      if (options.length === count) break;
    }
  }

  // Fallback padding if needed
  let offset = 1;
  while (options.length < count) {
    const pad1 = typeof correctVal === 'number' ? correctVal + offset : `${correctVal}_alt${offset}`;
    const pad2 = typeof correctVal === 'number' ? correctVal - offset : `${correctVal}_sub${offset}`;
    if (!seen.has(String(pad1))) {
      seen.add(String(pad1));
      options.push(pad1);
    }
    if (options.length < count && !seen.has(String(pad2))) {
      seen.add(String(pad2));
      options.push(pad2);
    }
    offset++;
  }

  return shuffle(rng, options);
}

export function linearDistractors({ form, p, q, r, x, rng }) {
  const c = [];
  if (form === 'mul_add') {
    c.push(Math.round(r / p - q));       // divided before subtracting
    c.push(Math.round((r + q) / p));     // added instead of subtracted
    c.push(r - q);                       // forgot to divide
    c.push((r - q) * p);                 // multiplied instead of divided
  } else if (form === 'mul_sub') {
    c.push(Math.round((r - q) / p));     // subtracted instead of added
    c.push(Math.round(r / p + q));
    c.push(r + q);
  } else {
    // div_add
    c.push(Math.round((r - q) / p));     // divided instead of multiplied
    c.push(r * p - q);
    c.push(r - q + p);
  }
  return finalizeOptions(c, x, 4, rng);
}

export function proportionDistractors({ a, b, c, d, rng }) {
  const list = [];
  // Additive scaling misconception: instead of b * (c / a), student does b + (c - a)
  const additive = b + (c - a);
  if (additive !== d) list.push(additive);
  list.push(Math.round(d + (d > 10 ? 4 : 2)));
  list.push(Math.max(1, Math.round(d - (d > 10 ? 4 : 2))));
  list.push(Math.round((b * a) / c));
  return finalizeOptions(list, d, 4, rng);
}

export function percentDistractors({ whole, pct, correct, isChange = false, changeType = 'discount', rng }) {
  const list = [];
  const pctAmount = Math.round((pct / 100) * whole * 10) / 10;
  if (isChange) {
    if (changeType === 'discount') {
      // Gave discount amount instead of sale price
      list.push(pctAmount);
      // Subtracted raw percentage number
      list.push(whole - pct);
      // Added instead of subtracted
      list.push(whole + pctAmount);
    } else {
      // Increase / Tip: gave increase amount instead of total
      list.push(pctAmount);
      // Subtracted increase
      list.push(Math.max(0, whole - pctAmount));
      list.push(whole + pct);
    }
  } else {
    // Percent of
    list.push(whole - pctAmount);
    list.push(pctAmount * 2);
    list.push(Math.round(pctAmount / 2));
    list.push(pct);
  }
  return finalizeOptions(list, correct, 4, rng);
}

