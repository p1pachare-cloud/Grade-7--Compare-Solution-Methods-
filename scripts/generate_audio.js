import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NARRATION } from '../src/data/narrationSource.js';
import { toSpeech } from '../src/utils/mathText.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_FILE = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

// Load API key from env or .env.local file
let API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const lines = fs.readFileSync(envLocalPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*(?:ELEVENLABS_API_KEY|VITE_ELEVENLABS_API_KEY)\s*=\s*(.+?)\s*$/);
      if (match) {
        API_KEY = match[1].trim();
        break;
      }
    }
  }
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (Clear, Engaging Educator)

export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 32)
    .replace(/^_+|_+$/g, '');
}

async function main() {
  console.log('--- ElevenLabs Offline Audio Generation Pipeline ---');
  console.log(`Voice: Alice (ID: ${VOICE_ID}), Model: eleven_multilingual_v2`);

  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  const map = {};

  if (!API_KEY) {
    console.error('❌ No ELEVENLABS_API_KEY found in environment or .env.local!');
    process.exit(1);
  } else {
    console.log(`API Key detected: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`);
  }

  let generatedCount = 0;
  let existingCount = 0;

  for (let i = 0; i < NARRATION.length; i++) {
    const item = NARRATION[i];
    const spoken = toSpeech(item.src);
    const slug = slugify(item.id || `audio_${i}`);
    const filename = `audio_${slug}_${i}.mp3`;
    const relPath = `/assets/audio/${filename}`;
    const filePath = path.join(AUDIO_DIR, filename);

    map[spoken] = relPath;

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1024) {
      console.log(`[${i + 1}/${NARRATION.length}] Already exists: ${filename}`);
      existingCount++;
      continue;
    }

    console.log(`[${i + 1}/${NARRATION.length}] Generating [${item.style}]: "${spoken.slice(0, 50)}..."`);
    const settings = STYLE_SETTINGS[item.style] || STYLE_SETTINGS.statement;

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: spoken,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings,
        }),
      });

      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`   Saved ${filename} (${buffer.length} bytes)`);
        generatedCount++;
      } else {
        const errText = await res.text();
        console.error(`   Upstream error for ${item.id} (${res.status}): ${errText}`);
      }

      // 500ms rate limiting between requests as per audio_generation_pipeline.md
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`   Fetch error for ${item.id}:`, err.message);
    }
  }

  const mapContent = `// Auto-generated mapping of spoken text to static audio files
// Generated per audio_generation_pipeline.md

export const audioMap = ${JSON.stringify(map, null, 2)};
`;

  fs.writeFileSync(MAP_FILE, mapContent, 'utf-8');
  console.log(`\n========================================`);
  console.log(` Audio Generation Completed!`);
  console.log(`Generated: ${generatedCount}, Existing: ${existingCount}, Total Mapped: ${Object.keys(map).length}`);
  console.log(`Audio directory: public/assets/audio/`);
  console.log(`Audio map: src/utils/audioMap.js`);
  console.log(`========================================\n`);
}

main().catch(console.error);
