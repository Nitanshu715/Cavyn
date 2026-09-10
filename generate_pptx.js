const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();

// Set 16:9 Widescreen Layout (10 inches wide x 5.625 inches high)
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Cavyn Engineering Team';
pptx.company = 'Cavyn Autonomous Systems';
pptx.title = 'Cavyn - Autonomous Multi-Agent Institutional Boardroom';

// Design Palette
const BG_DARK = '0B0F19';
const BG_CARD = '111827';
const BG_CARD_BORDER = '1F2937';
const ACCENT_EMERALD = '10B981';
const ACCENT_BLUE = '38BDF8';
const ACCENT_PURPLE = 'A855F7';
const ACCENT_AMBER = 'F59E0B';
const ACCENT_ROSE = 'F43F5E';
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '9CA3AF';
const TEXT_SUBTLE = '6B7280';

// Helper for Slide Headers to keep exact consistent proportions
function addSlideHeader(slide, badge, title) {
  slide.addText(badge, {
    x: 0.8, y: 0.4, w: 8.4, h: 0.25,
    fontSize: 9, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri'
  });
  slide.addText(title, {
    x: 0.8, y: 0.65, w: 8.4, h: 0.4,
    fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Calibri'
  });
}

// -------------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 0.9, w: 2.2, h: 0.32,
    fill: { color: '064E3B' },
    line: { color: ACCENT_EMERALD, width: 1 }
  });
  slide.addText('INSTITUTIONAL ROUNDTABLE', {
    x: 0.8, y: 0.9, w: 2.2, h: 0.32,
    fontSize: 8.5, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri', align: 'center', valign: 'middle'
  });

  slide.addText('CAVYN', {
    x: 0.8, y: 1.4, w: 8.4, h: 0.9,
    fontSize: 44, bold: true, color: TEXT_WHITE, fontFace: 'Calibri'
  });

  slide.addText('Autonomous Multi-Agent Voice Boardroom', {
    x: 0.8, y: 2.3, w: 8.4, h: 0.4,
    fontSize: 18, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri'
  });

  slide.addText('Next-generation conversational arbitration engine evaluating venture pitches across Strategic Scale (CEO), Technical Architecture (CTO), and Capital Viability (CFO) with sub-15ms acoustic interruption and monotonic epoch state validation.', {
    x: 0.8, y: 2.8, w: 8.4, h: 0.75,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Calibri', lineSpacing: 16
  });

  // Feature Highlights Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 3.75, w: 8.4, h: 0.95,
    fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
  });

  const highlights = [
    { title: 'Zero-Latency Barge-In', desc: '<15ms local silence' },
    { title: '3 Specialized Brains', desc: 'Elena, Marcus & Vikram' },
    { title: 'Deterministic Arbiter', desc: 'Monotonic epoch safety' },
    { title: 'Zero-Key Deployment', desc: 'Vercel ready with BYOK' }
  ];
  highlights.forEach((h, idx) => {
    const xPos = 1.0 + idx * 2.05;
    slide.addText(h.title, { x: xPos, y: 3.85, w: 1.95, h: 0.25, fontSize: 10, bold: true, color: ACCENT_BLUE, fontFace: 'Calibri' });
    slide.addText(h.desc, { x: xPos, y: 4.12, w: 1.95, h: 0.4, fontSize: 8.5, color: TEXT_MUTED, fontFace: 'Calibri' });
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 4.9, w: 8.4, h: 0,
    line: { color: BG_CARD_BORDER, width: 1 }
  });

  slide.addText('Next.js 16 (Turbopack)  |  Google Gemini 2.5 Flash  |  Web Speech API & Rime VOX', {
    x: 0.8, y: 5.05, w: 8.4, h: 0.25,
    fontSize: 9, color: TEXT_SUBTLE, fontFace: 'Calibri'
  });
}

