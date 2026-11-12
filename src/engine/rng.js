// Seeded PRNG and random helpers for procedural question generation

export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randInt = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;

export const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

export const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Stable seed for (session, world, attempt, index)
export const questionSeed = (sessionSeed, world, attempt, index, retry = 0) =>
  (sessionSeed ^
    Math.imul(world + 1, 0x9E3779B1) ^
    Math.imul(attempt + 1, 0x85EBCA6B) ^
    Math.imul(index + 1, 0xC2B2AE35) ^
    Math.imul(retry + 1, 0x27D4EB2F)) >>>
  0;

