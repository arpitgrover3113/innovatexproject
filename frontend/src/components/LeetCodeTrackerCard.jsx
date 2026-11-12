import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  ChevronRight,
  Code2,
  Sparkles,
  Link2,
  Activity
} from 'lucide-react';
import { leetcodeApi } from '../services/api';

export const LeetCodeTrackerCard = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [handle, setHandle] = useState('alex_mercer');
  const [editingHandle, setEditingHandle] = useState(false);
  const [tempHandle, setTempHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingHandle, setSavingHandle] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [testSyncing, setTestSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(null);

  const fetchLeetCodeData = async () => {
    try {
      const res = await leetcodeApi.getAnalytics();
      setAnalytics(res);
      if (res?.linkedHandle) {
        setHandle(res.linkedHandle);
        // Also fetch profile stats
        const prof = await leetcodeApi.getProfile(res.linkedHandle).catch(() => null);
        if (prof) setProfile(prof);
      }
    } catch (err) {
      console.warn('Could not load LeetCode analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeetCodeData();
    // Poll every 10 seconds in case a submission was just logged by the extension
    const interval = setInterval(fetchLeetCodeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveHandle = async (e) => {
    e?.preventDefault();
    if (!tempHandle.trim()) return;
    setSavingHandle(true);
    try {
      await leetcodeApi.linkHandle(tempHandle.trim());
      setHandle(tempHandle.trim());
      setEditingHandle(false);
      const prof = await leetcodeApi.getProfile(tempHandle.trim()).catch(() => null);
      if (prof) setProfile(prof);
      showNotification(`Linked @${tempHandle.trim()} to LearnLoop!`);
      fetchLeetCodeData();
    } catch (err) {
      console.error('Failed to link handle:', err);
    } finally {
      setSavingHandle(false);
    }
  };

  const showNotification = (msg) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Test sync button to simulate a live Chrome Extension submission
  const handleTestSimulateSync = async () => {
    setTestSyncing(true);
    try {
      const testProblems = [
        { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', diff: 'Medium', sec: 890, time: '14m 50s' },
        { title: 'Invert Binary Tree', slug: 'invert-binary-tree', diff: 'Easy', sec: 320, time: '5m 20s' },
        { title: 'Word Search II', slug: 'word-search-ii', diff: 'Hard', sec: 2240, time: '37m 20s' }
      ];
      const pick = testProblems[Math.floor(Math.random() * testProblems.length)];
      await leetcodeApi.logSubmission({
        leetcodeUsername: handle,
        title: pick.title,
        titleSlug: pick.slug,
        difficulty: pick.diff,
        timeSpentSeconds: pick.sec,
        timeSpentFormatted: pick.time,
        runtime: `${Math.floor(Math.random() * 40 + 35)} ms`,
        runtimePercentile: Math.floor(Math.random() * 20 + 75),
        memory: `${(Math.random() * 5 + 14).toFixed(1)} MB`,
        memoryPercentile: Math.floor(Math.random() * 20 + 70),
        status: 'Accepted'
      });
      showNotification(`🎉 Extension Synced: "${pick.title}" solved in ${pick.time}!`);
      await fetchLeetCodeData();
    } catch (err) {
      console.error('Test sync failed:', err);
    } finally {
      setTestSyncing(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm text-center">
        <RefreshCw className="w-5 h-5 text-brand-purple animate-spin mx-auto mb-2" />
        <p className="text-xs text-navy-500 font-medium">Loading LeetCode Speed & Submission Telemetry...</p>
      </div>
    );
  }

  const { totalSubmissions = 0, averageTime = {}, counts = {}, speedRating, recentSubmissions = [] } = analytics || {};

  return (
    <div className="p-6 sm:p-7 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm space-y-6 relative overflow-hidden">
      
      {/* Toast notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold shadow-soft-lg flex items-center gap-2 border border-brand-purple/40"
          >
            <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
            <span>{syncToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>LeetCode Companion</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-300 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Auto-Sync Active</span>
            </span>
          </div>

          <h3 className="text-lg font-black text-navy-900 flex items-center gap-2">
            <span>LeetCode Speed & Submission Tracker</span>
          </h3>
          <p className="text-xs text-navy-500">
            Automatically logs time taken per LeetCode problem, runtime percentiles, and benchmarks your speed against FAANG interview standards.
          </p>
        </div>

        {/* Link Handle & Extension Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {editingHandle ? (
            <form onSubmit={handleSaveHandle} className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempHandle}
                onChange={(e) => setTempHandle(e.target.value)}
                placeholder="LeetCode username"
                className="px-3 py-1.5 text-xs rounded-xl border border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple text-navy-900 w-36"
                autoFocus
              />
              <button
                type="submit"
                disabled={savingHandle}
                className="px-3 py-1.5 rounded-xl bg-brand-purple text-white font-bold text-xs hover:bg-brand-purple-dark transition-all"
              >
                {savingHandle ? '...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditingHandle(false)}
                className="px-2 py-1.5 text-xs text-navy-500 hover:text-navy-800"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-navy-50 border border-navy-200/80 text-xs">
              <Link2 className="w-3.5 h-3.5 text-brand-purple" />
              <span className="font-semibold text-navy-600">ID:</span>
              <strong className="text-navy-900 font-mono">@{handle}</strong>
              <button
                onClick={() => {
                  setTempHandle(handle);
                  setEditingHandle(true);
                }}
                className="px-2 py-0.5 rounded-lg hover:bg-white text-[11px] font-bold text-brand-purple border border-transparent hover:border-navy-200 transition-all ml-1"
              >
                Edit
              </button>
            </div>
          )}

          <button
            onClick={() => setShowInstallGuide(!showInstallGuide)}
            className="px-3.5 py-2 rounded-xl border border-navy-200 hover:bg-navy-50 text-navy-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-purple" />
            <span>Companion Extension</span>
          </button>

          <button
            onClick={handleTestSimulateSync}
            disabled={testSyncing}
            title="Simulate a real-time submission sent from the Chrome Extension"
            className="px-3 py-2 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testSyncing ? 'animate-spin' : ''}`} />
            <span>{testSyncing ? 'Syncing...' : 'Simulate LC Solve'}</span>
          </button>
        </div>
      </div>

      {/* Extension Installation Guide Accordion */}
      <AnimatePresence>
        {showInstallGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-navy-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-brand-purple" />
                  Install LearnLoop Companion Chrome Extension (10-Second Setup)
                </span>
                <button onClick={() => setShowInstallGuide(false)} className="text-navy-400 hover:text-navy-700">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] text-navy-700">
                <div className="p-3 bg-white rounded-xl border border-navy-200/70 space-y-1">
                  <div className="font-black text-brand-purple">Step 1</div>
                  <p>In Google Chrome, open <strong>chrome://extensions</strong> in your address bar.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-navy-200/70 space-y-1">
                  <div className="font-black text-brand-purple">Step 2</div>
                  <p>Toggle <strong>Developer mode</strong> in top-right corner, then click <strong>Load unpacked</strong>.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-navy-200/70 space-y-1">
                  <div className="font-black text-brand-purple">Step 3</div>
                  <p>Select folder: <code className="bg-navy-100 px-1 py-0.5 rounded text-[10px]">innovatexproject/extension</code></p>
                </div>
              </div>
              <p className="text-[11px] text-navy-500 italic">
                ✨ Once loaded, open any LeetCode problem! The floating stopwatch automatically attaches and records your solve time upon submission.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Metrics Cards (Easy, Medium, Hard Time Benchmarks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Easy Solve Average */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Easy Problems</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">Target &lt; 10m</span>
            </div>
            <div className="text-2xl font-black text-navy-900 mt-1">
              {averageTime.easy || '7m 12s'}
            </div>
            <p className="text-[11px] text-navy-500 mt-0.5">Average across {counts.easy || 1} solved</p>
          </div>
          <div className="pt-3 border-t border-emerald-200/40 mt-3 flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Baseline</span>
          </div>
        </div>

        {/* Medium Solve Average (FAANG Bar) */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Medium Problems</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-full">Target &lt; 20m</span>
            </div>
            <div className="text-2xl font-black text-navy-900 mt-1">
              {averageTime.medium || '17m 20s'}
            </div>
            <p className="text-[11px] text-navy-500 mt-0.5">Average across {counts.medium || 1} solved</p>
          </div>
          <div className="pt-3 border-t border-amber-200/40 mt-3 flex items-center gap-1.5 text-[10px] text-amber-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FAANG Screen Ready (&lt; 20m)</span>
          </div>
        </div>

        {/* Hard Solve Average */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">Hard Problems</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">Target &lt; 45m</span>
            </div>
            <div className="text-2xl font-black text-navy-900 mt-1">
              {averageTime.hard || '36m 00s'}
            </div>
            <p className="text-[11px] text-navy-500 mt-0.5">Average across {counts.hard || 1} solved</p>
          </div>
          <div className="pt-3 border-t border-rose-200/40 mt-3 flex items-center gap-1.5 text-[10px] text-rose-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Senior Bar Met</span>
          </div>
        </div>

        {/* Total Solved & Public Profile Sync */}
        <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple">Tracked Solves</span>
              <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <div className="text-2xl font-black text-navy-900 mt-1">
              {totalSubmissions || 3}
            </div>
            <p className="text-[11px] text-navy-500 mt-0.5">
              {profile ? `${profile.totalSolved} on LC Profile` : 'Live Extension Feed'}
            </p>
          </div>
          <div className="pt-3 border-t border-brand-purple/20 mt-3 flex items-center gap-1.5 text-[10px] text-brand-purple font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>{speedRating || 'Screen Ready'}</span>
          </div>
        </div>

      </div>

      {/* Recent Submissions Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-purple" />
            <span>Recent Extension Tracked Submissions</span>
          </h4>
          <span className="text-[11px] text-navy-400">
            {recentSubmissions.length} recorded session(s)
          </span>
        </div>

        <div className="space-y-2">
          {recentSubmissions.length === 0 ? (
            <div className="p-6 text-center text-xs text-navy-400 border border-dashed border-navy-200 rounded-2xl">
              No submissions tracked yet. Open any problem on LeetCode to test live tracking!
            </div>
          ) : (
            recentSubmissions.slice(0, 4).map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="p-3.5 rounded-2xl bg-navy-50/70 border border-navy-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-brand-purple/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    sub.difficulty === 'Hard'
                      ? 'bg-rose-100 text-rose-700'
                      : sub.difficulty === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {sub.difficulty ? sub.difficulty[0] : 'M'}
                  </div>
                  <div>
                    <div className="font-extrabold text-navy-900 flex items-center gap-2">
                      <span>{sub.title}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        sub.difficulty === 'Hard'
                          ? 'bg-rose-100 text-rose-700'
                          : sub.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {sub.difficulty}
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-500 flex items-center gap-2 mt-0.5">
                      <span>Runtime: <strong>{sub.runtime}</strong></span>
                      {sub.runtimePercentile && <span>(Beats {sub.runtimePercentile}%)</span>}
                      <span>•</span>
                      <span>Memory: <strong>{sub.memory}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-navy-400 block">Total Solve Time</span>
                    <strong className="text-brand-purple font-mono text-sm font-black">
                      {sub.timeSpentFormatted || `${Math.floor(sub.timeSpentSeconds / 60)}m`}
                    </strong>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Sync</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
