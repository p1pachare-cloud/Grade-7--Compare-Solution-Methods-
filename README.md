# Method Masters — Compare Solution Methods (Grade 7 Math)

An interactive, story-driven Grade 7 mathematics learning module built with **React**, **Vite**, **Lucide Icons**, and **Web Audio API / ElevenLabs Voice Synthesis**. Students master multiple solution pathways for linear equations, proportional relationships, and percentage calculations, learning when and why to choose one method over another.

---

## 🌟 Key Features

- **5-Phase Pedagogical Architecture:**
  1. **Wonder Phase:** Real-world hook with interactive live balance scale explorer.
  2. **Story Phase:** 7-chapter comic/interactive visual journey with illustrated panels and audio narration.
  3. **Simulate Phase (3 Stations):**
     - *Station 1: Balance Scale Lab* — Direct vs. inverse operations with visual counterweights.
     - *Station 2: Side-by-Side Solver* — Multi-thread step comparison with step cost meters.
     - *Station 3: Pick & Prove* — Scenario matching and method justification with instant feedback.
  4. **Practice Phase (10 Procedural Worlds):**
     - 10 distinct worlds generating randomized, mathematically exact questions.
     - Interactive visual diagrams: Balance scale, function machines, double number lines, tape diagrams, ratio tables.
     - Distractor engine with realistic student misconceptions.
  5. **Reflect Phase:** Performance summary, badge unlocks, XP scorecards, and metacognitive reflection journal.

- **Audio Architecture & Voice Synthesis:**
  - Pre-generated offline MP3 voice assets generated via ElevenLabs (`Alice` voice, `eleven_multilingual_v2`).
  - Seamless fallback to Web Audio API synthesized chimes, buzzers, and clicks.
  - Floating top-bar **Mute / Sound On** control button for immediate audio silencing.
  - Strict audio policy: Narrates questions, prompts, and feedback; never reads raw titles.

- **Gamification Engine:**
  - 8 unlockable achievement badges.
  - Streak tracking, dynamic XP scoring, and session persistence in `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/p1pachare-cloud/Grade-7--Compare-Solution-Methods-.git
cd Grade-7--Compare-Solution-Methods-

# Install dependencies
npm install
```

### Environment Configuration

Copy `.env.example` to `.env.local` to configure ElevenLabs credentials for offline audio regeneration (optional):

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
ELEVENLABS_API_KEY=your_key_here
```

> **Note:** The repository already includes 24 offline pre-rendered MP3 voice assets in `public/assets/audio/`, so the app runs fully voiced without requiring an active API key during regular usage.

---

## 💻 Development & Testing

```bash
# Start local development server
npm run dev

# Run comprehensive test suite (22 unit & integration tests)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── api/                       # Vercel serverless ElevenLabs proxy
│   └── elevenlabs.js
├── public/
│   ├── assets/audio/          # Pre-generated ElevenLabs MP3 voice assets
│   └── story/                 # Story panel images
├── scripts/
│   ├── run_tests.js           # 22-step automated verification test runner
│   ├── generate_audio.js      # ElevenLabs batch voice generation script
│   └── clean_audio.js         # Audio cache maintenance
├── src/
│   ├── components/            # React UI components
│   │   ├── phases/            # Wonder, Story, Simulate, Practice, Reflect
│   │   ├── quiz/              # DiagramFor, QuestionRenderer, HintOverlay, WorldMap
│   │   ├── shared/            # FormulaPanel, NumberPad, FeedbackOverlay
│   │   └── simulations/       # BalanceScaleLab, SideBySideSolver, PickAndProve
│   ├── data/                  # Pedagogical data, worlds, method cards, story
│   ├── engine/                # Exact Q(n,d) arithmetic, PRNG, generators Q1-Q10
│   └── utils/                 # Audio player, badge engine, math vocalizer
├── vercel.json                # Vercel deployment & header configuration
└── vite.config.js             # Vite configuration
```

---

## 🌐 Deployment (Vercel)

This project is optimized for zero-config Vercel deployment:
1. Import the repository in [Vercel](https://vercel.com).
2. Set build command: `npm run build`.
3. Set output directory: `dist`.
4. (Optional) Add `ELEVENLABS_API_KEY` in Vercel project environment variables for dynamic serverless speech fallback.

---

## 📄 License

MIT License. Designed and developed for Grade 7 Mathematics Education.
