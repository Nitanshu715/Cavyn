const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Initialize 16:9 Widescreen PDF (841.89 pt x 473.56 pt)
const doc = new PDFDocument({
  size: [842, 474],
  margins: { top: 30, bottom: 30, left: 45, right: 45 },
  autoFirstPage: false
});

const outputPath = path.join(process.cwd(), 'Cavyn_Presentation.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const BG_DARK = '#0B0F19';
const BG_CARD = '#111827';
const BG_CARD_BORDER = '#1F2937';
const ACCENT_EMERALD = '#10B981';
const ACCENT_BLUE = '#38BDF8';
const ACCENT_PURPLE = '#A855F7';
const ACCENT_AMBER = '#F59E0B';
const ACCENT_ROSE = '#F43F5E';
const TEXT_WHITE = '#FFFFFF';
const TEXT_MUTED = '#9CA3AF';
const TEXT_SUBTLE = '#6B7280';

function startSlide() {
  doc.addPage();
  doc.rect(0, 0, 842, 474).fill(BG_DARK);
}

function addHeader(badge, title) {
  doc.fillColor(ACCENT_EMERALD).fontSize(8).font('Helvetica-Bold').text(badge, 45, 25);
  doc.fillColor(TEXT_WHITE).fontSize(16).font('Helvetica-Bold').text(title, 45, 40);
}

// -------------------------------------------------------------
// SLIDE 1: TITLE
// -------------------------------------------------------------
startSlide();

doc.roundedRect(45, 65, 175, 22, 4).fillAndStroke('#064E3B', ACCENT_EMERALD);
doc.fillColor(ACCENT_EMERALD).fontSize(7.5).font('Helvetica-Bold').text('INSTITUTIONAL ROUNDTABLE', 52, 72);

doc.fillColor(TEXT_WHITE).fontSize(38).font('Helvetica-Bold').text('CAVYN', 45, 105);
doc.fillColor(ACCENT_EMERALD).fontSize(16).font('Helvetica-Bold').text('Autonomous Multi-Agent Voice Boardroom', 45, 155);

doc.fillColor(TEXT_MUTED).fontSize(10.5).font('Helvetica').text(
  'Next-generation conversational arbitration engine evaluating venture pitches across Strategic Scale (CEO), Technical Architecture (CTO), and Capital Viability (CFO) with sub-15ms acoustic interruption and monotonic epoch state validation.',
  45, 185, { width: 752, lineGap: 4 }
);

// Highlights Box
doc.roundedRect(45, 260, 752, 80, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);

const highlights = [
  { title: 'Zero-Latency Barge-In', desc: '<15ms local silence with zero audio leaks' },
  { title: '3 Autonomous Brains', desc: 'Elena (CEO), Marcus (CTO), Vikram (CFO)' },
  { title: 'Deterministic Arbiter', desc: 'Monotonic epoch validation and priority matrix' },
  { title: 'Zero-Key Deployment', desc: 'Runs instantly on Vercel with optional BYOK' }
];

highlights.forEach((h, i) => {
  const x = 60 + i * 185;
  doc.fillColor(ACCENT_BLUE).fontSize(10).font('Helvetica-Bold').text(h.title, x, 280, { width: 170 });
  doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(h.desc, x, 300, { width: 170 });
});

doc.moveTo(45, 385).lineTo(797, 385).strokeColor(BG_CARD_BORDER).lineWidth(1).stroke();
doc.fillColor(TEXT_SUBTLE).fontSize(8.5).font('Helvetica').text(
  'Built with Next.js 16 (Turbopack)  |  Google Gemini 2.5 Flash SDK  |  Web Speech API & Rime VOX',
  45, 400
);

// -------------------------------------------------------------
// SLIDE 2: THE FOUNDER DILEMMA & SOLUTION
// -------------------------------------------------------------
startSlide();
addHeader('EXECUTIVE OVERVIEW', 'Bridging Founders and Institutional Advisory');

// Left Column: Problem
doc.roundedRect(45, 80, 365, 345, 8).fillAndStroke(BG_CARD, '#4B1D24');
doc.fillColor(ACCENT_ROSE).fontSize(11).font('Helvetica-Bold').text('THE FOUNDER DILEMMA', 65, 100);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Intimidating Pitch Dynamics', 65, 130);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'First-time builders face stressful, adversarial viva-style question rounds without empathetic feedback.',
  75, 145, { width: 315, lineGap: 3 }
);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Technical & Financial Jargon', 65, 195);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'Founders stumble on wall-street acronyms (CAC payback, LTV, P99 SLA) rather than exploring true customer value.',
  75, 210, { width: 315, lineGap: 3 }
);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Rigid AI Limitations', 65, 260);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'Traditional chatbot simulations sound mechanical, talk down to users, and cannot handle live acoustic interruption.',
  75, 275, { width: 315, lineGap: 3 }
);