// -------------------------------------------------------------
// SLIDE 2: THE FOUNDER DILEMMA & CAVYN SOLUTION
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'EXECUTIVE OVERVIEW', 'Bridging Founders and Institutional Advisory');

  // Left Column: The Problem
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.25, w: 4.05, h: 3.85,
    fill: { color: BG_CARD }, line: { color: '4B1D24', width: 1 }
  });
  slide.addText('THE FOUNDER DILEMMA', {
    x: 1.0, y: 1.4, w: 3.65, h: 0.3,
    fontSize: 11, bold: true, color: ACCENT_ROSE, fontFace: 'Calibri'
  });
  slide.addText([
    { text: '• Intimidating Pitch Dynamics:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'First-time builders often face stressful, interrogation-style pitch reviews without supportive coaching.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Technical & Financial Jargon:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Founders stumble on wall-street acronyms (CAC, LTV, P99 SLA) rather than exploring true customer value.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Robotic AI Limitations:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Traditional AI bots sound mechanical, lecture like examiners, and fail on live interruption.', options: { color: TEXT_MUTED } }
  ], { x: 1.0, y: 1.75, w: 3.65, h: 3.2, fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 14 });

  // Right Column: The Cavyn Solution
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.15, y: 1.25, w: 4.05, h: 3.85,
    fill: { color: BG_CARD }, line: { color: '064E3B', width: 1.2 }
  });
  slide.addText('THE CAVYN SOLUTION', {
    x: 5.35, y: 1.4, w: 3.65, h: 0.3,
    fontSize: 11, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri'
  });
  slide.addText([
    { text: '• Collaborative 3-Seat Mentorship:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Elena (CEO), Marcus (CTO), and Vikram (CFO) act as empathetic peers chatting over coffee.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Sub-15ms Acoustic Barge-In:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Speak at any moment—active mentor audio silences instantly with zero stale audio leaks.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Real-Time Discrepancy Ledger:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Automatically records financial metrics and tech claims, flagging contradictions in real-time.', options: { color: TEXT_MUTED } }
  ], { x: 5.35, y: 1.75, w: 3.65, h: 3.2, fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 14 });
}

// -------------------------------------------------------------
// SLIDE 3: COMMITTEE PERSONAS & ARCHITECTURE
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'AUTONOMOUS COMMITTEE SEATS', 'Three Specialized Brains in Continuous Dialogue');

  const personas = [
    {
      code: 'SEAT 01', name: 'ELENA VANCE', title: 'Lead Partner & CEO',
      domain: 'Market Scale, Moat & Story', color: ACCENT_EMERALD,
      tone: 'Warm, visionary, supportive. Asks about early users, customer pain points, and distribution velocity.',
      q1: 'Who was the first person to try your app?',
      q2: 'What is the biggest pain you solve for them?'
    },
    {
      code: 'SEAT 02', name: 'MARCUS STONE', title: 'Technical Advisor & CTO',
      domain: 'Architecture, Moat & Scalability', color: ACCENT_BLUE,
      tone: 'Curious developer teammate on Discord. Avoids alienating jargon; focuses on snappy user experience.',
      q1: 'What frameworks are you building with?',
      q2: 'What was your hardest technical hurdle?'
    },
    {
      code: 'SEAT 03', name: 'VIKRAM RAO', title: 'Financial Mentor & CFO',
      domain: 'Unit Economics & Cash Health', color: ACCENT_AMBER,
      tone: 'Calm, encouraging financial advisor. Breaks down pricing models and runway into simple concepts.',
      q1: 'How will you charge paying customers?',
      q2: 'Where will your initial capital be deployed?'
    }
  ];

  personas.forEach((p, idx) => {
    const xPos = 0.8 + idx * 2.85;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.25, w: 2.7, h: 3.85,
      fill: { color: BG_CARD }, line: { color: p.color, width: 1.2 }
    });

    slide.addText(`${p.code} // ${p.name}`, {
      x: xPos + 0.15, y: 1.4, w: 2.4, h: 0.25,
      fontSize: 10, bold: true, color: p.color, fontFace: 'Calibri'
    });
    slide.addText(p.title, {
      x: xPos + 0.15, y: 1.65, w: 2.4, h: 0.25,
      fontSize: 11, bold: true, color: TEXT_WHITE, fontFace: 'Calibri'
    });

    slide.addText([
      { text: 'Focus: ', options: { bold: true, color: p.color } },
      { text: `${p.domain}\n\n`, options: { color: TEXT_MUTED } },
      { text: 'Voice Style:\n', options: { bold: true, color: TEXT_WHITE } },
      { text: `${p.tone}\n\n`, options: { color: TEXT_MUTED } },
      { text: 'Example Inquiries:\n', options: { bold: true, color: TEXT_WHITE } },
      { text: `• "${p.q1}"\n• "${p.q2}"`, options: { color: TEXT_MUTED } }
    ], { x: xPos + 0.15, y: 1.95, w: 2.4, h: 3.0, fontSize: 8.5, fontFace: 'Calibri', lineSpacing: 13 });
  });
}

