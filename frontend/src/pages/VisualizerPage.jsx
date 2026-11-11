import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  GitBranch, 
  Network, 
  BarChart3, 
  Sliders, 
  Binary, 
  Cpu, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  ArrowDown,
  Info,
  RefreshCw,
  Zap,
  MapPin,
  Target,
  Navigation,
  Flag,
  Crosshair
} from 'lucide-react';
import { RecursionVisualizer } from '../components/RecursionVisualizer';

// ==========================================
// 1. AVL TREE REBALANCING DATA & COMPONENT
// ==========================================
const avlScenarios = {
  'll': {
    title: 'Left-Left (LL) Case → Single Right Rotation',
    description: 'Node 30 becomes unbalanced (BF = +2) after inserting 10 into the Left subtree of Left child 20.',
    steps: [
      {
        step: 0,
        title: 'Initial State: Balanced BST',
        desc: 'Tree with nodes 30 and 20. All nodes have |BF| ≤ 1.',
        nodes: [
          { id: '30', val: 30, x: 200, y: 50, bf: '+1', status: 'balanced' },
          { id: '20', val: 20, x: 120, y: 130, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '30', to: '20' }]
      },
      {
        step: 1,
        title: 'Insert 10: Left-Left Imbalance Triggered!',
        desc: '10 is inserted as the left child of 20. Node 30 now has BF = +2 (Left Height 2 - Right Height 0). Violates AVL property!',
        nodes: [
          { id: '30', val: 30, x: 200, y: 50, bf: '+2', status: 'unbalanced' },
          { id: '20', val: 20, x: 120, y: 130, bf: '+1', status: 'balanced' },
          { id: '10', val: 10, x: 60, y: 210, bf: '0', status: 'inserted' }
        ],
        edges: [{ from: '30', to: '20' }, { from: '20', to: '10' }]
      },
      {
        step: 2,
        title: 'Right Rotation in Progress (Pivot = 20)',
        desc: 'Node 20 moves up to become the new sub-root. Node 30 rotates downward to become 20\'s right child.',
        nodes: [
          { id: '20', val: 20, x: 200, y: 70, bf: '0', status: 'rotating' },
          { id: '10', val: 10, x: 100, y: 170, bf: '0', status: 'balanced' },
          { id: '30', val: 30, x: 300, y: 170, bf: '0', status: 'rotating' }
        ],
        edges: [{ from: '20', to: '10' }, { from: '20', to: '30' }]
      },
      {
        step: 3,
        title: 'Rotation Complete: Perfectly Balanced!',
        desc: 'Height is now 2 (down from 3). All balance factors are 0. O(log n) search time is mathematically preserved!',
        nodes: [
          { id: '20', val: 20, x: 200, y: 50, bf: '0', status: 'balanced' },
          { id: '10', val: 10, x: 100, y: 140, bf: '0', status: 'balanced' },
          { id: '30', val: 30, x: 300, y: 140, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '20', to: '10' }, { from: '20', to: '30' }]
      }
    ]
  },
  'rr': {
    title: 'Right-Right (RR) Case → Single Left Rotation',
    description: 'Node 10 becomes unbalanced (BF = -2) after inserting 30 into the Right subtree of Right child 20.',
    steps: [
      {
        step: 0,
        title: 'Initial State: Balanced BST',
        desc: 'Tree with nodes 10 and 20. All nodes have |BF| ≤ 1.',
        nodes: [
          { id: '10', val: 10, x: 200, y: 50, bf: '-1', status: 'balanced' },
          { id: '20', val: 20, x: 280, y: 130, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '10', to: '20' }]
      },
      {
        step: 1,
        title: 'Insert 30: Right-Right Imbalance!',
        desc: '30 inserted to right of 20. Node 10 has BF = -2 (Left 0 - Right 2). Single Left Rotation is required on node 10.',
        nodes: [
          { id: '10', val: 10, x: 200, y: 50, bf: '-2', status: 'unbalanced' },
          { id: '20', val: 20, x: 280, y: 130, bf: '-1', status: 'balanced' },
          { id: '30', val: 30, x: 340, y: 210, bf: '0', status: 'inserted' }
        ],
        edges: [{ from: '10', to: '20' }, { from: '20', to: '30' }]
      },
      {
        step: 2,
        title: 'Left Rotation Complete!',
        desc: 'Node 20 rotates up as new root; 10 becomes its left child and 30 remains its right child. All BF = 0.',
        nodes: [
          { id: '20', val: 20, x: 200, y: 50, bf: '0', status: 'balanced' },
          { id: '10', val: 10, x: 100, y: 140, bf: '0', status: 'balanced' },
          { id: '30', val: 30, x: 300, y: 140, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '20', to: '10' }, { from: '20', to: '30' }]
      }
    ]
  },
  'lr': {
    title: 'Left-Right (LR) Case → Double Rotation (Left then Right)',
    description: 'A zigzag insertion (Left child then Right grandchild) creates a +2 imbalance that requires a 2-step rotation.',
    steps: [
      {
        step: 0,
        title: 'Zigzag Imbalance (BF = +2)',
        desc: '30 has left child 10, and 20 was inserted to 10\'s right. A single right rotation fails because 20 is on the wrong side.',
        nodes: [
          { id: '30', val: 30, x: 220, y: 50, bf: '+2', status: 'unbalanced' },
          { id: '10', val: 10, x: 140, y: 130, bf: '-1', status: 'balanced' },
          { id: '20', val: 20, x: 190, y: 210, bf: '0', status: 'inserted' }
        ],
        edges: [{ from: '30', to: '10' }, { from: '10', to: '20' }]
      },
      {
        step: 1,
        title: 'Part 1: Left Rotation on Left Child (10)',
        desc: 'Left-rotate on node 10. Node 20 lifts up, converting the zigzag into a straight Left-Left chain.',
        nodes: [
          { id: '30', val: 30, x: 220, y: 50, bf: '+2', status: 'unbalanced' },
          { id: '20', val: 20, x: 140, y: 130, bf: '+1', status: 'rotating' },
          { id: '10', val: 10, x: 80, y: 210, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '30', to: '20' }, { from: '20', to: '10' }]
      },
      {
        step: 2,
        title: 'Part 2: Right Rotation on Root (30)',
        desc: 'Now perform a standard Right Rotation on 30. Node 20 becomes the new root with children 10 and 30.',
        nodes: [
          { id: '20', val: 20, x: 200, y: 50, bf: '0', status: 'balanced' },
          { id: '10', val: 10, x: 100, y: 140, bf: '0', status: 'balanced' },
          { id: '30', val: 30, x: 300, y: 140, bf: '0', status: 'balanced' }
        ],
        edges: [{ from: '20', to: '10' }, { from: '20', to: '30' }]
      }
    ]
  }
};

