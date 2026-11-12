import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { generateInterviewerResponse, analyzeCodeSnippet } from '../services/interviewAIService.js';

const router = express.Router();

// FAANG Interview Question Bank with Stage Guidance
export const interviewQuestions = [
  {
    "id": "google_longest_substring",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Strings & Sliding Window",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given a string `s`, find the length of the **longest substring** without duplicate characters.\n\nYour goal is to explain your intuition, discuss edge cases, implement an optimal solution, and analyze its time and space complexity.",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with length 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with length 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with length 3."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "expectedComplexity": {
      "time": "O(n) where n is string length",
      "space": "O(min(m, n)) where m is charset size"
    },
    "starterCode": {
      "python": "def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function lengthOfLongestSubstring(s) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int lengthOfLongestSubstring(string s) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int lengthOfLongestSubstring(String s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate asks about character set (ASCII vs Unicode), empty string behavior, or space handling.",
      "approach": "Candidate compares Brute Force O(n^2) with Optimal Sliding Window + Hash Set O(n).",
      "implementation": "Maintains two pointers (left, right) and expands/contracts window correctly without index out of bounds.",
      "complexity": "Accurately explains O(n) two-pointer scan and O(min(m, n)) auxiliary space."
    }
  },
  {
    "id": "google_trapping_rain_water",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Trapping Rain Water",
    "topic": "Two Pointers & Monotonic Stack",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\nExplore the two-pointer approach vs prefix max arrays and discuss the optimal O(1) space technique.",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "6 units of rain water are trapped."
      },
      {
        "input": "height = [4,2,0,3,2,5]",
        "output": "9",
        "explanation": "9 units of rain water are trapped between bars."
      }
    ],
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n) single pass",
      "space": "O(1) auxiliary space with two pointers"
    },
    "starterCode": {
      "python": "def trap(height: list[int]) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function trap(height) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int trap(vector<int>& height) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int trap(int[] height) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate asks about array sizes < 3 or strictly decreasing/increasing elevations where water trapped is 0.",
      "approach": "Explains water at index i is min(maxLeft, maxRight) - height[i], contrasts O(n) space prefix max with O(1) space two-pointer.",
      "implementation": "Maintains left and right pointers moving inward based on which max boundary is smaller.",
      "complexity": "Identifies linear O(n) time and O(1) constant auxiliary space."
    }
  },
  {
    "id": "google_median_sorted_arrays",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Median of Two Sorted Arrays",
    "topic": "Binary Search & Divide and Conquer",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\nThe overall run time complexity should be **O(log (m+n))**.",
    "examples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2.00000",
        "explanation": "merged array = [1,2,3] and median is 2."
      },
      {
        "input": "nums1 = [1,2], nums2 = [3,4]",
        "output": "2.50000",
        "explanation": "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    "expectedComplexity": {
      "time": "O(log(min(m, n))) binary search on partition",
      "space": "O(1) constant auxiliary space"
    },
    "starterCode": {
      "python": "def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here\n    pass",
      "javascript": "function findMedianSortedArrays(nums1, nums2) {\n    // Write your solution here\n    return 0.0;\n}",
      "cpp": "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Write your solution here\n    return 0.0;\n}",
      "java": "public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Write your solution here\n    return 0.0;\n}"
    },
    "stageRubric": {
      "clarification": "Asks whether one array can be empty, and confirms odd vs even total elements handling.",
      "approach": "Binary search on partition cut of smaller array such that maxLeft <= minRight across both arrays.",
      "implementation": "Handles boundary infinity/-infinity values when partition cut is at index 0 or length.",
      "complexity": "Accurately explains O(log(min(m, n))) runtime and O(1) space."
    }
  },
  {
    "id": "google_word_ladder",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Word Ladder (Shortest Transformation Sequence)",
    "topic": "Breadth-First Search & Graphs",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "A transformation sequence from `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words where each adjacent pair differs by exactly one letter, and every word is in `wordList`.\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the **number of words in the shortest transformation sequence**, or `0` if no such sequence exists.",
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "explanation": "\"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\" is 5 words."
      },
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "output": "0",
        "explanation": "\"cog\" is not in wordList."
      }
    ],
    "constraints": [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "beginWord != endWord"
    ],
    "expectedComplexity": {
      "time": "O(M^2 * N) where M is word length and N is word count",
      "space": "O(M * N) for BFS queue and visited set"
    },
    "starterCode": {
      "python": "def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function ladderLength(beginWord, endWord, wordList) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies if all words have the same length and whether endWord must exist in wordList.",
      "approach": "Justifies BFS over DFS for shortest path in an unweighted graph and explores wildcard patterns vs 26-char mutation.",
      "implementation": "Applies level-by-level BFS, maintains a visited set to avoid cycle loops.",
      "complexity": "Accurately breaks down O(M^2 * N) time and O(M * N) space."
    }
  },
  {
    "id": "google_course_schedule",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Course Schedule (Topological Sort)",
    "topic": "Graphs & Topological Sort",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates you must take course `b` first if you want to take course `a`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true",
        "explanation": "To take course 1 you should take course 0. So it is possible."
      },
      {
        "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        "output": "false",
        "explanation": "There is a cycle between course 0 and 1."
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "All the pairs prerequisites[i] are unique."
    ],
    "expectedComplexity": {
      "time": "O(V + E) where V is courses and E is prerequisites",
      "space": "O(V + E) for adjacency list and in-degree array / recursion stack"
    },
    "starterCode": {
      "python": "def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    # Write your solution here\n    pass",
      "javascript": "function canFinish(numCourses, prerequisites) {\n    // Write your solution here\n    return true;\n}",
      "cpp": "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    // Write your solution here\n    return true;\n}",
      "java": "public boolean canFinish(int numCourses, int[][] prerequisites) {\n    // Write your solution here\n    return true;\n}"
    },
    "stageRubric": {
      "clarification": "Asks whether prerequisite pairs can have self-loops or if the graph can be disconnected.",
      "approach": "Identifies the problem as directed graph cycle detection using Kahn algorithm (BFS with in-degrees) or DFS 3-color states.",
      "implementation": "Constructs adjacency list correctly, handles in-degree queue or visited sets without infinite recursion.",
      "complexity": "Explains O(V + E) time and O(V + E) space."
    }
  },
  {
    "id": "google_max_path_sum",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Binary Tree Maximum Path Sum",
    "topic": "Trees & Depth-First Search",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear at most once in the sequence.\n\nGiven the `root` of a binary tree, return the **maximum path sum** of any non-empty path.",
    "examples": [
      {
        "input": "root = [1,2,3]",
        "output": "6",
        "explanation": "The optimal path is 2 -> 1 -> 3 with path sum 2 + 1 + 3 = 6."
      },
      {
        "input": "root = [-10,9,20,null,null,15,7]",
        "output": "42",
        "explanation": "The optimal path is 15 -> 20 -> 7 with path sum 15 + 20 + 7 = 42."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in range [1, 3 * 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    "expectedComplexity": {
      "time": "O(N) post-order traversal visiting each node once",
      "space": "O(H) recursion stack where H is tree height"
    },
    "starterCode": {
      "python": "# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef maxPathSum(root: object) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function maxPathSum(root) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int maxPathSum(TreeNode* root) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int maxPathSum(TreeNode root) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether node values can be negative (yes) and whether path can consist of a single node.",
      "approach": "Post-order DFS: each node calculates max contribution to its parent `node.val + max(0, max(leftGain, rightGain))` while updating global max with `node.val + leftGain + rightGain`.",
      "implementation": "Handles negative branches by taking `max(0, branchGain)`, maintains global max initialized to negative infinity.",
      "complexity": "Explains O(N) single-pass traversal and O(H) call stack."
    }
  },
  {
    "id": "google_word_break",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Word Break (DP & Trie)",
    "topic": "Dynamic Programming & Trie",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
    "examples": [
      {
        "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
        "output": "true",
        "explanation": "Return true because \"leetcode\" can be segmented as \"leet code\"."
      },
      {
        "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
        "output": "true",
        "explanation": "Segmented as \"apple pen apple\"."
      },
      {
        "input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
        "output": "false",
        "explanation": "Cannot be fully segmented."
      }
    ],
    "constraints": [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of lowercase English letters."
    ],
    "expectedComplexity": {
      "time": "O(N^2) with DP or O(N * L) with Trie where L is max word length",
      "space": "O(N) for DP array and word set"
    },
    "starterCode": {
      "python": "def wordBreak(s: str, wordDict: list[str]) -> bool:\n    # Write your solution here\n    pass",
      "javascript": "function wordBreak(s, wordDict) {\n    // Write your solution here\n    return false;\n}",
      "cpp": "bool wordBreak(string s, vector<string>& wordDict) {\n    // Write your solution here\n    return false;\n}",
      "java": "public boolean wordBreak(String s, List<String> wordDict) {\n    // Write your solution here\n    return false;\n}"
    },
    "stageRubric": {
      "clarification": "Confirms whether words can be reused multiple times and verifies lowercase constraints.",
      "approach": "Formulates boolean DP array where `dp[i]` indicates whether prefix `s[0...i]` can be segmented, iterating through candidate words.",
      "implementation": "Initializes `dp[0] = true`, checks substrings `s[j...i]` in word set without out-of-bounds slicing.",
      "complexity": "Explains O(N^2) or O(N * L) time and O(N) space."
    }
  },
  {
    "id": "google_implement_trie",
    "company": "google",
    "companyName": "Google",
    "companyLogo": "https://www.google.com/favicon.ico",
    "title": "Implement Trie (Prefix Tree)",
    "topic": "Trie Data Structure & Design",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "A **trie** (pronounced as \"try\") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.\n\nImplement the `Trie` class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie, and `false` otherwise.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`.",
    "examples": [
      {
        "input": "[\"Trie\", \"insert\", \"search\", \"search\", \"startsWith\", \"insert\", \"search\"]\n[[], [\"apple\"], [\"apple\"], [\"app\"], [\"app\"], [\"app\"], [\"app\"]]",
        "output": "[null, null, true, false, true, null, true]",
        "explanation": "Standard prefix tree operations."
      }
    ],
    "constraints": [
      "1 <= word.length, prefix.length <= 2000",
      "word and prefix consist only of lowercase English letters.",
      "At most 3 * 10^4 calls will be made in total to insert, search, and startsWith."
    ],
    "expectedComplexity": {
      "time": "O(L) for insert, search, and startsWith where L is word length",
      "space": "O(N * L) where N is number of words"
    },
    "starterCode": {
      "python": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.isEnd = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        return False\n\n    def startsWith(self, prefix: str) -> bool:\n        return False",
      "javascript": "class Trie {\n    constructor() {}\n    insert(word) {}\n    search(word) { return false; }\n    startsWith(prefix) { return false; }\n}",
      "cpp": "class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) { return false; }\n    bool startsWith(string prefix) { return false; }\n};",
      "java": "class Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) { return false; }\n    public boolean startsWith(String prefix) { return false; }\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies character set (26 lowercase English letters) and distinguishes full search vs prefix matching.",
      "approach": "Designs TrieNode with fixed array of size 26 or dictionary map plus boolean `isEnd` flag.",
      "implementation": "Traverses children nodes char by char, creates new nodes when missing, marks `isEnd = true`.",
      "complexity": "Accurately identifies O(L) time per operation and O(Total Chars) space."
    }
  },
  {
    "id": "amazon_lru_cache",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "LRU Cache (Least Recently Used Cache Design)",
    "topic": "Design & Doubly Linked List + Hash Map",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the key if it exists, otherwise return -1.\n- `void put(int key, int value)` Update or insert key-value. When capacity is exceeded, evict the least recently used key.\n\nBoth operations must run in **O(1)** average time complexity.",
    "examples": [
      {
        "input": "[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]",
        "output": "[null, null, null, 1, null, -1]",
        "explanation": "key 2 was evicted when key 3 was inserted."
      }
    ],
    "constraints": [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    "expectedComplexity": {
      "time": "O(1) average for both get and put",
      "space": "O(capacity) auxiliary memory"
    },
    "starterCode": {
      "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        # Write your solution here\n        pass\n\n    def get(self, key: int) -> int:\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        pass",
      "javascript": "class LRUCache {\n    constructor(capacity) {}\n    get(key) { return -1; }\n    put(key, value) {}\n}",
      "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};",
      "java": "class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether get counts as an access operation that updates recency, and what to return on miss (-1).",
      "approach": "Justifies why Hash Map + Doubly Linked List with dummy head/tail achieves O(1) removal and insertion.",
      "implementation": "Correctly implements node splicing (removeNode, addToHead) without losing pointer references.",
      "complexity": "States O(1) for both operations and O(C) space where C is capacity."
    }
  },
  {
    "id": "amazon_container_water",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Container With Most Water",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "The max area is min(8, 7) * (8 - 1) = 49."
      },
      {
        "input": "height = [1,1]",
        "output": "1",
        "explanation": "Area = min(1, 1) * (1 - 0) = 1."
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n) single pass",
      "space": "O(1) auxiliary space"
    },
    "starterCode": {
      "python": "def maxArea(height: list[int]) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function maxArea(height) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int maxArea(vector<int>& height) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int maxArea(int[] height) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies if slant containers are permitted and confirms non-negative integer heights.",
      "approach": "Proves why shrinking the window by moving the pointer with the smaller height is mathematically optimal.",
      "implementation": "Clean while loop `left < right` with maxArea tracking and conditional pointer increment/decrement.",
      "complexity": "Explains linear O(n) single scan with strictly constant O(1) space."
    }
  },
  {
    "id": "amazon_merge_k_lists",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Merge K Sorted Lists",
    "topic": "Heaps & Priority Queue / Divide and Conquer",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it. Discuss the min-heap approach vs divide-and-conquer merge.",
    "examples": [
      {
        "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "explanation": "All lists merged in ascending order."
      },
      {
        "input": "lists = []",
        "output": "[]",
        "explanation": "Empty input returns empty list."
      }
    ],
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(N log k) where N is total nodes and k is number of lists",
      "space": "O(k) for priority queue or O(1) with iterative divide & conquer"
    },
    "starterCode": {
      "python": "# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeKLists(lists: list) -> object:\n    # Write your solution here\n    pass",
      "javascript": "function mergeKLists(lists) {\n    // Write your solution here\n    return null;\n}",
      "cpp": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your solution here\n    return nullptr;\n}",
      "java": "public ListNode mergeKLists(ListNode[] lists) {\n    // Write your solution here\n    return null;\n}"
    },
    "stageRubric": {
      "clarification": "Asks about empty lists or lists with single nodes, and handles k=0 or null input gracefully.",
      "approach": "Compares O(N*k) naive with O(N log k) Min-Heap / Divide-and-Conquer.",
      "implementation": "Correctly manages min-heap with custom comparator or pairs, advances next pointers cleanly.",
      "complexity": "Explains O(N log k) time and O(k) space."
    }
  },
  {
    "id": "amazon_reorder_logs",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Reorder Data in Log Files",
    "topic": "Strings & Custom Sorting",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "You are given an array of `logs`. Each log is a space-delimited string of words, where the first word is the **identifier**.\n\nThere are two types of logs:\n1. **Letter-logs**: All words (after identifier) consist of lowercase English letters.\n2. **Digit-logs**: All words (after identifier) consist of digits.\n\nReorder these logs so that:\n- Letter-logs come before digit-logs.\n- Letter-logs are sorted lexicographically by content; if contents are equal, sort by identifier.\n- Digit-logs maintain their relative original order.",
    "examples": [
      {
        "input": "logs = [\"dig1 8 1 5 1\",\"let1 art can\",\"dig2 3 6\",\"let2 own kit dig\",\"let3 art zero\"]",
        "output": "[\"let1 art can\",\"let3 art zero\",\"let2 own kit dig\",\"dig1 8 1 5 1\",\"dig2 3 6\"]",
        "explanation": "Letter logs sorted lexicographically, digit logs maintain relative order."
      }
    ],
    "constraints": [
      "1 <= logs.length <= 100",
      "3 <= logs[i].length <= 100",
      "All the tokens of logs[i] are separated by a single space."
    ],
    "expectedComplexity": {
      "time": "O(M * N log N) where N is log count and M is max log length",
      "space": "O(M * N) to partition and sort logs"
    },
    "starterCode": {
      "python": "def reorderLogFiles(logs: list[str]) -> list[str]:\n    # Write your solution here\n    pass",
      "javascript": "function reorderLogFiles(logs) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<string> reorderLogFiles(vector<string>& logs) {\n    // Write your solution here\n    return {};\n}",
      "java": "public String[] reorderLogFiles(String[] logs) {\n    // Write your solution here\n    return new String[0];\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies stability requirement for digit-logs and delimiter rules.",
      "approach": "Designs custom sorting key `(0, content, identifier)` for letter-logs and `(1,)` for digit-logs.",
      "implementation": "Splits identifier from payload cleanly using first space index, uses stable sort.",
      "complexity": "Explains O(M * N log N) time and O(M * N) space."
    }
  },
  {
    "id": "amazon_kth_largest",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Kth Largest Element in an Array",
    "topic": "Heaps & Quickselect",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array.\n\nNote that it is the `k-th` largest element in sorted order, not the `k-th` distinct element.\n\nCan you solve it in **O(n)** average time complexity without sorting the entire array?",
    "examples": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5",
        "explanation": "2nd largest element is 5."
      },
      {
        "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        "output": "4",
        "explanation": "4th largest element is 4."
      }
    ],
    "constraints": [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(N) average using Quickselect or O(N log k) using Min-Heap",
      "space": "O(k) for Min-Heap or O(1) for iterative Quickselect"
    },
    "starterCode": {
      "python": "def findKthLargest(nums: list[int], k: int) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function findKthLargest(nums, k) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int findKthLargest(vector<int>& nums, int k) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int findKthLargest(int[] nums, int k) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether duplicates count toward the k-th rank (yes) and input size.",
      "approach": "Compares full sort O(n log n) vs Min-Heap of size k O(n log k) vs Quickselect O(n) average.",
      "implementation": "Implements partition logic or clean heap push/pop maintaining k largest elements.",
      "complexity": "Explains O(N) average for Quickselect and O(k) auxiliary memory."
    }
  },
  {
    "id": "amazon_daily_temperatures",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Daily Temperatures (Monotonic Stack)",
    "topic": "Stacks & Monotonic Stack",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature.\n\nIf there is no future day for which this is possible, keep `answer[i] == 0` instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 waits 1 day for 74; Day 2 waits 4 days for 76."
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "explanation": "Strictly increasing sequence."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n) single pass scan",
      "space": "O(n) monotonic decreasing stack"
    },
    "starterCode": {
      "python": "def dailyTemperatures(temperatures: list[int]) -> list[int]:\n    # Write your solution here\n    pass",
      "javascript": "function dailyTemperatures(temperatures) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<int> dailyTemperatures(vector<int>& temperatures) {\n    // Write your solution here\n    return {};\n}",
      "java": "public int[] dailyTemperatures(int[] temperatures) {\n    // Write your solution here\n    return new int[0];\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies what to output if no warmer day exists (0) and verifies input array length.",
      "approach": "Monotonic decreasing stack storing indices `(idx)`: whenever a warmer temperature is seen, pops smaller previous days and computes `currIdx - prevIdx`.",
      "implementation": "Clean while loop `stack && temp[curr] > temp[stack.top()]`, correctly populating result array.",
      "complexity": "Explains why each index is pushed and popped at most once, guaranteeing linear O(n) time."
    }
  },
  {
    "id": "amazon_word_search",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Word Search in 2D Grid",
    "topic": "Backtracking & Matrix DFS",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    "examples": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
        "output": "true",
        "explanation": "The word ABCCED is found in the grid."
      },
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"",
        "output": "true",
        "explanation": "The word SEE is found in the grid."
      },
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"",
        "output": "false",
        "explanation": "Cannot reuse cell 'B'."
      }
    ],
    "constraints": [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consist of only lowercase and uppercase English letters."
    ],
    "expectedComplexity": {
      "time": "O(M * N * 3^L) where L is word length",
      "space": "O(L) recursion stack depth"
    },
    "starterCode": {
      "python": "def exist(board: list[list[str]], word: str) -> bool:\n    # Write your solution here\n    pass",
      "javascript": "function exist(board, word) {\n    // Write your solution here\n    return false;\n}",
      "cpp": "bool exist(vector<vector<char>>& board, string word) {\n    // Write your solution here\n    return false;\n}",
      "java": "public boolean exist(char[][] board, String word) {\n    // Write your solution here\n    return false;\n}"
    },
    "stageRubric": {
      "clarification": "Confirms whether diagonal traversal is allowed (no, 4-directional only) and if cells can be revisited.",
      "approach": "Backtracking DFS exploring all 4 directions, temporarily marking visited cell with '#' and restoring character on backtrack.",
      "implementation": "Handles boundary checks `0 <= r < m` and `0 <= c < n` with clean base return when `index == word.length`.",
      "complexity": "Accurately analyzes branching factor 3 (excluding parent cell) and O(L) stack depth."
    }
  },
  {
    "id": "amazon_top_k_frequent",
    "company": "amazon",
    "companyName": "Amazon",
    "companyLogo": "https://www.amazon.com/favicon.ico",
    "title": "Top K Frequent Elements",
    "topic": "Hash Map & Bucket Sort / Min-Heap",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in **any order**.\n\nYour algorithm's time complexity must be better than **O(n log n)**, where n is the array's size.",
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]",
        "explanation": "1 has freq 3, 2 has freq 2."
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]",
        "explanation": "Single element."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique."
    ],
    "expectedComplexity": {
      "time": "O(N) linear time using Bucket Sort or O(N log k) using Min-Heap",
      "space": "O(N) for frequency map and buckets"
    },
    "starterCode": {
      "python": "def topKFrequent(nums: list[int], k: int) -> list[int]:\n    # Write your solution here\n    pass",
      "javascript": "function topKFrequent(nums, k) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<int> topKFrequent(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
      "java": "public int[] topKFrequent(int[] nums, int k) {\n    // Write your solution here\n    return new int[0];\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies whether answer is guaranteed unique and asks if O(N) Bucket Sort is preferred.",
      "approach": "Builds frequency map, then uses array of buckets where index represents frequency to gather top k in linear time.",
      "implementation": "Correctly iterates bucket list in reverse order from N down to 1 until k elements are collected.",
      "complexity": "Explains O(N) time and O(N) auxiliary space."
    }
  },
  {
    "id": "meta_subarray_sum_k",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Subarray Sum Equals K",
    "topic": "Prefix Sum & Hash Map",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array. Notice that numbers can be negative, so standard sliding window does not apply!",
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2",
        "explanation": "Subarrays [0,1] and [1,2] both sum to 2."
      },
      {
        "input": "nums = [1,2,3], k = 3",
        "output": "2",
        "explanation": "Subarrays [0,1] and [2,2] sum to 3."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7"
    ],
    "expectedComplexity": {
      "time": "O(n) single pass",
      "space": "O(n) for prefix sum frequency map"
    },
    "starterCode": {
      "python": "def subarraySum(nums: list[int], k: int) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function subarraySum(nums, k) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int subarraySum(vector<int>& nums, int k) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int subarraySum(int[] nums, int k) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate realizes negative numbers invalidate regular two-pointer sliding window.",
      "approach": "Explains cumulative prefix sum logic: `currentSum - k` frequency tracking with base case `{0: 1}`.",
      "implementation": "Correctly updates answer by `prefixMap.get(currentSum - k, 0)` BEFORE adding `currentSum` to map.",
      "complexity": "Explains O(n) linear scan and O(n) space for prefix hash map."
    }
  },
  {
    "id": "meta_valid_palindrome_2",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Valid Palindrome II (At Most One Deletion)",
    "topic": "Strings & Two Pointers",
    "difficulty": "Easy-Medium",
    "timeLimitMinutes": 15,
    "description": "Given a string `s`, return `true` if the `s` can be palindrome after deleting **at most one** character from it.\n\nExplain your two-pointer technique and how you branch when a mismatch is detected.",
    "examples": [
      {
        "input": "s = \"aba\"",
        "output": "true",
        "explanation": "Already a palindrome without deleting."
      },
      {
        "input": "s = \"abca\"",
        "output": "true",
        "explanation": "You could delete character \"c\"."
      },
      {
        "input": "s = \"abc\"",
        "output": "false",
        "explanation": "Deleting 1 character leaves 2 different characters."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters."
    ],
    "expectedComplexity": {
      "time": "O(n) linear scan",
      "space": "O(1) constant auxiliary space"
    },
    "starterCode": {
      "python": "def validPalindrome(s: str) -> bool:\n    # Write your solution here\n    pass",
      "javascript": "function validPalindrome(s) {\n    // Write your solution here\n    return false;\n}",
      "cpp": "bool validPalindrome(string s) {\n    // Write your solution here\n    return false;\n}",
      "java": "public boolean validPalindrome(String s) {\n    // Write your solution here\n    return false;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether deleting 0 characters is allowed (yes, \"at most one\") and handles strings of length <= 2.",
      "approach": "Two-pointer meeting in the middle. On first mismatch at (l, r), check if s[l+1...r] or s[l...r-1] is a palindrome.",
      "implementation": "Writes clean helper function `isPalindromeRange(s, l, r)` without creating new string substrings to save space.",
      "complexity": "States O(n) time and O(1) space."
    }
  },
  {
    "id": "meta_lowest_common_ancestor",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "topic": "Trees & Depth-First Search",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`.\n\nAccording to the definition of LCA on Wikipedia: \"The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).\"",
    "examples": [
      {
        "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        "output": "3",
        "explanation": "The LCA of nodes 5 and 1 is 3."
      },
      {
        "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
        "output": "5",
        "explanation": "The LCA of nodes 5 and 4 is 5, since a node can be descendant of itself."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [2, 10^5].",
      "-10^9 <= Node.val <= 10^9",
      "All Node.val are unique.",
      "p != q",
      "p and q will exist in the tree."
    ],
    "expectedComplexity": {
      "time": "O(n) where n is number of nodes",
      "space": "O(h) where h is tree height for recursion stack"
    },
    "starterCode": {
      "python": "# class TreeNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.left = None\n#         self.right = None\ndef lowestCommonAncestor(root: object, p: object, q: object) -> object:\n    # Write your solution here\n    pass",
      "javascript": "function lowestCommonAncestor(root, p, q) {\n    // Write your solution here\n    return null;\n}",
      "cpp": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    // Write your solution here\n    return nullptr;\n}",
      "java": "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    // Write your solution here\n    return null;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether p and q are guaranteed to be in the tree and whether node values are unique.",
      "approach": "Applies post-order DFS: if root is null, p, or q, return root. Recurse left and right; if both return non-null, root is LCA.",
      "implementation": "Concise 5-line recursive logic correctly handling when one branch returns null.",
      "complexity": "States O(n) time and O(h) space where h is tree height."
    }
  },
  {
    "id": "meta_minimum_window_substring",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Minimum Window Substring",
    "topic": "Strings & Sliding Window with Frequency Map",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
    "examples": [
      {
        "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
        "output": "\"BANC\"",
        "explanation": "The minimum window substring \"BANC\" includes A, B, and C from string t."
      },
      {
        "input": "s = \"a\", t = \"a\"",
        "output": "\"a\"",
        "explanation": "The entire string s is the minimum window."
      },
      {
        "input": "s = \"a\", t = \"aa\"",
        "output": "\"\"",
        "explanation": "Both \"a\"s must be included in the window."
      }
    ],
    "constraints": [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters."
    ],
    "expectedComplexity": {
      "time": "O(m + n) linear scan",
      "space": "O(k) where k is unique characters in t (up to 52)"
    },
    "starterCode": {
      "python": "def minWindow(s: str, t: str) -> str:\n    # Write your solution here\n    pass",
      "javascript": "function minWindow(s, t) {\n    // Write your solution here\n    return \"\";\n}",
      "cpp": "string minWindow(string s, string t) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "public String minWindow(String s, String t) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "stageRubric": {
      "clarification": "Asks about duplicate characters in t and whether casing matters (uppercase vs lowercase).",
      "approach": "Frequency map for t + window map for s. Tracks `have` vs `need` matched character counts to expand right and shrink left in O(1).",
      "implementation": "Maintains best window indices (start, minLen) and shrinks left pointer while window is valid.",
      "complexity": "Explains O(m + n) time and O(k) space."
    }
  },
  {
    "id": "meta_right_side_view",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Binary Tree Right Side View",
    "topic": "Trees & Breadth-First Search (Level Order)",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given the `root` of a binary tree, imagine yourself standing on the **right side** of it, return the values of the nodes you can see ordered from top to bottom.",
    "examples": [
      {
        "input": "root = [1,2,3,null,5,null,4]",
        "output": "[1,3,4]",
        "explanation": "Nodes 1, 3, and 4 are visible from the right side."
      },
      {
        "input": "root = [1,null,3]",
        "output": "[1,3]",
        "explanation": "Right spine only."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n) visiting each node once",
      "space": "O(w) queue memory where w is max tree width"
    },
    "starterCode": {
      "python": "def rightSideView(root: object) -> list[int]:\n    # Write your solution here\n    pass",
      "javascript": "function rightSideView(root) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<int> rightSideView(TreeNode* root) {\n    // Write your solution here\n    return {};\n}",
      "java": "public List<Integer> rightSideView(TreeNode root) {\n    // Write your solution here\n    return new ArrayList<>();\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies if left nodes become visible when right branch terminates early (yes).",
      "approach": "Level-order BFS using a queue: at each level, append the last element in the queue level snapshot to the result.",
      "implementation": "Uses standard `queue.length` snapshot loop per level to capture the rightmost element cleanly.",
      "complexity": "Identifies O(n) time and O(w) auxiliary queue space."
    }
  },
  {
    "id": "meta_clone_graph",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Clone Graph (Deep Copy with Cycles)",
    "topic": "Graphs & Breadth-First Search / Hash Map",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.\n\nEnsure no cloned nodes refer back to original node references.",
    "examples": [
      {
        "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        "output": "[[2,4],[1,3],[2,4],[1,3]]",
        "explanation": "Deep copy of 4-node cycle."
      }
    ],
    "constraints": [
      "The number of nodes in the graph is in range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node."
    ],
    "expectedComplexity": {
      "time": "O(V + E) traversing all vertices and edges",
      "space": "O(V) for visited hash map mapping oldNode -> newNode"
    },
    "starterCode": {
      "python": "# class Node:\n#     def __init__(self, val = 0, neighbors = None):\n#         self.val = val\n#         self.neighbors = neighbors if neighbors is not None else []\ndef cloneGraph(node: object) -> object:\n    # Write your solution here\n    pass",
      "javascript": "function cloneGraph(node) {\n    // Write your solution here\n    return null;\n}",
      "cpp": "Node* cloneGraph(Node* node) {\n    // Write your solution here\n    return nullptr;\n}",
      "java": "public Node cloneGraph(Node node) {\n    // Write your solution here\n    return null;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies empty graph input handling and verifies graph connectivity.",
      "approach": "BFS or DFS using a Hash Map mapping `originalNode -> clonedNode` to avoid infinite loops across cycles.",
      "implementation": "Instantiates cloned node first, registers into map, then clones neighbors recursively or via queue.",
      "complexity": "Accurately analyzes O(V + E) time and O(V) space."
    }
  },
  {
    "id": "meta_remove_nth_from_end",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Remove Nth Node From End of List",
    "topic": "Linked Lists & Two Pointers (One Pass)",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head.\n\nCould you do this in **one pass** with O(1) extra space?",
    "examples": [
      {
        "input": "head = [1,2,3,4,5], n = 2",
        "output": "[1,2,3,5]",
        "explanation": "Node with value 4 removed."
      },
      {
        "input": "head = [1], n = 1",
        "output": "[]",
        "explanation": "Single node removed leaves empty list."
      },
      {
        "input": "head = [1,2], n = 1",
        "output": "[1]",
        "explanation": "Last node removed."
      }
    ],
    "constraints": [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ],
    "expectedComplexity": {
      "time": "O(L) single pass where L is list length",
      "space": "O(1) constant auxiliary space"
    },
    "starterCode": {
      "python": "def removeNthFromEnd(head: object, n: int) -> object:\n    # Write your solution here\n    pass",
      "javascript": "function removeNthFromEnd(head, n) {\n    // Write your solution here\n    return null;\n}",
      "cpp": "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    // Write your solution here\n    return nullptr;\n}",
      "java": "public ListNode removeNthFromEnd(ListNode head, int n) {\n    // Write your solution here\n    return null;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies edge case where n equals total list length (head node removed).",
      "approach": "Two-pointer gap technique with a dummy head node: advance `fast` pointer n steps ahead, then move `slow` and `fast` together.",
      "implementation": "Slices target node `slow.next = slow.next.next` and returns `dummy.next`.",
      "complexity": "Strictly O(L) time in a single traversal and O(1) space."
    }
  },
  {
    "id": "meta_longest_consecutive",
    "company": "meta",
    "companyName": "Meta",
    "companyLogo": "https://www.facebook.com/favicon.ico",
    "title": "Longest Consecutive Sequence",
    "topic": "Hash Set & Intelligent Scanning",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an unsorted array of integers `nums`, return the length of the **longest consecutive elements sequence**.\n\nYou must write an algorithm that runs in **O(n)** time complexity.",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Length = 4."
      },
      {
        "input": "nums = [0,3,7,2,5,8,4,6,0,1]",
        "output": "9",
        "explanation": "Consecutive sequence from 0 through 8."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "expectedComplexity": {
      "time": "O(n) linear scan with hash set",
      "space": "O(n) auxiliary memory for hash set"
    },
    "starterCode": {
      "python": "def longestConsecutive(nums: list[int]) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function longestConsecutive(nums) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int longestConsecutive(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int longestConsecutive(int[] nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Confirms empty array returns 0 and checks if duplicates are present (handled by set).",
      "approach": "Inserts all numbers into a Hash Set. Only starts counting sequence if `num - 1` is NOT in the set (identifying the true start of a streak).",
      "implementation": "While loop advances `currNum + 1` from streak start, updating max streak length.",
      "complexity": "Explains why each number is visited at most twice, achieving strict linear O(n) time."
    }
  },
  {
    "id": "general_binary_search_rotated",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Search in Rotated Sorted Array",
    "topic": "Modified Binary Search",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "There is an integer array `nums` sorted in ascending order (with distinct values) that was possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with **O(log n)** runtime complexity.",
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "explanation": "Target 0 is at index 4."
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1",
        "explanation": "Target 3 does not exist."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
    ],
    "expectedComplexity": {
      "time": "O(log n) logarithmic search",
      "space": "O(1) constant auxiliary space"
    },
    "starterCode": {
      "python": "def search(nums: list[int], target: int) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function search(nums, target) {\n    // Write your solution here\n    return -1;\n}",
      "cpp": "int search(vector<int>& nums, int target) {\n    // Write your solution here\n    return -1;\n}",
      "java": "public int search(int[] nums, int target) {\n    // Write your solution here\n    return -1;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies if elements are strictly unique (yes) and verifies pivot properties.",
      "approach": "Observes that in any rotated sorted array, dividing at mid leaves at least one half strictly sorted.",
      "implementation": "Checks whether left half `nums[low] <= nums[mid]` is sorted, determines if target lies inside, adjusts boundaries.",
      "complexity": "Explains strict O(log n) runtime and O(1) space."
    }
  },
  {
    "id": "general_3sum",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "3Sum (Find All Unique Triplets Summing to Zero)",
    "topic": "Arrays & Two Pointers with Deduplication",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "explanation": "The distinct triplets are [-1,0,1] and [-1,-1,2]."
      },
      {
        "input": "nums = [0,1,1]",
        "output": "[]",
        "explanation": "No triplet sums to 0."
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n^2) time after O(n log n) sorting",
      "space": "O(1) or O(n) depending on sorting implementation"
    },
    "starterCode": {
      "python": "def threeSum(nums: list[int]) -> list[list[int]]:\n    # Write your solution here\n    pass",
      "javascript": "function threeSum(nums) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<vector<int>> threeSum(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "public List<List<Integer>> threeSum(int[] nums) {\n    // Write your solution here\n    return new ArrayList<>();\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies that output triplets must be unique and whether elements can be reused.",
      "approach": "Sorts array, fixes first element, and reduces to Two Sum II with two pointers. Skips duplicates for all three pointers.",
      "implementation": "Correctly implements duplicate skip loops: `while l < r and nums[l] == nums[l+1]: l += 1`.",
      "complexity": "Explains O(n^2) time and O(1) auxiliary space beyond the output."
    }
  },
  {
    "id": "general_product_except_self",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Product of Array Except Self",
    "topic": "Prefix & Suffix Products",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a **32-bit** integer.\n\n**Constraint:** You must write an algorithm that runs in **O(n)** time and without using the division operation!",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": "Product of all except nums[i]."
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "explanation": "Handled zero values cleanly without division by zero."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "expectedComplexity": {
      "time": "O(n) two-pass scan",
      "space": "O(1) auxiliary space (output array does not count)"
    },
    "starterCode": {
      "python": "def productExceptSelf(nums: list[int]) -> list[int]:\n    # Write your solution here\n    pass",
      "javascript": "function productExceptSelf(nums) {\n    // Write your solution here\n    return [];\n}",
      "cpp": "vector<int> productExceptSelf(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "public int[] productExceptSelf(int[] nums) {\n    // Write your solution here\n    return new int[0];\n}"
    },
    "stageRubric": {
      "clarification": "Confirms that division cannot be used and asks how zeros affect product calculation.",
      "approach": "Computes prefix products on left-to-right pass, then multiplies suffix products with a running variable on right-to-left pass.",
      "implementation": "Initializes output array with 1s, performs prefix pass followed by backward suffix pass.",
      "complexity": "Explains O(n) time with O(1) auxiliary space."
    }
  },
  {
    "id": "general_number_of_islands",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Number of Islands",
    "topic": "Matrix BFS & DFS / Flood Fill",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]",
        "output": "1",
        "explanation": "All connected 1s form a single island."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]",
        "output": "3",
        "explanation": "3 distinct islands."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300"
    ],
    "expectedComplexity": {
      "time": "O(m * n) where m is rows and n is columns",
      "space": "O(m * n) worst-case recursion/queue space"
    },
    "starterCode": {
      "python": "def numIslands(grid: list[list[str]]) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function numIslands(grid) {\n    // Write your solution here\n    return 0;\n}",
      "cpp": "int numIslands(vector<vector<char>>& grid) {\n    // Write your solution here\n    return 0;\n}",
      "java": "public int numIslands(char[][] grid) {\n    // Write your solution here\n    return 0;\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether diagonals count as connected (no, 4-directional only) and if in-place grid mutation is allowed.",
      "approach": "Iterates through each cell; on encountering '1', increments count and triggers BFS/DFS flood fill to sink connected land to '0'.",
      "implementation": "Robust boundary checks `0 <= r < m` and `0 <= c < n` with clean 4-directional delta iteration `[(0,1),(0,-1),(1,0),(-1,0)]`.",
      "complexity": "Explains linear O(m * n) time and O(m * n) space."
    }
  },
  {
    "id": "general_valid_parentheses",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Valid Parentheses (Matching Brackets)",
    "topic": "Stacks & Bracket Parsing",
    "difficulty": "Easy-Medium",
    "timeLimitMinutes": 15,
    "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "examples": [
      {
        "input": "s = \"()[]{}\"",
        "output": "true",
        "explanation": "All bracket pairs matched correctly."
      },
      {
        "input": "s = \"(]\"",
        "output": "false",
        "explanation": "Mismatched closing bracket."
      },
      {
        "input": "s = \"([])\"",
        "output": "true",
        "explanation": "Nested brackets matched."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "expectedComplexity": {
      "time": "O(n) single pass",
      "space": "O(n) stack auxiliary space"
    },
    "starterCode": {
      "python": "def isValid(s: str) -> bool:\n    # Write your solution here\n    pass",
      "javascript": "function isValid(s) {\n    // Write your solution here\n    return false;\n}",
      "cpp": "bool isValid(string s) {\n    // Write your solution here\n    return false;\n}",
      "java": "public boolean isValid(String s) {\n    // Write your solution here\n    return false;\n}"
    },
    "stageRubric": {
      "clarification": "Asks whether string can have odd length (instantly false) and confirms only standard bracket types.",
      "approach": "LIFO Stack with mapping `{')': '(', '}': '{', ']': '['}`: pushes open brackets, checks match on closing brackets.",
      "implementation": "Handles popping from empty stack safely, verifies stack is empty at completion.",
      "complexity": "Explains O(n) time and O(n) stack memory."
    }
  },
  {
    "id": "general_reverse_linked_list",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Reverse Linked List (Iterative & Recursive)",
    "topic": "Linked Lists & In-Place Pointers",
    "difficulty": "Easy-Medium",
    "timeLimitMinutes": 15,
    "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\nDemonstrate both the iterative pointer-reversal method with O(1) space and discuss the recursive formulation.",
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "explanation": "List reversed in-place."
      },
      {
        "input": "head = [1,2]",
        "output": "[2,1]",
        "explanation": "Two-node list reversed."
      },
      {
        "input": "head = []",
        "output": "[]",
        "explanation": "Empty list returns null."
      }
    ],
    "constraints": [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(n) single pass",
      "space": "O(1) auxiliary space (iterative)"
    },
    "starterCode": {
      "python": "# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head: object) -> object:\n    # Write your solution here\n    pass",
      "javascript": "function reverseList(head) {\n    // Write your solution here\n    return null;\n}",
      "cpp": "ListNode* reverseList(ListNode* head) {\n    // Write your solution here\n    return nullptr;\n}",
      "java": "public ListNode reverseList(ListNode head) {\n    // Write your solution here\n    return null;\n}"
    },
    "stageRubric": {
      "clarification": "Candidate clarifies empty list and single node behavior, confirms no values can be copied.",
      "approach": "Three-pointer iteration `(prev, curr, next_node)` reversing `curr.next = prev` step-by-step.",
      "implementation": "Stores `curr.next` before overwriting pointer, correctly returns `prev` as the new head.",
      "complexity": "Strictly O(n) runtime and O(1) constant auxiliary space."
    }
  },
  {
    "id": "general_coin_change",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Coin Change (Fewest Coins Combination)",
    "topic": "Dynamic Programming (Bottom-Up)",
    "difficulty": "Medium",
    "timeLimitMinutes": 15,
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1 (3 coins)."
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1",
        "explanation": "Cannot form 3 using only 2s."
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0",
        "explanation": "0 coins for amount 0."
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(amount * coins.length)",
      "space": "O(amount) for DP table"
    },
    "starterCode": {
      "python": "def coinChange(coins: list[int], amount: int) -> int:\n    # Write your solution here\n    pass",
      "javascript": "function coinChange(coins, amount) {\n    // Write your solution here\n    return -1;\n}",
      "cpp": "int coinChange(vector<int>& coins, int amount) {\n    // Write your solution here\n    return -1;\n}",
      "java": "public int coinChange(int[] coins, int amount) {\n    // Write your solution here\n    return -1;\n}"
    },
    "stageRubric": {
      "clarification": "Asks what to return if amount is 0 (0) and if coins cannot produce amount (-1).",
      "approach": "Bottom-up 1D DP array of size `amount + 1` where `dp[i]` is min coins for amount `i`. `dp[i] = min(dp[i], 1 + dp[i - c])`.",
      "implementation": "Initializes `dp` array with `infinity` (or `amount + 1`), sets `dp[0] = 0`, checks `if (i - c >= 0)`.",
      "complexity": "Accurately explains O(amount * |coins|) time and O(amount) space."
    }
  },
  {
    "id": "general_median_data_stream",
    "company": "general",
    "companyName": "FAANG Standard",
    "companyLogo": "https://github.com/favicon.ico",
    "title": "Find Median from Data Stream (Two Heaps)",
    "topic": "Heaps & Two Heaps Pattern",
    "difficulty": "Hard",
    "timeLimitMinutes": 15,
    "description": "The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nImplement the `MedianFinder` class:\n- `MedianFinder()` initializes the `MedianFinder` object.\n- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n- `double findMedian()` returns the median of all elements so far.",
    "examples": [
      {
        "input": "[\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"]\n[[], [1], [2], [], [3], []]",
        "output": "[null, null, null, 1.5, null, 2.0]",
        "explanation": "Two heaps maintain median in logarithmic time."
      }
    ],
    "constraints": [
      "-10^5 <= num <= 10^5",
      "There will be at least one element in the data structure before calling findMedian.",
      "At most 5 * 10^4 calls will be made to addNum and findMedian."
    ],
    "expectedComplexity": {
      "time": "O(log n) for addNum, O(1) for findMedian",
      "space": "O(n) auxiliary heap storage"
    },
    "starterCode": {
      "python": "class MedianFinder:\n    def __init__(self):\n        # Write your solution here\n        pass\n\n    def addNum(self, num: int) -> None:\n        pass\n\n    def findMedian(self) -> float:\n        return 0.0",
      "javascript": "class MedianFinder {\n    constructor() {}\n    addNum(num) {}\n    findMedian() { return 0.0; }\n}",
      "cpp": "class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() { return 0.0; }\n};",
      "java": "class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() { return 0.0; }\n}"
    },
    "stageRubric": {
      "clarification": "Clarifies whether stream length is bounded and verifies floating-point precision for even counts.",
      "approach": "Two-heap design: Max-Heap for lower half, Min-Heap for upper half. Maintains balance condition `len(small) == len(large)` or `len(small) == len(large) + 1`.",
      "implementation": "Correctly pushes to one heap, balances to other, returns top or average of two tops in O(1).",
      "complexity": "Proves O(log n) insertion and instant O(1) median retrieval with O(n) space."
    }
  }
];

// Active mock interview sessions in memory
const activeInterviews = new Map();

// 4-Stage Technical Interview Progression
const STAGES = [
  { id: 'clarification', label: '1. Clarification & Edge Cases' },
  { id: 'approach', label: '2. Approach & Trade-offs' },
  { id: 'implementation', label: '3. Code Implementation' },
  { id: 'complexity', label: '4. Complexity & Optimization' }
];

// GET list of problems
router.get('/problems', (req, res) => {
  const problemsSummary = interviewQuestions.map(q => ({
    id: q.id,
    company: q.company,
    companyName: q.companyName,
    title: q.title,
    topic: q.topic,
    difficulty: q.difficulty,
    timeLimitMinutes: q.timeLimitMinutes
  }));
  res.json({ problems: problemsSummary });
});

// START a mock interview session
router.post('/start', optionalAuth, (req, res) => {
  try {
    const { company = 'google', questionId, lastQuestionId, language = 'python' } = req.body;
    const userId = req.user ? req.user._id : 'guest_learner';

    let selectedQuestion = null;
    if (questionId) {
      selectedQuestion = interviewQuestions.find(q => q.id === questionId);
    }

    if (!selectedQuestion) {
      // Filter questions by company
      const pool = interviewQuestions.filter(q => q.company === company);
      let candidates = pool.length > 0 ? pool : interviewQuestions;

      // Avoid repeating the last question if more than one candidate exists
      if (lastQuestionId && candidates.length > 1) {
        const nonRepeated = candidates.filter(q => q.id !== lastQuestionId);
        if (nonRepeated.length > 0) candidates = nonRepeated;
      }

      // Random pick from candidates
      selectedQuestion = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const interviewId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    const initialInterviewerMessage = `Hello! Welcome to your technical interview for **${selectedQuestion.companyName}**. I will be your interviewer today.

We will focus on **${selectedQuestion.title}** (${selectedQuestion.difficulty}).
Topic focus: **${selectedQuestion.topic}**.

${selectedQuestion.description}

**Example:**
\`${selectedQuestion.examples[0].input}\` $\\rightarrow$ \`${selectedQuestion.examples[0].output}\`

To start: **Before writing any code**, please review the problem and ask any clarifying questions regarding constraints, input types, or potential edge cases you'd like to check! Speak your thoughts aloud or type them in.`;

    const starterCodeStr = selectedQuestion.starterCode?.[language] || selectedQuestion.starterCode?.python || '';

    const sessionState = {
      interviewId,
      userId,
      company: selectedQuestion.company,
      question: selectedQuestion,
      currentStageIndex: 0,
      startTime,
      language,
      messages: [
        {
          role: 'interviewer',
          stage: 'clarification',
          content: initialInterviewerMessage,
          timestamp: new Date().toISOString()
        }
      ],
      currentCode: starterCodeStr
    };

    activeInterviews.set(interviewId, sessionState);

    res.json({
      interviewId,
      question: selectedQuestion,
      stages: STAGES,
      currentStage: STAGES[0],
      initialInterviewerMessage,
      timeLimitSeconds: selectedQuestion.timeLimitMinutes * 60,
      starterCode: starterCodeStr
    });
  } catch (err) {
    console.error('Failed to start mock interview:', err);
    res.status(500).json({ error: 'Failed to initialize interview session.' });
  }
});

