export const dsaTopics = [
  {
    name: 'Arrays',
    slug: 'arrays',
    description: 'Contiguous memory allocations, indexing, sliding window, prefix sums, and two-pointer techniques.',
    prerequisites: [],
    subject: 'Data Structures & Algorithms',
    order: 1,
    icon: 'Layers',
    estimatedHours: 4
  },
  {
    name: 'Strings',
    slug: 'strings',
    description: 'Character manipulation, string matching, palindromes, anagrams, and two-pointer string parsing.',
    prerequisites: ['arrays'],
    subject: 'Data Structures & Algorithms',
    order: 2,
    icon: 'Type',
    estimatedHours: 3
  },
  {
    name: 'Recursion',
    slug: 'recursion',
    description: 'Self-referential functions, base cases, call stacks, recursion trees, and divide-and-conquer.',
    prerequisites: ['arrays'],
    subject: 'Data Structures & Algorithms',
    order: 3,
    icon: 'RotateCcw',
    estimatedHours: 6
  },
  {
    name: 'Binary Search',
    slug: 'binary-search',
    description: 'Logarithmic search on monotonic search spaces, lower/upper bounds, and rotated sorted arrays.',
    prerequisites: ['arrays'],
    subject: 'Data Structures & Algorithms',
    order: 4,
    icon: 'Search',
    estimatedHours: 4
  },
  {
    name: 'Sorting',
    slug: 'sorting',
    description: 'Comparison and non-comparison algorithms: QuickSort, MergeSort, HeapSort, stability, and complexities.',
    prerequisites: ['arrays', 'recursion'],
    subject: 'Data Structures & Algorithms',
    order: 5,
    icon: 'ArrowDownUp',
    estimatedHours: 5
  },
  {
    name: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Singly, doubly, circular node chains, pointer manipulation, fast/slow pointers, and cycle detection.',
    prerequisites: ['arrays'],
    subject: 'Data Structures & Algorithms',
    order: 6,
    icon: 'Link',
    estimatedHours: 4
  },
  {
    name: 'Stacks and Queues',
    slug: 'stacks-and-queues',
    description: 'LIFO & FIFO primitives, monotonic stacks, expression evaluation, and sliding window maximums.',
    prerequisites: ['arrays', 'linked-lists'],
    subject: 'Data Structures & Algorithms',
    order: 7,
    icon: 'ListFilter',
    estimatedHours: 4
  },
  {
    name: 'Trees',
    slug: 'trees',
    description: 'Binary trees, BSTs, preorder/inorder/postorder traversals, height balancing, and LCA.',
    prerequisites: ['recursion', 'stacks-and-queues'],
    subject: 'Data Structures & Algorithms',
    order: 8,
    icon: 'GitFork',
    estimatedHours: 7
  },
  {
    name: 'Graphs',
    slug: 'graphs',
    description: 'Adjacency lists/matrices, BFS, DFS, cycle detection, topological sorting, Dijkstra, and MST.',
    prerequisites: ['trees', 'stacks-and-queues', 'recursion'],
    subject: 'Data Structures & Algorithms',
    order: 9,
    icon: 'Share2',
    estimatedHours: 8
  },
  {
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Overlapping subproblems, optimal substructure, memoization, tabulation, state transitions, and space optimization.',
    prerequisites: ['recursion', 'arrays'],
    subject: 'Data Structures & Algorithms',
    order: 10,
    icon: 'Sparkles',
    estimatedHours: 10
  }
];

