import {
  AgentRole,
  Speaker,
  SharedMeetingState,
  AgentBelief,
  BoardroomEvent,
  AudioTelemetry,
  TurnBid,
  UserPitchConfig,
} from '../types/boardroom';
import { arbitrateFloor, ArbiterInput } from './arbiter';
import { geminiService } from '../providers/gemini';
import { rimeService } from '../providers/rime';
import { COMMITTEE_SEATS } from '../agents/personas';

export class MeetingOrchestrator {
  private state: SharedMeetingState;
  private beliefs: Record<AgentRole, AgentBelief>;
  private history: { role: string; content: string }[] = [];
  private events: BoardroomEvent[] = [];
  private telemetry: AudioTelemetry;
  private activeAbortController: AbortController | null = null;
  private activeSpeakingEpoch = 0;
  private lastSpeaker: Speaker = null;
  private onStateChangeCallback?: (state: SharedMeetingState, beliefs: Record<AgentRole, AgentBelief>) => void;
  private onEventCallback?: (event: BoardroomEvent) => void;
  private onTelemetryCallback?: (telemetry: AudioTelemetry) => void;

  constructor(customConfig?: Partial<UserPitchConfig>) {
    const initialConfig: UserPitchConfig = {
      startupName: customConfig?.startupName || 'My Product',
      pitchGoal: customConfig?.pitchGoal || 'Early Feedback & Advisory',
      fundingRequest: customConfig?.fundingRequest || '₹10,00,000',
      equityOffer: customConfig?.equityOffer || '5.0%',
      productSummary:
        customConfig?.productSummary ||
        'A simple, practical product designed to help people get real work done effortlessly.',
      targetCustomer: customConfig?.targetCustomer || 'Everyday consumers and small businesses',
      businessModel: customConfig?.businessModel || 'Simple flat subscription ($10/month)',
    };

    this.state = {
      config: initialConfig,
      claims: [],
      contradictions: [],
      currentSpeaker: null,
      speakingEpoch: 0,
      timeRemainingSeconds: 300, // 5 minutes
      totalTimeSeconds: 300,
      meetingActive: false,
      meetingConcluded: false,
      conversationHistory: [],
    };

    this.beliefs = {
      CEO: {
        confidence: 50,
        trust: 50,
        keyConcerns: ['Distribution velocity', 'Incumbent defensibility'],
        keyPositives: ['Clear customer problem'],
      },
      CTO: {
        confidence: 45,
        trust: 45,
        keyConcerns: ['Inference cost / token margins', 'Latency SLA under load'],
        keyPositives: ['Sound architecture baseline'],
      },
      CFO: {
        confidence: 35,
        trust: 40,
        keyConcerns: ['Blended CAC payback period', 'Gross margin sustainability'],
        keyPositives: ['High upside profile'],
      },
    };

    this.telemetry = {
      interruptToStopMs: 0,
      staleAudioLeaks: 0,
      wrongFloorEvents: 0,
      totalInterruptions: 0,
      recentLatencyLogs: [],
    };
  }

  public updateConfig(newConfig: Partial<UserPitchConfig>) {
    this.state.config = {
      ...this.state.config,
      ...newConfig,
    };
    this.emitEvent('STATE_UPDATED', 'USER', `Boardroom audit parameters updated for ${this.state.config.startupName}`);
    this.notifyState();
  }

  public getState() {
    return this.state;
  }

  public getBeliefs() {
    return this.beliefs;
  }

  public getEvents() {
    return this.events;
  }

  public getTelemetry() {
    return this.telemetry;
  }

  public startMeeting() {
    this.state.meetingActive = true;
    this.state.meetingConcluded = false;
    this.state.timeRemainingSeconds = this.state.totalTimeSeconds;
    this.emitEvent('MEETING_STARTED', 'USER', `Roundtable opened. 05:00 audit session started for ${this.state.config.startupName}.`);
    this.notifyState();
  }

