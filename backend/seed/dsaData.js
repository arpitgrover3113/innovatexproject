// Comprehensive Curriculum of DSA Topics & Curated Adaptive Question Bank
export const dsaTopics = [
  {
    "name": "Arrays",
    "slug": "arrays",
    "description": "Contiguous memory allocations, indexing, sliding window, prefix sums, and two-pointer techniques.",
    "prerequisites": [],
    "subject": "Data Structures & Algorithms",
    "order": 1,
    "icon": "Layers",
    "estimatedHours": 4
  },
  {
    "name": "Strings",
    "slug": "strings",
    "description": "Character manipulation, string matching, palindromes, anagrams, and two-pointer string parsing.",
    "prerequisites": [
      "arrays"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 2,
    "icon": "Type",
    "estimatedHours": 3
  },
  {
    "name": "Recursion",
    "slug": "recursion",
    "description": "Self-referential functions, base cases, call stacks, recursion trees, and divide-and-conquer.",
    "prerequisites": [
      "arrays"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 3,
    "icon": "RotateCcw",
    "estimatedHours": 6
  },
  {
    "name": "Binary Search",
    "slug": "binary-search",
    "description": "Logarithmic search on monotonic search spaces, lower/upper bounds, and rotated sorted arrays.",
    "prerequisites": [
      "arrays"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 4,
    "icon": "Search",
    "estimatedHours": 4
  },
  {
    "name": "Sorting",
    "slug": "sorting",
    "description": "Comparison and non-comparison algorithms: QuickSort, MergeSort, HeapSort, stability, and complexities.",
    "prerequisites": [
      "arrays",
      "recursion"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 5,
    "icon": "ArrowDownUp",
    "estimatedHours": 5
  },
  {
    "name": "Linked Lists",
    "slug": "linked-lists",
    "description": "Singly, doubly, circular node chains, pointer manipulation, fast/slow pointers, and cycle detection.",
    "prerequisites": [
      "arrays"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 6,
    "icon": "Link",
    "estimatedHours": 4
  },
  {
    "name": "Stacks and Queues",
    "slug": "stacks-and-queues",
    "description": "LIFO & FIFO primitives, monotonic stacks, expression evaluation, and sliding window maximums.",
    "prerequisites": [
      "arrays",
      "linked-lists"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 7,
    "icon": "ListFilter",
    "estimatedHours": 4
  },
  {
    "name": "Trees",
    "slug": "trees",
    "description": "Binary trees, BSTs, preorder/inorder/postorder traversals, height balancing, and LCA.",
    "prerequisites": [
      "recursion",
      "stacks-and-queues"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 8,
    "icon": "GitFork",
    "estimatedHours": 7
  },
  {
    "name": "Graphs",
    "slug": "graphs",
    "description": "Adjacency lists/matrices, BFS, DFS, cycle detection, topological sorting, Dijkstra, and MST.",
    "prerequisites": [
      "trees",
      "stacks-and-queues",
      "recursion"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 9,
    "icon": "Share2",
    "estimatedHours": 8
  },
  {
    "name": "Dynamic Programming",
    "slug": "dynamic-programming",
    "description": "Overlapping subproblems, optimal substructure, memoization, tabulation, state transitions, and space optimization.",
    "prerequisites": [
      "recursion",
      "arrays"
    ],
    "subject": "Data Structures & Algorithms",
    "order": 10,
    "icon": "Sparkles",
    "estimatedHours": 10
  }
];

export const dsaQuestions = [
  {
    "id": "arr_1",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "easy",
    "questionText": "What is the time complexity to access an element at index i in a standard dynamically sized contiguous array?",
    "options": [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    "correctAnswer": 0,
    "explanation": "Arrays store elements in contiguous memory locations. Using pointer arithmetic (base_address + i * element_size), access is instantaneous O(1).",
    "misconceptionTip": "Remember that accessing by known index is constant time, whereas searching for an unknown value requires an O(n) scan."
  },
  {
    "id": "arr_2",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "easy",
    "questionText": "If you need to verify whether an array contains any duplicate integers in linear O(n) time, which data structure is most optimal?",
    "options": [
      "A HashSet to store visited numbers in average O(1) per lookup",
      "Nested for-loops checking all pairs in O(1) space",
      "A queue to cycle through elements in O(n²)",
      "Sorting the array using O(n²) memory"
    ],
    "correctAnswer": 0,
    "explanation": "A HashSet provides average O(1) insertion and membership testing, enabling duplicate verification in a single O(n) pass with O(n) auxiliary space.",
    "misconceptionTip": "Nested loops require zero extra memory but take quadratic O(n²) time; HashSet trades O(n) memory for linear O(n) speed."
  },
  {
    "id": "arr_3",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "easy",
    "questionText": "Given an array of numbers, what technique allows answering multiple range sum queries sumRange(L, R) in O(1) time after O(n) preprocessing?",
    "options": [
      "Prefix Sums array: P[i] = P[i-1] + nums[i], so sum(L..R) = P[R] - P[L-1]",
      "Re-scanning elements between L and R on every query in O(R-L)",
      "Sorting the array in ascending order",
      "Reversing the array in-place"
    ],
    "correctAnswer": 0,
    "explanation": "Precomputing a prefix sum array in O(n) time allows any arbitrary range sum query sum(L, R) to be answered in constant O(1) time by computing prefix[R] - prefix[L-1].",
    "misconceptionTip": "Naive re-summing on every query takes O(n) per query; prefix sums answer subsequent queries in O(1)."
  },
  {
    "id": "arr_4",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "medium",
    "questionText": "Given an array nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4], which technique finds the maximum contiguous subarray sum in O(n) time?",
    "options": [
      "Binary search over indices",
      "Kadane's Algorithm",
      "Floyd Cycle Detection",
      "Two pointers from both ends"
    ],
    "correctAnswer": 1,
    "explanation": "Kadane's Algorithm maintains a running sum: current_sum = max(nums[i], current_sum + nums[i]) and updates max_so_far in a single pass O(n).",
    "misconceptionTip": "Brute force checking all pairs takes O(n²), while Kadane achieves linear O(n) by greedily deciding whether to start fresh at index i."
  },
  {
    "id": "arr_5",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "medium",
    "questionText": "For an already sorted array of numbers, which technique finds two numbers that sum up to a target in O(n) time and strictly O(1) space?",
    "options": [
      "Two pointers starting at opposite ends moving inward based on the current sum",
      "A Hash Map storing complements (takes O(n) memory)",
      "Nested loops checking all pairs in O(n²)",
      "Breadth-First Search"
    ],
    "correctAnswer": 0,
    "explanation": "Because the array is sorted, if left + right < target we must increment left; if left + right > target we decrement right. This solves Two Sum II in O(n) time and O(1) space.",
    "misconceptionTip": "While a Hash Map solves Two Sum in O(n) time on unsorted arrays, on sorted arrays two pointers solves it with zero extra heap memory."
  },
  {
    "id": "arr_6",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "medium",
    "questionText": "To rotate an array of length n right by k steps in O(n) time and O(1) space, what is the three-step reversal algorithm?",
    "options": [
      "Reverse the entire array, reverse the first k elements, then reverse the remaining n-k elements",
      "Reverse elements at even indices only",
      "Shift every element right by 1 position k times in O(n*k)",
      "Swap the first and last elements k times"
    ],
    "correctAnswer": 0,
    "explanation": "Reversing the full array puts the last k elements at the front (reversed). Reversing the first k restores their relative order, and reversing the rest restores theirs.",
    "misconceptionTip": "A cyclic shift by 1 repeated k times takes O(n * k) which is quadratic when k ~ n; three reversals take strictly O(n) time."
  },
  {
    "id": "arr_7",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "hard",
    "questionText": "In the \"Trapping Rain Water\" problem on an array of heights, what is the optimal auxiliary space complexity achievable while maintaining O(n) time?",
    "options": [
      "O(n) using prefix/suffix max arrays",
      "O(1) using two pointers meeting inward",
      "O(log n) using divide-and-conquer recursion",
      "O(n²) using matrix flood fill"
    ],
    "correctAnswer": 1,
    "explanation": "By maintaining left_max and right_max with two pointers converging inward, water trapped is determined by the shorter boundary without allocating prefix/suffix arrays: O(1) space.",
    "misconceptionTip": "While prefix/suffix DP arrays take O(n) memory, the converging two-pointer technique compresses this to strictly O(1) auxiliary space."
  },
  {
    "id": "arr_8",
    "topicSlug": "arrays",
    "topicName": "Arrays",
    "difficulty": "hard",
    "questionText": "In the \"Next Permutation\" algorithm, after finding the rightmost index i where nums[i] < nums[i+1], what are the next two operations?",
    "options": [
      "Swap nums[i] with the smallest element greater than nums[i] to its right, then reverse the suffix starting at i+1",
      "Sort the entire array in descending order",
      "Reverse the entire array immediately",
      "Swap nums[i] with nums[0]"
    ],
    "correctAnswer": 0,
    "explanation": "To get the next lexicographical permutation, swap nums[i] with its next larger successor to its right, and reverse the descending suffix into ascending order in O(n) total time.",
    "misconceptionTip": "Sorting the suffix would take O(n log n); since the suffix is guaranteed to be in descending order, reversing it in-place takes linear O(n) time."
  },
  {
    "id": "str_1",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "easy",
    "questionText": "To verify whether a string of length n is a palindrome, what is the most efficient space-optimal strategy?",
    "options": [
      "Reverse the entire string into a new buffer taking O(n) space",
      "Two pointers from start and end moving inward with O(1) auxiliary space",
      "Convert to a tree and traverse in-order",
      "Generate all permutations O(n!)"
    ],
    "correctAnswer": 1,
    "explanation": "Using two pointers starting at index 0 and index n-1, comparing characters and moving inwards requires O(n) time and O(1) auxiliary space.",
    "misconceptionTip": "Reversing creating a new string takes O(n) memory allocation, whereas two pointers requires zero extra allocation."
  },
  {
    "id": "str_2",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "easy",
    "questionText": "To check if two lowercase strings s and t are anagrams in O(n) time and O(1) space, what data structure is most optimal?",
    "options": [
      "A fixed-size integer array of length 26 to count character frequencies",
      "Sorting both strings in O(n log n) time and O(n) space",
      "A binary search tree storing characters",
      "Converting both strings to linked lists"
    ],
    "correctAnswer": 0,
    "explanation": "A fixed-size array of 26 integers tracks character counts in O(n) time and strictly O(1) auxiliary memory since alphabet size is bounded.",
    "misconceptionTip": "Sorting both strings takes O(n log n) time and often creates copies; a fixed frequency array runs in single-pass linear O(n)."
  },
  {
    "id": "str_3",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "easy",
    "questionText": "In languages with immutable strings (like Python or Java), repeatedly concatenating characters in a loop s += char for n iterations has what total time complexity?",
    "options": [
      "O(n²) because each concatenation creates and copies a brand-new string of increasing length",
      "O(n) because strings are dynamically resized arrays",
      "O(1) because pointers update in-place",
      "O(log n)"
    ],
    "correctAnswer": 0,
    "explanation": "Because immutable strings cannot be modified in-place, copying 1 + 2 + 3 + ... + n characters across n iterations yields a quadratic sum: O(n²). Use StringBuilder or list.join instead.",
    "misconceptionTip": "Always use list appends + join() in Python or StringBuilder in Java to maintain O(n) linear performance when building strings."
  },
  {
    "id": "str_4",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "medium",
    "questionText": "Which algorithm finds the longest substring without repeating characters in O(n) time?",
    "options": [
      "Sliding window with a frequency map / set tracking the last seen index",
      "Nested loops comparing each substring in O(n³)",
      "Binary exponentiation",
      "Dijkstra shortest path"
    ],
    "correctAnswer": 0,
    "explanation": "A sliding window with left and right pointers dynamically expands right and contracts left whenever a duplicate character is encountered, visiting each character at most twice O(n).",
    "misconceptionTip": "Generating all substrings takes O(n²), checking each for duplicates takes O(n), totaling O(n³); sliding window reduces this to O(n)."
  },
  {
    "id": "str_5",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "medium",
    "questionText": "In the \"Group Anagrams\" problem, what canonical key representation allows grouping all anagram words into the same hash map bucket?",
    "options": [
      "The alphabetically sorted character string or a 26-element character frequency tuple",
      "The sum of ASCII integer values alone (which suffers from severe collisions)",
      "The memory address of each string",
      "The length of the string alone"
    ],
    "correctAnswer": 0,
    "explanation": "All anagrams have identical sorted character sequences and identical frequency tuples. Using the sorted word or character count tuple as the hash map key groups them in O(n * k log k).",
    "misconceptionTip": "ASCII sum is not unique (e.g. \"ac\" and \"bb\" have the exact same ASCII sum but are not anagrams!)."
  },
  {
    "id": "str_6",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "medium",
    "questionText": "To find the Longest Palindromic Substring in O(1) auxiliary space, how does the \"Expand Around Center\" technique work?",
    "options": [
      "Test expanding outward from each of the 2n - 1 potential centers (both single characters and spaces between characters)",
      "Reverse the string and compute LCS taking O(n²) space",
      "Check all O(n³) possible substrings",
      "Use a hash set to store all suffixes"
    ],
    "correctAnswer": 0,
    "explanation": "A palindrome can be centered on a character (odd length, n centers) or between characters (even length, n-1 centers). Expanding outward from each of the 2n-1 centers takes O(n²) time and O(1) space.",
    "misconceptionTip": "LCS between string and reversed string requires O(n²) space and fails on cases like \"abcdasdfghjkldcba\"; expand around center uses O(1) space."
  },
  {
    "id": "str_7",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "hard",
    "questionText": "In the KMP (Knuth-Morris-Pratt) string matching algorithm, what is the role of the Pi / LPS (Longest Proper Prefix which is also Suffix) table?",
    "options": [
      "Determines how far the pattern pointer can skip upon a mismatch without ever backtracking the text pointer",
      "Sorts pattern characters in descending frequency",
      "Compresses the text string with Huffman encoding",
      "Generates random hashes for rolling hash checks"
    ],
    "correctAnswer": 0,
    "explanation": "The LPS table allows KMP to shift the pattern forward based on previous matches without ever backtracking the text pointer, achieving strict O(n + m) time.",
    "misconceptionTip": "Naive pattern matching backtracks text pointer j backwards upon mismatch; KMP keeps text pointer monotonic."
  },
  {
    "id": "str_8",
    "topicSlug": "strings",
    "topicName": "Strings",
    "difficulty": "hard",
    "questionText": "In the \"Minimum Window Substring\" problem (finding smallest substring containing all characters of pattern t), which approach achieves linear O(n) time?",
    "options": [
      "A sliding window with two pointers: expand right until all chars are satisfied, then contract left to minimize window while tracking matched counts",
      "Checking every possible substring with nested loops in O(n³)",
      "Dynamic programming table of size n × m",
      "Binary search over all substring lengths"
    ],
    "correctAnswer": 0,
    "explanation": "Using two pointers and a frequency map, the right pointer expands until all required characters are covered, then the left pointer shrinks the window while keeping it valid in O(n) time.",
    "misconceptionTip": "Checking all substrings takes O(n³); the sliding window moves each pointer at most n times, giving strict O(n) time."
  },
  {
    "id": "rec_1",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "easy",
    "questionText": "What is the absolute prerequisite condition that every recursive function must have to prevent a Stack Overflow error?",
    "options": [
      "At least two recursive branch calls",
      "A base case that terminates recursion without further calls",
      "A global static variable counter",
      "Tail call optimization compiler flag"
    ],
    "correctAnswer": 1,
    "explanation": "A base case defines the termination condition where the function returns a concrete answer directly, halting infinite call stack expansion.",
    "misconceptionTip": "Without a reachable base case, recursive stack frames continuously consume memory until Call Stack limit is exceeded."
  },
  {
    "id": "rec_2",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "easy",
    "questionText": "What distinguishes a \"Tail Recursive\" function from standard head or body recursion?",
    "options": [
      "The recursive call is the absolute final statement executed before returning, with no pending operations left to compute",
      "It has at least three base cases",
      "It uses global static variables instead of parameters",
      "It executes on the heap instead of the call stack"
    ],
    "correctAnswer": 0,
    "explanation": "In tail recursion, the return value of the recursive call is returned immediately without further arithmetic. This allows compilers to reuse the existing stack frame (O(1) stack space).",
    "misconceptionTip": "Writing `return 1 + f(n-1)` is NOT tail recursive because addition must wait for f(n-1) to resolve; passing an accumulator `f(n-1, acc + 1)` is tail recursive."
  },
  {
    "id": "rec_3",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "easy",
    "questionText": "When writing a recursive function to reverse an array or string in-place with pointers left and right, what is the termination base case?",
    "options": [
      "left >= right (the two pointers have met or crossed in the middle)",
      "left == 0",
      "right == array.length",
      "array[left] == array[right]"
    ],
    "correctAnswer": 0,
    "explanation": "Once left >= right, all elements have already been swapped and the midpoint is reached, so the function must return immediately without further swapping.",
    "misconceptionTip": "Checking `left == right` misses even-length arrays where left crosses right (left > right), causing infinite recursion."
  },
  {
    "id": "rec_4",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "medium",
    "questionText": "Consider the classic un-memoized Fibonacci recursion: T(n) = T(n-1) + T(n-2) + O(1). What is its time complexity and maximum recursion call stack depth?",
    "options": [
      "Time: O(2ⁿ), Stack Depth: O(n)",
      "Time: O(n²), Stack Depth: O(log n)",
      "Time: O(n), Stack Depth: O(1)",
      "Time: O(n log n), Stack Depth: O(n)"
    ],
    "correctAnswer": 0,
    "explanation": "The recursion tree has branching factor ~2 yielding ~2ⁿ nodes (exponential time), but the maximum depth of the call stack at any moment is linear O(n).",
    "misconceptionTip": "Students often confuse the total number of function calls (exponential 2ⁿ) with the maximum stack memory depth simultaneously in use (O(n))."
  },
  {
    "id": "rec_5",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "medium",
    "questionText": "For the classic Tower of Hanoi problem with n disks and 3 pegs, what is the exact minimum number of disk moves required to transfer all disks?",
    "options": [
      "2ⁿ - 1 moves",
      "n² moves",
      "n! moves",
      "2n moves"
    ],
    "correctAnswer": 0,
    "explanation": "The recurrence is T(n) = 2T(n-1) + 1. Moving n-1 disks to auxiliary peg, moving disk n to target, and moving n-1 disks onto target yields exactly 2ⁿ - 1 moves.",
    "misconceptionTip": "The recurrence doubles at each step plus one move, solving mathematically to 2ⁿ - 1, which grows exponentially."
  },
  {
    "id": "rec_6",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "medium",
    "questionText": "In the divide-and-conquer Merge Sort recurrence T(n) = 2T(n/2) + O(n), what is the maximum depth of the recursive call stack?",
    "options": [
      "O(log n) because the array length is halved at each recursive split level",
      "O(n) because all elements are copied",
      "O(n log n)",
      "O(1)"
    ],
    "correctAnswer": 0,
    "explanation": "At each recursive level, n is halved until reaching n=1. A quantity halved continuously reaches 1 in log₂(n) steps, so maximum call stack height is O(log n).",
    "misconceptionTip": "Total work across all levels is O(n log n), but maximum active stack frames at any single time is only O(log n)."
  },
  {
    "id": "rec_7",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "hard",
    "questionText": "In recursive backtracking (e.g., N-Queens or Sudoku Solver), what is the key state management action performed immediately after a recursive call returns?",
    "options": [
      "Memory deallocation via garbage collector",
      "Undo / revert the tentative move (backtrack) to restore state for other sibling branches",
      "Increment base case counter by 1",
      "Terminate the entire program"
    ],
    "correctAnswer": 1,
    "explanation": "Backtracking explores state-space trees by making a choice, recursing, and then explicitly reverting (undoing) that choice so the next candidate sibling can be tested.",
    "misconceptionTip": "If state is mutated in-place without undoing after returning, subsequent sibling branches operate on corrupted search states."
  },
  {
    "id": "rec_8",
    "topicSlug": "recursion",
    "topicName": "Recursion",
    "difficulty": "hard",
    "questionText": "When generating all subsets (the Power Set) of an array of size n recursively, how does the 0/1 decision tree branch?",
    "options": [
      "At each element index i, branch into two recursive calls: one including nums[i] in the current subset, and one excluding nums[i], yielding 2ⁿ subsets",
      "Loop n times recursively without branching",
      "Sort the array and take all prefixes",
      "Use binary search to find subsets"
    ],
    "correctAnswer": 0,
    "explanation": "Every element in a set has two binary possibilities: either it is included in a subset or excluded. Branching on these two choices at each index yields all 2ⁿ subsets.",
    "misconceptionTip": "A subset is not a permutation: order does not matter, and each element is considered exactly once as either present or absent."
  },
  {
    "id": "bs_1",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "easy",
    "questionText": "What essential property must a collection have for standard Binary Search to be directly applicable?",
    "options": [
      "Elements must be sorted in monotonic order",
      "Elements must all be distinct positive integers",
      "Must be implemented as a Linked List",
      "Elements must be powers of 2"
    ],
    "correctAnswer": 0,
    "explanation": "Binary Search relies on monotonicity (sorted order) so that comparing the target with the middle element eliminates half of the search space with certainty.",
    "misconceptionTip": "Binary search does not require elements to be distinct; duplicates can be handled with lower_bound/upper_bound variations."
  },
  {
    "id": "bs_2",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "easy",
    "questionText": "In a sorted array of size n, what index does the lower_bound(target) algorithm return if the target is not in the array?",
    "options": [
      "The index of the first element strictly greater than target (the insertion point that maintains sorted order)",
      "Always returns -1",
      "Always returns index 0",
      "The index of the last element"
    ],
    "correctAnswer": 0,
    "explanation": "Lower bound returns the iterator/index pointing to the first element that does not satisfy element < target (i.e. element >= target), representing the correct insertion point.",
    "misconceptionTip": "Standard exact binary search returns -1 on not found; lower_bound returns the insertion index where target would belong."
  },
  {
    "id": "bs_3",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "medium",
    "questionText": "Why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2` in typed languages like C++/Java/Go?",
    "options": [
      "It executes in fewer CPU clock cycles",
      "It prevents integer overflow when low + high exceeds maximum 32-bit signed integer",
      "It handles negative array indices automatically",
      "It rounds up instead of down"
    ],
    "correctAnswer": 1,
    "explanation": "In 32-bit signed integers, low + high can exceed 2³¹ - 1 (~2.14 billion), overflowing into a negative number and causing an out-of-bounds error. `low + (high - low)/2` guarantees no overflow.",
    "misconceptionTip": "While Python handles arbitrary precision integers automatically, languages like C++, Java, and Go will overflow with `(low + high) / 2`."
  },
  {
    "id": "bs_4",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "medium",
    "questionText": "In a \"Rotated Sorted Array\" (e.g. [4, 5, 6, 7, 0, 1, 2]), how does modified binary search decide which half to discard?",
    "options": [
      "Compare nums[low] with nums[mid]: one half is always guaranteed to be normally sorted; check if target lies within that sorted range",
      "Always discard the left half",
      "Use a linear scan first to find the pivot in O(n)",
      "Binary search cannot be applied to rotated arrays"
    ],
    "correctAnswer": 0,
    "explanation": "In any rotated sorted array, splitting at mid always leaves at least one half strictly sorted. If nums[low] <= nums[mid], the left half is sorted, otherwise the right is.",
    "misconceptionTip": "You do not need to find the rotation pivot beforehand; you can decide directly in O(log n) at each step."
  },
  {
    "id": "bs_5",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "medium",
    "questionText": "In the \"Find Peak Element\" problem (where nums[i] != nums[i+1]), why can binary search find a local peak in O(log n) even in an unsorted array?",
    "options": [
      "If nums[mid] < nums[mid+1], an upward slope exists, mathematically guaranteeing at least one peak lies to the right",
      "Because peak elements only occur at prime indices",
      "Because the array is secretly sorted",
      "It requires O(n) linear scan"
    ],
    "correctAnswer": 0,
    "explanation": "If nums[mid] < nums[mid+1], stepping right moves uphill. Since boundaries are -infinity, following the uphill direction is guaranteed to find a local peak in O(log n).",
    "misconceptionTip": "Binary search does not strictly require full sorting; it only requires a directional decision rule that halves the candidate search space."
  },
  {
    "id": "bs_6",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "hard",
    "questionText": "When applying \"Binary Search on Answer\" (e.g., Koko Eating Bananas, Capacity to Ship Packages), what must be true about the validation check function isValid(speed)?",
    "options": [
      "The function must execute in O(1) time strictly",
      "The function must be monotonic (e.g. F F F T T T), dividing the search space into invalid and valid regimes",
      "The function must return an array of indices",
      "The function must use recursion"
    ],
    "correctAnswer": 1,
    "explanation": "Binary Search on Answer requires monotonicity of the predicate: if speed x works, all speeds > x also work (or vice versa), enabling logarithmic halving of possible answers.",
    "misconceptionTip": "Students often try to formulate dynamic programming when the answer space is monotonic, missing a much faster O(n log(max_val)) binary search."
  },
  {
    "id": "bs_7",
    "topicSlug": "binary-search",
    "topicName": "Binary Search",
    "difficulty": "hard",
    "questionText": "In the \"Median of Two Sorted Arrays\" problem, what is the optimal binary search approach that achieves O(log(min(m, n))) time?",
    "options": [
      "Binary search for the partition index in the smaller array such that max(left1, left2) <= min(right1, right2) across both arrays",
      "Merge both arrays completely taking O(m + n) time and space",
      "Run binary search on the range of all values from -infinity to +infinity",
      "Sort the combined arrays with QuickSort in O((m+n) log(m+n))"
    ],
    "correctAnswer": 0,
    "explanation": "By partitioning the smaller array at index i and automatically placing the remaining half elements from the second array at j, we binary search only on the smaller array in O(log(min(m, n))).",
    "misconceptionTip": "Merging the two arrays takes O(m + n) time and O(m + n) space; partitioning with binary search requires strictly O(log(min(m, n))) time and O(1) space."
  },
  {
    "id": "sort_1",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "easy",
    "questionText": "What is the theoretical lower bound time complexity for any comparison-based sorting algorithm in the worst case?",
    "options": [
      "Ω(n)",
      "Ω(n log n)",
      "Ω(n²)",
      "Ω(log n)"
    ],
    "correctAnswer": 1,
    "explanation": "Any comparison sort can be modeled as a decision tree with n! leaves. The height of such a binary decision tree is at least log₂(n!) = Ω(n log n).",
    "misconceptionTip": "Non-comparison sorts like Counting Sort can beat this bound by using integer indexing, but comparison sorts cannot."
  },
  {
    "id": "sort_2",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "easy",
    "questionText": "How can Bubble Sort be optimized to achieve O(n) best-case time complexity when the input array is already sorted?",
    "options": [
      "Track whether any swaps occurred during a pass with a boolean flag; if zero swaps occurred, terminate immediately",
      "Use two pointers meeting in the middle",
      "Switch to MergeSort automatically",
      "Increase the increment step size to 2"
    ],
    "correctAnswer": 0,
    "explanation": "If a full pass over the array executes with 0 swaps, the array is already sorted. Checking this flag allows Bubble Sort to finish in 1 pass O(n) instead of O(n²).",
    "misconceptionTip": "Standard un-optimized Bubble Sort runs nested loops for exactly n(n-1)/2 comparisons regardless of whether the array was already sorted."
  },
  {
    "id": "sort_3",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "medium",
    "questionText": "What is the worst-case time complexity of QuickSort, and under what condition does it occur when using a naive last-element pivot?",
    "options": [
      "O(n²) when the input array is already sorted or reverse-sorted",
      "O(n log n) always under all inputs",
      "O(n) when elements are distinct",
      "O(n³) when elements are negative"
    ],
    "correctAnswer": 0,
    "explanation": "When already sorted and choosing the last element as pivot, the partition splits into n-1 elements and 0 elements. The recursion tree degenerates into depth n: n + (n-1) + ... + 1 = O(n²).",
    "misconceptionTip": "Randomized pivot selection or Median-of-Three pivot avoids this worst-case, restoring expected O(n log n) performance."
  },
  {
    "id": "sort_4",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "medium",
    "questionText": "Under what specific condition does Counting Sort achieve linear O(n + k) time complexity?",
    "options": [
      "When the range of input integer values k is not significantly larger than the number of elements n",
      "When all elements are arbitrary floating-point numbers",
      "When the array is already sorted in reverse order",
      "When comparing elements with a custom comparator function"
    ],
    "correctAnswer": 0,
    "explanation": "Counting sort uses element values directly as array indices. When range k = O(n), time complexity is strictly linear O(n + k) = O(n). If k is massive (e.g. 10⁹), memory and time explode.",
    "misconceptionTip": "Counting sort is non-comparison and only applies to discrete integers within a bounded range; it cannot sort arbitrary non-integer objects."
  },
  {
    "id": "sort_5",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "medium",
    "questionText": "Why does standard array Merge Sort require O(n) auxiliary memory space, whereas HeapSort requires only O(1)?",
    "options": [
      "Merging two sorted contiguous sub-arrays in an array requires a temporary buffer to avoid overwriting elements before they are placed",
      "Recursion stack frames consume O(n) space in MergeSort",
      "HeapSort allocates memory on the GPU",
      "MergeSort duplicates all variables globally"
    ],
    "correctAnswer": 0,
    "explanation": "In an array, you cannot merge two adjacent sorted halves in-place in linear time without shifting elements O(n²). A temporary O(n) buffer is required to achieve O(n log n) time.",
    "misconceptionTip": "Linked lists CAN be merged in O(1) space by pointer rewiring, but contiguous arrays require O(n) auxiliary space for MergeSort."
  },
  {
    "id": "sort_6",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "hard",
    "questionText": "Which property defines a \"Stable\" sorting algorithm, and which of the following algorithms is inherently stable?",
    "options": [
      "Preserves the relative order of equal elements; Merge Sort is stable",
      "Requires O(1) auxiliary space; HeapSort is stable",
      "Never exceeds O(n log n) worst-case; QuickSort is stable",
      "Sorts in-place without recursion; Selection Sort is stable"
    ],
    "correctAnswer": 0,
    "explanation": "Stability means that if two elements have equal keys, their relative ordering in the output matches their input ordering. Standard Merge Sort is stable; standard QuickSort and HeapSort are not.",
    "misconceptionTip": "QuickSort and HeapSort perform non-adjacent swaps across long distances, disrupting the original relative order of equal elements."
  },
  {
    "id": "sort_7",
    "topicSlug": "sorting",
    "topicName": "Sorting",
    "difficulty": "hard",
    "questionText": "In QuickSelect (finding the k-th smallest element in an unsorted array), why is the expected time complexity O(n) instead of O(n log n)?",
    "options": [
      "After each partitioning step, QuickSelect only recurses into the single half containing index k, yielding a geometric series n + n/2 + n/4 + ... = 2n = O(n)",
      "Because it sorts both halves in parallel using multithreading",
      "Because it uses a Hash Map to store frequencies",
      "Because it transforms the array into a binary search tree"
    ],
    "correctAnswer": 0,
    "explanation": "QuickSort recurses into BOTH halves: T(n) = 2T(n/2) + O(n) = O(n log n). QuickSelect only recurses into ONE half: T(n) = T(n/2) + O(n), which sums to 2n = O(n) expected time.",
    "misconceptionTip": "You do not need to sort the entire array to find the k-th element; QuickSelect discards the irrelevant partition half at each step."
  },
  {
    "id": "ll_1",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "easy",
    "questionText": "To reverse a singly linked list iteratively in a single pass, how many pointer variables are typically required?",
    "options": [
      "1 pointer",
      "3 pointers: prev, curr, next",
      "n pointers for each node",
      "None, linked lists reverse automatically"
    ],
    "correctAnswer": 1,
    "explanation": "Reversing requires keeping track of prev (to point curr.next to), curr (node currently being updated), and next (to not lose the remainder of the list).",
    "misconceptionTip": "If you overwrite `curr.next = prev` before caching `curr.next` in a temporary variable, you sever the link to the rest of the list."
  },
  {
    "id": "ll_2",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "easy",
    "questionText": "To find the middle node of a singly linked list in a single pass with O(1) space, how should two pointers move?",
    "options": [
      "Slow pointer moves 1 step while Fast pointer moves 2 steps per iteration",
      "Both pointers move 1 step starting from opposite ends",
      "Fast pointer moves 3 steps while Slow pointer stays stationary",
      "One pointer counts nodes while the other is stationary"
    ],
    "correctAnswer": 0,
    "explanation": "Since the fast pointer travels at twice the speed of the slow pointer, when the fast pointer reaches the end of the list, the slow pointer is exactly at the midpoint.",
    "misconceptionTip": "You do not need a preliminary pass to count total length n and a second pass to reach n/2; fast/slow pointers do it in one pass."
  },
  {
    "id": "ll_3",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "easy",
    "questionText": "Why is initializing a \"Dummy Head\" node (e.g. dummy = new ListNode(0, head)) useful when modifying or merging linked lists?",
    "options": [
      "It eliminates special edge-case checks for updating the head pointer when the first node is removed or inserted",
      "It doubles the traversal speed",
      "It converts a singly linked list into a doubly linked list",
      "It prevents memory leaks in garbage-collected languages"
    ],
    "correctAnswer": 0,
    "explanation": "A dummy node provides a stable, non-null predecessor before the true head. Operations like deleting the head or inserting at index 0 use the exact same code as internal nodes.",
    "misconceptionTip": "Without a dummy node, you must write separate `if (head == null)` and `if (curr == head)` checks throughout your code."
  },
  {
    "id": "ll_4",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "medium",
    "questionText": "In Floyd's Cycle Detection Algorithm (Tortoise and Hare), why are slow (1 step) and fast (2 steps) pointers guaranteed to meet if a cycle exists?",
    "options": [
      "The relative distance between them decreases by exactly 1 node per iteration inside the cycle",
      "They move in opposite directions",
      "The fast pointer reverses upon hitting the cycle",
      "The cycle size must be an even number"
    ],
    "correctAnswer": 0,
    "explanation": "With fast moving 2 steps and slow moving 1 step, fast gains on slow by (2 - 1) = 1 node per step. In a cycle of length C, the gap shrinks monotonically until it reaches 0.",
    "misconceptionTip": "If fast moved 3 steps, the gap would change by 2, which could theoretically hop over the slow pointer; step size difference of 1 guarantees collision."
  },
  {
    "id": "ll_5",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "medium",
    "questionText": "When merging two sorted linked lists of lengths n and m, what are the optimal time and auxiliary space complexities?",
    "options": [
      "Time: O(n + m), Auxiliary Space: O(1) by rewiring existing node pointers",
      "Time: O(n * m), Space: O(n + m)",
      "Time: O((n + m) log(n + m)), Space: O(1)",
      "Time: O(n), Space: O(m)"
    ],
    "correctAnswer": 0,
    "explanation": "By iteratively comparing the heads of both lists and rewiring the `next` pointer of the merged tail, merging takes O(n + m) time and O(1) space without allocating new nodes.",
    "misconceptionTip": "Allocating new nodes for every element consumes unnecessary O(n + m) heap memory; in-place pointer rewiring uses O(1) auxiliary space."
  },
  {
    "id": "ll_6",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "hard",
    "questionText": "In designing an LRU (Least Recently Used) Cache with O(1) get() and O(1) put(), what combination of data structures is required?",
    "options": [
      "A Hash Map coupled with a Doubly Linked List",
      "A singly linked list with binary search",
      "A binary search tree and an array",
      "A priority queue with timestamps"
    ],
    "correctAnswer": 0,
    "explanation": "The Hash Map provides O(1) key-to-node lookup. The Doubly Linked List allows O(1) removal of an arbitrary node and O(1) insertion at the head (most recently used).",
    "misconceptionTip": "A singly linked list requires an O(n) search to find the predecessor when deleting a node; a doubly linked list provides node.prev for instant O(1) removal."
  },
  {
    "id": "ll_7",
    "topicSlug": "linked-lists",
    "topicName": "Linked Lists",
    "difficulty": "hard",
    "questionText": "In \"Reverse Nodes in k-Group\", what must be verified before reversing each k-length sublist?",
    "options": [
      "Count at least k nodes ahead; if fewer than k nodes remain, leave the tail segment unchanged",
      "Check if k is an even number",
      "Allocate a new array of size k on every iteration",
      "Verify that node values are in ascending numerical order"
    ],
    "correctAnswer": 0,
    "explanation": "The problem requires reversing nodes in groups of k. If the final remaining segment has fewer than k nodes, it must remain in its original order.",
    "misconceptionTip": "Always check if `curr` can advance k steps before reversing; otherwise, you may reverse an incomplete tail group."
  },
  {
    "id": "sq_1",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "easy",
    "questionText": "Which abstract data type follows the Last-In, First-Out (LIFO) protocol?",
    "options": [
      "Queue",
      "Stack",
      "Priority Queue",
      "Circular Buffer"
    ],
    "correctAnswer": 1,
    "explanation": "A Stack is inherently LIFO: the most recently inserted item is the first one removed.",
    "misconceptionTip": "Queues are FIFO (First-In, First-Out); Stacks are LIFO (Last-In, First-Out)."
  },
  {
    "id": "sq_2",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "easy",
    "questionText": "When implementing a FIFO Queue using two LIFO Stacks (inStack and outStack), what is the amortized time complexity of dequeue()?",
    "options": [
      "Amortized O(1) because each element is pushed to inStack and popped to outStack at most once throughout its lifecycle",
      "Strictly O(n) for every single call",
      "O(n²)",
      "O(log n)"
    ],
    "correctAnswer": 0,
    "explanation": "When outStack is empty, all elements from inStack are transferred once (reversing their order). Each element is transferred at most once, giving amortized O(1) time.",
    "misconceptionTip": "While an individual dequeue() might take O(n) when transferring, over n operations the total work is 2n, making the amortized cost O(1)."
  },
  {
    "id": "sq_3",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "medium",
    "questionText": "In the \"Valid Parentheses\" problem, when encountering a closing bracket like \")\", \"}\", or \"]\", what operation is performed on the stack?",
    "options": [
      "Pop top element and verify it is the matching opening bracket; if stack is empty or mismatch, return false",
      "Push the closing bracket onto the stack",
      "Clear the entire stack",
      "Reverse the stack"
    ],
    "correctAnswer": 0,
    "explanation": "Opening brackets are pushed onto the stack. A closing bracket must immediately match and close the most recently opened bracket at the top of the stack.",
    "misconceptionTip": "Counting open vs close brackets alone fails on mismatched orders like \"([)]\"; a stack tracks strict nested scope."
  },
  {
    "id": "sq_4",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "medium",
    "questionText": "To design a \"Min Stack\" supporting push, pop, top, and getMin all in strictly O(1) time, how is the minimum tracked?",
    "options": [
      "Maintain a companion stack (or node pair) storing the minimum value observed up to each current stack depth",
      "Scan the entire stack on every getMin() call in O(n)",
      "Sort the stack elements after every push operation",
      "Use a binary heap inside the stack"
    ],
    "correctAnswer": 0,
    "explanation": "By pushing the new minimum alongside each value (or onto a parallel minStack), the minimum element corresponding to the current stack top is accessible in O(1) time.",
    "misconceptionTip": "A single `min_val` variable fails because when the minimum element is popped, you cannot recover the previous minimum without an O(n) scan."
  },
  {
    "id": "sq_5",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "medium",
    "questionText": "In the \"Sliding Window Maximum\" problem of array size n and window size k, what data structure yields linear O(n) total time?",
    "options": [
      "A Monotonic Deque maintaining element indices in strictly decreasing value order",
      "A standard FIFO queue checking all k elements each time taking O(n*k)",
      "A static array rotated k times",
      "A recursive call stack"
    ],
    "correctAnswer": 0,
    "explanation": "A double-ended queue (deque) pops elements from the back that are smaller than the incoming element and removes expired indices from the front, achieving O(n) total time.",
    "misconceptionTip": "Using a max-heap takes O(n log k); a monotonic deque processes each element at most twice (one push, one pop), giving linear O(n)."
  },
  {
    "id": "sq_6",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "hard",
    "questionText": "In the \"Next Greater Element\" problem on an array of length n, what data structure finds the next greater value for all elements in O(n) time?",
    "options": [
      "A Monotonic Decreasing Stack storing indices",
      "Nested for-loops comparing each element with downstream elements",
      "A binary search tree",
      "A min-heap"
    ],
    "correctAnswer": 0,
    "explanation": "A monotonic decreasing stack holds indices. When an element larger than stack.top() arrives, it is the next greater element for stack.top(). Each index is pushed and popped once: O(n).",
    "misconceptionTip": "Nested loops take O(n²); monotonic stack resolves answers in O(1) amortized time per element."
  },
  {
    "id": "sq_7",
    "topicSlug": "stacks-and-queues",
    "topicName": "Stacks and Queues",
    "difficulty": "hard",
    "questionText": "In \"Largest Rectangle in Histogram\", how does a Monotonic Increasing Stack compute the maximum area in linear O(n) time?",
    "options": [
      "When a shorter bar arrives, pop taller bars and compute area using the popped bar height and width bounded by current index and previous stack top",
      "Try every pair of bars with nested loops in O(n²)",
      "Binary search on rectangle heights",
      "Divide and conquer with Master Theorem"
    ],
    "correctAnswer": 0,
    "explanation": "The monotonic increasing stack maintains bars. When a shorter bar appears, it acts as the right boundary for the popped taller bar, while the element below it on the stack acts as the left boundary.",
    "misconceptionTip": "Width is calculated as `i - stack.top() - 1`, not simply the popped index, accounting for elements in between."
  },
  {
    "id": "trees_1",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "easy",
    "questionText": "Why does an In-Order traversal (Left, Root, Right) of a Binary Search Tree (BST) visit nodes in strictly ascending numerical order?",
    "options": [
      "By definition of a BST, all left subtree keys < root key < all right subtree keys; in-order recursively processes left before root before right",
      "In-order traversal sorts nodes using QuickSort",
      "BST nodes are linked as a doubly linked list",
      "Binary trees only allow positive numbers"
    ],
    "correctAnswer": 0,
    "explanation": "The BST invariant guarantees that all values in the left subtree are smaller than the root, and all values in the right subtree are larger. In-Order visits Left -> Root -> Right, yielding sorted order.",
    "misconceptionTip": "Pre-order visits Root first (useful for cloning); Post-order visits Root last (useful for bottom-up deletion); only In-order produces sorted BST values."
  },
  {
    "id": "trees_2",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "easy",
    "questionText": "What is the formal base condition to identify a leaf node in a recursive binary tree traversal?",
    "options": [
      "node.left === null && node.right === null",
      "node.val === 0",
      "node.parent === null",
      "node.left !== null || node.right !== null"
    ],
    "correctAnswer": 0,
    "explanation": "A leaf node is defined as a node having zero children (both its left child and right child references are null).",
    "misconceptionTip": "Checking `node == null` checks for an empty tree or past a leaf; checking `left == null && right == null` identifies the leaf itself."
  },
  {
    "id": "trees_3",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "medium",
    "questionText": "What is the recursive recurrence relation to compute the Maximum Depth (Height) of a binary tree given its root?",
    "options": [
      "height(root) = height(root.left) + height(root.right)",
      "height(root) = 1 + max(height(root.left), height(root.right)) with base case height(null) = 0",
      "height(root) = 2 * height(root.left)",
      "height(root) = height(root.left) * height(root.right)"
    ],
    "correctAnswer": 1,
    "explanation": "The height of any node is 1 (for the current node itself) plus the maximum depth of its left and right subtrees. An empty tree has depth 0.",
    "misconceptionTip": "Adding depths together counts total nodes in skewed trees rather than the length of the longest path from root to leaf."
  },
  {
    "id": "trees_4",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "medium",
    "questionText": "Why does Level-Order Traversal (Breadth-First Search) on a Binary Tree require a FIFO Queue rather than a LIFO Stack?",
    "options": [
      "A Queue ensures all nodes at depth d are processed before any child nodes at depth d+1 are dequeued",
      "A Stack cannot store tree node references",
      "Queues use less memory than Stacks",
      "Trees can only be traversed iteratively with Queues"
    ],
    "correctAnswer": 0,
    "explanation": "FIFO (First-In, First-Out) ordering ensures that nodes are visited in the exact order they are discovered, visiting level 0, then all level 1 nodes, then level 2.",
    "misconceptionTip": "A LIFO stack plunges deeply down one branch before returning (Depth-First Search); BFS requires a FIFO queue."
  },
  {
    "id": "trees_5",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "medium",
    "questionText": "In \"Validate Binary Search Tree\", why is checking node.left.val < node.val < node.right.val locally at each node insufficient?",
    "options": [
      "A node in the left subtree could be smaller than its immediate parent but still violate the global root ancestor bound (e.g. root=10, left=5, left.right=15)",
      "It causes an infinite loop",
      "Binary search trees allow equal values anywhere",
      "BST validation requires O(n²) time"
    ],
    "correctAnswer": 0,
    "explanation": "Every node in a BST must satisfy global minimum and maximum bounds inherited from all ancestors above it. Recursion must pass `(min_val, max_val)` bounds downward.",
    "misconceptionTip": "Local checks only verify immediate parent-child relationships and miss deep violations of upper ancestor bounds."
  },
  {
    "id": "trees_6",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "hard",
    "questionText": "In a general Binary Tree (not a BST), how does the recursive Lowest Common Ancestor (LCA) function identify the LCA of two nodes p and q?",
    "options": [
      "If root matches p or q, return root; recurse left and right: if both left and right return non-null, root is the LCA; otherwise return the non-null child",
      "Compare values: if root.val is between p.val and q.val, return root",
      "LCA cannot be found in general binary trees without parent pointers",
      "Traverse the tree in post-order and return the last node visited"
    ],
    "correctAnswer": 0,
    "explanation": "In a general binary tree, if p and q are found in separate subtrees (left and right both return non-null), the current root is their lowest common convergence point.",
    "misconceptionTip": "Value comparison `p.val < root.val < q.val` ONLY works in a Binary Search Tree (BST), not in a general unsorted binary tree."
  },
  {
    "id": "trees_7",
    "topicSlug": "trees",
    "topicName": "Trees",
    "difficulty": "hard",
    "questionText": "In \"Binary Tree Maximum Path Sum\" (where a path can start and end at any node), what value does the recursive function return to its parent caller?",
    "options": [
      "node.val + max(0, max(leftGain, rightGain)) (a path extended upward to parent can only choose one subtree branch)",
      "node.val + leftGain + rightGain directly to parent",
      "The maximum path sum in the entire tree",
      "Zero if any child has negative value"
    ],
    "correctAnswer": 0,
    "explanation": "A path cannot branch in two directions when extended upward to its parent. The function updates global_max with `node.val + leftGain + rightGain`, but returns `node.val + max(leftGain, rightGain)` to caller.",
    "misconceptionTip": "You cannot return both left and right branches to parent because a path cannot bifurcate; you can only continue along one branch."
  },
  {
    "id": "graphs_1",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "easy",
    "questionText": "For a sparse graph with V vertices and E edges where E << V², which graph representation is most space-efficient?",
    "options": [
      "Adjacency List with O(V + E) space",
      "Adjacency Matrix with O(V²) space",
      "Incidence Matrix with O(V * E) space",
      "Complete edge permutation table"
    ],
    "correctAnswer": 0,
    "explanation": "An Adjacency List stores only the edges that actually exist, consuming O(V + E) space. For sparse graphs, an Adjacency Matrix wastes O(V²) memory on zeros.",
    "misconceptionTip": "Adjacency matrices are only preferred for very dense graphs (E ~ V²) or when instant O(1) edge lookup between any u and v is required."
  },
  {
    "id": "graphs_2",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "easy",
    "questionText": "In a directed graph, what does encountering a node currently in the VISITING (in-progress) state during DFS traversal indicate?",
    "options": [
      "A directed cycle (back-edge) exists in the graph",
      "The graph is an acyclic tree",
      "All vertices have been visited",
      "The graph is bipartite"
    ],
    "correctAnswer": 0,
    "explanation": "Three-color DFS uses UNVISITED (0), VISITING (1), and VISITED (2). If DFS encounters a node currently in state VISITING, it has found a back-edge to an active ancestor, proving a cycle.",
    "misconceptionTip": "A simple boolean visited array is insufficient in directed graphs because reaching an already-completed node from a different branch is not a cycle."
  },
  {
    "id": "graphs_3",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "medium",
    "questionText": "Why does Breadth-First Search (BFS) guarantee finding the shortest path from a source to a target in an unweighted graph, while DFS does not?",
    "options": [
      "BFS explores nodes in concentric layers of increasing edge distance (distance 1, then 2, etc.), so the first time target is reached, distance is minimal",
      "DFS traverses backward along edges",
      "BFS sorts edge weights in ascending order",
      "DFS uses too much call stack memory"
    ],
    "correctAnswer": 0,
    "explanation": "BFS explores by uniform depth layers. The first time the destination node is dequeued, it is guaranteed to have been reached via the minimum number of edge transitions.",
    "misconceptionTip": "DFS plunges as deeply as possible along one branch and may reach target via a long convoluted path before exploring a direct 1-step edge."
  },
  {
    "id": "graphs_4",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "medium",
    "questionText": "In the \"Number of Islands\" problem on a 2D grid of 1s (land) and 0s (water), what algorithm counts islands in O(Rows * Cols) time?",
    "options": [
      "Iterate through grid; when a 1 is found, increment island count and use DFS/BFS flood-fill to sink all connected 1s to 0s",
      "Dijkstra shortest path algorithm from (0,0)",
      "Binary search over grid rows",
      "Bellman-Ford algorithm on grid vertices"
    ],
    "correctAnswer": 0,
    "explanation": "Scanning the grid takes O(R * C). When an unvisited land cell is hit, DFS/BFS traverses all adjacent land cells, marking them as visited (sinking them), visiting each cell at most twice.",
    "misconceptionTip": "Mutating visited land cells directly to \"0\" avoids allocating an extra O(R * C) boolean matrix."
  },
  {
    "id": "graphs_5",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "medium",
    "questionText": "Why does Dijkstra's shortest path algorithm fail on graphs with negative edge weights?",
    "options": [
      "Dijkstra greedily assumes once a vertex distance is finalized, it cannot decrease; a negative edge discovered later could provide a shorter path",
      "Dijkstra requires the graph to be a Directed Acyclic Graph (DAG)",
      "Priority queues cannot store negative numbers",
      "It causes an arithmetic stack overflow error"
    ],
    "correctAnswer": 0,
    "explanation": "Dijkstra's greedy choice property relies on edge weights being non-negative so path distances grow monotonically. Negative edges break this; use Bellman-Ford or SPFA instead.",
    "misconceptionTip": "Adding a constant positive offset to all edges also fails because paths with more edges are penalized more heavily."
  },
  {
    "id": "graphs_6",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "hard",
    "questionText": "What is the required condition for a graph to have a valid Topological Ordering, and what algorithm computes it in O(V + E) time?",
    "options": [
      "The graph must be a Directed Acyclic Graph (DAG); Kahn’s Algorithm (in-degree BFS) or Post-Order DFS computes it",
      "The graph must be fully connected and undirected; Prim’s algorithm",
      "The graph must have no odd cycles; Bipartite matching",
      "The graph must be a complete tournament graph; QuickSort"
    ],
    "correctAnswer": 0,
    "explanation": "Topological sorting orders vertices such that for every directed edge u -> v, u appears before v. Cycles make this impossible. Kahn’s algorithm uses in-degrees in O(V + E).",
    "misconceptionTip": "Undirected graphs and cyclic directed graphs CANNOT have a topological sort."
  },
  {
    "id": "graphs_7",
    "topicSlug": "graphs",
    "topicName": "Graphs",
    "difficulty": "hard",
    "questionText": "What is the nearly constant amortized time complexity per operation in Disjoint Set Union (Union-Find) when using both Path Compression and Union by Rank?",
    "options": [
      "O(α(n)) where α is the extremely slow-growing Inverse Ackermann function (α(n) < 5 for all practical numbers)",
      "Strictly O(1) worst-case",
      "O(log n)",
      "O(n)"
    ],
    "correctAnswer": 0,
    "explanation": "Path compression flattens tree depth during find(), and union by rank keeps trees shallow. Together, any sequence of m operations takes O(m * α(n)) time, which is practically linear.",
    "misconceptionTip": "Without path compression, Union-Find trees can degenerate into linear chains taking O(n) per operation."
  },
  {
    "id": "dp_1",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "easy",
    "questionText": "What two fundamental characteristics must a problem possess for Dynamic Programming to be applicable?",
    "options": [
      "Overlapping Subproblems and Optimal Substructure",
      "Greedy Choice Property and Monotonicity",
      "Divide and Conquer and Randomization",
      "Linear Invariance and Bipartiteness"
    ],
    "correctAnswer": 0,
    "explanation": "Overlapping Subproblems means subproblems recur repeatedly (caching avoids recomputation). Optimal Substructure means optimal solutions to subproblems combine into the global optimal solution.",
    "misconceptionTip": "If subproblems do not overlap (like Merge Sort), divide-and-conquer is used, not dynamic programming."
  },
  {
    "id": "dp_2",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "easy",
    "questionText": "In the \"Climbing Stairs\" problem (ways(n) = ways(n-1) + ways(n-2)), how can space complexity be optimized from O(n) to O(1)?",
    "options": [
      "Maintain only two integer variables tracking the previous two steps instead of allocating a full size-n array",
      "Use recursion without memoization",
      "Convert the stairs into a binary search tree",
      "Sort the step sizes"
    ],
    "correctAnswer": 0,
    "explanation": "Because calculating ways(i) only requires ways(i-1) and ways(i-2), keeping two variables (prev1, prev2) reduces auxiliary space from O(n) to O(1).",
    "misconceptionTip": "Whenever a DP state dp[i] only depends on a fixed window of previous k states, space can be compressed to O(k)."
  },
  {
    "id": "dp_3",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "medium",
    "questionText": "In the classic 0/1 Knapsack Problem with N items and maximum weight capacity W, what is the state transition for dp[i][w] when deciding whether to include item i?",
    "options": [
      "dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i])",
      "dp[i][w] = dp[i-1][w] + value[i]",
      "dp[i][w] = dp[i][w-1] * value[i]",
      "dp[i][w] = max(dp[i][w], dp[i-1][w])"
    ],
    "correctAnswer": 0,
    "explanation": "For item i, we either exclude it (value is dp[i-1][w]) or include it (value is value[i] plus optimal solution for remaining weight w - weight[i] from remaining items).",
    "misconceptionTip": "Greedy ratio (value/weight) works for Fractional Knapsack, but fails on 0/1 Knapsack where items cannot be broken."
  },
  {
    "id": "dp_4",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "medium",
    "questionText": "In the \"Coin Change\" problem (finding minimum coins to make amount A with denominations coins), what is the correct 1D DP transition for dp[i]?",
    "options": [
      "dp[i] = min(dp[i], dp[i - c] + 1) for each coin c where i >= c",
      "dp[i] = dp[i-1] + dp[i-2]",
      "dp[i] = max(dp[i], coins[i])",
      "dp[i] = dp[i] * c"
    ],
    "correctAnswer": 0,
    "explanation": "To reach amount i using coin c, take 1 coin plus the optimal solution to make the remaining amount i - c. Minimize this over all available coin denominations.",
    "misconceptionTip": "Initialize dp array with infinity (or amount + 1) and base case dp[0] = 0, so invalid states propagate correctly."
  },
  {
    "id": "dp_5",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "medium",
    "questionText": "While standard DP for \"Longest Increasing Subsequence\" (LIS) takes O(n²), how can it be optimized to O(n log n)?",
    "options": [
      "Maintain an active tails array and use binary search (bisect_left) to replace or extend the smallest tail values",
      "Sort the array first in O(n log n) and take the prefix",
      "Use two pointers from both ends",
      "Build a 2D grid and run BFS"
    ],
    "correctAnswer": 0,
    "explanation": "Patience sorting maintains `tails[i]`, storing the smallest tail of all increasing subsequences of length i+1. Using binary search to place each element achieves O(n log n) time.",
    "misconceptionTip": "The tails array does not necessarily store the actual LIS subsequence elements, but its length is guaranteed to equal the maximum LIS length."
  },
  {
    "id": "dp_6",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "hard",
    "questionText": "In the \"Longest Common Subsequence\" (LCS) problem of two strings s1 and s2, what is the recurrence when characters match (s1[i-1] == s2[j-1]) vs mismatch?",
    "options": [
      "Match: 1 + dp[i-1][j-1]; Mismatch: max(dp[i-1][j], dp[i][j-1])",
      "Match: dp[i-1][j-1]; Mismatch: 0",
      "Match: 2 * dp[i-1][j]; Mismatch: dp[i][j-1]",
      "Match: dp[i][j] = 1; Mismatch: dp[i][j] = -1"
    ],
    "correctAnswer": 0,
    "explanation": "When characters match, extend the LCS by 1 from the subproblem excluding both characters. When they mismatch, take the maximum from excluding either s1[i-1] or s2[j-1].",
    "misconceptionTip": "Substrings must be contiguous (where mismatch resets to 0); subsequences do NOT need to be contiguous, so mismatch carries forward `max(left, top)`."
  },
  {
    "id": "dp_7",
    "topicSlug": "dynamic-programming",
    "topicName": "Dynamic Programming",
    "difficulty": "hard",
    "questionText": "In \"Edit Distance\" (Levenshtein Distance) between word1 and word2, when characters mismatch (word1[i-1] != word2[j-1]), what does the recurrence evaluate?",
    "options": [
      "1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) representing minimum cost of Delete, Insert, or Replace operations",
      "dp[i-1][j-1] + 2",
      "max(dp[i-1][j], dp[i][j-1])",
      "dp[i][j] = 0"
    ],
    "correctAnswer": 0,
    "explanation": "When characters differ, cost is 1 plus the minimum of: deleting from word1 (dp[i-1][j]), inserting into word1 (dp[i][j-1]), or replacing the character (dp[i-1][j-1]).",
    "misconceptionTip": "Each of the three grid neighbors corresponds to a distinct editing operation: left is insertion, top is deletion, diagonal is substitution."
  }
];
