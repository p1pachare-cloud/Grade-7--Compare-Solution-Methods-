# Technical Requirements Document (TRD)

## Compare Solution Methods — Equations, Proportions & Percents | Grade 7 Math

### Intellia SG | Global Grade 7 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, question-generation engine, simulation logic, gamification, audio pipeline, deployment and quality standards for **"Method Masters — Compare Solution Methods"**.

- **Stack:** React 18 + Vite + JSX + Tailwind, structured like the reference repository **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>** (`public/assets`, `scripts`, `src`, `index.html`, `package.json`, `postcss.config.js`, `tailwind.config.js`, `vite.config.js`)
- **UI:** strictly matches **<https://grade5-time-intervals.vercel.app/>** (layout, phase tracker, bottom bar, cards, palette, type, animation feel)
- **Delivery:** static Vite build on Vercel plus one serverless function (audio proxy), embedded in the Intellia course page (Section 11)
- **Audio:** ElevenLabs only, implementing `audio_generation_pipeline.md`, extended for procedurally generated questions (Section 9)

**Key difference from the Grade 5 module:** the Grade 5 module used a stored question bank. This module **generates every question procedurally** from seeded templates and verifies each one with two independent solvers, so correctness is guaranteed even though the content is never the same twice.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| UI framework | React 18 (JSX) + Vite | Matches reference repo |
| State | `useReducer` + `useState` | Enough for one module |
| Styling | Tailwind + `App.css` | Reference repo already has `tailwind.config.js` and `postcss.config.js` |
| Icons | Lucide React | As in the Grade 5 spec |
| Animation | CSS keyframes and transitions | No extra dependency; same feel as reference |
| Diagrams | Inline SVG React components | Balance scale, bar model, tables, number lines |
| Drag & drop | Pointer Events (custom hook) + tap-tap fallback | Touch and keyboard accessible, no library |
| Exact maths | Integer/rational arithmetic (`Q` helper), never floating point for checking | Avoids 0.1 + 0.2 errors |
| Persistence | `localStorage` (session) + IndexedDB (audio cache) | No backend |
| Audio | ElevenLabs via static `.mp3` + serverless proxy; HTML5 `Audio` playback | Per pipeline |
| Testing | Vitest, React Testing Library, jsdom, axe | Property tests for the generator |
| Hosting | Vercel (static + `api/` function) | Reference app is on Vercel |

> **Dependency versions:** copy `package.json` from the Grade 5 repo as the base so toolchain versions match, then add `vitest`, `@testing-library/react`, `jsdom` and `axe-core` as dev dependencies.

---

## 3. Project Structure (mirrors the Grade 5 repo)

```
grade7-compare-methods/
├── public/
│   └── assets/
│       ├── audio/                          # Pre-generated .mp3 (ElevenLabs)
│       └── images/
│           ├── balo-idle.svg  balo-happy.svg  balo-thinking.svg
│           ├── balo-celebrate.svg  balo-encourage.svg  balo-curious.svg
│           ├── world-map-bg.svg
│           └── cities/ cairo.svg mumbai.svg berlin.svg sydney.svg rio.svg
│                       tokyo.svg paris.svg newyork.svg capetown.svg reykjavik.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                             # Root, global reducer
│   ├── App.css                             # Global styles (tokens from reference)
│   ├── components/
│   │   ├── IntroScreen.jsx                 # Welcome + audio-unlock Start button
│   │   ├── ProgressMap.jsx                 # 6-phase dot tracker (top bar)
│   │   ├── MethodCardsDrawer.jsx           # Glossary drawer
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx
│   │   │   ├── StoryPhase.jsx
│   │   │   ├── SimulatePhase.jsx           # Station wrapper + learn-first gating
│   │   │   ├── PlayPhase.jsx               # IntelliPlay engine
│   │   │   └── ReflectPhase.jsx
│   │   ├── simulations/
│   │   │   ├── BalanceScaleLab.jsx         # Station A
│   │   │   ├── SideBySideSolver.jsx        # Station B
│   │   │   ├── PickAndProve.jsx            # Station C
│   │   │   └── GradualRelease.jsx          # Watch → Together → Alone controller
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx        # Dispatch by answerFormat
│   │   │   ├── McqQuestion.jsx
│   │   │   ├── NumericQuestion.jsx
│   │   │   ├── OrderStepsQuestion.jsx
│   │   │   ├── MatchStepsQuestion.jsx
│   │   │   ├── FindFaultQuestion.jsx
│   │   │   ├── HintOverlay.jsx
│   │   │   └── FeedbackOverlay.jsx
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx  StarRating.jsx  StreakCounter.jsx
│   │   │   ├── BadgePanel.jsx  WorldMap.jsx  ResultsSummary.jsx
│   │   └── shared/
│   │       ├── Mascot.jsx                  # Balo
│   │       ├── BalanceScale.jsx            # SVG scale with tilt
│   │       ├── FunctionMachine.jsx         # Forward / reverse flow
│   │       ├── BarModel.jsx                # Percent bar
│   │       ├── DoubleNumberLine.jsx
│   │       ├── RatioTable.jsx
│   │       ├── MethodColumns.jsx           # Side-by-side steps with threads
│   │       ├── StepCard.jsx
│   │       ├── MathText.jsx                # Renders display form, aria-label = speech form
│   │       ├── AudioButton.jsx
│   │       └── Confetti.jsx
│   ├── engine/                             # Question generation (pure JS, no React)
│   │   ├── rng.js                          # Seeded PRNG + helpers
│   │   ├── exact.js                        # Q (rational) arithmetic, gcd
│   │   ├── solvers/
│   │   │   ├── linear.js                   # Backwards + algebraic solvers
│   │   │   ├── distribute.js               # Divide-first + distribute-first
│   │   │   ├── proportion.js               # Unit rate + scale factor
│   │   │   └── percent.js                  # Bar model + decimal multiplier
│   │   ├── generators/
│   │   │   ├── q1_backwards.js   q2_inverseOps.js   q3_matchSteps.js
│   │   │   ├── q4_distribute.js  q5_proportion.js   q6_ratioTable.js
│   │   │   ├── q7_percentOf.js   q8_percentChange.js
│   │   │   ├── q9_errorAnalysis.js  q10_efficiency.js
│   │   ├── distractors.js                  # Misconception-based wrong options
│   │   ├── methodCost.js                   # Step/complexity counter for Q10
│   │   ├── worldPlan.js                    # Worlds → type counts → tier ramp
│   │   ├── context.js                      # Names, cities, objects, tokens
│   │   ├── verify.js                       # Dual-solver verification
│   │   └── buildWorld.js                   # Assemble 10 questions with de-dupe
│   ├── data/
│   │   ├── storyContent.js                 # Wonder + 7 panels (source strings)
│   │   ├── narrationSource.js              # ALL fixed narrated strings (single source)
│   │   ├── methodCards.js                  # Glossary entries
│   │   └── badges.js
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useGameState.js
│   │   ├── useLocalStorage.js
│   │   └── usePointerDrag.js
│   └── utils/
│       ├── audio.js                        # Playback engine + queue (per pipeline)
│       ├── audioMap.js                     # AUTO-GENERATED: text → .mp3 path
│       ├── narration.js                    # Phase scripts built from narrationSource
│       ├── mathText.js                     # «display|speech» compile helpers
│       ├── scoring.js
│       ├── badgeEngine.js
│       ├── shuffle.js
│       └── embed.js                        # postMessage to parent course page
├── scripts/
│   ├── generate_audio.js
│   └── clean_audio.js
├── api/
│   └── elevenlabs.js                       # Serverless audio proxy
├── tests/                                  # Vitest suites (Section 15)
├── index.html
├── package.json  postcss.config.js  tailwind.config.js  vite.config.js
├── vercel.json                             # CSP frame-ancestors, cache headers
├── .env.local                              # ELEVENLABS_API_KEY (never committed)
├── audio_generation_pipeline.md            # Provided pipeline document
├── grade7_compare_solution_methods_prd.md
└── grade7_compare_solution_methods_trd.md
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx`, `useReducer`)

