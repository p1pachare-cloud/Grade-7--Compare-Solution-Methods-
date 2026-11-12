// Vercel serverless audio proxy for ElevenLabs
// Keeps API key secret on server

const ALLOWED_ORIGINS = [
  'https://intelliasg.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, style = 'statement' } = req.body || {};
  if (!text || text.length > 600) {
    return res.status(400).json({ error: 'Invalid or missing text string' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'ElevenLabs API key not configured' });
  }

  try {
    const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
    const voiceSettings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'ElevenLabs upstream error' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    const buffer = Buffer.from(await response.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error('Audio proxy error:', error);
    return res.status(500).json({ error: 'Internal proxy error' });
  }
}

