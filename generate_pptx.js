const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Cavyn Engineering Team';
pptx.company = 'Cavyn Autonomous Systems';
pptx.title = 'Cavyn - Autonomous Multi-Agent Institutional Boardroom';

// Design Palette
const BG_DARK = '0B0F19';
const BG_CARD = '111827';
const BG_CARD_LIGHT = '1F2937';
const ACCENT_EMERALD = '10B981';
const ACCENT_BLUE = '38BDF8';
const ACCENT_PURPLE = 'A855F7';
const ACCENT_AMBER = 'F59E0B';
const ACCENT_ROSE = 'F43F5E';
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '9CA3AF';
const TEXT_SUBTLE = '6B7280';

// Slide 1: Title Slide
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.2, w: 2.2, h: 0.4,
    fill: { color: '064E3B' },
    line: { color: ACCENT_EMERALD, width: 1 }
  });
  slide.addText('INSTITUTIONAL ROUNDTABLE', {
    x: 0.8, y: 1.2, w: 2.2, h: 0.4,
    fontSize: 9, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial', align: 'center', valign: 'middle'
  });

  slide.addText('CAVYN', {
    x: 0.8, y: 1.8, w: 11.5, h: 1.2,
    fontSize: 54, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
  });

  slide.addText('Autonomous Multi-Agent Institutional Boardroom', {
    x: 0.8, y: 3.0, w: 11.5, h: 0.6,
    fontSize: 22, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial'
  });

  slide.addText('Real-time conversational arbitration engine evaluating venture pitches across Strategic Scale (CEO), Technical Architecture (CTO), and Capital Viability (CFO) with sub-200ms acoustic interruption and monotonic epoch consistency.', {
    x: 0.8, y: 3.8, w: 10.5, h: 1.0,
    fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 20
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 5.6, w: 11.5, h: 0,
    line: { color: '374151', width: 1 }
  });

  slide.addText('Framework: Next.js 16 (Turbopack) | Brain: Google Gemini 2.5 Flash | Voice: Dual WebSpeech & Rime VOX', {
    x: 0.8, y: 5.9, w: 11.5, h: 0.4,
    fontSize: 10, color: TEXT_SUBTLE, fontFace: 'Arial'
  });
}