// Right Column: Solution
doc.roundedRect(432, 80, 365, 345, 8).fillAndStroke(BG_CARD, '#064E3B');
doc.fillColor(ACCENT_EMERALD).fontSize(11).font('Helvetica-Bold').text('THE CAVYN SOLUTION', 452, 100);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Collaborative 3-Seat Mentorship', 452, 130);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'Elena (CEO), Marcus (CTO), and Vikram (CFO) act as empathetic peers advising you casually over coffee.',
  462, 145, { width: 315, lineGap: 3 }
);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Sub-15ms Acoustic Barge-In', 452, 195);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'Speak at any moment—active mentor audio silences locally in <15ms with guaranteed zero stale audio leaks.',
  462, 210, { width: 315, lineGap: 3 }
);

doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica-Bold').text('• Real-Time Discrepancy Ledger', 452, 260);
doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(
  'Automatically logs claims into Market, Tech, and Financial buckets, detecting and flagging metric contradictions live.',
  462, 275, { width: 315, lineGap: 3 }
);

// -------------------------------------------------------------
// SLIDE 3: COMMITTEE PERSONAS
// -------------------------------------------------------------
startSlide();
addHeader('AUTONOMOUS COMMITTEE SEATS', 'Three Specialized Brains in Continuous Dialogue');

const personas = [
  {
    code: 'SEAT 01 // ELENA VANCE', title: 'Lead Partner & CEO', color: ACCENT_EMERALD,
    domain: 'Market Scale, Moat & Narrative',
    tone: 'Warm, visionary, supportive. Asks about early users, customer pain points, and distribution velocity.',
    q1: 'Who was the first person to try your app?',
    q2: 'What is the biggest pain you solve for them?'
  },
  {
    code: 'SEAT 02 // MARCUS STONE', title: 'Technical Advisor & CTO', color: ACCENT_BLUE,
    domain: 'Architecture, Moat & Scalability',
    tone: 'Curious developer teammate on Discord. Avoids alienating jargon; focuses on snappy user experience.',
    q1: 'What frameworks are you building with?',
    q2: 'What was your hardest technical hurdle?'
  },
  {
    code: 'SEAT 03 // VIKRAM RAO', title: 'Financial Mentor & CFO', color: ACCENT_AMBER,
    domain: 'Unit Economics & Cash Health',
    tone: 'Calm, encouraging financial advisor. Breaks down pricing models and runway into simple concepts.',
    q1: 'How will you charge paying customers?',
    q2: 'Where will your initial capital be deployed?'
  }
];

personas.forEach((p, i) => {
  const x = 45 + i * 258;
  doc.roundedRect(x, 80, 240, 345, 8).fillAndStroke(BG_CARD, p.color);
  
  doc.fillColor(p.color).fontSize(9).font('Helvetica-Bold').text(p.code, x + 15, 100);
  doc.fillColor(TEXT_WHITE).fontSize(12).font('Helvetica-Bold').text(p.title, x + 15, 118);
  
  doc.fillColor(p.color).fontSize(8.5).font('Helvetica-Bold').text('Focus Domain:', x + 15, 145);
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(p.domain, x + 15, 160, { width: 210 });

  doc.fillColor(TEXT_WHITE).fontSize(8.5).font('Helvetica-Bold').text('Voice & Mentoring Style:', x + 15, 195);
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(p.tone, x + 15, 210, { width: 210, lineGap: 2 });

  doc.fillColor(TEXT_WHITE).fontSize(8.5).font('Helvetica-Bold').text('Example Inquiries:', x + 15, 280);
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(`• "${p.q1}"\n• "${p.q2}"`, x + 15, 295, { width: 210, lineGap: 3 });
});

// -------------------------------------------------------------
// SLIDE 4: ACOUSTIC PIPELINE & BARGE-IN
// -------------------------------------------------------------
startSlide();
addHeader('TECHNICAL INNOVATION', 'Sub-15ms Acoustic Interruption & Turn Arbitration');

