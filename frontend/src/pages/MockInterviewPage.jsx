import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  Award,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Code2,
  FileText,
  Terminal,
  ChevronRight,
  Download,
  RefreshCw,
  Send,
  Building,
  ArrowRight,
  Layers,
  RotateCcw,
  Printer,
  X,
  Radio,
  Shuffle,
  ChevronDown,
  Maximize2,
  ShieldAlert,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { interviewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CodeBlock = ({ code, language = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-2 rounded-2xl bg-navy-950 border border-navy-800 overflow-hidden shadow-soft-sm font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-navy-900 border-b border-navy-800 text-[10px] text-navy-400 font-bold uppercase tracking-wider">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-navy-100 overflow-x-auto leading-relaxed select-text font-mono text-[11px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const renderInlineFormatting = (text, isUser = false) => {
  if (!text) return '';
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, tIdx) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={tIdx}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold ${
            isUser ? 'bg-white/20 text-white' : 'bg-navy-200/60 text-brand-purple-dark'
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={tIdx} className={isUser ? 'font-bold text-white' : 'font-bold text-navy-900'}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    return token;
  });
};

const renderMessageContent = (content, isUser = false) => {
  if (!content) return null;

  let normalized = content;
  const backtickCount = (normalized.match(/```/g) || []).length;
  if (backtickCount % 2 !== 0) {
    normalized += '\n```';
  }

  const parts = normalized.split(/(```[\s\S]*?```)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('```')) {
      const match = part.match(/^```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```$/);
      const lang = match ? match[1] : '';
      const code = match ? match[2] : part.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, '');
      return <CodeBlock key={idx} code={code.trim()} language={lang} />;
    }

    const lines = part.split('\n');
    return (
      <div key={idx} className="space-y-1.5">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lIdx} className="h-0.5" />;

          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={lIdx} className={`font-bold text-xs mt-1.5 ${isUser ? 'text-white' : 'text-navy-900'}`}>
                {renderInlineFormatting(trimmed.slice(5), isUser)}
              </h5>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={lIdx} className={`font-bold text-xs mt-2 pb-0.5 border-b ${isUser ? 'text-white border-white/20' : 'text-navy-900 border-navy-200/50'}`}>
                {renderInlineFormatting(trimmed.slice(4), isUser)}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={lIdx} className={`font-extrabold text-sm mt-2.5 ${isUser ? 'text-white' : 'text-navy-900'}`}>
                {renderInlineFormatting(trimmed.slice(3), isUser)}
              </h3>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <div key={lIdx} className={`border-l-4 pl-3 py-1 my-1 rounded-r-xl text-xs italic ${isUser ? 'border-brand-purple bg-white/10 text-white' : 'border-brand-purple/70 bg-brand-purple/5 text-navy-800'}`}>
                {renderInlineFormatting(trimmed.slice(2), isUser)}
              </div>
            );
          }
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs">
                <span className={`font-bold ${isUser ? 'text-brand-purple-light' : 'text-brand-purple'}`}>•</span>
                <span>{renderInlineFormatting(trimmed.slice(2), isUser)}</span>
              </div>
            );
          }
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs">
                <span className={`font-bold font-mono ${isUser ? 'text-brand-purple-light' : 'text-brand-purple'}`}>{numMatch[1]}.</span>
                <span>{renderInlineFormatting(numMatch[2], isUser)}</span>
              </div>
            );
          }

          return (
            <p key={lIdx} className="text-xs leading-relaxed">
              {renderInlineFormatting(line, isUser)}
            </p>
          );
        })}
      </div>
    );
  });
};

