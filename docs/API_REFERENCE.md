# 🌐 API Reference & Communication Protocols

Cavyn exposes a consolidated, high-performance API endpoint at `/api/boardroom` that drives all real-time session management, speaker arbitration, audio generation, and telemetry logging.

---

## 1. API Route Overview

| Endpoint | Method | Purpose | Typical Latency |
|---|---|---|---|
| `/api/boardroom` | `GET` | Fetches active session state, executive profiles, telemetry, and API status | ~10-25ms |
| `/api/boardroom` | `POST` | Dispatches actions (`ARBITRATE_SPEAKER`, `BARGE_IN`, `CONFIG_KEYS`, etc.) | ~40-350ms (Gemini dependent) |

---

## 2. POST Action Protocols

### 1. `ARBITRATE_SPEAKER`
Processes a completed founder utterance, routes it to the winning executive, prompts the Gemini core, and returns synthesized audio.

**Request Payload**:
```json
{
  "action": "ARBITRATE_SPEAKER",
  "payload": {
    "founderUtterance": "Marcus, what database should we start with for our MVP?",
    "currentSpeaker": null,
    "elapsedSeconds": 45
  }
}
```

**Response Payload**:
```json
{
  "success": true,
  "decision": {
    "chosenAgent": "CTO",
    "rationale": "Direct address match for Marcus + Technical MVP domain",
    "spokenText": "Keep it dead simple. Start with PostgreSQL on Supabase or Neon. You can ship in a weekend and scale to your first 100k users without touching a Kubernetes cluster.",
    "audioUrl": "/api/boardroom?audio=...",
    "epoch": 7,
    "interrupted": false
  },
  "state": { ... }
}
```

---

### 2. `BARGE_IN`
Fires instantly when interim speech is detected on the client microphone. Invalidates current audio streams and advances the monotonic epoch.

**Request Payload**:
```json
{
  "action": "BARGE_IN",
  "payload": {
    "interruptedAgent": "CEO",
    "elapsedSeconds": 92
  }
}
```

**Response Payload**:
```json
{
  "success": true,
  "newEpoch": 8,
  "event": {
    "type": "FOUNDER_BARGE_IN",
    "timestamp": "2026-09-10T10:25:00.000Z",
    "detail": "Founder interrupted CEO. Speaking epoch advanced to 8."
  }
}
```

---

### 3. `TRIGGER_PEER_DEBATE`
Invokes an autonomous peer-to-peer exchange where one mentor challenges or builds upon a previous mentor's point.

**Request Payload**:
```json
{
  "action": "TRIGGER_PEER_DEBATE",
  "payload": {
    "promptingAgent": "CTO",
    "targetAgent": "CFO"
  }
}
```

---

### 4. `CONFIG_KEYS`
Dynamically saves and verifies Gemini and Rime API credentials in secure runtime memory.

**Request Payload**:
```json
{
  "action": "CONFIG_KEYS",
  "payload": {
    "geminiKey": "AIzaSy...",
    "rimeKey": "rime_sec_..."
  }
}
```

**Response Payload**:
```json
{
  "hasGeminiKey": true,
  "hasRimeKey": true,
  "geminiStatus": { "valid": true, "message": "Gemini 2.5 Flash connected" },
  "rimeStatus": { "valid": true, "message": "Rime Coda connected" }
}
```

---

### 5. `CONCLUDE_MEETING`
Concludes the active session, calculates final committee votes, and generates a structured mentorship audit and scorecard.

**Request Payload**:
```json
{
  "action": "CONCLUDE_MEETING",
  "payload": {}
}
```

**Response Payload**:
```json
{
  "success": true,
  "votes": {
    "CEO": { "vote": "YES", "reason": "Clear narrative and strong customer empathy." },
    "CTO": { "vote": "YES", "reason": "Practical MVP architecture choices." },
    "CFO": { "vote": "CONDITIONAL", "reason": "Requires validation of organic CAC." }
  },
  "consensus": "APPROVED"
}
```
