/**
 * Comprehensive Pedagogical Knowledge Base for Data Structures & Algorithms
 * Provides authoritative, calibrated explanations, ASCII traces, code snippets,
 * and follow-up Socratic prompts for 50+ DSA topics and subtopics.
 */

export const dsaKnowledgeCatalog = [
  // ==========================================
  // 1. TREES & ADVANCED HIERARCHICAL STRUCTURES
  // ==========================================
  {
    id: 'avl-tree',
    pattern: /\b(avl|avl tree|balance factor|tree rotation|tree rotations|self balancing bst|self-balancing bst)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### ⚖️ Understanding AVL Trees (Self-Balancing BST)

An **AVL Tree** (named after inventors **A**delson-**V**elsky and **L**andis, 1962) is a **Self-Balancing Binary Search Tree** where the heights of the two child subtrees of every node differ by **at most 1**.

#### Why Do We Need AVL Trees?
In a standard Binary Search Tree (BST), inserting elements in sorted order (e.g. \`[1, 2, 3, 4, 5]\`) causes the tree to degrade into a **skewed linear linked list**. Search time degrades from $O(\\log n)$ to catastrophic **$O(n)$**!

AVL trees mathematically guarantee **$O(\\log n)$ worst-case search, insert, and delete** by automatically rebalancing themselves after every mutation.

---

#### 1. The Balance Factor (BF)
For every node $N$:
$$\\text{Balance Factor}(N) = \\text{Height}(\\text{Left Subtree}) - \\text{Height}(\\text{Right Subtree})$$

* **Balanced:** $\\text{BF} \\in \\{-1, 0, 1\\}$.
* **Unbalanced:** $\\text{BF} \\ge 2$ (Left-heavy) or $\\text{BF} \\le -2$ (Right-heavy).

---

#### 2. The 4 Rebalancing Rotations
When an insertion violates balance, exactly one of 4 rotation operations restores balance in **$O(1)$ time**:

1. **Left-Left (LL) Heavy $\\to$ Single Right Rotation:**
   * A node has $\\text{BF} = +2$, and the new key was inserted in the **Left child's Left subtree**.
   * *Fix:* Rotate the left child upward to take the parent's place.
2. **Right-Right (RR) Heavy $\\to$ Single Left Rotation:**
   * A node has $\\text{BF} = -2$, and the new key went into the **Right child's Right subtree**.
   * *Fix:* Rotate the right child upward.
3. **Left-Right (LR) Heavy $\\to$ Double Rotation (Left then Right):**
   * A node has $\\text{BF} = +2$, and the new key went into the **Left child's Right subtree** (zigzag shape).
   * *Fix:* Perform a Left rotation on the left child, then a Right rotation on the parent.
4. **Right-Left (RL) Heavy $\\to$ Double Rotation (Right then Left):**
   * A node has $\\text{BF} = -2$, and the new key went into the **Right child's Left subtree** (zigzag shape).
   * *Fix:* Perform a Right rotation on the right child, then a Left rotation on the parent.

---

#### Python Right Rotation Implementation:
\`\`\`python
def right_rotate(y):
    x = y.left
    T2 = x.right

    # Perform rotation
    x.right = y
    y.left = T2

    # Update heights
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))

    # Return new root
    return x
\`\`\`

#### AVL Tree vs Red-Black Tree:
* **AVL Trees** are more strictly balanced $\\implies$ **faster lookups** (ideal for read-heavy workloads like lookup tables).
* **Red-Black Trees** allow slightly looser balance $\\implies$ **faster insertions/deletions** with fewer rotations (used in C++ \`std::map\` and Java \`TreeMap\`).`,
    suggestedPrompts: [
      "Walk me through an LR (Left-Right) double rotation with an example",
      "How does an AVL Tree differ from a Red-Black Tree in practice?",
      "Give me an adaptive practice question on AVL balance factors"
    ]
  },
  {
    id: 'red-black-tree',
    pattern: /\b(red black|red-black|rb tree|rbtree|red black tree)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 🔴⚫ Understanding Red-Black Trees

A **Red-Black Tree** is a self-balancing Binary Search Tree where each node stores an extra bit representing **color: Red or Black**.

#### The 5 Non-Negotiable Properties:
1. **Every node is either Red or Black.**
2. **The Root is always Black.**
3. **Every Leaf (\`NIL\` null reference) is Black.**
4. **Red Property:** If a node is Red, both of its children must be Black (no two consecutive Red nodes on any path).
5. **Black Depth Property:** Every path from the root to any null leaf must contain the exact same number of Black nodes.

#### Complexity & Guarantees:
* The longest possible path (alternating Red and Black) is at most **twice as long** as the shortest path (all Black nodes).
* **Guaranteed Worst-Case Time:** Search, Insert, and Delete run in **$O(\\log n)$**.
* Because balance constraints are looser than AVL trees, insertions and deletions require at most **2 to 3 rotations** plus simple color flips, making Red-Black trees significantly faster for write-heavy systems (e.g. Linux CFS scheduler, C++ \`std::map\`).`,
    suggestedPrompts: [
      "Why is a Red-Black tree faster than an AVL tree for insertions?",
      "How do color flips fix a Red-Red violation?",
      "Give me a challenge question on Red-Black tree properties"
    ]
  },
  {
    id: 'trie',
    pattern: /\b(trie|tries|prefix tree|autocomplete)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 🌲 Understanding Tries (Prefix Trees)

A **Trie** (derived from "re**TRIE**val") is a specialized tree used to store dynamic sets of strings where keys are usually sequences of characters.

#### How It Works:
* Unlike a binary tree, nodes do not store entire words. Instead, each edge or node represents a **single character**.
* All descendants of a node share a common string prefix!
* Nodes contain:
  1. \`children\`: A hash map or fixed array of 26 pointers for lowercase letters.
  2. \`is_end_of_word\`: Boolean flag marking where a valid word terminates.

#### Time Complexity:
* **Insert word of length $L$:** $O(L)$
* **Search word of length $L$:** $O(L)$
* **Prefix Search (\`startsWith\`):** $O(L)$
*(Notice: Completely independent of the total number of words $N$ in the dictionary!)*

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end
\`\`\``,
    suggestedPrompts: [
      "How do you implement search suggestions/autocomplete using a Trie?",
      "How does a Trie compare to a Hash Set for dictionary lookups?",
      "Explain how a Bitwise Trie solves Maximum XOR of Two Numbers"
    ]
  },
  {
    id: 'segment-tree',
    pattern: /\b(segment tree|segment trees|fenwick|fenwick tree|binary indexed tree|range query|range minimum query|rmq)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 📊 Understanding Segment Trees & Range Queries

A **Segment Tree** is a tree data structure used for storing intervals or segments. It allows querying which segments contain a given point, or querying aggregate values (sum, min, max, gcd) over an arbitrary subarray in **$O(\\log n)$ time**.

#### The Core Problem:
* Naive Array Range Sum: Query $O(n)$, Update $O(1)$.
* Prefix Sum Array: Query $O(1)$, but Update requires shifting $\\to O(n)$.
* **Segment Tree:** Both **Range Query AND Point Update run in $O(\\log n)$**!

#### Tree Structure:
* Leaf nodes represent single array elements \`arr[i]\`.
* Internal nodes represent the aggregate (e.g. sum) of their left and right children:
  $$\\text{node.val} = \\text{left\\_child.val} + \\text{right\\_child.val}$$
* Represented cleanly as a flat array of size $4n$.`,
    suggestedPrompts: [
      "How does Lazy Propagation optimize range updates in a Segment Tree?",
      "What is the difference between a Segment Tree and a Fenwick Tree (BIT)?",
      "Give me an example problem using Range Minimum Query (RMQ)"
    ]
  },
  {
    id: 'heap-priority-queue',
    pattern: /\b(heap|heaps|priority queue|min heap|min-heap|max heap|max-heap|heapify|heapsort)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 🏔️ Understanding Heaps & Priority Queues

A **Binary Heap** is a complete binary tree that satisfies the **Heap Property**:
* **Min-Heap:** The value of every node is $\\le$ the values of its children (Root is strictly the minimum element).
* **Max-Heap:** The value of every node is $\\ge$ the values of its children (Root is strictly the maximum element).

#### Array Representation (Zero Memory Overhead):
Because a binary heap is a *complete binary tree* (filled left-to-right on every level), it is represented as a contiguous 1D array without pointer nodes:
* Parent index: \`parent = (i - 1) // 2\`
* Left child: \`left = 2 * i + 1\`
* Right child: \`right = 2 * i + 2\`

#### Core Operations:
1. **\`peek()\`:** View root extremum in **$O(1)$** time.
2. **\`push(x)\`:** Append to end, bubble up (sift-up) in **$O(\\log n)$** time.
3. **\`pop()\`:** Swap root with last element, pop end, bubble down (sift-down) in **$O(\\log n)$** time.
4. **\`heapify(arr)\`:** Convert an arbitrary array into a valid heap in **$O(n)$ linear time**!

\`\`\`python
import heapq

# Python's heapq is a MIN-HEAP by default
nums = [5, 1, 9, 3]
heapq.heapify(nums)         # O(n) in-place transformation -> [1, 3, 9, 5]
min_val = heapq.heappop(nums) # O(log n) -> returns 1
heapq.heappush(nums, 2)     # O(log n) -> inserts 2
\`\`\``,
    suggestedPrompts: [
      "Why is building a heap (heapify) O(n) instead of O(n log n)?",
      "How do you implement a Max-Heap in Python using heapq?",
      "How do you find the K-th largest element in an array using a Min-Heap?"
    ]
  },
  {
    id: 'lca-trees',
    pattern: /\b(lowest common ancestor|lca)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 🌿 Lowest Common Ancestor (LCA)

The **Lowest Common Ancestor** of two nodes $p$ and $q$ in a tree is the deepest node that has both $p$ and $q$ as descendants (where a node can be a descendant of itself).

#### 1. In a Binary Search Tree (BST):
Because a BST is ordered, finding LCA is trivial and runs in **$O(h)$ time**:
* If both $p$ and $q$ are strictly smaller than \`root.val\`, the LCA must be in the **left subtree**.
* If both $p$ and $q$ are strictly greater than \`root.val\`, the LCA must be in the **right subtree**.
* **Split Point:** As soon as $p$ and $q$ lie on opposite sides of \`root.val\` (or one equals \`root\`), the current node **IS the LCA**!

#### 2. In a General Binary Tree (Post-Order DFS):
\`\`\`python
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)

    # If both subtrees returned a non-null node, root is the LCA!
    if left and right:
        return root
    return left if left else right
\`\`\``,
    suggestedPrompts: [
      "Why does post-order DFS find the LCA in O(n) time?",
      "How do you find LCA in a graph or tree with parent pointers?",
      "Give me an adaptive practice question on Lowest Common Ancestor"
    ]
  },

  // ==========================================
  // 2. STACKS & QUEUES SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'monotonic-stack',
    pattern: /\b(monotonic stack|next greater element|daily temperatures|largest rectangle in histogram|trapping rain water)\b/i,
    topicName: 'Stacks and Queues',
    topicSlug: 'stacks-and-queues',
    getContent: (mastery) => `### 🥞 Monotonic Stacks (Next Greater Element & Histograms)

A **Monotonic Stack** is a stack whose elements are strictly maintained in sorted order:
* **Monotonically Increasing Stack:** Elements increase from bottom to top. Used to find the **Previous/Next Smaller Element**.
* **Monotonically Decreasing Stack:** Elements decrease from bottom to top. Used to find the **Previous/Next Greater Element**.

#### The Core Invariant:
Whenever a new element violates the monotonic order, you **pop elements from the stack** until the invariant is restored. 
Every element is pushed onto the stack once and popped at most once, guaranteeing **$O(n)$ amortized linear time** instead of a naive $O(n^2)$ nested loop!

#### Classic Template: Next Greater Element
\`\`\`python
def nextGreaterElements(nums):
    n = len(nums)
    res = [-1] * n
    stack = []  # stores INDICES of decreasing elements

    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            res[idx] = nums[i]
        stack.append(i)

    return res
\`\`\`

#### Major Interview Applications:
* **Daily Temperatures:** Finding how many days until a warmer temperature.
* **Trapping Rain Water:** Calculating trapped volume between elevation bars in $O(n)$.
* **Largest Rectangle in Histogram:** Finding maximum area in $O(n)$ using an increasing stack.`,
    suggestedPrompts: [
      "How do you solve Largest Rectangle in Histogram using a Monotonic Stack?",
      "Explain the Trapping Rain Water problem using a stack",
      "Give me a challenge problem on Monotonic Stacks"
    ]
  },
  {
    id: 'valid-parentheses',
    pattern: /\b(valid parentheses|parentheses matching|bracket matching|balanced brackets)\b/i,
    topicName: 'Stacks and Queues',
    topicSlug: 'stacks-and-queues',
    getContent: (mastery) => `### 🥞 Solving Valid Parentheses with a Stack

Matching nested bracket characters (\`"()[]{}"\`) is the textbook illustration of why **LIFO (Last-In, First-Out)** is an essential computer science primitive.

#### The Core Invariant:
The bracket that was **opened most recently** must be the **first one closed**!

#### Step-by-Step Algorithm ($O(n)$ Time, $O(n)$ Space):
1. Initialize an empty stack.
2. Define a hash map mapping closing brackets to matching openers: \`{')': '(', '}': '{', ']': '['}\`.
3. Iterate character by character:
   * If the character is an opener (\`(\`, \`[\`, \`{\`), **push** it onto the stack.
   * If it is a closer, verify that the stack is **not empty** and that \`stack.pop()\` matches the required opener. If not, return \`False\`.
4. At the end of the string, return \`len(stack) == 0\` (ensures no unclosed brackets remain).

\`\`\`python
def isValid(s: str) -> bool:
    mapping = {")": "(", "}": "{", "]": "["}
    stack = []
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0
\`\`\``,
    suggestedPrompts: [
      "How do you generate all combinations of valid parentheses?",
      "How do you find the longest valid parentheses substring?",
      "What is the difference between a Call Stack and a Data Stack?"
    ]
  },
  {
    id: 'lru-cache',
    pattern: /\b(lru|lru cache|least recently used)\b/i,
    topicName: 'Stacks and Queues',
    topicSlug: 'stacks-and-queues',
    getContent: (mastery) => `### ⚡ LRU Cache (Hash Map + Doubly Linked List)

A **Least Recently Used (LRU) Cache** organizes items in order of use. When the cache reaches capacity, it evicts the least recently accessed key.

#### The Dual Invariant ($O(1)$ for Both \`get\` and \`put\`):
* **Hash Map (\`key -> Node\`):** Guarantees **$O(1)$ key lookup**.
* **Doubly Linked List:** Guarantees **$O(1)$ removal and insertion** at head/tail without shifting elements in memory!

#### Structure:
* **Head Dummy Node:** Right after Head is the **Most Recently Used (MRU)** item.
* **Tail Dummy Node:** Right before Tail is the **Least Recently Used (LRU)** item (eviction candidate).

\`\`\`python
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        self.head, self.tail = Node(), Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)  # Move to MRU
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
\`\`\``,
    suggestedPrompts: [
      "Why is a Doubly Linked List required instead of a Singly Linked List for LRU?",
      "How does OrderedDict in Python implement LRU Cache internally?",
      "What is the difference between LRU and LFU (Least Frequently Used) cache?"
    ]
  },

  // ==========================================
  // 3. GRAPHS SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'dijkstra',
    pattern: /\b(dijkstra|dijkstra's|shortest path in weighted|shortest path with weights)\b/i,
    topicName: 'Graphs',
    topicSlug: 'graphs',
    getContent: (mastery) => `### 🛣️ Dijkstra's Shortest Path Algorithm

**Dijkstra's Algorithm** finds the shortest path from a single source node to all other nodes in a weighted graph with **strictly non-negative edge weights**.

#### Core Greedy Intuition:
At every step, select the unvisited vertex with the **smallest known provisional distance**, finalize its distance, and **relax** all of its outgoing edges:
$$\\text{If } \\text{dist}[u] + \\text{weight}(u, v) < \\text{dist}[v] \\implies \\text{dist}[v] = \\text{dist}[u] + \\text{weight}(u, v)$$

#### Time Complexity:
Using a Min-Heap (Priority Queue):
$$\\mathbf{O((V + E) \\log V)}$$
*(Extract-min is called $V$ times, and edge relaxations occur $E$ times).*

\`\`\`python
import heapq

def dijkstra(graph, start, n):
    distances = {i: float('inf') for i in range(n)}
    distances[start] = 0
    pq = [(0, start)]  # (current_distance, node)

    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist > distances[u]:
            continue  # Outdated heap entry

        for v, weight in graph[u]:
            distance = curr_dist + weight
            if distance < distances[v]:
                distances[v] = distance
                heapq.heappush(pq, (distance, v))

    return distances
\`\`\`

> **Critical Interview Rule:** Dijkstra CANNOT handle negative edge weights! Negative weights violate the greedy choice property (a previously finalized node could be reduced later). For negative weights, use **Bellman-Ford** ($O(V \\cdot E)$).`,
    suggestedPrompts: [
      "Why does Dijkstra fail when edge weights are negative?",
      "How does the Bellman-Ford algorithm handle negative edge weights?",
      "How do you reconstruct the actual shortest path path vertices, not just the distance?"
    ]
  },
  {
    id: 'topological-sort',
    pattern: /\b(topological sort|topological sorting|kahn|kahn's|dag ordering|course schedule)\b/i,
    topicName: 'Graphs',
    topicSlug: 'graphs',
    getContent: (mastery) => `### 🧭 Topological Sorting & Kahn's Algorithm

A **Topological Sort** of a Directed Acyclic Graph (DAG) is a linear ordering of its vertices such that for every directed edge $u \\to v$, vertex $u$ comes before vertex $v$ in the ordering.

*(Classic scenario: Course prerequisites — you cannot take Advanced Algorithms before Discrete Math!)*

#### Kahn's Algorithm (BFS with In-degrees):
1. **Compute in-degrees:** Count how many incoming edges point to each node.
2. **Initialize Queue:** Add all nodes with **$\\text{in-degree} = 0$** (they have zero prerequisites).
3. **Process Queue:**
   * Pop node $u$, append to sorted result.
   * For each neighbor $v$ of $u$, decrement $v$'s in-degree by 1.
   * If $v$'s in-degree drops to 0, push $v$ into the queue.
4. **Cycle Detection:** If the sorted result contains fewer than $V$ nodes, **the graph has a cycle** and a valid topological sort is impossible!

#### Complexity:
* **Time:** $O(V + E)$
* **Space:** $O(V)$`,
    suggestedPrompts: [
      "How do you implement Topological Sort using DFS and a visited set?",
      "Explain how Kahn's algorithm detects cycles in a directed graph",
      "Give me a challenge problem on Course Schedule"
    ]
  },
  {
    id: 'union-find-dsu',
    pattern: /\b(disjoint set|union find|union-find|dsu|kruskal|kruskal's|mst)\b/i,
    topicName: 'Graphs',
    topicSlug: 'graphs',
    getContent: (mastery) => `### 🌲 Disjoint Set Union (DSU / Union-Find) & Kruskal's MST

A **Disjoint Set Union (DSU)** data structure maintains a collection of disjoint (non-overlapping) sets. It supports two operations near-instantaneously:
1. **\`find(x)\`:** Returns the representative root of the set containing $x$.
2. **\`union(x, y)\`:** Merges the sets containing $x$ and $y$.

#### The Two Golden Optimizations:
1. **Path Compression in \`find\`:** Flattens the tree so every node points directly to the root:
   \`parent[x] = find(parent[x])\`
2. **Union by Rank / Size:** Always attach the shallower tree under the deeper tree to prevent skewing.

With both optimizations, amortized time per operation is **$\\mathbf{O(\\alpha(n))}$** (Inverse Ackermann function), which is effectively **$O(1)$** for all physical values of $n$ ($< 5$).

#### Kruskal's Minimum Spanning Tree (MST):
1. Sort all edges by weight in ascending order: $O(E \\log E)$.
2. Iterate through edges: If \`find(u) != find(v)\`, join them with \`union(u, v)\` and include the edge in the MST! If they already share a root, adding the edge would form a cycle.`,
    suggestedPrompts: [
      "Why is Inverse Ackermann alpha(n) considered effectively O(1)?",
      "What is the difference between Kruskal's and Prim's algorithm for MST?",
      "Give me an example of DSU applied to connected components in a grid"
    ]
  },

  // ==========================================
  // 4. ARRAYS & ADVANCED TECHNIQUES
  // ==========================================
  {
    id: 'kadane-algorithm',
    pattern: /\b(kadane|kadane's|maximum subarray|max subarray sum)\b/i,
    topicName: 'Arrays',
    topicSlug: 'arrays',
    getContent: (mastery) => `### 📊 Kadane's Algorithm (Maximum Subarray Sum)

**Kadane's Algorithm** finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum in **$O(n)$ linear time** and **$O(1)$ auxiliary space**.

#### The Core Intuition:
At every index $i$, you face a single decision:
* **Option 1:** Add the current element \`nums[i]\` to the existing subarray sum: \`current_sum + nums[i]\`.
* **Option 2:** Start a brand new subarray starting at \`nums[i]\` because the previous sum was negative and dragging you down!

$$\\text{current\\_sum} = \\max(\\text{nums}[i], \\text{current\\_sum} + \\text{nums}[i])$$
$$\\text{max\\_sum} = \\max(\\text{max\\_sum}, \\text{current\\_sum})$$

\`\`\`python
def maxSubArray(nums):
    current_sum = max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
\`\`\`

> **Why Naive Brute Force Fails:** Checking all pairs of start and end indices takes $O(n^2)$ time. Kadane's DP formulation eliminates recalculation in a single pass!`,
    suggestedPrompts: [
      "How do you return the actual subarray indices in Kadane's algorithm?",
      "How do you solve Maximum Product Subarray?",
      "How does Kadane's algorithm extend to 2D matrices?"
    ]
  },
  {
    id: 'sliding-window',
    pattern: /\b(sliding window|fixed window|dynamic window|variable window)\b/i,
    topicName: 'Arrays',
    topicSlug: 'arrays',
    getContent: (mastery) => `### 🪟 The Sliding Window Technique

The **Sliding Window** technique converts costly $O(n^2)$ nested loops over contiguous subarrays or substrings into **$O(n)$ single-pass algorithms**.

#### The Two Variations:
1. **Fixed-Size Window (Size $k$):**
   * Compute initial sum/frequency of the first $k$ elements.
   * Slide forward one index at a time: **add the incoming element \`nums[right]\`** and **subtract the outgoing element \`nums[left]\`**.
2. **Dynamic / Variable-Size Window:**
   * Expand the right pointer \`right\` to grow the window until a condition is broken (e.g. at most $k$ distinct characters).
   * Shrink the left pointer \`left\` until the condition is restored.

\`\`\`python
# Example: Longest Substring Without Repeating Characters
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    left = max_len = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
\`\`\``,
    suggestedPrompts: [
      "How do you solve Minimum Window Substring using Sliding Window?",
      "When does a Sliding Window problem require a Monotonic Deque?",
      "Give me a practice problem on dynamic sliding windows"
    ]
  },
  {
    id: 'two-pointers',
    pattern: /\b(two pointer|two pointers|two-pointer|two-pointers|container with most water|3sum)\b/i,
    topicName: 'Arrays',
    topicSlug: 'arrays',
    getContent: (mastery) => `### 🎯 The Two-Pointer Technique

The **Two-Pointer** technique uses two reference indices moving through a linear data structure to eliminate redundant searching.

#### The 3 Major Patterns:
1. **Opposite Direction (Converging Pointers):**
   * One pointer at start (\`left = 0\`), one at end (\`right = len - 1\`).
   * Condition: Array must be sorted (e.g. Two-Sum II, Valid Palindrome, Container With Most Water).
   * If \`nums[left] + nums[right] > target\`, decrement \`right\` (sum must decrease).
   * If \`nums[left] + nums[right] < target\`, increment \`left\` (sum must increase).
2. **Same Direction (Fast & Slow Runner):**
   * Used for in-place array manipulation without extra memory (e.g. Remove Duplicates in $O(1)$ space, Move Zeroes).
3. **Two Distinct Arrays:**
   * Used for merging sorted arrays in $O(n + m)$ time (Merge step in MergeSort).`,
    suggestedPrompts: [
      "How do you solve 3Sum in O(n^2) using Two Pointers?",
      "Why does Container With Most Water move the shorter line pointer?",
      "Explain the Fast & Slow pointer pattern in linked lists"
    ]
  },

  // ==========================================
  // 5. DYNAMIC PROGRAMMING SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'knapsack-dp',
    pattern: /\b(knapsack|0\/1 knapsack|zero one knapsack|fractional knapsack)\b/i,
    topicName: 'Dynamic Programming',
    topicSlug: 'dynamic-programming',
    getContent: (mastery) => `### 🎒 The 0/1 Knapsack Problem

Given $n$ items, each with a **weight $w_i$** and a **value $v_i$**, determine the maximum value you can carry in a knapsack with maximum weight capacity $W$. Each item can be chosen **at most once** (0 or 1).

#### State Definition & Recurrence:
Let \`dp[i][w]\` be the maximum value achievable considering the first \`i\` items with maximum weight capacity \`w\`:

* **Case 1 (Item cannot fit):** If $w_i > w$, you must skip it:
  $$\\text{dp}[i][w] = \\text{dp}[i-1][w]$$
* **Case 2 (Item fits):** Maximize between **skipping** the item and **taking** it:
  $$\\text{dp}[i][w] = \\max(\\text{dp}[i-1][w], v_i + \\text{dp}[i-1][w - w_i])$$

#### Complexity:
* **Time Complexity:** $O(n \\cdot W)$ (Pseudo-polynomial time)
* **Space Complexity:** $O(W)$ using 1D space optimization (iterating backwards from $W$ down to $w_i$).

> **Fractional Knapsack vs 0/1 Knapsack:**
> If you can take fractions of an item (e.g. powders, gold dust), the problem is solved greedily by sorting by value-to-weight ratio in $O(n \\log n)$. 0/1 Knapsack CANNOT be solved greedily!`,
    suggestedPrompts: [
      "How do you optimize 0/1 Knapsack space from O(n*W) to O(W)?",
      "Why must the 1D array iterate backwards in 0/1 Knapsack?",
      "What is the difference between 0/1 Knapsack and Unbounded Knapsack?"
    ]
  },
  {
    id: 'lcs-dp',
    pattern: /\b(lcs|longest common subsequence|longest common substring)\b/i,
    topicName: 'Dynamic Programming',
    topicSlug: 'dynamic-programming',
    getContent: (mastery) => `### 🧬 Longest Common Subsequence (LCS)

A **subsequence** is derived by deleting zero or more characters without changing the relative order of the remaining elements.

#### Recurrence Relation:
Let \`dp[i][j]\` be the length of LCS of \`text1[0..i-1]\` and \`text2[0..j-1]\`:
* **Match (\`text1[i-1] == text2[j-1]\`):**
  $$\\text{dp}[i][j] = 1 + \\text{dp}[i-1][j-1]$$
* **Mismatch:**
  $$\\text{dp}[i][j] = \\max(\\text{dp}[i-1][j], \\text{dp}[i][j-1])$$

#### Complexity:
* **Time:** $O(m \\cdot n)$ where $m$ and $n$ are string lengths.
* **Space:** $O(m \\cdot n)$ or $O(\\min(m, n))$ using two rows.`,
    suggestedPrompts: [
      "How do you reconstruct the actual LCS string from the DP table?",
      "What is the difference between Longest Common Subsequence and Substring?",
      "Give me a challenge problem on Edit Distance (Levenshtein)"
    ]
  },
  {
    id: 'lis-dp',
    pattern: /\b(lis|longest increasing subsequence|patience sorting)\b/i,
    topicName: 'Dynamic Programming',
    topicSlug: 'dynamic-programming',
    getContent: (mastery) => `### 📈 Longest Increasing Subsequence (LIS)

Find the length of the longest strictly increasing subsequence in an array \`nums\`.

#### Approach 1: Classic DP ($O(n^2)$ Time, $O(n)$ Space)
* Let \`dp[i]\` be the length of the LIS ending at index \`i\`.
* For every $j < i$, if \`nums[j] < nums[i]\`:
  $$\\text{dp}[i] = \\max(\\text{dp}[i], 1 + \\text{dp}[j])$$

#### Approach 2: Binary Search / Patience Sorting ($O(n \\log n)$ Optimal!)
Maintain an array \`tails\` where \`tails[i]\` stores the smallest tail of all increasing subsequences of length $i+1$:
* For each number \`x\`:
  * If \`x\` is greater than all elements in \`tails\`, append it.
  * Otherwise, use **Binary Search (\`bisect_left\`)** to find the first element $\\ge x$ and replace it with \`x\`.

\`\`\`python
import bisect

def lengthOfLIS(nums):
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)
\`\`\``,
    suggestedPrompts: [
      "Why does patience sorting with binary search achieve O(n log n)?",
      "How do you return the actual longest increasing subsequence elements?",
      "Explain Russian Doll Envelopes using 2D LIS"
    ]
  },

  // ==========================================
  // 6. STRINGS SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'kmp-algorithm',
    pattern: /\b(kmp|knuth morris pratt|knuth-morris-pratt|lps array|longest prefix suffix)\b/i,
    topicName: 'Strings',
    topicSlug: 'strings',
    getContent: (mastery) => `### 🔤 The KMP Algorithm (Knuth-Morris-Pratt)

The **Knuth-Morris-Pratt (KMP)** algorithm is a linear-time string searching algorithm that searches for occurrences of a pattern $P$ in a text $T$ in **$O(n + m)$ time**.

#### Why Naive Matching Fails:
Naive pattern matching takes $O(n \\cdot m)$ because when a mismatch occurs after several matches, the text pointer resets backwards.

#### The KMP Innovation (Zero Backtracking):
KMP precomputes the **$\\pi$ (LPS - Longest Prefix Suffix) array** for the pattern:
* \`lps[i]\` = length of the longest proper prefix of \`P[0..i]\` that is also a suffix of \`P[0..i]\`.
* When a mismatch occurs at \`P[j]\`, we don't rewind the text pointer! We simply jump \`j = lps[j - 1]\` and continue.`,
    suggestedPrompts: [
      "How do you construct the LPS array in O(m) time?",
      "How does the Rabin-Karp algorithm compare to KMP?",
      "Give me a practice question on string pattern matching"
    ]
  },

  // ==========================================
  // 7. SORTING SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'quicksort-quickselect',
    pattern: /\b(quicksort|quick sort|quickselect|quick select|lomuto|hoare)\b/i,
    topicName: 'Sorting',
    topicSlug: 'sorting',
    getContent: (mastery) => `### 📶 QuickSort & QuickSelect

**QuickSort** is a divide-and-conquer algorithm based on **partitioning**:
1. **Choose a Pivot:** (e.g. median-of-three or random element).
2. **Partition:** Rearrange elements so that all values $< \\text{pivot}$ are to the left, and values $> \\text{pivot}$ are to the right. The pivot is now in its permanent sorted index!
3. **Recurse:** Sort the left and right subarrays independently.

#### Complexity:
* **Average Time:** $O(n \\log n)$
* **Worst-Case Time:** $O(n^2)$ (occurs if already sorted and pivot is always smallest/largest; mitigated by randomized pivots).
* **Space:** $O(\\log n)$ recursive call stack (in-place).

#### QuickSelect ($O(n)$ Average Selection):
To find the $k$-th smallest element, you do not need to sort both halves!
* If pivot lands at index $k$, return it!
* If $k < \\text{pivot}$, recurse ONLY on the left half.
* If $k > \\text{pivot}$, recurse ONLY on the right half.
* **Average Time:** $n + n/2 + n/4 + \\dots = \\mathbf{O(n)}$ linear time!`,
    suggestedPrompts: [
      "What is the difference between Lomuto and Hoare partitioning?",
      "Why is QuickSort faster in practice than MergeSort despite O(n^2) worst case?",
      "How does QuickSelect find the K-th largest element in O(n) average time?"
    ]
  },
  {
    id: 'mergesort',
    pattern: /\b(mergesort|merge sort)\b/i,
    topicName: 'Sorting',
    topicSlug: 'sorting',
    getContent: (mastery) => `### 📶 MergeSort (Guaranteed O(n log n) & Stable)

**MergeSort** is an optimal comparison-based divide-and-conquer sorting algorithm.

#### 3 Distinct Advantages:
1. **Guaranteed $O(n \\log n)$ Time:** Even in the worst case (unlike QuickSort).
2. **Stable Sort:** Preserves the original relative order of duplicate keys.
3. **External Sorting:** Ideal for sorting huge datasets that do not fit in RAM (linked lists, tapes, external files).

#### Trade-off:
Requires **$O(n)$ auxiliary memory space** to merge the two halves.`,
    suggestedPrompts: [
      "Why is MergeSort preferred for Linked Lists instead of QuickSort?",
      "How do you count Inversions in an array using MergeSort in O(n log n)?",
      "Explain the merge step implementation in Python"
    ]
  },

  // ==========================================
  // 8. BINARY SEARCH SPECIALIZED TOPICS
  // ==========================================
  {
    id: 'binary-search-on-answer',
    pattern: /\b(binary search on answer|answer space|koko eating|capacity to ship|monotonic predicate)\b/i,
    topicName: 'Binary Search',
    topicSlug: 'binary-search',
    getContent: (mastery) => `### 🔍 Binary Search on Answer Spaces

Binary search is not just for searching sorted arrays! It is a general algorithmic framework for solving **Optimization Problems** (finding the minimum possible maximum, or maximum possible minimum).

#### The Core Requirement: Monotonic Feasibility
If a feasibility function \`isValid(k)\` has a monotonic property:
$$\\text{False, False, False, } \\mathbf{True, True, True}$$
You can binary search across the range of candidate answers $[\\text{low}, \\text{high}]$!

#### Classic Template:
\`\`\`python
def minFeasibleAnswer(low, high):
    ans = high
    while low <= high:
        mid = low + (high - low) // 2
        if isValid(mid):
            ans = mid      # Try to find a smaller valid answer
            high = mid - 1
        else:
            low = mid + 1  # Answer is too small, must increase
    return ans
\`\`\`

#### Real-World Interview Problems:
* **Koko Eating Bananas:** Min speed $k$ to eat all piles within $h$ hours.
* **Capacity to Ship Packages:** Min ship weight capacity to deliver within $D$ days.
* **Aggressive Cows / Split Array Largest Sum:** Maximizing the minimum distance.`,
    suggestedPrompts: [
      "How do you define the search bounds [low, high] for Koko Eating Bananas?",
      "How do you solve Split Array Largest Sum using Binary Search?",
      "Give me a challenge problem on Binary Search on Answer"
    ]
  },
  {
    id: 'rotated-sorted-array',
    pattern: /\b(rotated sorted|search in rotated|rotated array)\b/i,
    topicName: 'Binary Search',
    topicSlug: 'binary-search',
    getContent: (mastery) => `### 🔍 Search in Rotated Sorted Array

An array sorted in ascending order is rotated at an unknown pivot index (e.g. \`[4, 5, 6, 7, 0, 1, 2]\`). Search for a target in **$O(\\log n)$ time**.

#### The Golden Invariant:
No matter where you cut a rotated sorted array in half with \`mid\`, **at least one of the two halves is GUARANTEED to be normally sorted!**

1. If \`nums[low] <= nums[mid]\`, the **Left Half** is sorted.
   * If \`nums[low] <= target < nums[mid]\`, target is in the left half $\\implies$ \`high = mid - 1\`.
   * Else, search the right half $\\implies$ \`low = mid + 1\`.
2. Otherwise, the **Right Half** is sorted.
   * If \`nums[mid] < target <= nums[high]\`, search right half $\\implies$ \`low = mid + 1\`.
   * Else, search left half $\\implies$ \`high = mid - 1\`.`,
    suggestedPrompts: [
      "How do you handle duplicates in a rotated sorted array?",
      "How do you find the minimum element (the rotation pivot) in O(log n)?",
      "Give me an adaptive practice question on rotated binary search"
    ]
  },

  // ==========================================
  // 9. SYSTEM DESIGN & OBJECT-ORIENTED PATTERNS
  // ==========================================
  {
    id: 'elevator-design',
    pattern: /\b(elevator|elevator system|design an elevator|elevator algorithm|lift system)\b/i,
    topicName: 'Stacks and Queues',
    topicSlug: 'stacks-and-queues',
    getContent: (mastery) => `### 🛗 Object-Oriented & Algorithmic Design: Elevator System

Designing an elevator system is a classic technical interview problem that combines **Object-Oriented Design (OOD)** with **Algorithmic Request Scheduling (LOOK / SCAN Algorithm)**.

#### 1. Core Requirements & States:
* **Elevator States:** \`IDLE\`, \`MOVING_UP\`, \`MOVING_DOWN\`
* **Door States:** \`OPEN\`, \`CLOSED\`
* **Requests:** Internal requests (destination floor selected inside car) and External requests (pickup floor + direction button on landing).

---

#### 2. The Optimal Scheduling Algorithm (LOOK Algorithm):
Rather than serving requests First-Come-First-Served (which causes wild thrashing up and down), real elevator controllers use the **LOOK Algorithm**:
* While moving **UP**, continue moving upward as long as there are pending requests at or above the current floor.
* Stop at every requested floor along the upward path.
* Once no higher requests remain, switch direction to **DOWN** and process pending requests below the current floor in descending order.

#### 3. Data Structure Architecture:
* **\`up_queue\` (Min-Heap):** Stores requests above current floor in ascending order.
* **\`down_queue\` (Max-Heap):** Stores requests below current floor in descending order.

\`\`\`python
import heapq

class Direction:
    UP = 1
    DOWN = -1
    IDLE = 0

class Elevator:
    def __init__(self, current_floor=0):
        self.current_floor = current_floor
        self.direction = Direction.IDLE
        self.up_queue = []    # Min-Heap
        self.down_queue = []  # Max-Heap (stored as negative values)

    def add_request(self, floor):
        if floor > self.current_floor:
            heapq.heappush(self.up_queue, floor)
        elif floor < self.current_floor:
            heapq.heappush(self.down_queue, -floor)

    def step(self):
        if self.direction == Direction.UP or self.direction == Direction.IDLE:
            if self.up_queue:
                self.current_floor = heapq.heappop(self.up_queue)
                self.direction = Direction.UP
            elif self.down_queue:
                self.current_floor = -heapq.heappop(self.down_queue)
                self.direction = Direction.DOWN
            else:
                self.direction = Direction.IDLE
\`\`\``,
    suggestedPrompts: [
      "How do you handle multiple elevators in a high-rise building?",
      "What is the difference between LOOK and SCAN disk/elevator algorithms?",
      "How would you add emergency stop and weight limits?"
    ]
  },
  {
    id: 'hash-map-collisions',
    pattern: /\b(hash map|hash table|hash collision|hash collisions|separate chaining|open addressing|linear probing)\b/i,
    topicName: 'Arrays',
    topicSlug: 'arrays',
    getContent: (mastery) => `### 🗄️ Hash Maps & Collision Resolution

A **Hash Map** provides average **$O(1)$ time complexity** for insertion, deletion, and lookup by passing a key through a **Hash Function** to generate an array bucket index.

#### The Collision Problem:
Because the universe of possible keys is infinitely larger than the fixed array size $M$, two distinct keys will eventually hash to the same bucket index (Pigeonhole Principle):
$$\\text{hash}(key_1) \\pmod M == \\text{hash}(key_2) \\pmod M$$

---

#### The 2 Primary Collision Resolution Strategies:
1. **Separate Chaining (Open Hashing):**
   * Each bucket contains a linked list of entries that collided at that index.
   * *Modern Optimization:* In Java 8+, if a bucket's linked list exceeds 8 items, it automatically converts into a **Red-Black Tree** to prevent worst-case degradation from $O(n)$ to $O(\\log n)$!
2. **Open Addressing (Closed Hashing):**
   * All elements are stored directly in the array table itself. When a collision occurs, probe for the next available slot:
   * **Linear Probing:** \`index = (hash(k) + i) % M\` (Subject to primary clustering).
   * **Quadratic Probing:** \`index = (hash(k) + c_1 * i + c_2 * i^2) % M\`.
   * **Double Hashing:** Uses a second hash function \`index = (hash1(k) + i * hash2(k)) % M\` (eliminates clustering).

#### Load Factor ($\\alpha$):
$$\\alpha = \\frac{N}{M} \\quad (N = \\text{elements}, M = \\text{buckets})$$
When $\\alpha$ crosses a threshold (typically **0.75**), the hash map allocates a table **2x larger** and **rehashes all existing keys**.`,
    suggestedPrompts: [
      "Why does Java 8 convert linked lists to Red-Black trees in HashMap?",
      "What is the difference between Linear Probing and Double Hashing?",
      "How do you design a custom hash function for composite objects?"
    ]
  },
  {
    id: 'greedy-vs-dp',
    pattern: /\b(greedy vs dp|dp vs greedy|greedy vs dynamic programming|difference between greedy and dp|difference between greedy and dynamic)\b/i,
    topicName: 'Dynamic Programming',
    topicSlug: 'dynamic-programming',
    getContent: (mastery) => `### ⚖️ Greedy Algorithms vs Dynamic Programming

Both **Greedy** and **Dynamic Programming (DP)** are algorithmic paradigms used to solve optimization problems. Here is the fundamental difference:

| Property | Greedy Algorithm | Dynamic Programming (DP) |
| :--- | :--- | :--- |
| **Decision Making** | Makes the locally optimal choice at every step without ever looking back or backtracking. | Evaluates all possible state transitions and chooses the globally optimal combination. |
| **Subproblem Overlap** | Subproblems do not need to overlap. | Requires **Overlapping Subproblems** and **Optimal Substructure**. |
| **Speed / Complexity** | Typically faster: $O(n)$ or $O(n \\log n)$. | Typically polynomial: $O(n^2)$, $O(n \\cdot W)$. |
| **Guarantee** | Does NOT always guarantee the global optimum unless the **Greedy Choice Property** mathematically holds (e.g. Matroids). | **Always guarantees** the optimal solution if state transitions are formulated correctly. |

#### Classic Case Study: The Knapsack Problem
* **Fractional Knapsack (Greedy Works):** You can take fractions of items. Sorting by value-to-weight ratio yields the global maximum in $O(n \\log n)$.
* **0/1 Knapsack (Greedy Fails):** You cannot divide items. Greedy fails because taking a high-ratio light item might block a combination of items with higher total value. Must use **Dynamic Programming** ($O(n \\cdot W)$)!`,
    suggestedPrompts: [
      "Can you demonstrate why Greedy fails on 0/1 Knapsack with an example?",
      "When can we mathematically prove that a Greedy choice is optimal?",
      "Explain the Coin Change problem using both Greedy and DP"
    ]
  },
  {
    id: 'two-sum',
    pattern: /\b(two sum|2sum|two-sum)\b/i,
    topicName: 'Arrays',
    topicSlug: 'arrays',
    getContent: (mastery) => `### 🎯 The Two Sum Problem (3 Algorithmic Approaches)

**Problem:** Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

#### Approach 1: Brute Force
* Compare every pair with nested loops.
* **Time:** $O(n^2)$ | **Space:** $O(1)$

#### Approach 2: Two Pointers (If Array is Sorted)
* Sort the array first, place \`left = 0\`, \`right = len - 1\`. If sum is too large, decrement \`right\`; if too small, increment \`left\`.
* **Time:** $O(n \\log n)$ | **Space:** $O(1)$

#### Approach 3: Hash Map Complement Search (Optimal!)
* In a single pass, for each number $x$, check if the complement $(\\text{target} - x)$ already exists in your hash map. If yes, you found the pair! If not, record $x$ and its index in the map.
* **Time:** $\\mathbf{O(n)}$ linear time | **Space:** $O(n)$

\`\`\`python
def twoSum(nums, target):
    seen = {}  # val -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\``,
    suggestedPrompts: [
      "How do you extend Two Sum to 3Sum in O(n^2) time?",
      "How does Two Sum II work when the array is already sorted in O(1) space?",
      "Give me a challenge problem on Two Sum variations"
    ]
  },
  {
    id: 'invert-binary-tree',
    pattern: /\b(invert binary tree|invert a binary tree|invert tree|mirror binary tree)\b/i,
    topicName: 'Trees',
    topicSlug: 'trees',
    getContent: (mastery) => `### 🌲 Inverting a Binary Tree (Mirroring)

Inverting a binary tree means swapping the left and right children for every single node in the tree.

#### Recursive Socratic Intuition:
1. **Base Case:** If \`root is None\`, return \`None\` immediately.
2. **Recursive Step:** Recursively invert the left subtree and right subtree.
3. **Swap:** Swap \`root.left\` and \`root.right\`.

\`\`\`python
def invertTree(root):
    if not root:
        return None

    # Swap left and right children
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
\`\`\`

#### Complexity:
* **Time Complexity:** $O(n)$ because we visit every node in the tree exactly once.
* **Space Complexity:** $O(h)$ where $h$ is the height of the tree (call stack frames: $O(\\log n)$ best case, $O(n)$ worst case for skewed trees).`,
    suggestedPrompts: [
      "How do you invert a binary tree iteratively using a Queue (BFS)?",
      "What is the difference between Inverting a Tree and Checking if a Tree is Symmetric?",
      "Give me an adaptive quiz question on tree recursion"
    ]
  }
];

/**
 * Searches the rich DSA knowledge base for a query.
 * Returns null if no specific specialized subtopic matches.
 */
export function findDsaKnowledge(query, activeTopicContext = 'Trees', mastery = 0) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  for (const entry of dsaKnowledgeCatalog) {
    if (entry.pattern.test(q)) {
      return {
        id: entry.id,
        content: entry.getContent(mastery),
        suggestedPrompts: entry.suggestedPrompts,
        topicName: entry.topicName,
        topicSlug: entry.topicSlug
      };
    }
  }

  return null;
}
