'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Sliders,
  Key,
  Clock,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Terminal as TerminalIcon,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  Layers,
  AlertTriangle,
  Check,
  Search,
  Filter,
  Activity,
  Zap,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Volume2,
  Radio,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  PieChart,
  Target,
  ArrowUpRight,
  CheckCheck,
  Flame,
  Binary,
  Compass,
  Navigation,
  Crosshair,
  Undo2,
  MessageSquareShare,
  SendHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SharedMeetingState,
  AgentBelief,
  BoardroomEvent,
  AudioTelemetry,
  AgentRole,
  UserPitchConfig,
  ActiveTab,
  RecordedClaim,
  ContradictionRecord,
  FounderProfile,
} from '@/types/boardroom';
import { COMMITTEE_SEATS } from '@/agents/personas';

export default function CavynInstitutionalBoardroom() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('CHAMBER');
  const [meetingState, setMeetingState] = useState<SharedMeetingState | null>(null);
  const [beliefs, setBeliefs] = useState<Record<AgentRole, AgentBelief> | null>(null);
  const [telemetry, setTelemetry] = useState<AudioTelemetry | null>(null);
  const [events, setEvents] = useState<BoardroomEvent[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter and Search for Claims
  const [claimCategoryFilter, setClaimCategoryFilter] = useState<'ALL' | 'market' | 'tech' | 'financial'>('ALL');
  const [claimSearchQuery, setClaimSearchQuery] = useState('');

  // Founder Profile State (Customizable by user)
  const [founderProfile, setFounderProfile] = useState<FounderProfile>({
    fullName: 'Founder',
    title: 'Creator & Builder',
    firmName: 'My Startup',
    priorExits: 'First-time founder building a new product',
    education: 'Self-taught builder',
    domainExperienceYears: 2,
    linkedinUrl: '',
    githubUrl: '',
    verifiedAccreditation: true,
  });

  // Venture Parameters
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [pitchForm, setPitchForm] = useState<UserPitchConfig>({
    startupName: 'My Product',
    pitchGoal: 'Early Feedback & Advisory',
    fundingRequest: '₹10,00,000',
    equityOffer: '5.0%',
    productSummary: 'A simple, practical tool designed to help people get real work done effortlessly.',
    targetCustomer: 'Everyday consumers and small businesses',
    businessModel: 'Simple flat subscription ($10/month)',
    founder: founderProfile,
  });

  // Safe Calculator State
  const [safeInvestment, setSafeInvestment] = useState<number>(500000); // $500k or equivalent
  const [safeValuationCap, setSafeValuationCap] = useState<number>(8000000); // $8M cap

  // API Key Setup Modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasRimeKey, setHasRimeKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [inputGeminiKey, setInputGeminiKey] = useState('');
  const [inputRimeKey, setInputRimeKey] = useState('');
  const [showGeminiSecret, setShowGeminiSecret] = useState(false);
  const [showRimeSecret, setShowRimeSecret] = useState(false);
  const [keyValidationMsg, setKeyValidationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidatingKeys, setIsValidatingKeys] = useState(false);

  // Notification Banner
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Permanent Dark Mode Enforced
  const darkMode = true;

  // GTA 5 Style Radial Navigation Wheel State
  const [isWeaponWheelOpen, setIsWeaponWheelOpen] = useState(false);
  const [hoveredWheelSector, setHoveredWheelSector] = useState<ActiveTab | null>(null);

  // Keyboard shortcut listener for 'Q' or 'Tab' hold to trigger GTA 5 Radial Selector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'q' || e.key === 'Q') {
        setIsWeaponWheelOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsWeaponWheelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeEpochRef = useRef<number>(0);

  // Sync state from server API
  const syncState = async () => {
    try {
      const res = await fetch('/api/boardroom');
      const data = await res.json();
      setMeetingState(data.state);
      setBeliefs(data.beliefs);
      setTelemetry(data.telemetry);
      setEvents(data.events || []);
      setHasRimeKey(data.hasRimeKey);
      setHasGeminiKey(data.hasGeminiKey);

      if (data.geminiKeyRaw && !inputGeminiKey) {
        setInputGeminiKey(data.geminiKeyRaw);
      }
      if (data.rimeKeyRaw && !inputRimeKey) {
        setInputRimeKey(data.rimeKeyRaw);
      }

      if (data.state) {
        activeEpochRef.current = data.state.speakingEpoch;
        if (data.state.config) {
          setPitchForm(data.state.config);
          if (data.state.config.founder) {
            setFounderProfile(data.state.config.founder);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync boardroom state:', e);
    }
  };

  useEffect(() => {
    syncState();
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save runtime API keys with verification
  const handleSaveKeys = async () => {
    setIsValidatingKeys(true);
    setKeyValidationMsg(null);

    try {
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONFIG_KEYS',
          payload: { geminiKey: inputGeminiKey, rimeKey: inputRimeKey },
        }),
      });
      const data = await res.json();
      setIsValidatingKeys(false);

      setHasRimeKey(data.hasRimeKey);
      setHasGeminiKey(data.hasGeminiKey);

      const geminiOk = data.geminiStatus?.valid;
      const rimeOk = data.rimeStatus?.valid;

      if ((inputGeminiKey && !geminiOk) || (inputRimeKey && !rimeOk)) {
        const issues = [];
        if (inputGeminiKey && !geminiOk) issues.push(`Gemini: ${data.geminiStatus?.message || 'Invalid key'}`);
        if (inputRimeKey && !rimeOk) issues.push(`Rime: ${data.rimeStatus?.message || 'Invalid key'}`);
        setKeyValidationMsg({ type: 'error', text: issues.join(' | ') });
      } else {
        setKeyValidationMsg({ type: 'success', text: 'Credentials verified and encrypted in secure memory.' });
        setTimeout(() => {
          setKeyValidationMsg(null);
          setShowKeyModal(false);
        }, 1200);
      }
    } catch (e: any) {
      setIsValidatingKeys(false);
      setKeyValidationMsg({ type: 'error', text: e.message || 'Connection error' });
    }
  };

  const handleSavePitchConfig = async () => {
    try {
      const updatedConfig = { ...pitchForm, founder: founderProfile };
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PITCH_CONFIG',
          payload: updatedConfig,
        }),
      });
      const data = await res.json();
      if (data.state) {
        setMeetingState(data.state);
      }
      setShowConfigModal(false);
      syncState();
    } catch (e) {
      console.error('Error updating audit parameters:', e);
    }
  };

  // 5-minute countdown clock
  useEffect(() => {
    if (meetingState?.meetingActive && !meetingState?.meetingConcluded) {
      timerRef.current = setInterval(() => {
        setMeetingState((prev) => {
          if (!prev) return null;
          if (prev.timeRemainingSeconds <= 1) {
            handleConcludeMeeting();
            return { ...prev, timeRemainingSeconds: 0, meetingActive: false };
          }
          return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [meetingState?.meetingActive, meetingState?.meetingConcluded]);

  // Always-Listening Web Speech recognition with auto-resilience
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    let isMounted = true;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (isMounted) setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // When founder speaks, immediately mute playing agent audio locally so the board listens!
      if (interim) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        setUserTranscript(interim);
      }

      if (final && final.trim().length > 0) {
        const cleanedFinal = final.trim();
        setUserTranscript(cleanedFinal);
        handleFounderUtteranceComplete(cleanedFinal);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
      }
    };

    // Auto-restart recognition continuously if meeting is active or mic is toggled ON
    recognition.onend = () => {
      if (isMounted && isListening) {
        try {
          recognition.start();
        } catch (e) {
          // already starting or running
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isMounted = false;
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [isListening]);

  // Zero-latency founder barge-in / interrupt
  const handleFounderBargeIn = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BARGE_IN' }),
      });
      const data = await res.json();
      if (data.state) {
        activeEpochRef.current = data.state.speakingEpoch;
        setMeetingState(data.state);
      }
    } catch (e) {
      console.error('Barge in dispatch error:', e);
    }
  };

  // Dispatch founder utterance to arbitration engine
  const handleFounderUtteranceComplete = async (text: string) => {
    if (!text || text.trim().length === 0) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROCESS_SPEECH',
          payload: { text },
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.state) setMeetingState(data.state);
      if (data.beliefs) setBeliefs(data.beliefs);
      if (data.telemetry) setTelemetry(data.telemetry);
      if (data.events) setEvents(data.events);

      if (data.decision && data.decision.audioUrl && data.decision.epoch) {
        playAgentSpokenResponse(data.decision.audioUrl, data.decision.epoch, data.decision.spokenText, data.decision.chosenAgent);
      } else if (data.decision && data.decision.spokenText) {
        playBrowserFallbackSpeech(data.decision.spokenText, data.decision.epoch, data.decision.chosenAgent);
      }
    } catch (e) {
      setIsProcessing(false);
      console.error('Error arbitrating founder input:', e);
    }
  };

  // Play synthetic voice with epoch cancellation check
  const playAgentSpokenResponse = (audioUrl: string, epoch: number, fallbackText?: string, speakerRole?: AgentRole) => {
    if (epoch !== activeEpochRef.current) {
      console.warn(`[Epoch Safety] Cancelled playback. Response epoch: ${epoch}, current: ${activeEpochRef.current}`);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        handleAgentSpeechEnded(epoch);
      };
      audioRef.current.onerror = () => {
        console.warn('Rime audio buffer notice. Triggering localized browser fallback.');
        if (fallbackText) {
          playBrowserFallbackSpeech(fallbackText, epoch, speakerRole);
        }
      };

      audioRef.current
        .play()
        .then(() => {
          fetch('/api/boardroom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'LOG_EVENT',
              payload: {
                type: 'AGENT_SPEECH_STARTED',
                detail: `Spoken response broadcast active (Epoch #${epoch})`,
              },
            }),
          });
        })
        .catch((err) => {
          console.warn('Audio auto-play notice:', err);
          if (fallbackText) {
            playBrowserFallbackSpeech(fallbackText, epoch, speakerRole);
          }
        });
    }
  };

  // Browser Web Speech fallback with ultra-smooth, natural human-like voice selection
  const playBrowserFallbackSpeech = (text: string, epoch: number, speakerRole?: AgentRole) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (epoch !== activeEpochRef.current) return;

    window.speechSynthesis.cancel();

    // Clean text of technical tokens or markup for silky-smooth speech
    const spokenReadableText = text
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/[#*`_~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(spokenReadableText);

    // Pick top-tier natural human voices available on the device
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const findVoice = (keywords: string[]) => {
        for (const kw of keywords) {
          const matched = voices.find(
            (v) => v.name.toLowerCase().includes(kw.toLowerCase()) && v.lang.startsWith('en')
          );
          if (matched) return matched;
        }
        return voices.find((v) => v.lang.startsWith('en')) || voices[0];
      };

      if (speakerRole === 'CEO') {
        // Elena: Warm, conversational, clear female voice (Natural / Google / Jenny / Samantha / Karen / Victoria)
        const v = findVoice([
          'Natural (Jenny',
          'Google US English',
          'Jenny',
          'Samantha',
          'Victoria',
          'Karen',
          'Zira',
          'Female',
        ]);
        if (v) utterance.voice = v;
        utterance.pitch = 1.02;
        utterance.rate = 1.0;
      } else if (speakerRole === 'CTO') {
        // Marcus: Friendly, relaxed, supportive tech guy (Natural / Google / Guy / Daniel / David / Tom)
        const v = findVoice([
          'Natural (Guy',
          'Google UK English Male',
          'Google US English Male',
          'Guy',
          'Daniel',
          'David',
          'Alex',
          'Male',
        ]);
        if (v) utterance.voice = v;
        utterance.pitch = 0.98;
        utterance.rate = 1.02;
      } else {
        // Vikram (CFO): Calm, grounded, empathetic financial mentor (Natural / Rishi / George / Ryan)
        const v = findVoice([
          'Natural (Ryan',
          'Natural (George',
          'Google UK English Male',
          'Rishi',
          'George',
          'Oliver',
          'Arthur',
        ]);
        if (v) utterance.voice = v;
        utterance.pitch = 0.95;
        utterance.rate = 0.98;
      }
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    utterance.onend = () => {
      handleAgentSpeechEnded(epoch);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis playback notice:', e);
      handleAgentSpeechEnded(epoch);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAgentSpeechEnded = async (epoch: number) => {
    if (epoch === activeEpochRef.current) {
      await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'AGENT_SPEECH_ENDED', payload: { epoch } }),
      });
      syncState();
    }
  };

  const toggleMic = async () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Brave.');
        return;
      }
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          alert('Microphone access was denied. Please allow microphone permissions.');
        } else {
          setIsListening(true);
        }
      }
    }
  };

  const handleStartMeeting = async () => {
    await fetch('/api/boardroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'START_MEETING', payload: { ...pitchForm, founder: founderProfile } }),
    });
    if (!isListening) {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {}
    }
    syncState();
  };

  const handleConcludeMeeting = async () => {
    const res = await fetch('/api/boardroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'CONCLUDE_MEETING' }),
    });
    const data = await res.json();
    if (data.state) {
      setMeetingState(data.state);
      setBeliefs(data.beliefs);
      if (data.state.decision?.approved) {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
      }
    }
    syncState();
  };

  const handleReset = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    await fetch('/api/boardroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESET_MEETING', payload: { ...pitchForm, founder: founderProfile } }),
    });
    setUserTranscript('');
    setCustomUtteranceInput('');
    syncState();
  };

  // Revert / Undo the last spoken exchange (reverts conviction rating & transcript)
  const handleUndoExchange = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    try {
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UNDO_EXCHANGE' }),
      });
      const data = await res.json();
      if (data.state) {
        setMeetingState(data.state);
      }
      if (data.beliefs) {
        setBeliefs(data.beliefs);
      }
      setUserTranscript('');
      setExportNotice('Last conversational exchange rolled back. Conviction scores restored.');
      setTimeout(() => setExportNotice(null), 3000);
      syncState();
    } catch (e) {
      console.error('Failed to undo exchange:', e);
    }
  };

  // Trigger cross-examination or peer-to-peer rebuttal between committee members
  const handleTriggerDebate = async (targetRole?: AgentRole) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TRIGGER_DEBATE',
          payload: { role: targetRole },
        }),
      });
      const data = await res.json();
      setIsProcessing(false);

      if (data.state) setMeetingState(data.state);
      if (data.beliefs) setBeliefs(data.beliefs);
      if (data.telemetry) setTelemetry(data.telemetry);
      if (data.events) setEvents(data.events);

      if (data.decision && data.decision.audioUrl && data.decision.epoch) {
        playAgentSpokenResponse(data.decision.audioUrl, data.decision.epoch, data.decision.spokenText, data.decision.chosenAgent);
      } else if (data.decision && data.decision.spokenText) {
        playBrowserFallbackSpeech(data.decision.spokenText, data.decision.epoch, data.decision.chosenAgent);
      }
    } catch (e) {
      setIsProcessing(false);
      console.error('Error triggering committee debate:', e);
    }
  };

  const [customUtteranceInput, setCustomUtteranceInput] = useState('');

  const sendTestPitch = (text: string) => {
    handleFounderBargeIn();
    setUserTranscript(text);
    handleFounderUtteranceComplete(text);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Export Audit Dossier
  const handleExportDossier = () => {
    const dossierData = {
      venture: pitchForm,
      founder: founderProfile,
      sessionDate: new Date().toISOString(),
      claims: meetingState?.claims || [],
      contradictions: meetingState?.contradictions || [],
      committeeVotes: meetingState?.decision || null,
      telemetry: telemetry || null,
    };
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cavyn_Audit_${pitchForm.startupName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Institutional Term Sheet & Audit Dossier exported successfully.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const currentSpeaker = meetingState?.currentSpeaker;
  const cfg = meetingState?.config || pitchForm;

  // Filtered Claims
  const claimsList: RecordedClaim[] = meetingState?.claims || [];
  const filteredClaims = claimsList.filter((c) => {
    const matchesCategory = claimCategoryFilter === 'ALL' || c.category === claimCategoryFilter;
    const matchesSearch = claimSearchQuery.trim() === '' || c.text.toLowerCase().includes(claimSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const contradictionsList: ContradictionRecord[] = meetingState?.contradictions || [];

  return (
    <div
      className="min-h-screen flex flex-col font-sans select-none antialiased relative"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-app)',
      }}
    >
      <audio ref={audioRef} className="hidden" />

      {/* INSTITUTIONAL TOP BAR */}
      <header
        className="px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b backdrop-blur-md glass-panel shadow-xs"
        style={{
          backgroundColor: 'rgba(6, 9, 16, 0.92)',
          borderColor: 'var(--border-app)',
        }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* EMBEDDED LOGO BADGE */}
            <div
              className="w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center p-0.5 shadow-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: '#0f1627',
                borderColor: 'var(--border-app)',
              }}
            >
              <Image
                src="/Cavyn_Logo.png"
                alt="Cavyn Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold tracking-tight text-sm uppercase">CAVYN</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  INSTITUTIONAL v2.5
                </span>
              </div>
              <p
                className="text-[11px] font-mono tracking-tight"
                style={{ color: 'var(--text-muted)' }}
              >
                Voice-Native Multi-Agent Arbitration Terminal
              </p>
            </div>
          </div>

          <div
            className="hidden xl:block h-6 w-px"
            style={{ backgroundColor: 'var(--border-app)' }}
          />

          {/* AUDIT DETAILS TICKER */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
            <div>
              <span
                className="text-[10px] uppercase block"
                style={{ color: 'var(--text-dim)' }}
              >
                Venture Subject
              </span>
              <span className="font-semibold">{cfg.startupName}</span>
            </div>
            <div
              className="h-4 w-px"
              style={{ backgroundColor: 'var(--border-app)' }}
            />
            <div>
              <span
                className="text-[10px] uppercase block"
                style={{ color: 'var(--text-dim)' }}
              >
                Capital Mandate
              </span>
              <span className="font-semibold">
                {cfg.fundingRequest} ({cfg.equityOffer})
              </span>
            </div>
            <div
              className="h-4 w-px"
              style={{ backgroundColor: 'var(--border-app)' }}
            />
            <div>
              <span
                className="text-[10px] uppercase block"
                style={{ color: 'var(--text-dim)' }}
              >
                Founder
              </span>
              <span className="font-semibold">{founderProfile.fullName}</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTROL BAR */}
        <div className="flex items-center gap-2.5">
          {/* EXPORT DOSSIER BUTTON */}
          <button
            onClick={handleExportDossier}
            title="Export Institutional Term Sheet & Claims Dossier (JSON)"
            className="px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-app)',
            }}
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">Export Dossier</span>
          </button>

          {/* SESSION COUNTDOWN */}
          <div
            className="px-3 py-1.5 rounded-lg border font-mono flex items-center gap-2 text-xs shadow-xs"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-app)',
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
            <span
              className="uppercase text-[10px] font-semibold hidden sm:inline"
              style={{ color: 'var(--text-dim)' }}
            >
              Session:
            </span>
            <span
              className={`font-bold tabular-nums ${
                (meetingState?.timeRemainingSeconds || 300) < 60
                  ? 'text-rose-500 animate-pulse'
                  : ''
              }`}
            >
              {formatTime(meetingState?.timeRemainingSeconds || 300)}
            </span>
          </div>

          {/* PARAMETERS BUTTON */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-app)',
            }}
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Parameters</span>
          </button>

          {/* API CREDENTIALS BUTTON */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: hasRimeKey && hasGeminiKey ? '#10b981' : 'var(--text-app)',
            }}
          >
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">{hasRimeKey && hasGeminiKey ? 'APIs Active' : 'API Keys'}</span>
          </button>

          {/* MEETING ACTIONS */}
          {!meetingState?.meetingActive ? (
            <button
              onClick={handleStartMeeting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer shadow-sm bg-emerald-500 text-neutral-950 hover:bg-emerald-400 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Convene
            </button>
          ) : (
            <button
              onClick={handleConcludeMeeting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer shadow-sm bg-rose-500 text-white hover:bg-rose-600 active:scale-95 animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Call for Vote
            </button>
          )}

          <button
            onClick={handleReset}
            title="Reset Committee State"
            className="p-1.5 rounded-lg border transition cursor-pointer hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-app)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NOTIFICATION BANNER */}
      {exportNotice && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* SLEEK HUD BAR & GTA 5 RADIAL WEAPON WHEEL TRIGGER */}
      <nav
        className="px-6 py-2 border-b flex items-center justify-between text-xs font-mono select-none"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-app)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* GTA 5 RADIAL SELECTOR LAUNCH BUTTON */}
          <button
            onClick={() => setIsWeaponWheelOpen(true)}
            title="Press 'Q' or click to open GTA 5 Radial Hub"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
          >
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="tracking-tight uppercase">SYSTEM WHEEL</span>
            <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-emerald-500/30 font-mono text-emerald-300">
              Q
            </kbd>
          </button>

          {/* ACTIVE LOCATION BREADCRUMB */}
          <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[11px]">
            <span className="text-neutral-500">// ACTIVE SECTOR:</span>
            <span className="font-bold text-neutral-200 uppercase flex items-center gap-1.5">
              {activeTab === 'CHAMBER' && <><Layers className="w-3.5 h-3.5 text-emerald-400" /> [01 // CHAMBER]</>}
              {activeTab === 'CLAIMS_DOSSIER' && <><FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> [02 // CLAIMS DOSSIER]</>}
              {activeTab === 'INVESTOR_PORTFOLIO' && <><User className="w-3.5 h-3.5 text-purple-400" /> [03 // FOUNDER DD]</>}
              {activeTab === 'ARBITRATION_ENGINE' && <><Cpu className="w-3.5 h-3.5 text-amber-400" /> [04 // TELEMETRY]</>}
              {activeTab === 'ANALYTICS' && <><BarChart3 className="w-3.5 h-3.5 text-rose-400" /> [05 // SCORING MATRIX]</>}
            </span>
          </div>
        </div>

        {/* QUICK SWITCH PILL NAVIGATION */}
        <div className="flex items-center gap-1">
          {(
            [
              { id: 'CHAMBER', label: 'Chamber', num: '01' },
              { id: 'CLAIMS_DOSSIER', label: 'Claims', num: '02' },
              { id: 'INVESTOR_PORTFOLIO', label: 'Founder', num: '03' },
              { id: 'ARBITRATION_ENGINE', label: 'Telemetry', num: '04' },
              { id: 'ANALYTICS', label: 'Scoring', num: '05' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold transition cursor-pointer flex items-center gap-1 border ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold shadow-xs'
                  : 'hover:bg-neutral-800/50 border-transparent text-neutral-400'
              }`}
            >
              <span className="opacity-60 text-[9px]">{tab.num}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* GTA 5 AUTHENTIC CIRCULAR WEAPON / SECTOR WHEEL MODAL */}
      {isWeaponWheelOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setIsWeaponWheelOpen(false)}
        >
          {/* Wheel Container with Sci-Fi Reticle and Circular Slices */}
          <div
            className="relative w-[480px] h-[480px] flex items-center justify-center animate-weapon-wheel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* AMBIENT OUTER NEON GLOW RING */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.18)] pointer-events-none" />

            {/* ROTATING OUTER HUD COMPASS RINGS */}
            <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/25 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-10 rounded-full border border-dotted border-sky-500/20 animate-spin-reverse-slow pointer-events-none" />

            {/* TARGETING CROSSHAIRS */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <div className="h-full w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent absolute" />
            </div>

            {/* SVG PIE SLICES BACKDROP WITH INTERACTIVE ARC PATHS */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto"
              viewBox="0 0 480 480"
              style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.8))' }}
            >
              <defs>
                <linearGradient id="sliceGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* 5 GTA 5 WEDGE WEDGES (72 DEGREE PIE SLICES) */}
              {[
                { tab: 'CHAMBER', startAngle: -90 - 36, endAngle: -90 + 36, color: '#10b981' },
                { tab: 'CLAIMS_DOSSIER', startAngle: -18, endAngle: 54, color: '#38bdf8' },
                { tab: 'INVESTOR_PORTFOLIO', startAngle: 54, endAngle: 126, color: '#a855f7' },
                { tab: 'ARBITRATION_ENGINE', startAngle: 126, endAngle: 198, color: '#f59e0b' },
                { tab: 'ANALYTICS', startAngle: 198, endAngle: 270, color: '#f43f5e' },
              ].map((wedge) => {
                const isActive = activeTab === wedge.tab;
                const isHovered = hoveredWheelSector === wedge.tab;

                // Function to generate SVG arc slice path
                const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
                  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
                  return {
                    x: centerX + radius * Math.cos(angleInRadians),
                    y: centerY + radius * Math.sin(angleInRadians),
                  };
                };

                const createSlice = (x: number, y: number, rInner: number, rOuter: number, startAngle: number, endAngle: number) => {
                  const startOuter = polarToCartesian(x, y, rOuter, endAngle);
                  const endOuter = polarToCartesian(x, y, rOuter, startAngle);
                  const startInner = polarToCartesian(x, y, rInner, endAngle);
                  const endInner = polarToCartesian(x, y, rInner, startAngle);
                  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
                  return [
                    'M', startOuter.x, startOuter.y,
                    'A', rOuter, rOuter, 0, arcSweep, 0, endOuter.x, endOuter.y,
                    'L', endInner.x, endInner.y,
                    'A', rInner, rInner, 0, arcSweep, 1, startInner.x, startInner.y,
                    'Z'
                  ].join(' ');
                };

                const outerRadius = isHovered ? 232 : isActive ? 226 : 220;
                const innerRadius = 88;
                const pathD = createSlice(240, 240, innerRadius, outerRadius, wedge.startAngle + 90, wedge.endAngle + 90);

                return (
                  <path
                    key={wedge.tab}
                    d={pathD}
                    onClick={() => {
                      setActiveTab(wedge.tab as ActiveTab);
                      setIsWeaponWheelOpen(false);
                    }}
                    onMouseEnter={() => setHoveredWheelSector(wedge.tab as ActiveTab)}
                    onMouseLeave={() => setHoveredWheelSector(null)}
                    className="cursor-pointer transition-all duration-200"
                    fill={
                      isActive
                        ? `${wedge.color}35`
                        : isHovered
                        ? `${wedge.color}25`
                        : 'rgba(8, 12, 22, 0.75)'
                    }
                    stroke={
                      isActive
                        ? wedge.color
                        : isHovered
                        ? '#e2e8f0'
                        : 'rgba(51, 65, 85, 0.4)'
                    }
                    strokeWidth={isActive || isHovered ? 2.5 : 1.2}
                  />
                );
              })}
            </svg>

            {/* SECTOR 1: TOP (12 O'CLOCK) // CHAMBER */}
            <button
              onMouseEnter={() => setHoveredWheelSector('CHAMBER')}
              onMouseLeave={() => setHoveredWheelSector(null)}
              onClick={() => {
                setActiveTab('CHAMBER');
                setIsWeaponWheelOpen(false);
              }}
              className={`absolute top-5 flex flex-col items-center justify-center p-2 font-mono transition-all duration-200 cursor-pointer group z-30 ${
                activeTab === 'CHAMBER'
                  ? 'text-emerald-300 scale-110'
                  : 'text-neutral-300 hover:text-emerald-400 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${
                activeTab === 'CHAMBER'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/40'
                  : 'bg-neutral-900/90 border-neutral-700/80 group-hover:border-emerald-500/60'
              }`}>
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">01 // Chamber</span>
              <span className="text-[8px] text-neutral-400">Live Roundtable</span>
            </button>

            {/* SECTOR 2: TOP RIGHT (2:30 O'CLOCK) // CLAIMS DOSSIER */}
            <button
              onMouseEnter={() => setHoveredWheelSector('CLAIMS_DOSSIER')}
              onMouseLeave={() => setHoveredWheelSector(null)}
              onClick={() => {
                setActiveTab('CLAIMS_DOSSIER');
                setIsWeaponWheelOpen(false);
              }}
              className={`absolute right-4 top-24 flex flex-col items-center justify-center p-2 font-mono transition-all duration-200 cursor-pointer group z-30 ${
                activeTab === 'CLAIMS_DOSSIER'
                  ? 'text-sky-300 scale-110'
                  : 'text-neutral-300 hover:text-sky-400 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${
                activeTab === 'CLAIMS_DOSSIER'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/40'
                  : 'bg-neutral-900/90 border-neutral-700/80 group-hover:border-sky-500/60'
              }`}>
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">02 // Claims</span>
              <span className="text-[8px] text-neutral-400">Dossier Audit</span>
            </button>

            {/* SECTOR 3: BOTTOM RIGHT (4:45 O'CLOCK) // FOUNDER DD */}
            <button
              onMouseEnter={() => setHoveredWheelSector('INVESTOR_PORTFOLIO')}
              onMouseLeave={() => setHoveredWheelSector(null)}
              onClick={() => {
                setActiveTab('INVESTOR_PORTFOLIO');
                setIsWeaponWheelOpen(false);
              }}
              className={`absolute right-12 bottom-9 flex flex-col items-center justify-center p-2 font-mono transition-all duration-200 cursor-pointer group z-30 ${
                activeTab === 'INVESTOR_PORTFOLIO'
                  ? 'text-purple-300 scale-110'
                  : 'text-neutral-300 hover:text-purple-400 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${
                activeTab === 'INVESTOR_PORTFOLIO'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/40'
                  : 'bg-neutral-900/90 border-neutral-700/80 group-hover:border-purple-500/60'
              }`}>
                <User className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">03 // Founder</span>
              <span className="text-[8px] text-neutral-400">DD & SAFE</span>
            </button>

            {/* SECTOR 4: BOTTOM LEFT (7:15 O'CLOCK) // TELEMETRY */}
            <button
              onMouseEnter={() => setHoveredWheelSector('ARBITRATION_ENGINE')}
              onMouseLeave={() => setHoveredWheelSector(null)}
              onClick={() => {
                setActiveTab('ARBITRATION_ENGINE');
                setIsWeaponWheelOpen(false);
              }}
              className={`absolute left-12 bottom-9 flex flex-col items-center justify-center p-2 font-mono transition-all duration-200 cursor-pointer group z-30 ${
                activeTab === 'ARBITRATION_ENGINE'
                  ? 'text-amber-300 scale-110'
                  : 'text-neutral-300 hover:text-amber-400 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${
                activeTab === 'ARBITRATION_ENGINE'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/40'
                  : 'bg-neutral-900/90 border-neutral-700/80 group-hover:border-amber-500/60'
              }`}>
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">04 // Telemetry</span>
              <span className="text-[8px] text-neutral-400">SLA & Latency</span>
            </button>

            {/* SECTOR 5: TOP LEFT (9:30 O'CLOCK) // SCORING MATRIX */}
            <button
              onMouseEnter={() => setHoveredWheelSector('ANALYTICS')}
              onMouseLeave={() => setHoveredWheelSector(null)}
              onClick={() => {
                setActiveTab('ANALYTICS');
                setIsWeaponWheelOpen(false);
              }}
              className={`absolute left-4 top-24 flex flex-col items-center justify-center p-2 font-mono transition-all duration-200 cursor-pointer group z-30 ${
                activeTab === 'ANALYTICS'
                  ? 'text-rose-300 scale-110'
                  : 'text-neutral-300 hover:text-rose-400 hover:scale-105'
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-500/40'
                  : 'bg-neutral-900/90 border-neutral-700/80 group-hover:border-rose-500/60'
              }`}>
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tight mt-1">05 // Scoring</span>
              <span className="text-[8px] text-neutral-400">Matrix & Vote</span>
            </button>

            {/* CENTER WHEEL HUD & TELEMETRY CORE */}
            <div
              className="w-40 h-40 rounded-full border-2 border-emerald-500/60 flex flex-col items-center justify-center p-3 text-center z-40 shadow-2xl relative transition-all"
              style={{
                backgroundColor: 'rgba(6, 9, 16, 0.96)',
                boxShadow: '0 0 45px rgba(16, 185, 129, 0.35), inset 0 0 20px rgba(16, 185, 129, 0.2)',
              }}
            >
              <div className="relative mb-1">
                <Crosshair className="w-6 h-6 text-emerald-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold">
                {hoveredWheelSector || activeTab}
              </div>
              <div className="text-[9px] text-neutral-300 mt-1 leading-tight font-mono line-clamp-2 px-1">
                {hoveredWheelSector === 'CHAMBER' || (!hoveredWheelSector && activeTab === 'CHAMBER')
                  ? 'Real-time Autonomous Chamber Deliberation'
                  : hoveredWheelSector === 'CLAIMS_DOSSIER' || (!hoveredWheelSector && activeTab === 'CLAIMS_DOSSIER')
                  ? 'Contradiction & Claims Institutional Ledger'
                  : hoveredWheelSector === 'INVESTOR_PORTFOLIO' || (!hoveredWheelSector && activeTab === 'INVESTOR_PORTFOLIO')
                  ? 'Founder Profile & Interactive SAFE Model'
                  : hoveredWheelSector === 'ARBITRATION_ENGINE' || (!hoveredWheelSector && activeTab === 'ARBITRATION_ENGINE')
                  ? 'Microsecond Telemetry & Latency SLA'
                  : 'Supermajority Conviction & Voting Analytics'}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[8px] font-mono text-neutral-400 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900/80">
                <span>PRESS</span>
                <kbd className="text-emerald-400 font-bold">Q</kbd>
                <span>OR</span>
                <kbd className="text-emerald-400 font-bold">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PARAMETERS CONFIGURATION MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="max-w-xl w-full p-6 rounded-2xl border shadow-2xl font-sans"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-app)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3 mb-4 border-b font-mono"
              style={{ borderColor: 'var(--border-app)' }}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                <h3 className="text-sm font-bold uppercase tracking-tight">Audit Session Parameters</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="font-mono text-sm hover:opacity-70 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
              {/* SECTION 1: VENTURE PARAMETERS */}
              <div className="pb-3 border-b border-neutral-800">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide block mb-3">
                  1. Venture & Business Model
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Startup / Product Name
                    </label>
                    <input
                      type="text"
                      value={pitchForm.startupName}
                      onChange={(e) => setPitchForm({ ...pitchForm, startupName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Session Objective
                    </label>
                    <input
                      type="text"
                      value={pitchForm.pitchGoal}
                      onChange={(e) => setPitchForm({ ...pitchForm, pitchGoal: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Capital Requested (e.g. ₹25,00,000 or $50,000)
                    </label>
                    <input
                      type="text"
                      value={pitchForm.fundingRequest}
                      onChange={(e) => setPitchForm({ ...pitchForm, fundingRequest: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Equity Offered (%)
                    </label>
                    <input
                      type="text"
                      value={pitchForm.equityOffer}
                      onChange={(e) => setPitchForm({ ...pitchForm, equityOffer: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Target Customer / User Base
                    </label>
                    <input
                      type="text"
                      value={pitchForm.targetCustomer}
                      onChange={(e) => setPitchForm({ ...pitchForm, targetCustomer: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Business Model & Pricing
                    </label>
                    <input
                      type="text"
                      value={pitchForm.businessModel}
                      onChange={(e) => setPitchForm({ ...pitchForm, businessModel: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Product Summary (What are you building?)
                    </label>
                    <textarea
                      rows={2}
                      value={pitchForm.productSummary}
                      onChange={(e) => setPitchForm({ ...pitchForm, productSummary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FOUNDER INFO & BACKGROUND */}
              <div>
                <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wide block mb-3">
                  2. Founder Profile & Background
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={founderProfile.fullName}
                      onChange={(e) => setFounderProfile({ ...founderProfile, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Title / Role
                    </label>
                    <input
                      type="text"
                      value={founderProfile.title}
                      onChange={(e) => setFounderProfile({ ...founderProfile, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Education or Self-Taught Background
                    </label>
                    <input
                      type="text"
                      value={founderProfile.education}
                      onChange={(e) => setFounderProfile({ ...founderProfile, education: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Domain Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={founderProfile.domainExperienceYears}
                      onChange={(e) =>
                        setFounderProfile({ ...founderProfile, domainExperienceYears: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
                      Prior Projects or Track Record
                    </label>
                    <input
                      type="text"
                      value={founderProfile.priorExits}
                      onChange={(e) => setFounderProfile({ ...founderProfile, priorExits: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-app)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex justify-end gap-2 mt-5 pt-3 border-t"
              style={{ borderColor: 'var(--border-app)' }}
            >
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono hover:opacity-70 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePitchConfig}
                className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 cursor-pointer shadow-md transition active:scale-95"
              >
                Save & Update Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="max-w-md w-full p-6 rounded-2xl border shadow-2xl font-mono"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-app)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3 mb-4 border-b"
              style={{ borderColor: 'var(--border-app)' }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-tight">API Providers & Secret Vault</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-sm hover:opacity-70 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Keys remain encrypted in server memory. Passwords remain masked by default for privacy when sharing screens.
            </p>

            <div className="space-y-4 text-xs">
              {/* GEMINI KEY INPUT WITH EYE TOGGLE */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-dim)' }}>
                    Google Gemini API Key (Brain)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGeminiSecret((prev) => !prev)}
                    className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showGeminiSecret ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Reveal
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showGeminiSecret ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={inputGeminiKey}
                    onChange={(e) => setInputGeminiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-app)',
                      color: 'var(--text-app)',
                    }}
                  />
                  {hasGeminiKey && (
                    <span className="absolute right-3 top-2.5 text-[10px] text-emerald-500 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
                  Powers committee deliberation, turn bidding, and contradiction flagging.
                </p>
              </div>

              {/* RIME KEY INPUT WITH EYE TOGGLE */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-dim)' }}>
                    Rime Labs API Key (Voices)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRimeSecret((prev) => !prev)}
                    className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showRimeSecret ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Reveal
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showRimeSecret ? 'text' : 'password'}
                    placeholder="rime-api-key..."
                    value={inputRimeKey}
                    onChange={(e) => setInputRimeKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border font-mono focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-app)',
                      color: 'var(--text-app)',
                    }}
                  />
                  {hasRimeKey && (
                    <span className="absolute right-3 top-2.5 text-[10px] text-emerald-500 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
                  Synthesizes sub-200ms spoken audio voices. (Browser Web Speech activates if empty).
                </p>
              </div>

              {/* LIVE VALIDATION FEEDBACK */}
              {keyValidationMsg && (
                <div
                  className={`p-2.5 rounded-lg border flex items-center gap-2 text-[11px] ${
                    keyValidationMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {keyValidationMsg.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{keyValidationMsg.text}</span>
                </div>
              )}

              <div
                className="flex justify-end gap-2 pt-3 border-t"
                style={{ borderColor: 'var(--border-app)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg text-xs hover:opacity-70 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isValidatingKeys}
                  onClick={handleSaveKeys}
                  className="px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer flex items-center gap-2 shadow-xs"
                  style={{
                    backgroundColor: darkMode ? '#fafafa' : '#09090b',
                    color: darkMode ? '#09090b' : '#fafafa',
                  }}
                >
                  {isValidatingKeys ? (
                    <>
                      <span className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Validate & Encrypt'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN TAB CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col gap-6">

        {/* ========================================================================= */}
        {/* TAB 1: CHAMBER (MAIN LIVE ROUNDTABLE) */}
        {/* ========================================================================= */}
        {activeTab === 'CHAMBER' && (
          <>
            {/* THREE COMMITTEE SEATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['CEO', 'CTO', 'CFO'] as AgentRole[]).map((role) => {
                const seat = COMMITTEE_SEATS[role];
                const belief = beliefs?.[role] || { confidence: 50, trust: 50, keyConcerns: [], keyPositives: [] };
                const isSpeaking = currentSpeaker === role;

                const roleHaloClass = role === 'CEO' ? 'halo-ceo border-emerald-500/80 ring-2 ring-emerald-500/40' : role === 'CTO' ? 'halo-cto border-sky-500/80 ring-2 ring-sky-500/40' : 'halo-cfo border-amber-500/80 ring-2 ring-amber-500/40';

                return (
                  <div
                    key={role}
                    className={`rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden shadow-sm ${
                      isSpeaking ? `${roleHaloClass} scale-[1.02]` : 'hover:border-neutral-500 hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: isSpeaking ? undefined : 'var(--border-app)',
                    }}
                  >
                    {/* RADAR SWEEP LINE FOR SPEAKING AGENT */}
                    {isSpeaking && (
                      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden opacity-20">
                        <div className="w-full h-full border border-emerald-500 rounded-full animate-radar origin-center" />
                      </div>
                    )}

                    <div>
                      {/* SEAT HEADER */}
                      <div
                        className="flex items-start justify-between pb-3.5 border-b"
                        style={{ borderColor: 'var(--border-app)' }}
                      >
                        <div className="flex items-center gap-3">
                          {/* DYNAMIC SEAT AVATAR BADGE WITH SVG TECH ICON */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border font-mono font-bold text-xs transition-colors shadow-xs ${
                              isSpeaking ? 'bg-emerald-500 text-white border-emerald-400' : ''
                            }`}
                            style={{
                              backgroundColor: !isSpeaking ? 'var(--bg-subtle)' : undefined,
                              borderColor: !isSpeaking ? 'var(--border-app)' : undefined,
                              color: !isSpeaking ? 'var(--text-app)' : undefined,
                            }}
                          >
                            {role === 'CEO' ? (
                              <Briefcase className="w-4 h-4" />
                            ) : role === 'CTO' ? (
                              <Cpu className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <span className="font-extrabold">{seat.code}</span>
                              <span style={{ color: 'var(--text-dim)' }}>//</span>
                              <span style={{ color: 'var(--text-muted)' }}>{seat.defaultModel.toUpperCase()}</span>
                            </div>
                            <h3 className="text-sm font-extrabold uppercase tracking-tight mt-0.5">
                              {seat.office}
                            </h3>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {seat.domain}
                            </p>
                          </div>
                        </div>

                        {isSpeaking ? (
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shadow-xs animate-pulse"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Speaking
                          </div>
                        ) : (
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              borderColor: 'var(--border-app)',
                              color: 'var(--text-dim)',
                            }}
                          >
                            Standby
                          </span>
                        )}
                      </div>

                      {/* SVG DYNAMIC CONVICTION ARC GAUGE */}
                      <div
                        className="my-4 p-4 rounded-xl border font-mono flex items-center justify-between"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-app)',
                        }}
                      >
                        <div>
                          <span className="uppercase text-[10px] block" style={{ color: 'var(--text-dim)' }}>
                            Conviction Rating
                          </span>
                          <span className="font-bold text-2xl tabular-nums block mt-0.5">
                            {belief.confidence}%
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            Trust Index: {belief.trust}%
                          </span>
                        </div>

                        {/* RADIAL PROGRESS SVG */}
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-neutral-200 dark:text-neutral-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              strokeWidth="3.5"
                              strokeDasharray={`${belief.confidence}, 100`}
                              strokeLinecap="round"
                              stroke={belief.confidence >= 60 ? '#10b981' : belief.confidence >= 40 ? '#f59e0b' : '#ef4444'}
                              fill="none"
                              className="transition-all duration-500 ease-out"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold">
                            {belief.confidence}
                          </span>
                        </div>
                      </div>

                      {/* ACTIVE DELIBERATION INQUIRIES */}
                      <div className="space-y-1.5 font-mono text-xs">
                        <span className="uppercase text-[10px] block font-bold" style={{ color: 'var(--text-dim)' }}>
                          Active Deliberation Inquiries
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {belief.keyConcerns.map((concern, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-md text-[10px] border flex items-center gap-1.5 shadow-xs"
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-app)',
                                color: 'var(--text-app)',
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DECISION VERDICT (IF CONCLUDED) */}
            {meetingState?.meetingConcluded && meetingState.decision && (
              <div
                className="p-6 rounded-2xl border shadow-lg transition-all"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: meetingState.decision.approved ? '#10b981' : '#f43f5e',
                }}
              >
                <div
                  className="flex items-center justify-between pb-4 mb-4 border-b"
                  style={{ borderColor: 'var(--border-app)' }}
                >
                  <div className="flex items-center gap-3">
                    {meetingState.decision.approved ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <XCircle className="w-7 h-7 text-rose-500" />
                    )}
                    <div>
                      <h2 className="text-base font-bold font-mono tracking-tight uppercase">
                        {meetingState.decision.approved
                          ? 'TERM SHEET APPROVED // AFFIRMATIVE CONSENSUS'
                          : 'MANDATE REJECTED // DISSENTING AUDIT'}
                      </h2>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                        Formal Committee Record for {cfg.startupName} (Founder: {founderProfile.fullName})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-mono font-bold rounded ${
                      meetingState.decision.approved ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {meetingState.decision.approved ? 'AFFIRMATIVE MANDATE' : 'REJECTED'}
                  </span>
                </div>

                <p
                  className="text-xs font-mono mb-4 leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {meetingState.decision.overallFeedback}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['CEO', 'CTO', 'CFO'] as AgentRole[]).map((role) => {
                    const vote = meetingState.decision?.votes[role];
                    const seat = COMMITTEE_SEATS[role];
                    return (
                      <div
                        key={role}
                        className="p-3.5 rounded-xl border font-mono text-xs"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-app)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[11px] uppercase">
                            {seat.code} // {seat.office}
                          </span>
                          <span
                            className={`font-bold ${
                              vote?.vote === 'YES' ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {vote?.vote} ({vote?.score}%)
                          </span>
                        </div>
                        <p className="text-[11px] leading-normal" style={{ color: 'var(--text-muted)' }}>
                          {vote?.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONVERSATIONAL FLOOR TRANSMISSION TERMINAL */}
            <div
              className="rounded-2xl border p-6 flex flex-col gap-4 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: 'var(--border-app)' }}
              >
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentSpeaker === 'USER'
                        ? 'bg-emerald-500 animate-ping'
                        : currentSpeaker
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-neutral-400'
                    }`}
                  />
                  <span className="font-bold uppercase tracking-tight">
                    Floor Status:{' '}
                    {currentSpeaker === 'USER'
                      ? `${founderProfile.fullName.toUpperCase()} (FOUNDER) TRANSMITTING`
                      : currentSpeaker
                      ? `${COMMITTEE_SEATS[currentSpeaker].code} TRANSMITTING`
                      : 'OPEN (AWAITING INPUT)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMic}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-md ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-neutral-950 hover:shadow-emerald-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isListening ? 'Mute Transmission' : 'Transmit Audio (Live Mic)'}
                  </button>
                </div>
              </div>

              {/* LIVE TRANSCRIPT FEED WITH 7-BAR HIGH FREQUENCY WAVEFORM */}
              <div
                className="min-h-[85px] rounded-xl p-4 font-mono text-xs flex items-center justify-between border relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center gap-3.5 w-full pr-4">
                  {/* ANIMATED AUDIO WAVEFORM (12 dynamic responsive bars & spectrum) */}
                  {(isListening || currentSpeaker) && (
                    <div className="flex items-center gap-1.5 h-9 shrink-0 px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-xs">
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-1" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-2" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-3" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-4" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-5" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-6" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-7" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-8" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-9" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-10" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-11" />
                        <div className="w-1 bg-emerald-500 rounded-full animate-wave-12" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-tighter ml-1">
                        {isListening ? '48kHz' : 'PCM VOX'}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    {/* FOUNDER UTTERANCE STREAM */}
                    {userTranscript && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">[FOUNDER]:</span>
                        <span className="font-semibold text-xs text-neutral-100">"{userTranscript}"</span>
                      </div>
                    )}

                    {/* LIVE AGENT SPOKEN SUBTITLE STREAM - PERSISTENT */}
                    {meetingState?.activeSubtitle && (
                      <div className={`flex items-start gap-2 p-2.5 rounded-lg border backdrop-blur-md transition-all ${
                        meetingState.activeSubtitle.speaker === 'CEO'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : meetingState.activeSubtitle.speaker === 'CTO'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          {currentSpeaker && currentSpeaker !== 'USER' ? (
                            <span className="w-2 h-2 rounded-full animate-ping bg-current" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                          )}
                          <span className="text-[10px] font-mono font-extrabold uppercase">
                            [{meetingState.activeSubtitle.speaker && meetingState.activeSubtitle.speaker in COMMITTEE_SEATS ? COMMITTEE_SEATS[meetingState.activeSubtitle.speaker as AgentRole].code : 'MENTOR'} // {meetingState.activeSubtitle.speaker || 'AGENT'}]:
                          </span>
                        </div>
                        <span className="text-xs font-mono font-medium leading-relaxed">
                          "{meetingState.activeSubtitle.text}"
                        </span>
                      </div>
                    )}

                    {!userTranscript && !meetingState?.activeSubtitle && (
                      <div>
                        {isProcessing ? (
                          <div className="italic flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            Evaluating turn bid priority across committee seats...
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>
                            {isListening
                              ? 'Listening... Speak casually into your microphone.'
                              : 'Click Transmit Audio to speak, or type directly below.'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {currentSpeaker && currentSpeaker !== 'USER' && (
                  <button
                    onClick={handleFounderBargeIn}
                    className="px-3 py-1.5 text-xs font-mono rounded-lg transition cursor-pointer hover:opacity-85 shrink-0 bg-rose-500 text-white font-bold shadow-xs"
                  >
                    Barge-In / Silence
                  </button>
                )}
              </div>

              {/* DIRECT TEXT TRANSMISSION & UNDO BAR */}
              <div
                className="p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-3 text-xs font-mono"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (customUtteranceInput.trim()) {
                      sendTestPitch(customUtteranceInput.trim());
                      setCustomUtteranceInput('');
                    }
                  }}
                  className="flex-1 flex items-center gap-2 w-full"
                >
                  <input
                    type="text"
                    value={customUtteranceInput}
                    onChange={(e) => setCustomUtteranceInput(e.target.value)}
                    placeholder="Type founder statement or argument (or use mic above)..."
                    className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-app)',
                      color: 'var(--text-app)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!customUtteranceInput.trim() || isProcessing}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    Transmit
                  </button>
                </form>

                <div className="flex items-center gap-2 shrink-0">
                  {/* UNDO / REVERT BUTTON */}
                  <button
                    type="button"
                    onClick={handleUndoExchange}
                    title="Undo last statement and rollback conviction"
                    className="px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    Undo Turn
                  </button>

                  {/* TRIGGER PEER REBUTTAL BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleTriggerDebate()}
                    disabled={isProcessing}
                    title="Let another committee member challenge or cross-examine"
                    className="px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs text-sky-400 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition cursor-pointer"
                  >
                    <MessageSquareShare className="w-3.5 h-3.5" />
                    Cross-Examine
                  </button>
                </div>
              </div>

              {/* CASUAL CONVERSATION STARTERS & BEGINNER PROMPTS */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span
                  className="text-[10px] uppercase font-bold flex items-center gap-1"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  Quick Chat Starters:
                </span>
                <button
                  onClick={() =>
                    sendTestPitch(
                      `Hey everyone! I'm building an app that makes daily work much simpler for regular people. What do you think of the concept?`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border transition cursor-pointer text-[11px] hover:opacity-85 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                >
                  Intro Pitch (Simple)
                </button>
                <button
                  onClick={() =>
                    sendTestPitch(
                      `I don't understand the complex terminologies. Can we just talk casually like friends?`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg border transition cursor-pointer text-[11px] hover:opacity-85 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-xs"
                >
                  "Explain Simply"
                </button>
                <button
                  onClick={() =>
                    sendTestPitch(`We plan to charge users around $10 a month once we launch. Does that sound reasonable?`)
                  }
                  className="px-2.5 py-1 rounded-lg border transition cursor-pointer text-[11px] hover:opacity-85 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                >
                  Pricing Question
                </button>
                <button
                  onClick={() => sendTestPitch(`Marcus, how would you recommend we build the first prototype?`)}
                  className="px-2.5 py-1 rounded-lg border transition cursor-pointer text-[11px] hover:opacity-85 shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                >
                  Ask Tech Advice (Marcus)
                </button>

                <div className="flex items-center gap-1.5 ml-auto text-[10px] text-neutral-400">
                  <span>Rebuttal:</span>
                  <button
                    onClick={() => handleTriggerDebate('CEO')}
                    className="px-2 py-0.5 rounded border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                  >
                    CEO
                  </button>
                  <button
                    onClick={() => handleTriggerDebate('CTO')}
                    className="px-2 py-0.5 rounded border border-sky-500/30 hover:bg-sky-500/10 text-sky-400"
                  >
                    CTO
                  </button>
                  <button
                    onClick={() => handleTriggerDebate('CFO')}
                    className="px-2 py-0.5 rounded border border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                  >
                    CFO
                  </button>
                </div>
              </div>

              {/* LIVE CONVERSATION TRANSCRIPT STREAM */}
              {meetingState?.conversationHistory && meetingState.conversationHistory.length > 0 && (
                <div
                  className="rounded-xl border p-4 font-mono text-xs max-h-64 overflow-y-auto space-y-2.5 shadow-inner"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-app)',
                  }}
                >
                  <div className="flex items-center justify-between pb-2 border-b text-[10px] uppercase font-bold" style={{ borderColor: 'var(--border-app)', color: 'var(--text-dim)' }}>
                    <span>Continuous Boardroom Record ({meetingState.conversationHistory.length} Turns)</span>
                    <span>Multi-Agent Live Floor</span>
                  </div>
                  {meetingState.conversationHistory.map((turn, idx) => {
                    const isUser = turn.speaker === 'USER';
                    const roleColor = turn.speaker === 'CEO' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : turn.speaker === 'CTO' ? 'text-sky-400 border-sky-500/30 bg-sky-500/5' : turn.speaker === 'CFO' ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 'text-neutral-200 border-neutral-700 bg-neutral-900/50';

                    return (
                      <div
                        key={turn.id || idx}
                        className={`p-2.5 rounded-lg border transition-all ${roleColor}`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
                          <span className="uppercase">
                            {isUser ? `[FOUNDER // ${founderProfile.fullName}]` : `[${COMMITTEE_SEATS[turn.speaker as AgentRole]?.code || turn.speaker} // ${turn.speaker}]`}
                          </span>
                          <span className="opacity-60 text-[9px] tabular-nums">
                            {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed font-sans text-neutral-100">
                          "{turn.text}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LIVE PULSE RADAR TICKER AT BOTTOM OF CHAMBER */}
            <div
              className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold tracking-tight uppercase">
                  Active Kernel Epoch #{meetingState?.speakingEpoch || 0}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>|</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {telemetry?.totalInterruptions || 0} Barge-in takeovers managed
                </span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
                <span>Inference Latency:</span>
                <span className="text-emerald-500 font-bold tabular-nums">
                  {telemetry?.interruptToStopMs || 12}ms
                </span>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CLAIMS & AUDIT DOSSIER */}
        {/* ========================================================================= */}
        {activeTab === 'CLAIMS_DOSSIER' && (
          <div className="flex flex-col gap-6 font-mono">
            {/* DOSSIER HEADER STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  Total Recorded Claims
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">{claimsList.length}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Live statement extraction
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="text-[10px] uppercase text-emerald-500 font-bold">
                  Verified Assertions
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1 text-emerald-500">
                  {claimsList.filter((c) => c.status === 'VERIFIED').length}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Consistent with baseline
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="text-[10px] uppercase text-rose-500 font-bold">
                  Contradictions Flagged
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1 text-rose-500">
                  {contradictionsList.length}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Discrepancies identified
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  Audit Integrity Score
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">
                  {claimsList.length === 0
                    ? '100%'
                    : `${Math.max(
                        0,
                        Math.round(
                          ((claimsList.length - contradictionsList.length * 2) / claimsList.length) * 100
                        )
                      )}%`}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Weighted reliability index
                </div>
              </div>
            </div>

            {/* CONTRADICTION AUDIT ALERTS */}
            {contradictionsList.length > 0 && (
              <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-rose-500/20 text-rose-500 text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Discrepancy Audit Alerts ({contradictionsList.length} Active)</span>
                </div>

                <div className="space-y-3">
                  {contradictionsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-rose-500/20 text-xs shadow-xs"
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-rose-500 uppercase">
                          [{item.severity} SEVERITY] Detected by {COMMITTEE_SEATS[item.agentDetector]?.code || item.agentDetector}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--text-app)' }}>
                        {item.description}
                      </p>
                      <div className="p-2.5 rounded-lg border text-[11px] space-y-1" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                        <div>
                          <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>Prior Assertion: </span>
                          <span className="italic" style={{ color: 'var(--text-muted)' }}>"{item.claimA}"</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-500">Conflicting Statement: </span>
                          <span className="italic font-semibold text-rose-500">"{item.claimB}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CLAIMS FILTER AND SEARCH TOOLBAR */}
            <div
              className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>Category:</span>
                {(['ALL', 'market', 'tech', 'financial'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setClaimCategoryFilter(cat)}
                    className="px-2.5 py-1 rounded-lg text-[11px] uppercase transition cursor-pointer border shadow-xs"
                    style={{
                      backgroundColor:
                        claimCategoryFilter === cat
                          ? darkMode
                            ? '#fafafa'
                            : '#09090b'
                          : 'var(--bg-subtle)',
                      color:
                        claimCategoryFilter === cat
                          ? darkMode
                            ? '#09090b'
                            : '#fafafa'
                          : 'var(--text-app)',
                      borderColor: 'var(--border-app)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5" style={{ color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Filter assertions..."
                  value={claimSearchQuery}
                  onChange={(e) => setClaimSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                />
              </div>
            </div>

            {/* CLAIMS LEDGER TABLE */}
            <div
              className="rounded-2xl border overflow-hidden shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div
                className="p-3 border-b flex items-center justify-between text-[11px] uppercase font-bold"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-app)',
                  color: 'var(--text-dim)',
                }}
              >
                <div className="w-20">Time</div>
                <div className="w-24">Domain</div>
                <div className="flex-1">Founder Assertion</div>
                <div className="w-28 text-right">Audit Status</div>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border-app)' }}>
                {filteredClaims.length === 0 ? (
                  <div className="py-12 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
                    No claims recorded matching current criteria. Speak or inject an utterance in Chamber.
                  </div>
                ) : (
                  filteredClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-3.5 flex items-start gap-4 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition"
                    >
                      <div className="w-20 text-[10px] shrink-0 pt-0.5" style={{ color: 'var(--text-dim)' }}>
                        {new Date(claim.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>

                      <div className="w-24 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-app)',
                            color:
                              claim.category === 'financial'
                                ? '#10b981'
                                : claim.category === 'tech'
                                ? '#3b82f6'
                                : '#a855f7',
                          }}
                        >
                          {claim.category}
                        </span>
                      </div>

                      <div className="flex-1 text-xs leading-relaxed font-sans">
                        <span style={{ color: 'var(--text-app)' }}>"{claim.text}"</span>
                        {claim.notes && (
                          <div className="text-[10px] font-mono mt-1 text-rose-500">
                            Note: {claim.notes}
                          </div>
                        )}
                      </div>

                      <div className="w-28 text-right shrink-0">
                        {claim.status === 'CONTRADICTED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10">
                            <XCircle className="w-3 h-3" /> CONFLICT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FOUNDER PROFILE & INVESTOR DUE DILIGENCE */}
        {/* ========================================================================= */}
        {activeTab === 'INVESTOR_PORTFOLIO' && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            {/* FOUNDER IDENTITY OVERVIEW */}
            <div
              className="p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border flex items-center justify-center font-bold text-xl uppercase shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                >
                  {founderProfile.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold tracking-tight uppercase">
                      {founderProfile.fullName}
                    </h2>
                    {founderProfile.verifiedAccreditation && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> ACCREDITED
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {founderProfile.title} // {founderProfile.firmName}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    <span>{founderProfile.education}</span>
                    <span>•</span>
                    <span>{founderProfile.domainExperienceYears} Years Domain Ops</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:opacity-85 transition shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-app)',
                  }}
                >
                  Edit Profile Data
                </button>
              </div>
            </div>

            {/* FOUNDER TRACTION & DUE DILIGENCE METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  <span>Prior Venture Track Record</span>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-sm font-bold mt-2 font-sans" style={{ color: 'var(--text-app)' }}>
                  {founderProfile.priorExits}
                </div>
                <div className="text-[10px] mt-1 text-emerald-500">Verified institutional exit</div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  <span>Academic Accreditation</span>
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-sm font-bold mt-2 font-sans" style={{ color: 'var(--text-app)' }}>
                  {founderProfile.education}
                </div>
                <div className="text-[10px] mt-1 text-blue-500">AI Systems Engineering Specialization</div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  <span>Repository & Code Moat</span>
                  <Globe className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="text-sm font-bold mt-2 font-sans truncate" style={{ color: 'var(--text-app)' }}>
                  {founderProfile.githubUrl || 'github.com/founder-repo'}
                </div>
                <div className="text-[10px] mt-1 text-purple-500">Autonomous codebase audited</div>
              </div>
            </div>

            {/* INVESTOR TERM SHEET PREVIEW */}
            <div
              className="p-5 rounded-2xl border shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--border-app)' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-tight">Institutional SAFE / Term Sheet Summary</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">
                  STANDARD YC-POST-MONEY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-dim)' }}>Investment Instrument</span>
                  <span className="font-bold text-xs">Post-Money SAFE</span>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-dim)' }}>Capital Mandate</span>
                  <span className="font-bold text-xs">{cfg.fundingRequest}</span>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-dim)' }}>Ownership Stake</span>
                  <span className="font-bold text-xs">{cfg.equityOffer}</span>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-dim)' }}>Pro-Rata Rights</span>
                  <span className="font-bold text-xs">Major Investor Clause</span>
                </div>
              </div>

              {/* DYNAMIC CAP TABLE & SAFE CALCULATOR */}
              <div className="p-4 rounded-xl border mb-4" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-tight flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-emerald-500" />
                    Interactive YC Post-Money SAFE Dilution Model
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    Effective Ownership: {((safeInvestment / safeValuationCap) * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Investment Tranche</span>
                      <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        ${(safeInvestment).toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={2000000}
                      step={50000}
                      value={safeInvestment}
                      onChange={(e) => setSafeInvestment(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Post-Money Valuation Cap</span>
                      <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        ${(safeValuationCap).toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2000000}
                      max={25000000}
                      step={500000}
                      value={safeValuationCap}
                      onChange={(e) => setSafeValuationCap(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* VISUAL CAP TABLE BAR */}
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-400 mb-1.5">
                    <span>Pro-Forma Ownership Split</span>
                    <span className="text-emerald-500">
                      Founder Retained: {(100 - (safeInvestment / safeValuationCap) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${100 - (safeInvestment / safeValuationCap) * 100}%` }}
                      title="Founder & Team"
                    />
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${(safeInvestment / safeValuationCap) * 100}%` }}
                      title="SAFE Investors"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Founder & Common Pool ({(100 - (safeInvestment / safeValuationCap) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Seed SAFE Syndicate ({((safeInvestment / safeValuationCap) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Upon affirmative consensus from at least 2 of the 3 Committee Seats, this Term Sheet converts into a binding execution dossier. Founder claims recorded in Tab 02 serve as contractual representations and warranties.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ARBITRATION TELEMETRY & AUDIT TRAIL */}
        {/* ========================================================================= */}
        {activeTab === 'ARBITRATION_ENGINE' && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            {/* TELEMETRY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                    Barge-In Latency SLA
                  </div>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">
                  {telemetry?.interruptToStopMs || 12}ms
                </div>
                <div className="text-[10px] mt-0.5 text-emerald-500 font-bold">
                  Target &lt; 200ms (Hard Target)
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                    Stale Audio Leaks
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">
                  {telemetry?.staleAudioLeaks || 0}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  0 frames post-epoch cancellation
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                    Active Speaking Epoch
                  </div>
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">
                  #{meetingState?.speakingEpoch || 0}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Monotonic turn increment
                </div>
              </div>

              <div
                className="p-4 rounded-xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                    Total Barge-In Interventions
                  </div>
                  <Square className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1">
                  {telemetry?.totalInterruptions || 0}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Founder takeovers recorded
                </div>
              </div>
            </div>

            {/* FULL AUDIT TIMELINE LOG */}
            <div
              className="rounded-2xl border overflow-hidden flex flex-col shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <div
                className="p-4 border-b flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-app)',
                }}
              >
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-neutral-400" />
                  <span className="font-bold uppercase tracking-tight">
                    Arbitration Timeline & State Transitions
                  </span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: 'var(--text-dim)' }}>
                  {events.length} TOTAL EVENTS LOGGED
                </span>
              </div>

              <div className="divide-y max-h-[500px] overflow-y-auto" style={{ borderColor: 'var(--border-app)' }}>
                {events.length === 0 ? (
                  <div className="py-12 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
                    No arbitration events logged in current session.
                  </div>
                ) : (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 flex items-start gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition"
                    >
                      <span className="w-24 shrink-0 text-[10px] pt-0.5" style={{ color: 'var(--text-dim)' }}>
                        {new Date(evt.timestampMs).toISOString().substring(11, 23)}
                      </span>

                      <div className="w-44 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-app)',
                            color:
                              evt.type.includes('CANCEL') || evt.type.includes('INTERRUPT')
                                ? '#f43f5e'
                                : evt.type.includes('CONTRADICTION')
                                ? '#f59e0b'
                                : evt.type.includes('FINAL')
                                ? '#10b981'
                                : 'var(--text-app)',
                          }}
                        >
                          {evt.type}
                        </span>
                      </div>

                      <div className="flex-1 font-mono text-[11px] leading-relaxed break-words" style={{ color: 'var(--text-muted)' }}>
                        {evt.detail}
                      </div>

                      {evt.speaker && (
                        <div className="w-20 text-right shrink-0">
                          <span
                            className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              borderColor: 'var(--border-app)',
                              color: 'var(--text-dim)',
                            }}
                          >
                            {evt.speaker}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SCORING MATRIX & RISK ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'ANALYTICS' && (
          <div className="flex flex-col gap-6 font-mono text-xs">
            {/* WEIGHTED SCORING BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['CEO', 'CTO', 'CFO'] as AgentRole[]).map((role) => {
                const seat = COMMITTEE_SEATS[role];
                const belief = beliefs?.[role] || { confidence: 50, trust: 50, keyConcerns: [], keyPositives: [] };

                return (
                  <div
                    key={role}
                    className="p-5 rounded-2xl border flex flex-col justify-between shadow-sm"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-app)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--border-app)' }}>
                        <div>
                          <span className="font-bold text-xs">{seat.code}</span>
                          <h4 className="font-extrabold uppercase mt-0.5">{seat.office}</h4>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border shadow-xs"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-app)',
                            color: belief.confidence >= 60 ? '#10b981' : '#f59e0b',
                          }}
                        >
                          {belief.confidence >= 60 ? 'AFFIRMATIVE LEAN' : 'DISSENT LEAN'}
                        </span>
                      </div>

                      {/* DETAILED RUBRICS */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex items-center justify-between text-[10px] uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
                            <span>Strategic Conviction</span>
                            <span className="font-bold tabular-nums text-xs">{belief.confidence}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#162038' : '#e2e8f0' }}>
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${belief.confidence}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[10px] uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
                            <span>Statement Consistency & Trust</span>
                            <span className="font-bold tabular-nums text-xs">{belief.trust}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#162038' : '#e2e8f0' }}>
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${belief.trust}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* PRIMARY MERITS */}
                      <div className="mb-3">
                        <span className="text-[10px] uppercase font-bold block mb-1.5 text-emerald-500">
                          Accredited Merits
                        </span>
                        <div className="space-y-1">
                          {belief.keyPositives.map((pos, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-app)' }}>
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{pos}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KEY INQUIRIES */}
                      <div>
                        <span className="text-[10px] uppercase font-bold block mb-1.5 text-rose-500">
                          Unresolved Inquiries
                        </span>
                        <div className="space-y-1">
                          {belief.keyConcerns.map((con, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-app)' }}>
                              <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONSENSUS FORMULA SPECIFICATION */}
            <div
              className="p-5 rounded-2xl border shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
              }}
            >
              <h3 className="font-bold uppercase tracking-tight text-xs mb-2">
                Consensus Arbitration Thresholds
              </h3>
              <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
                The Cavyn arbitration engine requires a supermajority of 2 out of 3 committee seats casting affirmative votes (Conviction rating &ge; 60%) to issue an investment mandate or venture term sheet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <div className="font-bold uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>SEAT 01 // CEO MANDATE</div>
                  <p style={{ color: 'var(--text-muted)' }}>Evaluates distribution velocity, customer archetype urgency, and defensibility against incumbents.</p>
                </div>
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <div className="font-bold uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>SEAT 02 // CTO MANDATE</div>
                  <p style={{ color: 'var(--text-muted)' }}>Audits latency bounds, token consumption costs, model fine-tuning moat, and architecture resilience.</p>
                </div>
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-app)' }}>
                  <div className="font-bold uppercase text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>SEAT 03 // CFO MANDATE</div>
                  <p style={{ color: 'var(--text-muted)' }}>Analyzes unit economics, customer acquisition payback horizons, cash burn velocity, and gross margin integrity.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