```js
const initialState = {
  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,             // 0–6
  currentStation: 0,         // 0=A, 1=B, 2=C
  currentRound: 0,           // 0=Equation, 1=Proportion, 2=Percent
  releaseStage: 'watch',     // 'watch'|'together'|'alone'
  stationRoundsComplete: [[false,false,false],[false,false,false],[false,false,false]],
  stationBPerfect: true,

  // Play
  sessionSeed: 0,            // 32-bit, from crypto.getRandomValues
  currentWorld: 0,           // 0–9
  worldQuestions: Array(10).fill(null),   // generated lazily per world
  currentIndex: 0,           // 0–9 within world
  worldScores: Array(10).fill(null),
  worldAttempts: Array(10).fill(0),       // replays draw fresh questions
  attemptCount: 0,           // attempts on current question (max 3)
  hintsUsed: 0,
  usedSignatures: [],        // this session + recent sessions (dedupe)
  questionLog: [],           // {type, family, correct, attempts, ms}

  // Gamification
  xp: 0, totalStars: 0, streak: 0, maxStreak: 0,
  badges: [],
  errorDetectiveCount: 0,    // correct Q9
  efficiencyCount: 0,        // first-try correct Q10

  // Meta
  phaseComplete: { wonder:false, story:false, simulate:false, play:false, reflect:false },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,
  reducedMotion: false,
};
```

### 4.2 Reducer Actions

```js
export const ACTIONS = {
  SET_PHASE, NEXT_STORY_PANEL,
  SET_RELEASE_STAGE, COMPLETE_ROUND, ADVANCE_STATION,
  ENTER_WORLD,            // generates 10 questions for the world
  ANSWER_CORRECT, ANSWER_INCORRECT, USE_HINT, NEXT_QUESTION,
  FINISH_WORLD, REPLAY_WORLD,
  UNLOCK_BADGE, COMPLETE_PHASE,
  TOGGLE_AUDIO, RESTORE_SESSION, RESET_SESSION,
};
```

### 4.3 Key Reducer Logic

```js
case ACTIONS.ENTER_WORLD: {
  const w = action.world;
  const attempt = state.worldAttempts[w];
  const { questions, signatures } = buildWorld({
    worldIndex: w,
    sessionSeed: state.sessionSeed,
    attempt,                         // different seed on replay
    used: new Set(state.usedSignatures),
  });
  const wq = [...state.worldQuestions]; wq[w] = questions;
  return { ...state, currentWorld: w, currentIndex: 0, attemptCount: 0, hintsUsed: 0,
           worldQuestions: wq,
           usedSignatures: [...state.usedSignatures, ...signatures] };
}

case ACTIONS.ANSWER_CORRECT: {
  const q = state.worldQuestions[state.currentWorld][state.currentIndex];
  const firstTry = state.attemptCount === 0;
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak)
                 + (firstTry && ['match_steps','error_analysis','efficiency'].includes(q.type) ? 3 : 0);
  const ws = [...state.worldScores];
  ws[state.currentWorld] = (ws[state.currentWorld] || 0) + 1;
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: state.streak + 1,
    maxStreak: Math.max(state.maxStreak, state.streak + 1),
    worldScores: ws,
    totalStars: calcTotalStars(ws),
    errorDetectiveCount: state.errorDetectiveCount + (q.type === 'error_analysis' ? 1 : 0),
    efficiencyCount: state.efficiencyCount + (q.type === 'efficiency' && firstTry ? 1 : 0),
    questionLog: [...state.questionLog, { type:q.type, family:q.family, correct:true, attempts:state.attemptCount+1 }],
    attemptCount: 0, hintsUsed: 0,
  };
}

case ACTIONS.ANSWER_INCORRECT:
  return { ...state, streak: 0, attemptCount: state.attemptCount + 1 };   // no score penalty
```

---

## 5. Question Generation Engine (`src/engine/`)

### 5.1 Seeded Randomness (`rng.js`)

```js
export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const randInt = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;
export const pick    = (rng, arr) => arr[Math.floor(rng() * arr.length)];
export const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
// Per-question seed: stable for (session, world, attempt, index) but different for each
export const questionSeed = (sessionSeed, world, attempt, index, retry = 0) =>
  (sessionSeed ^ Math.imul(world + 1, 0x9E3779B1) ^ Math.imul(attempt + 1, 0x85EBCA6B)
   ^ Math.imul(index + 1, 0xC2B2AE35) ^ Math.imul(retry + 1, 0x27D4EB2F)) >>> 0;
```

`sessionSeed` comes from `crypto.getRandomValues(new Uint32Array(1))[0]`, so two sessions never share a seed in practice. Seeds make every question **reproducible for debugging** (`?seed=1234` URL flag in dev builds).

### 5.2 Exact Arithmetic (`exact.js`)

All checking is done with rationals, never floats.

```js
export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const Q = (n, d = 1) => {
  const g = gcd(n, d) || 1, s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};
export const qAdd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
export const qSub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
export const qMul = (a, b) => Q(a.n * b.n, a.d * b.d);
export const qDiv = (a, b) => Q(a.n * b.d, a.d * b.n);
export const qEq  = (a, b) => a.n === b.n && a.d === b.d;
export const qIsInt = (a) => a.d === 1;
export const qToNumber = (a) => a.n / a.d;
```

### 5.3 Tier Parameters

```js
export const LINEAR_TIERS = {
  1: { p: [2, 6],  x: [2, 12],   q: [1, 12],  forms: ['mul_add'] },
  2: { p: [2, 9],  x: [-6, 15],  q: [2, 25],  forms: ['mul_add', 'mul_sub', 'div_add'] },
  3: { p: [3, 12], x: [-12, 20], q: [5, 40],  forms: ['mul_add', 'mul_sub', 'div_add'] },
};
export const DIST_TIERS = {            // p(x + q) = r
  1: { p: [2, 5],  x: [2, 10],  q: [1, 6]  },
  2: { p: [2, 9],  x: [-5, 12], q: [-8, 10] },
  3: { p: [3, 12], x: [-10, 20], q: [-15, 18] },
};
export const PROP_TIERS = {            // y = kx with integer-friendly k
  1: { k: [2, 9],  a: [2, 6],  c: [7, 12],  kHalf: false },
  2: { k: [3, 15], a: [3, 9],  c: [10, 20], kHalf: false },
  3: { k: [2, 14], a: [4, 12], c: [11, 30], kHalf: true  },   // k may end in .5
};
export const PCT_TIERS = {
  1: { pct: [10, 20, 25, 50, 75],                       whole: [20, 200],  step: 'integer' },
  2: { pct: [5, 15, 30, 35, 40, 45, 60],                whole: [40, 400],  step: 'integer' },
  3: { pct: [12, 18, 35, 45, 65, 85, 120, 150],         whole: [40, 600],  step: 'oneDecimal' },
};
```