  public handleUserSpeechStart(): { interruptToStopMs: number } {
    const interruptStartTime = Date.now();
    const previousSpeaker = this.state.currentSpeaker;
    const wasAgentSpeaking = previousSpeaker !== null && previousSpeaker !== 'USER';

    this.activeSpeakingEpoch++;
    this.state.speakingEpoch = this.activeSpeakingEpoch;

    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    this.lastSpeaker = this.state.currentSpeaker;
    this.state.currentSpeaker = 'USER';

    const stopLatency = Date.now() - interruptStartTime;

    if (wasAgentSpeaking) {
      this.telemetry.totalInterruptions++;
      this.telemetry.interruptToStopMs = stopLatency;
      this.telemetry.recentLatencyLogs.unshift({
        eventType: `INTERRUPTED_${previousSpeaker}`,
        latencyMs: stopLatency,
        timestamp: Date.now(),
      });

      const seat = COMMITTEE_SEATS[previousSpeaker as AgentRole];
      this.emitEvent(
        'INTERRUPT_TRIGGERED',
        'USER',
        `Founder transmission interrupted ${seat?.code || previousSpeaker} (Audio stopped in ${stopLatency}ms)`
      );
      this.emitEvent('AGENT_AUDIO_CANCELLED', previousSpeaker, `${seat?.code || previousSpeaker} stream silenced immediately.`);
    } else {
      this.emitEvent('USER_SPEECH_STARTED', 'USER', 'Founder took the conversational floor.');
    }

    this.notifyState();
    this.notifyTelemetry();
    return { interruptToStopMs: stopLatency };
  }

