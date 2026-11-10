import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbStore } from './storage.js';

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
    'qwen/qwen3.8-27b'
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
      const content = data.choices?.[0]?.message?.content;
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

export const generateTutorResponse = async ({
  userId,
  message,
  topicContext = 'Recursion',
  conversationHistory = []
}) => {
  // 1. Fetch student's comprehensive mastery profile
  const progressList = await dbStore.getStudentProgress(userId);
  const currentTopicProgress = await dbStore.getTopicProgress(userId, topicSlugify(topicContext));

  const sortedByMastery = [...progressList].sort((a, b) => a.masteryScore - b.masteryScore);
  const weakestTopics = sortedByMastery.slice(0, 3).map(t => `${t.topicName} (${t.masteryScore}%)`);
  const strongestTopics = sortedByMastery.slice(-3).reverse().map(t => `${t.topicName} (${t.masteryScore}%)`);
  const recentMisconceptions = currentTopicProgress.recentMisconceptions || [];

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = `You are LearnLoop AI, a world-class adaptive personal Socratic tutor for Computer Science and Data Structures & Algorithms.
Student's real-time cognitive profile:
- Active Topic Focus: ${topicContext} (Current Mastery: ${currentTopicProgress.masteryScore}%)
- Weakest Knowledge Areas: ${weakestTopics.join(', ')}
- Strongest Knowledge Areas: ${strongestTopics.join(', ')}
- Recent Identified Misconceptions: ${recentMisconceptions.length ? recentMisconceptions.join('; ') : 'None logged yet'}

CORE BEHAVIOR & PEDAGOGY:
1. CONVERSATIONAL & ENGAGING: If the student says "hi", "how are you?", "who are you?", or asks casual greetings, respond warmly, naturally, and conversationally in a friendly first-person voice. Always be supportive, encouraging, and invite them into whatever they want to learn.
2. ADAPTIVE DEPTH:
   - If mastery < 50%: Use concrete real-world analogies, step-by-step visual stack traces, and emphasize base cases. Avoid premature complex optimizations.
   - If mastery > 75%: Encourage discussions of asymptotic tight bounds, invariants, and tricky edge cases.
3. CODE & STRUCTURE: Use clean markdown, bolding, bullet points, and short readable code snippets (Python/JavaScript).
4. SUGGESTED PROMPTS: Conclude your ENTIRE response with exactly 3 relevant follow-up prompts formatted strictly as:
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
      const parsed = parsePromptsAndContent(groqRes.content, topicContext);

      return {
        content: parsed.content,
        suggestedPrompts: parsed.suggestedPrompts,
        provider: 'groq',
        model: groqRes.model,
        isFallback: false,
        topicContext,
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
      const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-1.5-flash'];
      let result = null;
      let usedModel = 'gemini-3.5-flash-lite';

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
        const parsed = parsePromptsAndContent(fullText, topicContext);

        return {
          content: parsed.content,
          suggestedPrompts: parsed.suggestedPrompts,
          provider: 'gemini',
          model: usedModel,
          isFallback: false,
          topicContext,
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
    topicContext,
    currentProgress: currentTopicProgress,
    weakestTopics,
    strongestTopics,
    recentMisconceptions
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
  topicContext,
  currentProgress,
  weakestTopics,
  strongestTopics,
  recentMisconceptions
}) {
  const query = message.toLowerCase();
  const mastery = currentProgress.masteryScore;
  const topicName = currentProgress.topicName || topicContext;

  let content = '';
  let suggestedPrompts = [];

  if (query.includes('explain') || query.includes('what is') || query.includes('how does') || query.includes('understand')) {
    if (topicName.toLowerCase().includes('recursion') || query.includes('recursion')) {
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
    } else if (topicName.toLowerCase().includes('tree') || query.includes('tree')) {
      content = `### 🌲 Tree Traversals & Recursion Connection

Trees are naturally recursive structures: every tree is simply a **Root node connected to smaller Subtrees**.

Because your Recursion mastery is **${mastery}%**, notice how tree traversals are just 3 operations executed in different orders:
1. **Pre-order (Root, Left, Right):** Process the current node before traversing children. Used for cloning trees.
2. **In-order (Left, Root, Right):** In a Binary Search Tree (BST), this visits elements in **strictly ascending sorted order**.
3. **Post-order (Left, Right, Root):** Bottom-up evaluation. You cannot compute tree height or Lowest Common Ancestor until children report their results!

\`\`\`python
def inorder(root):
    if not root:
        return # Base Case
    inorder(root.left)    # Traverse Left Subtree
    print(root.val)       # Visit Root
    inorder(root.right)   # Traverse Right Subtree
\`\`\``;

      suggestedPrompts = [
        "How do I calculate the height of a binary tree?",
        "Give me an adaptive quiz question on Trees",
        "What is the difference between BFS and DFS in trees?"
      ];
    } else if (topicName.toLowerCase().includes('dynamic') || query.includes('dp')) {
      content = `### ⚡ Dynamic Programming Demystified

Dynamic Programming is simply **Careful Recursion with a Memory Notebook**.

If your Recursion foundation is still solidifying, don't worry—DP is broken into 3 clean phases:
1. **Recursion (Brute Force):** Express the problem as a recurrence relation (e.g. \`fib(n) = fib(n-1) + fib(n-2)\`).
2. **Memoization (Top-Down):** Store already-calculated answers in a hash map or array so you never recalculate a subproblem. Time drops from $O(2^n)$ to $O(n)$!
3. **Tabulation (Bottom-Up):** Fill a table starting from base cases (\`dp[0]\`, \`dp[1]\`) up to \`dp[n]\`.

> **Recommended Roadmap Action:** Because your DP mastery is **${mastery}%**, we recommend completing **Recursion base cases** first so DP state transitions make immediate intuitive sense!`;

      suggestedPrompts = [
        "Can you demonstrate memoization on Fibonacci?",
        "What is the difference between Tabulation and Memoization?",
        "Take me back to Recursion practice"
      ];
    } else {
      content = `### 📚 Core Conceptual Breakdown: ${topicName}

Current Mastery: **${mastery}%**

Every algorithmic topic centers around three core principles:
1. **Invariants:** The condition that remains true across every iteration or state transition.
2. **State & Pointer Transitions:** How memory references move through indices or node links.
3. **Complexity Bounds:** The trade-off between time complexity and auxiliary space.

Would you like a step-by-step code demonstration, an intuitive real-world analogy, or a diagnostic practice question?`;

      suggestedPrompts = [
        `Give me a practice problem on ${topicName}`,
        `What are the most common interview traps in ${topicName}?`,
        `How is ${topicName} tested in coding interviews?`
      ];
    }
  } else if (query.includes('practice') || query.includes('question') || query.includes('quiz') || query.includes('test')) {
    content = `### 🎯 Adaptive Practice Recommendation: ${topicName}

Based on your current topic progress (**${mastery}% mastery**), I have calibrated a practice challenge:

**Problem Scenario:**
> You are tasked with writing a recursive function to reverse a string \`s\`. 
> What is the base case condition, and what is returned when that condition triggers?

* **Option A:** When \`len(s) == 0\`, return \`""\` (empty string).
* **Option B:** When \`len(s) == 1\`, return \`s\` without further recursion.
* **Option C:** Both A and B are valid base cases.
* **Option D:** Recursion cannot reverse a string.

**Tutor Guidance:** Try to trace what happens when \`s = "a"\` or \`s = ""\`. When you're ready, let me know your answer or ask for a hint!`;

    suggestedPrompts = [
      "I think the answer is Option C",
      "Give me a hint for this problem",
      "Show me how the call stack unwinds"
    ];
  } else if (query.includes('hint') || query.includes('stuck') || query.includes('help')) {
    content = `### 💡 Pedagogical Hint for ${topicName}

Here is a progressive hint to unlock the problem without giving away the answer:

1. **Think of the smallest possible valid input:** What happens if the input is empty or has only a single element? That is your base case.
2. **Trust the inductive hypothesis:** Assume the function works for smaller subproblems of size $n - 1$.
3. **Examine your state changes:** Are your pointers moving toward each other, or is your input size decrementing? If not, you are at risk of an infinite loop.`;

    suggestedPrompts = [
      "Show me the full solution with explanation",
      "Give me another hint",
      "Let's try a different problem"
    ];
  } else if (query.includes('weak') || query.includes('gap') || query.includes('roadmap')) {
    content = `### 📊 Diagnostic Gap Analysis

Here is what your actual performance telemetry reveals:

* **Weakest Areas Needing Attention:** ${weakestTopics.join(', ')}
* **Your Strong Foundations:** ${strongestTopics.join(', ')}
* **Key Misconception Flagged:** ${recentMisconceptions[0] || 'Confusing stack frame allocations with linear loop steps'}

#### Recommended Action Plan:
1. Don't jump directly into Graphs or DP while **Recursion** is at **${mastery}%**.
2. Solve 3 targeted recursion problems focusing on **call stack returns**.
3. Once Recursion hits **60%**, your dynamic roadmap will automatically unlock Trees and DP!`;

    suggestedPrompts = [
      "Start practicing Recursion base cases",
      "Open my dynamic learning roadmap",
      "Why is Recursion a prerequisite for Trees?"
    ];
  } else {
    content = `### 🎓 LearnLoop AI Tutor (${topicName})

Hello! I have your complete learning profile loaded. Your active topic is **${topicName}** (Mastery: **${mastery}%**).

I can assist you with:
* **Deep Explanations:** Breaking down difficult algorithms into visual step-by-step dry runs.
* **Misconception Diagnostics:** Identifying why a recent question went wrong.
* **Targeted Practice:** Generating problems matching your exact skill frontier.
* **Roadmap Guidance:** Advising which topic to tackle next to unlock high-yield progress.

What would you like to explore right now?`;

    suggestedPrompts = [
      `Explain the fundamentals of ${topicName}`,
      `What are my weakest topics right now?`,
      `Give me an adaptive practice question`
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

