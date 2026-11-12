// Mathematical text display and speech parity helpers
// Format: "«display|speech»"

const TOKEN = /«([^|»]*)\|([^»]*)»/g;

export const toDisplay = (src) => {
  if (!src) return '';
  return src.replace(TOKEN, (_, d) => d);
};

export const toSpeech = (src) => {
  if (!src) return '';
  return src.replace(TOKEN, (_, __, s) => s);
};

export function speakMath(display) {
  if (!display) return '';
  let s = String(display);
  // Equations & arithmetic
  s = s.replace(/(\d+)x/g, '$1 x');
  s = s.replace(/\+/g, ' plus ');
  s = s.replace(/[−-]/g, ' minus ');
  s = s.replace(/×/g, ' times ');
  s = s.replace(/÷/g, ' divided by ');
  s = s.replace(/=/g, ' equals ');
  s = s.replace(/\((\w+)\s*plus\s*(\d+)\)/g, 'open bracket, $1 plus $2, close bracket');
  s = s.replace(/\((\w+)\s*minus\s*(\d+)\)/g, 'open bracket, $1 minus $2, close bracket');
  s = s.replace(/(\d+)\/(\d+)/g, (match, n, d) => {
    if (n === '1' && d === '2') return 'one half';
    if (n === '1' && d === '4') return 'one quarter';
    if (n === '3' && d === '4') return 'three quarters';
    if (n === '1' && d === '3') return 'one third';
    if (n === '2' && d === '3') return 'two thirds';
    return `${n} over ${d}`;
  });
  s = s.replace(/(\d+)%/g, '$1 percent');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

export const M = (display, speech = speakMath(display)) => `«${display}|${speech}»`;