// SEND MESSAGE during mock interview (AI + Code Snippet Aware)
router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { interviewId, message, currentCode, stageId, language = 'python' } = req.body;
    if (!interviewId || !message) {
      return res.status(400).json({ error: 'interviewId and message are required.' });
    }

    const session = activeInterviews.get(interviewId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session expired or not found.' });
    }

    if (currentCode !== undefined && currentCode !== null) {
      session.currentCode = currentCode;
    }
    if (language) {
      session.language = language;
    }

    const currentStage = stageId || STAGES[session.currentStageIndex]?.id || 'clarification';

    session.messages.push({
      role: 'candidate',
      stage: currentStage,
      content: message,
      timestamp: new Date().toISOString()
    });

    // Call dynamic AI Interviewer (Groq LPU / Gemini / Code-Aware Fallback Engine)
    const aiResult = await generateInterviewerResponse({
      question: session.question,
      currentCode: session.currentCode || '',
      language: session.language || language || 'python',
      messages: session.messages,
      message,
      stageId: currentStage,
      currentStageIndex: session.currentStageIndex
    });

    const nextStageId = aiResult.stageId || currentStage;
    const stageIdx = STAGES.findIndex(s => s.id === nextStageId);
    if (stageIdx !== -1) {
      session.currentStageIndex = stageIdx;
    }

    session.messages.push({
      role: 'interviewer',
      stage: nextStageId,
      content: aiResult.reply,
      timestamp: new Date().toISOString()
    });

    const activeStageObj = STAGES.find(s => s.id === nextStageId) || STAGES[session.currentStageIndex] || STAGES[0];

    res.json({
      reply: aiResult.reply,
      stage: activeStageObj,
      stageIndex: session.currentStageIndex,
      suggestedPrompt: aiResult.suggestedPrompt,
      provider: aiResult.provider,
      codeAnalysis: analyzeCodeSnippet(session.currentCode, session.language)
    });
  } catch (err) {
    console.error('Failed to process interview message:', err);
    res.status(500).json({ error: 'Failed to process candidate response.' });
  }
});