const cleanTextForSpeech = (text) => {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, 'Code block omitted from voice.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*#_>`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\\le\b/g, 'less than or equal to')
    .replace(/\\ge\b/g, 'greater than or equal to')
    .replace(/\\ne\b/g, 'not equal to')
    .replace(/\\approx\b/g, 'approximately')
    .replace(/\\log\b/g, 'log')
    .replace(/\\times\b/g, 'times')
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

export const MockInterviewPage = ({ onNavigate, onInterviewActiveChange }) => {
  const { user, addXp } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeRightTab, setActiveRightTab] = useState('code'); // 'code' | 'notes'
  const [scratchpadNotes, setScratchpadNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins (in seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [suggestedPrompt, setSuggestedPrompt] = useState('Could you clarify the input constraints and if the array can be empty?');
  const [scorecard, setScorecard] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [allProblems, setAllProblems] = useState([]);
  const [showProblemPicker, setShowProblemPicker] = useState(false);
  const [problemFilterCompany, setProblemFilterCompany] = useState('all');

  useEffect(() => {
    interviewApi.getProblems()
      .then(res => {
        if (res?.problems) setAllProblems(res.problems);
      })
      .catch(err => console.warn('Could not load problems:', err));
  }, []);

  // Notify parent App to hide Navbar & Footer during active proctored interview
  useEffect(() => {
    const isActive = Boolean(session);
    onInterviewActiveChange?.(isActive);
  }, [session, onInterviewActiveChange]);

  // Only exit fullscreen when user navigates away from MockInterviewPage completely
  useEffect(() => {
    return () => {
      onInterviewActiveChange?.(false);
      exitFullscreen();
    };
  }, []);

  // Safe Exam / Proctored Browser Mode (Always Mandatory)
  const proctorMode = true;
  const [showStartDisclaimer, setShowStartDisclaimer] = useState(false);
  const [showZeroAttemptDisclaimer, setShowZeroAttemptDisclaimer] = useState(false);
  const [pendingStartConfig, setPendingStartConfig] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showProctorAlert, setShowProctorAlert] = useState(false);
  const [proctorAlertMsg, setProctorAlertMsg] = useState('');
  const lastSwitchTimeRef = useRef(0);
  const tabSwitchCountRef = useRef(0);
  tabSwitchCountRef.current = tabSwitchCount;
  const proctorGracePeriodRef = useRef(0);

  // Safe Exam Browser: Enter Fullscreen (synchronous trigger for browser security compatibility)
  const enterFullscreen = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.warn('Fullscreen request denied by browser:', err);
        });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn('Fullscreen request error:', err);
    }
  };

  // Safe Exam Browser: Exit Fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
      setIsFullscreen(false);
    } catch (err) {}
  };

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const keepAliveRef = useRef(null);
  const interimTranscriptRef = useRef('');
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const codeRef = useRef(code);
  codeRef.current = code;

  const companies = [
    { id: 'google', name: 'Google', focus: 'Heavy Algorithms & Sliding Window', badge: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { id: 'amazon', name: 'Amazon', focus: 'Two Pointers & Scalability', badge: 'bg-amber-500/10 text-amber-700 border-amber-200' },
    { id: 'meta', name: 'Meta', focus: 'Prefix Sum, Maps & Edge Cases', badge: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
    { id: 'general', name: 'FAANG Standard', focus: 'Modified Binary Search', badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' }
  ];

  // Stop active speech synthesis
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window._learnloop_interview_utterance = null;
    }
    utteranceRef.current = null;
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    setSpeakingIndex(null);
  };

  // Synchronous Speech Output
  const speakInterviewerMessage = (text, idx = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopSpeaking();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.volume = 1.0;

    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural') || v.default)) ||
                               voices.find(v => v.lang.startsWith('en')) ||
                               voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
      }
    } catch (e) {}

    utterance.onend = () => {
      if (typeof window !== 'undefined') window._learnloop_interview_utterance = null;
      utteranceRef.current = null;
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      setSpeakingIndex(null);
    };

    utterance.onerror = (e) => {
      if (typeof window !== 'undefined') window._learnloop_interview_utterance = null;
      utteranceRef.current = null;
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      setSpeakingIndex(null);
    };

    if (typeof window !== 'undefined') window._learnloop_interview_utterance = utterance;
    utteranceRef.current = utterance;
    setSpeakingIndex(idx !== null ? idx : 9999);

    keepAliveRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();
  };

  const toggleSpeak = (text, idx) => {
    if (speakingIndex === idx) {
      stopSpeaking();
      return;
    }
    speakInterviewerMessage(text, idx);
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    if (speakingIndex !== null || ('speechSynthesis' in window && window.speechSynthesis.speaking)) {
      stopSpeaking();
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.resume(); } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Live speech recognition requires Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      recognitionRef.current = null;
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) finalStr += res[0].transcript;
          else interimStr += res[0].transcript;
        }

        if (interimStr) {
          interimTranscriptRef.current = interimStr;
          setInterimTranscript(interimStr);
        }

        if (finalStr && finalStr.trim()) {
          const clean = finalStr.trim();
          interimTranscriptRef.current = '';
          setInterimTranscript('');
          setInputMessage(clean);
          setIsListening(false);
          try { recognition.abort(); } catch (e) {}
          recognitionRef.current = null;
          handleSendMessage(clean, true);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        try { recognition.abort(); } catch (e) {}
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        if (interimTranscriptRef.current && interimTranscriptRef.current.trim()) {
          const salvage = interimTranscriptRef.current.trim();
          interimTranscriptRef.current = '';
          setInterimTranscript('');
          setInputMessage(salvage);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Keyboard shortcut: Esc to stop audio immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') stopSpeaking();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keep a ref to handleEndInterview so the timer closure never goes stale
  const handleEndInterviewRef = useRef(null);

  // 15-Minute Countdown Timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    // Guard: only auto-end if a session is actually active
    if (!sessionRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          // Use ref to avoid stale closure (force=true on timer expiry)
          if (handleEndInterviewRef.current) handleEndInterviewRef.current(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Safe Exam Browser: Tab Switch & Focus Loss Detection
  useEffect(() => {
    if (!session || !isTimerRunning || !proctorMode) return;

    const handleFocusLoss = (source) => {
      const now = Date.now();
      // Ignore all events during the initial 5-second launch grace period or within 2-second debounce
      if (now < proctorGracePeriodRef.current) return;
      if (now - lastSwitchTimeRef.current < 2000) return;
      lastSwitchTimeRef.current = now;

      setTabSwitchCount(prev => {
        const next = prev + 1;
        setProctorAlertMsg(
          next >= 3
            ? `PROCTOR VIOLATION (${next} Tab Switches): Multiple unauthorized focus changes detected. Your screen has been flagged for hiring committee review!`
            : `TAB SWITCH DETECTED (Warning ${next}/3): Navigating away or switching tabs is strictly monitored during FAANG technical screens. Please remain on this screen!`
        );
        setShowProctorAlert(true);
        return next;
      });
    };

    // Use visibilitychange to detect actual tab switching or minimizing (avoids false window blur events during fullscreen shifts)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLoss('visibility');
      }
    };

    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFs);
      const now = Date.now();
      // Only warn if user deliberately exited fullscreen outside the initial launch grace period
      if (!isFs && isTimerRunning && now >= proctorGracePeriodRef.current) {
        if (now - lastSwitchTimeRef.current > 2500) {
          lastSwitchTimeRef.current = now;
          setProctorAlertMsg('FULLSCREEN EXITED: Safe Exam Mode requires fullscreen for authentic FAANG interview simulation. Please re-enter fullscreen.');
          setShowProctorAlert(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, [session, isTimerRunning, proctorMode]);

  // Request interview launch (opens Safe Exam disclaimer)
  const requestStartInterview = (companyId = selectedCompany, questionId = null) => {
    setPendingStartConfig({ companyId, questionId });
    setShowStartDisclaimer(true);
    setShowProblemPicker(false);
  };

  // User confirmed Safe Exam disclaimer -> enter fullscreen & start session
  const confirmAndLaunchExam = () => {
    // 1. Trigger fullscreen immediately from direct user click stack
    enterFullscreen();

    setShowStartDisclaimer(false);
    // 5-second launch grace period so fullscreen transition never triggers false alert
    proctorGracePeriodRef.current = Date.now() + 5000;
    setTabSwitchCount(0);
    setShowProctorAlert(false);

    const config = pendingStartConfig || { companyId: selectedCompany, questionId: null };
    handleStartInterview(config.companyId, config.questionId);
  };

  // Start new interview session
  const handleStartInterview = async (companyId = selectedCompany, questionId = null) => {
    stopSpeaking();
    setLoading(true);
    setScorecard(null);
    setShowProblemPicker(false);
    proctorGracePeriodRef.current = Date.now() + 5000;
    setTabSwitchCount(0);
    setShowProctorAlert(false);
    try {
      const payload = { company: companyId };
      if (questionId) payload.questionId = questionId;
      if (session?.question?.id) payload.lastQuestionId = session.question.id;

      const res = await interviewApi.start(payload);
      setSession(res);
      setProblemFilterCompany(companyId);
      setCurrentStageIndex(0);
      setTimeLeft(res.timeLimitSeconds || 900);
      setIsTimerRunning(true);
      setTabSwitchCount(0);
      setShowProctorAlert(false);
      proctorGracePeriodRef.current = Date.now() + 5000;

      if (proctorMode && !document.fullscreenElement && !document.webkitFullscreenElement) {
        enterFullscreen();
      }

      const starter = res.question?.starterCode?.[selectedLanguage] || res.question?.starterCode?.python || '';
      setCode(starter);

      const initialMsgs = [
        {
          role: 'interviewer',
          content: res.initialInterviewerMessage,
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initialMsgs);

      // Auto-speak initial interviewer greeting
      setTimeout(() => {
        speakInterviewerMessage(res.initialInterviewerMessage, 0);
      }, 200);
    } catch (err) {
      console.error('Failed to start mock interview:', err);
      alert('Could not start interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send message to interviewer
  const handleSendMessage = async (textToSend = null, autoSpeak = false) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !session || loading) return;

    const userMsg = {
      role: 'candidate',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setInterimTranscript('');
    setLoading(true);

    try {
      const currentStageId = session.stages?.[currentStageIndex]?.id || 'clarification';
      const res = await interviewApi.sendMessage({
        interviewId: session.interviewId,
        message: text,
        currentCode: codeRef.current,
        stageId: currentStageId,
        language: selectedLanguage
      });

      const interviewerMsg = {
        role: 'interviewer',
        content: res.reply,
        timestamp: new Date().toISOString()
      };

      const targetIdx = messages.length + 1;
      setMessages(prev => [...prev, interviewerMsg]);

      if (res.stageIndex !== undefined) {
        setCurrentStageIndex(res.stageIndex);
      }
      if (res.suggestedPrompt) {
        setSuggestedPrompt(res.suggestedPrompt);
      }

      // Auto-speak reply if candidate spoke via mic or voice was active
      if (autoSpeak) {
        setTimeout(() => {
          speakInterviewerMessage(res.reply, targetIdx);
        }, 80);
      }
    } catch (err) {
      console.error('Interview response error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Request dedicated code review on current editor snippet
  const handleAskForCodeReview = () => {
    if (loading || !session) return;
    const prompt = "Could you please review my solution code in the editor? Check my logic, boundary conditions, and tell me if my approach is optimal.";
    handleSendMessage(prompt, false);
  };

  // Check if candidate has participated in the interview or written custom code
  const checkIfAttempted = () => {
    const candidateMsgs = messages.filter(m => m.role === 'candidate');
    const currentCodeStr = codeRef.current || '';
    const starterCodes = sessionRef.current?.question?.starterCode || {};
    const normalize = (s) => (s || '').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/#.*/g, '').replace(/\s+/g, '');
    const cleanCurrent = normalize(currentCodeStr);
    const isStarter = !currentCodeStr.trim() || Object.values(starterCodes).some(sc => normalize(sc) === cleanCurrent);
    const hasCode = !isStarter && currentCodeStr.trim().length > 30;
    return candidateMsgs.length > 0 || hasCode;
  };

  // Perform interview evaluation and generate scorecard
  const executeEndInterview = async () => {
    setShowZeroAttemptDisclaimer(false);
    stopSpeaking();
    setIsTimerRunning(false);
    setEvaluating(true);

    try {
      const timeSpent = Math.max(10, (sessionRef.current?.timeLimitSeconds || 900) - timeLeft);
      const res = await interviewApi.evaluate({
        interviewId: sessionRef.current?.interviewId,
        questionId: sessionRef.current?.question?.id,
        finalCode: codeRef.current,
        messages: messages,
        language: selectedLanguage,
        timeSpentSeconds: timeSpent,
        tabSwitchCount: tabSwitchCountRef.current
      });
      setScorecard(res);
      if (res.awardedXp && res.awardedXp > 0) {
        addXp?.(res.awardedXp, `Mock Screen: ${res.questionTitle || 'Technical Interview'}`);
      }
      setSession(null);
      onInterviewActiveChange?.(false);
      exitFullscreen();
    } catch (err) {
      console.error('Failed to evaluate interview:', err);
      alert(`Failed to generate scorecard: ${err?.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setEvaluating(false);
    }
  };

  // End interview: triggers disclaimer if unattempted, or evaluates immediately if attempted/forced
  const handleEndInterview = async (force = false) => {
    stopSpeaking();

    // If candidate has not attempted anything and this is not a forced countdown expiry, show disclaimer modal
    if (!force) {
      const hasAttempted = checkIfAttempted();
      if (!hasAttempted) {
        setShowZeroAttemptDisclaimer(true);
        return;
      }
    }

    await executeEndInterview();
  };
  // Keep ref updated so the timer closure always uses latest version
  handleEndInterviewRef.current = handleEndInterview;

  // Switch programming language
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (session?.question?.starterCode?.[lang]) {
      setCode(session.question.starterCode[lang]);
    }
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* Top Header & Session Controls */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>FAANG Live Simulation</span>
            </span>
            <span className="text-xs text-navy-400 font-medium">15-Minute Technical Screen</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 mt-1 flex items-center gap-2">
            <span>Senior Technical Mock Interview</span>
          </h1>
          <p className="text-xs text-navy-500">
            Real-time Socratic interviewer with live voice dialogue, interactive code editor, and instant candidate evaluation scorecard.
          </p>
        </div>

        {/* Company Flavor Selector & Start/Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-navy-50 rounded-2xl border border-navy-200/80">
            {companies.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCompany(c.id);
                  if (session) {
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                      enterFullscreen();
                    }
                    handleStartInterview(c.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCompany === c.id
                    ? 'bg-brand-purple text-white shadow-soft-xs'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-navy-200/60'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Permanent Safe Exam Mode Status Indicator */}
          <div
            className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-300 flex items-center gap-1.5 shadow-soft-xs"
            title="Safe Exam Mode: Automatic fullscreen and tab-switch monitoring is mandatory for this screen"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe Exam: ACTIVE</span>
          </div>

          {!session ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => requestStartInterview()}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white font-bold text-xs shadow-soft-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{loading ? 'Initializing...' : 'Start Mock Interview'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                    enterFullscreen();
                  }
                  handleStartInterview(session?.question?.company || selectedCompany);
                }}
                disabled={loading}
                title={`Shuffle to another ${companies.find(c => c.id === (session?.question?.company || selectedCompany))?.name || 'FAANG'} question`}
                className="px-3 py-2 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-brand-purple" />
                <span>Shuffle Problem</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProblemPicker(prev => !prev)}
                  className="px-3 py-2 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>
                    {companies.find(c => c.id === (session?.question?.company || selectedCompany))?.name || 'Company'} Problems ({allProblems.filter(p => p.company === (session?.question?.company || selectedCompany)).length || 8})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>
                {showProblemPicker && (
                  <div className="absolute right-0 mt-2 w-96 max-h-[28rem] overflow-y-auto bg-white rounded-2xl border border-navy-200 shadow-soft-2xl z-40 p-3 space-y-2.5">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-navy-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple block">
                          {companies.find(c => c.id === (session?.question?.company || selectedCompany))?.name} Interview Loop
                        </span>
                        <h4 className="text-xs font-bold text-navy-900">
                          {companies.find(c => c.id === (session?.question?.company || selectedCompany))?.name} Signature Problems ({allProblems.filter(p => p.company === (session?.question?.company || selectedCompany)).length || 8})
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowProblemPicker(false)}
                        className="text-navy-400 hover:text-navy-700 text-xs font-bold p-1 rounded-lg hover:bg-navy-100"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {allProblems
                        .filter(p => p.company === (session?.question?.company || selectedCompany))
                        .map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                                enterFullscreen();
                              }
                              setShowProblemPicker(false);
                              handleStartInterview(p.company, p.id);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 border ${
                              session?.question?.id === p.id
                                ? 'bg-brand-purple/10 border-brand-purple/40 text-brand-purple font-bold shadow-soft-xs'
                                : 'border-transparent hover:bg-navy-50 text-navy-800'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-navy-900 truncate">{p.title}</div>
                              <div className="text-[10px] text-navy-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-semibold text-brand-purple">{p.companyName}</span>
                                <span>•</span>
                                <span className="text-navy-400 truncate">{p.topic}</span>
                              </div>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${
                              p.difficulty === 'Hard'
                                ? 'bg-rose-100 text-rose-700'
                                : p.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {p.difficulty}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartInterview()}
                title="Restart Session with a new problem"
                className="p-2.5 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-600 hover:text-navy-900 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const confirmExit = window.confirm(
                    "Exit Safe Exam Screen?\n\nYour session will close, fullscreen will exit, and top navigation will be restored."
                  );
                  if (confirmExit) {
                    stopSpeaking();
                    setIsTimerRunning(false);
                    setSession(null);
                    onInterviewActiveChange?.(false);
                    exitFullscreen();
                  }
                }}
                title="Exit Screen & Restore Navigation"
                className="px-3 py-2.5 rounded-xl border border-navy-200 hover:bg-navy-100 text-navy-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-navy-500" />
                <span className="hidden sm:inline">Exit Screen</span>
              </button>
              <button
                onClick={() => handleEndInterview(false)}
                disabled={evaluating}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-soft-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{evaluating ? 'Generating Scorecard...' : 'End & Generate Scorecard'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {session && (
        <>
          {/* Active Interview Progress Bar & Timer */}
          <div className="px-5 py-3 bg-navy-950 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-soft-sm text-xs">
            {/* 4-Stage Progress Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {session.stages?.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      isCurrent
                        ? 'bg-brand-purple text-white border-brand-purple ring-2 ring-brand-purple/30'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-navy-900/60 text-navy-400 border-navy-800'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>{stage.label.split('. ')[1] || stage.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Timer & Focus Topic */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-navy-300 text-[11px]">
                <Building className="w-3.5 h-3.5 text-brand-purple-light" />
                <span>{session.question?.companyName}</span>
                <span className="text-navy-600">|</span>
                <span className="text-white font-semibold">{session.question?.title}</span>
              </div>

              {/* Safe Exam Proctor Badge */}
              {proctorMode && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                  tabSwitchCount === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : tabSwitchCount < 3
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-rose-500/30 text-rose-300 border-rose-500/50 animate-pulse'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Tab Focus: {tabSwitchCount === 0 ? 'Locked' : `${tabSwitchCount}/3 Warning(s)`}</span>
                </div>
              )}

              {/* Countdown Clock */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                timeLeft < 180
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-navy-900 text-brand-purple-light border-navy-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Main Split-Screen: Left Interviewer Chat | Right Code & Scratchpad */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
            
            {/* Left Column: Senior Interviewer Dialogue Stream (Spans 5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col overflow-hidden h-[660px]">
              
              {/* Interviewer Status Bar */}
              <div className="px-5 py-3.5 bg-navy-50/70 border-b border-navy-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white flex items-center justify-center shadow-soft-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-navy-900">Senior Staff Interviewer</h3>
                    <p className="text-[10px] text-navy-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{session.question?.companyName} Interview Loop</span>
                    </p>
                  </div>
                </div>

                {/* Quick Stop Audio if speaking */}
                {speakingIndex !== null && (
                  <button
                    onClick={stopSpeaking}
                    className="px-2.5 py-1 text-[11px] bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold border border-rose-200 flex items-center gap-1 transition-all"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Stop Voice</span>
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'candidate';
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`p-3.5 rounded-2xl max-w-sm sm:max-w-md text-xs leading-relaxed space-y-2 relative ${
                        isUser
                          ? 'bg-navy-900 text-white rounded-tr-none'
                          : 'bg-navy-50/80 border border-navy-200/70 text-navy-900 rounded-tl-none'
                      }`}>
                        {!isUser && (
                          <div className="flex items-center justify-between pb-1 border-b border-navy-200/40 text-[10px] text-navy-500">
                            <span className="font-bold text-brand-purple">Interviewer</span>
                            <button
                              type="button"
                              onClick={() => toggleSpeak(msg.content, idx)}
                              className="p-1 hover:bg-navy-200/50 rounded flex items-center gap-1 text-[10px] text-navy-400 hover:text-brand-purple transition-colors cursor-pointer"
                            >
                              {speakingIndex === idx ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-brand-rose animate-pulse" />
                                  <span className="text-brand-rose font-bold">Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {renderMessageContent(msg.content, isUser)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2 p-3 bg-navy-50 rounded-2xl rounded-tl-none border border-navy-200/60 text-xs text-navy-500 w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-spin" />
                    <span className="text-[11px]">Senior Interviewer analyzing code & response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Talking Points & Code Review Action */}
              <div className="px-4 py-2 bg-navy-50/50 border-t border-navy-200/60 flex items-center gap-2 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={handleAskForCodeReview}
                  disabled={loading}
                  title="Ask interviewer to read and review your editor code"
                  className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-brand-purple" />
                  <span>Review Editor Code</span>
                </button>

                {suggestedPrompt && (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 shrink-0">
                      Suggested:
                    </span>
                    <button
                      onClick={() => handleSendMessage(suggestedPrompt, false)}
                      className="px-2.5 py-0.5 rounded-full bg-white hover:bg-navy-100 text-navy-700 text-[11px] border border-navy-200 font-medium transition-all truncate max-w-xs shadow-soft-xs"
                    >
                      "{suggestedPrompt}"
                    </button>
                  </>
                )}
              </div>

              {/* Interview Input Bar with Voice Mode */}
              <div className="p-3.5 bg-white border-t border-navy-200/80 space-y-2">
                {/* Listening Status Indicator */}
                {isListening && (
                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span>Listening to your thought process... Speak your response!</span>
                  </div>
                )}
                {voiceError && (
                  <div className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-[11px] flex items-center justify-between">
                    <span>{voiceError}</span>
                    <button onClick={() => setVoiceError(null)} className="font-bold">✕</button>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    title={isListening ? "Listening... Click to stop" : "Speak to Interviewer (Live Voice)"}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-pulse'
                        : 'bg-navy-50 text-navy-600 border-navy-200 hover:bg-brand-purple/10 hover:text-brand-purple'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={interimTranscript || inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isListening ? 'Listening to voice...' : 'Speak or type your reasoning to the interviewer...'}
                    disabled={loading}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple transition-all text-navy-900"
                  />

                  <button
                    type="submit"
                    disabled={(!inputMessage.trim() && !interimTranscript.trim()) || loading}
                    className="px-3.5 py-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Code Editor & Scratchpad (Spans 7 cols) */}
            <div className="lg:col-span-7 bg-navy-950 text-navy-100 rounded-3xl border border-navy-800 shadow-soft-sm flex flex-col overflow-hidden h-[660px]">
              
              {/* Editor Tabs & Language Switcher */}
              <div className="px-5 py-3 bg-navy-900 border-b border-navy-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRightTab('code')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeRightTab === 'code'
                        ? 'bg-brand-purple text-white shadow-soft-xs'
                        : 'text-navy-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Solution Code</span>
                  </button>
                  <button
                    onClick={() => setActiveRightTab('notes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeRightTab === 'notes'
                        ? 'bg-brand-purple text-white shadow-soft-xs'
                        : 'text-navy-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Interview Scratchpad</span>
                  </button>
                </div>

                {/* Right controls: Review My Code button + Language Select */}
                <div className="flex items-center gap-2 text-xs">
                  {activeRightTab === 'code' && (
                    <button
                      type="button"
                      onClick={handleAskForCodeReview}
                      disabled={loading}
                      title="Ask interviewer to read and review your editor code"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white shadow-soft-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Review My Code</span>
                      <span className="sm:hidden">Review</span>
                    </button>
                  )}

                  {activeRightTab === 'code' && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] uppercase font-mono text-navy-500 font-bold">Lang:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-navy-950 border border-navy-700 text-white text-xs font-mono py-1 px-2.5 rounded-lg focus:outline-none focus:border-brand-purple cursor-pointer"
                      >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (ES6)</option>
                        <option value="cpp">C++ 20</option>
                        <option value="java">Java 17</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Editor Body */}
              {activeRightTab === 'code' ? (
                <div className="flex-1 flex flex-col p-4 font-mono text-xs overflow-hidden">
                  <div className="flex-1 relative rounded-2xl bg-navy-950 border border-navy-800/80 overflow-hidden flex">
                    {/* Line numbers dummy sidebar */}
                    <div className="w-10 py-3.5 bg-navy-900/60 text-navy-600 select-none text-right pr-2.5 text-[11px] leading-relaxed hidden sm:block border-r border-navy-800">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Raw Textarea Editor */}
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="# Write your solution implementation here..."
                      spellCheck="false"
                      className="flex-1 p-3.5 bg-transparent text-navy-100 font-mono text-xs leading-relaxed resize-none focus:outline-none w-full h-full"
                    />
                  </div>

                  {/* Problem Constraints Banner */}
                  <div className="mt-3 p-3 bg-navy-900/70 border border-navy-800 rounded-xl text-[11px] text-navy-300 flex items-center justify-between">
                    <div>
                      <strong className="text-white">Target Time Complexity:</strong> {session.question?.expectedComplexity?.time}
                    </div>
                    <div className="text-navy-400">
                      Expected Space: {session.question?.expectedComplexity?.space}
                    </div>
                  </div>
                </div>
              ) : (
                /* Scratchpad Notes Body */
                <div className="flex-1 p-4 flex flex-col">
                  <textarea
                    value={scratchpadNotes}
                    onChange={(e) => setScratchpadNotes(e.target.value)}
                    placeholder="Interview Scratchpad:
- Edge cases to remember: empty input, all duplicates...
- Brute force approach: O(n^2) nested scan...
- Optimal approach: Two pointers moving inward based on height...
- Complexity: O(n) time, O(1) space..."
                    className="flex-1 p-4 bg-navy-900/60 border border-navy-800 rounded-2xl text-xs font-mono text-navy-100 resize-none focus:outline-none focus:border-brand-purple leading-relaxed"
                  />
                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* When no interview is active, show the FAANG Intro Hero */}
      {!session && (
        <div className="p-8 sm:p-12 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white flex items-center justify-center mx-auto shadow-soft-lg">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Ready for your 15-Minute Technical Screen?
            </h2>
            <p className="text-sm text-navy-600 leading-relaxed max-w-xl mx-auto">
              Simulate high-pressure technical interviews at <strong>Google, Amazon, and Meta</strong>. The AI interviewer tests your verbal reasoning, challenges edge cases, monitors your coding pace, and grades you on authentic hiring rubrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 space-y-1">
              <span className="text-brand-purple font-bold text-xs uppercase tracking-wider block">Stage 1 & 2</span>
              <h4 className="font-extrabold text-xs text-navy-900">Clarification & Approach</h4>
              <p className="text-[11px] text-navy-500">Ask about bounds and verbally explore algorithmic trade-offs before coding.</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 space-y-1">
              <span className="text-brand-purple font-bold text-xs uppercase tracking-wider block">Stage 3</span>
              <h4 className="font-extrabold text-xs text-navy-900">Live Code Implementation</h4>
              <p className="text-[11px] text-navy-500">Write clean, production-grade solutions in the integrated code playground.</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 space-y-1">
              <span className="text-brand-purple font-bold text-xs uppercase tracking-wider block">Stage 4</span>
              <h4 className="font-extrabold text-xs text-navy-900">Evaluation Scorecard</h4>
              <p className="text-[11px] text-navy-500">Receive a FAANG evaluation report with a Hire/No Hire verdict and rubric metrics.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => requestStartInterview()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white font-extrabold text-sm shadow-soft-lg flex items-center gap-2.5 mx-auto transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch 15-Minute Technical Screen</span>
            </button>
          </div>
        </div>
      )}

      {/* Safe Exam & Automatic Fullscreen Disclaimer Modal */}
      <AnimatePresence>
        {showStartDisclaimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-navy-200 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-navy-200/60 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400 block">
                    FAANG Technical Screen Protocol
                  </span>
                  <h3 className="text-lg font-black text-navy-900">
                    Safe Exam Mode & Fullscreen Notice
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 space-y-2.5 text-xs text-navy-700">
                <p className="font-semibold text-navy-900">
                  You are about to enter a simulated 15-minute technical screen for{' '}
                  <strong className="text-brand-purple">
                    {companies.find(c => c.id === (pendingStartConfig?.companyId || selectedCompany))?.name || 'FAANG Standard'}
                  </strong>.
                </p>
                
                <div className="space-y-2 pt-1 text-[11px] text-navy-600">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-navy-200/60">
                    <Maximize2 className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-navy-900">Automatic Fullscreen:</strong> Your browser will instantly transition into full-screen mode to lock in focus and replicate real FAANG coding environments.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-navy-200/60">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-navy-900">Tab Focus Tracking:</strong> Navigating away or switching tabs is strictly monitored (max 3 warnings) and recorded on your evaluation scorecard.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-navy-200/60">
                    <Radio className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                    <span>
                      <strong className="text-navy-900">Live Socratic Dialogue:</strong> Verbal reasoning and code quality are graded by AI on authentic FAANG hiring committee rubrics.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowStartDisclaimer(false)}
                  className="w-1/3 py-3 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAndLaunchExam}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white font-extrabold text-xs shadow-soft-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Enter Exam & Shift to Fullscreen</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Safe Exam Proctor Warning Alert Modal */}
      <AnimatePresence>
        {showProctorAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-navy-900">
                  {tabSwitchCount >= 3 ? 'Safe Exam Violation Flagged' : 'Focus Loss / Tab Switch Detected'}
                </h3>
                <p className="text-xs text-navy-600 leading-relaxed">
                  {proctorAlertMsg}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
                Total Tab Switches: <strong>{tabSwitchCount}</strong> / 3 max allowed
              </div>
              <button
                onClick={() => {
                  setShowProctorAlert(false);
                  if (proctorMode && !isFullscreen) enterFullscreen();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-soft-md transition-all cursor-pointer"
              >
                Return to Screen {proctorMode && !isFullscreen ? '& Re-enter Fullscreen' : ''}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unattempted Assessment 0% Score Warning Disclaimer Modal */}
      <AnimatePresence>
        {showZeroAttemptDisclaimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-300 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-navy-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                    <ShieldAlert className="w-6 h-6 text-amber-600 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Incomplete Assessment Warning
                    </span>
                    <h3 className="text-lg font-black text-navy-900">
                      You Haven't Attempted Anything
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowZeroAttemptDisclaimer(false)}
                  className="p-1.5 rounded-xl hover:bg-navy-100 text-navy-400 hover:text-navy-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning Notice Box */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Important: You will get a score of 0% if you end now</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  You have not written any code or sent any responses to the interviewer. Ending this technical screen now will finalize your evaluation as <strong className="font-bold underline">NO ATTEMPT (0%)</strong> with <strong>+0 XP</strong>.
                </p>
              </div>

              {/* Suggestions / Guidance */}
              <div className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 text-xs text-navy-700 space-y-2">
                <span className="font-bold text-navy-900 block text-[11px] uppercase tracking-wider text-navy-400">
                  Recommended Before Ending:
                </span>
                <div className="space-y-1.5 text-[11px] text-navy-600">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-purple font-bold">1.</span>
                    <span>Ask 1–2 clarifying questions to the interviewer about bounds or edge cases.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-purple font-bold">2.</span>
                    <span>State your proposed algorithmic approach and Big-O time complexity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-purple font-bold">3.</span>
                    <span>Type your solution or algorithm logic in the code editor.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowZeroAttemptDisclaimer(false)}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white font-extrabold text-xs shadow-soft-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Return & Attempt Problem</span>
                </button>
                <button
                  type="button"
                  onClick={executeEndInterview}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>End Anyway & Receive 0%</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official FAANG Candidate Evaluation Scorecard Modal */}
      <AnimatePresence>
        {scorecard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-navy-200 shadow-soft-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Scorecard Modal Header */}
              <div className="flex items-start justify-between border-b border-navy-200/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">
                      Official FAANG Technical Screen Evaluation
                    </span>
                    <h2 className="text-xl font-extrabold text-navy-900">
                      Candidate Performance Scorecard
                    </h2>
                    <p className="text-xs text-navy-500">
                      {scorecard.company} · {scorecard.questionTitle} · {scorecard.difficulty}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setScorecard(null)}
                  className="p-1.5 rounded-xl hover:bg-navy-100 text-navy-400 hover:text-navy-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hire Verdict Highlight Banner */}
              <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                scorecard.verdictClass === 'emerald'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
                  : scorecard.verdictClass === 'blue'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-950'
                  : scorecard.verdictClass === 'amber'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-950'
              }`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy-500 block mb-1">
                    Hiring Committee Final Recommendation
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-base font-extrabold uppercase tracking-wider text-white shadow-soft-sm ${
                      scorecard.verdictClass === 'emerald'
                        ? 'bg-emerald-600'
                        : scorecard.verdictClass === 'blue'
                        ? 'bg-blue-600'
                        : scorecard.verdictClass === 'amber'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}>
                      {scorecard.verdict}
                    </span>
                    <span className="text-2xl font-black text-navy-900">
                      {scorecard.overallPercentage}%
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-navy-600 sm:text-right font-medium">
                  <div>Interview Duration: <strong>{scorecard.timeSpentFormatted}</strong></div>
                  <div>XP Earned: <strong className="text-brand-purple">+{scorecard.awardedXp} XP</strong></div>
                </div>
              </div>

              {/* Safe Exam Proctor Integrity Banner */}
              {scorecard.integrity && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  scorecard.integrity.color === 'emerald'
                    ? 'bg-emerald-500/5 border-emerald-300/60 text-emerald-950'
                    : scorecard.integrity.color === 'amber'
                    ? 'bg-amber-500/5 border-amber-300/60 text-amber-950'
                    : 'bg-rose-500/5 border-rose-300/60 text-rose-950'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      scorecard.integrity.color === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-600'
                        : scorecard.integrity.color === 'amber'
                        ? 'bg-amber-500/20 text-amber-600'
                        : 'bg-rose-500/20 text-rose-600'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[12px]">{scorecard.integrity.label}</div>
                      <div className="text-[11px] text-navy-500">{scorecard.integrity.notes}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    scorecard.integrity.color === 'emerald'
                      ? 'bg-emerald-600 text-white'
                      : scorecard.integrity.color === 'amber'
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {scorecard.integrity.status}
                  </span>
                </div>
              )}

              {/* 4-Pillar Rubric Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  Core Evaluation Rubric (Out of 5.0)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {scorecard.rubric?.map((item, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-2xl bg-navy-50/80 border border-navy-200/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-navy-900">
                        <span>{item.pillar}</span>
                        <span className="font-mono text-brand-purple">{item.score.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-navy-200/70 overflow-hidden">
                        <div
                          className="h-full bg-brand-purple rounded-full transition-all duration-500"
                          style={{ width: `${(item.score / 5.0) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-navy-500 leading-normal">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Strengths & Growth Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Key Strengths Observed</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-950 pl-4 list-disc text-[11px] leading-relaxed">
                    {scorecard.strengths?.map((s, sIdx) => (
                      <li key={sIdx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Targeted Growth Areas</span>
                  </h4>
                  <ul className="space-y-1.5 text-amber-950 pl-4 list-disc text-[11px] leading-relaxed">
                    {scorecard.growthAreas?.map((g, gIdx) => (
                      <li key={gIdx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Senior Engineer Qualitative Feedback */}
              <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 text-xs text-navy-800 space-y-1 leading-relaxed">
                <strong className="text-brand-purple font-bold block">Senior Staff Engineer Notes:</strong>
                <p className="text-[11px]">{scorecard.seniorEngineerNotes}</p>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-200/60">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save Scorecard</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScorecard(null);
                      setSession(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-600 hover:bg-navy-50 transition-colors"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScorecard(null);
                      onNavigate('adaptive', { topic: scorecard.recommendedTopic?.toLowerCase().replace(/\s+/g, '-') || 'recursion' });
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple-dark text-white shadow-soft-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice Recommended Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
