import { AgentRole, TurnBid, Speaker } from '../types/boardroom';

export interface ArbiterInput {
  currentSpeaker: Speaker;
  userIsSpeaking: boolean;
  addressedAgent?: AgentRole | null;
  agentBids: TurnBid[];
  lastSpeaker: Speaker;
  contradictionActive: boolean;
}

export interface ArbiterDecision {
  winner: Speaker;
  reason: string;
  interruptedPrevious: boolean;
}

/**
 * Deterministic arbitration engine governing who owns the conversational floor.
 * 
 * Rules:
 * 1. User Barge-in Rule (Absolute Highest Priority):
 *    If user is speaking, the floor immediately belongs to USER. Any speaking agent is interrupted.
 * 2. Direct Address Rule:
 *    If user specifically names or addresses an agent ("Vikram", "Elena", "Marcus", "CTO", etc.),
 *    that agent gets immediate priority over peer agents.
 * 3. Contradiction Strike Rule:
 *    If an active contradiction was detected in financial/technical claims, the relevant agent's
 *    urgency is weighted significantly higher.
 * 4. Floor Competition & Fairness Cooldown:
 *    When multiple agents bid for the floor, the agent with the highest urgency wins,
 *    with a penalty applied if that agent was the immediate last speaker to prevent monopolization.
 */
export function arbitrateFloor(input: ArbiterInput): ArbiterDecision {
  // 1. User barge-in: User ALWAYS wins the floor
  if (input.userIsSpeaking) {
    const isInterrupt = input.currentSpeaker !== null && input.currentSpeaker !== 'USER';
    return {
      winner: 'USER',
      reason: isInterrupt
        ? `User barge-in interrupted active speaker (${input.currentSpeaker})`
        : 'User holds the floor',
      interruptedPrevious: isInterrupt,
    };
  }

  // 2. Direct Address from user
  if (input.addressedAgent) {
    const isInterrupt = input.currentSpeaker !== null && input.currentSpeaker !== input.addressedAgent;
    return {
      winner: input.addressedAgent,
      reason: `User directly addressed ${input.addressedAgent}`,
      interruptedPrevious: isInterrupt,
    };
  }

  // 3. Evaluate Agent Bids
  if (input.agentBids.length > 0) {
    // Score each bid based on urgency, contradiction bonus, and fairness penalty
    const scoredBids = input.agentBids.map((bid) => {
      let score = bid.urgency;

      // Bonus for catching contradictions
      if (bid.isContradictionInterrupt) {
        score += 35;
      }

      // Penalty if this agent was the last one who spoke (prevent monopolizing)
      if (input.lastSpeaker === bid.agent) {
        score -= 20;
      }

      return {
        ...bid,
        calculatedScore: Math.max(0, score),
      };
    });

    // Sort by highest calculated score
    scoredBids.sort((a, b) => b.calculatedScore - a.calculatedScore);
    const topBid = scoredBids[0];

    const isInterrupt = input.currentSpeaker !== null && input.currentSpeaker !== topBid.agent;
    return {
      winner: topBid.agent,
      reason: `Arbiter awarded floor to ${topBid.agent} (Score: ${topBid.calculatedScore}): ${topBid.reason}`,
      interruptedPrevious: isInterrupt,
    };
  }

  // Default: Keep current speaker or yield to USER
  return {
    winner: input.currentSpeaker || 'USER',
    reason: 'Default floor retention',
    interruptedPrevious: false,
  };
}
