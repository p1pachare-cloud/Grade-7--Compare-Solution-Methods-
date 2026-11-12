# Product Requirements Document (PRD)

## Compare Solution Methods — Equations, Proportions & Percents | Grade 7 Math

### Intellia SG | Global Grade 7 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for **"Method Masters — Compare Solution Methods"**, an interactive, gamified, simulation-based lesson module for **Grade 7 students (age 12–13)**. The module teaches students to solve the same problem in more than one way, to see why different methods reach the same answer, and to choose the most efficient method for a given problem.

The module is a standalone **React (Vite + JSX + Tailwind)** web application. It is designed to **strictly mirror the visual language, UX structure, phase model and interaction patterns** of the reference product:

- Reference site: **<https://grade5-time-intervals.vercel.app/>**
- Reference repository: **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>**
- Target hosting family: **<https://intelliasg.com/courses/grade-3-math>** (course-page pattern; this module is placed under the Grade 7 course, see Section 15)

Learning follows a strict **learn-first, practise-second** order. Students first experience the idea through a story and three guided simulation stations (watch → try together → try alone). Only after that do they unlock the **Play** phase: **100 questions, every one procedurally generated and different on every session**.

Audio narration follows the provided `audio_generation_pipeline.md` exactly: ElevenLabs, voice **Alice** (`Xb7hH8MSUJpSbSDYk0k2`), model `eleven_multilingual_v2`, per-style voice settings, hybrid pre-generation plus dynamic fallback, and the rule that **only paragraphs and questions are narrated, never titles or headings**.

The story features globally diverse friends (John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, and others) travelling through ten world cities to open a locked vault, where each clue only counts if it is solved **two different ways**.

The module follows the same **6-phase learner journey** as the reference: INTRO → WONDER → STORY → SIMULATE → PLAY → REFLECT.

---

## 2. Product Vision & Goals

**Vision:** Make "there is more than one way to solve it" a real skill, not a slogan. Grade 7 learners should be able to solve, compare, check and choose between methods with confidence, in a world-travel adventure that rewards curiosity and explanation over speed.

**Goals**

| Goal | Metric |
| --- | --- |
| Learning completion | ≥85% of students complete all 6 phases |
| Learn-before-practise | 100% of students complete all 3 simulation stations before Play unlocks |
| Practice engagement | ≥90% attempt at least 15 Play questions |
| First-attempt score | Average Play score ≥70% on first attempt |
| Method-comparison skill | ≥75% correct on "compare / choose method" question types (Q3, Q9, Q10) |
| Session duration | Average engagement ≥22 minutes per session |
| Curriculum alignment | 100% aligned to global Grade 7 equations, ratio/proportion and percent standards (Section 4) |
| Simulation interaction | ≥95% attempt every round of all 3 stations |
| Randomization integrity | 0% identical question sets across sessions; 0 repeated questions within a session |
| Answer correctness | 100% of generated questions pass the dual-solver verification (see TRD) |

---

## 3. Target Users

**Primary: Grade 7 students (age 12–13)**

- Comfortable with integer operations, fractions/decimals, and one-step equations
- Often learn one procedure and apply it blindly; this module deliberately builds flexibility
- Motivated by streaks, badges, world maps and an interesting story
- Learning in a global classroom context: names, places, currencies and units must be neutral and inclusive

**Secondary: Parents and teachers**

- Assign as classwork, homework or enrichment
- Expect alignment to recognised global standards (Section 4)
- Want visible phase progress and a clear summary at the end

**Global-learner design rules**

- Currency-neutral: all money is **"tokens"**
- SI/neutral units only; no idioms or culture-specific references
- Plain-language reading level, short sentences, key vocabulary highlighted
- Names drawn from many regions (see Section 8.4)

---

## 4. Curriculum Alignment — Global Grade 7 Mathematics

**Concept:** Compare solution methods
**Programme:** Intellia Grade 7 Math — Algebra, Ratio & Proportion, Percent
**Content selection rule:** Only syllabus content that supports comparing solution methods is included. Everything else in the Grade 7 syllabus is excluded.

**Source references (cross-aligned):**

