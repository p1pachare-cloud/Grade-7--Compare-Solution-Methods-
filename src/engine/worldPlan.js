// Matrix of question types per world as specified in PRD Section 8.3 and TRD Section 5.10

export const WORLD_PLAN = [
  /* World 1: Cairo Balance Bazaar */
  [['Q1', 5], ['Q2', 5]],
  /* World 2: Mumbai Spice Market */
  [['Q1', 3], ['Q2', 3], ['Q3', 4]],
  /* World 3: Berlin Workshop */
  [['Q3', 4], ['Q4', 6]],
  /* World 4: Sydney Harbour Ferry */
  [['Q1', 2], ['Q2', 2], ['Q4', 4], ['Q9', 2]],
  /* World 5: Rio Carnival Kitchen */
  [['Q3', 2], ['Q5', 6], ['Q10', 2]],
  /* World 6: Tokyo Train Table */
  [['Q5', 4], ['Q6', 6]],
  /* World 7: Paris Scale-Model Studio */
  [['Q6', 4], ['Q9', 3], ['Q10', 3]],
  /* World 8: New York Sale Street */
  [['Q7', 6], ['Q8', 2], ['Q10', 2]],
  /* World 9: Cape Town Safari Market */
  [['Q7', 4], ['Q8', 6]],
  /* World 10: Reykjavik Grand Final */
  [['Q8', 2], ['Q9', 5], ['Q10', 3]],
];

export const TIER_RAMP = {
  early: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3], // worlds 1–5
  mid:   [1, 1, 1, 2, 2, 2, 2, 3, 3, 3], // worlds 6–9
  final: [1, 1, 2, 2, 2, 2, 3, 3, 3, 3], // world 10
};

