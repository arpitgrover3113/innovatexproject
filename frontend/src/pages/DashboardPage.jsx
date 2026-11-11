import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line
} from 'recharts';
import { 
  Award, 
  CheckCircle, 
  Target, 
  Flame, 
  Sparkles, 
  Compass, 
  ArrowUpRight, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  RefreshCw,
  BrainCircuit,
  ArrowRight,
  Code2
} from 'lucide-react';
import { analyticsApi, topicsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/MetricCard';
import { MasteryBadge } from '../components/MasteryBadge';

export const DashboardPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getDashboard();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
      setError('Could not load analytics. Using cached telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-4 animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-navy-600">Loading student knowledge profile & analytics...</p>
      </div>
    );
  }

  const { summary, strongestTopics, weakestTopics, recommendedNextTopic, recentAssessments, charts, roadmapSummary } = data || {};
  const hasAttempted = (summary?.questionsAttempted || 0) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Guest Notice Banner if unauthenticated */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
            <span className="text-navy-700">
              <strong>Guest Preview:</strong> Take the Diagnostic Assessment to calibrate your personal knowledge graph and unlock real-time recommendations.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('diagnostic')}
              className="px-3.5 py-1.5 rounded-lg bg-brand-purple text-white font-bold hover:bg-brand-purple-dark transition-all"
            >
              Take Diagnostic
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-3.5 py-1.5 rounded-lg border border-navy-200 text-navy-700 font-semibold hover:bg-navy-50 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
      
      {/* Top Welcome & Recommended Topic Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden shadow-soft-xl border border-navy-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                hasAttempted 
                  ? 'bg-brand-purple/30 text-brand-purple-light border-brand-purple/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {hasAttempted ? 'Cognitive State: Calibrated' : 'Cognitive State: Uncalibrated'}
              </span>
              <span className="text-xs text-navy-400">DSA Subject Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {hasAttempted ? (
                <>Next Priority: <span className="text-brand-purple-light">{recommendedNextTopic?.topicName || 'Recursion Fundamentals'}</span></>
              ) : (
                <>Baseline Assessment: <span className="text-brand-purple-light">Diagnostic Needed</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-navy-300 leading-relaxed">
              {hasAttempted
                ? (recommendedNextTopic?.reason || 'Critical gateway topic identified. Strengthening this topic will immediately unlock downstream Tree and Dynamic Programming modules.')
                : 'You have not completed the baseline diagnostic assessment yet. Take the 10-question assessment to calibrate your personalized knowledge frontier.'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasAttempted ? (
              <>
                <button
                  onClick={() => onNavigate('adaptive', { topic: recommendedNextTopic?.topicSlug || 'recursion' })}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-brand-purple hover:bg-brand-purple-dark text-white shadow-soft-md hover:shadow-soft-lg flex items-center gap-2 transition-all"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Practice This Topic</span>
                </button>
                <button
                  onClick={() => onNavigate('tutor', { topicContext: recommendedNextTopic?.topicName || 'Recursion' })}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-purple-light" />
                  <span>Ask AI Tutor</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('diagnostic')}
                className="px-6 py-3.5 rounded-xl font-bold text-xs bg-brand-purple hover:bg-brand-purple-dark text-white shadow-soft-md hover:shadow-soft-lg flex items-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Take Diagnostic Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none -z-0" />
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Overall DSA Mastery"
          value={`${summary?.overallMastery || 0}%`}
          subtext="Across 10 core topics"
          icon={Award}
          trend={summary?.overallMastery > 0 ? `+${summary.overallMastery}%` : "Baseline"}
          trendPositive={summary?.overallMastery > 0}
          color="purple"
        />
        <MetricCard
          title="Questions Attempted"
          value={summary?.questionsAttempted || 0}
          subtext="In diagnostic & adaptive sessions"
          icon={BookOpen}
          trend={hasAttempted ? `${summary.questionsAttempted} solved` : "Unattempted"}
          trendPositive={hasAttempted}
          color="blue"
        />
        <MetricCard
          title="Accuracy Rate"
          value={`${summary?.accuracy || 0}%`}
          subtext="Calibrated weighted performance"
          icon={Target}
          trend={hasAttempted ? `${summary.accuracy}% accuracy` : "No attempts"}
          trendPositive={summary?.accuracy >= 60}
          color="emerald"
        />
        <MetricCard
          title="Learning Streak"
          value={`${summary?.streakDays || 0} Days`}
          subtext="Consistent daily practice"
          icon={Flame}
          trend={summary?.streakDays > 0 ? "🔥 Active" : "Not started"}
          trendPositive={summary?.streakDays > 0}
          color="amber"
        />
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Topic-Wise Mastery Bar Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900 tracking-tight">Topic-Wise Mastery Telemetry</h3>
              <p className="text-xs text-navy-500">Live deterministic scores (0-100%) across all 10 DSA topics</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-navy-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-purple inline-block" />
                <span>Student Score</span>
              </span>
              <span className="flex items-center gap-1 text-navy-400">
                <span className="w-2.5 h-0.5 bg-navy-300 inline-block" />
                <span>Benchmark (75%)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.topicMastery || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="topic" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  interval={0} 
                  angle={-30} 
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-navy-900 text-white text-xs p-3 rounded-xl shadow-soft-lg space-y-1">
                          <p className="font-bold">{item.topic}</p>
                          <p className="text-brand-purple-light">Mastery Score: <strong>{item.score}%</strong></p>
                          <p className="text-navy-300">Accuracy: {item.accuracy}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#6366F1" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Area Chart */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900 tracking-tight">Weekly Learning Activity</h3>
              <p className="text-xs text-navy-500">Questions solved per day</p>
            </div>
            <Activity className="w-4 h-4 text-brand-purple" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.weeklyActivity || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 10]} allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-navy-900 text-white text-xs p-2.5 rounded-xl shadow-soft-lg">
                          <p className="font-bold">{item.day}</p>
                          <p className="text-brand-purple-light">{item.questions} Questions ({item.accuracy}% acc)</p>
                          <p className="text-navy-300">{item.studyTimeMin} mins active study</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="#6366F1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#purpleGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Strongest vs Weakest Topics & Cognitive Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Strongest Topics */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Your Strongest Topics</h3>
                <p className="text-xs text-navy-500">High conceptual proficiency demonstrated</p>
              </div>
            </div>
            <span className="text-xs text-brand-emerald font-semibold">Solid Anchors</span>
          </div>

          <div className="space-y-3 pt-2">
            {(strongestTopics || []).map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-navy-50/60 border border-navy-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">{t.name}</h4>
                  <p className="text-xs text-navy-500">Recent Accuracy: {t.accuracy}%</p>
                </div>
                <div className="flex items-center gap-3">
                  <MasteryBadge score={t.score} />
                  <button
                    onClick={() => onNavigate('adaptive', { topic: t.slug })}
                    className="p-1.5 hover:bg-navy-200 rounded-lg text-navy-500 transition-colors"
                    title="Challenge on Hard Level"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weakest Topics / Critical Gaps */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-rose/10 text-brand-rose rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Priority Weak Areas</h3>
                <p className="text-xs text-navy-500">Require foundational reinforcement</p>
              </div>
            </div>
            <span className="text-xs text-brand-rose font-semibold">Action Required</span>
          </div>

          <div className="space-y-3 pt-2">
            {(weakestTopics || []).map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-200/60 flex items-center justify-between">
                <div className="max-w-[220px]">
                  <h4 className="text-sm font-bold text-navy-900">{t.name}</h4>
                  <p className="text-xs text-brand-rose font-medium truncate">
                    {t.misconception || 'Needs base-case & conceptual practice'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MasteryBadge score={t.score} />
                  <button
                    onClick={() => onNavigate('tutor', { topicContext: t.name })}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-all shadow-soft-xs"
                  >
                    Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Visualizer Lab Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-purple/10 via-brand-blue/10 to-white border border-brand-purple/20 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-soft-xs">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple font-mono">Interactive Laboratory</span>
            <h4 className="text-base font-bold text-navy-900 mt-0.5">Algorithm & Memory Visualizer Lab</h4>
            <p className="text-xs text-navy-600 mt-0.5">Inspect physical RAM call stacks, AVL tree rebalance rotations, animated sorting steps, and BFS/DFS queues.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('visualizer')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-purple hover:bg-brand-purple-dark text-white shadow-soft-xs flex items-center gap-2 transition-all shrink-0"
        >
          <span>Launch Visualizer Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="p-6 rounded-3xl bg-white border border-navy-200/80 shadow-soft-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-navy-900">Looking for a full skill re-assessment?</h4>
          <p className="text-xs text-navy-500">Take the comprehensive 10-topic diagnostic assessment to recalculate all topic scores from scratch.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-navy-700 bg-navy-100 hover:bg-navy-200 transition-colors"
          >
            Explore Dynamic Roadmap
          </button>
          <button
            onClick={() => onNavigate('diagnostic')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 transition-colors flex items-center gap-1.5"
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