- U.S. Common Core — **7.EE.B.4a** (solve `px + q = r` and `p(x + q) = r`; compare an algebraic solution to an arithmetic solution), **7.RP.A.2** (proportional relationships via tables, equations, unit rate), **7.RP.A.3** (multi-step ratio and percent problems), **7.EE.B.3**
- UK National Curriculum — Key Stage 3 (solve linear equations; ratio and proportion; percentages)
- CBSE/NCERT Class 7 — *Simple Equations*, *Comparing Quantities*
- Singapore MOE — Secondary 1 Mathematics: Algebra, Ratio/Rate, Percentage
- Australian Curriculum — Year 7: solving linear equations; ratios and percentages

**Included topics (three method families)**

| Family | Methods compared |
| --- | --- |
| **Equations** | Arithmetic (work backwards) vs algebraic (inverse operations / balance); for `p(x + q) = r`, divide-first vs distribute-first |
| **Proportion** | Unit rate vs scale factor vs ratio table vs equation `y = kx` |
| **Percent** | Bar model vs decimal multiplier vs benchmark (10% / 5% / 1%) method; percent change (discount, increase, tip) |

**Excluded (out of this lesson):** systems of equations, inequalities, graphing lines, negative-exponent algebra, compound interest, geometry, statistics.

**Learning objectives**

| LO | Description |
| --- | --- |
| LO1 | Solve `px + q = r` by working backwards (arithmetic) |
| LO2 | Solve `px + q = r` using inverse operations (algebraic) |
| LO3 | Explain why an arithmetic and an algebraic solution are equivalent, by matching their steps |
| LO4 | Solve `p(x + q) = r` by dividing first and by distributing first; compare step count |
| LO5 | Solve proportion problems using unit rate and scale factor, and recognise multiplicative vs additive reasoning |
| LO6 | Use a ratio table / equation `y = kx` to find a constant of proportionality and predict values |
| LO7 | Solve percent problems using a bar model and a decimal multiplier |
| LO8 | Solve percent-change problems (discount, increase, tip) and identify the correct base |
| LO9 | Find and explain an error in a worked solution |
| LO10 | Choose the most efficient method for a given problem and justify the choice |

**Concrete → Pictorial → Abstract (CPA) progression**

- **Concrete:** a balance scale with weights and x-blocks; "think-of-a-number" function machines run forwards and backwards
- **Pictorial:** bar models, double number lines, ratio tables, side-by-side step columns
- **Abstract:** written equations and proportion statements, and the comparison of two written solutions

**Difficulty tiers**

- **Easy:** positive integers, small values, one-step-per-operation, integer answers
- **Medium:** negatives, larger values, subtraction forms (`5x − 8 = 27`), non-unit rates, percents that need two benchmarks (35%)
- **Hard:** decimals/fractions in the setup, multi-step distribute forms, percent increase followed by decrease, error analysis, efficiency trade-offs

**Vocabulary focus:** solution method, arithmetic method, algebraic method, inverse operation, work backwards, balance, distribute, equivalent, unit rate, scale factor, constant of proportionality, ratio table, bar model, percent of, discount, increase, efficient, justify

---

## 5. The 6-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ "Hello, Method Master! Ready to solve it in more than one way? 🌍⚖️"      │
│ Start button also unlocks browser audio. 6 phase dots visible.             │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈1–2 min)                                                │
│ Hook puzzle: Sarah (algebra) and Mike (no x at all) both solve             │
│ 3x + 5 = 20 and both get 5. "How can that be?"                             │
│ Mascot Balo (balance-scale robot) appears, puzzled.                        │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈3 min) — "The Method Masters & the Golden Scale"         │
│ 7 illustrated, narrated panels across Cairo, Rio, New York, Berlin.        │
│ Each clue is solved two ways. Vocabulary highlighted.                      │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈8–10 min)   ← LEARNING HAPPENS HERE                   │
│ 3 stations, each with 3 rounds (Equation → Proportion → Percent)           │
│ Every round: WATCH (Balo demonstrates) → TRY TOGETHER → TRY ALONE          │
│ Play is locked until all 3 stations are complete.                          │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈10–15 min)                                                │
│ IntelliPlay™: 100 procedurally generated questions across 10 world cities │
│ 10 questions per world; world unlocks at ≥6/10 correct                     │
│ Stars (1–3), XP, 8 badges, streak counter. Encouragement-first feedback.   │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈2 min)                                                 │
│ "Tell Balo about a problem where one method was clearly better."           │
│ Results summary: XP, stars, badges, method-skill breakdown.                │
│ Lesson-complete badge, "Share with your teacher" export.                   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Story — "The Method Masters and the Golden Scale"