### 5.4 Solvers — Two Independent Methods per Family

**Equations `ax + b = r` (`solvers/linear.js`)**

```js
// Method 1 — ARITHMETIC: undo operations in reverse order starting from r.
export function solveBackwards(r, back /* [{op:'sub'|'add'|'mul'|'div', n}] */) {
  let v = Q(r);
  const trace = [{ from: v, op: null }];
  for (const { op, n } of back) {
    const N = Q(n);
    v = op === 'sub' ? qSub(v, N) : op === 'add' ? qAdd(v, N)
      : op === 'mul' ? qMul(v, N) : qDiv(v, N);
    trace.push({ op, n, value: v });
  }
  return { x: v, trace };
}

// Method 2 — ALGEBRAIC: keep the equation  a·x + b = r  balanced.
export function solveAlgebraic({ a, b, r }) {           // a, b, r are Q rationals
  const steps = [];
  const rhs1 = qSub(r, b);
  steps.push({ kind: 'subtractBothSides', n: b, eq: { a, r: rhs1 } });
  const x = qDiv(rhs1, a);
  steps.push({ kind: 'divideBothSides', n: a, eq: { a: Q(1), r: x } });
  return { x, steps };
}
```

**Distribute forms `p(x + q) = r` (`solvers/distribute.js`)**

```js
export function divideFirst(p, q, r) {                 // x + q = r/p → x = r/p − q
  const inner = qDiv(Q(r), Q(p));
  return { x: qSub(inner, Q(q)),
           steps: [{ kind: 'divideBothSides', n: p, value: inner },
                   { kind: 'subtractQ', n: q, value: qSub(inner, Q(q)) }] };
}
export function distributeFirst(p, q, r) {             // px + pq = r → px = r − pq → x = …
  const pq = Q(p * q), rhs = qSub(Q(r), pq);
  return { x: qDiv(rhs, Q(p)),
           steps: [{ kind: 'distribute', result: `${p}x + ${p * q}` },
                   { kind: 'subtractBothSides', n: p * q, value: rhs },
                   { kind: 'divideBothSides', n: p, value: qDiv(rhs, Q(p)) }] };
}
```

**Proportion (`solvers/proportion.js`)**

```js
// Given (a → b) and new input c, find d.
export const unitRate    = (a, b, c) => ({ k: qDiv(Q(b), Q(a)), d: qMul(qDiv(Q(b), Q(a)), Q(c)) });
export const scaleFactor = (a, b, c) => ({ f: qDiv(Q(c), Q(a)), d: qMul(Q(b), qDiv(Q(c), Q(a))) });
```

**Percent (`solvers/percent.js`)**

```js
export const decimalMultiplier = (pct, whole) => qMul(Q(pct, 100), Q(whole));
// Bar model / benchmark: build pct from 10% and 5% blocks of the whole.
export function benchmark(pct, whole) {
  const tenth = qMul(Q(1, 10), Q(whole)), twentieth = qMul(Q(1, 20), Q(whole));
  let rest = pct, total = Q(0), blocks = [];
  const tens = Math.floor(rest / 10);   total = qAdd(total, qMul(Q(tens), tenth));      rest -= tens * 10;
  const fives = Math.floor(rest / 5);   total = qAdd(total, qMul(Q(fives), twentieth)); rest -= fives * 5;
  if (rest !== 0) total = qAdd(total, qMul(Q(rest, 100), Q(whole)));   // 1% blocks for hard tier
  return { value: total, tens, fives, ones: rest };
}
```

### 5.5 Generator Pattern (example: Q1, `generators/q1_backwards.js`)

```js
const FORMS = {
  mul_add: (p, x, q) => ({ r: p * x + q, text: `${p}x + ${q}`,  a: Q(p),    b: Q(q),  back: [{op:'sub',n:q},{op:'div',n:p}], x }),
  mul_sub: (p, x, q) => ({ r: p * x - q, text: `${p}x − ${q}`,  a: Q(p),    b: Q(-q), back: [{op:'add',n:q},{op:'div',n:p}], x }),
  div_add: (p, k, q) => ({ r: k + q,     text: `x/${p} + ${q}`, a: Q(1, p), b: Q(q),  back: [{op:'sub',n:q},{op:'mul',n:p}], x: p * k }),
};

export function genQ1(rng, tier, ctx) {
  const T = LINEAR_TIERS[tier];
  const form = pick(rng, T.forms);
  const p = randInt(rng, ...T.p);
  let base = randInt(rng, ...T.x); if (base === 0) base = randInt(rng, 2, 5);   // avoid trivial 0
  const q = randInt(rng, ...T.q);
  const f = FORMS[form](p, form === 'div_add' ? Math.abs(base) + 1 : base, q);

  const eq = `${f.text} = ${f.r}`;
  const a = solveBackwards(f.r, f.back);
  const b = solveAlgebraic({ a: f.a, b: f.b, r: Q(f.r) });

  return {
    type: 'solve_backwards', family: 'equation', tier,
    signature: `Q1|${form}|${p}|${q}|${f.x}`,
    stem: M(`Solve ${eq} by working backwards.`, speakEq(eq, 'Solve', 'by working backwards')),
    answerFormat: 'numeric',
    correctAnswer: f.x,
    methods: [ methodFromBackwards(a), methodFromAlgebraic(b) ],
    solverResults: [a.x, b.x],                 // checked in verify()
    check: (x) => qEq(substitute(form, p, q, Q(x)), Q(f.r)),   // plug-back check
    distractors: linearDistractors({ form, p, q, r: f.r, x: f.x }),
    hint1: ..., hint2: ..., explanation: ...,
  };
}
```

All ten generators return the shape in Section 6.

### 5.6 Generator Rules by Question Type