const pipelineMetrics = [
  { label: 'BARGE-IN LATENCY', val: '< 15ms', desc: 'Instant local silence', col: ACCENT_EMERALD },
  { label: 'STALE AUDIO LEAKS', val: '0 Frames', desc: 'Strict epoch invalidation', col: ACCENT_BLUE },
  { label: 'MONOTONIC EPOCHS', val: '100% Sync', desc: 'No dropped turns', col: ACCENT_PURPLE },
  { label: 'SUBTITLE STREAM', val: 'Dual-Party', desc: 'Persistent transcript tray', col: ACCENT_AMBER }
];

pipelineMetrics.forEach((m, i) => {
  const x = 45 + i * 193;
  doc.roundedRect(x, 80, 175, 85, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);
  doc.fillColor(TEXT_SUBTLE).fontSize(7.5).font('Helvetica-Bold').text(m.label, x + 15, 95);
  doc.fillColor(m.col).fontSize(16).font('Helvetica-Bold').text(m.val, x + 15, 112);
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(m.desc, x + 15, 135);
});

// Lifecycle Pipeline Card
doc.roundedRect(45, 185, 752, 240, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);
doc.fillColor(ACCENT_EMERALD).fontSize(10).font('Helvetica-Bold').text('FOUR-STAGE CONVERSATIONAL TURN LIFECYCLE', 65, 205);

const pipelineSteps = [
  { num: '01', title: 'Acoustic Detection', desc: 'Web Speech captures speech interim frames. Playing agent audio is muted locally in <15ms without server network roundtrip.' },
  { num: '02', title: 'Parallel Bid Evaluation', desc: 'Final utterance streams to Google Gemini 2.5 Flash. All three committee seats evaluate turn bids with urgency scores (1-100).' },
  { num: '03', title: 'Deterministic Arbiter', desc: 'Cavyn arbiter evaluates addressed roles, contradiction interrupts, and conversational fairness to elect the single speaker.' },
  { num: '04', title: 'Synthesis & Broadcast', desc: 'Speech is synthesized via natural human voices with monotonic epoch tagging, ensuring zero playback if interrupted.' }
];

pipelineSteps.forEach((s, i) => {
  const x = 65 + i * 180;
  doc.fillColor(TEXT_WHITE).fontSize(9).font('Helvetica-Bold').text(`${s.num}. ${s.title}`, x, 240, { width: 165 });
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(s.desc, x, 260, { width: 165, lineGap: 3 });
});

// -------------------------------------------------------------
// SLIDE 5: USER EXPERIENCE & INTERACTION HUD
// -------------------------------------------------------------
startSlide();
addHeader('USER EXPERIENCE & INTERACTION', 'Cyber-Institutional HUD & Radial Sector Navigation');

const uxFeatures = [
  {
    title: 'GTA 5 Radial Hub (Press Q)',
    desc: 'Interactive 360° circular pie-sector wheel allowing instant switching between Chamber, Claims Dossier, Founder Profile, Telemetry, and Voting Matrix with authentic reticle HUD graphics.',
    col: ACCENT_EMERALD
  },
  {
    title: 'Live Discrepancy & Claims Ledger',
    desc: 'Categorizes spoken assertions into Financial, Technical, and Market buckets. Flags conflicting numbers in real-time with visual conflict indicators and audit timestamps.',
    col: ACCENT_BLUE
  },
  {
    title: 'Interactive SAFE Dilution Calculator',
    desc: 'Dynamic slider modeling for investment tranches ($100k-$2M) against post-money valuation caps ($2M-$25M) with live pro-forma ownership split bars.',
    col: ACCENT_PURPLE
  },
  {
    title: 'Persistent Subtitle & Audio Stream',
    desc: 'Live high-frequency 12-bar responsive audio spectrum displaying real-time founder utterances and persistent mentor replies that never vanish abruptly.',
    col: ACCENT_AMBER
  }
];

uxFeatures.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 45 + col * 386;
  const y = 80 + row * 170;

  doc.roundedRect(x, y, 366, 150, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);
  doc.fillColor(f.col).fontSize(11).font('Helvetica-Bold').text(f.title, x + 20, y + 20);
  doc.fillColor(TEXT_MUTED).fontSize(8.5).font('Helvetica').text(f.desc, x + 20, y + 45, { width: 326, lineGap: 4 });
});

// -------------------------------------------------------------
// SLIDE 6: INFRASTRUCTURE & ZERO-KEY DEPLOYMENT
// -------------------------------------------------------------
startSlide();
addHeader('INFRASTRUCTURE & DEPLOYMENT', 'Enterprise Architecture with Zero-Key Deployment');