### 6.1 Cast (global names, each tied to a city)

| Character | City | Role in the story |
| --- | --- | --- |
| Sarah | London | Loves algebra; writes every step |
| Mike | New York | Works backwards; never writes an `x` |
| Aisha | Cairo | Reads the first clue |
| Carlos | Rio de Janeiro | Recipe and scaling clue |
| Priya | Mumbai | Unit-rate thinker |
| Yuki | Tokyo | Scale-factor thinker |
| Emma | Paris | Draws bar models |
| Liam | Cape Town | Spots the sale |
| Noah | Toronto | Decimal multiplier fan |
| John | Sydney | Distributes first |
| Sofia | Berlin | Divides first (the efficient trick) |
| Mascot **Balo** | — | Friendly balance-scale robot; moods: idle, curious, happy, thinking, celebrating, encouraging |

Extra names for word problems: Chloe, Ravi, Diego, Fatima, Amara, Lucas, Mei, Omar, Hana, Kofi, Ingrid, Mateo.

### 6.2 Plot

The **Global Math Festival** has locked its prize, the **Golden Scale**, inside a vault. A glitch in the vault's brain means a clue only counts if it is solved **in two different ways**. Eleven friends in different cities each hold one clue. As they compare methods, they discover the vault's secret: *different roads, same destination, and smart solvers choose the road that fits.*

### 6.3 Wonder Hook (style in brackets)

1. "Sarah and Mike both solve the puzzle 3x + 5 = 20." *(thinking)*
2. "Sarah writes lots of algebra and finds that x is 5." *(statement)*
3. "Mike never writes an x at all, but he also gets 5! How can that be?" *(question)*
4. "Let's discover how different solution methods can lead to the same answer!" *(encouragement)*

### 6.4 Story Panels

**Panel 1 — The Vault** *(statement)*
"John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, and Priya are the Method Masters, friends from cities all around the world."
"The Golden Scale, the prize of the Global Math Festival, is locked in a vault. Each city holds one clue, and a clue only counts if you solve it in two different ways."

**Panel 2 — Cairo: Aisha's clue** *(question)*
"In Cairo, Aisha reads the first clue. A festival ride costs 3 tokens, plus a 5 token entry fee. She spent 20 tokens. How many rides did she take?"

**Panel 3 — Two roads, one answer (Equations)** *(statement, then emphasis)*
"Sarah solves it with algebra. 3x + 5 = 20. Subtract 5 from both sides to get 3x = 15. Divide both sides by 3 to get x = 5."
"Mike works backwards. He starts at 20, takes away the 5 token entry fee to get 15, then shares 15 into groups of 3 to get 5. Different roads, same destination!"

**Panel 4 — Rio: Carlos's recipe (Proportion)** *(statement)*
"In Rio, Carlos is scaling a recipe. 4 cups of rice feed 6 people. How many cups feed 15 people?"
"Priya uses a unit rate. Each person needs 4 ÷ 6 = 2/3 of a cup, so 15 people need 15 × 2/3 = 10 cups."
"Yuki uses a scale factor. 15 ÷ 6 = 2.5, so she multiplies 4 × 2.5 = 10 cups. Same answer again!" *(emphasis)*

**Panel 5 — New York: the sale (Percent)** *(statement)*
"In New York, Liam sees a 25% discount on an 80 token ticket. Emma draws a bar model. 25% is one quarter, so 80 ÷ 4 = 20 tokens off, and the ticket costs 60 tokens."
"Noah multiplies by 0.75, because paying 75% of the price is the same thing. 0.75 × 80 = 60 tokens. Both methods work!" *(emphasis)*

