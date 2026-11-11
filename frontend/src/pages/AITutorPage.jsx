import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Trash2, 
  Cpu, 
  BookOpen, 
  Bot, 
  User, 
  HelpCircle,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  Volume2,
  VolumeX,
  Layers,
  BrainCircuit,
  Key,
  X
} from 'lucide-react';
import { tutorApi, topicsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

const renderInlineFormatting = (text) => {
  if (!text) return '';
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, tIdx) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={tIdx} className="px-1.5 py-0.5 rounded bg-navy-200/60 text-brand-purple-dark font-mono text-[11px] font-semibold">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={tIdx} className="font-bold text-navy-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return token;
  });
};

const renderMessageContent = (content) => {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      return (
        <pre key={idx} className="bg-navy-950 text-navy-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2 border border-navy-800">
          <code>{code}</code>
        </pre>
      );
    }

    const lines = part.split('\n');
    return (
      <div key={idx} className="space-y-1.5">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lIdx} className="h-1" />;

          if (trimmed.startsWith('#### ')) {
            return <h5 key={lIdx} className="font-bold text-xs text-navy-900 mt-2">{renderInlineFormatting(trimmed.slice(5))}</h5>;
          }
          if (trimmed.startsWith('### ')) {
            return <h4 key={lIdx} className="font-bold text-sm text-navy-900 mt-2.5 pb-0.5 border-b border-navy-200/50">{renderInlineFormatting(trimmed.slice(4))}</h4>;
          }
          if (trimmed.startsWith('## ')) {
            return <h3 key={lIdx} className="font-extrabold text-sm text-navy-900 mt-3">{renderInlineFormatting(trimmed.slice(3))}</h3>;
          }

          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs">
                <span className="text-brand-purple font-bold">•</span>
                <span>{renderInlineFormatting(trimmed.slice(2))}</span>
              </div>
            );
          }

          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs">
                <span className="text-brand-purple font-bold font-mono">{numMatch[1]}.</span>
                <span>{renderInlineFormatting(numMatch[2])}</span>
              </div>
            );
          }

          return <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  });
};

