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
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

// ==========================================
// 3D GRADUATION CAP WITH ORBITAL RING (PURE SVG)
// Smooth 3D geometry matching user reference exactly
// ==========================================
const GraduationCap3D = () => (
  <div className="relative w-64 h-56 sm:w-72 sm:h-64 lg:w-84 lg:h-72 flex items-center justify-center select-none pointer-events-none">
    
    {/* Soft ambient violet background aura */}
    <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-purple-400/20 via-indigo-300/30 to-violet-400/25 blur-3xl" />

    {/* SVG 3D Graduation Cap & Orbit */}
    <svg 
      viewBox="0 0 340 300" 
      className="w-full h-full overflow-visible drop-shadow-[0_18px_30px_rgba(79,70,229,0.25)]"
    >
      <defs>
        {/* Top Diamond Face Gradient */}
        <linearGradient id="capTop3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="30%" stopColor="#6366F1" />
          <stop offset="70%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>

        {/* Left Edge Bevel Gradient (in shadow) */}
        <linearGradient id="capLeftEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Right Edge Bevel Gradient */}
        <linearGradient id="capRightEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        {/* Skull Cap Crown Gradient (cylindrical 3D dome) */}
        <linearGradient id="skullCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="25%" stopColor="#4338CA" />
          <stop offset="65%" stopColor="#3730A3" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Gold Tassel Gradient */}
        <linearGradient id="goldTassel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Gold Button Radial */}
        <radialGradient id="goldBtn" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>

        {/* Orbital Ring Gradient */}
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#818CF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 1. Ground Drop Shadow under cap */}
      <ellipse cx="170" cy="235" rx="60" ry="14" fill="#1E1B4B" opacity="0.18" />
      <ellipse cx="170" cy="235" rx="42" ry="9" fill="#312E81" opacity="0.22" />

      {/* 2. Large Orbital Ellipse Ring (Passing around the cap) */}
      <ellipse 
        cx="170" 
        cy="180" 
        rx="148" 
        ry="50" 
        fill="none" 
        stroke="url(#orbitGrad)" 
        strokeWidth="1.8" 
        transform="rotate(-18 170 180)" 
      />

      {/* 3. Skull Cap Crown Base (underneath the mortarboard) */}
      <path
        d="M 124 135 
           C 120 165 125 198 132 208 
           C 142 222 198 222 208 208 
           C 215 198 220 165 216 135 
           Z"
        fill="url(#skullCapGrad)"
      />
      {/* Crown base rim shadow */}
      <path
        d="M 132 208 C 142 222 198 222 208 208 C 198 214 142 214 132 208 Z"
        fill="#0F172A"
        opacity="0.6"
      />

      {/* 4. Mortarboard 3D Slab Thickness (Bevel Faces) */}
      {/* Left Bevel Face */}
      <polygon 
        points="52,110 170,158 170,170 52,122" 
        fill="url(#capLeftEdge)" 
      />
      {/* Right Bevel Face */}
      <polygon 
        points="170,158 288,110 288,122 170,170" 
        fill="url(#capRightEdge)" 
      />

      {/* 5. Mortarboard Top Face (Smooth Isometric Rhombus) */}
      <polygon 
        points="170,62 288,110 170,158 52,110" 
        fill="url(#capTop3D)" 
      />

      {/* Top Face Specular Highlight (soft gloss along front-left edge) */}
      <polygon 
        points="170,63 228,87 170,111 112,87" 
        fill="#FFFFFF" 
        opacity="0.12" 
      />

      {/* 6. Golden Center Button */}
      <ellipse cx="170" cy="110" rx="7" ry="4.5" fill="url(#goldBtn)" />

      {/* 7. Golden Tassel String Drape */}
      <path 
        d="M 170 110 
           C 215 106 256 122 258 155 
           C 260 174 256 195 253 210" 
        fill="none" 
        stroke="url(#goldTassel)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />

      {/* Tassel Ring / Clip */}
      <ellipse cx="253" cy="210" rx="3.5" ry="2" fill="#FDE047" />

      {/* Tassel Brush / Fringe */}
      <path 
        d="M 249 211 L 245 244 C 249 248 257 248 261 244 L 257 211 Z" 
        fill="url(#goldTassel)" 
      />
      <line x1="250" y1="216" x2="248" y2="242" stroke="#FEF08A" strokeWidth="0.8" opacity="0.8" />
      <line x1="253" y1="216" x2="253" y2="245" stroke="#FEF08A" strokeWidth="0.8" opacity="0.9" />
      <line x1="256" y1="216" x2="258" y2="242" stroke="#FEF08A" strokeWidth="0.8" opacity="0.8" />

      {/* 8. Four-Point Sparkle Star ✦ (to the right of the cap, matching Image 2) */}
      <path 
        d="M 305 180 Q 305 170 310 165 Q 305 160 305 150 Q 305 160 300 165 Q 305 170 305 180 Z" 
        fill="#8B5CF6" 
      />
    </svg>
  </div>
);