**Panel 6 — Berlin: the twist (Efficiency)** *(statement, then emphasis)*
"In Berlin, Sofia faces 4(x + 3) = 36. John distributes first: 4x + 12 = 36, then 4x = 24, so x = 6."
"Sofia divides by 4 first: x + 3 = 9, so x = 6. Same answer, but Sofia used fewer steps!"

**Panel 7 — The vault opens** *(celebration)*
"The vault clicks open! The Method Masters learned a big secret. Many methods can reach the same answer, so smart solvers compare them and choose the one that fits the problem best."

**Visual treatment:** illustrated panels with slide-in animation; world-map background with a glowing pin on the current city; character avatars with distinct, inclusive designs; math shown with large typographic equations and animated step reveals; key vocabulary highlighted as tap-for-definition chips.

---

## 7. Phase 3 — Simulation Design (Learning First)

Every round in every station follows a **gradual-release loop**:

1. **WATCH (I do):** Balo solves the problem with the first method, then the second, side by side, narrated.
2. **TRY TOGETHER (We do):** Student completes one scaffolded step at a time with immediate nudges.
3. **TRY ALONE (You do):** Student solves a fresh, randomly generated problem; success unlocks the next round.

Each station has **3 rounds**, one per family: **Equation → Proportion → Percent**. All numbers are randomly generated each time; a "Method Card" glossary drawer is always available.

### 7.1 Station A — "Balance Scale Lab" (Concrete)

**Visual:** A large SVG balance scale. Left pan: `px + q` shown as x-blocks and unit weights. Right pan: `r` unit weights. Beside it, a "think-of-a-number" **function machine** that can run forwards and in reverse.

**Equation round (two paths, same result):**
- *Algebraic path:* student drags "remove q from both pans" and "split both pans into p groups"; the scale stays level and the x-block's weight is revealed.
- *Arithmetic path:* student runs the machine backwards from `r`: undo "+ q", then undo "× p".
- A comparison bar shows both paths landing on the same `x`.

**Proportion round:** a **double number line** and **ratio table**. Student scales both rows by the same factor, then finds the unit rate and checks that both routes give the same missing value.

**Percent round:** a **bar model** split into tenths. Student shades 10% blocks and 5% blocks to build the target percent, and sees the same result from the decimal multiplier.

**Feedback:** scale wobbles if an operation is applied to one side only ("Keep it balanced!"); correct completion makes Balo spin and the answer glow on both paths.

### 7.2 Station B — "Side-by-Side Solver" (Pictorial)

**Visual:** Two columns, **Method A** and **Method B**, each with shuffled step cards underneath.

**Interaction:** Student drags (or tap-then-tap) step cards into the correct order in each column. Matching steps in the two columns link with a coloured thread. At the end, both columns converge on the same answer, and the step counts are shown.

**Teaching goals:**
- See that each algebraic step has an arithmetic twin
- See where one method is shorter (e.g. divide-first for `p(x + q) = r`)

**Rounds:** Equation (arithmetic vs algebraic) → Proportion (unit rate vs scale factor) → Percent (bar model vs decimal multiplier).

**Distractor steps:** each round includes one plausible wrong step (a classic misconception, such as adding instead of multiplying, or applying the percent to the wrong base). The student must reject it.

### 7.3 Station C — "Pick & Prove" (Abstract)

**Visual:** A problem is displayed with three method cards. The student chooses the most efficient method, solves it with a step builder, and then picks a "because…" reason from short options (for example "fewer steps", "no fractions", "easier to check").

**Interaction:** After solving, the app shows the step count for each method on the same problem so the student can verify their judgement. A "Show me both" button reveals the full worked comparison.

**Rounds:** Equation (distribute-first vs divide-first) → Proportion (unit rate vs scale factor, where one gives an easy integer) → Percent (benchmark vs decimal multiplier).

**Completion:** all 9 rounds across the stations (3 × 3) must be completed to unlock Play. Perfect first-try on Station B's rounds contributes to a badge (Section 9.2).

---

## 8. Phase 4 — Question Engine & Play (100 Randomized Questions)