| Type | Id | Generation rule | Answer format |
| --- | --- | --- | --- |
| Q1 | `solve_backwards` | Pick form, p, x, q → compute r. Answer is the integer x. | numeric |
| Q2 | `inverse_ops` | Same equation; correct option is the exact ordered inverse sequence; distractors: wrong order, wrong inverse (add instead of subtract), missing step. | mcq |
| Q3 | `match_steps` | Build an algebraic trace and an arithmetic trace of the **same length** (2 for two-step, 3 for distribute-first). Student matches each Method A step to its Method B twin. Works for equation, proportion and percent families. | match |
| Q4 | `distribute` | Pick p, x, q; r = p(x + q). Student solves and answers x; explanation always shows both methods; stem alternates "divide first", "distribute first", "solve both ways and enter x". Constraint: `r % p === 0` so divide-first is clean. | numeric |
| Q5 | `proportion` | Pick k, a; b = k·a; pick c; d = k·c (must be exact for the tier). Stem is a word problem. Distractors include the **additive error** `b + (c − a)`. | mcq / numeric |
| Q6 | `ratio_table` | Table of 3 pairs sharing k, one missing; ask k or y at a new x. Hard tier includes k = n.5. | numeric / mcq |
| Q7 | `percent_of` | Pick pct and whole so the result is exact (`pct*whole % 100 === 0`; one decimal allowed in tier 3 when `% 10 === 0`). | numeric / mcq |
| Q8 | `percent_change` | Sub-type: discount (×(100−pct)/100), increase (×(100+pct)/100), tip (pct of bill), and in tier 3 "+pct then −pct" compound. Distractors: subtracting the pct as an amount, giving the discount instead of the final price, using the wrong base. | numeric / mcq |
| Q9 | `error_analysis` | Generate a correct 3-step solution, then **inject one fault** from a library (`forgetDistribute`, `signFlip`, `divideOneTermOnly`, `wrongInverse`, `percentOfWrongBase`, `additiveScaling`) at step k and continue consistently. Answer is k. Student also sees the corrected line. | find-fault |
| Q10 | `efficiency` | Create a problem where exactly one method is cheaper by `methodCost` (see 5.8). Student picks the method, then picks the reason. | mcq (2-part) |

### 5.7 Misconception-Based Distractors (`distractors.js`)

```js
export function linearDistractors({ form, p, q, r, x }) {
  const c = new Set();
  // order-of-operations errors
  if (form === 'mul_add') { c.add(r / p - q); c.add((r + q) / p); c.add(r - q); c.add((r - q) * p); }
  if (form === 'mul_sub') { c.add(r / p + q); c.add((r - q) / p); c.add(r + q); }
  if (form === 'div_add') { c.add((r - q) / p); c.add(r * p - q); c.add(r - q + p); }
  return finalizeOptions(c, x, 4);
}
// finalizeOptions: drop NaN, non-integers (unless tier 3), the correct value and duplicates;
// pad with x±1, x±p until there are 3 distinct wrong options; return shuffled [x, ...3 wrong].
```

Each wrong option carries a `misconceptionTag` (e.g. `'wrong_order'`, `'sign_error'`, `'forgot_to_distribute'`, `'additive_scaling'`, `'wrong_base'`). The feedback overlay reads the tag and shows a targeted message.

### 5.8 Method Cost for Q10 (`methodCost.js`)

```js
// Cost = number of operations + 1 per non-integer intermediate + 1 per negative intermediate.
export function methodCost(steps) {
  return steps.reduce((c, s) => c + 1 + (s.value && !qIsInt(s.value) ? 1 : 0)
                                    + (s.value && s.value.n < 0 ? 1 : 0), 0);
}
// Generator keeps only parameter sets where |costA − costB| >= 1 and the cheaper method is unique.
```

Examples: for `p(x + q) = r` with `r % p === 0`, divide-first (2 steps) beats distribute-first (3 steps). For proportion, the unit-rate route wins when `b % a === 0`; the scale-factor route wins when `c % a === 0` and `b % a !== 0`. For percent, the benchmark route wins for 10/20/25/50/75% and the decimal multiplier wins for awkward percents like 35% or 65%.

### 5.9 Verification (`verify.js`)

```js
export function verify(q) {
  // 1. Every method must reach the same answer.
  const [first, ...rest] = q.solverResults;
  if (!rest.every((v) => qEq(v, first))) return false;
  // 2. The answer must equal the declared correctAnswer.
  if (Number.isFinite(q.correctAnswer) && qToNumber(first) !== q.correctAnswer) return false;
  // 3. Plug-back check against the original problem.
  if (q.check && !q.check(qToNumber(first))) return false;
  // 4. Tier cleanliness: integer answers in tiers 1–2, at most one decimal place in tier 3.
  if (q.tier < 3 && !qIsInt(first)) return false;
  // 5. MCQ sanity: exactly one correct option, options unique, 4 options.
  if (q.options) {
    const set = new Set(q.options.map(String));
    if (set.size !== q.options.length || !set.has(String(q.correctAnswer))) return false;
  }
  return true;
}
```

### 5.10 Assembly and De-duplication (`worldPlan.js`, `buildWorld.js`)

```js
// Mirrors the PRD distribution table: [typeId, count]
export const WORLD_PLAN = [
  /* 1 */ [['Q1',5],['Q2',5]],
  /* 2 */ [['Q1',3],['Q2',3],['Q3',4]],
  /* 3 */ [['Q3',4],['Q4',6]],
  /* 4 */ [['Q1',2],['Q2',2],['Q4',4],['Q9',2]],
  /* 5 */ [['Q3',2],['Q5',6],['Q10',2]],
  /* 6 */ [['Q5',4],['Q6',6]],
  /* 7 */ [['Q6',4],['Q9',3],['Q10',3]],
  /* 8 */ [['Q7',6],['Q8',2],['Q10',2]],
  /* 9 */ [['Q7',4],['Q8',6]],
  /* 10 */[['Q8',2],['Q9',5],['Q10',3]],
];

// Tier ramp across the 10 questions of a world (easy → hard)
export const TIER_RAMP = {
  early: [1,1,1,1,2,2,2,2,3,3],   // worlds 1–5
  mid:   [1,1,1,2,2,2,2,3,3,3],   // worlds 6–9
  final: [1,1,2,2,2,2,3,3,3,3],   // world 10
};

export function buildWorld({ worldIndex, sessionSeed, attempt, used }) {
  const ramp = worldIndex < 5 ? TIER_RAMP.early : worldIndex < 9 ? TIER_RAMP.mid : TIER_RAMP.final;
  const typeSlots = shuffle(mulberry32(sessionSeed ^ worldIndex),
                            WORLD_PLAN[worldIndex].flatMap(([t, n]) => Array(n).fill(t)));
  const questions = [], signatures = [];
  typeSlots.forEach((typeId, i) => {
    const tier = ramp[i];
    for (let retry = 0; retry < 60; retry++) {
      const rng = mulberry32(questionSeed(sessionSeed, worldIndex, attempt, i, retry));
      const q = GENERATORS[typeId](rng, tier, makeContext(rng));
      if (!verify(q)) continue;                          // reject unverified
      if (used.has(q.signature) || signatures.includes(q.signature)) continue;   // reject repeats
      questions.push({ ...q, id: `${typeId}_${worldIndex}_${i}_${q.signature}`, world: worldIndex });
      signatures.push(q.signature);
      return;
    }
    throw new Error(`Could not generate ${typeId} tier ${tier}`);   // caught by tests, never in prod
  });
  return { questions: orderByTier(questions), signatures };
}
```

Parameter spaces are large enough that 60 retries is never exhausted (checked by the generator-coverage test in Section 15).

**Cross-session de-dupe:** the last three sessions' signatures (capped at about 300 strings) are persisted in `localStorage` and loaded into `used` at start.

