import { mulberry32, shuffle, questionSeed } from './rng.js';
import { WORLD_PLAN, TIER_RAMP } from './worldPlan.js';
import { GENERATORS } from './generators/index.js';
import { makeContext } from './context.js';
import { verify } from './verify.js';

export function buildWorld({ worldIndex, sessionSeed, attempt = 0, used = new Set() }) {
  const ramp =
    worldIndex < 5
      ? TIER_RAMP.early
      : worldIndex < 9
      ? TIER_RAMP.mid
      : TIER_RAMP.final;

  const typeSlots = shuffle(
    mulberry32(sessionSeed ^ (worldIndex * 7919 + attempt * 31)),
    WORLD_PLAN[worldIndex].flatMap(([t, n]) => Array(n).fill(t))
  );

  const questions = [];
  const signatures = [];

  typeSlots.forEach((typeId, i) => {
    const tier = ramp[i] || 1;
    let generated = null;

    for (let retry = 0; retry < 120; retry++) {
      const qRng = mulberry32(questionSeed(sessionSeed, worldIndex, attempt, i, retry));
      const ctx = makeContext(qRng);
      const generator = GENERATORS[typeId];
      if (!generator) break;

      const q = generator(qRng, tier, ctx);
      if (!verify(q)) continue;
      if (used.has(q.signature) || signatures.includes(q.signature)) continue;

      generated = {
        ...q,
        id: `${typeId}_w${worldIndex}_q${i}_${q.signature}`,
        world: worldIndex,
        worldQuestionIndex: i,
      };
      signatures.push(q.signature);
      break;
    }

    if (!generated) {
      // Fallback generator call if retries exceeded
      const fallbackRng = mulberry32(questionSeed(sessionSeed, worldIndex, attempt, i, 999));
      const ctx = makeContext(fallbackRng);
      const fallbackQ = GENERATORS[typeId](fallbackRng, tier, ctx);
      const uniqueSig = `${fallbackQ.signature}_fb_${worldIndex}_${i}`;
      generated = {
        ...fallbackQ,
        signature: uniqueSig,
        id: `${typeId}_w${worldIndex}_q${i}_fallback`,
        world: worldIndex,
        worldQuestionIndex: i,
      };
      signatures.push(uniqueSig);
    }

    questions.push(generated);
  });

  return { questions, signatures };
}

// Builds all 100 questions (10 worlds x 10 questions)
export function buildSession(sessionSeed = Math.floor(Math.random() * 0xffffffff)) {
  const used = new Set();
  const allQuestions = [];

  for (let w = 0; w < 10; w++) {
    const { questions, signatures } = buildWorld({
      worldIndex: w,
      sessionSeed,
      attempt: 0,
      used,
    });
    signatures.forEach((sig) => used.add(sig));
    allQuestions.push(...questions);
  }

  return allQuestions;
}