### 8.1 Randomization Requirements

- **Every question is generated, not stored.** Each question comes from a template with random parameters, produced by a seeded random-number generator.
- **No repeats:** each question has a signature (template + key parameters). No signature repeats within a session or in a student's last three sessions on the same device.
- **Every answer is verified:** each generated question is solved by two independent solver functions (one per method) and the answers must agree and be a clean value for the tier. Failed generations are discarded and re-drawn.
- **Option order, numbers, names, cities and contexts all vary.** MCQ distractors are generated from known misconceptions, not random noise.
- **Question order** within each world is shuffled (Fisher–Yates) per session.

### 8.2 Question Types (10 types × 10 questions = 100)

| Type | Description | Example (one possible generation) |
| --- | --- | --- |
| Q1 | Solve `px + q = r` by **working backwards** | Solve 4x + 7 = 31 by working backwards. (31 − 7 = 24, 24 ÷ 4 = 6) |
| Q2 | Choose the correct **inverse-operation sequence** | Which steps solve 5x − 8 = 27? (add 8, then divide by 5; x = 7) |
| Q3 | **Match** steps of Method A to the equivalent steps of Method B | Match each algebra step to Mike's arithmetic step. |
| Q4 | Solve `p(x + q) = r` by divide-first and by distribute-first | Solve 3(x + 4) = 27 two ways. (x = 5) |
| Q5 | Proportion by **unit rate vs scale factor** | 5 notebooks cost 20 tokens. How much do 8 cost? (32 tokens) |
| Q6 | **Ratio table / `y = kx`**: find k, predict a value | Table x: 2, 3, 5 and y: 10, 15, 25. What is y when x = 9? (45) |
| Q7 | **Percent of** a quantity: bar model vs decimal | Find 35% of 60. (21) |
| Q8 | **Percent change**: discount / increase / tip | A 40 token jacket is 15% off. What is the sale price? (34 tokens) |
| Q9 | **Error analysis**: find the faulty step | Chloe solved 2(x + 5) = 18 and got 6.5. Which step is wrong? (Step 1: did not distribute to the 5; correct x = 4) |
| Q10 | **Choose the most efficient method** and justify | Which method is fastest for 5(x − 2) = 45? (divide first: x = 11) |

Answer formats: multiple choice, numeric entry, ordering (drag), matching (drag/tap), and select-the-faulty-step.

### 8.3 Distribution by World

| World | Focus | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Cairo Balance Bazaar | One/two-step review | 5 | 5 | | | | | | | | | 10 |
| 2 Mumbai Spice Market | `px + q = r` | 3 | 3 | 4 | | | | | | | | 10 |
| 3 Berlin Workshop | `p(x + q) = r` | | | 4 | 6 | | | | | | | 10 |
| 4 Sydney Harbour Ferry | Equation word problems | 2 | 2 | | 4 | | | | | 2 | | 10 |
| 5 Rio Carnival Kitchen | Unit rate vs scale factor | | | 2 | | 6 | | | | | 2 | 10 |
| 6 Tokyo Train Table | Ratio tables, `y = kx` | | | | | 4 | 6 | | | | | 10 |
| 7 Paris Scale-Model Studio | Mixed proportion | | | | | | 4 | | | 3 | 3 | 10 |
| 8 New York Sale Street | Percent of | | | | | | | 6 | 2 | | 2 | 10 |
| 9 Cape Town Safari Market | Percent change | | | | | | | 4 | 6 | | | 10 |
| 10 Reykjavik Grand Final | Mixed, boss round | | | | | | | | 2 | 5 | 3 | 10 |
| **Total** | | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **100** |

### 8.4 Difficulty Within Each World

Each world's 10 questions ramp **easy → medium → hard** (roughly 4 / 4 / 2 in worlds 1–5, 3 / 4 / 3 in worlds 6–9, and 2 / 4 / 4 in world 10). Number ranges per tier are defined in the TRD.

### 8.5 Global Context — Names, Places and Objects

