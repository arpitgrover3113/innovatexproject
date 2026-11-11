import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbStore } from './storage.js';
import { findDsaKnowledge } from './dsaKnowledgeBase.js';

export const getTutorStatus = () => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '');
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');

  if (hasGroq) {
    return {
      isConfigured: true,
      provider: 'groq',
      mode: 'Groq Cloud LPU (openai/gpt-oss-120b)',
      modelName: 'openai/gpt-oss-120b'
    };
  }

  if (hasGemini) {
    return {
      isConfigured: true,
      provider: 'gemini',
      mode: 'Google Gemini 3.5 AI Studio',
      modelName: 'gemini-3.5-flash-lite'
    };
  }

  return {
    isConfigured: false,
    provider: 'local',
    mode: 'Pedagogical Adaptive Fallback Engine',
    modelName: 'LearnLoop-Local-Heuristic-V1'
  };
};

async function callGroqChat({ apiKey, messages }) {
  const candidateModels = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'gemma2-9b-it',
    'mixtral-8x7b-32768'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning;
      if (content && content.trim() !== '') {
        return { content, model };
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Groq API] Model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error('All Groq candidate models failed');
}

/**
 * Detects if a user query explicitly targets a specific DSA topic or data structure.
 */
function detectTopicFromQuery(message) {
  if (!message) return null;
  const q = message.toLowerCase().trim();

  // First check if query matches a specialized subtopic (e.g. AVL tree, Dijkstra, Trie, Kadane, Monotonic Stack)
  const specialized = findDsaKnowledge(message);
  if (specialized) {
    return { slug: specialized.topicSlug, name: specialized.topicName, subFocus: specialized.id };
  }

  // 1. Stacks and Queues (Check queue first, then stack)
  if (/\b(queue|queues|fifo|deque|enqueue|dequeue)\b/i.test(q)) {
    return { slug: 'stacks-and-queues', name: 'Stacks and Queues', subFocus: 'queue' };
  }
  if (/\b(stack|stacks|lifo|push|pop|peek|monotonic stack|parentheses)\b/i.test(q) && !q.includes('stack overflow')) {
    return { slug: 'stacks-and-queues', name: 'Stacks and Queues', subFocus: 'stack' };
  }

  // 2. Linked Lists
  if (/\b(linked list|linked lists|linkedlist|node\.next|singly linked|doubly linked|sentinel node|dummy node|head node)\b/i.test(q)) {
    return { slug: 'linked-lists', name: 'Linked Lists', subFocus: 'linked-list' };
  }

  // 3. Binary Search
  if (/\b(binary search|bisect|bsearch|logarithmic search|search space|lower_bound|upper_bound)\b/i.test(q)) {
    return { slug: 'binary-search', name: 'Binary Search', subFocus: 'binary-search' };
  }

  // 4. Sorting
  if (/\b(sort|sorting|quicksort|mergesort|bubble sort|insertion sort|selection sort|heap sort)\b/i.test(q)) {
    return { slug: 'sorting', name: 'Sorting', subFocus: 'sorting' };
  }

  // 5. Trees
  if (/\b(tree|trees|bst|binary tree|inorder|preorder|postorder|lowest common ancestor|root node)\b/i.test(q)) {
    return { slug: 'trees', name: 'Trees', subFocus: 'trees' };
  }

  // 6. Dynamic Programming
  if (/\b(dynamic programming|dp|memoization|tabulation|knapsack|subproblem|optimal substructure)\b/i.test(q)) {
    return { slug: 'dynamic-programming', name: 'Dynamic Programming', subFocus: 'dp' };
  }

  // 7. Graphs
  if (/\b(graph|graphs|dijkstra|topological|adjacency|shortest path|cycle in graph)\b/i.test(q)) {
    return { slug: 'graphs', name: 'Graphs', subFocus: 'graphs' };
  }

  // 8. Arrays
  if (/\b(array|arrays|two pointer|sliding window|prefix sum|subarray|kadane)\b/i.test(q)) {
    return { slug: 'arrays', name: 'Arrays', subFocus: 'arrays' };
  }

  // 9. Strings
  if (/\b(string|strings|palindrome|anagram|substring|subsequence)\b/i.test(q)) {
    return { slug: 'strings', name: 'Strings', subFocus: 'strings' };
  }

  // 10. Recursion
  if (/\b(recursion|recursive|base case|call stack|stack overflow|recurrence)\b/i.test(q)) {
    return { slug: 'recursion', name: 'Recursion', subFocus: 'recursion' };
  }

  // 11. Complexity Analysis / Big-O
  if (/\b(big o|big-o|time complexity|space complexity|asymptotic|omega|theta)\b/i.test(q)) {
    return { slug: 'complexity', name: 'Complexity Analysis', subFocus: 'complexity' };
  }

  return null;
}

