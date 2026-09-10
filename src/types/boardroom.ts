export type AgentRole = 'CEO' | 'CTO' | 'CFO';
export type Speaker = 'USER' | AgentRole | null;
export type ActiveTab = 'CHAMBER' | 'CLAIMS_DOSSIER' | 'INVESTOR_PORTFOLIO' | 'ARBITRATION_ENGINE' | 'ANALYTICS';

export interface AgentBelief {
  confidence: number; // 0 - 100
  trust: number; // 0 - 100
  keyConcerns: string[];
  keyPositives: string[];
  lastReaction?: string;
  avatarUrl?: string;
}

export interface FounderProfile {
  fullName: string;
  title: string;
  firmName: string;
  priorExits: string;
  education: string;
  domainExperienceYears: number;
  linkedinUrl: string;
  githubUrl: string;
  verifiedAccreditation: boolean;
}

export interface UserPitchConfig {
  startupName: string;
  pitchGoal: string; // e.g. "Raise Seed Capital", "Strategic Partnership", "Enterprise Pilot"
  fundingRequest: string; // e.g. "$500,000", "₹50 Lakh", "€750,000"
  equityOffer: string; // e.g. "7%", "10%"
  productSummary: string;
  targetCustomer: string;
  businessModel: string; // e.g. "B2B SaaS, $49/seat/mo"
  founder?: FounderProfile;
}

export interface RecordedClaim {
  id: string;
  text: string;
  category: 'market' | 'tech' | 'financial';
  timestamp: number;
  status: 'VERIFIED' | 'CHALLENGED' | 'CONTRADICTED';
  flaggedBy?: AgentRole;
  notes?: string;
}

export interface ContradictionRecord {
  id: string;
  description: string;
  claimA: string;
  claimB: string;
  agentDetector: AgentRole;
  timestamp: number;
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
}

export interface ConversationTurn {
  id: string;
  speaker: 'USER' | AgentRole;
  text: string;
  timestamp: number;
  category?: 'market' | 'tech' | 'financial';
  beliefSnapshots?: Record<AgentRole, { confidence: number; trust: number }>;
}

export interface SharedMeetingState {
  config: UserPitchConfig;
  claims: RecordedClaim[];
  contradictions: ContradictionRecord[];
  currentSpeaker: Speaker;
  speakingEpoch: number; // Increment on every turn switch or interruption to cancel stale audio
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  meetingActive: boolean;
  meetingConcluded: boolean;
  conversationHistory: ConversationTurn[];
  activeSubtitle?: {
    speaker: Speaker;
    text: string;
    timestamp: number;
  };
  decision?: {
    approved: boolean; // >= 2/3 votes YES
    votes: {
      CEO: { vote: 'YES' | 'NO'; score: number; reason: string };
      CTO: { vote: 'YES' | 'NO'; score: number; reason: string };
      CFO: { vote: 'YES' | 'NO'; score: number; reason: string };
    };
    overallFeedback: string;
  };
}

export interface TurnBid {
  agent: AgentRole;
  urgency: number; // 1 - 100
  reason: string;
  isContradictionInterrupt: boolean;
  draftSnippet?: string;
}

export interface BoardroomEvent {
  id: string;
  timestampMs: number;
  type:
    | 'MEETING_STARTED'
    | 'USER_SPEECH_STARTED'
    | 'USER_SPEECH_FINAL'
    | 'AGENT_SPEECH_STARTED'
    | 'AGENT_AUDIO_CANCELLED'
    | 'INTERRUPT_TRIGGERED'
    | 'ARBITER_DECISION'
    | 'CONTRADICTION_FLAGGED'
    | 'STATE_UPDATED'
    | 'BOARD_VOTE_CAST';
  speaker?: Speaker;
  data?: Record<string, any>;
  detail: string;
}

export interface AudioTelemetry {
  interruptToStopMs: number;
  staleAudioLeaks: number;
  wrongFloorEvents: number;
  totalInterruptions: number;
  recentLatencyLogs: {
    eventType: string;
    latencyMs: number;
    timestamp: number;
  }[];
}