- **Names:** John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Chloe, Ravi, Diego, Fatima, Amara, Lucas, Mei, Omar, Hana, Kofi, Ingrid, Mateo
- **Cities:** Cairo, Mumbai, Berlin, Sydney, Rio de Janeiro, Tokyo, Paris, New York, Cape Town, Reykjavik
- **Contexts:** festival rides and tickets, recipes, train timetables, model scale drawings, market sales, tips, sports gear, school supplies
- All money is **tokens**; all measures are metric or unitless.

### 8.6 Language & Notation

- Display equations with proper typography (`3x + 5 = 20`, `4(x + 3) = 36`, `2/3`, `0.75 ×`)
- Always label methods consistently: **Arithmetic method**, **Algebraic method**, **Unit rate**, **Scale factor**, **Bar model**, **Decimal multiplier**
- Question stems use "solve", "find", "which step", "which method", "explain why"

---

## 9. Gamification Design

### 9.1 Reward System

- **Stars (⭐):** 1–3 per world, based on correct answers out of 10 (≥9 = 3, ≥7 = 2, ≥6 = 1)
- **XP:** 10 XP correct first try | 7 XP second try | 5 XP if a hint was used
- **Streak 🔥:** consecutive correct answers; +5 XP bonus per correct answer when streak ≥ 5
- **Method bonus:** +3 XP for correctly answering "why" questions (Q3, Q9, Q10) on the first try

### 9.2 Badges (8)

- 🏅 **Method Explorer** — complete Wonder and Story
- 🥈 **Balance Builder** — complete all 3 simulation stations
- 🥇 **Method Master** — score ≥80% in Play
- 💎 **Perfect World** — 10/10 in any world
- 🔥 **Streak Star** — 10 correct in a row
- 🌍 **Global Solver** — complete all 6 phases
- 🕵️ **Error Detective** — 5 correct Q9 (error analysis) questions
- ⚡ **Efficiency Expert** — 5 correct Q10 (most efficient method) questions on the first try

### 9.3 Feedback Mechanics

**Correct:** bounce animation, Balo happy, XP floats up, streak increments, celebration audio.

**Incorrect, attempt 1:** gentle shake, Balo encouraging; **Hint 1** names the method and what the question is asking.

**Incorrect, attempt 2:** stronger shake; **Hint 2** shows the first step of the method on the visual (scale, bar model or table).

**Incorrect, attempt 3:** full **two-method worked explanation** revealed with animation and read aloud. No score penalty.

No negative scoring. Encouragement first, always. Wrong-answer feedback names the likely misconception ("It looks like the 5 was added instead of removed. Let's check the balance.").

### 9.4 World Map (10 Worlds)

1. **Cairo Balance Bazaar** (Q1–10)
2. **Mumbai Spice Market** (Q11–20)
3. **Berlin Workshop** (Q21–30)
4. **Sydney Harbour Ferry** (Q31–40)
5. **Rio Carnival Kitchen** (Q41–50)
6. **Tokyo Train Table** (Q51–60)
7. **Paris Scale-Model Studio** (Q61–70)
8. **New York Sale Street** (Q71–80)
9. **Cape Town Safari Market** (Q81–90)
10. **Reykjavik Grand Final** (Q91–100)

**Unlock gate:** ≥6/10 correct unlocks the next world. A replay of a failed world draws a fresh, different set of questions. 3 stars unlock a hidden **Bonus Challenge** (3 extra generated questions).

### 9.5 Mascot — Balo

A friendly balance-scale robot. Moods: idle, curious, happy, thinking, celebrating, encouraging. Appears in Wonder, Story, every simulation round, feedback overlays and Reflect. All mascot speech uses the ElevenLabs Alice voice.

---

## 10. Audio & Narration Design

Fully aligned with the provided `audio_generation_pipeline.md`.

### 10.1 Pipeline Summary

