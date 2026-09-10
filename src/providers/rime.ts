import { AgentRole } from '../types/boardroom';
import { COMMITTEE_SEATS } from '../agents/personas';

export interface RimeAudioChunk {
  audioBuffer: ArrayBuffer;
  durationEstimateMs: number;
}

export class RimeTtsService {
  private apiKey: string | null = null;
  private baseUrl = 'https://users.rime.ai/v1/rime-tts';

  constructor() {
    this.apiKey = process.env.RIME_API_KEY || null;
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim();
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Validate key validity with a lightweight test ping
   */
  public async testKey(key: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'audio/mp3',
        },
        body: JSON.stringify({
          speaker: 'amber',
          text: 'Verified',
          modelId: 'mist-v3',
          speedAlpha: 1.0,
          reduceLatency: true,
        }),
      });

      if (response.ok) {
        return { valid: true, message: 'Rime API authentication verified.' };
      } else {
        const errText = await response.text();
        return { valid: false, message: `Rime error (${response.status}): ${errText.slice(0, 120)}` };
      }
    } catch (e: any) {
      return { valid: false, message: `Rime network error: ${e.message}` };
    }
  }

  /**
   * Synthesizes agent speech text into streamed/buffered audio.
   */
  public async synthesizeSpeech(
    agentRole: AgentRole,
    text: string,
    options?: { model?: 'coda' | 'mist-v3'; signal?: AbortSignal }
  ): Promise<ArrayBuffer | null> {
    const seat = COMMITTEE_SEATS[agentRole];
    const model = options?.model || seat.defaultModel;
    const speaker = seat.rimeVoice;

    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'audio/mp3',
        },
        body: JSON.stringify({
          speaker: speaker,
          text: text,
          modelId: model,
          speedAlpha: 1.0,
          reduceLatency: true,
        }),
        signal: options?.signal,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`[Rime TTS Error] (${response.status}):`, errorDetails);
        return null;
      }

      return await response.arrayBuffer();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`[Rime] TTS synthesis aborted cleanly due to user interruption`);
      } else {
        console.error(`[Rime] Speech synthesis request failed:`, error);
      }
      return null;
    }
  }
}

export const rimeService = new RimeTtsService();
