# 💻 Developer Onboarding, Setup & Troubleshooting

This guide provides step-by-step instructions for setting up Cavyn locally, configuring keys, running tests, and troubleshooting common issues.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or later (LTS recommended)
- **Package Manager**: `npm` (v10+)
- **Modern Browser**: Google Chrome or Chromium-based browser (Brave, Edge) for full Web Speech API and SpeechSynthesis support.

---

## 2. Installation & Quick Start

```bash
# 1. Navigate to the project root
cd d:/Cavyn

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional, can also be configured in UI)
cp .env.example .env.local

# 4. Start Next.js development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 3. Environment Variables Configuration

Create or update `.env.local` with the following keys:

```ini
# Google Gemini API Key (Brain)
GEMINI_API_KEY=your_gemini_api_key_here

# Rime TTS API Key (Voice)
RIME_API_KEY=your_rime_api_key_here

# Optional Voice Configuration
RIME_MODEL=coda
RIME_VOICE_CEO=amber
RIME_VOICE_CTO=cove
RIME_VOICE_CFO=marsh
```

> **Note**: If API keys are not supplied, Cavyn automatically activates **Offline Smart Simulation Mode** and **Web Speech Natural Fallback**, allowing testing and development without live API tokens!

---

## 4. Troubleshooting & FAQ

### Issue 1: "Microphone permission denied or cutting off"
- **Cause**: Browser blocked mic access or tab was backgrounded.
- **Solution**:
  1. Click the lock/tune icon in your browser URL bar.
  2. Ensure **Microphone** is set to **Allow**.
  3. The app features auto-recovery: clicking the mic icon or unmuting automatically restarts the listener.

### Issue 2: "Audio sounds like standard robotic system voice"
- **Cause**: The client system does not have online Google Natural speech synthesis packs active.
- **Solution**:
  - In Chrome: Chrome automatically loads `Google US English` neural voices when connected to the internet.
  - Or, enter your `RIME_API_KEY` in the API Key settings modal to stream hyper-realistic conversational audio directly from Rime.

### Issue 3: "Build errors on Next.js"
- Run `npm run build` to verify clean compilation.
- Ensure TypeScript passes cleanly (`npx tsc --noEmit`).