  public async handleUserSpeechComplete(utteranceText: string): Promise<{
    chosenAgent: AgentRole;
    spokenText: string;
    epoch: number;
  } | null> {
    if (!utteranceText || utteranceText.trim().length === 0) return null;

    this.history.push({ role: 'user', content: utteranceText });
    this.emitEvent('USER_SPEECH_FINAL', 'USER', `Founder: "${utteranceText}"`);

    const textLower = utteranceText.toLowerCase();
    const category = textLower.includes('cost') || textLower.includes('cac') || textLower.includes('rupee') || textLower.includes('price') || textLower.includes('dollar') || textLower.includes('margin')
      ? 'financial'
      : textLower.includes('ai') || textLower.includes('tech') || textLower.includes('model') || textLower.includes('stack') || textLower.includes('latency')
      ? 'tech'
      : 'market';

    const claimId = `claim-${Date.now()}`;
    this.state.claims.push({
      id: claimId,
      text: utteranceText,
      category,
      timestamp: Date.now(),
      status: 'VERIFIED',
    });

    // Save Founder turn in conversation history
    this.state.conversationHistory.push({
      id: `turn-founder-${Date.now()}`,
      speaker: 'USER',
      text: utteranceText,
      timestamp: Date.now(),
      category,
      beliefSnapshots: {
        CEO: { confidence: this.beliefs.CEO.confidence, trust: this.beliefs.CEO.trust },
        CTO: { confidence: this.beliefs.CTO.confidence, trust: this.beliefs.CTO.trust },
        CFO: { confidence: this.beliefs.CFO.confidence, trust: this.beliefs.CFO.trust },
      },
    });

    const addressedAgent = this.detectAddressedAgent(utteranceText);

    const evaluationEpoch = this.activeSpeakingEpoch;
    this.activeAbortController = new AbortController();

    const roles: AgentRole[] = ['CEO', 'CTO', 'CFO'];
    const agentEvaluations = await Promise.all(
      roles.map(async (role) => {
        const evalResult = await geminiService.evaluateAgentTurn(
          role,
          utteranceText,
          this.history,
          this.state,
          this.beliefs[role]
        );
        return { role, evalResult };
      })
    );

    // Proceed with turn arbitration using the latest evaluation results
    // Even if an audio barge-in incremented the epoch, we update the state to match this new turn.
    this.activeSpeakingEpoch = evaluationEpoch;
    this.state.speakingEpoch = this.activeSpeakingEpoch;

    agentEvaluations.forEach(({ role, evalResult }) => {
      const b = this.beliefs[role];
      b.confidence = Math.min(100, Math.max(0, b.confidence + evalResult.sentimentDelta.confidence));
      b.trust = Math.min(100, Math.max(0, b.trust + evalResult.sentimentDelta.trust));

      if (evalResult.detectedContradiction) {
        // Mark current claim as contradicted
        const claimObj = this.state.claims.find((c) => c.id === claimId);
        if (claimObj) {
          claimObj.status = 'CONTRADICTED';
          claimObj.flaggedBy = role;
          claimObj.notes = evalResult.detectedContradiction;
        }

        this.state.contradictions.push({
          id: `contra-${Date.now()}`,
          description: evalResult.detectedContradiction,
          claimA: 'Prior recorded metric',
          claimB: utteranceText,
          agentDetector: role,
          timestamp: Date.now(),
          severity: 'CRITICAL',
        });
        const seat = COMMITTEE_SEATS[role];
        this.emitEvent('CONTRADICTION_FLAGGED', role, `${seat.code} flagged contradiction: ${evalResult.detectedContradiction}`);
      }
    });

    const bids: TurnBid[] = agentEvaluations
      .filter((e) => e.evalResult.wantsToSpeak)
      .map((e) => ({
        agent: e.role,
        urgency: e.evalResult.urgency,
        reason: e.evalResult.spokenText.slice(0, 45) + '...',
        isContradictionInterrupt: e.evalResult.isContradictionInterrupt,
        draftSnippet: e.evalResult.spokenText,
      }));

    const arbitrationInput: ArbiterInput = {
      currentSpeaker: this.state.currentSpeaker,
      userIsSpeaking: false,
      addressedAgent: addressedAgent,
      agentBids: bids,
      lastSpeaker: this.lastSpeaker,
      contradictionActive: this.state.contradictions.length > 0,
    };

    const decision = arbitrateFloor(arbitrationInput);
    this.emitEvent('ARBITER_DECISION', decision.winner, decision.reason);

    const winningRole = decision.winner === 'USER' ? 'CEO' : (decision.winner as AgentRole);
    const winningEval = agentEvaluations.find((e) => e.role === winningRole);
    const textToSpeak = winningEval?.evalResult.spokenText || 'Clarify your unit economics and scale roadmaps.';

    this.lastSpeaker = this.state.currentSpeaker;
    this.state.currentSpeaker = winningRole;
    this.state.activeSubtitle = {
      speaker: winningRole,
      text: textToSpeak,
      timestamp: Date.now(),
    };
    this.history.push({ role: winningRole.toLowerCase(), content: textToSpeak });

    // Save Agent response to conversation history
    this.state.conversationHistory.push({
      id: `turn-${winningRole}-${Date.now()}`,
      speaker: winningRole,
      text: textToSpeak,
      timestamp: Date.now(),
      beliefSnapshots: {
        CEO: { confidence: this.beliefs.CEO.confidence, trust: this.beliefs.CEO.trust },
        CTO: { confidence: this.beliefs.CTO.confidence, trust: this.beliefs.CTO.trust },
        CFO: { confidence: this.beliefs.CFO.confidence, trust: this.beliefs.CFO.trust },
      },
    });

    const winSeat = COMMITTEE_SEATS[winningRole];
    this.emitEvent('AGENT_SPEECH_STARTED', winningRole, `${winSeat.code}: "${textToSpeak}"`);
    this.notifyState();

    return {
      chosenAgent: winningRole,
      spokenText: textToSpeak,
      epoch: this.activeSpeakingEpoch,
    };
  }