const AVLVisualizer = () => {
  const [scenarioKey, setScenarioKey] = useState('ll');
  const [currentStep, setCurrentStep] = useState(0);
  const scenario = avlScenarios[scenarioKey];
  const stepData = scenario.steps[currentStep];

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) setCurrentStep(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };
  const handleReset = () => setCurrentStep(0);

  return (
    <div className="space-y-6">
      {/* Scenario Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-50/70 p-3 rounded-2xl border border-navy-200/60">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-brand-purple" />
          <span className="text-xs font-bold text-navy-800">Rotation Pattern:</span>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(avlScenarios).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScenarioKey(key);
                setCurrentStep(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scenarioKey === key
                  ? 'bg-brand-purple text-white shadow-soft-xs'
                  : 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200/60'
              }`}
            >
              {key.toUpperCase()} Rotation
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl border border-navy-200/80 p-6 shadow-soft-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
          <div>
            <h4 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <span>{scenario.title}</span>
            </h4>
            <p className="text-xs text-navy-500 mt-0.5">{stepData.desc}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold text-navy-400">
              {currentStep + 1} / {scenario.steps.length}
            </span>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg bg-navy-100 text-navy-700 disabled:opacity-40 hover:bg-navy-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === scenario.steps.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-purple text-white font-bold text-xs hover:bg-brand-purple-dark disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-navy-100 text-navy-500 hover:text-navy-900"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree SVG Visualization Canvas */}
        <div className="relative w-full h-72 bg-navy-950/5 rounded-2xl border border-navy-200/60 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full">
            {/* Render Edges */}
            {stepData.edges.map((e, idx) => {
              const fromNode = stepData.nodes.find(n => n.id === e.from);
              const toNode = stepData.nodes.find(n => n.id === e.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Render Nodes */}
            {stepData.nodes.map((node) => {
              let circleColor = 'fill-brand-purple stroke-brand-purple';
              if (node.status === 'unbalanced') circleColor = 'fill-brand-rose stroke-brand-rose animate-pulse';
              if (node.status === 'inserted') circleColor = 'fill-brand-emerald stroke-brand-emerald';
              if (node.status === 'rotating') circleColor = 'fill-brand-blue stroke-brand-blue';

              return (
                <g key={node.id} className="transition-all duration-500">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    className={`${circleColor} shadow-md`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontWeight="bold"
                    fontSize="13"
                    className="font-mono select-none"
                  >
                    {node.val}
                  </text>
                  {/* Balance Factor Tag */}
                  <rect
                    x={node.x + 14}
                    y={node.y - 28}
                    width="38"
                    height="18"
                    rx="5"
                    fill={node.status === 'unbalanced' ? '#ef4444' : '#1e293b'}
                  />
                  <text
                    x={node.x + 33}
                    y={node.y - 15}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    BF:{node.bf}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Legend */}
          <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[11px] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-navy-200/60 font-semibold text-navy-700 shadow-soft-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" /> Balanced
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-rose" /> Unbalanced (|BF| ≥ 2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" /> Inserted Node
            </span>
          </div>
        </div>

        {/* Theoretical Insight Box */}
        <div className="p-3.5 bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 rounded-2xl border border-brand-purple/15 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-navy-900">Why AVL Rotations Matter in Engineering:</p>
            <p className="text-navy-600 leading-relaxed">
              Without rotations, sequentially inserting sorted keys degenerates a Binary Search Tree into an $O(n)$ linked list. 
              By performing $O(1)$ pointer rewiring whenever $|BF| \ge 2$, AVL guarantees worst-case logarithmic performance 
              $O(\log n)$ for every single search, insert, and delete operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SORTING ALGORITHMS ANIMATOR & TRACER
// ==========================================
const sortingAlgorithms = {
  bubble: {
    name: 'Bubble Sort',
    tagline: 'Adjacent Element Comparisons & Bubbling',
    timeComp: 'O(n²)',
    spaceComp: 'O(1)',
    bestTime: 'O(n) if nearly sorted',
    desc: 'Continuously steps through the list, comparing adjacent items and swapping them if they are in the wrong order. Larger elements bubble up to the end of the array.'
  },
  selection: {
    name: 'Selection Sort',
    tagline: 'Min-Element Selection & In-Place Placement',
    timeComp: 'O(n²)',
    spaceComp: 'O(1)',
    bestTime: 'O(n²)',
    desc: 'Divides the array into sorted and unsorted subarrays. Repeatedly scans the unsorted subarray to find the minimum element and swaps it into the next sorted slot.'
  },
  insertion: {
    name: 'Insertion Sort',
    tagline: 'Incremental Card-Hand Insertion',
    timeComp: 'O(n²)',
    spaceComp: 'O(1)',
    bestTime: 'O(n)',
    desc: 'Builds the final sorted array one item at a time. It takes each element and compares it backward against already-sorted items, shifting larger items right until finding the correct insertion slot.'
  },
  quick: {
    name: 'Quick Sort',
    tagline: 'Divide & Conquer with Pivot Partitioning',
    timeComp: 'O(n log n)',
    spaceComp: 'O(log n)',
    bestTime: 'O(n log n)',
    desc: 'Picks an element as a pivot and partitions the array around the pivot such that smaller elements move left and larger elements move right, then recursively sorts the partitions.'
  },
  merge: {
    name: 'Merge Sort',
    tagline: 'Recursive Divide & Stable Two-Way Merge',
    timeComp: 'O(n log n)',
    spaceComp: 'O(n)',
    bestTime: 'O(n log n)',
    desc: 'Recursively divides the array in half until single elements remain, then repeatedly merges sorted halves back together in linear time, guaranteeing O(n log n) in all cases.'
  }
};

const SortingVisualizer = () => {
  const initialArray = [45, 18, 85, 32, 70, 24, 60, 12, 50, 38];
  const [array, setArray] = useState(initialArray);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [speed, setSpeed] = useState('normal'); // 'slow', 'normal', 'fast'
  const [isRunning, setIsRunning] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [stepNote, setStepNote] = useState('Click "Start Sort" or "Randomize" to inspect array behavior.');

  const isCancelledRef = useRef(false);

  const getDelay = () => {
    if (speed === 'slow') return 550;
    if (speed === 'fast') return 120;
    return 280;
  };

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const resetArray = () => {
    isCancelledRef.current = true;
    setIsRunning(false);
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 12);
    setArray(newArr);
    setComparing([]);
    setSwapping([]);
    setPivotIdx(null);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);
    setStepNote('New random array generated. Ready to sort!');
  };

  // 1. Bubble Sort Implementation
  const runBubbleSort = async () => {
    setIsRunning(true);
    isCancelledRef.current = false;
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    setSortedIndices([]);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (isCancelledRef.current) return;
        setComparing([j, j + 1]);
        compCount++;
        setComparisons(compCount);
        setStepNote(`Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]})...`);
        await sleep(getDelay());

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          setStepNote(`Swap: ${arr[j]} > ${arr[j + 1]}. Moving ${arr[j]} right.`);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await sleep(getDelay());
          setSwapping([]);
        }
      }
      setSortedIndices(prev => [...prev, arr.length - 1 - i]);
    }

    setComparing([]);
    setSortedIndices(arr.map((_, idx) => idx));
    setStepNote('Bubble Sort complete! All elements sorted in ascending order.');
    setIsRunning(false);
  };

  // 2. Selection Sort Implementation
  const runSelectionSort = async () => {
    setIsRunning(true);
    isCancelledRef.current = false;
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    setSortedIndices([]);

    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      setPivotIdx(minIdx);
      setStepNote(`Pass ${i + 1}: Scanning unsorted subarray starting at index ${i} to find minimum value...`);

      for (let j = i + 1; j < arr.length; j++) {
        if (isCancelledRef.current) return;
        setComparing([minIdx, j]);
        compCount++;
        setComparisons(compCount);
        await sleep(getDelay());

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setPivotIdx(minIdx);
          setStepNote(`New minimum found at index ${j} (value = ${arr[j]}).`);
        }
      }

      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        setStepNote(`Swapping minimum element ${arr[minIdx]} into index ${i}.`);
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        await sleep(getDelay());
        setSwapping([]);
      }

      setSortedIndices(prev => [...prev, i]);
    }

    setPivotIdx(null);
    setComparing([]);
    setSortedIndices(arr.map((_, idx) => idx));
    setStepNote('Selection Sort complete! Every slot received its verified minimum.');
    setIsRunning(false);
  };

  // 3. Insertion Sort Implementation
  const runInsertionSort = async () => {
    setIsRunning(true);
    isCancelledRef.current = false;
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    setSortedIndices([0]);

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      setPivotIdx(i);
      setStepNote(`Picking key ${key} at index ${i}. Finding its sorted insertion position to the left...`);
      await sleep(getDelay());

      while (j >= 0 && arr[j] > key) {
        if (isCancelledRef.current) return;
        compCount++;
        setComparisons(compCount);
        setComparing([j, j + 1]);
        setStepNote(`${arr[j]} > ${key}. Shifting ${arr[j]} one position right to index ${j + 1}.`);
        await sleep(getDelay());

        arr[j + 1] = arr[j];
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        j--;
      }

      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(Array.from({ length: i + 1 }, (_, k) => k));
      setStepNote(`Inserted key ${key} at sorted index ${j + 1}.`);
      await sleep(getDelay());
    }

    setPivotIdx(null);
    setComparing([]);
    setSortedIndices(arr.map((_, idx) => idx));
    setStepNote('Insertion Sort complete! Array sorted incrementally like playing cards.');
    setIsRunning(false);
  };

  // 4. Quick Sort Implementation
  const runQuickSort = async () => {
    setIsRunning(true);
    isCancelledRef.current = false;
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;
    const sorted = [];

    const partition = async (low, high) => {
      const pivot = arr[high];
      setPivotIdx(high);
      setStepNote(`Partitioning range [${low}..${high}] with pivot = ${pivot} (arr[${high}])...`);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (isCancelledRef.current) return -1;
        setComparing([j, high]);
        compCount++;
        setComparisons(compCount);
        await sleep(getDelay());

        if (arr[j] < pivot) {
          i++;
          setSwapping([i, j]);
          setStepNote(`${arr[j]} < pivot (${pivot}). Swapping arr[${i}] and arr[${j}].`);
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await sleep(getDelay());
          setSwapping([]);
        }
      }

      setSwapping([i + 1, high]);
      setStepNote(`Placing pivot ${pivot} into its final sorted position at index ${i + 1}.`);
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      swapCount++;
      setSwaps(swapCount);
      setArray([...arr]);
      await sleep(getDelay());
      setSwapping([]);
      sorted.push(i + 1);
      setSortedIndices([...sorted]);

      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        if (isCancelledRef.current) return;
        const pi = await partition(low, high);
        if (pi === -1 || isCancelledRef.current) return;
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      } else if (low === high) {
        sorted.push(low);
        setSortedIndices([...sorted]);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    setPivotIdx(null);
    setComparing([]);
    setSortedIndices(arr.map((_, idx) => idx));
    setStepNote('Quick Sort complete! Achieved O(n log n) divide-and-conquer partition.');
    setIsRunning(false);
  };

  // 5. Merge Sort Implementation
  const runMergeSort = async () => {
    setIsRunning(true);
    isCancelledRef.current = false;
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;

    const merge = async (l, m, r) => {
      setStepNote(`Merging sorted subarrays [${l}..${m}] and [${m + 1}..${r}]...`);
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = arr.slice(l, m + 1);
      const R = arr.slice(m + 1, r + 1);

      let i = 0, j = 0, k = l;

      while (i < n1 && j < n2) {
        if (isCancelledRef.current) return;
        compCount++;
        setComparisons(compCount);
        setComparing([l + i, m + 1 + j]);
        await sleep(getDelay());

        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        k++;
      }

      while (i < n1) {
        if (isCancelledRef.current) return;
        arr[k] = L[i];
        i++;
        k++;
        setArray([...arr]);
        await sleep(getDelay() / 2);
      }

      while (j < n2) {
        if (isCancelledRef.current) return;
        arr[k] = R[j];
        j++;
        k++;
        setArray([...arr]);
        await sleep(getDelay() / 2);
      }
    };

    const mergeSortHelper = async (l, r) => {
      if (l >= r) return;
      if (isCancelledRef.current) return;
      const m = Math.floor(l + (r - l) / 2);
      await mergeSortHelper(l, m);
      await mergeSortHelper(m + 1, r);
      await merge(l, m, r);
    };

    await mergeSortHelper(0, arr.length - 1);
    setComparing([]);
    setSortedIndices(arr.map((_, idx) => idx));
    setStepNote('Merge Sort complete! Guaranteed O(n log n) stable sorting achieved.');
    setIsRunning(false);
  };

  const handleStartSort = () => {
    if (selectedAlgo === 'bubble') runBubbleSort();
    else if (selectedAlgo === 'selection') runSelectionSort();
    else if (selectedAlgo === 'insertion') runInsertionSort();
    else if (selectedAlgo === 'quick') runQuickSort();
    else if (selectedAlgo === 'merge') runMergeSort();
  };

  const algoMeta = sortingAlgorithms[selectedAlgo];

  return (
    <div className="space-y-6">
      {/* Algorithm Selector Pills */}
      <div className="bg-navy-50/70 p-3 sm:p-4 rounded-2xl border border-navy-200/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-navy-800">Select Sorting Algorithm:</span>
          </div>

          {/* Speed & Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-navy-500">Speed:</span>
            {['slow', 'normal', 'fast'].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize transition-all ${
                  speed === s ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(sortingAlgorithms).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                if (!isRunning) {
                  setSelectedAlgo(key);
                  setSortedIndices([]);
                  setComparing([]);
                  setSwapping([]);
                  setPivotIdx(null);
                  setComparisons(0);
                  setSwaps(0);
                  setStepNote(`Switched to ${item.name}. Click "Start Sort" to watch execution.`);
                }
              }}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedAlgo === key
                  ? 'bg-brand-purple text-white shadow-soft-xs'
                  : 'bg-white text-navy-700 hover:bg-navy-100 border border-navy-200/70 disabled:opacity-40'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl border border-navy-200/80 p-6 shadow-soft-sm space-y-4">
        {/* Stage Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-navy-900 text-sm">{algoMeta.name}</h4>
              <span className="text-[10px] text-brand-purple font-mono font-bold bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/20">
                {algoMeta.tagline}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-1 max-w-xl">{algoMeta.desc}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleStartSort}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple text-white font-bold text-xs hover:bg-brand-purple-dark disabled:opacity-40 shadow-soft-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Sorting in Progress...' : `Start ${algoMeta.name}`}</span>
            </button>
            <button
              onClick={resetArray}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-100 text-navy-700 font-bold text-xs hover:bg-navy-200 transition-all"
              title="Generate new random array"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize</span>
            </button>
          </div>
        </div>

        {/* Live Step Commentary & Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-navy-50/80 p-3 rounded-2xl border border-navy-200/60 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-navy-600">Comparisons: <strong className="text-navy-900 text-sm">{comparisons}</strong></span>
            <span className="text-navy-600">Swaps / Shifts: <strong className="text-navy-900 text-sm">{swaps}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-white text-brand-purple font-bold px-2 py-0.5 rounded border border-navy-200">
              Avg Time: {algoMeta.timeComp}
            </span>
            <span className="text-[10px] font-mono bg-white text-brand-blue font-bold px-2 py-0.5 rounded border border-navy-200">
              Space: {algoMeta.spaceComp}
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization Canvas */}
        <div className="h-64 flex items-end justify-center gap-2.5 sm:gap-4 pt-6 px-2 bg-navy-950/5 rounded-2xl border border-navy-200/60">
          {array.map((val, idx) => {
            const isComp = comparing.includes(idx);
            const isSwap = swapping.includes(idx);
            const isPivot = pivotIdx === idx;
            const isSorted = sortedIndices.includes(idx);

            let barColor = 'bg-brand-blue/80';
            if (isPivot) barColor = 'bg-purple-600 shadow-md ring-2 ring-purple-300';
            if (isComp) barColor = 'bg-amber-400 shadow-md';
            if (isSwap) barColor = 'bg-brand-rose shadow-md animate-pulse';
            if (isSorted) barColor = 'bg-brand-emerald';

            return (
              <div key={idx} className="flex-1 max-w-[42px] flex flex-col items-center gap-1.5 transition-all">
                <span className="text-[10px] font-mono font-bold text-navy-500">{val}</span>
                <motion.div
                  layout
                  className={`w-full rounded-t-xl ${barColor} transition-all duration-200`}
                  style={{ height: `${val * 2.2}px` }}
                />
                <span className="text-[9px] font-mono text-navy-400">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Live Status Note */}
        <div className="p-3 bg-white rounded-xl border border-navy-200/80 text-xs text-navy-700 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-purple shrink-0" />
          <span className="font-mono text-[11px] font-semibold">{stepNote}</span>
        </div>

        {/* Canvas Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-navy-600 border-t border-navy-100">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-blue" /> Unsorted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Active Pivot / Key</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Comparing ($O(1)$)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-rose" /> Swapping / Moving</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" /> Locked Sorted</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. GRAPH TRAVERSAL ANIMATOR (BFS vs DFS)
// ==========================================
const graphNodes = [
  { id: 'A', x: 200, y: 40 },
  { id: 'B', x: 100, y: 120 },
  { id: 'C', x: 300, y: 120 },
  { id: 'D', x: 60, y: 220 },
  { id: 'E', x: 140, y: 220 },
  { id: 'F', x: 260, y: 220 },
  { id: 'G', x: 340, y: 220 }
];

const graphEdges = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'C', to: 'G' }
];

const bfsSteps = [
  { active: 'A', queue: ['A'], visited: ['A'], note: 'Start at root node A. Enqueue A.' },
  { active: 'B', queue: ['B', 'C'], visited: ['A', 'B'], note: 'Dequeue A. Discover and Enqueue children B and C (Level 1).' },
  { active: 'C', queue: ['C', 'D', 'E'], visited: ['A', 'B', 'C'], note: 'Dequeue B. Enqueue children D and E (Level 2).' },
  { active: 'D', queue: ['D', 'E', 'F', 'G'], visited: ['A', 'B', 'C', 'D'], note: 'Dequeue C. Enqueue children F and G.' },
  { active: 'E', queue: ['E', 'F', 'G'], visited: ['A', 'B', 'C', 'D', 'E'], note: 'Dequeue D. No more unvisited children.' },
  { active: 'F', queue: ['F', 'G'], visited: ['A', 'B', 'C', 'D', 'E', 'F'], note: 'Dequeue E. No more unvisited children.' },
  { active: 'G', queue: ['G'], visited: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], note: 'Dequeue F and G. Traversal complete in level-by-level order!' }
];

const dfsSteps = [
  { active: 'A', queue: ['A'], visited: ['A'], note: 'Push A onto Call Stack.' },
  { active: 'B', queue: ['A', 'B'], visited: ['A', 'B'], note: 'Dive deep into leftmost child B. Push B.' },
  { active: 'D', queue: ['A', 'B', 'D'], visited: ['A', 'B', 'D'], note: 'Dive into D (Leaf node). Push D.' },
  { active: 'E', queue: ['A', 'B', 'E'], visited: ['A', 'B', 'D', 'E'], note: 'Backtrack to B. Dive into sibling E. Push E.' },
  { active: 'C', queue: ['A', 'C'], visited: ['A', 'B', 'D', 'E', 'C'], note: 'Backtrack all the way to root A. Dive into right child C.' },
  { active: 'F', queue: ['A', 'C', 'F'], visited: ['A', 'B', 'D', 'E', 'C', 'F'], note: 'Dive deep into F (Leaf). Push F.' },
  { active: 'G', queue: ['A', 'C', 'G'], visited: ['A', 'B', 'D', 'E', 'C', 'F', 'G'], note: 'Backtrack to C. Visit sibling G. All branches explored!' }
];

const GraphVisualizer = () => {
  const [mode, setMode] = useState('bfs');
  const [stepIndex, setStepIndex] = useState(0);

  const steps = mode === 'bfs' ? bfsSteps : dfsSteps;
  const current = steps[stepIndex];

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-50/70 p-3 rounded-2xl border border-navy-200/60">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-brand-purple" />
          <span className="text-xs font-bold text-navy-800">Traversal Strategy:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('bfs'); setStepIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'bfs'
                ? 'bg-brand-purple text-white shadow-soft-xs'
                : 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200/60'
            }`}
          >
            BFS (Breadth-First · Queue)
          </button>
          <button
            onClick={() => { setMode('dfs'); setStepIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'dfs'
                ? 'bg-brand-blue text-white shadow-soft-xs'
                : 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200/60'
            }`}
          >
            DFS (Depth-First · Stack)
          </button>
        </div>
      </div>

      {/* Main Canvas & Data Structure Inspect */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph SVG Canvas */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-navy-200/80 p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-navy-100">
            <h4 className="font-bold text-navy-900 text-sm">
              {mode === 'bfs' ? 'Level-by-Level Graph Inspection' : 'Deep-Branching Graph Traversal'}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-navy-400">
                {stepIndex + 1} / {steps.length}
              </span>
              <button
                onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
                disabled={stepIndex === 0}
                className="p-1.5 rounded-lg bg-navy-100 text-navy-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={stepIndex === steps.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-purple text-white font-bold text-xs hover:bg-brand-purple-dark disabled:opacity-40"
              >
                <span>Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setStepIndex(0)}
                className="p-1.5 rounded-lg bg-navy-100 text-navy-500 hover:text-navy-900"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-72 bg-navy-950/5 rounded-2xl border border-navy-200/60 flex items-center justify-center">
            <svg className="w-full h-full">
              {graphEdges.map((e, idx) => {
                const f = graphNodes.find(n => n.id === e.from);
                const t = graphNodes.find(n => n.id === e.to);
                return (
                  <line
                    key={idx}
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="#94a3b8"
                    strokeWidth="3"
                  />
                );
              })}
              {graphNodes.map((n) => {
                const isVisited = current.visited.includes(n.id);
                const isActive = current.active === n.id;

                let fill = 'fill-navy-200 stroke-navy-400';
                if (isVisited) fill = mode === 'bfs' ? 'fill-brand-purple stroke-brand-purple' : 'fill-brand-blue stroke-brand-blue';
                if (isActive) fill = 'fill-brand-rose stroke-brand-rose animate-pulse';

                return (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r="22" className={`${fill} transition-all duration-300 shadow-md`} />
                    <text
                      x={n.x}
                      y={n.y + 5}
                      textAnchor="middle"
                      fill={isVisited || isActive ? '#ffffff' : '#1e293b'}
                      fontWeight="bold"
                      fontSize="14"
                      fontFamily="monospace"
                    >
                      {n.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-xs text-navy-600 bg-navy-50 p-3 rounded-xl border border-navy-200/50">
            <strong>Current State:</strong> {current.note}
          </p>
        </div>

        {/* Data Structure State Tracker (Queue vs Stack) */}
        <div className="bg-white rounded-3xl border border-navy-200/80 p-6 shadow-soft-sm space-y-4">
          <div className="pb-2 border-b border-navy-100 flex items-center justify-between">
            <h4 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-purple" />
              <span>{mode === 'bfs' ? 'FIFO Queue Buffer' : 'LIFO Call Stack'}</span>
            </h4>
            <span className="text-[10px] font-mono bg-navy-100 text-navy-600 px-2 py-0.5 rounded font-bold">
              {mode === 'bfs' ? 'Enqueue Rear / Dequeue Front' : 'Push Top / Pop Top'}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-navy-500">Elements currently buffered in memory:</p>
            <div className="min-h-36 bg-navy-50/80 p-3 rounded-2xl border border-navy-200/60 flex flex-col gap-2">
              {current.queue.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 rounded-xl bg-white border border-brand-purple/20 shadow-soft-xs flex items-center justify-between text-xs font-mono font-bold"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    <span>Node {item}</span>
                  </span>
                  <span className="text-[10px] text-navy-400">
                    {mode === 'bfs' ? (idx === 0 ? 'Front (Next to Pop)' : 'Rear') : (idx === current.queue.length - 1 ? 'Top of Stack' : 'Paused Frame')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-navy-100 space-y-2">
            <span className="text-xs font-bold text-navy-800">Traversal History:</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {current.visited.map((v, i) => (
                <span key={i} className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple font-bold rounded-lg border border-brand-purple/20">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. DIJKSTRA'S SHORTEST PATH GRID SIMULATOR
// ==========================================
const GRID_ROWS = 10;
const GRID_COLS = 22;
const START_POS = { row: 4, col: 2 };
const TARGET_POS = { row: 4, col: 19 };

const createFreshGrid = (wallsToKeep = null) => {
  const newGrid = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    const row = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const isStart = r === START_POS.row && c === START_POS.col;
      const isTarget = r === TARGET_POS.row && c === TARGET_POS.col;
      const isWall = wallsToKeep ? Boolean(wallsToKeep[r]?.[c]?.isWall) : false;
      row.push({
        row: r,
        col: c,
        isStart,
        isTarget,
        isWall,
        isVisited: false,
        isPath: false,
        distance: isStart ? 0 : Infinity,
        previousNode: null
      });
    }
    newGrid.push(row);
  }
  return newGrid;
};

const DijkstraVisualizer = () => {
  const [grid, setGrid] = useState(createFreshGrid);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState('normal'); // 'slow', 'normal', 'fast'
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Click or drag on cells to build walls. Click "Run Dijkstra" to watch shortest path routing!');

  const isCancelledRef = useRef(false);

  const getSpeedDelay = () => {
    if (speed === 'fast') return 8;
    if (speed === 'slow') return 65;
    return 22;
  };

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const handleCellClick = (r, c) => {
    if (isRunning) return;
    if ((r === START_POS.row && c === START_POS.col) || (r === TARGET_POS.row && c === TARGET_POS.col)) return;

    setGrid(prev => {
      const nextGrid = prev.map(row => row.map(cell => ({ ...cell })));
      nextGrid[r][c].isWall = !nextGrid[r][c].isWall;
      nextGrid[r][c].isVisited = false;
      nextGrid[r][c].isPath = false;
      return nextGrid;
    });
  };

  const handleMouseEnter = (r, c) => {
    if (!isMousePressed || isRunning) return;
    if ((r === START_POS.row && c === START_POS.col) || (r === TARGET_POS.row && c === TARGET_POS.col)) return;

    setGrid(prev => {
      const nextGrid = prev.map(row => row.map(cell => ({ ...cell })));
      nextGrid[r][c].isWall = true;
      nextGrid[r][c].isVisited = false;
      nextGrid[r][c].isPath = false;
      return nextGrid;
    });
  };

  const clearPathOnly = () => {
    isCancelledRef.current = true;
    setIsRunning(false);
    setGrid(prev => createFreshGrid(prev));
    setVisitedCount(0);
    setPathLength(0);
    setStatusMessage('Search path cleared. Wall configuration preserved.');
  };

  const resetAll = () => {
    isCancelledRef.current = true;
    setIsRunning(false);
    setGrid(createFreshGrid());
    setVisitedCount(0);
    setPathLength(0);
    setStatusMessage('Grid reset. Start node at (4, 2) and Target node at (4, 19).');
  };

  const loadMaze = (type = 'divider') => {
    if (isRunning) return;
    const newGrid = createFreshGrid();

    if (type === 'divider') {
      // Double vertical barriers with offset openings
      for (let r = 0; r < GRID_ROWS; r++) {
        if (r !== 1 && r !== 2) newGrid[r][8].isWall = true;
        if (r !== 7 && r !== 8) newGrid[r][14].isWall = true;
      }
    } else if (type === 'zigzag') {
      // Slalom horizontal channels
      for (let c = 2; c < 16; c++) newGrid[3][c].isWall = true;
      for (let c = 6; c < 20; c++) newGrid[6][c].isWall = true;
    } else if (type === 'scattered') {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if (!newGrid[r][c].isStart && !newGrid[r][c].isTarget && Math.random() < 0.22) {
            newGrid[r][c].isWall = true;
          }
        }
      }
    }

    setGrid(newGrid);
    setVisitedCount(0);
    setPathLength(0);
    setStatusMessage(`Loaded "${type.toUpperCase()}" maze. Hit "Run Dijkstra" to compute shortest route!`);
  };

  // Dijkstra's Shortest Path Algorithm Core
  const runDijkstra = async () => {
    if (isRunning) return;
    setIsRunning(true);
    isCancelledRef.current = false;
    setVisitedCount(0);
    setPathLength(0);
    setStatusMessage('Exploring neighboring cells via Min-Heap Priority Queue (Greedy Choice)...');

    // Reset path states while preserving walls
    const gridCopy = grid.map(row =>
      row.map(cell => ({
        ...cell,
        distance: cell.isStart ? 0 : Infinity,
        isVisited: false,
        isPath: false,
        previousNode: null
      }))
    );

    const startNode = gridCopy[START_POS.row][START_POS.col];
    const targetNode = gridCopy[TARGET_POS.row][TARGET_POS.col];

    const unvisitedNodes = [];
    for (const row of gridCopy) {
      for (const node of row) {
        unvisitedNodes.push(node);
      }
    }

    const visitedNodesInOrder = [];
    let pathFound = false;

    while (unvisitedNodes.length > 0) {
      if (isCancelledRef.current) return;
      // Sort unvisited nodes by distance (Priority Queue emulation)
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break; // Trapped by walls

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode.row === targetNode.row && closestNode.col === targetNode.col) {
        pathFound = true;
        break;
      }

      // 4-directional neighborhood: Up, Down, Left, Right
      const neighbors = [];
      const { row, col } = closestNode;
      if (row > 0) neighbors.push(gridCopy[row - 1][col]);
      if (row < GRID_ROWS - 1) neighbors.push(gridCopy[row + 1][col]);
      if (col > 0) neighbors.push(gridCopy[row][col - 1]);
      if (col < GRID_COLS - 1) neighbors.push(gridCopy[row][col + 1]);

      const unvisitedNeighbors = neighbors.filter(n => !n.isVisited && !n.isWall);
      for (const neighbor of unvisitedNeighbors) {
        const tentative = closestNode.distance + 1;
        if (tentative < neighbor.distance) {
          neighbor.distance = tentative;
          neighbor.previousNode = closestNode;
        }
      }
    }

    // Phase 1: Animate Visited Wavefront
    const stepDelay = getSpeedDelay();
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (isCancelledRef.current) return;
      const vNode = visitedNodesInOrder[i];
      setGrid(prev => {
        const next = [...prev];
        next[vNode.row] = [...next[vNode.row]];
        next[vNode.row][vNode.col] = {
          ...next[vNode.row][vNode.col],
          isVisited: true
        };
        return next;
      });
      setVisitedCount(i + 1);
      await sleep(stepDelay);
    }

    // Phase 2: Traceback and Animate Optimal Shortest Path
    if (pathFound) {
      setStatusMessage('Target reached! Backtracking optimal shortest path from target to start...');
      const shortestPathNodes = [];
      let curr = targetNode;
      while (curr !== null) {
        shortestPathNodes.unshift(curr);
        curr = curr.previousNode;
      }

      for (let i = 0; i < shortestPathNodes.length; i++) {
        if (isCancelledRef.current) return;
        const pNode = shortestPathNodes[i];
        setGrid(prev => {
          const next = [...prev];
          next[pNode.row] = [...next[pNode.row]];
          next[pNode.row][pNode.col] = {
            ...next[pNode.row][pNode.col],
            isPath: true
          };
          return next;
        });
        setPathLength(i);
        await sleep(stepDelay * 1.5);
      }
      setStatusMessage(`✅ Optimal shortest path verified: ${shortestPathNodes.length - 1} steps (O((V + E) log V) with Min-Heap Priority Queue).`);
    } else {
      setStatusMessage('❌ Target is unreachable! The walls completely enclose the target.');
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Preset Controls */}
      <div className="bg-navy-50/70 p-3 sm:p-4 rounded-2xl border border-navy-200/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-brand-purple" />
            <span className="text-xs font-bold text-navy-800">Dijkstra Shortest Path Simulator</span>
            <span className="text-[10px] font-mono bg-white text-brand-purple font-bold px-2 py-0.5 rounded border border-navy-200">
              Non-Negative Weighted Graph Search
            </span>
          </div>

          {/* Speed & Actions */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-navy-500">Speed:</span>
            {['slow', 'normal', 'fast'].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize transition-all ${
                  speed === s ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Maze Preset Buttons & Main Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-navy-200/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-navy-500">Maze Presets:</span>
            <button
              onClick={() => loadMaze('divider')}
              disabled={isRunning}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-navy-700 hover:bg-navy-100 border border-navy-200/70 disabled:opacity-40"
            >
              Divider Walls
            </button>
            <button
              onClick={() => loadMaze('zigzag')}
              disabled={isRunning}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-navy-700 hover:bg-navy-100 border border-navy-200/70 disabled:opacity-40"
            >
              Slalom Zigzag
            </button>
            <button
              onClick={() => loadMaze('scattered')}
              disabled={isRunning}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-navy-700 hover:bg-navy-100 border border-navy-200/70 disabled:opacity-40"
            >
              Random Rocks
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDijkstra}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple text-white font-bold text-xs hover:bg-brand-purple-dark disabled:opacity-40 shadow-soft-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Routing...' : 'Run Dijkstra'}</span>
            </button>
            <button
              onClick={clearPathOnly}
              className="px-3 py-2 rounded-xl bg-white text-navy-700 font-bold text-xs hover:bg-navy-100 border border-navy-200/70 shadow-soft-xs"
              title="Clear visited path, keep walls"
            >
              Clear Path
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-100 text-navy-700 font-bold text-xs hover:bg-navy-200 transition-all"
              title="Reset everything to clean grid"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid Stage */}
      <div 
        className="bg-white rounded-3xl border border-navy-200/80 p-4 sm:p-6 shadow-soft-sm space-y-4"
        onMouseUp={() => setIsMousePressed(false)}
        onMouseLeave={() => setIsMousePressed(false)}
      >
        {/* Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-navy-50/80 p-3 rounded-2xl border border-navy-200/60 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-navy-600">Cells Explored: <strong className="text-navy-900 text-sm">{visitedCount}</strong></span>
            <span className="text-navy-600">Shortest Path Length: <strong className="text-amber-600 text-sm">{pathLength > 0 ? `${pathLength} steps` : '—'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white text-brand-purple font-bold px-2 py-0.5 rounded border border-navy-200">
              Guaranteed Shortest
            </span>
            <span className="text-[10px] bg-white text-brand-blue font-bold px-2 py-0.5 rounded border border-navy-200" title="Dijkstra with Min-Heap Priority Queue">
              O((V + E) log V) Min-Heap
            </span>
          </div>
        </div>

        {/* Responsive Interactive Grid Canvas */}
        <div className="overflow-x-auto p-2 sm:p-3 bg-navy-950/5 rounded-2xl border border-navy-200/60 flex justify-center select-none">
          <div 
            className="grid gap-[2px] sm:gap-[3px] bg-navy-200/70 p-2 rounded-xl shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                let cellStyle = 'bg-white hover:bg-navy-50';
                let iconContent = null;

                if (cell.isStart) {
                  cellStyle = 'bg-brand-emerald text-white shadow-md ring-2 ring-emerald-300';
                  iconContent = <MapPin className="w-3.5 h-3.5 fill-white" />;
                } else if (cell.isTarget) {
                  cellStyle = 'bg-brand-rose text-white shadow-md ring-2 ring-rose-300';
                  iconContent = <Target className="w-3.5 h-3.5" />;
                } else if (cell.isWall) {
                  cellStyle = 'bg-navy-900 border-navy-950 shadow-inner scale-95 rounded-sm';
                } else if (cell.isPath) {
                  cellStyle = 'bg-amber-400 border border-amber-500 shadow-md scale-95 animate-pulse';
                } else if (cell.isVisited) {
                  cellStyle = 'bg-gradient-to-tr from-brand-purple/40 to-brand-blue/30 border border-brand-purple/20 transition-all duration-300';
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onMouseDown={() => {
                      setIsMousePressed(true);
                      handleCellClick(rIdx, cIdx);
                    }}
                    onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-[4px] flex items-center justify-center cursor-pointer transition-all ${cellStyle}`}
                    title={`(${rIdx}, ${cIdx})`}
                  >
                    {iconContent}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Step Status Note */}
        <div className="p-3 bg-white rounded-xl border border-navy-200/80 text-xs text-navy-700 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-purple shrink-0" />
          <span className="font-mono text-[11px] font-semibold">{statusMessage}</span>
        </div>

        {/* Canvas Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-navy-600 border-t border-navy-100">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-emerald flex items-center justify-center text-white"><MapPin className="w-2 h-2 fill-white" /></span> Start (4, 2)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-rose flex items-center justify-center text-white"><Target className="w-2 h-2" /></span> Target (4, 19)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-navy-900" /> Obstacle Wall (Drag to Draw)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-purple/40" /> Visited Wavefront</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400" /> Optimal Shortest Path</span>
        </div>

        {/* Theoretical Insight Box */}
        <div className="p-3.5 bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 rounded-2xl border border-brand-purple/15 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-navy-900">Why Dijkstra Guarantees the Shortest Path:</p>
            <p className="text-navy-600 leading-relaxed">
              Dijkstra operates on the <strong>Greedy Choice Property</strong>: at each step, it visits the unvisited node with the absolute smallest tentative distance from the source. Because all edge weights are non-negative ($\ge 0$), once a node is settled, no future path can ever reach it in fewer steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN VISUALIZER LAB PAGE
// ==========================================
// ==========================================
// 6. MIN / MAX BINARY HEAP VISUALIZER
// ==========================================
const DEFAULT_MIN_HEAP = [3, 10, 7, 25, 18, 12];
const DEFAULT_MAX_HEAP = [25, 18, 12, 10, 3, 7];

const HeapVisualizer = () => {
  const [heap, setHeap]           = useState([...DEFAULT_MIN_HEAP]);
  const [mode, setMode]           = useState('min'); // 'min' | 'max'
  const [inputVal, setInputVal]   = useState('');
  const [highlights, setHighlights] = useState({}); // { idx: 'compare'|'swap'|'inserted'|'deleted'|'settled' }
  const [log, setLog]             = useState('Ready. Insert a value or extract the root.');
  const [running, setRunning]     = useState(false);
  const [speed, setSpeed]         = useState(600); // ms per step
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const compare = (a, b, m) => m === 'min' ? a < b : a > b;

  /* ---- Heapify-Up after insert ---- */
  const insert = async (val) => {
    if (running) return;
    const v = parseInt(val, 10);
    if (isNaN(v)) { setLog('⚠ Enter a valid integer.'); return; }
    setRunning(true);

    const h = [...heap, v];
    let i = h.length - 1;
    setHeap([...h]);
    setHighlights({ [i]: 'inserted' });
    setLog(`Inserted ${v} at index ${i}. Starting Heapify-Up ↑`);
    await delay(speedRef.current);

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      setHighlights({ [i]: 'compare', [parent]: 'compare' });
      setLog(`Comparing ${h[i]} (idx ${i}) with parent ${h[parent]} (idx ${parent})`);
      await delay(speedRef.current);

      if (compare(h[i], h[parent], mode)) {
        setHighlights({ [i]: 'swap', [parent]: 'swap' });
        setLog(`${h[i]} ${mode === 'min' ? '<' : '>'} ${h[parent]} → Swapping ↑`);
        await delay(speedRef.current);
        [h[i], h[parent]] = [h[parent], h[i]];
        setHeap([...h]);
        i = parent;
      } else {
        setHighlights({ [i]: 'settled' });
        setLog(`${h[i]} satisfies ${mode}-heap property. Done ✓`);
        await delay(speedRef.current);
        break;
      }
    }
    if (i === 0) {
      setHighlights({ 0: 'settled' });
      setLog(`Reached root. Heap property satisfied ✓`);
      await delay(speedRef.current);
    }

    setHighlights({});
    setHeap([...h]);
    setRunning(false);
  };

  /* ---- Heapify-Down after extract-root ---- */
  const extractRoot = async () => {
    if (running || heap.length === 0) return;
    setRunning(true);

    const h = [...heap];
    const root = h[0];
    setHighlights({ 0: 'deleted' });
    setLog(`Extracting root ${root}. Moving last element ${h[h.length - 1]} to root.`);
    await delay(speedRef.current);

    h[0] = h[h.length - 1];
    h.pop();
    setHeap([...h]);

    if (h.length === 0) {
      setHighlights({});
      setLog(`Heap is now empty.`);
      setRunning(false);
      return;
    }

    setHighlights({ 0: 'inserted' });
    setLog(`${h[0]} placed at root. Starting Heapify-Down ↓`);
    await delay(speedRef.current);

    let i = 0;
    while (true) {
      const left  = 2 * i + 1;
      const right = 2 * i + 2;
      let target  = i;

      if (left < h.length && compare(h[left], h[target], mode))  target = left;
      if (right < h.length && compare(h[right], h[target], mode)) target = right;

      if (target === i) {
        setHighlights({ [i]: 'settled' });
        setLog(`${h[i]} satisfies ${mode}-heap property at idx ${i}. Done ✓`);
        await delay(speedRef.current);
        break;
      }

      setHighlights({ [i]: 'compare', [target]: 'compare' });
      setLog(`Comparing ${h[i]} (idx ${i}) with child ${h[target]} (idx ${target})`);
      await delay(speedRef.current);

      setHighlights({ [i]: 'swap', [target]: 'swap' });
      setLog(`${h[i]} ${mode === 'min' ? '>' : '<'} ${h[target]} → Swapping ↓`);
      await delay(speedRef.current);

      [h[i], h[target]] = [h[target], h[i]];
      setHeap([...h]);
      i = target;
    }

    setHighlights({});
    setHeap([...h]);
    setRunning(false);
  };

  const reset = (targetMode = mode) => {
    if (running) return;
    const defaultData = targetMode === 'min' ? DEFAULT_MIN_HEAP : DEFAULT_MAX_HEAP;
    setHeap([...defaultData]);
    setHighlights({});
    setLog(`Reset to default ${targetMode}-heap. Ready.`);
    setInputVal('');
  };

  /* ---- SVG Tree layout ---- */
  const buildTreeNodes = (arr) => {
    if (arr.length === 0) return [];
    const nodes = [];
    const W = 560, H = 260;
    const levels = Math.ceil(Math.log2(arr.length + 1));

    for (let i = 0; i < arr.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const xSpacing = W / (totalInLevel + 1);
      const x = xSpacing * (posInLevel + 1);
      const y = 30 + level * (H / levels);
      nodes.push({ i, val: arr[i], x, y, level });
    }
    return nodes;
  };

  const treeNodes = buildTreeNodes(heap);

  const nodeColor = (i) => {
    const h = highlights[i];
    if (h === 'compare')  return { fill: '#f59e0b', stroke: '#d97706', text: '#fff' };
    if (h === 'swap')     return { fill: '#ef4444', stroke: '#dc2626', text: '#fff' };
    if (h === 'inserted') return { fill: '#8b5cf6', stroke: '#7c3aed', text: '#fff' };
    if (h === 'deleted')  return { fill: '#6b7280', stroke: '#4b5563', text: '#fff' };
    if (h === 'settled')  return { fill: '#10b981', stroke: '#059669', text: '#fff' };
    return { fill: '#1e3a5f', stroke: '#2d4f7c', text: '#fff' };
  };

  const arrColor = (i) => {
    const h = highlights[i];
    if (h === 'compare')  return 'bg-amber-400 text-white ring-2 ring-amber-500 scale-110';
    if (h === 'swap')     return 'bg-red-500 text-white ring-2 ring-red-600 scale-110';
    if (h === 'inserted') return 'bg-purple-500 text-white ring-2 ring-purple-600 scale-110';
    if (h === 'deleted')  return 'bg-gray-400 text-white scale-75 opacity-50';
    if (h === 'settled')  return 'bg-emerald-500 text-white ring-2 ring-emerald-600';
    return 'bg-navy-800 text-white';
  };

  const legendItems = [
    { color: 'bg-purple-500', label: 'Just Inserted' },
    { color: 'bg-amber-400',  label: 'Comparing' },
    { color: 'bg-red-500',    label: 'Swapping' },
    { color: 'bg-emerald-500',label: 'Settled' },
    { color: 'bg-gray-400',   label: 'Deleted' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-navy-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Binary className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-navy-900 text-lg">Min / Max Binary Heap</h2>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">Priority Queue</span>
          </div>
          <p className="text-xs text-navy-500">Array + Binary Tree side-by-side · Heapify-Up on insert · Heapify-Down on extract</p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-navy-100 rounded-xl self-start sm:self-auto">
          {['min', 'max'].map(m => (
            <button
              key={m}
              onClick={() => { if (!running) { setMode(m); reset(m); } }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === m ? 'bg-white shadow text-amber-600' : 'text-navy-500 hover:text-navy-800'}`}
            >
              {m === 'min' ? '▼ Min-Heap' : '▲ Max-Heap'}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-navy-100 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insert(inputVal)}
            placeholder="Enter integer…"
            disabled={running}
            className="flex-1 px-3 py-2 rounded-xl border border-navy-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 bg-navy-50"
          />
          <button
            onClick={() => insert(inputVal)}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-40 transition-all shadow-sm"
          >
            Insert ↑
          </button>
        </div>

        <button
          onClick={extractRoot}
          disabled={running || heap.length === 0}
          className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-40 transition-all shadow-sm"
        >
          Extract Root ↓
        </button>

        <button
          onClick={() => reset(mode)}
          disabled={running}
          className="px-4 py-2 rounded-xl bg-navy-100 text-navy-700 text-xs font-bold hover:bg-navy-200 disabled:opacity-40 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-auto">
          <Zap className="w-3.5 h-3.5 text-navy-400" />
          <span className="text-xs text-navy-500 font-medium">Speed</span>
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="text-xs rounded-lg border border-navy-200 px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value={1000}>Slow</option>
            <option value={600}>Normal</option>
            <option value={250}>Fast</option>
            <option value={80}>Instant</option>
          </select>
        </div>
      </div>

      {/* Live Commentary */}
      <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <span className="text-xs text-amber-800 font-medium leading-relaxed">{log}</span>
      </div>

      {/* Legend */}
      <div className="px-6 pt-3 flex flex-wrap gap-3">
        {legendItems.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-[11px] text-navy-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Dual Panel */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Array Representation */}
        <div className="bg-navy-50 rounded-2xl border border-navy-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider">Array View</h3>
            <span className="text-[10px] font-mono text-navy-400">parent(i) = ⌊(i−1)/2⌋</span>
          </div>

          {heap.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-navy-400 text-sm italic">Heap is empty</div>
          ) : (
            <div className="space-y-3">
              {/* Index labels row */}
              <div className="flex flex-wrap gap-2">
                {heap.map((_, i) => (
                  <div key={i} className="w-12 text-center text-[10px] font-mono text-navy-400">[{i}]</div>
                ))}
              </div>
              {/* Value boxes row */}
              <div className="flex flex-wrap gap-2">
                {heap.map((val, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${arrColor(i)}`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              {/* Parent-Child mapping hints */}
              <div className="mt-3 text-[11px] text-navy-400 font-mono space-y-0.5">
                {heap.length > 1 && (
                  <div>Root: heap[0] = <span className="text-navy-700 font-bold">{heap[0]}</span>
                    {' · '}Left child: heap[1]{heap[1] !== undefined ? ` = ${heap[1]}` : ''}
                    {heap[2] !== undefined ? ` · Right child: heap[2] = ${heap[2]}` : ''}
                  </div>
                )}
                {heap.length > 0 && (
                  <div>Size: {heap.length} · {mode === 'min' ? 'Min' : 'Max'}: <span className="text-amber-600 font-bold">{heap[0]}</span> always at root</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Binary Tree SVG */}
        <div className="bg-navy-50 rounded-2xl border border-navy-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider">Binary Tree View</h3>
            <span className="text-[10px] font-mono text-navy-400">children(i) = 2i+1, 2i+2</span>
          </div>

          {heap.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-navy-400 text-sm italic">Heap is empty</div>
          ) : (
            <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ minHeight: 160 }}>
              {/* Draw edges first */}
              {treeNodes.map(({ i, x, y }) => {
                const parentIdx = Math.floor((i - 1) / 2);
                if (i === 0) return null;
                const p = treeNodes[parentIdx];
                return (
                  <line
                    key={`edge-${i}`}
                    x1={p.x} y1={p.y}
                    x2={x}  y2={y}
                    stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"
                  />
                );
              })}

              {/* Draw nodes */}
              {treeNodes.map(({ i, val, x, y }) => {
                const { fill, stroke, text } = nodeColor(i);
                return (
                  <g key={`node-${i}`} style={{ transition: 'all 0.3s' }}>
                    <circle cx={x} cy={y} r={20} fill={fill} stroke={stroke} strokeWidth="2" />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={text} fontSize="13" fontWeight="700" fontFamily="monospace"
                    >
                      {val}
                    </text>
                    {/* index badge */}
                    <text x={x + 23} y={y - 13} textAnchor="middle" dominantBaseline="middle"
                      fill="#94a3b8" fontSize="9" fontFamily="monospace"
                    >
                      [{i}]
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Complexity Footer */}
      <div className="mx-6 mb-6 px-4 py-3 rounded-xl bg-navy-900 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">Time Complexity</span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <span className="text-amber-300">Insert (Heapify-Up): <span className="text-white font-bold">O(log n)</span></span>
          <span className="text-amber-300">Extract Root (Heapify-Down): <span className="text-white font-bold">O(log n)</span></span>
          <span className="text-amber-300">Build Heap: <span className="text-white font-bold">O(n)</span></span>
          <span className="text-amber-300">Peek Root: <span className="text-white font-bold">O(1)</span></span>
        </div>
      </div>
    </div>
  );
};

export const VisualizerPage = ({ onNavigate }) => {
  const [activeVisualizer, setActiveVisualizer] = useState('dijkstra');

  const tools = [
    {
      id: 'dijkstra',
      title: "Dijkstra's Shortest Path Grid",
      desc: 'Interactive obstacle grid with priority queue exploration and golden shortest path traceback.',
      icon: Navigation,
      color: 'text-brand-purple',
      badge: 'Weighted Grid'
    },
    {
      id: 'recursion',
      title: 'Recursion & Call Stack Tracer',
      desc: 'Step-by-step memory frame allocations, return unwinding, and base cases.',
      icon: Cpu,
      color: 'text-brand-purple',
      badge: 'Interactive RAM'
    },
    {
      id: 'avl',
      title: 'AVL Tree & Rotations Simulator',
      desc: 'Self-balancing BST rebalancing: LL, RR, LR, and RL rotations with Balance Factor telemetry.',
      icon: GitBranch,
      color: 'text-brand-blue',
      badge: 'Hierarchical'
    },
    {
      id: 'sorting',
      title: 'Sorting Algorithms Step Race',
      desc: 'Live adjacent comparisons, in-place swaps, and asymptotic complexity boundaries.',
      icon: BarChart3,
      color: 'text-amber-500',
      badge: 'Contiguous'
    },
    {
      id: 'graph',
      title: 'Graph Traversal (BFS vs DFS)',
      desc: 'Compare FIFO Queue level-by-level exploration against LIFO Stack deep branch visits.',
      icon: Network,
      color: 'text-brand-emerald',
      badge: 'Non-Linear'
    },
    {
      id: 'heap',
      title: 'Min / Max Binary Heap',
      desc: 'Array + tree side-by-side showing heapify-up on insert and heapify-down on extract-root.',
      icon: Binary,
      color: 'text-amber-500',
      badge: 'Priority Queue'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-navy-200/80 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5 bg-brand-purple/10 px-2.5 py-1 rounded-full border border-brand-purple/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Cognitive Lab</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-2">
            Algorithm & Data Structure Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 max-w-2xl leading-relaxed">
            Inspect invisible physical computer memory, pointer reassignments, and asymptotic state transitions in real time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tutor')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-all shadow-soft-xs self-start md:self-auto"
        >
          <Code2 className="w-4 h-4 text-brand-purple-light" />
          <span>Ask AI Tutor About Concepts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visualizer Category Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeVisualizer === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveVisualizer(tool.id)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isActive
                  ? 'bg-white border-brand-purple shadow-soft-md ring-2 ring-brand-purple/20'
                  : 'bg-white/80 border-navy-200/70 hover:bg-white hover:border-navy-300 shadow-soft-xs'
              }`}
            >
              <div className="flex items-center justify-between pb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-brand-purple text-white' : 'bg-navy-100 text-navy-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-navy-100 text-navy-600 px-2 py-0.5 rounded">
                  {tool.badge}
                </span>
              </div>
              <h3 className="font-bold text-xs text-navy-900 mt-1">{tool.title}</h3>
              <p className="text-[11px] text-navy-500 mt-1 line-clamp-2 leading-relaxed">{tool.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Module */}
      <div className="transition-all">
        {activeVisualizer === 'dijkstra' && (
          <DijkstraVisualizer />
        )}

        {activeVisualizer === 'recursion' && (
          <div className="space-y-4">
            <RecursionVisualizer />
          </div>
        )}

        {activeVisualizer === 'avl' && (
          <AVLVisualizer />
        )}

        {activeVisualizer === 'sorting' && (
          <SortingVisualizer />
        )}

        {activeVisualizer === 'graph' && (
          <GraphVisualizer />
        )}

        {activeVisualizer === 'heap' && (
          <HeapVisualizer />
        )}
      </div>

    </div>
  );
};