// -------------------------------------------------------------
// SLIDE 4: ACOUSTIC PIPELINE & BARGE-IN ARBITRATION
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'TECHNICAL INNOVATION', 'Sub-15ms Acoustic Interruption & Turn Arbitration');

  // Top Metrics Row
  const metrics = [
    { title: 'BARGE-IN LATENCY', val: '< 15ms', sub: 'Instant client audio mute', color: ACCENT_EMERALD },
    { title: 'STALE AUDIO LEAKS', val: '0 Frames', sub: 'Strict epoch cancellation', color: ACCENT_BLUE },
    { title: 'MONOTONIC EPOCHS', val: '100% Sync', sub: 'No dropped user utterances', color: ACCENT_PURPLE },
    { title: 'SUBTITLE STREAM', val: 'Real-Time', sub: 'Persistent dual-party feed', color: ACCENT_AMBER }
  ];

  metrics.forEach((m, idx) => {
    const xPos = 0.8 + idx * 2.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.25, w: 1.95, h: 1.15,
      fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
    });
    slide.addText(m.title, { x: xPos + 0.1, y: 1.35, w: 1.75, h: 0.2, fontSize: 7.5, bold: true, color: TEXT_SUBTLE, fontFace: 'Calibri' });
    slide.addText(m.val, { x: xPos + 0.1, y: 1.55, w: 1.75, h: 0.4, fontSize: 16, bold: true, color: m.color, fontFace: 'Calibri' });
    slide.addText(m.sub, { x: xPos + 0.1, y: 1.95, w: 1.75, h: 0.3, fontSize: 8, color: TEXT_MUTED, fontFace: 'Calibri' });
  });

  // Pipeline Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 2.6, w: 8.4, h: 2.5,
    fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
  });
  slide.addText('FOUR-STAGE CONVERSATIONAL TURN LIFECYCLE', {
    x: 1.0, y: 2.75, w: 8.0, h: 0.25,
    fontSize: 9.5, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri'
  });

  const steps = [
    { num: '01', title: 'Acoustic Detection', desc: 'WebSpeech captures speech interim frames. Audio is locally muted in <15ms without server network delays.' },
    { num: '02', title: 'Parallel Bid Evaluation', desc: 'Utterance streams to Gemini 2.5 Flash. All 3 committee seats evaluate turn bids with urgency ratings (1-100).' },
    { num: '03', title: 'Deterministic Arbiter', desc: 'Arbitration engine weighs addressed roles, contradiction interrupts, and floor fairness to pick the winning voice.' },
    { num: '04', title: 'Synthesis & Broadcast', desc: 'Dispatches natural speech synthesis with monotonic epoch verification to guarantee zero stale audio.' }
  ];

  steps.forEach((st, idx) => {
    const xBox = 1.0 + idx * 2.0;
    slide.addText(`${st.num}. ${st.title}`, { x: xBox, y: 3.1, w: 1.85, h: 0.35, fontSize: 9, bold: true, color: TEXT_WHITE, fontFace: 'Calibri' });
    slide.addText(st.desc, { x: xBox, y: 3.45, w: 1.85, h: 1.45, fontSize: 8, color: TEXT_MUTED, fontFace: 'Calibri', lineSpacing: 12 });
  });
}

// -------------------------------------------------------------
// SLIDE 5: USER EXPERIENCE & INTERACTION HUD
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'USER EXPERIENCE & INTERACTION', 'Cyber-Institutional HUD & Radial Sector Navigation');

  const features = [
    {
      title: 'GTA 5 Radial Hub (Press Q)',
      desc: 'Interactive 360° circular pie-sector wheel allowing instant switching between Chamber, Claims Dossier, Founder Profile, Telemetry, and Voting Matrix with authentic reticle HUD graphics.',
      color: ACCENT_EMERALD
    },
    {
      title: 'Live Discrepancy & Claims Ledger',
      desc: 'Categorizes spoken assertions into Financial, Technical, and Market buckets. Flags conflicting numbers in real-time with visual conflict indicators and audit timestamps.',
      color: ACCENT_BLUE
    },
    {
      title: 'Interactive SAFE Dilution Calculator',
      desc: 'Dynamic slider modeling for investment tranches ($100k-$2M) against post-money valuation caps ($2M-$25M) with live pro-forma ownership split bars.',
      color: ACCENT_PURPLE
    },
    {
      title: 'Persistent Subtitle & Audio Stream',
      desc: 'Live high-frequency 12-bar responsive audio spectrum displaying real-time founder utterances and persistent mentor replies that never vanish abruptly.',
      color: ACCENT_AMBER
    }
  ];

  features.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 4.3;
    const yPos = 1.25 + row * 1.95;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 4.1, h: 1.8,
      fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
    });
    slide.addText(f.title, { x: xPos + 0.2, y: yPos + 0.15, w: 3.7, h: 0.3, fontSize: 10.5, bold: true, color: f.color, fontFace: 'Calibri' });
    slide.addText(f.desc, { x: xPos + 0.2, y: yPos + 0.45, w: 3.7, h: 1.2, fontSize: 8.5, color: TEXT_MUTED, fontFace: 'Calibri', lineSpacing: 13 });
  });
}

