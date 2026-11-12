// All predefined narration strings following audio_generation_pipeline.md
// Voice: Alice (Xb7hH8MSUJpSbSDYk0k2), model: eleven_multilingual_v2
// STRICT CONTENT POLICY: Paragraphs and questions ONLY. Never titles or headings!

export const NARRATION = [
  // Wonder Phase
  {
    id: 'wonder_1',
    style: 'thinking',
    src: 'Sarah and Mike both solve the puzzle «3x + 5 = 20|three x plus five equals twenty».',
  },
  {
    id: 'wonder_2',
    style: 'statement',
    src: 'Sarah writes lots of algebra and finds that x is 5.',
  },
  {
    id: 'wonder_3',
    style: 'question',
    src: 'Mike never writes an x at all, but he also gets 5! How can that be?',
  },
  {
    id: 'wonder_4',
    style: 'encouragement',
    src: "Let's discover how different solution methods can lead to the same answer!",
  },

  // Story Panels (PRD Section 6.4)
  {
    id: 'story_p1_a',
    style: 'statement',
    src: 'John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, and Priya are the Method Masters, friends from cities all around the world.',
  },
  {
    id: 'story_p1_b',
    style: 'statement',
    src: 'The Golden Scale, the prize of the Global Math Festival, is locked in a vault. Each city holds one clue, and a clue only counts if you solve it in two different ways.',
  },
  {
    id: 'story_p2',
    style: 'question',
    src: 'In Cairo, Aisha reads the first clue. A festival ride costs 3 tokens, plus a 5 token entry fee. She spent 20 tokens. How many rides did she take?',
  },
  {
    id: 'story_p3_a',
    style: 'statement',
    src: 'Sarah solves it with algebra. «3x + 5 = 20|three x plus five equals twenty». Subtract 5 from both sides to get «3x = 15|three x equals fifteen». Divide both sides by 3 to get «x = 5|x equals five».',
  },
  {
    id: 'story_p3_b',
    style: 'emphasis',
    src: 'Mike works backwards. He starts at 20, takes away the 5 token entry fee to get 15, then shares 15 into groups of 3 to get 5. Different roads, same destination!',
  },
  {
    id: 'story_p4_a',
    style: 'statement',
    src: 'In Rio, Carlos is scaling a recipe. 4 cups of rice feed 6 people. How many cups feed 15 people?',
  },
  {
    id: 'story_p4_b',
    style: 'emphasis',
    src: 'Priya uses a unit rate to find 10 cups, and Yuki uses a scale factor of 2.5 to find 10 cups. Same answer again!',
  },
  {
    id: 'story_p5_a',
    style: 'statement',
    src: 'In New York, Liam sees a 25% discount on an 80 token ticket. Emma draws a bar model to find 20 tokens off, making the ticket 60 tokens.',
  },
  {
    id: 'story_p5_b',
    style: 'emphasis',
    src: 'Noah multiplies by 0.75, because paying 75% of the price is the same thing. 0.75 times 80 is 60 tokens. Both methods work!',
  },
  {
    id: 'story_p6',
    style: 'emphasis',
    src: 'In Berlin, John distributes first to solve the equation in 3 steps, while Sofia divides first in only 2 steps. Same answer, but Sofia used fewer steps!',
  },
  {
    id: 'story_p7',
    style: 'celebration',
    src: 'The vault clicks open! The Method Masters learned a big secret. Many methods can reach the same answer, so smart solvers compare them and choose the one that fits best.',
  },

  // Station Instructions
  {
    id: 'station_a_intro',
    style: 'instruction',
    src: 'Drag a block off both sides of the scale to keep it balanced, or run the function machine in reverse!',
  },
  {
    id: 'station_b_intro',
    style: 'instruction',
    src: 'Put the step cards in order for each method column. Watch out for decoy steps that do not belong!',
  },
  {
    id: 'station_c_intro',
    style: 'question',
    src: 'Which method is the most efficient for this problem? Pick the method, solve it, and tell us why!',
  },

  // Feedback Variants
  {
    id: 'correct_1',
    style: 'celebration',
    src: 'Brilliant! Two methods, one answer. You are a true Method Master!',
  },
  {
    id: 'correct_2',
    style: 'celebration',
    src: 'Outstanding reasoning! Both paths balanced to the exact same result.',
  },
  {
    id: 'correct_3',
    style: 'encouragement',
    src: 'Spot on! You found the exact connection between both methods.',
  },
  {
    id: 'retry_1',
    style: 'encouragement',
    src: 'Not quite! Let us check the balance together.',
  },
  {
    id: 'retry_2',
    style: 'thinking',
    src: 'Think about the inverse operation: what undoes the last step performed on x?',
  },

  // Reflect
  {
    id: 'reflect_intro',
    style: 'thinking',
    src: 'What an adventure! Can you tell Balo about a problem where one method was clearly better than the other?',
  },
];