  /**
   * Autonomous Peer-to-Peer Committee Follow-up:
   * Enables one committee member to react directly to a peer's point, creating a real 4-person board discussion!
   */
  public async triggerPeerDebateTurn(directTarget?: AgentRole): Promise<{
    chosenAgent: AgentRole;
    spokenText: string;
    epoch: number;
  } | null> {
    if (this.state.conversationHistory.length === 0) return null;

    const lastTurn = this.state.conversationHistory[this.state.conversationHistory.length - 1];
    const availableRoles: AgentRole[] = (['CEO', 'CTO', 'CFO'] as AgentRole[]).filter(
      (r) => r !== lastTurn.speaker
    );

    const chosenRole: AgentRole = directTarget || availableRoles[Math.floor(Math.random() * availableRoles.length)];

    this.activeSpeakingEpoch++;
    this.state.speakingEpoch = this.activeSpeakingEpoch;

    const promptContext = `The prior speaker was ${lastTurn.speaker}, who stated: "${lastTurn.text}".`;
    const evalResult = await geminiService.evaluateAgentTurn(
      chosenRole,
      promptContext,
      this.history,
      this.state,
      this.beliefs[chosenRole]
    );

    const textToSpeak = evalResult.spokenText;
    this.lastSpeaker = this.state.currentSpeaker;
    this.state.currentSpeaker = chosenRole;
    this.state.activeSubtitle = {
      speaker: chosenRole,
      text: textToSpeak,
      timestamp: Date.now(),
    };
    this.history.push({ role: chosenRole.toLowerCase(), content: textToSpeak });

    this.state.conversationHistory.push({
      id: `turn-${chosenRole}-${Date.now()}`,
      speaker: chosenRole,
      text: textToSpeak,
      timestamp: Date.now(),
      beliefSnapshots: {
        CEO: { confidence: this.beliefs.CEO.confidence, trust: this.beliefs.CEO.trust },
        CTO: { confidence: this.beliefs.CTO.confidence, trust: this.beliefs.CTO.trust },
        CFO: { confidence: this.beliefs.CFO.confidence, trust: this.beliefs.CFO.trust },
      },
    });

    const winSeat = COMMITTEE_SEATS[chosenRole];
    this.emitEvent('AGENT_SPEECH_STARTED', chosenRole, `[CROSS-EXAMINATION] ${winSeat.code}: "${textToSpeak}"`);
    this.notifyState();

    return {
      chosenAgent: chosenRole,
      spokenText: textToSpeak,
      epoch: this.activeSpeakingEpoch,
    };
  }

  /**
   * Revert / Undo the last conversation exchange so the user can re-pitch or rephrase.
   */
  public undoLastExchange() {
    if (this.state.conversationHistory.length === 0) return false;

    // Pop the latest agent turn and the preceding user turn if present
    const poppedAgent = this.state.conversationHistory.pop();
    if (this.state.conversationHistory.length > 0 && this.state.conversationHistory[this.state.conversationHistory.length - 1].speaker === 'USER') {
      this.state.conversationHistory.pop();
    }

    // Restore previous claim if any
    if (this.state.claims.length > 0) {
      this.state.claims.pop();
    }

    // Rollback beliefs to last snapshot if available
    const lastTurn = this.state.conversationHistory[this.state.conversationHistory.length - 1];
    if (lastTurn && lastTurn.beliefSnapshots) {
      this.beliefs.CEO.confidence = lastTurn.beliefSnapshots.CEO.confidence;
      this.beliefs.CEO.trust = lastTurn.beliefSnapshots.CEO.trust;
      this.beliefs.CTO.confidence = lastTurn.beliefSnapshots.CTO.confidence;
      this.beliefs.CTO.trust = lastTurn.beliefSnapshots.CTO.trust;
      this.beliefs.CFO.confidence = lastTurn.beliefSnapshots.CFO.confidence;
      this.beliefs.CFO.trust = lastTurn.beliefSnapshots.CFO.trust;
    }

    this.activeSpeakingEpoch++;
    this.state.speakingEpoch = this.activeSpeakingEpoch;
    this.state.currentSpeaker = null;
    this.state.activeSubtitle = undefined;

    this.emitEvent('STATE_UPDATED', 'USER', 'Prior exchange reverted. Conviction scores and audit transcript rolled back.');
    this.notifyState();
    return true;
  }

