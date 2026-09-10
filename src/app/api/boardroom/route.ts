import { NextRequest, NextResponse } from 'next/server';
import { MeetingOrchestrator } from '@/orchestration/meeting-orchestrator';
import { rimeService } from '@/providers/rime';
import { geminiService } from '@/providers/gemini';

// Singleton in-memory orchestrator instance for local development/demo
let orchestrator = new MeetingOrchestrator();

export async function GET() {
  const geminiKey = geminiService.getApiKey() || process.env.GEMINI_API_KEY || '';
  const rimeKey = rimeService.getApiKey() || process.env.RIME_API_KEY || '';

  // Masked string representation for secure display: e.g. "AIzaSy...4x9Q"
  const maskKey = (key: string) => {
    if (!key || key.length < 8) return '';
    return `${key.slice(0, 6)}••••••••••••••••${key.slice(-4)}`;
  };

  return NextResponse.json({
    state: orchestrator.getState(),
    beliefs: orchestrator.getBeliefs(),
    telemetry: orchestrator.getTelemetry(),
    events: orchestrator.getEvents().slice(0, 30),
    hasRimeKey: rimeService.hasApiKey(),
    hasGeminiKey: geminiService.hasApiKey(),
    geminiKeyMasked: maskKey(geminiKey),
    rimeKeyMasked: maskKey(rimeKey),
    geminiKeyRaw: geminiKey,
    rimeKeyRaw: rimeKey,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, payload } = body;

  // Runtime API Key configuration with live verification
  if (action === 'CONFIG_KEYS') {
    let geminiStatus = { valid: false, message: 'Not tested' };
    let rimeStatus = { valid: false, message: 'Not tested' };

    if (payload?.geminiKey && payload.geminiKey.trim().length > 0) {
      geminiService.setApiKey(payload.geminiKey.trim());
      geminiStatus = await geminiService.testKey(payload.geminiKey.trim());
    }

    if (payload?.rimeKey && payload.rimeKey.trim().length > 0) {
      rimeService.setApiKey(payload.rimeKey.trim());
      rimeStatus = await rimeService.testKey(payload.rimeKey.trim());
    }

    return NextResponse.json({
      success: true,
      hasRimeKey: rimeService.hasApiKey(),
      hasGeminiKey: geminiService.hasApiKey(),
      geminiStatus,
      rimeStatus,
    });
  }

  // Update dynamic pitch parameters
  if (action === 'UPDATE_PITCH_CONFIG') {
    orchestrator.updateConfig(payload);
    return NextResponse.json({
      success: true,
      state: orchestrator.getState(),
    });
  }

  if (action === 'START_MEETING') {
    if (payload) {
      orchestrator.updateConfig(payload);
    }
    orchestrator.startMeeting();
    return NextResponse.json({ success: true, state: orchestrator.getState() });
  }

  if (action === 'RESET_MEETING') {
    orchestrator = new MeetingOrchestrator(payload);
    return NextResponse.json({ success: true, state: orchestrator.getState() });
  }

  // Zero-latency barge-in alias
  if (action === 'USER_SPEECH_START' || action === 'BARGE_IN') {
    const { interruptToStopMs } = orchestrator.handleUserSpeechStart();
    return NextResponse.json({
      success: true,
      interruptToStopMs,
      state: orchestrator.getState(),
      telemetry: orchestrator.getTelemetry(),
    });
  }

  // Speech completion / processing handler
  if (action === 'USER_SPEECH_COMPLETE' || action === 'PROCESS_SPEECH') {
    const utterance = payload?.text || '';
    const turnResult = await orchestrator.handleUserSpeechComplete(utterance);

    if (!turnResult) {
      return NextResponse.json({
        success: true,
        turnResult: null,
        decision: null,
        state: orchestrator.getState(),
      });
    }

    let hasRimeAudio = false;
    let audioBase64: string | null = null;
    let audioUrl: string | null = null;

    if (rimeService.hasApiKey()) {
      const audioBuffer = await rimeService.synthesizeSpeech(
        turnResult.chosenAgent,
        turnResult.spokenText
      );
      if (audioBuffer) {
        hasRimeAudio = true;
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
        audioUrl = `data:audio/mp3;base64,${audioBase64}`;
      }
    }

    const decisionPayload = {
      ...turnResult,
      hasRimeAudio,
      audioBase64,
      audioUrl,
    };

    return NextResponse.json({
      success: true,
      turnResult: decisionPayload,
      decision: decisionPayload,
      state: orchestrator.getState(),
      beliefs: orchestrator.getBeliefs(),
      telemetry: orchestrator.getTelemetry(),
      events: orchestrator.getEvents().slice(0, 30),
    });
  }

  if (action === 'CONCLUDE_MEETING') {
    orchestrator.concludeMeeting();
    return NextResponse.json({
      success: true,
      state: orchestrator.getState(),
      beliefs: orchestrator.getBeliefs(),
      events: orchestrator.getEvents().slice(0, 30),
    });
  }

  // Revert / Undo the last turn so user can re-pitch or correct themselves
  if (action === 'UNDO_EXCHANGE') {
    const success = orchestrator.undoLastExchange();
    return NextResponse.json({
      success,
      state: orchestrator.getState(),
      beliefs: orchestrator.getBeliefs(),
      events: orchestrator.getEvents().slice(0, 30),
    });
  }

  // Trigger cross-examination or follow-up between committee members
  if (action === 'TRIGGER_DEBATE') {
    const directRole = payload?.role;
    const turnResult = await orchestrator.triggerPeerDebateTurn(directRole);

    if (!turnResult) {
      return NextResponse.json({
        success: false,
        turnResult: null,
        decision: null,
        state: orchestrator.getState(),
      });
    }

    let hasRimeAudio = false;
    let audioBase64: string | null = null;
    let audioUrl: string | null = null;

    if (rimeService.hasApiKey()) {
      const audioBuffer = await rimeService.synthesizeSpeech(
        turnResult.chosenAgent,
        turnResult.spokenText
      );
      if (audioBuffer) {
        hasRimeAudio = true;
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
        audioUrl = `data:audio/mp3;base64,${audioBase64}`;
      }
    }

    const decisionPayload = {
      ...turnResult,
      hasRimeAudio,
      audioBase64,
      audioUrl,
    };

    return NextResponse.json({
      success: true,
      turnResult: decisionPayload,
      decision: decisionPayload,
      state: orchestrator.getState(),
      beliefs: orchestrator.getBeliefs(),
      telemetry: orchestrator.getTelemetry(),
      events: orchestrator.getEvents().slice(0, 30),
    });
  }

  if (action === 'LOG_EVENT') {
    return NextResponse.json({ success: true });
  }

  if (action === 'AGENT_SPEECH_ENDED') {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
