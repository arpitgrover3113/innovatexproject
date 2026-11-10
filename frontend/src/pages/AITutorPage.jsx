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
  BrainCircuit
} from 'lucide-react';
import { tutorApi, topicsApi } from '../services/api';
import { MasteryBadge } from '../components/MasteryBadge';
import { RecursionVisualizer } from '../components/RecursionVisualizer';

export const AITutorPage = ({ initialTopicContext = 'Recursion', onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [topicContext, setTopicContext] = useState(initialTopicContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    'Explain the fundamentals of Recursion',
    'Why is Recursion a prerequisite for Trees?',
    'Give me an adaptive practice question on Recursion'
  ]);
  const [tutorStatus, setTutorStatus] = useState(null);

  const messagesEndRef = useRef(null);

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
        if (historyRes.topicContext) setTopicContext(historyRes.topicContext);
        setTutorStatus(statusRes);
        setTopics(topicsRes.topics || []);
        setHistoryLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tutor data:', err);
        setHistoryLoading(false);
      });
  }, []);

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
                         topics.find(t => t.slug === topicContext.toLowerCase()) || { masteryScore: 35 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
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
          <MasteryBadge score={activeTopicObj.masteryScore || 35} size="sm" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVisualizer(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-brand-purple/30 text-brand-purple font-bold text-xs hover:bg-brand-purple/5 shadow-soft-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-brand-purple" />
            <span>{showVisualizer ? 'Hide Call-Stack Tracer' : '🧠 Trace Call-Stack Visually'}</span>
          </button>

          <div className="flex items-center gap-2 text-navy-500 font-mono text-[11px]">
            {tutorStatus?.isConfigured ? (
              <span className="flex items-center gap-1 text-brand-purple font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{tutorStatus.provider === 'groq' ? 'Groq LPU (GPT-OSS 120B)' : tutorStatus.mode}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-brand-blue font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Pedagogical Heuristic Engine</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Interactive Call Stack Visualizer */}
      <AnimatePresence>
        {showVisualizer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <RecursionVisualizer />
          </motion.div>
        )}
      </AnimatePresence>

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
                    {/* Render plain text with basic markdown formatting */}
                    <div className="prose prose-sm max-w-none space-y-2">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is code block
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.replace(/```[a-z]*/g, '').trim();
                          return (
                            <pre key={pIdx} className="bg-navy-950 text-navy-100 p-3 rounded-xl font-mono text-xs overflow-x-auto my-2">
                              <code>{lines}</code>
                            </pre>
                          );
                        }
                        return <p key={pIdx} className="whitespace-pre-line">{paragraph}</p>;
                      })}
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

    </div>
  );
};