- **Provider:** ElevenLabs only (no browser speech fallback)
- **Voice:** Alice (Clear, Engaging Educator), ID `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **Pre-generation:** `scripts/generate_audio.js` → static `.mp3` in `public/assets/audio/` for every fixed script (Wonder, Story, simulation instructions, feedback, badges, Reflect)
- **Dynamic fallback:** generated questions, hints and explanations are fetched on the fly through a server proxy, cached, and **pre-fetched while the student solves the previous question** so playback feels instant
- **Mapping:** auto-generated `src/utils/audioMap.js` (exact text → file path)
- **Cleanup:** `scripts/clean_audio.js`
- **Sequential playback** with queue management and eager preload of the next segment

### 10.2 Content Policy — Paragraphs & Questions ONLY

> Audio is generated only for paragraph/story text, instructions and questions. Titles, headings, world names, badge names and section labels are **never** narrated.

### 10.3 Speech Styles (same table as the pipeline)

| Style | Stability | Similarity Boost | Style | Speaker Boost | Use |
| --- | --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ | Badge unlock, world complete, vault opens |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ | Correct feedback, gentle retries |
| `question` | 0.20 | 0.55 | 0.55 | ✅ | Puzzle and practice questions |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ | "Same answer again!" moments |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ | Wonder hook, hints, mascot thinking |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ | Story narration, station instructions |

### 10.4 Speaking Maths Correctly

Mathematical expressions must be spoken naturally ("three x plus five equals twenty", "two thirds", "zero point seven five times eighty"). Every narrated string therefore carries a **display form** and a **speech form** compiled from one source (TRD Section 9.2). The 1:1 parity rule applies to the source: both forms always come from the same string, so they can never drift apart.

### 10.5 Narration Examples

**Station A (instruction):** "Drag a block off both sides of the scale. Keep it balanced!"
**Station B (instruction):** "Put the steps in order for each method. Then see where the two methods meet."
**Station C (question):** "Which method is the most efficient for this problem? Solve it, then tell us why."
**Correct (celebration):** "Brilliant! Two methods, one answer. You are a true Method Master!"
**Retry (encouragement):** "Not quite! Let's check the balance together."
**Hint (thinking):** "Think about the last thing that was done to x. What is the opposite?"
**Reflect (thinking):** "What an adventure! Can you tell me about a problem where one method was clearly better than the other?"

### 10.6 Audio UX

- Audio on/off toggle always visible; remembers the setting
- Replay button on every narrated block
- Browser autoplay policy handled by the Intro "Start" button
- If audio fails to load, the experience continues silently with full on-screen text

---

## 11. UX & Visual Design Requirements

### 11.1 Visual Theme (strict match to the reference)

- **Reference UI:** <https://grade5-time-intervals.vercel.app/>
- **Reference repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
- Keep the reference's **layout, component structure, phase tracker, bottom bar, card styling, colour palette, typography, animation feel and illustration style**. Only content, simulations and illustrations change.
- Brand: Intellia — Think. Explore. Become.
- Typography: rounded, playful (Nunito / Fredoka, as in the reference)
- Palette: inherit the reference's brand blue, gold reward accent, coral wrong-answer state, white cards and soft shadows. Exact tokens are taken from the reference repo's `tailwind.config.js` and `App.css` (Section 15, item 3).
- Illustrations: cartoon style, inclusive characters, world-city backdrops (Pyramids, Mumbai market, Brandenburg Gate silhouette, Sydney Harbour, Rio hills, Tokyo skyline, Paris rooftops, New York skyline, Table Mountain, Icelandic landscape)

### 11.2 Layout Structure (mirrors the reference)

- **Top bar:** Intellia logo | lesson title "Compare Solution Methods" | 6-phase dot tracker
- **Main area:** phase content, responsive, smooth transitions
- **Bottom bar:** XP | stars | streak | audio toggle | phase navigation
- **Sidebar:** hidden on mobile; vertical phase map on tablet and up
- **Method Cards drawer:** slide-out glossary of method names and one-line "how it works" examples

### 11.3 Visual Component Library (visually rich)

- **BalanceScale** — animated SVG with tilt physics, x-blocks and unit weights
- **FunctionMachine** — forward/reverse "think of a number" flow
- **BarModel** — segmented bar with shadeable tenths/fifths
- **DoubleNumberLine** and **RatioTable** — linked scaling arrows
- **MethodColumns** — side-by-side step lists with matching threads
- **StepCard** — draggable/tappable step tile with accessible label
- **WorldMap** — 10 city pins, route line, star ratings and lock icons
- **Mascot (Balo)** — mood-driven SVG
- Confetti, XP float-ups, badge toast, streak flame, vault-open animation

### 11.4 Accessibility

- Minimum 44×44 px tap targets
- WCAG AA contrast
- Full keyboard operation; drag interactions always have tap-tap fallback
- Math has screen-reader labels (the speech form)
- Respects `prefers-reduced-motion`
- No mandatory time pressure
- Colour is never the only cue (icons and text on correct/incorrect)

### 11.5 Responsive Design

- Primary: desktop (1024 px+) and tablet (768 px+), classroom context
- Tertiary: mobile (375 px+), single-column layout with stacked method columns

---

## 12. Content Requirements

- All three simulation stations fully functional with 3 rounds each, every round randomly generated
- 10 question types, procedural generators, dual-solver verification
- Story: 1 hook + 7 panels, fully narrated
- 8 badges, 10-world map, Bonus Challenge
- Method Cards glossary (at least 15 entries)
- Reflect prompts (3 rotating prompts)

---

## 13. Success Criteria (v1.0)

| Criterion | Target |
| --- | --- |
| All 100 questions generated randomly, no repeats in a session | ✅ Required |
| Dual-solver verification passes for 100% of generated questions (tested over 10,000 draws) | ✅ Required |
| All 3 stations × 3 rounds functional | ✅ Required |
| Play locked until simulation complete | ✅ Required |
| All 6 phases navigable end-to-end | ✅ Required |
| XP, stars, streak, 8 badges working | ✅ Required |
| 10-world progression logic correct | ✅ Required |
| ElevenLabs audio for all fixed narration; dynamic audio for generated questions | ✅ Required |
| Mobile/tablet/desktop responsive | ✅ Required |
| Global Grade 7 syllabus alignment confirmed | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches the Grade 5 reference structure | ✅ Required |
| Hosted and embedded correctly on the Intellia course page | ✅ Required |

---

## 14. Out of Scope (v1.0)

- Teacher dashboard or backend analytics
- Student accounts and cross-device persistence
- Multiplayer or class competition
- Parent report emails and printable worksheets
- Translation into other languages (English only; neutral wording keeps this easy later)
- Systems of equations, inequalities and graphing
- Browser speech-synthesis fallback

---

## 15. Assumptions & Open Items

1. **Lesson URL (assumed):** `https://intelliasg.com/courses/grade-7-math/lessons/compare-solution-methods/`, following the Grade 5 pattern. The Intellia course page could not be inspected automatically (it blocks automated access), so the final slug, embed method and any parent-page requirements must be confirmed.
2. **Embedding (assumed):** the app is deployed as a static site and embedded by iframe; the host must allow `frame-ancestors` for `intelliasg.com`. An optional `postMessage` completion event is specified in the TRD, pending confirmation of what the course page accepts.
3. **Exact UI tokens:** the live reference app is client-rendered, so exact colours, spacing and fonts are to be extracted from the reference repo (`tailwind.config.js`, `App.css`) in the first build task, then locked as the design tokens.
4. **Unlock threshold:** the Grade 5 PRD states ≥6/10 while its TRD code uses ≥5. This module standardises on **≥6/10**.
5. **Syllabus selection:** only the topic-relevant parts of the global syllabus are used (Section 4). Confirm with the Intellia curriculum lead that the three method families match the course outline.
6. **Dynamic audio cost:** generated questions use per-character ElevenLabs billing; caching and pre-fetch (TRD Section 9) keep this bounded. Confirm the account's quota.

---

**Document Version:** 1.0 | November 2026
**Product:** Intellia — Grade 7 Math, Compare Solution Methods
**Lesson Title:** Method Masters — Compare Solution Methods
**Curriculum:** Global Grade 7 Mathematics (Common Core, UK NC, CBSE/NCERT, Singapore MOE, Australian Curriculum cross-aligned)
**Reference UI:** <https://grade5-time-intervals.vercel.app/>
**Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) per `audio_generation_pipeline.md`
**Hosting family:** <https://intelliasg.com/courses/grade-3-math> (pattern reference)
