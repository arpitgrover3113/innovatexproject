import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Zap, 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  BarChart3, 
  RotateCcw,
  Shield,
  Play,
  Binary,
  Navigation,
  MapPin,
  Code2,
  Activity,
  Network,
  Lock,
  Cpu,
  TrendingUp,
  Flame,
  Star,
  GitBranch,
  ArrowUpRight,
  Sparkle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

// ==========================================
// 3D GRADUATION CAP SVG COMPONENT
// ==========================================
const GraduationCap3D = () => (
  <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center select-none">
    {/* Ambient Glows */}
    <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-purple-400/20 via-indigo-300/30 to-violet-400/20 blur-3xl animate-pulse" />
    <div className="absolute w-40 h-40 rounded-full bg-purple-500/15 blur-2xl" />

    {/* Platform shadow */}
    <div className="absolute bottom-6 w-48 h-10 bg-purple-900/15 rounded-full blur-xl transform scale-y-50" />

    {/* SVG Cap */}
    <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-[0_25px_35px_rgba(99,102,241,0.25)]">
      <defs>
        <linearGradient id="capTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="capEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="capBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="60%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#312E81" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Skull Cap Base (under the rhomboid) */}
      <path
        d="M 100 135 Q 160 175 220 135 L 210 180 Q 160 215 110 180 Z"
        fill="url(#capBaseGrad)"
        filter="url(#shadow3D)"
      />
      {/* Lower rim band */}
      <path
        d="M 110 180 Q 160 215 210 180 L 208 188 Q 160 222 112 188 Z"
        fill="#1E1B4B"
        opacity="0.7"
      />

      {/* Cap Top Rhombus (3D tilted perspective) */}
      {/* Edge Thickness Layer for 3D Depth */}
      <polygon
        points="160,58 290,118 290,126 160,166 30,126 30,118"
        fill="url(#capEdgeGrad)"
      />
      {/* Top Diamond Surface */}
      <polygon
        points="160,55 290,115 160,160 30,115"
        fill="url(#capTopGrad)"
      />
      {/* Specular highlight on top surface */}
      <polygon
        points="160,56 220,84 160,110 100,84"
        fill="#FFFFFF"
        opacity="0.12"
      />

      {/* Golden Button in Center */}
      <ellipse cx="160" cy="115" rx="7" ry="4.5" fill="url(#goldButtonGrad)" />

      {/* Tassel String (Swinging to the right and down) */}
      <path
        d="M 160 115 C 200 112 245 125 248 165 C 249 180 246 195 244 210"
        fill="none"
        stroke="url(#tasselGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Tassel Ring / Clip */}
      <ellipse cx="244" cy="210" rx="3.5" ry="2" fill="#FDE047" />

      {/* Tassel Fringe / Brush */}
      <path
        d="M 241 211 L 236 248 Q 244 252 252 248 L 247 211 Z"
        fill="url(#tasselGrad)"
        filter="url(#shadow3D)"
      />
      {/* Tassel strands */}
      <line x1="240" y1="216" x2="238" y2="246" stroke="#FEF08A" strokeWidth="1" opacity="0.6" />
      <line x1="244" y1="216" x2="244" y2="249" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />
      <line x1="248" y1="216" x2="250" y2="246" stroke="#FEF08A" strokeWidth="1" opacity="0.6" />
    </svg>
  </div>
);

// ==========================================
// MINI INTERACTIVE HERO PLAYGROUND COMPONENTS
// ==========================================
const MINI_ROWS = 7;
const MINI_COLS = 15;
const MINI_START = { r: 3, c: 1 };
const MINI_TARGET = { r: 3, c: 13 };

const createMiniGrid = (preset = null) => {
  const rows = [];
  for (let r = 0; r < MINI_ROWS; r++) {
    const row = [];
    for (let c = 0; c < MINI_COLS; c++) {
      const isStart = r === MINI_START.r && c === MINI_START.c;
      const isTarget = r === MINI_TARGET.r && c === MINI_TARGET.c;
      let isWall = false;
      if (preset === 'wall') {
        if (c === 7 && r !== 1 && r !== 5) isWall = true;
      } else if (preset === 'scatter') {
        if ((r === 1 && c === 4) || (r === 2 && c === 4) || (r === 4 && c === 9) || (r === 5 && c === 9) || (r === 3 && c === 6)) isWall = true;
      }
      row.push({ r, c, isStart, isTarget, isWall, isVisited: false, isPath: false, dist: Infinity, prev: null });
    }
    rows.push(row);
  }
  return rows;
};