export const dsaQuestions = [
  // --- ARRAYS ---
  {
    id: 'arr_1',
    topicSlug: 'arrays',
    topicName: 'Arrays',
    difficulty: 'easy',
    questionText: 'What is the time complexity to access an element at index i in a standard dynamically sized contiguous array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Arrays store elements in contiguous memory locations. Using pointer arithmetic (base_address + i * element_size), access is instantaneous O(1).',
    misconceptionTip: 'Remember that accessing by known index is constant time, whereas searching for an unknown value requires O(n) scan.'
  },
  {
    id: 'arr_2',
    topicSlug: 'arrays',
    topicName: 'Arrays',
    difficulty: 'medium',
    questionText: 'Given an array nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4], which technique finds the maximum contiguous subarray sum in O(n) time?',
    options: ['Binary search over indices', "Kadane's Algorithm", 'Floyd Cycle Detection', 'Two pointers from both ends'],
    correctAnswer: 1,
    explanation: "Kadane's Algorithm maintains a running sum: current_sum = max(nums[i], current_sum + nums[i]) and updates max_so_far in a single pass O(n).",
    misconceptionTip: 'Brute force checking all pairs takes O(n²), while Kadane achieves linear O(n) by greedily deciding whether to start fresh at index i.'
  },
  {
    id: 'arr_3',
    topicSlug: 'arrays',
    topicName: 'Arrays',
    difficulty: 'hard',
    questionText: 'In the "Trapping Rain Water" problem on an array of heights, what is the optimal auxiliary space complexity achievable while maintaining O(n) time?',
    options: ['O(n) using prefix/suffix arrays', 'O(1) using two pointers', 'O(log n) using recursion', 'O(n²) using brute force matrix'],
    correctAnswer: 1,
    explanation: 'By maintaining left_max and right_max with two pointers meeting in the middle, we determine water height without storing prefix/suffix arrays, yielding O(1) space.',
    misconceptionTip: 'While DP prefix/suffix max arrays take O(n) space, the two-pointer technique compresses this to O(1) space.'
  },

  // --- STRINGS ---
  {
    id: 'str_1',
    topicSlug: 'strings',
    topicName: 'Strings',
    difficulty: 'easy',
    questionText: 'To verify whether a string of length n is a palindrome, what is the most efficient space-optimal strategy?',
    options: ['Reverse the entire string into a new buffer O(n) space', 'Two pointers from start and end moving inward with O(1) auxiliary space', 'Convert to a tree and traverse in-order', 'Generate all permutations O(n!)'],
    correctAnswer: 1,
    explanation: 'Using two pointers starting at index 0 and index n-1, comparing characters and moving inwards requires O(n) time and O(1) auxiliary space.',
    misconceptionTip: 'Reversing creating a new string takes O(n) memory allocation, whereas two pointers requires zero extra allocation.'
  },
  {
    id: 'str_2',
    topicSlug: 'strings',
    topicName: 'Strings',
    difficulty: 'medium',
    questionText: 'Which algorithm finds the longest substring without repeating characters in O(n) time?',
    options: ['Sliding window with a frequency map / set', 'Nested loops comparing each substring', 'Binary exponentiation', 'Dijkstra shortest path'],
    correctAnswer: 0,
    explanation: 'A sliding window with left and right pointers dynamically expands right and contracts left whenever a duplicate character is encountered, visiting each character at most twice O(n).',
    misconceptionTip: 'Checking all substrings takes O(n³); sliding window reduces this to O(n) by never re-evaluating known valid windows.'
  },
  {
    id: 'str_3',
    topicSlug: 'strings',
    topicName: 'Strings',
    difficulty: 'hard',
    questionText: 'In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the $\\pi$ (LPS - Longest Proper Prefix which is also Suffix) table allow the search phase to avoid?',
    options: ['Re-evaluating characters in the text that have already been matched', 'Allocating memory for pattern characters', 'Checking the last character of the pattern', 'Handling Unicode symbols'],
    correctAnswer: 0,
    explanation: 'The LPS table allows KMP to shift the pattern forward based on previous matches without ever backtracking the text pointer, achieving strict O(n + m) time.',
    misconceptionTip: 'Naive pattern matching backtracks text pointer j backwards upon mismatch; KMP keeps text pointer monotonic.'
  },

  // --- RECURSION ---
  {
    id: 'rec_1',
    topicSlug: 'recursion',
    topicName: 'Recursion',
    difficulty: 'easy',
    questionText: 'What is the absolute prerequisite condition that every recursive function must have to prevent a Stack Overflow error?',
    options: ['At least two recursive branch calls', 'A base case that terminates recursion without further calls', 'A global static variable counter', 'Tail call optimization compiler flag'],
    correctAnswer: 1,
    explanation: 'A base case defines the termination condition where the function returns a concrete answer directly, halting infinite call stack expansion.',
    misconceptionTip: 'Without a reachable base case, recursive stack frames continuously consume memory until Call Stack limit is exceeded.'
  },
  {
    id: 'rec_2',
    topicSlug: 'recursion',
    topicName: 'Recursion',
    difficulty: 'medium',
    questionText: 'Consider the classic un-memoized Fibonacci recursion: T(n) = T(n-1) + T(n-2) + O(1). What is its time complexity and maximum recursion call stack depth?',
    options: ['Time: O(2ⁿ), Stack Depth: O(n)', 'Time: O(n²), Stack Depth: O(log n)', 'Time: O(n), Stack Depth: O(1)', 'Time: O(n log n), Stack Depth: O(n)'],
    correctAnswer: 0,
    explanation: 'The recursion tree has branching factor ~2 yielding ~2ⁿ nodes (exponential time), but the maximum depth of the call stack at any moment is linear O(n).',
    misconceptionTip: 'Students often confuse the total number of function calls (exponential 2ⁿ) with the maximum stack memory depth simultaneously in use (O(n)).'
  },
  {
    id: 'rec_3',
    topicSlug: 'recursion',
    topicName: 'Recursion',
    difficulty: 'hard',
    questionText: 'In recursive backtracking (e.g., N-Queens or Sudoku Solver), what is the key state management action performed immediately after a recursive call returns?',
    options: ['Memory deallocation via garbage collector', 'Undo / revert the tentative move (backtrack) to restore state for other branches', 'Increment base case counter by 1', 'Terminate the entire program'],
    correctAnswer: 1,
    explanation: 'Backtracking explores state-space trees by making a choice, recursing, and then explicitly reverting (undoing) that choice so the next candidate sibling can be tested.',
    misconceptionTip: 'If state is mutated in-place without undoing after returning, subsequent sibling branches operate on corrupted search states.'
  },

  // --- BINARY SEARCH ---
  {
    id: 'bs_1',
    topicSlug: 'binary-search',
    topicName: 'Binary Search',
    difficulty: 'easy',
    questionText: 'What essential property must a collection have for standard Binary Search to be directly applicable?',
    options: ['Elements must be sorted in monotonic order', 'Elements must all be distinct positive integers', 'Must be implemented as a Linked List', 'Elements must be powers of 2'],
    correctAnswer: 0,
    explanation: 'Binary Search relies on monotonicity (sorted order) so that comparing the target with the middle element eliminates half of the search space with certainty.',
    misconceptionTip: 'Binary search cannot be run on unsorted arrays without sorting first or having a monotonic predicate function.'
  },
  {
    id: 'bs_2',
    topicSlug: 'binary-search',
    topicName: 'Binary Search',
    difficulty: 'medium',
    questionText: 'Why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2` in typed languages like C++/Java/Go?',
    options: ['It executes in fewer CPU clock cycles', 'It prevents integer overflow when low + high exceeds maximum 32-bit signed integer', 'It handles negative array indices automatically', 'It rounds up instead of down'],
    correctAnswer: 1,
    explanation: 'If low and high are large (e.g. > 2³¹ - 1 / 2), `low + high` overflows into a negative number causing an out-of-bounds error. `low + (high - low) / 2` mathematically prevents overflow.',
    misconceptionTip: 'Both produce the exact same algebraic value, but the former avoids intermediate arithmetic overflow.'
  },
  {
    id: 'bs_3',
    topicSlug: 'binary-search',
    topicName: 'Binary Search',
    difficulty: 'hard',
    questionText: 'When applying "Binary Search on Answer" (e.g., Koko Eating Bananas, Capacity to Ship Packages), what must be true about the validation check function isValid(speed)?',
    options: ['It must run in O(1) time', 'It must return a monotonic boolean series (e.g. False...False, True...True)', 'It must be recursive', 'It must sort the input array'],
    correctAnswer: 1,
    explanation: 'Binary search on answer requires that as the parameter increases, the feasibility condition is monotonic (once feasible, all larger values are feasible, or vice-versa).',
    misconceptionTip: 'The search space is the range of answers [min_speed, max_speed], not the elements of the array.'
  },

  // --- SORTING ---
  {
    id: 'sort_1',
    topicSlug: 'sorting',
    topicName: 'Sorting',
    difficulty: 'easy',
    questionText: 'What is the theoretical lower bound time complexity for any comparison-based sorting algorithm in the worst case?',
    options: ['Ω(n)', 'Ω(n log n)', 'Ω(n²)', 'Ω(log n)'],
    correctAnswer: 1,
    explanation: 'Any comparison sort can be modeled as a decision tree with n! leaves. The height is at least log₂(n!) = Ω(n log n).',
    misconceptionTip: 'Non-comparison sorts (Counting Sort, Radix Sort) can achieve O(n) under restricted integer key assumptions, but comparison sorts cannot beat n log n.'
  },
  {
    id: 'sort_2',
    topicSlug: 'sorting',
    topicName: 'Sorting',
    difficulty: 'medium',
    questionText: 'Why does MergeSort require O(n) auxiliary space for arrays, whereas QuickSort can sort in-place with O(log n) auxiliary stack space?',
    options: ['MergeSort uses recursion while QuickSort does not', 'Merging two sorted contiguous array slices requires temporary auxiliary buffer', 'MergeSort copies the array n times', 'QuickSort never swaps items in memory'],
    correctAnswer: 1,
    explanation: 'In arrays, merging two contiguous sorted halves without extra buffer is O(n²) or overly complex, so standard MergeSort copies elements into a temporary array of size O(n).',
    misconceptionTip: 'MergeSort on Linked Lists can be done in O(1) auxiliary space by rewiring pointers, but arrays require O(n) buffer.'
  },
  {
    id: 'sort_3',
    topicSlug: 'sorting',
    topicName: 'Sorting',
    difficulty: 'hard',
    questionText: 'In QuickSelect algorithm for finding the k-th smallest element, what is the average and worst-case time complexity with random pivot selection?',
    options: ['Average O(n), Worst-case O(n²)', 'Average O(n log n), Worst-case O(n log n)', 'Average O(k), Worst-case O(n)', 'Average O(1), Worst-case O(log n)'],
    correctAnswer: 0,
    explanation: 'Because QuickSelect only recurses into the partition containing index k (T(n) = T(n/2) + O(n) = O(n)), average time is linear O(n). Worst case (bad pivots) degenerates to O(n²).',
    misconceptionTip: 'Unlike QuickSort which recurses into both partitions O(n log n), QuickSelect only recurses into one partition yielding O(n).'
  },

  // --- LINKED LISTS ---
  {
    id: 'll_1',
    topicSlug: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'easy',
    questionText: 'To reverse a singly linked list iteratively in a single pass, how many pointer variables are typically required?',
    options: ['1 pointer', '3 pointers: prev, curr, next', 'n pointers for each node', 'None, linked lists reverse automatically'],
    correctAnswer: 1,
    explanation: 'Reversing requires keeping track of `prev` (to point curr.next to), `curr` (node currently being updated), and `next` (to not lose the remainder of the list before breaking the link).',
    misconceptionTip: 'If you overwrite curr.next without storing original curr.next in a temporary variable, the rest of the list is permanently lost.'
  },
  {
    id: 'll_2',
    topicSlug: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'medium',
    questionText: "In Floyd's Cycle Detection algorithm (Tortoise and Hare), if a cycle exists, why are the slow (1 step) and fast (2 steps) pointers guaranteed to meet inside the loop?",
    options: ['The loop length is always even', 'The relative distance between fast and slow decreases by exactly 1 each step modulo loop size', 'Fast pointer reverses direction upon reaching tail', 'Slow pointer stops and waits at cycle entry'],
    correctAnswer: 1,
    explanation: 'In each step, fast gains 1 step on slow. In modular arithmetic of cycle length C, the relative gap reduces by 1 per iteration, guaranteeing collision without skipping over.',
    misconceptionTip: 'Fast moves 2 and slow moves 1, meaning their relative speed is 1. Since relative speed is 1, they cannot jump over each other.'
  },
  {
    id: 'll_3',
    topicSlug: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'hard',
    questionText: 'Once Floyd’s cycle detection pointers meet at node M inside a cycle, how do we find the exact cycle start node mathematically?',
    options: ['Reset fast to head, keep both moving at speed 1; they collide at the cycle start', 'Reverse the list and count total nodes', 'Move slow backwards by M steps', 'Take length of cycle and divide by 2'],
    correctAnswer: 0,
    explanation: 'If distance from head to start is L, and meeting point is at distance k from start: distance traveled by slow = L + k, fast = 2(L + k). Fast also = L + k + nC. Thus L = nC - k. Resetting one pointer to head and stepping both by 1 guarantees meeting at cycle entry.',
    misconceptionTip: 'Students often think fast must continue at speed 2, but both pointers must move at speed 1 to find the start node.'
  },

  // --- STACKS AND QUEUES ---
  {
    id: 'sq_1',
    topicSlug: 'stacks-and-queues',
    topicName: 'Stacks and Queues',
    difficulty: 'easy',
    questionText: 'Which abstract data type follows the Last-In, First-Out (LIFO) protocol?',
    options: ['Queue', 'Stack', 'Priority Queue', 'Circular Buffer'],
    correctAnswer: 1,
    explanation: 'A Stack is inherently LIFO: the most recently inserted item is the first one removed (e.g. browser back button, function call stack).',
    misconceptionTip: 'Queue follows FIFO (First-In First-Out), while Stack follows LIFO.'
  },
  {
    id: 'sq_2',
    topicSlug: 'stacks-and-queues',
    topicName: 'Stacks and Queues',
    difficulty: 'medium',
    questionText: 'To find the "Next Greater Element" for every item in an array in O(n) total time, which data structure is optimal?',
    options: ['Monotonic decreasing stack', 'Min-heap priority queue', 'Doubly linked list', 'Binary search tree'],
    correctAnswer: 0,
    explanation: 'A monotonic decreasing stack stores indices of unresolved elements. When encountering an element greater than stack top, it is the next greater element; each element is pushed and popped at most once O(n).',
    misconceptionTip: 'Nested loops take O(n²); monotonic stack maintains order and processes each item at most twice overall.'
  },
  {
    id: 'sq_3',
    topicSlug: 'stacks-and-queues',
    topicName: 'Stacks and Queues',
    difficulty: 'hard',
    questionText: 'In the Sliding Window Maximum problem on an array of length n with window size k, how does a Monotonic Deque achieve O(n) overall time?',
    options: ['It computes max of all k items every slide O(n*k)', 'It stores indices with elements in decreasing order, popping expired indices from front and smaller elements from back', 'It uses quicksort on every window', 'It calculates prefix XOR'],
    correctAnswer: 1,
    explanation: 'The monotonic deque keeps indices of candidates in strictly decreasing order of values. Front always holds current window maximum. Each index is pushed and popped at most once O(n).',
    misconceptionTip: 'Using a Heap for sliding window takes O(n log k); monotonic deque achieves true linear O(n).'
  },

  // --- TREES ---
  {
    id: 'tree_1',
    topicSlug: 'trees',
    topicName: 'Trees',
    difficulty: 'easy',
    questionText: 'In a Binary Search Tree (BST), which tree traversal visits all node values in strictly non-decreasing sorted order?',
    options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
    correctAnswer: 1,
    explanation: 'By definition of BST, all keys in the left subtree are smaller than root, and right are larger. Traversing Left -> Root -> Right yields sorted ascending order.',
    misconceptionTip: 'Pre-order is useful for cloning/serializing trees, while In-order guarantees sorted traversal in a BST.'
  },
  {
    id: 'tree_2',
    topicSlug: 'trees',
    topicName: 'Trees',
    difficulty: 'medium',
    questionText: 'What is the worst-case time complexity of searching a value in an un-balanced Binary Search Tree with n nodes?',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'If elements are inserted in already sorted order (1 -> 2 -> 3 -> 4), the BST degenerates into a single long linked list (skewed tree), causing search to degrade to linear O(n).',
    misconceptionTip: 'O(log n) is only guaranteed if the tree is balanced (like AVL or Red-Black Tree).'
  },
  {
    id: 'tree_3',
    topicSlug: 'trees',
    topicName: 'Trees',
    difficulty: 'hard',
    questionText: 'To find the Lowest Common Ancestor (LCA) of nodes p and q in a general binary tree (not a BST) in O(n) time and O(h) space, what post-order logic is used?',
    options: ['Check if p and q are in the same level using BFS', 'Recurse on left and right: if left and right both return non-null, current node is the LCA', 'Compute depths and subtract differences', 'Sort tree nodes into an array'],
    correctAnswer: 1,
    explanation: 'If a node finds p in one branch and q in the other branch, that node is the split point and hence the Lowest Common Ancestor. If only one branch returns non-null, bubble that up.',
    misconceptionTip: 'In BST, LCA is simply where p.val and q.val diverge from root.val. In general binary tree, both subtrees must be searched.'
  },

  // --- GRAPHS ---
  {
    id: 'graph_1',
    topicSlug: 'graphs',
    topicName: 'Graphs',
    difficulty: 'easy',
    questionText: 'Which graph traversal strategy uses a Queue and is guaranteed to find the shortest path in an unweighted graph?',
    options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Topological Sort', 'Kruskal Algorithm'],
    correctAnswer: 1,
    explanation: 'BFS explores nodes layer by layer in order of increasing distance from start node, guaranteeing that the first time a target is popped, it is along the shortest path in unweighted graphs.',
    misconceptionTip: 'DFS explores as deep as possible first and does not find the shortest path in unweighted graphs.'
  },
  {
    id: 'graph_2',
    topicSlug: 'graphs',
    topicName: 'Graphs',
    difficulty: 'medium',
    questionText: 'Can Topological Sorting be performed on a directed graph that contains a cycle?',
    options: ['Yes, cycles are simply placed at the end', 'No, topological sort is strictly defined only on Directed Acyclic Graphs (DAGs)', 'Yes, if visited with DFS', 'Yes, if all edge weights are positive'],
    correctAnswer: 1,
    explanation: 'A topological ordering requires that for every directed edge u -> v, u appears before v. In a cycle (A -> B -> C -> A), no such linear order can exist. Hence, cycle detection fails topological sorting.',
    misconceptionTip: 'If Kahn’s algorithm processes fewer vertices than V, it indicates the graph contains a cycle.'
  },
  {
    id: 'graph_3',
    topicSlug: 'graphs',
    topicName: 'Graphs',
    difficulty: 'hard',
    questionText: "Why does standard Dijkstra's algorithm fail to produce correct shortest paths on graphs with negative edge weights?",
    options: ['It uses a priority queue', "It greedily assumes that once a vertex's shortest distance is finalized and visited, no future path can decrease it", 'It runs in exponential time on negative numbers', 'It causes an integer underflow error'],
    correctAnswer: 1,
    explanation: "Dijkstra's greedy choice assumes adding any edge only increases path cost. A negative edge can retroactively decrease the distance to an already 'finalized' node, violating correctness.",
    misconceptionTip: 'Bellman-Ford or SPFA must be used for graphs with negative edge weights.'
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: 'dp_1',
    topicSlug: 'dynamic-programming',
    topicName: 'Dynamic Programming',
    difficulty: 'easy',
    questionText: 'What are the two foundational properties a problem must possess for Dynamic Programming to be applicable?',
    options: ['Unsorted input and prime numbers', 'Optimal Substructure and Overlapping Subproblems', 'Greedy choices and deterministic graphs', 'Divide-and-conquer with independent subproblems'],
    correctAnswer: 1,
    explanation: 'Optimal substructure means optimal solution of the problem contains optimal solutions to subproblems; overlapping subproblems means the same subproblems are solved repeatedly.',
    misconceptionTip: 'Divide and conquer (like MergeSort) solves non-overlapping subproblems; DP specifically addresses overlapping subproblems through memoization/tabulation.'
  },
  {
    id: 'dp_2',
    topicSlug: 'dynamic-programming',
    topicName: 'Dynamic Programming',
    difficulty: 'medium',
    questionText: 'In the 0/1 Knapsack problem with n items and capacity W, why is the standard 2D DP array space optimizable to a 1D array of size W+1?',
    options: ['The problem has no overlapping subproblems', 'Each dp[w] only depends on the previous row dp[i-1][w] and dp[i-1][w - weight], so traversing w backwards prevents overwriting', 'By sorting items in ascending value', 'Knapsack is solvable in O(1) space'],
    correctAnswer: 1,
    explanation: 'Since state at item i depends only on item i-1, we can reuse one array by updating capacity w in reverse (from W down to weight), ensuring we read values from the previous iteration.',
    misconceptionTip: 'Traversing forwards in 1D array would solve Unbounded Knapsack (allowing the same item to be reused multiple times).'
  },
  {
    id: 'dp_3',
    topicSlug: 'dynamic-programming',
    topicName: 'Dynamic Programming',
    difficulty: 'hard',
    questionText: 'In the Longest Increasing Subsequence (LIS) problem, while the standard DP takes O(n²), how does the Patience Sorting / Binary Search method achieve O(n log n)?',
    options: ['By sorting the original array first', 'By maintaining tails array where tails[i] stores smallest tail of all increasing subsequences of length i+1, updated via binary search', 'By building a suffix tree', 'By using segment tree over values'],
    correctAnswer: 1,
    explanation: 'The `tails` array is strictly increasing. For each element x, we binary search for the first tail >= x. If found, we update it to x; otherwise append x. Size of tails is the LIS length.',
    misconceptionTip: 'The tails array does not necessarily represent the actual LIS sequence itself, but its length is always guaranteed to equal the maximum LIS.'
  }
];