// ==========================================
// MINI INTERACTIVE PLAYGROUND (DIJKSTRA & SORTING)
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

        {/* Dijkstra Grid */}
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
// EXACT REPLICATION OF USER'S REFERENCE IMAGE
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
    <div className="relative overflow-hidden bg-[#F0EDFF] text-navy-900 selection:bg-purple-200">

      {/* ============================================================
          SECTION 1: HERO — PIXEL-PERFECT REPLICATION OF IMAGE 2
      ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#F0EDFF] pt-8 pb-14 sm:pt-12 sm:pb-20">

        {/* ── BACKGROUND LAYER 1: Left organic lavender wave blob ── */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Outer left blob */}
              <linearGradient id="blobOuter" x1="0" y1="0" x2="600" y2="700" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="1" />
                <stop offset="40%" stopColor="#DDD6FE" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#EDE9FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              {/* Inner left blob (darker, narrower — depth layer) */}
              <linearGradient id="blobInner" x1="0" y1="0" x2="400" y2="700" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0" />
              </linearGradient>
              {/* Bright light-catch edge */}
              <linearGradient id="blobEdge" x1="0" y1="0" x2="80" y2="700" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E9D5FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.3" />
              </linearGradient>
              {/* Right bottom swell */}
              <radialGradient id="rightSwell" cx="85%" cy="90%" r="45%" fx="85%" fy="90%">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.65" />
                <stop offset="45%" stopColor="#DDD6FE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </radialGradient>
              {/* Top right soft glow */}
              <radialGradient id="topRightGlow" cx="90%" cy="10%" r="35%">
                <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </radialGradient>
              {/* Soft blur filter for depth */}
              <filter id="softBlur">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <filter id="medBlur">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* Full background base tint */}
            <rect width="1440" height="700" fill="#EEE9FF" />

            {/* Centre atmospheric glow */}
            <ellipse cx="720" cy="350" rx="600" ry="300" fill="white" fillOpacity="0.35" filter="url(#softBlur)" />

            {/* RIGHT: Soft swell from bottom-right corner */}
            <ellipse cx="1300" cy="650" rx="520" ry="380" fill="url(#rightSwell)" filter="url(#softBlur)" />

            {/* TOP-RIGHT: subtle warm glow */}
            <ellipse cx="1350" cy="80" rx="300" ry="200" fill="url(#topRightGlow)" filter="url(#softBlur)" />

            {/* LEFT: OUTER organic blob — full height, wide coverage */}
            <path
              d="M 0 0
                 C 180 30 420 160 380 340
                 C 340 500 160 600 0 700
                 Z"
              fill="url(#blobOuter)"
            />

            {/* LEFT: INNER depth blob — slightly narrower, more saturated */}
            <path
              d="M 0 0
                 C 100 50 280 190 240 370
                 C 200 520 60 630 0 700
                 Z"
              fill="url(#blobInner)"
            />

            {/* LEFT: Bright caught-light edge strip */}
            <path
              d="M 0 0
                 C 40 80 80 220 60 380
                 C 40 510 10 620 0 700
                 L 0 0 Z"
              fill="url(#blobEdge)"
              filter="url(#medBlur)"
            />
          </svg>
        </div>

        {/* ── BACKGROUND LAYER 2: Soft ambient glow orbs ── */}
        <div className="absolute top-8 left-[18%] w-72 h-72 rounded-full bg-purple-300/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 left-[12%] w-64 h-64 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 right-[5%] w-[500px] h-[380px] rounded-full bg-violet-300/20 blur-3xl pointer-events-none z-0" />

        {/* ── SPARKLE STARS ── */}
        <div className="absolute top-10 left-[22%] text-purple-500 font-bold text-base pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute top-[45%] left-[8%] text-purple-400 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>
        <div className="absolute top-24 right-[22%] text-purple-400 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>
        <div className="absolute top-[55%] right-[10%] text-indigo-500 font-bold text-sm pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute top-[30%] right-[28%] text-purple-300 font-bold text-[10px] pointer-events-none select-none z-10 opacity-50">✦</div>

        {/* ── MAIN CONTENT WRAPPER ── */}
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 w-full z-10 min-h-[600px] sm:min-h-[660px] flex items-center justify-center">

          {/* ── TOP-LEFT CARD: Accuracy ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="hidden md:block absolute top-6 lg:top-10 left-2 sm:left-6 lg:left-10 z-20 w-52 lg:w-60 p-3.5 lg:p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-[0_8px_32px_rgba(109,40,217,0.12)] transform -rotate-6 select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <div className="flex items-end gap-0.5 h-5">
                  <span className="w-1.5 h-2.5 bg-emerald-400 rounded-sm" />
                  <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm" />
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-sm" />
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium text-slate-400 leading-tight">Your accuracy</div>
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  improved by <span className="text-emerald-500 font-extrabold text-sm">24% ↗</span>
                </div>
              </div>
            </div>
            <svg className="w-full h-7 mt-3 overflow-visible" viewBox="0 0 160 28" fill="none">
              <path d="M 5 20 Q 30 8 50 18 T 90 15 T 130 7 T 155 4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          {/* ── BOTTOM-LEFT CARD: Learning Streak ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="hidden md:block absolute bottom-6 lg:bottom-10 left-2 sm:left-6 lg:left-14 z-20 w-46 lg:w-52 p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-[0_8px_32px_rgba(109,40,217,0.12)] transform rotate-3 select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-800 leading-tight">12 day</div>
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 leading-tight">
                  learning streak <span>🔥</span>
                </div>
              </div>
            </div>
            <svg className="w-full h-7 mt-3 overflow-visible" viewBox="0 0 160 28" fill="none">
              <path d="M 5 18 Q 35 24 60 12 T 100 18 T 135 7 T 155 12" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          {/* ── CENTERED HERO TEXT ── */}
          <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center flex flex-col items-center py-8">

            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => onNavigate('diagnostic')}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-purple-700 border border-purple-200/70 shadow-sm mb-7 hover:bg-white transition-all cursor-pointer backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Solveo · Your space to become a better problem-solver.</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </motion.div>

            {/* Headline — 3 lines matching reference: line1 black, line2+3 purple, underline under "matters." */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-[32px] sm:text-[42px] lg:text-[50px] xl:text-[56px] font-extrabold tracking-tight leading-[1.16] mb-6"
            >
              {/* Line 1 — black */}
              <span className="block text-[#09090B]">Stop studying everything.</span>
              {/* Line 2 — purple gradient */}
              <span className="block bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#5B21B6] bg-clip-text text-transparent">
                Start mastering what
              </span>
              {/* Line 3 — purple gradient + swoosh underline */}
              <span className="relative inline-block bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] bg-clip-text text-transparent">
                matters.
                {/* Hand-drawn curved swoosh underline — matching Image 2 */}
                <svg
                  className="absolute left-0 w-full pointer-events-none overflow-visible"
                  viewBox="0 0 240 18"
                  fill="none"
                  preserveAspectRatio="none"
                  style={{ bottom: '-12px', height: '16px' }}
                >
                  <path
                    d="M 3 12 C 65 22 172 20 237 5"
                    stroke="#7C3AED"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-sm sm:text-base lg:text-[16px] text-slate-600 max-w-lg mx-auto leading-relaxed mb-9"
            >
              Your space to become a better problem-solver.{' '}
              <span className="font-semibold text-slate-700">Understands your strengths,</span>{' '}
              identifies your weaknesses, and builds a dynamic learning path around you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={handleStartLearning}
                className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#5558E8] hover:to-[#6D28D9] shadow-[0_8px_26px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleExploreFeatures}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-slate-700 bg-white/90 hover:bg-white border border-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200"
              >
                <Play className="w-3.5 h-3.5 fill-slate-700" /> Explore Features
              </button>
            </motion.div>
          </div>

          {/* ── TOP-RIGHT CARD: Next Up ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="hidden md:block absolute top-6 lg:top-10 right-2 sm:right-6 lg:right-10 z-20 w-52 lg:w-60 p-3.5 lg:p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-[0_8px_32px_rgba(109,40,217,0.12)] transform rotate-6 select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-purple-600" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next up:</div>
                <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  Graph Algorithms <ArrowRight className="w-3 h-3 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="mt-3.5 w-full h-2 bg-purple-100 rounded-full overflow-hidden">
              <div className="w-[68%] h-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] rounded-full" />
            </div>
          </motion.div>

          {/* ── BOTTOM-RIGHT: Graduation Cap ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4 }}
            className="hidden md:block absolute bottom-0 right-0 sm:right-2 lg:right-4 z-20"
          >
            <GraduationCap3D />
          </motion.div>

        </div>

        {/* Mobile strip */}
        <div className="md:hidden mt-8 px-4 flex flex-col items-center gap-4">
          <div className="w-full flex justify-center py-2">
            <GraduationCap3D />
          </div>
          <div className="flex flex-wrap justify-center gap-3 w-full">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 border border-purple-100 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-medium">Your accuracy</div>
                <div className="text-xs font-bold text-slate-900">improved by <span className="text-emerald-600 font-extrabold">24% ↗</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 border border-purple-100 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">12 day streak 🔥</div>
                <div className="text-[10px] text-slate-500">Daily practice active</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================================
          SECTION 2: LIVE INTERACTIVE PLAYGROUND
      ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#F0EDFF] py-24 px-4 sm:px-6 lg:px-8">
        
        {/* ── BACKGROUND LAYER: Organic lavender wave blobs + glows (Matching Hero) ── */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pgroundBlobRight" x1="1440" y1="0" x2="900" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#DDD6FE" stopOpacity="0.7" />
                <stop offset="85%" stopColor="#EDE9FE" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="pgroundBlobLeft" x1="0" y1="400" x2="500" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <filter id="pgroundBlur">
                <feGaussianBlur stdDeviation="24" />
              </filter>
            </defs>

            {/* Base tint */}
            <rect width="1440" height="800" fill="#F0EDFF" />

            {/* Central atmospheric soft glow */}
            <ellipse cx="720" cy="400" rx="550" ry="280" fill="white" fillOpacity="0.45" filter="url(#pgroundBlur)" />

            {/* RIGHT SIDE: Cascading organic ribbon wave */}
            <path
              d="M 1440 0
                 C 1260 80 1100 240 1140 460
                 C 1180 620 1320 720 1440 800
                 Z"
              fill="url(#pgroundBlobRight)"
            />

            {/* LEFT BOTTOM: Soft organic wave swell */}
            <path
              d="M 0 350
                 C 160 380 320 520 280 680
                 C 250 760 120 790 0 800
                 Z"
              fill="url(#pgroundBlobLeft)"
            />
          </svg>
        </div>

        {/* ── Soft ambient glow orbs ── */}
        <div className="absolute top-16 right-[12%] w-80 h-80 rounded-full bg-purple-300/25 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-12 left-[10%] w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none z-0" />

        {/* ── Sparkle stars ── */}
        <div className="absolute top-12 left-[15%] text-purple-400 font-bold text-sm pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute top-28 right-[18%] text-purple-500 font-bold text-base pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute bottom-20 right-[8%] text-indigo-400 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>
        <div className="absolute bottom-16 left-[22%] text-purple-300 font-bold text-sm pointer-events-none select-none z-10 opacity-60">✦</div>

        <div className="relative max-w-6xl mx-auto z-10">
          
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
      <section id="how-it-works" className="relative w-full overflow-hidden bg-[#F0EDFF] py-24 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle glowing horizontal divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-300/80 to-transparent z-10" />

        {/* ── BACKGROUND LAYER: Organic lavender wave blobs + glows (Matching Hero) ── */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 850" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="loopBlobLeft" x1="0" y1="0" x2="550" y2="850" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#DDD6FE" stopOpacity="0.75" />
                <stop offset="85%" stopColor="#EDE9FE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="loopBlobRight" x1="1440" y1="300" x2="950" y2="850" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <filter id="loopBlur">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>

            {/* Base tint */}
            <rect width="1440" height="850" fill="#F0EDFF" />

            {/* Central atmospheric soft glow */}
            <ellipse cx="720" cy="420" rx="600" ry="320" fill="white" fillOpacity="0.45" filter="url(#loopBlur)" />

            {/* LEFT SIDE: Flowing organic ribbon wave */}
            <path
              d="M 0 0
                 C 200 60 380 220 340 450
                 C 300 620 140 730 0 850
                 Z"
              fill="url(#loopBlobLeft)"
            />

            {/* RIGHT BOTTOM: Soft lavender horizon swell */}
            <path
              d="M 1440 280
                 C 1280 320 1120 480 1160 660
                 C 1190 760 1310 820 1440 850
                 Z"
              fill="url(#loopBlobRight)"
            />
          </svg>
        </div>

        {/* ── Soft ambient glow orbs ── */}
        <div className="absolute top-16 left-[14%] w-80 h-80 rounded-full bg-purple-300/25 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-12 right-[12%] w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none z-0" />

        {/* ── Sparkle stars ── */}
        <div className="absolute top-14 left-[20%] text-purple-500 font-bold text-base pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute top-24 right-[16%] text-purple-400 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>
        <div className="absolute bottom-16 left-[10%] text-indigo-400 font-bold text-sm pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute bottom-24 right-[25%] text-purple-300 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-purple-200/90 shadow-sm mb-3">
              ✦ The Intelligent Learning Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Four steps from knowledge gaps to total mastery.
            </h2>
            <p className="text-navy-600 mt-3 text-base leading-relaxed">
              Traditional platforms present rigid linear video playlists, Solveo continuously adapts to your cognitive velocity.
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
                  className={`group relative p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-purple-100/90 shadow-[0_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.16)] hover:-translate-y-1 ${stepItem.borderHover} transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${stepItem.iconBg} flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        Step #{stepItem.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-950 group-hover:text-brand-purple transition-colors mb-2">
                      {stepItem.title}
                    </h3>

                    <p className="text-xs text-navy-600 leading-relaxed font-normal">
                      {stepItem.desc}
                    </p>
                  </div>

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
      <section className="relative w-full overflow-hidden bg-[#F0EDFF] py-24 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle glowing horizontal divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-300/80 to-transparent z-10" />

        {/* ── BACKGROUND LAYER: Organic lavender wave blobs + glows (Matching Hero) ── */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="techBlobRight" x1="1440" y1="0" x2="880" y2="900" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.7" />
                <stop offset="85%" stopColor="#EDE9FE" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="techBlobLeft" x1="0" y1="200" x2="520" y2="900" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
              </linearGradient>
              <filter id="techBlur">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>

            {/* Base tint */}
            <rect width="1440" height="900" fill="#F0EDFF" />

            {/* Central atmospheric soft glow */}
            <ellipse cx="720" cy="450" rx="600" ry="340" fill="white" fillOpacity="0.45" filter="url(#techBlur)" />

            {/* RIGHT SIDE: Sweeping organic ribbon wave */}
            <path
              d="M 1440 0
                 C 1250 100 1080 300 1120 540
                 C 1160 720 1300 820 1440 900
                 Z"
              fill="url(#techBlobRight)"
            />

            {/* LEFT BOTTOM: Soft lavender wave swell */}
            <path
              d="M 0 180
                 C 180 220 340 400 300 620
                 C 260 760 120 840 0 900
                 Z"
              fill="url(#techBlobLeft)"
            />
          </svg>
        </div>

        {/* ── Soft ambient glow orbs ── */}
        <div className="absolute top-16 right-[14%] w-80 h-80 rounded-full bg-purple-300/25 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-16 left-[12%] w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl pointer-events-none z-0" />

        {/* ── Sparkle stars ── */}
        <div className="absolute top-12 left-[18%] text-purple-400 font-bold text-sm pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute top-28 right-[16%] text-purple-500 font-bold text-base pointer-events-none select-none z-10 opacity-70">✦</div>
        <div className="absolute bottom-24 right-[10%] text-indigo-400 font-bold text-xs pointer-events-none select-none z-10 opacity-60">✦</div>
        <div className="absolute bottom-20 left-[24%] text-purple-300 font-bold text-sm pointer-events-none select-none z-10 opacity-60">✦</div>

        <div className="relative max-w-6xl mx-auto z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-purple-200/90 shadow-sm mb-3">
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
              className="p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.16)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
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
              className="p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.16)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
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
                  If Recursion is weak, Solveo locks advanced Dynamic Programming and prioritizes call-stack mastery first, preventing cognitive overload.
                </p>
              </div>

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
              className="p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.16)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
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