// -------------------------------------------------------------
// SLIDE 6: INFRASTRUCTURE & ZERO-KEY DEPLOYMENT
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'INFRASTRUCTURE & DEPLOYMENT', 'Enterprise-Grade Architecture with Zero-Key Deployment');

  const stack = [
    { cat: 'FRONTEND ENGINE', item: 'Next.js 16 (App Router)', detail: 'Turbopack, React 19, Tailwind CSS v4, Lucide Icons' },
    { cat: 'MULTI-AGENT BRAIN', item: 'Google Gemini 2.5 Flash', detail: 'Structured JSON responses, Search grounding & role prompts' },
    { cat: 'VOICE SYNTHESIS', item: 'Dual Audio Pipeline', detail: 'Natural browser human voices (Jenny, Guy, Ryan) + Rime VOX' },
    { cat: 'STATE & RUNTIME', item: 'Thread-Safe Orchestrator', detail: 'In-memory state machine with monotonic epoch tracking' }
  ];

  stack.forEach((s, idx) => {
    const xPos = 0.8 + idx * 2.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.25, w: 1.95, h: 1.9,
      fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
    });
    slide.addText(s.cat, { x: xPos + 0.1, y: 1.35, w: 1.75, h: 0.2, fontSize: 7.5, bold: true, color: ACCENT_EMERALD, fontFace: 'Calibri' });
    slide.addText(s.item, { x: xPos + 0.1, y: 1.6, w: 1.75, h: 0.45, fontSize: 10.5, bold: true, color: TEXT_WHITE, fontFace: 'Calibri' });
    slide.addText(s.detail, { x: xPos + 0.1, y: 2.1, w: 1.75, h: 0.9, fontSize: 8, color: TEXT_MUTED, fontFace: 'Calibri', lineSpacing: 12 });
  });

  // Zero-Key Deployment Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 3.35, w: 8.4, h: 1.75,
    fill: { color: '064E3B' }, line: { color: ACCENT_EMERALD, width: 1.2 }
  });
  slide.addText('SEAMLESS VERCEL CLOUD DEPLOYMENT (ZERO KEYS REQUIRED)', {
    x: 1.0, y: 3.5, w: 8.0, h: 0.25,
    fontSize: 10, bold: true, color: TEXT_WHITE, fontFace: 'Calibri'
  });
  slide.addText('Cavyn requires ZERO mandatory environment variables to build and deploy. Anyone can deploy to Vercel with 1 click. Visitors can test immediately using the built-in offline simulation model, or plug in their personal Google Gemini key directly in the web UI for real-time live LLM deliberation with in-memory encryption.', {
    x: 1.0, y: 3.8, w: 8.0, h: 1.1,
    fontSize: 9, color: 'D1FAE5', fontFace: 'Calibri', lineSpacing: 14
  });
}

// -------------------------------------------------------------
// SLIDE 7: PROJECT SUMMARY & ROADMAP
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };
  addSlideHeader(slide, 'PROJECT SUMMARY', 'Cavyn: The Future of Autonomous Founder Mentorship');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.25, w: 8.4, h: 3.85,
    fill: { color: BG_CARD }, line: { color: BG_CARD_BORDER, width: 1 }
  });

  slide.addText([
    { text: 'Key Achievements & Capabilities:\n\n', options: { bold: true, fontSize: 12, color: ACCENT_EMERALD } },
    { text: '✔ Real-Time Multi-Agent Debate: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Elena, Marcus, and Vikram converse and cross-examine like an authentic 4-person board.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Ultra-Fast Acoustic Interruption: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Sub-15ms local muting allows founders to speak naturally without waiting for awkward turn timeouts.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Relaxed Human Dialogue: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Supportive peer coaching completely eliminates stressful viva/interrogation vibes.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Institutional Due Diligence: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Automated claim extraction, contradiction detection, and interactive SAFE dilution modeling.\n', options: { color: TEXT_MUTED } },
    { text: '✔ Zero-Key Cloud Deployment: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Runs smoothly on Vercel out of the box with zero mandatory secrets and optional runtime BYOK.\n\n', options: { color: TEXT_MUTED } },
    { text: 'Production Deployment: https://cavyn-boardroom.vercel.app\nGitHub Repository: https://github.com/Nitanshu715/Cavyn', options: { bold: true, color: ACCENT_BLUE } }
  ], { x: 1.1, y: 1.45, w: 7.8, h: 3.4, fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 15 });
}

const outputPath = path.join(process.cwd(), 'Cavyn_Presentation.pptx');
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log('Presentation generated successfully at: ' + outputPath);
}).catch(err => {
  console.error('Error generating presentation:', err);
});