// EVALUATE INTERVIEW & GENERATE SCORECARD
router.post('/evaluate', optionalAuth, async (req, res) => {
  try {
    const { interviewId, finalCode, timeSpentSeconds = 600, tabSwitchCount = 0 } = req.body;
    const session = activeInterviews.get(interviewId);

    const question = session ? session.question : interviewQuestions[0];
    const messages = session ? session.messages : [];
    const code = finalCode || (session ? session.currentCode : '') || '';

    const candidateMessages = messages.filter(m => m.role === 'candidate');
    const totalWords = candidateMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0);

    // Detailed code structural analysis
    const codeAnalysis = analyzeCodeSnippet(code, session?.language || 'python');
    const hasCodeWritten = !codeAnalysis.isStarterCode && (codeAnalysis.charCount > 35 || codeAnalysis.linesCount > 3);
    const hasProperKeywords = codeAnalysis.constructs.length > 0 || /while|for|if|return|max|min|set|map|push|pop|append|dict/i.test(code);

    // Check if the user made any attempt at all
    const isZeroAttempt = candidateMessages.length === 0 && !hasCodeWritten;

    if (isZeroAttempt) {
      // Clean, honest evaluation for aborted/zero attempt screens
      const zeroScorecard = {
        interviewId: interviewId || 'mock_completed',
        company: question.companyName,
        questionTitle: question.title,
        topic: question.topic,
        difficulty: question.difficulty,
        verdict: 'NO ATTEMPT',
        verdictClass: 'rose',
        overallPercentage: 0,
        averageScoreOutOf5: 0.0,
        timeSpentFormatted: `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`,
        awardedXp: 0,
        integrity: {
          status: tabSwitchCount === 0 ? 'CLEAN' : 'FLAGGED',
          tabSwitches: tabSwitchCount,
          label: tabSwitchCount === 0 ? 'Verified Clean Proctor' : `${tabSwitchCount} Focus Violations`,
          color: tabSwitchCount === 0 ? 'emerald' : 'rose',
          notes: tabSwitchCount === 0 ? 'Zero focus loss detected.' : `${tabSwitchCount} external tab switch(es) detected.`
        },
        rubric: [
          {
            pillar: 'Problem Solving & Intuition',
            score: 0.0,
            maxScore: 5.0,
            description: 'No clarifying questions asked or approach discussed.'
          },
          {
            pillar: 'Communication Clarity',
            score: 0.0,
            maxScore: 5.0,
            description: 'No verbal reasoning or dialogue detected.'
          },
          {
            pillar: 'Algorithmic Optimization',
            score: 0.0,
            maxScore: 5.0,
            description: 'No complexity analysis or optimization presented.'
          },
          {
            pillar: 'Code Quality & Resilience',
            score: 0.0,
            maxScore: 5.0,
            description: 'No working implementation submitted in the editor.'
          }
        ],
        strengths: [
          'Initiated the FAANG technical screen environment.'
        ],
        growthAreas: [
          'Engage with the Socratic interviewer: ask 1-2 clarifying questions about bounds before coding.',
          'State brute-force vs optimal time complexity aloud before writing code.',
          'Complete an end-to-end implementation in the integrated code playground.'
        ],
        seniorEngineerNotes: `Candidate opened **${question.title}** (${question.companyName}) but exited without submitting code or conversing with the interviewer. In a FAANG screen, verbal engagement and active problem breakdown are required for consideration.`,
        recommendedTopic: question.topic
      };

      return res.json(zeroScorecard);
    }

    // Realistic evaluation heuristics based on candidate's actual participation
    const hasClarified = candidateMessages.some(m => /empty|null|negative|edge|bound|duplicate|zero|size|ascii/i.test(m.content));
    const hasComplexity = candidateMessages.some(m => /o\(|time|space|linear|logarithmic|quadratic/i.test(m.content));

    // 1. Problem Solving (0.0 to 5.0)
    let problemSolvingScore = 1.0;
    if (candidateMessages.length >= 1) problemSolvingScore += 1.0;
    if (hasClarified) problemSolvingScore += 1.2;
    if (candidateMessages.length >= 3) problemSolvingScore += 0.8;
    if (hasComplexity) problemSolvingScore += 0.8;
    problemSolvingScore = Math.min(5.0, Math.round(problemSolvingScore * 10) / 10);

    // 2. Communication Clarity (0.0 to 5.0)
    let communicationScore = 1.0;
    if (totalWords > 20) communicationScore += 1.0;
    if (totalWords > 60) communicationScore += 1.0;
    if (candidateMessages.length >= 3) communicationScore += 0.8;
    if (totalWords > 120) communicationScore += 0.8;
    communicationScore = Math.min(5.0, Math.round(communicationScore * 10) / 10);

    // 3. Algorithmic Optimization & Complexity (0.0 to 5.0)
    let complexityScore = 1.0;
    if (hasComplexity) complexityScore += 1.8;
    if (/o\(n\)|o\(log n\)|o\(1\)/i.test(code + ' ' + candidateMessages.map(m => m.content).join(' '))) complexityScore += 1.2;
    if (candidateMessages.length >= 3) complexityScore += 0.5;
    complexityScore = Math.min(5.0, Math.round(complexityScore * 10) / 10);

    // 4. Code Quality & Edge Cases (0.0 to 5.0)
    let codeQualityScore = 1.0;
    if (hasCodeWritten) codeQualityScore += 1.4;
    if (codeAnalysis.hasLoop) codeQualityScore += 0.6;
    if (codeAnalysis.hasBaseCase) codeQualityScore += 0.6;
    if (codeAnalysis.hasReturn) codeQualityScore += 0.5;
    if (codeAnalysis.hasPointers || codeAnalysis.hasMapOrSet) codeQualityScore += 0.5;
    if (hasClarified) codeQualityScore += 0.4;
    codeQualityScore = Math.min(5.0, Math.round(codeQualityScore * 10) / 10);

    // Overall Average Score (Percentage 0-100)
    const averageScoreOutOf5 = (problemSolvingScore + communicationScore + complexityScore + codeQualityScore) / 4;
    const overallPercentage = Math.round((averageScoreOutOf5 / 5.0) * 100);

    // Hire Verdict
    let verdict = 'NO HIRE';
    let verdictClass = 'rose';
    let awardedXp = 75;

    if (overallPercentage >= 82) {
      verdict = 'STRONG HIRE';
      verdictClass = 'emerald';
      awardedXp = 500;
    } else if (overallPercentage >= 68) {
      verdict = 'LEANING HIRE';
      verdictClass = 'blue';
      awardedXp = 350;
    } else if (overallPercentage >= 40) {
      verdict = 'NEEDS PRACTICE';
      verdictClass = 'amber';
      awardedXp = 200;
    }

    const strengths = [];
    const growthAreas = [];

    if (hasClarified) {
      strengths.push('Proactively inquired about input bounds and edge cases before jumping into code.');
    } else {
      growthAreas.push('Spend 60-90 seconds upfront asking about edge cases (e.g. empty inputs, duplicates, extreme values).');
    }

    if (hasComplexity) {
      strengths.push('Demonstrated strong command of Big-O time and auxiliary space tradeoffs.');
    } else {
      growthAreas.push('State both worst-case time complexity AND space complexity without waiting for interviewer prompt.');
    }

    if (totalWords > 60) {
      strengths.push('Good verbal communication — vocalized reasoning clearly during the screen.');
    } else {
      growthAreas.push('Practice continuous "thinking aloud" so the interviewer understands your thought progression.');
    }

    if (hasCodeWritten) {
      strengths.push('Wrote clean, structured implementation with proper control flow.');
    } else {
      growthAreas.push('Ensure complete implementation with boundary condition handling in the editor.');
    }

    // Integrity assessment
    let integrity = {
      status: 'CLEAN',
      tabSwitches: tabSwitchCount,
      label: 'Verified Clean Proctor',
      color: 'emerald',
      notes: 'Zero tab switches or window blur detected during screen.'
    };

    if (tabSwitchCount > 0 && tabSwitchCount <= 2) {
      integrity = {
        status: 'WARNING',
        tabSwitches: tabSwitchCount,
        label: `${tabSwitchCount} Tab Switch Warning(s)`,
        color: 'amber',
        notes: `${tabSwitchCount} window focus switch(es) detected during the technical screen.`
      };
    } else if (tabSwitchCount >= 3) {
      integrity = {
        status: 'FLAGGED',
        tabSwitches: tabSwitchCount,
        label: `${tabSwitchCount} Focus Violations (Flagged)`,
        color: 'rose',
        notes: 'Excessive tab switching detected. Screen flagged for proctored violation.'
      };
    }

    const scorecard = {
      interviewId: interviewId || 'mock_completed',
      company: question.companyName,
      questionTitle: question.title,
      topic: question.topic,
      difficulty: question.difficulty,
      verdict,
      verdictClass,
      overallPercentage,
      averageScoreOutOf5: Math.round(averageScoreOutOf5 * 10) / 10,
      timeSpentFormatted: `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`,
      awardedXp,
      integrity,
      rubric: [
        {
          pillar: 'Problem Solving & Intuition',
          score: problemSolvingScore,
          maxScore: 5.0,
          description: 'Ability to deconstruct the problem, explore trade-offs, and formulate an optimal approach.'
        },
        {
          pillar: 'Communication Clarity',
          score: communicationScore,
          maxScore: 5.0,
          description: 'Clarity of verbal reasoning, "thinking aloud", and receptive dialogue with the interviewer.'
        },
        {
          pillar: 'Algorithmic Optimization',
          score: complexityScore,
          maxScore: 5.0,
          description: 'Accuracy in identifying Big-O time and space complexity and avoiding brute-force traps.'
        },
        {
          pillar: 'Code Quality & Resilience',
          score: codeQualityScore,
          maxScore: 5.0,
          description: 'Clean syntax, robust variable naming, and consideration of boundary conditions.'
        }
      ],
      strengths,
      growthAreas,
      seniorEngineerNotes: `Candidate tackled **${question.title}** under simulated 15-minute conditions. ${verdict === 'STRONG HIRE' ? 'Exhibited senior-level communication and structured coding fluency.' : verdict === 'LEANING HIRE' ? 'Solid foundational intuition with room for deeper complexity analysis.' : 'Shows potential; practice verbalizing algorithmic trade-offs and handling edge cases.'} Recommended next priority: review **${question.topic}** in LearnLoop to solidify interview mastery.`,
      recommendedTopic: question.topic
    };

    res.json(scorecard);
  } catch (err) {
    console.error('Failed to evaluate interview:', err);
    res.status(500).json({ error: 'Failed to generate candidate scorecard.' });
  }
});

export default router;
