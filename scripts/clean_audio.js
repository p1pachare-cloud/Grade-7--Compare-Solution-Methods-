import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { audioMap } from '../src/utils/audioMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');

function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('No audio directory found. Skipping cleanup.');
    return;
  }

  const validFiles = new Set(Object.values(audioMap).map((p) => path.basename(p)));
  const existingFiles = fs.readdirSync(AUDIO_DIR);

  let removed = 0;
  for (const file of existingFiles) {
    if (!validFiles.has(file) && file.endsWith('.mp3')) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      console.log(`Removed orphaned audio file: ${file}`);
      removed++;
    }
  }

  console.log(`Audio cleanup complete. Removed ${removed} orphaned files.`);
}

main();