### 5.11 Context Generator (`context.js`)

```js
export const NAMES = ['John','Mike','Sarah','Emma','Liam','Sofia','Noah','Aisha','Carlos','Yuki','Priya',
                      'Chloe','Ravi','Diego','Fatima','Amara','Lucas','Mei','Omar','Hana','Kofi','Ingrid','Mateo'];
export const WORLD_CITIES = ['Cairo','Mumbai','Berlin','Sydney','Rio de Janeiro','Tokyo','Paris','New York','Cape Town','Reykjavik'];
export const CONTEXTS = {
  rides:     { unit: 'ride',     fee: 'entry fee',   money: 'tokens' },
  tickets:   { unit: 'ticket',   money: 'tokens' },
  notebooks: { unit: 'notebook', money: 'tokens' },
  recipe:    { unit: 'cup',      noun: 'people' },
  models:    { unit: 'cm',       noun: 'scale model' },
  // ...
};
export function makeContext(rng) {
  const [n1, n2] = shuffle(rng, NAMES);        // two distinct names
  return { name: n1, other: n2, themeKey: pick(rng, Object.keys(CONTEXTS)) };
}
```

All money is "tokens"; units are metric or unitless. Pronouns are avoided in stems ("Aisha spent…", never "she").

---

## 6. Question Object Schema

```ts
interface Question {
  id: string;                       // "Q4_2_7_Q4|3|5|4"
  type: 'solve_backwards'|'inverse_ops'|'match_steps'|'distribute'|'proportion'
      | 'ratio_table'|'percent_of'|'percent_change'|'error_analysis'|'efficiency';
  family: 'equation'|'proportion'|'percent';
  world: number;                    // 0–9
  tier: 1|2|3;
  signature: string;                // dedupe key
  answerFormat: 'mcq'|'numeric'|'order'|'match'|'findFault'|'mcqTwoPart';

  stem: { display: string; speech: string };      // compiled from one «display|speech» source
  visual: 'balance'|'machine'|'barModel'|'doubleLine'|'ratioTable'|'methodColumns'|'none';
  visualData?: object;                            // props for the visual

  options?: { id: string; display: string; speech: string; tag?: string }[];
  correctAnswer: number | string | string[];      // string[] for order/match

  methods: {                                      // always ≥2 for the explanation
    id: 'arithmetic'|'algebraic'|'unitRate'|'scaleFactor'|'barModel'|'decimal'|'divideFirst'|'distributeFirst';
    label: string;
    steps: { display: string; speech: string }[];
  }[];

  hint1: { display: string; speech: string };     // names the method / what is asked
  hint2: { display: string; speech: string };     // shows the first step on the visual
  explanation: { display: string; speech: string }; // both methods, read aloud after 3 misses
  misconceptionTags?: string[];
  character?: { name: string; city?: string; context?: string };
}
```

### Sample generated questions (illustrative; every session differs)

```js
// Q1 — worked backwards
{ type:'solve_backwards', tier:1, stem:{display:'Solve 4x + 7 = 31 by working backwards.'},
  correctAnswer:6, options:[6, 24, 5, 7] /* 24 = forgot to divide (r − q); 5 and 7 = near-miss padding */ }

// Q4 — distribute
{ type:'distribute', tier:2, stem:{display:'Solve 3(x + 4) = 27. Use either method, then check it with the other.'},
  correctAnswer:5, methods:[ divideFirst: ['27 ÷ 3 = 9','x + 4 = 9','x = 5'],
                             distributeFirst: ['3x + 12 = 27','3x = 15','x = 5'] ] }

// Q5 — proportion
{ type:'proportion', tier:1, stem:{display:'Diego buys 5 notebooks for 20 tokens. How many tokens do 8 notebooks cost?'},
  correctAnswer:32, methods:[ unitRate: ['20 ÷ 5 = 4 tokens each','8 × 4 = 32'],
                              scaleFactor: ['8 ÷ 5 = 1.6','20 × 1.6 = 32'] ] }

// Q9 — error analysis
{ type:'error_analysis', tier:3, answerFormat:'findFault',
  stem:{display:'Chloe solved 2(x + 5) = 18. Which step has the mistake?'},
  steps:['2x + 5 = 18','2x = 13','x = 6.5'], correctAnswer:0,    // forgot to distribute to the 5
  explanation:{display:'The 2 must multiply both x and 5. 2x + 10 = 18, so 2x = 8 and x = 4.'} }
```

---

## 7. Simulation Components

All simulation numbers come from the same `engine/` generators (tier 1 for "watch" and "together", tier 1–2 for "alone"), so every playthrough of a station differs.

### 7.1 `GradualRelease.jsx` — Watch → Together → Alone

```js
const STAGES = ['watch', 'together', 'alone'];
// watch:    auto-plays both methods with narration; "Replay" and "I'm ready" buttons
// together: highlights the next expected action; wrong actions get a soft nudge, never a block
// alone:    fresh problem, no highlight; 3 attempts with the same hint ladder as Play
// A round completes only when 'alone' is solved. COMPLETE_ROUND is dispatched then.
```

### 7.2 Station A — `BalanceScaleLab.jsx`

```js
const [scale, setScale] = useState(initialScale(round));   // { left:{xBlocks:p, units:q}, right:{units:r} }
```

- **Equation round:** drag/tap "remove q" and "split into p groups" onto **both** pans. `BalanceScale` computes tilt from `leftWeight − rightWeight` with `x` treated as the hidden weight, so a one-sided action visibly tips the beam.
- Algebraic path and **FunctionMachine** (arithmetic path) run side by side. The machine runs in reverse: each undo step animates a token moving back through the machine. A comparison bar highlights the matching steps in both paths.
- **Proportion round:** `DoubleNumberLine` + `RatioTable`. Student chooses a multiplier (scale factor) or divides to get the unit rate; arrows animate between rows.
- **Percent round:** `BarModel` with ten tenth-blocks; clicking a block shades 10%, a half-block 5%. The decimal-multiplier readout updates live.
- **Completion check:** the revealed value equals the engine's `correctAnswer`; the student must also tap the matching "twin" step in the other method once.

### 7.3 Station B — `SideBySideSolver.jsx`

```js
const [colA, setColA] = useState(shuffle(rng, q.methods[0].steps));   // shuffled step cards
const [colB, setColB] = useState(shuffle(rng, q.methods[1].steps));
```

- Both columns accept ordering via `usePointerDrag` (plus tap-tap fallback).
- One decoy step (from the misconception library) is added to each column; the student must leave it out ("This step doesn't belong").
- When both columns are correct, `MethodColumns` draws threads between matching steps and shows each method's step count.
- `stationBPerfect` is set to `false` if any decoy is accepted or any ordering is wrong on the first check.

### 7.4 Station C — `PickAndProve.jsx`

- Presents the problem and 2–3 method cards. The student picks a method, solves with a step builder (reusing the Station B step cards), then selects a reason from three options generated alongside the question (`fewer steps`, `no fractions`, `easier to check`).
- After solving, `methodCost` for each method is shown as bars ("3 steps vs 2 steps") so students can verify their judgement.