// Slide 2: Executive Summary & The Problem
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('EXECUTIVE OVERVIEW', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Bridging the Gap Between Founders & Institutional Scrutiny', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  // Column 1: The Problem
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.8, w: 5.3, h: 4.8, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });
  slide.addText('THE FOUNDER DILEMMA', { x: 1.1, y: 2.1, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: ACCENT_ROSE, fontFace: 'Arial' });
  slide.addText([
    { text: '• Intimidating Pitch Environments: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'First-time builders often face aggressive, hostile question-and-answer formats without guidance.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Obscure Financial & Tech Jargon: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Founders stumble on wall-street acronyms (CAC payback, LTV, P99 SLA) rather than testing real value.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Disjointed Feedback: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Mentors evaluate in silos with no continuous record of factual contradictions or valuation math.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Robotic AI Assistants: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Existing AI pitch mock tools sound mechanical, lecture like examiners, and cannot handle live voice interruption.', options: { color: TEXT_MUTED } }
  ], { x: 1.1, y: 2.5, w: 4.7, h: 3.8, fontSize: 11, fontFace: 'Arial' });

  // Column 2: The Cavyn Solution
  slide.addShape(pptx.ShapeType.roundRect, { x: 6.5, y: 1.8, w: 5.8, h: 4.8, fill: { color: BG_CARD }, line: { color: '064E3B', width: 1.5 } });
  slide.addText('THE CAVYN SOLUTION', { x: 6.8, y: 2.1, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText([
    { text: '• Friendly 3-Seat Autonomous Board: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Elena (CEO), Marcus (CTO), and Vikram (CFO) act as collaborative peer advisors chatting over coffee.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Zero-Latency Acoustic Barge-In: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Founders can speak at any time; active agent speech stops in <15ms with zero audio leak.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Live Contradiction Ledger: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Detects discrepancies between financial numbers and tech roadmaps in real-time.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Flexible Offline + Bring-Your-Own-Key: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Works out-of-the-box with built-in offline simulation, or connects to Google Gemini with zero deployment keys required.', options: { color: TEXT_MUTED } }
  ], { x: 6.8, y: 2.5, w: 5.2, h: 3.8, fontSize: 11, fontFace: 'Arial' });
}

// Slide 3: Committee Personas & Advisory Architecture
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('AUTONOMOUS COMMITTEE SEATS', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Three Autonomous Specialized Brains Working as One', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  // Seat 01: Elena (CEO)
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: BG_CARD }, line: { color: ACCENT_EMERALD, width: 1.5 } });
  slide.addText('SEAT 01 // ELENA', { x: 1.0, y: 2.0, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Lead Venture Partner & CEO', { x: 1.0, y: 2.3, w: 3.2, h: 0.3, fontSize: 13, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
  slide.addText([
    { text: 'Domain: ', options: { bold: true, color: ACCENT_EMERALD } },
    { text: 'Market Scale & Narrative\n\n', options: { color: TEXT_MUTED } },
    { text: 'Tone & Style:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Warm, encouraging, human founder-to-founder dialogue. Asks about real users, everyday pain points, and customer stories.\n\n', options: { color: TEXT_MUTED } },
    { text: 'Focus Questions:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: '• Who was the first user you showed this to?\n• What is the biggest customer pain point?\n• How will you get your first 100 fans?', options: { color: TEXT_MUTED } }
  ], { x: 1.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 10, fontFace: 'Arial' });

  // Seat 02: Marcus (CTO)
  slide.addShape(pptx.ShapeType.roundRect, { x: 4.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: BG_CARD }, line: { color: ACCENT_BLUE, width: 1.5 } });
  slide.addText('SEAT 02 // MARCUS', { x: 5.0, y: 2.0, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: ACCENT_BLUE, fontFace: 'Arial' });
  slide.addText('Technical Architecture & CTO', { x: 5.0, y: 2.3, w: 3.2, h: 0.3, fontSize: 13, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
  slide.addText([
    { text: 'Domain: ', options: { bold: true, color: ACCENT_BLUE } },
    { text: 'Moat, Scalability & Tech Stack\n\n', options: { color: TEXT_MUTED } },
    { text: 'Tone & Style:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Curious developer teammate on Discord. No scary jargon unless requested. Evaluates real-world frameworks and user snappy feel.\n\n', options: { color: TEXT_MUTED } },
    { text: 'Focus Questions:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: '• What frameworks are you building with?\n• What was the hardest bug you conquered?\n• How does the app feel under high load?', options: { color: TEXT_MUTED } }
  ], { x: 5.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 10, fontFace: 'Arial' });

  // Seat 03: Vikram (CFO)
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: BG_CARD }, line: { color: ACCENT_AMBER, width: 1.5 } });
  slide.addText('SEAT 03 // VIKRAM', { x: 9.0, y: 2.0, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: ACCENT_AMBER, fontFace: 'Arial' });
  slide.addText('Capital & Financial Mentor', { x: 9.0, y: 2.3, w: 3.2, h: 0.3, fontSize: 13, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
  slide.addText([
    { text: 'Domain: ', options: { bold: true, color: ACCENT_AMBER } },
    { text: 'Unit Economics & Valuation\n\n', options: { color: TEXT_MUTED } },
    { text: 'Tone & Style:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Empathetic, clear, and encouraging. Simplifies pricing logic and helps founders map out runway and SAFE terms smoothly.\n\n', options: { color: TEXT_MUTED } },
    { text: 'Focus Questions:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: '• How are you thinking about subscription tiers?\n• What are your monthly server expenses?\n• Where will the first ₹10L be deployed?', options: { color: TEXT_MUTED } }
  ], { x: 9.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 10, fontFace: 'Arial' });
}

// Slide 4: Real-time Audio Engine & Barge-In Latency
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('TECHNICAL INNOVATION', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Zero-Latency Acoustic Interruption & Turn Arbitration', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  // 4 Telemetry Highlight Cards
  const stats = [
    { title: 'BARGE-IN LATENCY', value: '12ms', sub: 'Target < 200ms Hard SLA', color: ACCENT_EMERALD },
    { title: 'STALE AUDIO LEAKS', value: '0 frames', sub: 'Strict Epoch Cancellation', color: ACCENT_BLUE },
    { title: 'MONOTONIC EPOCHS', value: '#100% Sync', sub: 'No dropped user utterances', color: ACCENT_PURPLE },
    { title: 'PERSISTENT SUBTITLES', value: 'Live Vox', sub: 'Dual Founder & Agent feeds', color: ACCENT_AMBER },
  ];

  stats.forEach((s, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 1.8, w: 2.75, h: 1.5, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });
    slide.addText(s.title, { x: xPos + 0.2, y: 2.0, w: 2.35, h: 0.25, fontSize: 9, bold: true, color: TEXT_SUBTLE, fontFace: 'Arial' });
    slide.addText(s.value, { x: xPos + 0.2, y: 2.3, w: 2.35, h: 0.45, fontSize: 20, bold: true, color: s.color, fontFace: 'Arial' });
    slide.addText(s.sub, { x: xPos + 0.2, y: 2.8, w: 2.35, h: 0.3, fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial' });
  });

  // Architectural Pipeline Box
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 3.6, w: 11.6, h: 3.0, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });
  slide.addText('ACOUSTIC & ARBITRATION LIFECYCLE', { x: 1.1, y: 3.9, w: 11.0, h: 0.3, fontSize: 11, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });

  const steps = [
    { num: '01', title: 'Founder Voice Detection', desc: 'WebSpeech captures speech interim frames. Audio is locally muted in <15ms without server network delays.' },
    { num: '02', title: 'Parallel Evaluation', desc: 'Utterance streams to Gemini 2.5 Flash. All 3 committee seats evaluate turn bids with urgency ratings (1-100).' },
    { num: '03', title: 'Deterministic Arbiter', desc: 'Arbitration engine weighs addressed roles, contradiction interrupts, and floor fairness to pick the winning voice.' },
    { num: '04', title: 'Voice & Subtitle Broadcast', desc: 'Dispatches natural speech synthesis with monotonic epoch verification to guarantee zero stale audio.' },
  ];

  steps.forEach((st, idx) => {
    const xBox = 1.1 + idx * 2.75;
    slide.addText(`${st.num}. ${st.title}`, { x: xBox, y: 4.4, w: 2.5, h: 0.35, fontSize: 10, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
    slide.addText(st.desc, { x: xBox, y: 4.8, w: 2.5, h: 1.5, fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 14 });
  });
}

// Slide 5: Comprehensive Features & GTA 5 Radial HUD
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('USER EXPERIENCE & INTERACTION', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Cyber-Institutional HUD & Authentic Radial Sector Navigation', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  const features = [
    {
      title: 'GTA 5 Radial Selector Hub (Press Q)',
      desc: 'Interactive 360° circular pie-sector wheel allowing instant switching between Chamber, Claims Dossier, Founder Profile, Telemetry, and Voting Matrix with authentic reticle graphics.',
      color: ACCENT_EMERALD
    },
    {
      title: 'Live Discrepancy & Claims Ledger',
      desc: 'Categorizes spoken assertions into Financial, Technical, and Market buckets. Flags conflicting numbers in real-time with visual conflict indicators.',
      color: ACCENT_BLUE
    },
    {
      title: 'Interactive YC SAFE Dilution Calculator',
      desc: 'Live slider modeling for investment tranches ($100k-$2M) against post-money valuation caps ($2M-$25M) with dynamic pro-forma ownership split bars.',
      color: ACCENT_PURPLE
    },
    {
      title: 'Continuous Speech & Subtitle Stream',
      desc: 'Live high-frequency 12-bar responsive audio spectrum displaying real-time founder utterances and persistent mentor replies that never vanish abruptly.',
      color: ACCENT_AMBER
    }
  ];

  features.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 5.9;
    const yPos = 1.8 + row * 2.45;

    slide.addShape(pptx.ShapeType.roundRect, { x: xPos, y: yPos, w: 5.6, h: 2.2, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });
    slide.addText(f.title, { x: xPos + 0.3, y: yPos + 0.25, w: 5.0, h: 0.35, fontSize: 12, bold: true, color: f.color, fontFace: 'Arial' });
    slide.addText(f.desc, { x: xPos + 0.3, y: yPos + 0.65, w: 5.0, h: 1.35, fontSize: 10, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 16 });
  });
}

// Slide 6: Tech Stack & Deployment Architecture
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('INFRASTRUCTURE & DEPLOYMENT', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Enterprise-Grade Next.js Architecture with Zero-Key Deployment', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  // Stack breakdown
  const stack = [
    { cat: 'FRONTEND ENGINE', item: 'Next.js 16 (App Router, Turbopack)', detail: 'React 19, Tailwind CSS, Lucide icons, Canvas Confetti' },
    { cat: 'MULTI-AGENT BRAIN', item: 'Google Gemini 2.5 Flash SDK', detail: 'Structured JSON output, Google Search grounding tool, role-based system prompts' },
    { cat: 'VOICE SYNTHESIS', item: 'Dual Pipeline (WebSpeech + Rime)', detail: 'Natural human browser voices (Jenny, Guy, Ryan) + optional sub-200ms Rime VOX' },
    { cat: 'PERSISTENCE & STATE', item: 'In-Memory State + File DB', detail: 'Thread-safe MeetingOrchestrator class with monotonic epoch validation' },
  ];

  stack.forEach((s, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 1.8, w: 2.75, h: 2.5, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });
    slide.addText(s.cat, { x: xPos + 0.2, y: 2.0, w: 2.35, h: 0.25, fontSize: 9, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
    slide.addText(s.item, { x: xPos + 0.2, y: 2.35, w: 2.35, h: 0.6, fontSize: 12, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
    slide.addText(s.detail, { x: xPos + 0.2, y: 3.0, w: 2.35, h: 1.1, fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 14 });
  });

  // Zero-Key Deployment Box
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 4.6, w: 11.6, h: 2.0, fill: { color: '064E3B' }, line: { color: ACCENT_EMERALD, width: 1.5 } });
  slide.addText('SEAMLESS CLOUD DEPLOYMENT (VERCEL READY)', { x: 1.1, y: 4.85, w: 11.0, h: 0.3, fontSize: 12, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });
  slide.addText('Cavyn requires ZERO mandatory environment variables to build and run. Anyone can deploy to Vercel with 1-click. Users and evaluators can plug in their own free Google Gemini or Rime API keys directly in the web UI at runtime with in-memory encryption, or test using the comprehensive offline committee simulation model.', {
    x: 1.1, y: 5.25, w: 11.0, h: 1.1,
    fontSize: 10, color: 'D1FAE5', fontFace: 'Arial', lineSpacing: 16
  });
}

// Slide 7: Conclusion & Summary
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('PROJECT SUMMARY', { x: 0.8, y: 0.6, w: 10, h: 0.3, fontSize: 10, bold: true, color: ACCENT_EMERALD, fontFace: 'Arial' });
  slide.addText('Cavyn: The Future of Autonomous Founder Advisory', { x: 0.8, y: 0.9, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: TEXT_WHITE, fontFace: 'Arial' });

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.8, w: 11.6, h: 4.8, fill: { color: BG_CARD }, line: { color: '374151', width: 1 } });

  slide.addText([
    { text: 'Key Highlights & Achievements:\n\n', options: { bold: true, fontSize: 14, color: ACCENT_EMERALD } },
    { text: '✔ Real-Time Multi-Agent Conversation: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Elena, Marcus, and Vikram cross-examine and debate like a real 4-person board.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Ultra-Responsive Acoustic Barge-In: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Sub-15ms local muting allows founders to take the floor naturally at any moment.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Human Tone & Natural Accents: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Friendly peer-to-peer mentoring style eliminates stressful viva/exam atmosphere.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Complete Institutional Due Diligence: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Automated contradiction detection, interactive SAFE cap tables, and exportable JSON dossiers.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Clean Zero-Key Deployment: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Runs fully client-side and server-side with zero mandatory secrets on Vercel.\n\n', options: { color: TEXT_MUTED } },
    { text: 'GitHub Repository: https://github.com/Nitanshu715/Cavyn\nProduction Ready | Next.js 16 Turbopack Verified', options: { bold: true, color: ACCENT_BLUE } }
  ], { x: 1.2, y: 2.1, w: 10.8, h: 4.2, fontSize: 11, fontFace: 'Arial', lineSpacing: 18 });
}

const outputPath = path.join(process.cwd(), 'Cavyn_Presentation.pptx');
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log('Presentation generated successfully at: ' + outputPath);
}).catch(err => {
  console.error('Error generating presentation:', err);
});
