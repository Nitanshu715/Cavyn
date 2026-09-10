# 👥 Multi-Agent Personas, Domain Brains & Cross-Examination

This document provides a comprehensive breakdown of the three autonomous agents in Cavyn, their system prompts, decision models, voting heuristics, and peer debate mechanics.

---

## 1. Executive Matrix & Cognitive Profiles

```mermaid
classDiagram
    class AgentPersona {
        +AgentRole role
        +string office
        +string domain
        +string defaultVoice
        +string systemPrompt
        +calculateUrgency(utterance, state)
        +detectContradiction(claim, history)
    }

    class Elena_CEO {
        +role = 'CEO'
        +office = 'CHIEF EXECUTIVE & STRATEGY'
        +domain = 'Market Scale, Moat & Founder Narrative'
        +voice = 'amber' / Google US Female
        +evaluateMarketFit()
        +nudgePeerPerspective()
    }

    class Marcus_CTO {
        +role = 'CTO'
        +office = 'SYSTEMS & ARCHITECTURE'
        +domain = 'Technical Moat, Scalability & Resilience'
        +voice = 'cove' / Google US Male
        +evaluatePrototypeViability()
        +crossExamineInfraCosts()
    }

    class Vikram_CFO {
        +role = 'CFO'
        +office = 'CAPITAL & RISK ALLOCATION'
        +domain = 'Unit Economics, Burn Rate & Valuation'
        +voice = 'marsh' / Google Natural Male
        +evaluateUnitEconomics()
        +verifyNumericConsistency()
    }

    AgentPersona <|-- Elena_CEO
    AgentPersona <|-- Marcus_CTO
    AgentPersona <|-- Vikram_CFO
```

---

## 2. Autonomous Mentor Specifications

### 👔 Elena Vance — Chief Executive Officer (`SEAT 01`)
- **Domain Focus**: Vision, customer pain points, storytelling, competition, and go-to-market.
- **Tone**: Warm, supportive, highly conversational, and forward-looking.
- **Trigger Keywords**: `market`, `user`, `customer`, `vision`, `problem`, `growth`, `founder`, `story`, `elena`.
- **Core Philosophy**: "If you can't describe who loves your product in 10 seconds, no amount of engineering will save it."

### ⚙️ Marcus Stone — Chief Technology Officer (`SEAT 02`)
- **Domain Focus**: System architecture, databases, codebases, development speed, and infrastructure.
- **Tone**: Pragmatic developer friend, grounded, candid, and demystifying.
- **Trigger Keywords**: `tech`, `code`, `app`, `build`, `prototype`, `database`, `stack`, `api`, `marcus`.
- **Core Philosophy**: "Don't over-engineer a spaceship when a simple bicycle solves the problem today."

### 💰 Vikram Rao — Chief Financial Officer (`SEAT 03`)
- **Domain Focus**: Unit economics, customer acquisition cost (CAC), lifetime value (LTV), pricing models, and cash runway.
- **Tone**: Clear, numbers-oriented without being intimidating, empathetic to early-stage realities.
- **Trigger Keywords**: `price`, `money`, `cost`, `burn`, `subscription`, `charge`, `revenue`, `vikram`, `margin`.
- **Core Philosophy**: "Price is a direct reflection of how much value you save or create for someone."

---

## 3. Autonomous Cross-Examination & Peer Debate Engine

Agents do not act in isolation. When one agent addresses a topic that impacts another domain, the system triggers a **Peer Cross-Examination Turn**:

```mermaid
sequenceDiagram
    autonumber
    actor Founder as 🎙️ Founder
    participant Arbiter as ⚖️ Arbitration Engine
    participant CTO as ⚙️ Marcus (CTO)
    participant CFO as 💰 Vikram (CFO)

    Founder->>Arbiter: "We're storing real-time 4K video feeds for 10,000 active users."
    Arbiter->>CTO: Route to CTO (Technical domain match)
    CTO-->>Founder: "That's heavy on GPU processing and AWS S3 bandwidth."
    
    Note over CTO,CFO: 🧠 Cross-Examination Trigger 🧠<br/>Tech bandwidth directly triggers CFO cost concerns!
    
    Arbiter->>CFO: Trigger Peer Debate Turn
    CFO-->>CTO: "Marcus is right. At $0.08 per GB, that burns $25k a month before you even hit revenue!"
    CFO-->>Founder: "Founder, how do you plan to charge users to cover those hosting costs?"
```

---

## 4. End-of-Session Voting Heuristic

At the end of the 5-minute meeting (or when triggered manually), the committee casts independent votes:

```mermaid
flowchart TD
    CONCLUDE[Meeting Timer Reaches 0:00] --> VOTE_INIT[Initialize Committee Voting Protocol]
    
    subgraph Elena Evaluation
        E_IN[Product Vision, Founder Clarity, Market Size]
        E_EVAL[Evaluate: YES / NO / CONDITIONAL]
    end

    subgraph Marcus Evaluation
        M_IN[Technical Feasibility, Prototype Status, Execution Moat]
        M_EVAL[Evaluate: YES / NO / CONDITIONAL]
    end

    subgraph Vikram Evaluation
        V_IN[Pricing Viability, Burn Efficiency, Contradiction Count]
        V_EVAL[Evaluate: YES / NO / CONDITIONAL]
    end

    VOTE_INIT --> Elena Evaluation
    VOTE_INIT --> Marcus Evaluation
    VOTE_INIT --> Vikram Evaluation

    E_EVAL --> TALLY[Vote Tally & Consensus Calculation]
    M_EVAL --> TALLY
    V_EVAL --> TALLY

    TALLY --> DECISION{Tally >= 2 Positive Votes?}
    DECISION -->|Yes| APPROVE[Term Sheet Offered / Confetti Celebration 🎉]
    DECISION -->|No| REVISE[Revision Recommended / Mentorship Summary 📋]
```