  public concludeMeeting() {
    this.state.meetingActive = false;
    this.state.meetingConcluded = true;

    const ceoScore = Math.round(this.beliefs.CEO.confidence * 0.6 + this.beliefs.CEO.trust * 0.4);
    const ctoScore = Math.round(this.beliefs.CTO.confidence * 0.6 + this.beliefs.CTO.trust * 0.4);
    const cfoScore = Math.round(this.beliefs.CFO.confidence * 0.6 + this.beliefs.CFO.trust * 0.4);

    const ceoVote: 'YES' | 'NO' = ceoScore >= 55 ? 'YES' : 'NO';
    const ctoVote: 'YES' | 'NO' = ctoScore >= 55 ? 'YES' : 'NO';
    const cfoVote: 'YES' | 'NO' = cfoScore >= 50 ? 'YES' : 'NO';

    const yesCount = [ceoVote, ctoVote, cfoVote].filter((v) => v === 'YES').length;
    const approved = yesCount >= 2;

    this.state.decision = {
      approved,
      votes: {
        CEO: {
          vote: ceoVote,
          score: ceoScore,
          reason: ceoVote === 'YES' ? 'Market opportunity and founder narrative meet institutional threshold.' : 'Insufficient market defensibility and distribution moat.',
        },
        CTO: {
          vote: ctoVote,
          score: ctoScore,
          reason: ctoVote === 'YES' ? 'Technical feasibility and infrastructure unit economics validated.' : 'Systemic token overhead and architecture risk exceed parameters.',
        },
        CFO: {
          vote: cfoVote,
          score: cfoScore,
          reason: cfoVote === 'YES' ? 'CAC payback timeline and gross margins defensible.' : 'Unfavorable unit economics and capital burn velocity.',
        },
      },
      overallFeedback: approved
        ? `TERM SHEET APPROVED (${yesCount}/3 Affirmative). The committee has committed ${this.state.config.fundingRequest} for ${this.state.config.equityOffer} equity.`
        : `MANDATE REJECTED (${yesCount}/3 Affirmative). The investment committee did not reach consensus on risk and unit economics.`,
    };

    this.emitEvent('BOARD_VOTE_CAST', null, `Board decision finalized: ${approved ? 'APPROVED' : 'REJECTED'}`);
    this.notifyState();
  }

  private detectAddressedAgent(text: string): AgentRole | null {
    const lower = text.toLowerCase();
    // Elena / CEO (Strategy, Product Vision, Marketing, Sales, Idea)
    if (
      lower.includes('elena') ||
      lower.includes('strategy') ||
      lower.includes('ceo') ||
      lower.includes('seat 01') ||
      lower.includes('market') ||
      lower.includes('sales') ||
      lower.includes('users') ||
      lower.includes('customers') ||
      lower.includes('idea') ||
      lower.includes('concept')
    ) {
      return 'CEO';
    }

    // Marcus / CTO (Tech, Code, Stack, App, Engineering, Prototype)
    if (
      lower.includes('marcus') ||
      lower.includes('systems') ||
      lower.includes('cto') ||
      lower.includes('seat 02') ||
      lower.includes('tech') ||
      lower.includes('code') ||
      lower.includes('app') ||
      lower.includes('build') ||
      lower.includes('prototype') ||
      lower.includes('architecture') ||
      lower.includes('server') ||
      lower.includes('developer')
    ) {
      return 'CTO';
    }

    // Vikram / CFO (Money, Pricing, Cost, Revenue, Finance, Charge)
    if (
      lower.includes('vikram') ||
      lower.includes('capital') ||
      lower.includes('cfo') ||
      lower.includes('seat 03') ||
      lower.includes('finance') ||
      lower.includes('money') ||
      lower.includes('price') ||
      lower.includes('pricing') ||
      lower.includes('charge') ||
      lower.includes('cost') ||
      lower.includes('revenue') ||
      lower.includes('sell') ||
      lower.includes('make money') ||
      lower.includes('economics')
    ) {
      return 'CFO';
    }

    return null;
  }

  private emitEvent(type: BoardroomEvent['type'], speaker: Speaker, detail: string) {
    const event: BoardroomEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestampMs: Date.now(),
      type,
      speaker,
      detail,
    };
    this.events.unshift(event);
    if (this.onEventCallback) {
      this.onEventCallback(event);
    }
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.state }, { ...this.beliefs });
    }
  }

  private notifyTelemetry() {
    if (this.onTelemetryCallback) {
      this.onTelemetryCallback({ ...this.telemetry });
    }
  }
}