const infraStack = [
  { cat: 'FRONTEND ENGINE', title: 'Next.js 16 (App Router)', desc: 'Turbopack, React 19, Tailwind CSS v4, Lucide Icons' },
  { cat: 'MULTI-AGENT BRAIN', title: 'Google Gemini 2.5 Flash', desc: 'Structured JSON responses, Search grounding & role prompts' },
  { cat: 'VOICE SYNTHESIS', title: 'Dual Audio Pipeline', desc: 'Natural browser human voices (Jenny, Guy, Ryan) + Rime VOX' },
  { cat: 'STATE & RUNTIME', title: 'Thread-Safe Orchestrator', desc: 'In-memory state machine with monotonic epoch tracking' }
];

infraStack.forEach((s, i) => {
  const x = 45 + i * 193;
  doc.roundedRect(x, 80, 175, 140, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);
  doc.fillColor(ACCENT_EMERALD).fontSize(7.5).font('Helvetica-Bold').text(s.cat, x + 15, 95);
  doc.fillColor(TEXT_WHITE).fontSize(10.5).font('Helvetica-Bold').text(s.title, x + 15, 115, { width: 145 });
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(s.desc, x + 15, 150, { width: 145, lineGap: 2 });
});

// Zero-Key Deployment Banner
doc.roundedRect(45, 240, 752, 185, 8).fillAndStroke('#064E3B', ACCENT_EMERALD);
doc.fillColor(TEXT_WHITE).fontSize(11).font('Helvetica-Bold').text('SEAMLESS VERCEL CLOUD DEPLOYMENT (ZERO KEYS REQUIRED)', 65, 265);

doc.fillColor('#D1FAE5').fontSize(9).font('Helvetica').text(
  'Cavyn requires ZERO mandatory environment variables to build and deploy. Anyone can deploy to Vercel with 1 click. Visitors can test immediately using the built-in offline simulation model, or plug in their personal Google Gemini key directly in the web UI for real-time live LLM deliberation with in-memory encryption.\n\n' +
  '• Live URL: https://cavyn-boardroom.vercel.app\n' +
  '• GitHub: https://github.com/Nitanshu715/Cavyn\n' +
  '• Full offline fallback for air-gapped or keyless execution',
  65, 295, { width: 712, lineGap: 5 }
);

// -------------------------------------------------------------
// SLIDE 7: PROJECT SUMMARY & ROADMAP
// -------------------------------------------------------------
startSlide();
addHeader('PROJECT SUMMARY', 'Cavyn: The Future of Autonomous Founder Mentorship');

doc.roundedRect(45, 80, 752, 345, 8).fillAndStroke(BG_CARD, BG_CARD_BORDER);

const bulletPoints = [
  'Real-Time Multi-Agent Debate: Elena, Marcus, and Vikram converse and cross-examine like an authentic 4-person board.',
  'Ultra-Fast Acoustic Interruption: Sub-15ms local muting allows founders to speak naturally without waiting for awkward turn timeouts.',
  'Relaxed Human Dialogue: Supportive peer coaching completely eliminates stressful viva/interrogation vibes.',
  'Institutional Due Diligence: Automated claim extraction, contradiction detection, and interactive SAFE dilution modeling.',
  'Zero-Key Cloud Deployment: Runs smoothly on Vercel out of the box with zero mandatory secrets and optional runtime BYOK.'
];

let currentY = 110;
doc.fillColor(ACCENT_EMERALD).fontSize(12).font('Helvetica-Bold').text('Key Achievements & Capabilities:', 65, currentY);
currentY += 30;

bulletPoints.forEach((bp) => {
  doc.fillColor(ACCENT_EMERALD).fontSize(10).font('Helvetica-Bold').text('✔', 65, currentY);
  doc.fillColor(TEXT_WHITE).fontSize(9.5).font('Helvetica').text(bp, 85, currentY, { width: 685, lineGap: 3 });
  currentY += 36;
});

doc.moveTo(65, 360).lineTo(777, 360).strokeColor(BG_CARD_BORDER).lineWidth(1).stroke();

doc.fillColor(ACCENT_BLUE).fontSize(9.5).font('Helvetica-Bold').text(
  'Production Deployment: https://cavyn-boardroom.vercel.app\nGitHub Repository: https://github.com/Nitanshu715/Cavyn',
  65, 375, { lineGap: 4 }
);

doc.end();

stream.on('finish', () => {
  console.log('PDF presentation generated successfully at: ' + outputPath);
});
