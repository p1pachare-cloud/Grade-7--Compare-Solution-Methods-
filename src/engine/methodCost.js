import { qIsInt } from './exact.js';

// Cost = number of operations + penalty for non-integer or negative intermediates
export function methodCost(steps) {
  if (!Array.isArray(steps)) return 0;
  return steps.reduce((cost, step) => {
    let penalty = 0;
    if (step.value && typeof step.value === 'object' && 'n' in step.value) {
      if (!qIsInt(step.value)) penalty += 1;
      if (step.value.n < 0) penalty += 1;
    }
    return cost + 1 + penalty;
  }, 0);
}