export const generateTutorResponse = async ({
  userId,
  message,
  topicContext = 'Recursion',
  conversationHistory = []
}) => {
  // 1. Fetch student's comprehensive mastery profile
  const progressList = await dbStore.getStudentProgress(userId);

  // 2. Identify if query specifically targets a DSA topic
  const detected = detectTopicFromQuery(message);
  const effectiveTopicSlug = detected ? detected.slug : topicSlugify(topicContext);
  const effectiveTopicName = detected ? detected.name : (topicContext || 'Recursion');
  const subFocus = detected ? detected.subFocus : null;

  // 3. Fetch progress for the effective topic
  const currentTopicProgress = await dbStore.getTopicProgress(userId, effectiveTopicSlug);

  const sortedByMastery = [...progressList].sort((a, b) => a.masteryScore - b.masteryScore);
  const weakestTopics = sortedByMastery.slice(0, 3).map(t => `${t.topicName} (${t.masteryScore}%)`);
  const strongestTopics = sortedByMastery.slice(-3).reverse().map(t => `${t.topicName} (${t.masteryScore}%)`);
  const recentMisconceptions = currentTopicProgress.recentMisconceptions || [];

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = `You are LearnLoop AI, a world-class adaptive personal Socratic tutor for Computer Science and Data Structures & Algorithms.
Student's real-time cognitive profile:
- Active Topic Context: ${effectiveTopicName} (Current Mastery: ${currentTopicProgress.masteryScore}%)
- Weakest Knowledge Areas: ${weakestTopics.join(', ')}
- Strongest Knowledge Areas: ${strongestTopics.join(', ')}
- Recent Identified Misconceptions: ${recentMisconceptions.length ? recentMisconceptions.join('; ') : 'None logged yet'}

CORE BEHAVIOR & PEDAGOGY:
1. DIRECT, ACCURATE & RELEVANT: Always answer the student's exact question, query, or prompt directly and accurately.
   - If the student asks "tell me what is stack", explain Stacks thoroughly (LIFO principle, push/pop/peek, real-world examples, Python/JS code, time complexity).
   - If they ask about "AVL tree", explain AVL trees directly (self-balancing BST, balance factor, the 4 rotations LL/RR/LR/RL).
   - If they ask any general programming question, solve it with clear, correct code and explanations.
   - NEVER deflect to an unrelated topic (e.g. NEVER answer with Recursion when asked about Stacks, and NEVER give a generic Tree lecture when asked about AVL trees).
2. TYPOS & CASUAL INPUTS:
   - If the student inputs a single letter or typo (like "x", "asdf", "?"), respond realistically and warmly: ask them what they'd like to explore, or ask if they're referring to a variable or problem. NEVER assume an unrelated topic.
3. CONVERSATIONAL & ENGAGING: If the student says "hi", "how are you?", or asks casual greetings, respond warmly, naturally, and conversationally in a friendly first-person voice. Always be supportive, encouraging, and invite them into whatever they want to learn.
4. ADAPTIVE DEPTH:
   - If mastery < 50%: Use concrete real-world analogies, step-by-step visual stack traces, and emphasize base cases. Avoid premature complex optimizations.
   - If mastery > 75%: Encourage discussions of asymptotic tight bounds, invariants, and tricky edge cases.
5. CODE & STRUCTURE: Use clean markdown, bolding, bullet points, and short readable code snippets (Python/JavaScript).
6. SUGGESTED PROMPTS: Conclude your ENTIRE response with exactly 3 relevant follow-up prompts formatted strictly as:
---SUGGESTED_PROMPTS---
Prompt 1
Prompt 2
Prompt 3`;

  // --- TIER 1: GROQ LPU (Ultra-Low Latency & High Conversational Quality) ---
  if (groqKey && groqKey.trim() !== '' && groqKey !== 'YOUR_GROQ_API_KEY') {
    try {
      const groqMessages = [
        { role: 'system', content: systemInstruction }
      ];

      if (conversationHistory.length > 0) {
        conversationHistory.slice(-6).forEach(msg => {
          groqMessages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        });
      }

      groqMessages.push({ role: 'user', content: message });

      const groqRes = await callGroqChat({ apiKey: groqKey, messages: groqMessages });
      const parsed = parsePromptsAndContent(groqRes.content, effectiveTopicName);

      return {
        content: parsed.content,
        suggestedPrompts: parsed.suggestedPrompts,
        provider: 'groq',
        model: groqRes.model,
        isFallback: false,
        topicContext: effectiveTopicName,
        studentMastery: currentTopicProgress.masteryScore
      };
    } catch (groqError) {
      console.warn('[Groq API] Call failed:', groqError.message);
      console.log('[Groq API] Falling back to Gemini / Pedagogical Engine.');
    }
  }

  // --- TIER 2: GEMINI API ---
  if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      let promptText = `${systemInstruction}\n\n`;
      if (conversationHistory.length > 0) {
        promptText += `Recent Conversation History:\n`;
        conversationHistory.slice(-4).forEach(msg => {
          promptText += `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}\n`;
        });
      }
      promptText += `\nStudent: ${message}\nTutor:`;

      const genAI = new GoogleGenerativeAI(geminiKey);
      const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
      let result = null;
      let usedModel = 'gemini-1.5-flash';

      for (const modelCandidate of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelCandidate });
          result = await model.generateContent(promptText);
          if (result) {
            usedModel = modelCandidate;
            break;
          }
        } catch (mErr) {
          console.warn(`[Gemini API] Model ${modelCandidate} unavailable:`, mErr.message);
        }
      }

      if (result) {
        const response = await result.response;
        const fullText = response.text();
        const parsed = parsePromptsAndContent(fullText, effectiveTopicName);

        return {
          content: parsed.content,
          suggestedPrompts: parsed.suggestedPrompts,
          provider: 'gemini',
          model: usedModel,
          isFallback: false,
          topicContext: effectiveTopicName,
          studentMastery: currentTopicProgress.masteryScore
        };
      }
    } catch (apiError) {
      console.warn('[Gemini API] Call failed:', apiError.message);
    }
  }

  // --- TIER 3: HIGH-FIDELITY PEDAGOGICAL FALLBACK ENGINE ---
  console.log('[AI Tutor] Using Resilient Pedagogical Fallback Engine.');
  return generatePedagogicalFallback({
    message,
    effectiveTopicName,
    effectiveTopicSlug,
    subFocus,
    isExplicitTopicMatch: Boolean(detected),
    currentProgress: currentTopicProgress,
    weakestTopics,
    strongestTopics,
    recentMisconceptions,
    progressList
  });
};

function parsePromptsAndContent(fullText, topicContext) {
  let content = fullText;
  let suggestedPrompts = [
    `Give me a practice question on ${topicContext}`,
    `Show a visual dry-run of this concept`,
    `How does this connect to my learning roadmap?`
  ];

  if (fullText.includes('---SUGGESTED_PROMPTS---')) {
    const parts = fullText.split('---SUGGESTED_PROMPTS---');
    content = parts[0].trim();
    const extracted = parts[1]
      .split('\n')
      .map(s => s.trim().replace(/^[-*0-9.]+\s*/, ''))
      .filter(Boolean);
    if (extracted.length > 0) {
      suggestedPrompts = extracted.slice(0, 3);
    }
  }

  return { content, suggestedPrompts };
}

