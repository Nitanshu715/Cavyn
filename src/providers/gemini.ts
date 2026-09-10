import { GoogleGenAI } from '@google/genai';
import { AgentRole, SharedMeetingState, AgentBelief } from '../types/boardroom';
import { COMMITTEE_SEATS } from '../agents/personas';
import { db } from '../db/schema';

export interface AgentDecisionResponse {
  spokenText: string;
  wantsToSpeak: boolean;
  urgency: number; // 1 - 100
  isContradictionInterrupt: boolean;
  sentimentDelta: {
    confidence: number;
    trust: number;
  };
  detectedContradiction?: string;
  matchedRule?: string;
}

/**
 * Cleans microphone speech, repairs common browser WebSpeech mishearings (e.g., 'turn manogies' -> 'terminologies'),
 * and normalizes conversational filler.
 */
function normalizeNoiseAndJitter(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  // Browser Web Speech common phonetic mishearings
  const phoneticReplacements: [RegExp, string][] = [
    [/\b(turn manogies|turn man ogies|terminogies|term anogies)\b/gi, 'terminologies'],
    [/\b(i don['’]?t understand your terminologies|i dont understand)\b/gi, 'I do not understand the jargon or metrics. Can you explain simply?'],
    [/\b(cack|see aye see|kack)\b/gi, 'CAC'],
    [/\b(el tee vee|l t v)\b/gi, 'LTV'],
    [/\b(an i audible|m i audible|am i audible|am i orderable)\b/gi, 'am I audible'],
    [/\b(can you hear me|can u hear me)\b/gi, 'can you hear me'],
    [/\b(tam|tee aye em)\b/gi, 'TAM'],
    [/\b(p 99|pee 99)\b/gi, 'P99'],
    [/\b(rupees|rupee)\b/gi, '₹'],
  ];

  for (const [pattern, replacement] of phoneticReplacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned
    .replace(/\b(um|uh|err|like|you know|sort of|basically)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export class GeminiAgentService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey.trim() });
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim();
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Tests whether the provided Gemini API key is valid with a minimal verification call
   */
  public async testKey(key: string): Promise<{ valid: boolean; message: string }> {
    try {
      const client = new GoogleGenAI({ apiKey: key.trim() });
      const res = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      });
      if (res && res.text) {
        return { valid: true, message: 'Gemini API authentication verified.' };
      }
      return { valid: false, message: 'No response from Gemini endpoint.' };
    } catch (e: any) {
      return { valid: false, message: `Gemini API error: ${e?.message || 'Invalid key'}` };
    }
  }

  /**
   * Evaluates the latest conversation turn from the perspective of an institutional committee seat.
   */
  public async evaluateAgentTurn(
    agentRole: AgentRole,
    userUtterance: string,
    history: { role: string; content: string }[],
    meetingState: SharedMeetingState,
    currentBelief: AgentBelief
  ): Promise<AgentDecisionResponse> {
    const seat = COMMITTEE_SEATS[agentRole];
    const sanitizedText = normalizeNoiseAndJitter(userUtterance);

    // Pull domain-specific rules from enterprise database
    const domainMapping: Record<AgentRole, 'market' | 'tech' | 'financial'> = {
      CEO: 'market',
      CTO: 'tech',
      CFO: 'financial',
    };
    const institutionalRules = db.getInstitutionalRules(domainMapping[agentRole]);
    const rulesSummary = institutionalRules
      .map((r) => `- [${r.riskLevel} RISK] ${r.rule}: Benchmark ${r.benchmarkMetric}`)
      .join('\n');

    if (!this.ai || !this.apiKey) {
      return this.generateSimulatedResponse(agentRole, sanitizedText, currentBelief, meetingState, history);
    }

    const { startupName, pitchGoal, fundingRequest, equityOffer, productSummary, targetCustomer, businessModel } = meetingState.config;
    const priorClaims = meetingState.claims.map((c) => `- [${c.category.toUpperCase()}]: "${c.text}"`).join('\n');

    const systemInstruction = `${seat.systemPrompt}

INSTITUTIONAL ROUNDTABLE CONTEXT:
- Venture: ${startupName || 'Venture'}
- Mandate: ${pitchGoal || 'Seed Round Approval'}
- Capital Allocation: ${fundingRequest || '₹50,00,000'} for ${equityOffer || '7.0%'} Equity
- Solution: ${productSummary || 'System Architecture'}
- Target Sector: ${targetCustomer || 'Enterprise'}
- Model: ${businessModel || 'B2B SaaS'}

INSTITUTIONAL BENCHMARK CRITERIA (DATABASE):
${rulesSummary}

COMMITTEE AUDIT STATUS:
- Your Seat's Current Conviction: ${currentBelief.confidence}%
- Your Seat's Trust Index: ${currentBelief.trust}%
- Prior Claims Recorded:
${priorClaims || '(None logged)'}

OPERATING MANDATES:
1. You are ${seat.code} (${seat.office}).
2. Tone: Warm, relaxed, human, founder-to-founder. Treat the founder like a peer over coffee.
3. No viva or exam vibes. Never lecture or interrogate. Ask 1 gentle, curious question or give a real insight.
4. If real products, companies, or tech stacks are mentioned, reference real facts and grounding.
5. Keep spoken response strictly 1 to 2 spoken sentences maximum.
6. Return response strictly in valid JSON matching:
{
  "spokenText": "1-2 natural spoken sentences",
  "wantsToSpeak": true/false,
  "urgency": number (1 to 100),
  "isContradictionInterrupt": boolean,
  "sentimentDelta": {
    "confidence": number (-15 to +15),
    "trust": number (-15 to +15)
  },
  "detectedContradiction": "description if numbers clashed, or null",
  "matchedRule": "Rule name if applicable"
}`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history.slice(-8).map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: `${h.role.toUpperCase()}: ${h.content}` }],
          })),
          {
            role: 'user',
            parts: [{ text: `Founder: "${sanitizedText}"` }],
          },
        ],
        config: {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed: AgentDecisionResponse = JSON.parse(cleanJson);
      return parsed;
    } catch (error) {
      console.warn(`[Gemini Committee Error] for ${agentRole}:`, error);
      return this.generateSimulatedResponse(agentRole, sanitizedText, currentBelief, meetingState, history);
    }
  }

  /**
   * Deterministic fallback when operating offline with dynamic, context-aware 4-person board dialogue.
   */
  private generateSimulatedResponse(
    role: AgentRole,
    userText: string,
    currentBelief: AgentBelief,
    meetingState: SharedMeetingState,
    history: { role: string; content: string }[]
  ): AgentDecisionResponse {
    const textLower = userText.toLowerCase().trim();
    const { fundingRequest, startupName, equityOffer } = meetingState.config;
    const historyCount = history.length;

    // Check for confusion / "don't understand" / beginner help
    if (
      textLower.includes('terminolog') ||
      textLower.includes('jargon') ||
      textLower.includes('confus') ||
      textLower.includes('viva') ||
      textLower.includes('interview') ||
      textLower.includes('beginner') ||
      textLower.includes('dont understand') ||
      textLower.includes("don't understand") ||
      textLower.includes('what do you mean') ||
      textLower.includes('simple')
    ) {
      if (role === 'CEO') {
        return {
          spokenText: `Hey, no worries at all! Let's toss out the fancy buzzwords. In simple terms: what does your product do, and who is it helping?`,
          wantsToSpeak: true,
          urgency: 99,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: +5, trust: +5 },
        };
      }
      if (role === 'CTO') {
        return {
          spokenText: `Totally get it, man. Forget the complex engineering jargon. Just walk me through: if I open your app today, what do I actually see and do?`,
          wantsToSpeak: true,
          urgency: 95,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: +4, trust: +4 },
        };
      }
      return {
        spokenText: `Fair point! We're here to brainstorm together, not grill you like a test. Tell us simply: how do you plan to make money with this?`,
        wantsToSpeak: true,
        urgency: 96,
        isContradictionInterrupt: false,
        sentimentDelta: { confidence: +4, trust: +4 },
      };
    }

    // Check for greeting / audible checks like "am I audible", "hello", "can you hear me"
    if (
      textLower.includes('audible') ||
      textLower.includes('hear me') ||
      textLower.includes('can you hear') ||
      textLower.includes('testing') ||
      textLower === 'hello' ||
      textLower === 'hi'
    ) {
      if (role === 'CEO') {
        return {
          spokenText: `Hey there! Yes, we hear you loud and clear. Welcome to the session! Tell us a bit about what you're building with ${startupName}.`,
          wantsToSpeak: true,
          urgency: 92,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: +2, trust: +2 },
        };
      }
      if (role === 'CTO') {
        return {
          spokenText: `Hey! Mic sounds great. Really excited to hear about your project—take your time and tell us what inspired this!`,
          wantsToSpeak: true,
          urgency: 85,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: +2, trust: +2 },
        };
      }
      return {
        spokenText: `Hi! We're ready whenever you are. Just chat with us casually like a friend—what's the core idea behind your business?`,
        wantsToSpeak: true,
        urgency: 88,
        isContradictionInterrupt: false,
        sentimentDelta: { confidence: +2, trust: +2 },
      };
    }

    // Friendly contradiction handling (gentle clarification instead of aggressive conflict)
    if (
      (textLower.includes('actually') || textLower.includes('instead') || textLower.includes('only') || textLower.includes('wait') || textLower.includes('mistake')) &&
      (textLower.includes('cac') || textLower.includes('price') || textLower.includes('rupee') || textLower.includes('cost') || textLower.includes('margin') || textLower.includes('150') || textLower.includes('300'))
    ) {
      if (role === 'CFO') {
        return {
          spokenText: "Got it, no sweat! Just to make sure we're on the same page, which pricing or cost number would you like us to use?",
          wantsToSpeak: true,
          urgency: 95,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: 0, trust: 0 },
          detectedContradiction: "Clarifying updated pricing / cost numbers with founder.",
        };
      }
      if (role === 'CEO') {
        return {
          spokenText: "Thanks for correcting that! Being honest about your numbers early on is super important.",
          wantsToSpeak: true,
          urgency: 85,
          isContradictionInterrupt: false,
          sentimentDelta: { confidence: +2, trust: +3 },
        };
      }
    }

    // CEO Casual Dialogue Bank (Elena)
    if (role === 'CEO') {
      const ceoPool = [
        `That sounds really interesting! Who was the very first person or user you showed this to, and what did they say?`,
        `I love that angle. What's the biggest pain point your users have right now that you're solving for them?`,
        `If someone asks why they should use your app instead of existing alternatives, what's the quick pitch you'd give them over coffee?`,
        `How are you planning on getting your first hundred loyal users? Word of mouth, social media, or reaching out directly?`,
      ];
      const pick = ceoPool[historyCount % ceoPool.length];
      return {
        spokenText: pick,
        wantsToSpeak: true,
        urgency: textLower.includes('user') || textLower.includes('customer') || textLower.includes('idea') ? 88 : 72,
        isContradictionInterrupt: false,
        sentimentDelta: { confidence: +4, trust: +4 },
      };
    }

    // CTO Casual Dialogue Bank (Marcus)
    if (role === 'CTO') {
      const ctoPool = [
        `Nice! What tools or frameworks are you using to build this right now? Are you using React, Python, or something else?`,
        `That makes a lot of sense. What was the hardest technical hurdle you ran into while getting this working?`,
        `How does the user experience feel when they click around? Is it super fast and snappy for them?`,
        `Love the tech side. Are you building this solo, or do you have developer friends helping you out?`,
      ];
      const pick = ctoPool[(historyCount + 1) % ctoPool.length];
      return {
        spokenText: pick,
        wantsToSpeak: true,
        urgency: textLower.includes('tech') || textLower.includes('app') || textLower.includes('build') || textLower.includes('code') ? 90 : 74,
        isContradictionInterrupt: false,
        sentimentDelta: { confidence: +4, trust: +3 },
      };
    }

    // CFO Casual Dialogue Bank (Vikram)
    const cfoPool = [
      `That sounds very promising! How are you thinking about pricing this? A monthly subscription, a free tier, or pay-as-you-go?`,
      `How much do you estimate it costs you each month right now to keep the servers and domain running?`,
      `With the ${fundingRequest || 'capital'} you're aiming to raise, what is the very first thing you plan to spend it on?`,
      `If you could hit one financial milestone by the end of this year, what would make you really proud?`,
    ];
    const pick = cfoPool[(historyCount + 2) % cfoPool.length];
    return {
      spokenText: pick,
      wantsToSpeak: true,
      urgency: textLower.includes('price') || textLower.includes('money') || textLower.includes('cost') || textLower.includes('charge') ? 92 : 73,
      isContradictionInterrupt: false,
      sentimentDelta: { confidence: +3, trust: +3 },
    };
  }
}

export const geminiService = new GeminiAgentService();