export const AITutorPage = ({ initialTopicContext = 'Recursion', onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [topicContext, setTopicContext] = useState(initialTopicContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    'Explain the fundamentals of Recursion',
    'Why is Recursion a prerequisite for Trees?',
    'Give me an adaptive practice question on Recursion'
  ]);
  const [tutorStatus, setTutorStatus] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  const messagesEndRef = useRef(null);

  const handleSaveConfig = async () => {
    setSavingKey(true);
    try {
      const res = await tutorApi.updateConfig({
        geminiApiKey: geminiKeyInput,
        groqApiKey: groqKeyInput
      });
      if (res.status) {
        setTutorStatus(res.status);
      }
      setShowKeyModal(false);
    } catch (err) {
      console.error('Failed to update tutor config:', err);
      alert('Failed to update API key configuration.');
    } finally {
      setSavingKey(false);
    }
  };

  const toggleSpeak = (text, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.').replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history & status on mount
  useEffect(() => {
    Promise.all([
      tutorApi.getHistory(),
      tutorApi.getStatus(),
      topicsApi.getTopics()
    ])
      .then(([historyRes, statusRes, topicsRes]) => {
        setMessages(historyRes.messages || []);
        if (initialTopicContext) {
          setTopicContext(initialTopicContext);
        } else if (historyRes.topicContext && historyRes.topicContext !== 'General DSA') {
          setTopicContext(historyRes.topicContext);
        }
        setTutorStatus(statusRes);
        setTopics(topicsRes.topics || []);
        setHistoryLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tutor data:', err);
        setHistoryLoading(false);
      });
  }, [initialTopicContext]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    // Optimistically add user message
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await tutorApi.sendMessage(text, topicContext);
      
      const assistantMsg = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
        isFallback: res.isFallback,
        provider: res.provider
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (res.suggestedPrompts && res.suggestedPrompts.length > 0) {
        setSuggestedPrompts(res.suggestedPrompts);
      }
      if (res.topicContext && res.topicContext !== topicContext) {
        setTopicContext(res.topicContext);
      }
    } catch (err) {
      console.error('Failed to get tutor response:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error retrieving my explanation. Please try again or switch topics.',
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Reset conversation history?')) return;
    try {
      await tutorApi.clearHistory();
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I am your LearnLoop AI tutor. I have your mastery profile loaded for **${topicContext}**. Ask me to break down concepts, diagnose mistakes, or guide you through practice problems!`,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  // Find active topic mastery
  const activeTopicObj = topics.find(t => t.name.toLowerCase() === topicContext.toLowerCase()) || 
                         topics.find(t => t.slug === topicContext.toLowerCase()) || { masteryScore: 0 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Guest Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
            <span className="text-navy-700">
              <strong>Guest Session:</strong> Chatting with the Socratic AI tutor. Explanations adapt to your active topic. Create an account to permanently save your conversation history.
            </span>
          </div>
          <button
            onClick={() => onNavigate('auth')}
            className="px-3.5 py-1.5 rounded-lg bg-brand-purple text-white font-bold hover:bg-brand-purple-dark shrink-0 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      )}
      
      {/* Top Header & Topic Context Selector */}
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Socratic AI Personal Tutor</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-navy-900 mt-1">
            Cognitive Tutoring Interface
          </h2>
          <p className="text-xs text-navy-500">
            Explanations, examples, and hints adapt dynamically to your mastery score.
          </p>
        </div>

        {/* Topic Selector & Clear Chat */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={topicContext}
              onChange={(e) => setTopicContext(e.target.value)}
              className="appearance-none bg-navy-50 border border-navy-200/80 text-navy-900 text-xs font-bold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-brand-purple cursor-pointer shadow-soft-xs"
            >
              {topics.map(t => (
                <option key={t.slug} value={t.name}>
                  {t.name} ({t.masteryScore}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-navy-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={handleClearHistory}
            title="Reset Chat History"
            className="p-2 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Context Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border border-brand-purple/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-brand-purple" />
          <span>Active Context: <strong>{topicContext}</strong></span>
          <MasteryBadge score={activeTopicObj.masteryScore ?? 0} size="sm" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('visualizer')}
            title="Open Interactive Algorithm & Call-Stack Visualizer Lab"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-brand-purple/30 text-brand-purple font-bold text-xs hover:bg-brand-purple/5 shadow-soft-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-brand-purple" />
            <span>Interactive Visualizer Lab ↗</span>
          </button>

          <div className="flex items-center gap-2 text-navy-500 font-mono text-[11px]">
            {tutorStatus?.isConfigured ? (
              <button
                onClick={() => setShowKeyModal(true)}
                title="Configured live LLM provider. Click to modify."
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-semibold hover:bg-brand-purple/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-purple" />
                <span>{tutorStatus.provider === 'groq' ? 'Groq LPU (GPT-OSS 120B)' : tutorStatus.mode}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowKeyModal(true)}
                title="Currently using resilient local pedagogical knowledge engine. Click to connect Gemini or Groq API."
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-100/70 text-navy-700 border border-navy-200 hover:border-brand-purple hover:text-brand-purple transition-all cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-brand-blue" />
                <span>Pedagogical Engine <span className="text-[10px] text-brand-purple font-bold ml-1">Connect API ↗</span></span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm overflow-hidden flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {historyLoading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-brand-purple mx-auto animate-spin mb-2" />
              <p className="text-xs text-navy-500">Loading conversation history...</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-soft-xs mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed space-y-2 relative ${
                    isUser
                      ? 'bg-navy-900 text-white rounded-tr-none'
                      : 'bg-navy-50/70 border border-navy-200/60 text-navy-900 rounded-tl-none'
                  }`}>
                    {!isUser && (
                      <div className="flex items-center justify-between pb-1.5 border-b border-navy-200/40 text-[11px] text-navy-500 font-medium">
                        <span className="font-semibold text-brand-purple">LearnLoop Socratic Tutor</span>
                        <button
                          onClick={() => toggleSpeak(msg.content, idx)}
                          title="Read explanation aloud"
                          className="p-1 hover:bg-navy-200/60 rounded-md transition-colors text-navy-400 hover:text-brand-purple flex items-center gap-1 text-[10px]"
                        >
                          {speakingIndex === idx ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-brand-rose animate-pulse" />
                              <span className="text-brand-rose font-bold">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {/* Render rich formatted content with code blocks */}
                    <div className="space-y-2">
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-navy-200 text-navy-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}

          {/* Typing Indicator */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 bg-navy-50 rounded-2xl rounded-tl-none border border-navy-200/60 text-xs text-navy-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-mono">Formulating calibrated explanation...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-2.5 bg-navy-50/50 border-t border-navy-200/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-xs bg-white hover:bg-navy-100/70 text-navy-700 px-3 py-1 rounded-full border border-navy-200 shrink-0 font-medium transition-colors shadow-soft-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-navy-200/80">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask anything about ${topicContext} or requested practice problem...`}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-navy-900"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-soft-xs transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Optional Live AI Provider Settings Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-navy-200 shadow-soft-xl max-w-md w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-navy-900">AI Tutor Engine Settings</h3>
                    <p className="text-[11px] text-navy-500">Connect Google Gemini or Groq API</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="p-1 text-navy-400 hover:text-navy-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-navy-50 border border-navy-200/80 text-xs text-navy-600 leading-relaxed">
                LearnLoop includes a built-in <strong>Resilient Pedagogical Knowledge Engine</strong> with deep coverage across 50+ DSA topics (AVL trees, Red-Black trees, Dijkstra, etc.). You can also connect a live Google Gemini or Groq key for unrestricted reasoning.
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">
                    Google Gemini API Key (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-xs focus:outline-none focus:border-brand-purple font-mono text-navy-900"
                  />
                  <span className="text-[10px] text-navy-400 mt-1 block">Free tier keys from Google AI Studio are supported.</span>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">
                    Groq Cloud API Key (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqKeyInput}
                    onChange={(e) => setGroqKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 text-xs focus:outline-none focus:border-brand-purple font-mono text-navy-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-navy-200/60">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-600 hover:bg-navy-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingKey}
                  onClick={handleSaveConfig}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-purple text-white hover:bg-brand-purple-dark transition-all disabled:opacity-50"
                >
                  {savingKey ? 'Connecting...' : 'Save & Connect'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