const MiniDijkstra = () => {
  const [grid, setGrid] = useState(() => createMiniGrid('wall'));
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Click any white cell to draw walls, then click Run Dijkstra.');
  const [visitedCount, setVisitedCount] = useState(8);
  const [pathLen, setPathLen] = useState(0);

  const toggleWall = (r, c) => {
    if (isRunning) return;
    if ((r === MINI_START.r && c === MINI_START.c) || (r === MINI_TARGET.r && c === MINI_TARGET.c)) return;
    setGrid(prev => prev.map((row, ri) => row.map((cell, ci) => {
      if (ri === r && ci === c) {
        return { ...cell, isWall: !cell.isWall, isVisited: false, isPath: false };
      }
      return cell;
    })));
  };

  const loadPreset = (preset) => {
    if (isRunning) return;
    setGrid(createMiniGrid(preset));
    setVisitedCount(0);
    setPathLen(0);
    setStatus(`Loaded preset: ${preset === 'wall' ? 'Divider Barrier' : 'Scattered Rocks'}. Ready.`);
  };

  const clearPath = () => {
    if (isRunning) return;
    setGrid(prev => prev.map(row => row.map(cell => ({ ...cell, isVisited: false, isPath: false }))));
    setVisitedCount(0);
    setPathLen(0);
    setStatus('Path cleared. Walls preserved.');
  };

  const resetAll = () => {
    if (isRunning) return;
    setGrid(createMiniGrid(null));
    setVisitedCount(0);
    setPathLen(0);
    setStatus('Grid reset. Click any white cell to draw walls.');
  };

  const runDijkstra = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisitedCount(0);
    setPathLen(0);
    setStatus('Exploring shortest path wavefront with Priority Queue...');

    const newGrid = grid.map(row => row.map(cell => ({
      ...cell,
      isVisited: false,
      isPath: false,
      dist: Infinity,
      prev: null
    })));

    newGrid[MINI_START.r][MINI_START.c].dist = 0;
    const unvisited = [];
    for (let r = 0; r < MINI_ROWS; r++) {
      for (let c = 0; c < MINI_COLS; c++) {
        unvisited.push(newGrid[r][c]);
      }
    }

    const visitedOrder = [];
    let targetNode = null;

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => a.dist - b.dist);
      const closest = unvisited.shift();
      if (closest.isWall) continue;
      if (closest.dist === Infinity) break;

      closest.isVisited = true;
      visitedOrder.push(closest);

      if (closest.r === MINI_TARGET.r && closest.c === MINI_TARGET.c) {
        targetNode = closest;
        break;
      }

      const neighbors = [
        { r: closest.r - 1, c: closest.c },
        { r: closest.r + 1, c: closest.c },
        { r: closest.r, c: closest.c - 1 },
        { r: closest.r, c: closest.c + 1 },
      ];

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < MINI_ROWS && n.c >= 0 && n.c < MINI_COLS) {
          const neighbor = newGrid[n.r][n.c];
          if (!neighbor.isVisited && !neighbor.isWall) {
            const alt = closest.dist + 1;
            if (alt < neighbor.dist) {
              neighbor.dist = alt;
              neighbor.prev = closest;
            }
          }
        }
      }
    }

    for (let i = 0; i < visitedOrder.length; i++) {
      const node = visitedOrder[i];
      setGrid(prev => prev.map(row => row.map(c => 
        c.r === node.r && c.c === node.c ? { ...c, isVisited: true } : c
      )));
      setVisitedCount(i + 1);
      await new Promise(r => setTimeout(r, 18));
    }

    if (targetNode) {
      const pathNodes = [];
      let curr = targetNode;
      while (curr) {
        pathNodes.unshift(curr);
        curr = curr.prev;
      }

      for (let i = 0; i < pathNodes.length; i++) {
        const node = pathNodes[i];
        setGrid(prev => prev.map(row => row.map(c => 
          c.r === node.r && c.c === node.c ? { ...c, isPath: true } : c
        )));
        setPathLen(i);
        await new Promise(r => setTimeout(r, 32));
      }
      setStatus(`✅ Guaranteed shortest path found in ${pathNodes.length - 1} steps!`);
    } else {
      setStatus('❌ Target is blocked by walls. Try removing walls and running again.');
    }

    setIsRunning(false);
  };

  // Dijkstra C++ code for the right panel matching reference mockup
  const dijkstraCode = [
    { num: 1, text: 'vector<vector<pair<int, int>>> adj(n);', color: 'text-sky-300' },
    { num: 2, text: 'priority_queue<pair<int, int>, ...', color: 'text-indigo-300' },
    { num: 3, text: '', color: '' },
    { num: 4, text: '// Find shortest path...', color: 'text-emerald-400/80 font-style-italic' },
    { num: 5, text: '', color: '' },
    { num: 6, text: 'while (!pq.empty()) {', color: 'text-purple-300 font-semibold' },
    { num: 7, text: '  auto [dist, node] = pq.top();', color: 'text-slate-200' },
    { num: 8, text: '  pq.pop();', color: 'text-slate-300' },
    { num: 9, text: '  if (dist > dist[node]) continue;', color: 'text-amber-300' },
    { num: 10, text: '', color: '' },
    { num: 11, text: '}', color: 'text-purple-300' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left: Dijkstra Grid Visualizer */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runDijkstra}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 shadow-md shadow-purple-500/30 transition-all text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Routing...' : 'Run Dijkstra'}</span>
            </button>
            <button 
              onClick={() => loadPreset('wall')} 
              disabled={isRunning} 
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium border border-white/10 disabled:opacity-40 transition-all text-xs"
            >
              Barrier
            </button>
            <button 
              onClick={() => loadPreset('scatter')} 
              disabled={isRunning} 
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium border border-white/10 disabled:opacity-40 transition-all text-xs"
            >
              Rocks
            </button>
            <button 
              onClick={clearPath} 
              disabled={isRunning} 
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium border border-white/10 disabled:opacity-40 transition-all text-xs"
            >
              Clear Path
            </button>
            <button 
              onClick={resetAll} 
              disabled={isRunning} 
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-medium border border-white/5 disabled:opacity-40 transition-all text-xs"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>Explored: <strong className="text-purple-300 font-bold">{visitedCount}</strong></span>
            <span>Shortest Path: <strong className="text-amber-400 font-bold">{pathLen > 0 ? `${pathLen} steps` : '—'}</strong></span>
          </div>
        </div>

        {/* Dijkstra Interactive Grid */}
        <div className="overflow-x-auto py-2 flex justify-center select-none">
          <div
            className="grid gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/10 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${MINI_COLS}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                let cellClass = 'bg-white/90 hover:bg-white border-white/80 shadow-xs';
                if (cell.isWall) cellClass = 'bg-slate-900 border-slate-950 shadow-inner';
                else if (cell.isStart) cellClass = 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/40 ring-2 ring-emerald-400/50';
                else if (cell.isTarget) cellClass = 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-500/40 ring-2 ring-rose-400/50';
                else if (cell.isPath) cellClass = 'bg-amber-400 border-amber-300 text-amber-900 animate-pulse shadow-md shadow-amber-400/40';
                else if (cell.isVisited) cellClass = 'bg-indigo-400/50 border-indigo-300/40';

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => toggleWall(r, c)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 border text-[10px] ${cellClass}`}
                    title={cell.isStart ? 'Start Node' : cell.isTarget ? 'Target Node' : 'Click to toggle wall'}
                  >
                    {cell.isStart && <MapPin className="w-3.5 h-3.5 fill-white text-emerald-600" />}
                    {cell.isTarget && <Target className="w-3.5 h-3.5 text-white" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Status prompt */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-1">
          <span className="text-purple-400">💡</span>
          <span>{status}</span>
        </div>
      </div>

      {/* Right: Code Editor Panel */}
      <div className="hidden lg:flex flex-col w-80 border-l border-white/10 bg-slate-950/70 p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-200 font-semibold">dijkstra.cpp</span>
          </div>
          <span className="text-[10px] text-purple-300/70 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">C++ STL</span>
        </div>

        <div className="font-mono text-[11px] leading-5 space-y-0.5 flex-1 select-none overflow-hidden">
          {dijkstraCode.map((line, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="w-4 text-right text-slate-600 shrink-0 select-none">{line.text ? line.num : ''}</span>
              <span className={`truncate ${line.color}`}>{line.text || '\u00a0'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const INITIAL_ARRAY = [52, 28, 85, 14, 63, 39, 91, 18, 74, 45, 33, 67];

const ALGO_METRICS = {
  bubble: { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
  quick: { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
  insertion: { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
  selection: { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' }
};

const MiniSorting = () => {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [status, setStatus] = useState('Select an algorithm and click Run Sort to see live bar reallocations.');
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const cancelRef = useRef(false);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const generateRandomArray = () => {
    if (isRunning) { cancelRef.current = true; setIsRunning(false); }
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 15);
    setArray(newArr);
    setComparing([]); setSwapping([]); setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setStatus('Generated new randomized array. Ready to sort.');
  };

  const resetToDefault = () => {
    if (isRunning) { cancelRef.current = true; setIsRunning(false); }
    setArray([...INITIAL_ARRAY]);
    setComparing([]); setSwapping([]); setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setStatus('Reset to default array. Ready.');
  };

  const runSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    cancelRef.current = false;
    setComparing([]); setSwapping([]); setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    const arr = [...array];
    let comparisons = 0, swaps = 0;
    const stepDelay = 60;

    try {
      if (algorithm === 'bubble') {
        const n = arr.length; const settled = [];
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (cancelRef.current) return;
            setComparing([j, j + 1]); comparisons++;
            setStats(s => ({ ...s, comparisons }));
            setStatus(`Comparing arr[${j}] (${arr[j]}) & arr[${j + 1}] (${arr[j + 1]})`);
            await delay(stepDelay);
            if (arr[j] > arr[j + 1]) {
              setSwapping([j, j + 1]); swaps++;
              setStats(s => ({ ...s, swaps }));
              await delay(stepDelay);
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setArray([...arr]);
            }
          }
          settled.push(n - 1 - i); setSortedIndices([...settled]);
        }
        settled.push(0); setSortedIndices([...settled]);
      } else if (algorithm === 'selection') {
        const n = arr.length; const settled = [];
        for (let i = 0; i < n; i++) {
          let minIdx = i;
          for (let j = i + 1; j < n; j++) {
            if (cancelRef.current) return;
            setComparing([minIdx, j]); comparisons++;
            setStats(s => ({ ...s, comparisons }));
            setStatus(`Scanning: comparing ${arr[j]} with current minimum ${arr[minIdx]}`);
            await delay(stepDelay);
            if (arr[j] < arr[minIdx]) minIdx = j;
          }
          if (minIdx !== i) {
            setSwapping([i, minIdx]); swaps++;
            setStats(s => ({ ...s, swaps }));
            await delay(stepDelay);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            setArray([...arr]);
          }
          settled.push(i); setSortedIndices([...settled]);
        }
      } else if (algorithm === 'insertion') {
        const n = arr.length; const settled = [0]; setSortedIndices([...settled]);
        for (let i = 1; i < n; i++) {
          let key = arr[i]; let j = i - 1;
          setStatus(`Inserting key ${key} into sorted left partition`);
          while (j >= 0 && arr[j] > key) {
            if (cancelRef.current) return;
            setComparing([j, j + 1]); comparisons++;
            setStats(s => ({ ...s, comparisons }));
            await delay(stepDelay);
            setSwapping([j, j + 1]); swaps++;
            setStats(s => ({ ...s, swaps }));
            arr[j + 1] = arr[j]; setArray([...arr]); j--;
          }
          arr[j + 1] = key; setArray([...arr]);
          settled.push(i); setSortedIndices([...settled]);
        }
      } else if (algorithm === 'quick') {
        const settled = new Set();
        async function quickSortHelper(low, high) {
          if (low < high) {
            if (cancelRef.current) return;
            const pivotIdx = await partition(low, high);
            settled.add(pivotIdx); setSortedIndices(Array.from(settled));
            await quickSortHelper(low, pivotIdx - 1);
            await quickSortHelper(pivotIdx + 1, high);
          } else if (low === high) { settled.add(low); setSortedIndices(Array.from(settled)); }
        }
        async function partition(low, high) {
          const pivot = arr[high];
          setStatus(`Pivot selected: ${pivot} at index ${high}`);
          let i = low - 1;
          for (let j = low; j < high; j++) {
            if (cancelRef.current) return;
            setComparing([j, high]); comparisons++;
            setStats(s => ({ ...s, comparisons }));
            await delay(stepDelay);
            if (arr[j] < pivot) {
              i++;
              if (i !== j) {
                setSwapping([i, j]); swaps++;
                setStats(s => ({ ...s, swaps }));
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                await delay(stepDelay);
              }
            }
          }
          setSwapping([i + 1, high]); swaps++;
          setStats(s => ({ ...s, swaps }));
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          setArray([...arr]); await delay(stepDelay);
          return i + 1;
        }
        await quickSortHelper(0, arr.length - 1);
        setSortedIndices(arr.map((_, idx) => idx));
      }
      setComparing([]); setSwapping([]);
      setSortedIndices(arr.map((_, i) => i));
      setStatus(`✅ Sorted! Comparisons: ${comparisons}, in-place swaps: ${swaps}.`);
    } finally { setIsRunning(false); }
  };

  const metric = ALGO_METRICS[algorithm] || ALGO_METRICS.bubble;

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-xl border border-white/10">
            {Object.keys(ALGO_METRICS).map(algoKey => (
              <button
                key={algoKey}
                disabled={isRunning}
                onClick={() => { setAlgorithm(algoKey); resetToDefault(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  algorithm === algoKey ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-white disabled:opacity-40'
                }`}
              >
                {ALGO_METRICS[algoKey].name.replace(' Sort', '')}
              </button>
            ))}
          </div>
          <button onClick={runSort} disabled={isRunning} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-40 transition-all shadow-md shadow-amber-500/20 text-xs">
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Sorting...' : 'Run Sort'}</span>
          </button>
          <button onClick={generateRandomArray} disabled={isRunning} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-medium hover:bg-white/15 disabled:opacity-40 text-xs">Randomize</button>
          <button onClick={resetToDefault} disabled={isRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 font-medium hover:bg-white/10 disabled:opacity-40 text-xs">Reset</button>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Time: <strong className="text-amber-400">{metric.time}</strong></span>
          <span>Comparisons: <strong className="text-purple-300">{stats.comparisons}</strong></span>
          <span>Swaps: <strong className="text-emerald-400">{stats.swaps}</strong></span>
        </div>
      </div>

      <div className="bg-black/40 p-4 rounded-2xl border border-white/10 select-none shadow-inner">
        <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-1">
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx);
            const isSwapping = swapping.includes(idx);
            const isSorted = sortedIndices.includes(idx);
            let barColor = 'bg-slate-700';
            if (isSwapping) barColor = 'bg-rose-500 shadow-lg shadow-rose-500/40 scale-105';
            else if (isComparing) barColor = 'bg-amber-400 shadow-lg shadow-amber-400/40 scale-105';
            else if (isSorted) barColor = 'bg-emerald-500 shadow-md shadow-emerald-500/30';
            const heightPercent = Math.max(12, Math.min(100, (val / 100) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                <span className={`text-[10px] font-mono font-bold mb-1 transition-colors ${isSwapping ? 'text-rose-400' : isComparing ? 'text-amber-400' : isSorted ? 'text-emerald-400' : 'text-slate-400'}`}>{val}</span>
                <div style={{ height: `${heightPercent}%` }} className={`w-full rounded-t-lg transition-all duration-150 ${barColor}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 font-mono">{status}</div>
    </div>
  );
};

// ==========================================
// MAIN REDESIGNED LANDING PAGE
// ==========================================
export const LandingPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('dijkstra');

  const handleStartLearning = () => onNavigate('diagnostic');
  const handleExploreFeatures = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F7F5FF] via-[#FAF9FF] to-white text-navy-900 selection:bg-purple-200">

      {/* ============================================================
          SECTION 1: HERO
      ============================================================ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-12 pb-20 sm:pb-24">
        {/* Soft Lavender & Purple Aurora Blobs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/3" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-indigo-200/35 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-violet-100/60 rounded-full blur-[90px] pointer-events-none" />

        {/* Ambient Decorative Stars */}
        <div className="absolute top-14 left-[12%] text-purple-400/40 pointer-events-none animate-pulse">✦</div>
        <div className="absolute top-28 left-[24%] text-indigo-400/30 pointer-events-none text-xs">✦</div>
        <div className="absolute top-44 left-[5%] text-purple-300/40 pointer-events-none text-sm">✦</div>
        <div className="absolute top-20 right-[15%] text-purple-400/40 pointer-events-none text-sm">✦</div>
        <div className="absolute top-52 right-[6%] text-indigo-400/30 pointer-events-none">✦</div>
        <div className="absolute bottom-20 left-[20%] text-purple-400/30 pointer-events-none text-xs">✦</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              
              {/* Announcement Pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-brand-purple border border-purple-200/70 shadow-[0_2px_10px_rgba(124,58,237,0.06)] backdrop-blur-md mb-8 hover:bg-white transition-all cursor-pointer"
                onClick={() => onNavigate('diagnostic')}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>LearnLoop AI · Adaptive Cognitive Learning Engine</span>
                <ChevronRight className="w-3.5 h-3.5 text-brand-purple/70" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-navy-950 tracking-tight leading-[1.08] mb-6"
              >
                Stop studying everything.{' '}
                <br className="hidden sm:inline" />
                <span className="relative inline-block bg-gradient-to-r from-brand-purple via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Start mastering what
                </span>{' '}
                <span className="relative inline-block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  matters.
                  {/* Decorative curved SVG underline under 'matters.' */}
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3 text-purple-500 overflow-visible" 
                    viewBox="0 0 160 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2 9C40 2 120 2 158 8" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </span>
              </motion.h1>

              {/* Subtitle Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-navy-600 max-w-xl leading-relaxed mb-10 font-normal"
              >
                Your personal AI learning companion that understands your strengths, identifies your weaknesses, and builds a dynamic learning path around you.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={handleStartLearning}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 shadow-[0_10px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleExploreFeatures}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-navy-700 bg-white/80 hover:bg-white border border-purple-200/80 hover:border-purple-300 shadow-[0_4px_15px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-navy-700 text-navy-700" />
                  <span>Explore Features</span>
                </button>
              </motion.div>

              {/* Floating Streak Card (bottom-left alignment) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.08)] backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
                  <Flame className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-navy-950 flex items-center gap-1">
                    <span>12 day learning streak</span>
                    <span>🔥</span>
                  </div>
                  <div className="text-xs text-navy-500 font-medium">Consistent daily progress</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Graduation Cap Centerpiece with Floating Analytics Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] lg:min-h-[480px]">
              
              {/* 3D Graduation Cap Centerpiece */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative z-10"
              >
                <GraduationCap3D />
              </motion.div>

              {/* Floating Card: Accuracy Improved (+24%) */}
              <motion.div
                initial={{ opacity: 0, y: -25, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-2 left-0 sm:-left-6 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 border border-emerald-100 shadow-[0_12px_35px_rgba(16,185,129,0.12)] backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-navy-600">Your accuracy</div>
                  <div className="text-sm font-bold text-navy-900">
                    improved by <span className="text-emerald-600 font-extrabold text-base">24% ↗</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card: Next Up Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-6 right-0 sm:-right-4 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 border border-purple-100 shadow-[0_12px_35px_rgba(99,102,241,0.12)] backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-brand-purple">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Next Up:</div>
                  <div className="text-xs font-extrabold text-navy-950 flex items-center gap-1">
                    <span>Graph Algorithms</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-purple" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge: Verified Mastery */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-6 right-2 sm:right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-amber-100 shadow-[0_8px_25px_rgba(245,158,11,0.12)] backdrop-blur-md"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-navy-900">Mastery Calibrated</span>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: LIVE INTERACTIVE PLAYGROUND
      ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              Live Interactive Playground
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Explore Algorithms. Visualize the Logic.
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Interact with popular algorithms and see them in action.
            </p>
          </div>

          {/* Premium Glass Container */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.25)] bg-[#0F1422] text-white"
          >
            {/* Top macOS-style Window Bar */}
            <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block shadow-sm" />
                <div className="ml-3 flex items-center gap-1.5 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white font-bold">Live Interactive Playground:</span>
                  <span className="text-slate-400 hidden sm:inline">zero sign-in required</span>
                </div>
              </div>

              {/* Algorithm Selector Tabs */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActivePreviewTab('dijkstra')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === 'dijkstra'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dijkstra Shortest Path</span>
                </button>
                <button
                  onClick={() => setActivePreviewTab('sorting')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === 'sorting'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Sorting Algorithms</span>
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="min-h-[360px] bg-gradient-to-b from-[#13192B] to-[#0A0D17]">
              {activePreviewTab === 'dijkstra' ? <MiniDijkstra /> : <MiniSorting />}
            </div>

            {/* Bottom Window Footer with Navigation Pills */}
            <div className="border-t border-white/10 bg-black/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
                Full visualizer suite includes Min/Max Heaps, AVL Trees, Call Stacks & Graph BFS/DFS.
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('visualizer')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all"
                >
                  <span>Explore All 8 Interactive Visualizers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('diagnostic')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                >
                  <span>Take Diagnostic</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ============================================================
          SECTION 3: THE INTELLIGENT LEARNING LOOP
      ============================================================ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F7F5FF] via-[#FAF9FF] to-white relative overflow-hidden">
        {/* Subtle separator glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 shadow-xs mb-3">
              ✦ The Intelligent Learning Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Four steps from knowledge gaps to total mastery.
            </h2>
            <p className="text-navy-600 mt-3 text-base leading-relaxed">
              Traditional platforms present rigid linear video playlists, LearnLoop continuously adapts to your cognitive velocity.
            </p>
          </div>

          {/* 4 Interconnected Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                icon: Activity,
                iconBg: 'bg-purple-100 text-brand-purple',
                borderHover: 'hover:border-purple-300',
                title: 'Diagnostic Assessment',
                desc: 'A rapid 10-topic survey that calculates your baseline mastery across Arrays, Recursion, Trees, Graphs, and DP.',
                linkText: 'Start Diagnostic',
                nav: 'diagnostic',
              },
              {
                step: '02',
                icon: Network,
                iconBg: 'bg-indigo-100 text-indigo-600',
                borderHover: 'hover:border-indigo-300',
                title: 'Knowledge Graph Mapping',
                desc: 'Deterministic mathematical scoring maps attempts, mistake frequency, response times, and prerequisite dependency chains.',
                linkText: 'View Knowledge Graph',
                nav: 'roadmap',
              },
              {
                step: '03',
                icon: BrainCircuit,
                iconBg: 'bg-emerald-100 text-emerald-600',
                borderHover: 'hover:border-emerald-300',
                title: 'Adaptive Question Selection',
                desc: 'Answer correctly? Step up to harder challenges. Repeated mistakes? The backend steps down to prerequisite foundations.',
                linkText: 'Try Adaptive Quiz',
                nav: 'adaptive',
              },
              {
                step: '04',
                icon: Sparkles,
                iconBg: 'bg-amber-100 text-amber-600',
                borderHover: 'hover:border-amber-300',
                title: 'Socratic AI Tutor',
                desc: 'Sub-second LPU reasoning with 50+ topic DSA heuristics. Explains concepts calibrated precisely to your active mastery frontier.',
                linkText: 'Ask AI Tutor',
                nav: 'tutor',
              },
            ].map((stepItem, idx) => {
              const Icon = stepItem.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => onNavigate(stepItem.nav)}
                  className={`group relative p-6 rounded-3xl bg-white border border-purple-100/90 shadow-[0_4px_20px_rgba(124,58,237,0.05)] hover:shadow-[0_12px_35px_rgba(124,58,237,0.12)] hover:-translate-y-1 ${stepItem.borderHover} transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    {/* Top Header: Icon & Step Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${stepItem.iconBg} flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        Step #{stepItem.step}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg font-bold text-navy-950 group-hover:text-brand-purple transition-colors mb-2">
                      {stepItem.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs text-navy-600 leading-relaxed font-normal">
                      {stepItem.desc}
                    </p>
                  </div>

                  {/* Bottom Link with Arrow */}
                  <div className="mt-6 pt-4 border-t border-purple-50 flex items-center justify-between text-xs font-bold text-brand-purple">
                    <span>{stepItem.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: TECHNICAL FEATURES
      ============================================================ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 shadow-xs mb-3">
              ✦ Engineered for Competitive Learning
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Built for learners who refuse to waste hours on fluff.
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Deterministic mathematics, topological graph sorting, and resilient multi-tier AI inference.
            </p>
          </div>

          {/* 3 Large Technical Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Transparent Mastery Algorithm */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="p-7 rounded-3xl bg-white border border-purple-100 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_14px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-brand-purple flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-purple-50 text-brand-purple px-2.5 py-1 rounded-full border border-purple-200">
                    Deterministic Math
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-2">Transparent Mastery Algorithm</h3>
                <p className="text-xs text-navy-600 leading-relaxed font-normal">
                  No black-box hallucinated ratings. Mastery calculations are mathematically deterministic: factoring question weights, consecutive streaks, and mistake penalties.
                </p>
              </div>

              {/* Micro Formula Display matching reference mockup */}
              <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-purple-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-navy-500 font-semibold">Mastery Formula:</span>
                  <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    +14% Delta
                  </span>
                </div>
                <div className="font-mono text-[11px] text-navy-900 bg-white p-2.5 rounded-xl border border-purple-100 text-center font-bold">
                  ΔM = Base × (1 + Streak × 0.1) × W - Penalty
                </div>
                <div className="flex items-center justify-between text-[10px] text-navy-500 font-mono pt-0.5">
                  <span>Topic: Recursion</span>
                  <span className="text-brand-purple font-bold">35% → 49% (Verified)</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Topological Prerequisite Ordering */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-7 rounded-3xl bg-white border border-purple-100 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_14px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                    DAG Enforced
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-2">Topological Prerequisite Ordering</h3>
                <p className="text-xs text-navy-600 leading-relaxed font-normal">
                  If Recursion is weak, LearnLoop locks advanced Dynamic Programming and prioritizes call-stack mastery first, preventing cognitive overload.
                </p>
              </div>

              {/* Micro DAG Visual matching reference mockup */}
              <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-purple-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-navy-500 font-semibold">Prerequisite Chain:</span>
                  <span className="text-purple-600 font-bold text-[10px]">Strict DAG</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="flex-1 bg-white px-2.5 py-2 rounded-xl border border-rose-200 text-rose-700 font-bold text-center">
                    <div>Recursion</div>
                    <div className="text-[9px] text-rose-500">35% mastery</div>
                  </div>
                  <span className="text-purple-400 font-bold">→</span>
                  <div className="flex-1 bg-slate-100 px-2.5 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span className="font-bold">Dyn. Prog</span>
                    </div>
                    <div className="text-[9px] text-slate-400">Locked</div>
                  </div>
                </div>
                <div className="text-[10px] text-navy-500 font-mono text-center pt-0.5">
                  Unlocks automatically at ≥ 60% base case mastery
                </div>
              </div>
            </motion.div>

            {/* Card 3: Multi-Tier Resilient AI Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-7 rounded-3xl bg-white border border-purple-100 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_14px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                    Zero Downtime
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-2">Multi-Tier Resilient AI Stack</h3>
                <p className="text-xs text-navy-600 leading-relaxed font-normal">
                  Dual-layer intelligence: blazing-fast Groq LPU (GPT-OSS 120B) for instant Socratic reasoning, backed by a built-in pedagogical knowledge engine covering 50+ DSA topics if offline.
                </p>
              </div>

              {/* Micro Architecture Stack Widget matching reference mockup */}
              <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-navy-500 font-semibold">Inference Stack:</span>
                  <span className="text-emerald-600 font-bold text-[10px]">Active</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-purple-200/80 text-brand-purple font-bold">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-brand-purple fill-brand-purple" />
                      Tier 1: Groq LPU (120B)
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">~300 tok/s</span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-slate-500" />
                      Tier 2: 50+ Topic Local
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Offline</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Conversion Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(99,102,241,0.25)]"
          >
            <div className="max-w-xl text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to experience true adaptive learning?
              </h3>
              <p className="text-purple-100 text-sm mt-2 leading-relaxed font-normal">
                Start your personalized technical learning journey with dynamic practice and real-time gap analysis.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleStartLearning}
                className="px-7 py-3.5 rounded-2xl font-bold text-sm text-brand-purple bg-white hover:bg-purple-50 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Take 5-Min Diagnostic →
              </button>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};