---

## 8. Gamification Implementation

### 8.1 XP and Stars (`scoring.js`)

```js
export const calcXP = (attemptNumber, hintsUsed, streak) =>
  (attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7) + (streak >= 5 ? 5 : 0);

export const calcStars = (correct) => (correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 6 ? 1 : 0);
export const canUnlockNext = (worldScore) => worldScore !== null && worldScore >= 6;
export const calcTotalStars = (ws) => ws.reduce((s, v) => s + (v == null ? 0 : calcStars(v)), 0);
```

### 8.2 Badge Engine (`badgeEngine.js`)

```js
export const BADGES = [
  { id:'method_explorer',  label:'🏅 Method Explorer',  condition: s => s.phaseComplete.wonder && s.phaseComplete.story },
  { id:'balance_builder',  label:'🥈 Balance Builder',  condition: s => s.stationRoundsComplete.flat().every(Boolean) },
  { id:'method_master',    label:'🥇 Method Master',    condition: s => totalCorrect(s) >= 80 && s.phaseComplete.play },
  { id:'perfect_world',    label:'💎 Perfect World',    condition: s => s.worldScores.some(v => v === 10) },
  { id:'streak_star',      label:'🔥 Streak Star',      condition: s => s.maxStreak >= 10 },
  { id:'global_solver',    label:'🌍 Global Solver',    condition: s => Object.values(s.phaseComplete).every(Boolean) },
  { id:'error_detective',  label:'🕵️ Error Detective',  condition: s => s.errorDetectiveCount >= 5 },
  { id:'efficiency_expert',label:'⚡ Efficiency Expert', condition: s => s.efficiencyCount >= 5 },
];
export const checkBadges = (s) => BADGES.filter(b => !s.badges.includes(b.id) && b.condition(s)).map(b => b.id);
```

`Method Master` is evaluated at the end of Play (it needs all 100 answered); badge unlock narration uses the `celebration` style.

### 8.3 Hint Ladder

| Attempt | Behaviour |
| --- | --- |
| 1st miss | Shake, Balo encouraging, `hint1` (names the method / what is asked), misconception message from the chosen distractor's `tag` |
| 2nd miss | Stronger shake, `hint2` shown with the first step drawn on the visual |
| 3rd miss | Answer revealed with the **two-method explanation** animated and narrated; question counts as incorrect for the world score; no XP penalty |

---

## 9. Audio Pipeline (ElevenLabs — Matching `audio_generation_pipeline.md`)

### 9.1 Voice Configuration

- **Voice:** Alice, ID `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **Style settings:** identical to the pipeline table (`celebration` 0.12/0.45/0.75, `encouragement` 0.16/0.50/0.65, `question` 0.20/0.55/0.55, `emphasis` 0.16/0.50/0.60, `thinking` 0.24/0.60/0.35, `statement`/`instruction` 0.20/0.55/0.50, all with speaker boost on)
- **Content policy:** paragraphs, instructions and questions only; never titles, headings, world names or badge names

### 9.2 Display Form and Speech Form (`utils/mathText.js`)

Maths cannot be read well from its written form ("3x + 5 = 20"). Every narrated string is authored once as a **source string** with inline math tokens, and compiled twice:

```js
// Source:  "Sarah solves «3x + 5 = 20|three x plus five equals twenty» with algebra."
const TOKEN = /«([^|»]*)\|([^»]*)»/g;
export const toDisplay = (src) => src.replace(TOKEN, (_, d) => d);
export const toSpeech  = (src) => src.replace(TOKEN, (_, __, s) => s);
export const M = (display, speech = speakMath(display)) => `«${display}|${speech}»`;

// speakMath handles the common grammar automatically
// 3x + 5 = 20 → "three x plus five equals twenty"     2/3 → "two thirds"
// 0.75 × 80  → "zero point seven five times eighty"    4(x + 3) → "four times, open bracket, x plus three, close bracket"
```

**Parity rule (adapted):** the pipeline's 1:1 parity between on-screen text and narrated text is preserved by construction. The UI renders `toDisplay(src)` and the audio system speaks `toSpeech(src)`, both derived from the **same** source string, so they cannot drift. `MathText.jsx` also sets `aria-label` to the speech form for screen readers.

### 9.3 Fixed Narration — Single Source of Truth (`data/narrationSource.js`)

All fixed strings (Wonder hook, 7 story panels, station instructions, feedback pools, badge lines, Reflect prompts) live in one file as `{ id, src, style }` records. Both the React app (`narration.js`) and the offline script import it, so the "update `generate_audio.js` and `narration.js` separately" step in the original workflow becomes a single edit.

```js
export const NARRATION = [
  { id: 'wonder_1', style: 'thinking',      src: 'Sarah and Mike both solve the puzzle «3x + 5 = 20|three x plus five equals twenty».' },
  { id: 'wonder_2', style: 'statement',     src: 'Sarah writes lots of algebra and finds that x is 5.' },
  { id: 'wonder_3', style: 'question',      src: 'Mike never writes an x at all, but he also gets 5! How can that be?' },
  { id: 'wonder_4', style: 'encouragement', src: "Let's discover how different solution methods can lead to the same answer!" },
  // story_p1_a … story_p7  (text from PRD Section 6.4)
  // stationA_intro, stationB_intro, stationC_intro, nudge_balance, together_prompt …
  // correct_1…correct_5 (celebration), retry_1…retry_4 (encouragement), hint_generic_1…3 (thinking)
  // badge_* (celebration), reflect_prompt_1…3 (thinking), vault_open (celebration)
];
```

Feedback and encouragement lines have several variants (5 correct, 4 retry) chosen at random so the voice does not repeat itself.

### 9.4 Offline Pre-generation (`scripts/generate_audio.js`)

```js
import { NARRATION } from '../src/data/narrationSource.js';
import { toSpeech } from '../src/utils/mathText.js';

const API_KEY  = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY; // .env.local
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const STYLE_SETTINGS = { /* per pipeline table */ };

