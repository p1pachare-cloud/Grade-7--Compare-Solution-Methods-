import { NARRATION } from '../data/narrationSource.js';
import { toSpeech } from './mathText.js';
import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio.js';

const helperMap = {
  statement: say,
  instruction: instruct,
  question: ask,
  encouragement: cheer,
  emphasis: emphasize,
  thinking: think,
  celebration: celebrate,
};

function getSegment(id) {
  const item = NARRATION.find((n) => n.id === id);
  if (!item) return null;
  const helper = helperMap[item.style] || say;
  return helper(toSpeech(item.src));
}

export function wonderNarration() {
  return [
    getSegment('wonder_1'),
    getSegment('wonder_2'),
    getSegment('wonder_3'),
    getSegment('wonder_4'),
  ].filter(Boolean);
}

export function getStoryNarration(panelIndex) {
  switch (panelIndex) {
    case 0:
      return [getSegment('story_p1_a'), getSegment('story_p1_b')].filter(Boolean);
    case 1:
      return [getSegment('story_p2')].filter(Boolean);
    case 2:
      return [getSegment('story_p3_a'), getSegment('story_p3_b')].filter(Boolean);
    case 3:
      return [getSegment('story_p4_a'), getSegment('story_p4_b')].filter(Boolean);
    case 4:
      return [getSegment('story_p5_a'), getSegment('story_p5_b')].filter(Boolean);
    case 5:
      return [getSegment('story_p6')].filter(Boolean);
    case 6:
      return [getSegment('story_p7')].filter(Boolean);
    default:
      return [];
  }
}

export function stationLearnNarration(stationIdx) {
  if (stationIdx === 0) return [getSegment('station_a_intro')].filter(Boolean);
  if (stationIdx === 1) return [getSegment('station_b_intro')].filter(Boolean);
  if (stationIdx === 2) return [getSegment('station_c_intro')].filter(Boolean);
  return [];
}

export function questionNarration(q) {
  if (!q || !q.stem) return [];
  const text = q.stem.speech || q.stem.display;
  return [ask(text)];
}

export function correctNarration() {
  const variants = ['correct_1', 'correct_2', 'correct_3'];
  const chosen = variants[Math.floor(Math.random() * variants.length)];
  return [getSegment(chosen)].filter(Boolean);
}

export function incorrectNarration() {
  const variants = ['retry_1', 'retry_2'];
  const chosen = variants[Math.floor(Math.random() * variants.length)];
  return [getSegment(chosen)].filter(Boolean);
}

export function reflectNarration() {
  return [getSegment('reflect_intro')].filter(Boolean);
}

