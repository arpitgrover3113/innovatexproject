import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Award, 
  CheckCircle, 
  Calendar, 
  RefreshCw,
  Compass,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, assessmentApi } from '../services/api';
import { MasteryBadge } from '../components/MasteryBadge';
import { MetricCard } from '../components/MetricCard';

export const AnalyticsPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getDashboard(),
      assessmentApi.getHistory()
    ])
      .then(([dashRes, assessRes]) => {
        setData(dashRes);
        setAssessments(assessRes.assessments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-4 animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-navy-600">Compiling historical learning telemetry...</p>
      </div>
    );
  }

  const { summary, charts, weakestTopics, strongestTopics, roadmapSummary } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Guest Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
            <span className="text-navy-700">
              <strong>Guest Preview:</strong> Viewing baseline analytics. Complete assessments to generate personalized accuracy trends and velocity telemetry.
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
      
      {/* Header Strip */}
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-purple" />
            <span>Comprehensive Learning Analytics</span>
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight mt-1">
            Performance & Cognitive Telemetry
          </h1>
          <p className="text-xs text-navy-500">
            Real data from your diagnostic evaluations, adaptive quizzes, and mastery updates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('diagnostic')}
          className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-soft-xs"
        >
          New Diagnostic Assessment
        </button>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Overall Mastery"
          value={`${summary?.overallMastery || 0}%`}
          subtext="Mean across 10 DSA topics"
          icon={Award}
          trend={summary?.overallMastery > 0 ? `+${summary.overallMastery}%` : "Baseline"}
          trendPositive={summary?.overallMastery > 0}
          color="purple"
        />
        <MetricCard
          title="Total Solved"
          value={summary?.questionsAttempted || 0}
          subtext="Questions evaluated"
          icon={Activity}
          trend={summary?.questionsAttempted > 0 ? `${summary.questionsAttempted} solved` : "Unattempted"}
          trendPositive={summary?.questionsAttempted > 0}
          color="blue"
        />
        <MetricCard
          title="Global Accuracy"
          value={`${summary?.accuracy || 0}%`}
          subtext="Weighted response accuracy"
          icon={CheckCircle}
          trend={summary?.questionsAttempted > 0 ? `${summary.accuracy}% accuracy` : "No attempts"}
          trendPositive={summary?.accuracy >= 60}
          color="emerald"
        />
        <MetricCard
          title="Study Velocity"
          value={`${summary?.streakDays || 0} Days`}
          subtext="Daily active practice"
          icon={TrendingUp}
          trend={summary?.streakDays > 0 ? "🔥 Active" : "Not started"}
          trendPositive={summary?.streakDays > 0}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Topic Mastery Distribution */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-navy-900">Topic-Wise Mastery Calibration</h3>
            <p className="text-xs text-navy-500">Score per algorithmic domain</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.topicMastery || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748B' }} interval={0} angle={-30} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trends Over Sessions */}
        <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-navy-900">Historical Accuracy Trend</h3>
            <p className="text-xs text-navy-500">Score progression across testing sessions</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.accuracyTrends || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563EB' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Cognitive Weakness & Misconception Analysis Table */}
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-navy-900">Cognitive Gap & Misconception Analysis</h3>
          <p className="text-xs text-navy-500">Topics flagged for targeted review based on repeated error detection</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50/80 text-navy-500 uppercase font-semibold text-[10px] tracking-wider border-b border-navy-200">
              <tr>
                <th className="p-3">Topic Domain</th>
                <th className="p-3">Mastery Score</th>
                <th className="p-3">Recent Accuracy</th>
                <th className="p-3">Flagged Cognitive Misconception</th>
                <th className="p-3 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {(weakestTopics || []).map((w, idx) => (
                <tr key={idx} className="hover:bg-navy-50/50 transition-colors">
                  <td className="p-3 font-bold text-navy-900">{w.name}</td>
                  <td className="p-3"><MasteryBadge score={w.score} size="sm" /></td>
                  <td className="p-3 font-mono">{w.accuracy}%</td>
                  <td className="p-3 text-brand-rose font-medium max-w-xs">
                    {w.misconception || 'Confusing stack frame allocations with iterative loop variables'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate('adaptive', { topic: w.slug })}
                      className="px-3 py-1 bg-brand-purple text-white rounded-lg font-bold hover:bg-brand-purple-dark transition-all text-xs"
                    >
                      Reinforce
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Assessment Log */}
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-900">Completed Assessments History</h3>
            <p className="text-xs text-navy-500">Record of verified evaluation tests</p>
          </div>
          <FileText className="w-4 h-4 text-navy-400" />
        </div>

        <div className="space-y-3">
          {assessments.length === 0 ? (
            <p className="text-xs text-navy-500 italic py-4">No standalone assessments completed yet. Take the diagnostic to get started!</p>
          ) : (
            assessments.map((a, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-navy-50/60 border border-navy-200/60 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-navy-900">{a.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-navy-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(a.completedAt).toLocaleDateString()}</span>
                    </span>
                    <span>·</span>
                    <span>{a.totalQuestions} Questions</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-brand-purple/10 text-brand-purple">
                    Score: {a.score}%
                  </span>
                  <button
                    onClick={() => onNavigate('diagnostic')}
                    className="text-xs text-brand-purple font-semibold hover:underline"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