// For each record: speak = toSpeech(src); filename = `audio_${slug(id)}_0.mp3`
// 1. skip if the file already exists and the text is unchanged
// 2. POST https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}
//    body: { text: speak, model_id: 'eleven_multilingual_v2', voice_settings: STYLE_SETTINGS[style] }
// 3. save to public/assets/audio/
// 4. after the loop, write src/utils/audioMap.js:  { [speak]: '/assets/audio/<file>.mp3' }
// 5. sleep 500 ms between calls (rate limit, per pipeline)
```

Run with `node scripts/generate_audio.js`. Run `node scripts/clean_audio.js` afterwards to delete `.mp3` files no longer referenced by `audioMap.js` (unchanged from the pipeline).

### 9.5 Dynamic Audio for Generated Questions, Hints and Explanations

Generated question text cannot be pre-recorded, so these use the pipeline's **dynamic fallback**, made fast and cheap with three layers:

1. **Pre-fetch.** When question `i` appears, the app requests audio for the stem of question `i+1` (and, on demand, the hints) in the background.
2. **Cache.** An in-memory `Map` plus an IndexedDB store keyed by `hash(speech + style)`. Replayed worlds and repeated hints never hit the network twice.
3. **Proxy.** Requests go to `/api/elevenlabs`, so **the API key never ships to the browser**.

```js
// api/elevenlabs.js  (Vercel serverless)
const ALLOWED = ['https://intelliasg.com', 'https://grade7-compare-methods.vercel.app'];
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const origin = req.headers.origin;
  if (!ALLOWED.some((o) => origin?.startsWith(o))) return res.status(403).end();

  const { text, style = 'statement' } = req.body || {};
  if (!text || text.length > 600) return res.status(400).json({ error: 'bad text' });

  const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2', {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: STYLE_SETTINGS[style] }),
  });
  if (!r.ok) return res.status(502).end();
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(await r.arrayBuffer()));
}
```

If the proxy is unreachable, the audio engine **silently skips** and the full on-screen text remains (no browser speech fallback, as in the Grade 5 module). The proxy also applies simple per-IP rate limiting to protect quota.

### 9.6 Playback Engine (`utils/audio.js`)

Implements the pipeline's engine, with the same helpers (`say`, `ask`, `cheer`, `emphasize`, `think`, `celebrate`, `instruct`), `narrate(segments)` sequential queue with a `currentQueue` symbol, `stopNarration()`, and eager preload of segment `i+1`.

```js
const cache = new Map();           // key → blob URL
let currentQueue = null;

export async function getAudioUrl(speech, style = 'statement') {
  if (audioMap[speech]) return audioMap[speech];                     // 1. static (zero latency)
  const key = `${speech}::${style}`;
  if (cache.has(key)) return cache.get(key);                         // 2. memory
  const stored = await idbGet(key);                                  // 3. IndexedDB
  if (stored) { const u = URL.createObjectURL(stored); cache.set(key, u); return u; }
  try {                                                              // 4. proxy
    const r = await fetch('/api/elevenlabs', { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: speech, style }) });
    if (!r.ok) return null;
    const blob = await r.blob();
    idbSet(key, blob); const u = URL.createObjectURL(blob); cache.set(key, u); return u;
  } catch { return null; }                                           // silent skip
}

export async function narrate(segments) {
  const token = Symbol('queue'); currentQueue = token;
  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== token) return;                              // interrupted
    const url = await getAudioUrl(segments[i].speech, segments[i].style);
    if (segments[i + 1]) getAudioUrl(segments[i + 1].speech, segments[i + 1].style);   // preload
    if (url) await playAudio(url, () => currentQueue !== token);
  }
}
export function stopNarration() { currentQueue = null; /* pause active Audio element */ }
```

Browsers block autoplay, so the Intro screen's **Start** button creates and resumes the first `Audio` element (user gesture), unlocking narration for the whole session.

### 9.7 Workflow for Updating Fixed Narration

1. Edit the record in `src/data/narrationSource.js` (text and style).
2. Run `node scripts/generate_audio.js` (new `.mp3` files and a regenerated `audioMap.js`).
3. Optionally run `node scripts/clean_audio.js`.
4. Components already read from `narration.js`, which is built from the same file; no second edit is needed.

---

## 10. Randomization & Session Persistence

```js
const SESSION_KEY = 'intellia_g7_compare_methods_v1';
const SIG_KEY     = 'intellia_g7_recent_signatures';

// On mount: restore if saved within 24h (sessionSeed included so resumed worlds regenerate identically)
// On state change (debounced): persist phase, panel, station progress, xp, streak, badges,
//   worldScores, worldAttempts, sessionSeed, timestamp.
// Recent signatures: keep last 3 sessions (≈300 strings); load into `used` when ENTER_WORLD runs.
```

Because questions are regenerated deterministically from `(sessionSeed, world, attempt, index)`, a refresh mid-world restores the **same** questions without storing them. A replay increments `attempt`, producing a **new** set.

---

## 11. Embedding, Hosting & Security

### 11.1 Hosting

- Static Vite build on Vercel; `api/elevenlabs.js` as a serverless function.
- Intended Intellia URL (assumed, to be confirmed): `https://intelliasg.com/courses/grade-7-math/lessons/compare-solution-methods/`, following the pattern of `https://intelliasg.com/courses/grade-3-math`.

### 11.2 Iframe Embedding (`vercel.json`)

```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "Content-Security-Policy",
        "value": "frame-ancestors 'self' https://intelliasg.com https://*.intelliasg.com" },
      { "key": "X-Content-Type-Options", "value": "nosniff" }
    ]},
    { "source": "/assets/audio/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ]}
  ]
}
```

Do not send `X-Frame-Options: DENY`.

### 11.3 Optional Parent Messaging (`utils/embed.js`)

```js
export function notifyParent(event, payload) {
  if (window.parent === window) return;
  window.parent.postMessage(
    { source: 'intellia-lesson', lesson: 'g7-compare-solution-methods', event, payload },
    'https://intelliasg.com'                      // never '*'
  );
}
// events: 'phase_complete', 'world_complete', 'lesson_complete' { xp, stars, badges, accuracy }
```

Used only if the Intellia course page confirms it listens for lesson events (open item).

### 11.4 Security & Privacy

- No personal data collected; no accounts; no analytics cookies
- API key only in server environment variables (`ELEVENLABS_API_KEY`); `.env.local` is git-ignored
- Proxy validates origin, text length and rate
- `localStorage` stores progress only

---

## 12. Styling & Animation

Design tokens (colours, radii, shadows, font stacks) are **extracted from the Grade 5 reference repo** (`tailwind.config.js`, `App.css`) and copied unchanged; this guarantees the strict visual match. New components follow the same card, button and shadow patterns.

```css
@keyframes bounceIn { 0%{transform:scale(.3);opacity:0} 50%{transform:scale(1.05);opacity:1} 70%{transform:scale(.9)} 100%{transform:scale(1)} }
@keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
@keyframes floatUp  { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-60px) scale(1.5);opacity:0} }
@keyframes pulseGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(74,144,217,.4)} 50%{box-shadow:0 0 0 12px rgba(74,144,217,0)} }
@keyframes celebrate{ 0%{transform:rotate(-5deg) scale(1)} 25%{transform:rotate(5deg) scale(1.1)} 50%{transform:rotate(-3deg) scale(1.05)} 75%{transform:rotate(3deg) scale(1.1)} 100%{transform:rotate(0) scale(1)} }
@keyframes slideInUp{ from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes beamTilt { from{transform:rotate(var(--from))} to{transform:rotate(var(--to))} }      /* balance scale */
@keyframes barFill  { from{width:0} to{width:var(--fill)} }                                      /* bar model */
@keyframes threadDraw{ from{stroke-dashoffset:var(--len)} to{stroke-dashoffset:0} }              /* method columns */
@media (prefers-reduced-motion: reduce) { * { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
```

The balance-scale beam angle is computed as `clamp((leftWeight − rightWeight) * k, −18°, 18°)` and animated with a CSS transition (600 ms ease-in-out).

---

## 13. Component Prop Contracts

