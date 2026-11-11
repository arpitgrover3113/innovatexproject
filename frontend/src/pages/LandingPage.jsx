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
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasteryBadge } from '../components/MasteryBadge';

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
  const [visitedCount, setVisitedCount] = useState(0);
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

    // Fast snappy animation
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

  return (
    <div className="space-y-4">
      {/* Controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-navy-50/80 p-3 rounded-2xl border border-navy-200/60">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runDijkstra}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-dark disabled:opacity-40 shadow-soft-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Routing...' : 'Run Dijkstra'}</span>
          </button>
          <button
            onClick={() => loadPreset('wall')}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-navy-200 text-navy-700 font-semibold hover:bg-navy-100 disabled:opacity-40"
          >
            Barrier
          </button>
          <button
            onClick={() => loadPreset('scatter')}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-navy-200 text-navy-700 font-semibold hover:bg-navy-100 disabled:opacity-40"
          >
            Rocks
          </button>
          <button
            onClick={clearPath}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-navy-200 text-navy-700 font-semibold hover:bg-navy-100 disabled:opacity-40"
          >
            Clear Path
          </button>
          <button
            onClick={resetAll}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-navy-100 text-navy-600 font-semibold hover:bg-navy-200 disabled:opacity-40"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-navy-600">
          <span>Explored: <strong className="text-brand-purple">{visitedCount}</strong></span>
          <span>Shortest Path: <strong className="text-amber-600">{pathLen > 0 ? `${pathLen} steps` : '—'}</strong></span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto p-3 bg-navy-950/5 rounded-2xl border border-navy-200/60 flex justify-center select-none">
        <div
          className="grid gap-1 bg-navy-200/80 p-1.5 rounded-xl"
          style={{ gridTemplateColumns: `repeat(${MINI_COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              let bg = 'bg-white hover:bg-navy-50';
              if (cell.isWall) bg = 'bg-navy-900 border-navy-950';
              else if (cell.isStart) bg = 'bg-emerald-500 text-white';
              else if (cell.isTarget) bg = 'bg-rose-500 text-white';
              else if (cell.isPath) bg = 'bg-amber-400 border-amber-500 animate-pulse';
              else if (cell.isVisited) bg = 'bg-brand-purple/30 border-brand-purple/50';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => toggleWall(r, c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center cursor-pointer transition-colors duration-150 border border-navy-200/40 text-[10px] ${bg}`}
                  title={cell.isStart ? 'Start Node' : cell.isTarget ? 'Target Node' : 'Click to toggle wall'}
                >
                  {cell.isStart && <MapPin className="w-3.5 h-3.5 fill-white text-emerald-500" />}
                  {cell.isTarget && <Target className="w-3.5 h-3.5 text-white" />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Status banner */}
      <div className="text-xs text-navy-600 font-medium bg-white px-3.5 py-2.5 rounded-xl border border-navy-200 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-navy-800">{status}</span>
        <span className="text-[10px] font-mono text-navy-400">Green = Start · Red = Target · Dark = Wall</span>
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
    if (isRunning) {
      cancelRef.current = true;
      setIsRunning(false);
    }
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 15);
    setArray(newArr);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setStatus('Generated new randomized array. Ready to sort.');
  };

  const resetToDefault = () => {
    if (isRunning) {
      cancelRef.current = true;
      setIsRunning(false);
    }
    setArray([...INITIAL_ARRAY]);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });
    setStatus('Reset to default array. Ready.');
  };

  const runSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    cancelRef.current = false;
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setStats({ comparisons: 0, swaps: 0 });

    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;
    const stepDelay = 60;

    try {
      if (algorithm === 'bubble') {
        const n = arr.length;
        const settled = [];
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (cancelRef.current) return;
            setComparing([j, j + 1]);
            comparisons++;
            setStats(s => ({ ...s, comparisons }));
            setStatus(`Comparing arr[${j}] (${arr[j]}) & arr[${j + 1}] (${arr[j + 1]})`);
            await delay(stepDelay);

            if (arr[j] > arr[j + 1]) {
              setSwapping([j, j + 1]);
              swaps++;
              setStats(s => ({ ...s, swaps }));
              setStatus(`${arr[j]} > ${arr[j + 1]} → Swapping adjacent bars`);
              await delay(stepDelay);
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setArray([...arr]);
            }
          }
          settled.push(n - 1 - i);
          setSortedIndices([...settled]);
        }
        settled.push(0);
        setSortedIndices([...settled]);
      } else if (algorithm === 'selection') {
        const n = arr.length;
        const settled = [];
        for (let i = 0; i < n; i++) {
          let minIdx = i;
          for (let j = i + 1; j < n; j++) {
            if (cancelRef.current) return;
            setComparing([minIdx, j]);
            comparisons++;
            setStats(s => ({ ...s, comparisons }));
            setStatus(`Scanning: comparing ${arr[j]} with current minimum ${arr[minIdx]}`);
            await delay(stepDelay);

            if (arr[j] < arr[minIdx]) {
              minIdx = j;
            }
          }
          if (minIdx !== i) {
            setSwapping([i, minIdx]);
            swaps++;
            setStats(s => ({ ...s, swaps }));
            setStatus(`Swapping minimum element ${arr[minIdx]} into position ${i}`);
            await delay(stepDelay);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            setArray([...arr]);
          }
          settled.push(i);
          setSortedIndices([...settled]);
        }
      } else if (algorithm === 'insertion') {
        const n = arr.length;
        const settled = [0];
        setSortedIndices([...settled]);
        for (let i = 1; i < n; i++) {
          let key = arr[i];
          let j = i - 1;
          setStatus(`Inserting key ${key} into sorted left partition`);
          while (j >= 0 && arr[j] > key) {
            if (cancelRef.current) return;
            setComparing([j, j + 1]);
            comparisons++;
            setStats(s => ({ ...s, comparisons }));
            await delay(stepDelay);

            setSwapping([j, j + 1]);
            swaps++;
            setStats(s => ({ ...s, swaps }));
            arr[j + 1] = arr[j];
            setArray([...arr]);
            j--;
          }
          arr[j + 1] = key;
          setArray([...arr]);
          settled.push(i);
          setSortedIndices([...settled]);
        }
      } else if (algorithm === 'quick') {
        const settled = new Set();
        async function quickSortHelper(low, high) {
          if (low < high) {
            if (cancelRef.current) return;
            const pivotIdx = await partition(low, high);
            settled.add(pivotIdx);
            setSortedIndices(Array.from(settled));
            await quickSortHelper(low, pivotIdx - 1);
            await quickSortHelper(pivotIdx + 1, high);
          } else if (low === high) {
            settled.add(low);
            setSortedIndices(Array.from(settled));
          }
        }

        async function partition(low, high) {
          const pivot = arr[high];
          setStatus(`Pivot selected: ${pivot} at index ${high}`);
          let i = low - 1;
          for (let j = low; j < high; j++) {
            if (cancelRef.current) return;
            setComparing([j, high]);
            comparisons++;
            setStats(s => ({ ...s, comparisons }));
            await delay(stepDelay);

            if (arr[j] < pivot) {
              i++;
              if (i !== j) {
                setSwapping([i, j]);
                swaps++;
                setStats(s => ({ ...s, swaps }));
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                await delay(stepDelay);
              }
            }
          }
          setSwapping([i + 1, high]);
          swaps++;
          setStats(s => ({ ...s, swaps }));
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          setArray([...arr]);
          await delay(stepDelay);
          return i + 1;
        }

        await quickSortHelper(0, arr.length - 1);
        setSortedIndices(arr.map((_, idx) => idx));
      }

      setComparing([]);
      setSwapping([]);
      setSortedIndices(arr.map((_, i) => i));
      setStatus(`✅ Sorted! Comparisons: ${comparisons}, in-place swaps: ${swaps}.`);
    } finally {
      setIsRunning(false);
    }
  };

  const metric = ALGO_METRICS[algorithm] || ALGO_METRICS.bubble;

  return (
    <div className="space-y-4">
      {/* Controls & Algorithms */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-navy-50/80 p-3 rounded-2xl border border-navy-200/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Algorithm selector pills */}
          <div className="flex items-center gap-1 p-0.5 bg-navy-200/70 rounded-lg">
            {Object.keys(ALGO_METRICS).map(algoKey => (
              <button
                key={algoKey}
                disabled={isRunning}
                onClick={() => {
                  setAlgorithm(algoKey);
                  resetToDefault();
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  algorithm === algoKey
                    ? 'bg-white text-brand-purple shadow-xs'
                    : 'text-navy-600 hover:text-navy-900 disabled:opacity-40'
                }`}
              >
                {ALGO_METRICS[algoKey].name.replace(' Sort', '')}
              </button>
            ))}
          </div>

          <button
            onClick={runSort}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-40 transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Sorting...' : 'Run Sort'}</span>
          </button>

          <button
            onClick={generateRandomArray}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-navy-200 text-navy-700 font-semibold hover:bg-navy-100 disabled:opacity-40"
          >
            Randomize
          </button>

          <button
            onClick={resetToDefault}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-navy-100 text-navy-600 font-semibold hover:bg-navy-200 disabled:opacity-40"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-navy-600">
          <span>Time: <strong className="text-amber-600 font-bold">{metric.time}</strong></span>
          <span>Comparisons: <strong className="text-brand-purple">{stats.comparisons}</strong></span>
          <span>Swaps: <strong className="text-emerald-600">{stats.swaps}</strong></span>
        </div>
      </div>

      {/* Bars Visualization Canvas */}
      <div className="bg-navy-950/5 p-4 rounded-2xl border border-navy-200/60 select-none">
        <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-2">
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx);
            const isSwapping = swapping.includes(idx);
            const isSorted = sortedIndices.includes(idx);

            let barColor = 'bg-navy-700';
            if (isSwapping) barColor = 'bg-red-500 shadow-md shadow-red-500/30 scale-105';
            else if (isComparing) barColor = 'bg-amber-400 shadow-md shadow-amber-400/30 scale-105';
            else if (isSorted) barColor = 'bg-emerald-500';

            const heightPercent = Math.max(12, Math.min(100, (val / 100) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className={`text-[10px] font-mono font-bold mb-1 transition-colors ${
                  isSwapping ? 'text-red-600' : isComparing ? 'text-amber-600' : isSorted ? 'text-emerald-600' : 'text-navy-400'
                }`}>
                  {val}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-150 flex items-center justify-center ${barColor}`}
                />
                <span className="text-[9px] font-mono text-navy-400 mt-1">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status banner */}
      <div className="text-xs text-navy-600 font-medium bg-white px-3.5 py-2.5 rounded-xl border border-navy-200 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-navy-800">{status}</span>
        <span className="text-[10px] font-mono text-navy-400">🟡 Compare · 🔴 Swap · 🟢 Sorted</span>
      </div>
    </div>
  );
};

export const LandingPage = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('dijkstra');

  const handleStartLearning = () => {
    onNavigate('diagnostic');
  };

  const handleExploreFeatures = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Top Announcement Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/10 text-brand-purple-dark border border-brand-purple/20 shadow-soft-xs mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-purple animate-pulse" />
          <span>LearnLoop AI · Adaptive Cognitive Learning Engine</span>
          <ChevronRight className="w-3.5 h-3.5 text-brand-purple" />
        </motion.div>

        {/* Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-900 tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Stop studying everything.{' '}
          <span className="bg-gradient-to-r from-brand-purple via-brand-purple-dark to-brand-blue bg-clip-text text-transparent">
            Start mastering what matters.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-navy-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Your personal AI learning companion that understands your strengths, identifies your weaknesses, and builds a dynamic learning path around you.
        </motion.p>

        {/* Call To Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleStartLearning}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-purple-dark to-brand-blue hover:from-brand-purple hover:to-brand-blue-dark shadow-soft-md hover:shadow-soft-lg hover:-translate-y-0.5 transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleExploreFeatures}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-navy-600 hover:text-navy-900 hover:bg-navy-100/50 transition-colors"
          >
            <span>Explore Features</span>
          </button>
        </motion.div>

        {/* Interactive Algorithm Playground (Zero Setup) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-navy-200/80 shadow-soft-xl overflow-hidden text-left"
        >
          {/* Top Window Bar */}
          <div className="bg-navy-950 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <div className="ml-3 flex items-center gap-1.5 text-xs font-mono text-navy-400">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span className="text-white font-semibold">Live Interactive Playground:</span>
                <span className="hidden sm:inline">zero sign-in required</span>
              </div>
            </div>
            
            {/* Visualizer Tab switchers */}
            <div className="flex items-center gap-1 bg-navy-900/90 p-1 rounded-xl border border-navy-800">
              <button 
                onClick={() => setActivePreviewTab('dijkstra')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePreviewTab === 'dijkstra' ? 'bg-brand-purple text-white shadow-soft-xs' : 'text-navy-400 hover:text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Dijkstra Shortest Path</span>
              </button>
              <button 
                onClick={() => setActivePreviewTab('sorting')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePreviewTab === 'sorting' ? 'bg-amber-500 text-white shadow-soft-xs' : 'text-navy-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Sorting Algorithms</span>
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-5 sm:p-7 bg-background-subtle/50 space-y-5">
            {activePreviewTab === 'dijkstra' ? (
              <MiniDijkstra />
            ) : (
              <MiniSorting />
            )}

            {/* Bottom Funnel Banner */}
            <div className="pt-2 border-t border-navy-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-950 to-brand-purple-dark p-4 rounded-2xl text-white">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-purple-light" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-purple-light">
                    Explore all 6 Interactive Visualizers
                  </span>
                </div>
                <p className="text-xs text-navy-200">
                  Full Lab includes <strong>Min/Max Binary Heap, AVL Tree Rotations, Recursion Call Stack, Graph BFS/DFS, and 5 Sorting Algorithms</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigate('visualizer')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-navy-900 hover:bg-navy-100 transition-all shadow-soft-xs"
                >
                  <span>Open Full Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('diagnostic')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple-dark text-white transition-all shadow-soft-xs"
                >
                  <span>Take Diagnostic</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* How It Works Section — The 4-Step Intelligent Learning Loop */}
      <section id="how-it-works" className="py-20 bg-white border-y border-navy-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
              The Intelligent Learning Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 tracking-tight">
              Four steps from knowledge gaps to total mastery.
            </h2>
            <p className="text-navy-600 mt-3 text-base">
              Traditional platforms present rigid linear video playlists. LearnLoop continuously adapts to your cognitive velocity.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1: Diagnostic Assessment */}
            <div 
              onClick={() => onNavigate('diagnostic')}
              className="group p-6 rounded-3xl bg-background border border-navy-200/80 hover:border-brand-purple/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-sm border border-brand-purple/20 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-brand-purple" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full">
                    Step 01
                  </span>
                </div>
                <div className="inline-block text-[10px] font-mono font-bold text-brand-purple bg-brand-purple/5 px-2 py-0.5 rounded mb-2 border border-brand-purple/15">
                  10 Topics · ~5 Mins
                </div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-purple transition-colors">
                  Diagnostic Assessment
                </h3>
                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  A rapid 10-topic survey that calculates your baseline mastery across Arrays, Recursion, Trees, Graphs, and DP.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-navy-200/60 flex items-center justify-between text-xs font-bold text-brand-purple">
                <span>Start Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 2: Knowledge Graph Mapping */}
            <div 
              onClick={() => onNavigate('roadmap')}
              className="group p-6 rounded-3xl bg-background border border-navy-200/80 hover:border-brand-blue/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm border border-brand-blue/20 group-hover:scale-105 transition-transform">
                    <Network className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full">
                    Step 02
                  </span>
                </div>
                <div className="inline-block text-[10px] font-mono font-bold text-brand-blue bg-brand-blue/5 px-2 py-0.5 rounded mb-2 border border-brand-blue/15">
                  DAG Topological Sort
                </div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-blue transition-colors">
                  Knowledge Graph Mapping
                </h3>
                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  Deterministic mathematical scoring maps attempts, mistake frequency, response times, and prerequisite dependency chains.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-navy-200/60 flex items-center justify-between text-xs font-bold text-brand-blue">
                <span>View Knowledge Graph</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 3: Adaptive Question Selection */}
            <div 
              onClick={() => onNavigate('adaptive')}
              className="group p-6 rounded-3xl bg-background border border-navy-200/80 hover:border-brand-emerald/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold text-sm border border-brand-emerald/20 group-hover:scale-105 transition-transform">
                    <BrainCircuit className="w-5 h-5 text-brand-emerald" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full">
                    Step 03
                  </span>
                </div>
                <div className="inline-block text-[10px] font-mono font-bold text-brand-emerald bg-brand-emerald/5 px-2 py-0.5 rounded mb-2 border border-brand-emerald/15">
                  3 Dynamic Tiers
                </div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-emerald transition-colors">
                  Adaptive Question Selection
                </h3>
                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  Answer correctly? Step up to harder challenges. Repeated mistakes? The backend steps down to prerequisite foundations.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-navy-200/60 flex items-center justify-between text-xs font-bold text-brand-emerald">
                <span>Try Adaptive Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 4: Socratic AI Tutor */}
            <div 
              onClick={() => onNavigate('tutor')}
              className="group p-6 rounded-3xl bg-background border border-navy-200/80 hover:border-amber-500/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full">
                    Step 04
                  </span>
                </div>
                <div className="inline-block text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mb-2 border border-amber-200">
                  Groq LPU (GPT-OSS 120B)
                </div>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-amber-600 transition-colors">
                  Socratic AI Tutor
                </h3>
                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  Sub-second LPU reasoning with 50+ topic DSA heuristics. Explains concepts calibrated precisely to your active mastery frontier.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-navy-200/60 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Ask AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Features Grid — Engineered for Competitive Learning */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
            Engineered for Competitive Learning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 tracking-tight">
            Built for learners who refuse to waste hours on fluff.
          </h2>
          <p className="text-navy-600 mt-2 text-sm">
            Deterministic mathematics, topological graph sorting, and resilient multi-tier AI inference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Transparent Mastery Algorithm */}
          <div className="p-6 rounded-3xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-2xl w-fit mb-4 border border-brand-purple/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Transparent Mastery Algorithm</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                No black-box hallucinated ratings. Mastery calculations are mathematically deterministic: factoring question weights, consecutive streaks, and mistake penalties.
              </p>
            </div>

            {/* Micro-Visual Widget: Formula & Delta Pill */}
            <div className="bg-navy-50/80 p-3.5 rounded-2xl border border-navy-200/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-navy-500 font-semibold">Mastery Formula:</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  +14% Delta
                </span>
              </div>
              <div className="font-mono text-[10px] text-navy-700 bg-white p-2 rounded-xl border border-navy-200/70 truncate">
                ΔM = Base × (1 + Streak × 0.1) × W - Penalty
              </div>
              <div className="flex items-center justify-between text-[10px] text-navy-500 font-mono pt-1">
                <span>Topic: Recursion</span>
                <span className="text-brand-purple font-bold">35% → 49% (Verified)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Topological Prerequisite Ordering */}
          <div className="p-6 rounded-3xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-2xl w-fit mb-4 border border-brand-blue/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Topological Prerequisite Ordering</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                If Recursion is weak, LearnLoop locks advanced Dynamic Programming and prioritizes call-stack mastery first, preventing cognitive overload.
              </p>
            </div>

            {/* Micro-Visual Widget: Mini DAG Visual */}
            <div className="bg-navy-50/80 p-3.5 rounded-2xl border border-navy-200/60 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-navy-500 font-semibold">Prerequisite Chain:</span>
                <span className="text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded text-[10px]">
                  DAG Enforced
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
                <div className="bg-white px-2 py-1.5 rounded-xl border border-rose-300 text-rose-700 font-bold flex items-center gap-1">
                  <span>Recursion</span>
                  <span className="text-[9px] bg-rose-100 px-1 rounded">35%</span>
                </div>
                <span className="text-navy-400 font-bold">→</span>
                <div className="bg-navy-100 px-2 py-1.5 rounded-xl border border-dashed border-navy-300 text-navy-500 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-navy-400" />
                  <span>Dyn. Prog</span>
                  <span className="text-[9px] bg-navy-200 px-1 rounded">Locked</span>
                </div>
              </div>
              <div className="text-[10px] text-navy-500 font-mono text-center">
                Unlocks automatically at ≥ 60% base case mastery
              </div>
            </div>
          </div>

          {/* Card 3: Graceful Multi-Tier Fallback Mode */}
          <div className="p-6 rounded-3xl bg-white border border-navy-200/80 shadow-soft-xs hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-2xl w-fit mb-4 border border-brand-emerald/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Multi-Tier Resilient AI Stack</h3>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                Dual-layer intelligence: blazing-fast Groq LPU (GPT-OSS 120B) for instant Socratic reasoning, backed by a built-in pedagogical knowledge engine covering 50+ DSA topics if offline.
              </p>
            </div>

            {/* Micro-Visual Widget: Dual Engine Architecture */}
            <div className="bg-navy-50/80 p-3.5 rounded-2xl border border-navy-200/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-navy-500 font-semibold">Inference Stack:</span>
                <span className="bg-brand-purple/10 text-brand-purple font-bold px-2 py-0.5 rounded text-[10px]">
                  Zero Downtime
                </span>
              </div>
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-brand-purple/20 text-brand-purple font-bold">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-brand-purple" />
                    Tier 1: Groq LPU (120B)
                  </span>
                  <span className="text-[9px] bg-brand-purple/10 px-1 rounded">~300 tok/s</span>
                </div>
                <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-brand-blue/20 text-brand-blue font-bold">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-brand-blue" />
                    Tier 2: 50+ Topic Local Knowledge
                  </span>
                  <span className="text-[9px] bg-brand-blue/10 px-1 rounded">Offline</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Big Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-soft-xl">
          <div className="max-w-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to experience true adaptive learning?
            </h3>
            <p className="text-navy-300 text-sm mt-2">
              Start your personalized technical learning journey with dynamic practice and real-time gap analysis.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartLearning}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-brand-purple hover:bg-brand-purple-dark shadow-soft-md transition-all"
            >
              Take 5-Min Diagnostic
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};

