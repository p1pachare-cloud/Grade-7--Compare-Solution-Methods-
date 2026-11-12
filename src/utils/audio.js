import { audioMap } from './audioMap.js';

let currentAudio = null;
let currentQueueToken = null;
let isMuted = false;
const memoryCache = new Map();

export function setMuted(muted) {
  isMuted = !!muted;
  if (isMuted) {
    stopNarration();
  }
}

export function isAudioMuted() {
  return isMuted;
}

export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });

export function stopNarration() {
  currentQueueToken = null;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
}

export function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    silent.play().catch(() => {});
  } catch (e) {}
}

export async function getAudioUrl(text, style = 'statement') {
  if (!text) return null;
  const clean = text.trim();
  // 1. Static asset match in audioMap
  if (audioMap[text]) return audioMap[text];
  if (audioMap[clean]) return audioMap[clean];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  // 3. Fallback request to API proxy (if serverless endpoint active)
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    try {
      const resp = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });
      if (resp.ok) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        memoryCache.set(cacheKey, url);
        return url;
      }
    } catch (e) {
      // Silent skip if backend not reachable
    }
  }

  return null;
}

export async function narrate(segments, audioEnabled = true) {
  if (isMuted || !audioEnabled || !segments) return;
  const list = Array.isArray(segments) ? segments : [segments];
  if (list.length === 0) return;

  stopNarration();
  const token = Symbol('queueToken');
  currentQueueToken = token;

  for (let i = 0; i < list.length; i++) {
    if (isMuted || currentQueueToken !== token) return;
    const seg = typeof list[i] === 'string' ? { text: list[i], style: 'statement' } : list[i];
    const url = await getAudioUrl(seg.text, seg.style);

    // Eagerly prefetch next segment
    if (list[i + 1]) {
      const nextSeg = typeof list[i + 1] === 'string' ? { text: list[i + 1], style: 'statement' } : list[i + 1];
      getAudioUrl(nextSeg.text, nextSeg.style).catch(() => {});
    }

    if (url && currentQueueToken === token && !isMuted) {
      await new Promise((resolve) => {
        const audio = new Audio(url);
        currentAudio = audio;
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play().catch(resolve);
      });
    }
  }
}

// Synthesized Web Audio API sound effects for instant interactive feedback
let audioCtx = null;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch (e) {}
}

export function playBuzz() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
}

export function playClick() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