| Component | Props | Notes |
| --- | --- | --- |
| `BalanceScale` | `{ left, right, hiddenX?, onDropOp?, level }` | Beam tilt from weights; emits `onDropOp(side, op)` |
| `FunctionMachine` | `{ steps, direction:'forward'|'reverse', progress }` | Animated token path |
| `BarModel` | `{ whole, shadedTenths, shadedFives, pctLabel, onShade? }` | 10 segments, half-block support |
| `DoubleNumberLine` | `{ top, bottom, factor?, animate }` | Scale arrows between rows |
| `RatioTable` | `{ rows, missing?, highlightK? }` | Highlights constant k |
| `MethodColumns` | `{ colA, colB, matches, showCounts }` | Draws threads between twins |
| `StepCard` | `{ step, draggable, state }` | `state`: idle, selected, correct, wrong |
| `MathText` | `{ src }` | Renders `toDisplay(src)`, `aria-label = toSpeech(src)` |
| `Mascot` | `{ mood }` | `idle|curious|happy|thinking|celebrating|encouraging` |
| `QuestionRenderer` | `{ question, onAnswer, attempt }` | Dispatch on `answerFormat` |
| `FeedbackOverlay` | `{ isCorrect, tag?, explanation?, xp, onContinue }` | Uses misconception tag for message |
| `WorldMap` | `{ worldScores, currentWorld, onSelectWorld }` | 10 pins, stars, locks |
| `BadgePanel` | `{ badges, newBadgeId? }` | Toast on unlock |

---

## 14. Performance, Browser Support & Accessibility

| Metric | Target |
| --- | --- |
| Initial load | < 2 s (production build) |
| First meaningful paint | < 1 s |
| Question generation | < 20 ms per question; < 200 ms to build a world |
| SVG animation | 60 fps |
| Memory | < 70 MB |
| Bundle (gzipped) | < 650 KB (audio loaded lazily) |
| Lighthouse Performance / Accessibility | ≥ 90 / ≥ 95 |
| Static audio latency | 0 ms (pre-generated); dynamic audio hidden by pre-fetch (typically < 2 s) |

**Browsers:** Chrome, Edge, Firefox 110+; Safari/iOS Safari 15+; Android Chrome. IE 11 not supported. Primary test targets: desktop Chrome 1280 px and tablet 768 px touch.

**Accessibility:** 44×44 px targets; WCAG AA contrast; full keyboard operation with visible focus; drag has tap-tap fallback; `MathText` supplies speech-form labels; live-region announcements for feedback; reduced-motion support; no colour-only cues.

---

## 15. Quality & Testing Standards

| Test | Requirement |
| --- | --- |
| **Generator property test** | For each of the 10 types × 3 tiers, generate 10,000 questions with random seeds; every one must pass `verify()` |
| **Solver agreement** | Arithmetic and algebraic (and unit-rate/scale-factor, bar-model/decimal, divide-first/distribute-first) solvers return equal rationals in 100% of draws |
| **Distractor test** | Options unique, never equal to the correct answer, never NaN; at least 3 distinct misconception tags available per MCQ type |
| **No-repeat test** | 1,000 simulated sessions: zero duplicate signatures within a session; set of 100 signatures never identical across two sessions |
| **Coverage test** | Parameter space large enough that `buildWorld` never exhausts 60 retries for any world and tier |
| **Determinism test** | Same `(sessionSeed, world, attempt)` regenerates identical questions; different `attempt` yields a different set |
| **Method-cost test** | Every Q10 question has a unique cheaper method |
| **Parity test** | Every `NARRATION` record compiles to display and speech from one source; every static speech string exists in `audioMap.js`; no title strings appear in `NARRATION` |
| **Math-speech test** | `speakMath` snapshot tests for equations, fractions, decimals, brackets, negatives, percents |
| **Component tests** | Snapshot and interaction tests for `BalanceScale`, `BarModel`, `RatioTable`, `MethodColumns`, `StepCard` |
| **Reducer tests** | Streak, XP, stars, world gate (≥6), replay seeds, badge unlocks |
| **Gating test** | Play cannot start until all 9 station rounds are complete |
| **Accessibility** | axe automated pass plus manual keyboard pass of all 6 phases |
| **Audio** | Static playback, proxy failure (silent skip), queue interruption, autoplay unlock |
| **Embed test** | Loads inside an iframe from `intelliasg.com` origin; `postMessage` only to that origin |

---

## 16. Environment & Deployment

```
# .env.local (git-ignored)
ELEVENLABS_API_KEY=...            # used by scripts/generate_audio.js and api/elevenlabs.js
# Optional, for compatibility with the original pipeline's script only:
# VITE_ELEVENLABS_API_KEY=...     # not used by the browser in production
```

| Step | Command / action |
| --- | --- |
| Install | `npm install` |
| Dev server | `npm run dev` (supports `?seed=NNN` in dev for reproducing a question) |
| Pre-generate audio | `node scripts/generate_audio.js` then `node scripts/clean_audio.js` |
| Test | `npm test` |
| Build | `npm run build` |
| Deploy | Push to GitHub; Vercel builds `dist/` and deploys `api/`; set `ELEVENLABS_API_KEY` in Vercel project settings |
| Embed | Add the Vercel URL to the Intellia lesson page in an iframe (Section 11) |

---

## 17. Delivery Plan

| Milestone | Scope |
| --- | --- |
| M1 — Foundation | Scaffold from Grade 5 repo, copy design tokens, intro, progress map, phase shell, bottom bar |
| M2 — Engine | `rng`, `exact`, solvers, all 10 generators, distractors, `verify`, `buildWorld`; full property-test suite green |
| M3 — Learn | Wonder, Story, 3 stations with gradual release, shared SVG components |
| M4 — Play | Question renderers, hint ladder, worlds, world map, stars, XP, streak, badges |
| M5 — Audio | `narrationSource.js`, generation script, proxy, dynamic cache and pre-fetch, math speech |
| M6 — Polish | Accessibility pass, responsive pass, Reflect and results, embed headers and messaging, Lighthouse tuning |
| M7 — Release | Intellia embed, QA on devices, content review against the syllabus |

---

## 18. Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| Generated question has a wrong answer | Dual-solver verification plus plug-back check on every question; 10,000-draw property tests in CI |
| Dynamic audio latency or quota | Pre-fetch next question, IndexedDB cache, proxy rate limit, silent fallback with on-screen text |
| Autoplay blocked | Start button unlocks audio; audio toggle always visible |
| Maths mispronounced | `speakMath` with snapshot tests; explicit speech override via `M(display, speech)` |
| Exposed API key | Server-side proxy only; origin allowlist |
| UI drift from the reference | Tokens copied from reference repo; visual review against the live reference at each milestone |
| Iframe blocked by the host page | `frame-ancestors` configured; confirm embed method with Intellia early (M1) |
| Repeated content for returning students | Cross-session signature history plus fresh seeds on world replay |

---

**Document Version:** 1.0 | November 2026
**Product:** Intellia — Grade 7 Math, Compare Solution Methods
**Reference UI:** <https://grade5-time-intervals.vercel.app/>
**Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) per `audio_generation_pipeline.md`
**Companion document:** `grade7_compare_solution_methods_prd.md`