function topicSlugify(text) {
  if (!text) return 'recursion';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generatePedagogicalFallback({
  message,
  effectiveTopicName,
  effectiveTopicSlug,
  subFocus,
  isExplicitTopicMatch = false,
  currentProgress,
  weakestTopics,
  strongestTopics,
  recentMisconceptions,
  progressList = []
}) {
  const cleanMsg = (message || '').trim();
  const query = cleanMsg.toLowerCase();
  const mastery = currentProgress.masteryScore;
  const topicName = effectiveTopicName || currentProgress.topicName || 'Recursion';

  let content = '';
  let suggestedPrompts = [];

  // 1. Gibberish / Typo / Single-Character Input Detection (e.g., "x", "asdf", "?", "...")
  const isGibberishOrTooShort = 
    cleanMsg.length <= 2 || 
    /^[b-hj-z0-9]$/i.test(cleanMsg) || 
    /^[!@#$%^&*()_+=\-[\]{};:'",.<>?/\\|~`\s]+$/.test(cleanMsg) ||
    /^(asdf|qwerty|zxcv|test|xyz|abc|foo|bar|baz|blah|idk|dunno)$/i.test(cleanMsg);

  if (isGibberishOrTooShort && !['hi', 'dp', 'ok', 'no'].includes(query)) {
    return {
      content: `### 🤔 I didn't quite catch that

You entered: \`${cleanMsg}\`

Could you please clarify what you'd like to explore?
* Were you referring to a specific variable (like \`${cleanMsg}\`), an algorithm, or a practice challenge?
* You can ask me to **explain a concept** (e.g. *Stacks, AVL trees, Binary Search, Dijkstra*), **give you a challenge problem**, or **check your weakest topics**!`,
      suggestedPrompts: [
        `Explain the core concepts of ${topicName}`,
        `Give me a practice problem on ${topicName}`,
        `What are my weakest topics right now?`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 2. Conversational Acknowledgments (e.g., "thanks", "got it", "cool", "awesome")
  if (query.match(/^(thanks|thank you|thx|ty|great|awesome|cool|got it|understood|perfect|nice|well done)\b/i)) {
    return {
      content: `### 😊 You're very welcome!

Keep up the fantastic momentum! Algorithmic mastery is built through consistent, step-by-step intuition building.

Where would you like to steer our session next?
* **Test your understanding:** Ask for an adaptive practice challenge on **${topicName}**.
* **Deepen intuition:** Ask for a visual dry-run, code trace, or edge cases.
* **Explore another topic:** Ask about Stacks, Linked Lists, Trees, Graphs, or Dynamic Programming!`,
      suggestedPrompts: [
        `Give me an adaptive practice problem on ${topicName}`,
        `What are the most common interview traps in ${topicName}?`,
        `What should I study next on my roadmap?`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 3. Conversational Confirmations (e.g., "ok", "okay", "sure", "fine", "alright")
  if (query.match(/^(ok|okay|sure|fine|alright|yep|yeah|yes|ready)\b/i)) {
    return {
      content: `### 👍 Ready when you are!

I'm loaded with your active learning profile (Active topic: **${topicName}**, Mastery: **${mastery}%**).

How can I help you right now?
* Ask me to **explain an algorithm or data structure** (e.g. *"Explain AVL tree rotations"* or *"What is a monotonic stack?"*).
* Ask for a **calibrated practice question**.
* Ask about your **weakest topics** and study roadmap.`,
      suggestedPrompts: [
        `Explain the fundamentals of ${topicName}`,
        `Give me a challenge question`,
        `What are my weakest topics right now?`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 4. Conversational Farewells (e.g., "bye", "goodbye", "cya")
  if (query.match(/^(bye|goodbye|see you|cya|exit|quit|later)\b/i)) {
    return {
      content: `### 👋 Great session today!

Your learning progress and mastery telemetry are safely recorded. Whenever you return, we can pick up right where you left off. Happy coding and see you soon!`,
      suggestedPrompts: [
        `Review my dashboard summary`,
        `Open my learning roadmap`,
        `Quick 1-question check before I go`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 5. Natural Greeting Handling
  if (query.match(/^(hi|hello|hey|greetings|howdy|sup|good morning|good afternoon|good evening)\b/i) || query.includes('who are you') || query.includes('how are you')) {
    return {
      content: `### 👋 Hello! I'm your LearnLoop AI Socratic Tutor

I'm your personal Computer Science and DSA coach. I calibrate my explanations to your exact mastery profile in real time!

Right now, we are exploring **${topicName}** (Your current mastery: **${mastery}%**).

How would you like to proceed?
* **Understand the concept:** Ask me to explain how ${topicName} works with a step-by-step example.
* **Test yourself:** Ask me for a calibrated challenge question.
* **View your bottlenecks:** Ask me about your weakest topics and what to study next.`,
      suggestedPrompts: [
        `Explain ${topicName} with a visual example`,
        `Give me an adaptive practice problem on ${topicName}`,
        `What are my weakest topics right now?`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 6. General Interview Preparation Advice
  if (query.includes('interview') || query.includes('prepare') || query.includes('faang') || query.includes('leetcode')) {
    return {
      content: `### 🎯 How to Prepare for Tech & FAANG Coding Interviews

Cracking technical interviews is not about memorizing 500 random problems — it is about mastering **core algorithmic patterns**:

#### The 4-Pillar Strategy:
1. **Master the 10 Core DSA Primitives:**
   * Contiguous: Arrays, Two Pointers, Sliding Window
   * Linear: Linked Lists, Stacks, Queues
   * Hierarchical: Binary Search Trees, Heaps, Tries
   * Non-linear: Graphs (BFS/DFS, Dijkstra), Dynamic Programming
2. **Solve by Pattern, Not by Problem:**
   * Subarray with contiguous constraints? $\\to$ **Sliding Window**
   * Sorted array searching? $\\to$ **Binary Search**
   * Next greater or histogram? $\\to$ **Monotonic Stack**
   * Shortest path unweighted? $\\to$ **BFS**
   * Overlapping choices? $\\to$ **Dynamic Programming**
3. **The 45-Minute Interview Breakdown:**
   * Minutes 0–5: Ask clarifying questions & define constraints ($N$, ranges).
   * Minutes 5–15: State the brute force baseline, then identify the bottleneck.
   * Minutes 15–30: Write clean, modular code with descriptive variable names.
   * Minutes 30–40: Dry run edge cases manually (empty input, single element, duplicates).
   * Minutes 40–45: State tight asymptotic time and space bounds ($O(N)$).`,
      suggestedPrompts: [
        `What are the most common interview patterns in ${topicName}?`,
        `Give me an adaptive interview question`,
        `What are my weakest topics right now?`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 7. Programming Language Comparison for DSA
  if (query.includes('python vs') || query.includes('c++ vs') || query.includes('best language') || query.includes('which language')) {
    return {
      content: `### 💻 Best Programming Language for DSA & Interviews

All top tech companies (Google, Meta, Amazon, Microsoft) allow you to choose any mainstream language for DSA interviews. Here is how they compare:

* **Python (Recommended for Speed):**
  * *Pros:* Minimal boilerplate, built-in dynamic sizing, slicing, clean syntax (\`collections.deque\`, \`heapq\`, \`bisect\`). You write solutions 2x faster, leaving more time for discussion!
  * *Cons:* Dynamic typing requires care; recursion limit (\`sys.setrecursionlimit\`).
* **C++ (Industry Standard for Competitive Programming):**
  * *Pros:* Ultra-fast runtime, rich Standard Template Library (STL: \`std::vector\`, \`std::priority_queue\`, \`std::map\` which is an internal Red-Black tree!).
  * *Cons:* Verbose syntax, manual memory awareness, pointer traps.
* **Java:**
  * *Pros:* Strong typing, robust collections (\`ArrayList\`, \`HashMap\`, \`TreeMap\`), ubiquitous in enterprise.
  * *Cons:* Verbose syntax.

> **Verdict:** Use **Python** if your goal is rapid interview problem solving, or **C++** if you love low-level performance and STL containers!`,
      suggestedPrompts: [
        "How do you implement a min-heap in Python?",
        "Explain C++ STL containers used in DSA",
        `Give me a practice problem on ${topicName}`
      ],
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 2. Student Answer Verification (e.g., "Option B", "I think the answer is Option A")
  const optionMatch = query.match(/\boption\s*([a-d])\b/i);
  if (optionMatch) {
    const selectedOption = optionMatch[1].toUpperCase();
    
    // Evaluate based on topic challenge
    let isCorrect = false;
    let explanationText = '';

    if (effectiveTopicSlug === 'stacks-and-queues') {
      isCorrect = selectedOption === 'B';
      explanationText = isCorrect
        ? 'Spot on! A **Stack** provides LIFO ordering. When you encounter an opening bracket like `(`, `[`, `{`, you push it onto the stack. When a closing bracket arrives, popping the top element immediately gives you the most recently opened bracket to verify the match!'
        : 'Not quite. Think about nested brackets like `"{[()]}"`. The innermost bracket `(` was opened most recently, but must be closed *first*. A FIFO queue would process the outermost `{` first, failing the nesting order. That is why a LIFO **Stack** is required!';
    } else if (effectiveTopicSlug === 'binary-search') {
      isCorrect = selectedOption === 'A';
      explanationText = isCorrect
        ? 'Excellent calculation! In an array of length 7 (indices 0 to 6), `low = 0`, `high = 6`, and `mid = 0 + (6 - 0) // 2 = 3`. `arr[3]` is `8`!'
        : 'Check your midpoint indexing. Since indices run from 0 to `len - 1` (0 to 6), `high = 6`. Using integer division: `0 + (6 - 0) // 2 = 3`, where `arr[3] == 8`.';
    } else if (effectiveTopicSlug === 'linked-lists') {
      isCorrect = selectedOption === 'A';
      explanationText = isCorrect
        ? 'Correct! Fast moves 2 steps while slow moves 1 step per cycle. Relative velocity is $2 - 1 = 1$ step per turn. Within a cycle of length $C$, the relative distance closes by exactly 1 on every step until collision!'
        : 'Notice the relative movement: fast moves 2 steps while slow moves 1 step. Every iteration, fast gains exactly 1 step on slow, steadily closing the gap until collision.';
    } else if (effectiveTopicSlug === 'trees') {
      isCorrect = selectedOption === 'B';
      explanationText = isCorrect
        ? 'Brilliant! In-order traversal visits `Left Subtree -> Root -> Right Subtree`. In a valid BST, this is mathematically guaranteed to output elements in **strictly ascending sorted order**: `[1, 3, 6, 8, 10]`!'
        : 'Remember that In-order traversal traverses Left -> Root -> Right. On a Binary Search Tree (BST), this always yields the elements sorted in ascending order.';
    } else if (effectiveTopicSlug === 'dynamic-programming') {
      isCorrect = selectedOption === 'B';
      explanationText = isCorrect
        ? 'Accurate! To reach step `i`, your last jump was either a 1-step jump from `i-1` or a 2-step jump from `i-2`. Thus `dp[i] = dp[i-1] + dp[i-2]` (the Fibonacci recurrence relation)!'
        : 'Consider the decision boundary: to reach step `i`, you could only have arrived from step `i - 1` (using a 1-step climb) or step `i - 2` (using a 2-step climb). Total ways is the sum: `dp[i] = dp[i-1] + dp[i-2]`.';
    } else {
      isCorrect = selectedOption === 'A';
      explanationText = isCorrect
        ? 'Correct! If `len(s) <= 1` (empty string or single character), reversing it produces itself immediately, providing the termination brake pedal!'
        : 'Think about when recursion must halt: reversing a 0-character or 1-character string requires zero work — that is the base case!';
    }

    content = `### ${isCorrect ? '✅ Correct Answer!' : '❌ Let\'s Review That Choice'}

**You selected Option ${selectedOption}.**

${explanationText}

> **Cognitive Takeaway:** Formulating the invariant clearly turns tricky interview problems into straightforward step-by-step executions.`;

    suggestedPrompts = [
      `Give me another challenge question on ${topicName}`,
      `Explain the code implementation for this`,
      "What are the common edge cases to watch out for?"
    ];

    return {
      content,
      suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 9. Hints / Stuck Assistance (Checked before practice query)
  if (query.match(/\b(hint|clue|stuck|give me a hint|need a hint|show hint)\b/i)) {
    content = `### 💡 Pedagogical Hint for ${topicName}

Here is a progressive 3-step hint to unlock the problem without spoiling the answer:

1. **Identify the smallest valid input:** What happens if the data structure has 0 or 1 element? That is your base case or boundary condition.
2. **Examine state transitions:** Trace which pointer, index, or frame moves forward on each step. Are you reducing the remaining problem size?
3. **Verify invariants:** What must remain true before and after each operation (e.g., LIFO order in a stack, monotonic ordering in binary search, BST property in trees)?`;

    suggestedPrompts = [
      `Show me the full solution with explanation for ${topicName}`,
      "Give me another progressive hint",
      "Let's try a different challenge problem"
    ];

    return {
      content,
      suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 4. Practice / Challenge Request
  if (query.includes('practice') || query.includes('question') || query.includes('quiz') || query.includes('test') || query.includes('challenge') || query.includes('problem')) {
    if (effectiveTopicSlug === 'stacks-and-queues' || subFocus === 'stack' || subFocus === 'queue') {
      content = `### 🎯 Calibrated Practice Challenge: Stacks and Queues

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> Given a string containing bracket characters \`"()[]{}"\`, design an algorithm to determine if the input string is valid.
> A string is valid if open brackets are closed by the same type of bracket in the correct reverse order.

**Which data structure and operation order is strictly required to solve this in $O(n)$ time?**

* **Option A:** A Queue, enqueuing opening brackets and dequeuing on matching closing brackets.
* **Option B:** A Stack, pushing opening brackets and popping the top element to verify a match when encountering a closing bracket.
* **Option C:** A standard Hash Set storing seen characters.
* **Option D:** Two pointers moving inward from both ends.

**Tutor Guidance:** Think about nested brackets like \`"{[()]}"\`. Which bracket must be closed first: the oldest opened, or the most recently opened?`;

      suggestedPrompts = [
        "I think the answer is Option B",
        "Give me a hint for this problem",
        "Show me the Python code solution for Valid Parentheses"
      ];
    } else if (effectiveTopicSlug === 'binary-search') {
      content = `### 🎯 Calibrated Practice Challenge: Binary Search

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> You have a sorted array \`[2, 4, 6, 8, 10, 12, 14]\` and you are searching for target \`10\` using standard binary search.
> What are the values of \`low\`, \`high\`, and \`mid\` on the very first comparison?

* **Option A:** \`low = 0\`, \`high = 6\`, \`mid = 3\` (value = 8)
* **Option B:** \`low = 0\`, \`high = 7\`, \`mid = 3\` (value = 8)
* **Option C:** \`low = 0\`, \`high = 6\`, \`mid = 4\` (value = 10)
* **Option D:** \`low = 1\`, \`high = 7\`, \`mid = 4\` (value = 10)

**Tutor Guidance:** Recall that array indices are zero-based, and \`mid = low + (high - low) // 2\`.`;

      suggestedPrompts = [
        "I think the answer is Option A",
        "Why do we use low + (high - low) // 2?",
        "Show me the next step in the binary search trace"
      ];
    } else if (effectiveTopicSlug === 'linked-lists') {
      content = `### 🎯 Calibrated Practice Challenge: Linked Lists

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> In Floyd's Cycle Detection algorithm (Tortoise and Hare), the slow pointer advances 1 step per iteration, and the fast pointer advances 2 steps.
> If a cycle of length $C$ exists in the linked list, why are the two pointers guaranteed to meet?

* **Option A:** The relative distance between them decreases by 1 on every step within the cycle until it reaches 0.
* **Option B:** The fast pointer loops infinitely while the slow pointer pauses.
* **Option C:** They only meet if the list has an even number of total nodes.
* **Option D:** Pointers jump randomly across node addresses.

**Tutor Guidance:** Relative speed between 2 steps/sec and 1 step/sec is 1 step/sec. What happens to the gap between them modulo the cycle length?`;

      suggestedPrompts = [
        "I think the answer is Option A",
        "How do you find the exact start node of the cycle?",
        "Give me another linked list challenge"
      ];
    } else if (effectiveTopicSlug === 'trees') {
      content = `### 🎯 Calibrated Practice Challenge: Trees

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> Given a Binary Search Tree (BST) with root = 8, left child = 3, right child = 10, left-left child = 1, left-right child = 6.
> What is the exact output of an **In-order traversal** (\`inorder(root)\`)?

* **Option A:** \`[8, 3, 1, 6, 10]\`
* **Option B:** \`[1, 3, 6, 8, 10]\`
* **Option C:** \`[1, 6, 3, 10, 8]\`
* **Option D:** \`[10, 8, 6, 3, 1]\`

**Tutor Guidance:** In-order traversal visits: Left Subtree -> Current Root -> Right Subtree.`;

      suggestedPrompts = [
        "I think the answer is Option B",
        "Why is BST in-order traversal always sorted?",
        "Show me how to compute maximum tree depth"
      ];
    } else if (effectiveTopicSlug === 'dynamic-programming') {
      content = `### 🎯 Calibrated Practice Challenge: Dynamic Programming

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> You are climbing a staircase with $n$ steps. Each time you can climb either 1 or 2 steps.
> What is the recurrence relation for the total number of distinct ways \`dp[i]\` to reach step \`i\`?

* **Option A:** \`dp[i] = dp[i-1] * dp[i-2]\`
* **Option B:** \`dp[i] = dp[i-1] + dp[i-2]\`
* **Option C:** \`dp[i] = max(dp[i-1], dp[i-2]) + 1\`
* **Option D:** \`dp[i] = 2 * dp[i-1]\`

**Tutor Guidance:** To land on step \`i\`, where could your final step have come from? (Step \`i - 1\` with a 1-step jump, or step \`i - 2\` with a 2-step jump).`;

      suggestedPrompts = [
        "I think the answer is Option B",
        "How do you solve this with O(1) space?",
        "Show me the memoization code for Climbing Stairs"
      ];
    } else {
      content = `### 🎯 Calibrated Practice Challenge: ${topicName}

Based on your current topic progress (**${mastery}% mastery**), here is your adaptive challenge:

**Problem Scenario:**
> You are tasked with writing a recursive function to reverse a string \`s\`. 
> What is the base case condition, and what is returned when that condition triggers?

* **Option A:** When \`len(s) <= 1\`, return \`s\` immediately without further recursion.
* **Option B:** When \`len(s) == 0\`, throw an error.
* **Option C:** Recursion cannot reverse a string.
* **Option D:** When \`s[0] == s[-1]\`, return true.

**Tutor Guidance:** Try to trace what happens when \`s = "a"\` or \`s = ""\`. When you're ready, let me know your answer or ask for a hint!`;

      suggestedPrompts = [
        "I think the answer is Option A",
        "Give me a hint for this problem",
        "Show me how the call stack unwinds"
      ];
    }

    return {
      content,
      suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 5. Misconceptions / Bottlenecks / Roadmap Analysis
  if (query.includes('weak') || query.includes('gap') || query.includes('roadmap') || query.includes('bottleneck') || query.includes('study next')) {
    content = `### 📊 Diagnostic Gap Analysis

Here is what your actual performance telemetry reveals:

* **Weakest Areas Needing Attention:** ${weakestTopics.join(', ')}
* **Your Strong Foundations:** ${strongestTopics.join(', ')}
* **Key Misconception Flagged:** ${recentMisconceptions[0] || 'Confusing state memory allocations with linear loop steps'}

#### Recommended Action Plan:
1. Strengthen **${weakestTopics[0] ? weakestTopics[0].split(' ')[0] : 'Recursion'}** first to build intuitive memory modeling.
2. Complete 3 targeted adaptive questions focusing on invariants and boundary cases.
3. Once your foundational topics hit **≥ 60%**, your dynamic roadmap will automatically unlock advanced hierarchical modules!`;

    suggestedPrompts = [
      `Start practicing ${topicName}`,
      "Open my dynamic learning roadmap",
      "What are the most common interview traps in my weak topics?"
    ];

    return {
      content,
      suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 6. Check Specific Subtopics Knowledge Base (e.g. AVL tree, Red-Black tree, Trie, Heap, Dijkstra, Monotonic Stack, etc.)
  const knowledgeMatch = findDsaKnowledge(message, topicName, mastery);
  if (knowledgeMatch) {
    return {
      content: knowledgeMatch.content,
      suggestedPrompts: knowledgeMatch.suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: knowledgeMatch.topicName,
      studentMastery: mastery
    };
  }

  // 7. General Concept Explanations:
  // Only execute topic lecture if query explicitly asks about this topic!
  const isAskingTopicExplanation = 
    isExplicitTopicMatch || 
    Boolean(subFocus) || 
    (query.match(/\b(explain|what is|how does|understand|tell me about|deep dive|teach me|overview|give me an example)\b/i) && 
     (query.includes(effectiveTopicSlug.replace('-', ' ')) || query.includes('this') || query.includes('concept') || query.includes('it') || query.includes('here')));

  if (isAskingTopicExplanation) {
    if (effectiveTopicSlug === 'stacks-and-queues' || subFocus === 'stack' || subFocus === 'queue') {
    if (subFocus === 'queue' || query.includes('queue') || query.includes('fifo') || query.includes('deque')) {
      content = `### 🎟️ Understanding Queues (Tailored to your ${mastery}% mastery)

Since your current Stacks & Queues mastery is **${mastery}%**, let's build the intuition with a concrete mental model.

A **Queue** is a linear data structure adhering strictly to the **FIFO (First-In, First-Out)** principle: the first element added is the first one processed — exactly like people standing in line at a ticket counter.

#### Core Operations:
1. **\`enqueue(x)\` (Push to Back):** Adds an element to the rear of the queue in **$O(1)$** time.
2. **\`dequeue()\` (Pop from Front):** Removes and returns the element at the front of the queue in **$O(1)$** time.
3. **\`peek()\` / \`front()\`:** Inspects the front element without removing it in **$O(1)$** time.
4. **\`isEmpty()\`:** Verifies whether elements remain in the queue in **$O(1)$** time.

#### Python Implementation with \`collections.deque\`:
\`\`\`python
from collections import deque

queue = deque()
queue.append("Task A")      # Enqueue -> O(1)
queue.append("Task B")      # Enqueue -> O(1)
front_item = queue.popleft() # Dequeue -> "Task A" in O(1)
\`\`\`

> **Key Interview Tip:** Never use a standard Python list (\`list.pop(0)\`) as a queue! Removing from index 0 shifts every subsequent element in memory, degrading performance to **$O(n)$**. Always use a doubly-linked structure like \`deque\`.

#### Where Queues Are Crucial in DSA:
* **Breadth-First Search (BFS):** Exploring trees and graphs level by level.
* **Sliding Window Minimum / Maximum:** Monotonic deques for maintaining window extremums in $O(n)$ total time.
* **CPU Task Scheduling & Event Loops:** Processing asynchronous jobs in arrival order.`;

      suggestedPrompts = [
        "Why is collections.deque preferred over a Python list for queues?",
        "How is a Queue used in Breadth-First Search (BFS)?",
        "How do you implement a Queue using two Stacks?"
      ];
    } else {
      // Stack explanation
      content = `### 🥞 Understanding Stacks (Tailored to your ${mastery}% mastery)

Since your current Stacks & Queues mastery is **${mastery}%**, let's build the intuition before touching advanced monotonic stack problems.

A **Stack** is a linear data structure adhering strictly to the **LIFO (Last-In, First-Out)** principle: the last element added to the stack is the very first one to be removed — like a stack of cafeteria trays or a spring-loaded plate dispenser.

#### Core Operations:
1. **\`push(x)\`:** Places an item onto the top of the stack in **$O(1)$** time.
2. **\`pop()\`:** Removes and returns the top item in **$O(1)$** time.
3. **\`peek()\` / \`top()\`:** Inspects the top item without removing it in **$O(1)$** time.
4. **\`isEmpty()\`:** Checks if the stack has zero items in **$O(1)$** time.

#### Visualizing LIFO Flow:
\`\`\`text
push(10)      push(20)      push(30)       pop() -> returns 30
 [10]   -->    [20]   -->    [30]   -->    [20]
               [10]          [20]          [10]
                             [10]
\`\`\`

#### Python Implementation:
\`\`\`python
stack = []
stack.append(10)      # push -> O(1)
stack.append(20)      # push -> O(1)
top_val = stack[-1]   # peek -> 20 in O(1)
removed = stack.pop() # pop -> 20 in O(1)
\`\`\`

#### Real-World & System Applications:
* **Call Stack Execution:** When your program calls nested functions or recursive methods, each function frame is pushed onto the system call stack.
* **Undo / Redo Buffers:** Every action you take in an IDE or text editor is pushed to an undo stack.
* **Syntax Parsing & Valid Parentheses:** Matching opening braces \`(\`, \`[\`, \`{\` with their corresponding closing tokens.
* **Monotonic Stacks:** Solving "Next Greater Element" and "Largest Rectangle in Histogram" in linear $O(n)$ time.`;

      suggestedPrompts = [
        "How does a Monotonic Stack solve Next Greater Element?",
        "How do you solve the Valid Parentheses problem with a Stack?",
        "What is the difference between a Call Stack and a Data Stack?"
      ];
    }
  } else if (effectiveTopicSlug === 'linked-lists') {
    content = `### 🔗 Understanding Linked Lists (Tailored to your ${mastery}% mastery)

Since your current Linked Lists mastery is **${mastery}%**, let's build pointer intuition.

Unlike Arrays, which live in a **contiguous chunk of physical memory**, a **Linked List** is a sequence of independent node objects scattered throughout memory, where each node explicitly holds:
1. **Value (\`val\`):** The payload data.
2. **Pointer (\`next\`):** A memory reference pointing to the next node in the chain.

#### Core Trade-Offs:
* **Insertion / Deletion at Head:** **$O(1)$** (just reassign pointers — zero elements need shifting!).
* **Random Access by Index:** **$O(n)$** (you cannot jump directly to index \`i\`; you must traverse step-by-step from \`head\`).

#### Reversing a Singly-Linked List:
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next     # 1. Save future reference
        curr.next = prev    # 2. Reverse pointer backwards
        prev = curr         # 3. Advance prev forward
        curr = nxt          # 4. Advance curr forward
    return prev  # New head of reversed list
\`\`\`

> **Essential Patterns:**
> * **Sentinel / Dummy Head Node:** Eliminates edge cases when inserting or deleting at the head (\`dummy = ListNode(0, head)\`).
> * **Fast & Slow Pointers (Floyd's Cycle Finding):** Detecting loops or finding the middle node in one single pass.`;

    suggestedPrompts = [
      "How does Floyd's Tortoise and Hare algorithm detect cycles?",
      "Why use a dummy head node in linked list problems?",
      "How do you find the middle node of a linked list in one pass?"
    ];
  } else if (effectiveTopicSlug === 'binary-search') {
    content = `### 🔍 Understanding Binary Search (Tailored to your ${mastery}% mastery)

Since your current Binary Search mastery is **${mastery}%**, let's inspect the logarithmic divide-and-conquer mechanics.

Binary Search is an **$O(\log n)$ search algorithm** that eliminates half of the candidate search space on every comparison.

#### The Golden Requirement:
Binary search requires a **monotonic condition** (most commonly: an array sorted in non-decreasing order).

#### The 3 Golden Invariants:
1. **Pointers:** \`low\` points to the start of the valid search space, \`high\` points to the end.
2. **Midpoint Calculation:** Always use \`mid = low + (high - low) // 2\` instead of \`(low + high) // 2\` to eliminate integer overflow in fixed-width languages (C++/Java).
3. **Space Reduction:** If \`arr[mid] < target\`, the target CANNOT be in \`[low, mid]\`, so adjust \`low = mid + 1\`.

#### Standard Template (Python):
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid  # Found target index
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1  # Target does not exist
\`\`\`

> **Advanced Frontier:** Binary search is not just for finding array elements — you can binary search on **Answer Spaces** (e.g. "Koko Eating Bananas", "Capacity to Ship Packages Within D Days").`;

    suggestedPrompts = [
      "Why does binary search achieve O(log n) time?",
      "How do you find the first and last position of a duplicate element?",
      "How does Binary Search on Answer Spaces work?"
    ];
  } else if (effectiveTopicSlug === 'trees') {
    content = `### 🌲 Tree Traversals & Hierarchical Structures (Tailored to your ${mastery}% mastery)

Since your current Trees mastery is **${mastery}%**, let's explore hierarchical recursion.

Trees are non-linear, hierarchical data structures. A **Binary Tree** consists of nodes where each node has at most two children: a **left child** and a **right child**.

#### Binary Search Tree (BST) Invariant:
For every node \`X\`:
* All values in the **Left Subtree** must be strictly **$< X.val$**.
* All values in the **Right Subtree** must be strictly **$> X.val$**.

#### The 3 Fundamental Depth-First Traversals:
1. **In-order (Left -> Root -> Right):** Crucial property: Running an In-order traversal on a BST visits nodes in **strictly sorted ascending order**!
2. **Pre-order (Root -> Left -> Right):** Evaluates root first. Perfect for serializing or cloning trees.
3. **Post-order (Left -> Right -> Root):** Children report up to parent. Essential for calculating tree height, bottom-up validation, or deleting nodes.

\`\`\`python
def inorder(root):
    if not root:
        return  # Base Case
    inorder(root.left)    # Visit Left Subtree
    print(root.val)       # Process Current Root
    inorder(root.right)   # Visit Right Subtree
\`\`\``;

    suggestedPrompts = [
      "How do I calculate the maximum depth of a binary tree?",
      "What is the difference between BFS and DFS in trees?",
      "How do you find the Lowest Common Ancestor (LCA) in a BST?"
    ];
  } else if (effectiveTopicSlug === 'dynamic-programming') {
    content = `### ⚡ Dynamic Programming Demystified (Tailored to your ${mastery}% mastery)

Since your current Dynamic Programming mastery is **${mastery}%**, let's demystify DP.

Dynamic Programming is simply **Careful Recursion with a Memory Notebook**.

#### The Two Pillars of DP:
1. **Overlapping Subproblems:** The exact same subproblems are re-computed repeatedly (e.g. \`fib(5)\` computes \`fib(3)\` twice).
2. **Optimal Substructure:** The optimal solution to the overall problem can be assembled from optimal solutions of its subproblems.

#### The 3 Evolutionary Phases:
1. **Brute Force Recursion:** $O(2^n)$ exponential time.
2. **Top-Down Memoization:** Keep the recursive flow, but cache results in a hash table or array. Time plummets to $O(n)$!
3. **Bottom-Up Tabulation:** Eliminate recursion call-stack overhead by filling a table iteratively from base cases up.

\`\`\`python
# Top-Down Memoization for Fibonacci
memo = {}
def fib(n):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
\`\`\``;

    suggestedPrompts = [
      "Can you demonstrate memoization on 0/1 Knapsack?",
      "What is the difference between Tabulation and Memoization?",
      "How do I identify state variables and transitions in DP?"
    ];
  } else if (effectiveTopicSlug === 'graphs') {
    content = `### 🕸️ Understanding Graphs & Traversals (Tailored to your ${mastery}% mastery)

Since your current Graphs mastery is **${mastery}%**, let's build network intuition.

A **Graph** $G = (V, E)$ consists of a set of **Vertices** (nodes) connected by **Edges** (relationships).
* Edges can be **Directed** (one-way street) or **Undirected** (two-way street).
* Edges can be **Weighted** (cost, distance) or **Unweighted**.

#### Representation in Memory:
* **Adjacency List (Preferred):** A dictionary mapping each node to a list of its neighbors. Space complexity: $O(V + E)$.
* **Adjacency Matrix:** A 2D grid where \`grid[u][v] = 1\` indicates an edge. Space complexity: $O(V^2)$.

#### The Two Core Graph Traversals:
1. **Breadth-First Search (BFS):** Uses a **Queue**. Visits neighbors level by level. Guaranteed to find the **shortest path in unweighted graphs**!
2. **Depth-First Search (DFS):** Uses a **Stack** or **Recursion**. Dives deep along each branch until a dead end. Used for cycle detection, topological sorting, and connected components.

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        print(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\``;

    suggestedPrompts = [
      "What is the difference between BFS and DFS in a graph?",
      "How does Dijkstra's algorithm work with a Min-Heap?",
      "How do I detect a cycle in a directed graph?"
    ];
  } else if (effectiveTopicSlug === 'arrays') {
    content = `### 📊 Understanding Arrays & Core Techniques (Tailored to your ${mastery}% mastery)

Since your current Arrays mastery is **${mastery}%**, let's look at algorithmic memory access.

An **Array** is a contiguous block of allocated memory holding elements of the same type.
* **$O(1)$ Direct Random Access:** The CPU computes memory address instantly: \`address = base_address + index * element_size\`.
* **$O(n)$ Insertion / Deletion in Middle:** Removing or inserting an element requires shifting all subsequent elements in memory.

#### 3 Essential Array Algorithmic Patterns:
1. **Two Pointers:** Moving pointers toward each other (e.g. Two-Sum on sorted array, reversing elements) or moving in the same direction (slow & fast runner for in-place deduplication).
2. **Sliding Window:** Maintaining a dynamic contiguous subarray \`[left, right]\` to find maximum/minimum subarrays matching a constraint in $O(n)$ time.
3. **Prefix Sums:** Precomputing cumulative sums so any range query \`sum(i, j)\` is resolved in $O(1)$ time: \`prefix[j+1] - prefix[i]\`.`;

    suggestedPrompts = [
      "How does the Sliding Window technique achieve O(n) time?",
      "When should I use Two Pointers instead of a Hash Map?",
      "Show me Kadane's algorithm for maximum subarray sum"
    ];
  } else if (effectiveTopicSlug === 'strings') {
    content = `### 🔤 Understanding Strings & Parsing (Tailored to your ${mastery}% mastery)

Since your current Strings mastery is **${mastery}%**, let's master sequence manipulation.

A **String** is an ordered sequence of characters encoded in UTF-8 or ASCII.

#### Immutability Warning:
In Python and JavaScript, strings are **immutable**. Concatenating strings inside a loop (\`s += char\`) creates a brand-new string copy every iteration, resulting in accidental **$O(n^2)$ time**!
* In Python, use \`"".join(char_list)\`.
* In JavaScript, use \`array.join('')\` or template literals.

#### Core Algorithmic Patterns:
* **Palindrome Verification:** Two pointers starting from \`left = 0\` and \`right = len(s) - 1\` moving inward.
* **Anagram Checking:** Counting character frequencies with a fixed frequency array of size 26 or a hash map.
* **Substring vs Subsequence:** A **substring** must be contiguous (e.g. \`"abc"\` in \`"xabcy"\`); a **subsequence** preserves relative order but does not need to be contiguous (e.g. \`"ace"\` in \`"abcde"\`).`;

    suggestedPrompts = [
      "How do you check if two strings are anagrams in O(n) time?",
      "What is the best algorithm to find the Longest Palindromic Substring?",
      "What is the difference between a substring and a subsequence?"
    ];
  } else if (effectiveTopicSlug === 'sorting') {
    content = `### 📶 Understanding Sorting Algorithms (Tailored to your ${mastery}% mastery)

Since your current Sorting mastery is **${mastery}%**, let's break down comparison-based ordering.

Sorting algorithms rearrange elements into non-decreasing or non-increasing order.

#### Complexity Classes:
1. **Elementary ($O(n^2)$):** Bubble Sort, Insertion Sort, Selection Sort. Useful only for tiny arrays or nearly sorted data (Insertion Sort runs in $O(n)$ on nearly sorted input!).
2. **Optimal Comparison ($O(n \log n)$):**
   * **MergeSort:** Divide and conquer. Divides array in half, recursively sorts, and merges. **Stable**, guaranteed $O(n \log n)$, but requires $O(n)$ extra space.
   * **QuickSort:** Selects a pivot, partitions elements into smaller/larger, and sorts in place. Cache-friendly and fastest in practice, with $O(1)$ auxiliary space, but worst-case $O(n^2)$ if pivot choice is adversarial.
3. **Non-Comparison ($O(n)$):** Counting Sort, Radix Sort (when values lie in a restricted range).`;

    suggestedPrompts = [
      "What is the difference between Stable and Unstable sorting?",
      "Why is QuickSort faster in practice than MergeSort?",
      "How does the Partition step in QuickSort work?"
    ];
  } else if (effectiveTopicSlug === 'complexity') {
    content = `### ⏱️ Understanding Asymptotic Complexity (Big-O)

Time and Space Complexity quantify how execution time and memory consumption scale as the input size $n$ approaches infinity.

#### The Complexity Hierarchy (Fastest to Slowest):
* **$O(1)$ Constant:** Instant array indexing, hash map lookups.
* **$O(\log n)$ Logarithmic:** Binary search, balanced BST operations (halving problem space).
* **$O(n)$ Linear:** Single pass through an array or linked list.
* **$O(n \log n)$ Linearithmic:** MergeSort, QuickSort (average), HeapSort.
* **$O(n^2)$ Quadratic:** Nested loops, Bubble sort, pairwise comparisons.
* **$O(2^n)$ Exponential:** Unmemoized recursion (Fibonacci tree, subset generation).
* **$O(n!)$ Factorial:** Permutations, Traveling Salesperson brute force.`;

    suggestedPrompts = [
      "What is the difference between Big-O, Big-Omega, and Big-Theta?",
      "How do you calculate the space complexity of a recursive call stack?",
      "Why is O(1) space preferred over O(n) in coding interviews?"
    ];
    } else {
      // Recursion explanation
      content = `### 🧠 Understanding Recursion (Tailored to your ${mastery}% mastery)

Since your current Recursion mastery is **${mastery}%**, let's build the intuition before touching complicated trees.

Recursion is simply **a function solving a tiny slice of a problem and delegating the rest to an identical clone of itself**.

Every recursive solution has two non-negotiable rules:
1. **The Base Case (The Brake Pedal):** Without this, your function will call itself infinitely until the call stack crashes (\`RangeError: Maximum call stack size exceeded\`).
2. **The Recursive Step (The Leap of Faith):** You must call the function with a strictly smaller or simpler input moving monotonically closer to the base case.

#### Call Stack Trace for \`factorial(3)\`:
\`\`\`text
factorial(3)
  └── returns 3 * factorial(2)
        └── returns 2 * factorial(1)
              └── returns 1  <-- BASE CASE REACHED!
\`\`\`
The stack frames pause and unwind:
* \`factorial(1)\` returns \`1\`
* \`factorial(2)\` computes \`2 * 1 = 2\`
* \`factorial(3)\` computes \`3 * 2 = 6\`

> **Key Rule for You:** When you write recursive code, write the **Base Case first** at line 1 before writing any other logic!`;

      suggestedPrompts = [
        "Why does recursion cause a stack overflow?",
        "Show me a practice problem on base cases",
        "How do I trace multiple recursive calls like Fibonacci?"
      ];
    }

    return {
      content,
      suggestedPrompts,
      provider: 'local-heuristic',
      model: 'LearnLoop-Pedagogical-Engine-V1',
      isFallback: true,
      topicContext: topicName,
      studentMastery: mastery
    };
  }

  // 8. Default: Socratic Problem-Solving Guidance for any open-ended question
  return {
    content: `### 💡 Socratic Guidance: "${cleanMsg}"

You asked: **"${cleanMsg}"**

To approach this systematically in Computer Science and software engineering:

1. **Clarify Requirements & Constraints:** What are the exact use cases, edge cases (e.g. scale, concurrency, empty states), and expected outputs?
2. **Formulate the Baseline:** What is the simplest direct architecture or brute-force algorithm to achieve this?
3. **Optimize with Appropriate Data Structures & Patterns:** 
   * Need fast $O(1)$ lookups? $\\to$ **Hash Maps / Caches**
   * Need ordered priority processing? $\\to$ **Priority Queues / Heaps**
   * Need sequential state transitions? $\\to$ **State Machines / Dynamic Programming**
   * Need hierarchical or network relationships? $\\to$ **Trees / Graphs**

Would you like a step-by-step code demonstration, an architecture breakdown, or a practice challenge related to this?`,
    suggestedPrompts: [
      `Show me a concrete example for this`,
      `What are the most common interview questions on this?`,
      `How does this connect to ${topicName}?`
    ],
    provider: 'local-heuristic',
    model: 'LearnLoop-Pedagogical-Engine-V1',
    isFallback: true,
    topicContext: topicName,
    studentMastery: mastery
  };
}
