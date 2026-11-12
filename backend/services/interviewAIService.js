import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Robust Code Analyzer for Socratic Feedback
 * Parses and extracts structural insights from the candidate's code.
 */
export function analyzeCodeSnippet(code, language = 'python') {
  if (!code || typeof code !== 'string') {
    return {
      isEmpty: true,
      isStarterCode: true,
      linesCount: 0,
      charCount: 0,
      constructs: [],
      hasBaseCase: false,
      hasReturn: false,
      hasLoop: false,
      hasPointers: false,
      hasMapOrSet: false,
      summary: 'No code written yet.'
    };
  }

  const clean = code.trim();
  const lines = clean.split('\n');
  const isStarterCode = clean.includes('pass') && lines.length <= 4 ||
    clean.includes('// Write your solution here') ||
    clean.includes('# Write your solution here') ||
    clean.includes('return 0;') && lines.length <= 4;

  const constructs = [];
  let hasBaseCase = false;
  let hasReturn = false;
  let hasLoop = false;
  let hasPointers = false;
  let hasMapOrSet = false;

  // Base cases
  if (/if\s*(\(?!s|!root|not\s+|len\(|s\.length|root\s*==\s*None|root\s*==\s*null|nums\.length\s*==\s*0)/i.test(clean)) {
    hasBaseCase = true;
    constructs.push('base case condition');
  }

  // Loops
  if (/for\s+|while\s+/i.test(clean)) {
    hasLoop = true;
    constructs.push('iteration loop');
  }

  // Pointers
  if (/\b(left|right|slow|fast|low|high|mid|start|end|ptr|p1|p2)\b/i.test(clean)) {
    hasPointers = true;
    constructs.push('two-pointer/window index pointers');
  }

  // Hash / Set / Heap
  if (/\b(set|dict|map|unordered_map|unordered_set|HashSet|HashMap|heapq|priority_queue)\b/i.test(clean) ||
      /=\s*\{\}/.test(clean) || /defaultdict|Counter\(|collections\./.test(clean)) {
    hasMapOrSet = true;
    constructs.push('auxiliary hash/lookup structure');
  }

  // Returns
  if (/return\s+[^;]+/i.test(clean)) {
    hasReturn = true;
    constructs.push('return statement');
  }

  return {
    isEmpty: clean.length === 0,
    isStarterCode,
    linesCount: lines.length,
    charCount: clean.length,
    constructs,
    hasBaseCase,
    hasReturn,
    hasLoop,
    hasPointers,
    hasMapOrSet,
    summary: constructs.length > 0
      ? `Detected: ${constructs.join(', ')} (${lines.length} lines)`
      : `Skeleton code (${lines.length} lines)`
  };
}

/**
 * Parses out Stage and Suggested Prompt tags from AI response
 */
function parseInterviewAIOutput(rawText, fallbackStageId = 'clarification') {
  if (!rawText) {
    return {
      content: "Let's review the approach and check any potential edge cases before moving to the implementation.",
      stageId: fallbackStageId,
      suggestedPrompt: "Could you clarify the input bounds and if the array can be empty?"
    };
  }

  let content = rawText;
  let stageId = fallbackStageId;
  let suggestedPrompt = '';

  const stageMatch = content.match(/---STAGE:\s*([a-zA-Z_-]+)---/i);
  if (stageMatch) {
    const matched = stageMatch[1].toLowerCase().trim();
    if (['clarification', 'approach', 'implementation', 'complexity'].includes(matched)) {
      stageId = matched;
    }
    content = content.replace(/---STAGE:\s*([a-zA-Z_-]+)---/i, '').trim();
  }

  const promptMatch = content.match(/---SUGGESTED_PROMPT:\s*([^\n\r]+)---/i);
  if (promptMatch) {
    suggestedPrompt = promptMatch[1].trim().replace(/^["']|["']$/g, '');
    content = content.replace(/---SUGGESTED_PROMPT:\s*([^\n\r]+)---/i, '').trim();
  }

  return {
    content,
    stageId,
    suggestedPrompt
  };
}

/**
 * Intelligent Code-Aware Pedagogical Fallback Engine
 * Generates specific, context-aware Socratic responses that directly read and evaluate code.
 */
/**
 * Intelligent Code-Aware Pedagogical Fallback Engine
 * Generates specific, context-aware Socratic responses that directly read code and accurately answer candidate questions.
 */
function generateHeuristicInterviewReply({
  question,
  currentCode,
  language,
  message,
  stageId,
  currentStageIndex,
  messages
}) {
  const codeAnalysis = analyzeCodeSnippet(currentCode, language);
  const lowerMsg = (message || '').toLowerCase().trim();
  const isQuestion = lowerMsg.includes('?') || /^(can|could|what|how|why|is|should|does|will|would|do)\b/i.test(lowerMsg);
  const asksForCodeReview = /review|check\b.*code|look at.*code|is this right|does this work|is my code|feedback on|examine|debug|correct/i.test(lowerMsg);
  const statesFinished = /done|finished|implemented|completed|ready for complexity|wrote the code/i.test(lowerMsg);

  let reply = '';
  let nextStageId = stageId || 'clarification';
  let suggestedPrompt = '';

  // Case 1: Candidate explicitly asking for Code Review or clicked "Review My Code"
  if (asksForCodeReview) {
    if (codeAnalysis.isEmpty || codeAnalysis.isStarterCode) {
      reply = `I am looking at your editor right now. Currently, you have the ${language} starter template.

To implement **${question.title}**:
1. Consider the constraints: \`${question.constraints[0] || 'input bounds'}\`.
2. Set up your main variables: ${question.expectedComplexity.space.includes('O(1)') ? 'Initialize two pointers to track your window boundaries in O(1) space.' : `Initialize your auxiliary state (like a hash map/set) to track visited elements in ${question.expectedComplexity.space}.`}

Start writing your core loop in the editor, and I'll review your logic as you go!`;
      nextStageId = 'implementation';
      suggestedPrompt = "I've started drafting the loop and boundary variables.";
      return { content: reply, stageId: nextStageId, suggestedPrompt };
    }

    // Code has real implementation
    const highlights = [];
    if (codeAnalysis.hasBaseCase) highlights.push('handled initial base/boundary checks');
    if (codeAnalysis.hasLoop) highlights.push('structured the main iteration loop');
    if (codeAnalysis.hasPointers) highlights.push('managed active index/window pointers');
    if (codeAnalysis.hasMapOrSet) highlights.push('used an auxiliary lookup structure');

    const highlightText = highlights.length > 0 ? highlights.join(', ') : 'structured the algorithm flow';

    if (codeAnalysis.hasReturn && codeAnalysis.hasLoop && codeAnalysis.linesCount >= 5) {
      reply = `I just analyzed your ${language} solution in the editor!

**Code Review Findings:**
* **Correctness:** You have successfully ${highlightText}.
* **Boundary Conditions:** Verify that edge cases like empty inputs (\`${question.constraints[0] || 'empty input'}\`) or single-element inputs do not cause out-of-bounds or zero-division errors.
* **Target Efficiency:** Your current structure aligns with our **${question.expectedComplexity.time}** time and **${question.expectedComplexity.space}** space goals.

${stageId !== 'complexity' ? `Now let's move to **Stage 4: Complexity Analysis & Optimization**.
Could you walk me through:
1. The exact worst-case **Time Complexity** and **Auxiliary Space** of your written logic?
2. A quick trace using the example: \`${question.examples[0]?.input || 'the primary test case'}\`?` : 'Your solution looks solid. Are you ready to submit and generate your evaluation scorecard?'}`;
      nextStageId = 'complexity';
      suggestedPrompt = `The time complexity is ${question.expectedComplexity.time} because...`;
    } else {
      reply = `I'm reviewing your in-progress code (${codeAnalysis.linesCount} lines written so far):

**Observations:**
* You have ${highlightText}.
* **Action Item:** ${!codeAnalysis.hasReturn ? 'Your function needs a proper return statement to return the final answer.' : 'Ensure the loop condition updates your pointers or state so the loop terminates correctly.'}
* Make sure you check boundary conditions at the beginning of the function.

Keep going, and click **"Review My Code"** again once you add the return logic!`;
      nextStageId = 'implementation';
      suggestedPrompt = "I've added the return statement and checked loop termination.";
    }
    return { content: reply, stageId: nextStageId, suggestedPrompt };
  }

  // Case 2: Candidate asks a direct question (answer them accurately based on the problem!)
  if (isQuestion) {
    if (/constraint|bound|limit|size|length|range/i.test(lowerMsg)) {
      reply = `Good question on the problem constraints!
For **${question.title}**:
${question.constraints.map(c => `• \`${c}\``).join('\n')}

Always design assuming the worst-case within these bounds. Does this help clarify your design?`;
      suggestedPrompt = "Yes, that clarifies the bounds. What about edge cases?";
    } else if (/edge\s*case|empty|null|negative|zero|duplicate|single/i.test(lowerMsg)) {
      reply = `Great edge cases to consider!
For **${question.title}**:
• If the input is empty or of size 0, your function should return the valid base output (e.g. \`0\` or \`false\`).
• If the input has only 1 element, verify your loop terminates cleanly without indexing errors.
• Example check: input = ${question.examples[0]?.input} -> expected output is ${question.examples[0]?.output}.

How does your intended algorithm handle these boundary conditions?`;
      suggestedPrompt = "My approach handles this by checking base conditions upfront.";
    } else if (/complexity|time|space|big\s*o|o\(n\)|o\(1\)|optimal/i.test(lowerMsg)) {
      reply = `For **${question.title}** at **${question.companyName}**, the expected optimal complexities are:
• **Time Complexity:** **${question.expectedComplexity.time}**
• **Space Complexity:** **${question.expectedComplexity.space}**

Aim to achieve these optimal bounds rather than a quadratic O(N^2) brute force.`;
      suggestedPrompt = `I can achieve ${question.expectedComplexity.time} using an optimal data structure.`;
    } else {
      reply = `That is a thoughtful point. For **${question.title}**, keep the primary constraint in mind: ${question.constraints[0]}. 
Make sure your logic accounts for all input varieties and avoids redundant passes. 

Would you like to walk through your high-level approach, or jump into the code editor?`;
      suggestedPrompt = "Let me explain my high-level approach.";
    }
    return { content: reply, stageId: nextStageId, suggestedPrompt };
  }

  // Case 3: Candidate states they are done writing code
  if (statesFinished && (stageId === 'implementation' || stageId === 'approach')) {
    reply = `Great work completing the implementation in the editor!

Now let's move to **Stage 4: Complexity Analysis & Optimization**.
Looking at your written solution:
1. What is the exact **worst-case Time Complexity** and **Space Complexity**?
2. Walk me through a quick dry-run with a minimal edge case (\`${question.examples[0]?.input || 'minimal test case'}\`).`;
    nextStageId = 'complexity';
    suggestedPrompt = `The time complexity is ${question.expectedComplexity.time} because...`;
    return { content: reply, stageId: nextStageId, suggestedPrompt };
  }

  // Case 4: Stage 1 Clarification progression
  if (stageId === 'clarification') {
    const hasAskedQuestions = lowerMsg.includes('empty') || lowerMsg.includes('bound') || lowerMsg.includes('case') || messages.filter(m => m.role === 'candidate').length >= 2;
    if (hasAskedQuestions) {
      reply = `Great clarifying questions regarding the constraints and input boundaries! 
Specifically for **${question.title}**:
- ${question.constraints[0]}
- ${question.constraints[1] || 'Inputs are well-formed within standard memory limits.'}

Now let's transition to **Stage 2: Approach & Trade-offs**. 
Before writing any code, how would you think about solving this? What is the brute-force approach, and what optimal approach can bring us to **${question.expectedComplexity.time}**?`;
      nextStageId = 'approach';
      suggestedPrompt = `I think a brute-force approach would be O(N^2), but we can optimize it using ${question.topic.toLowerCase()}...`;
    } else {
      reply = `Good start! In a FAANG screen, spending 60–90 seconds clarifying constraints sets a strong foundation.
For instance:
- What should the function return if the input is empty or of size 1?
- Are the elements guaranteed to be unique, or could there be duplicates?

Review the example: input = ${question.examples[0]?.input} -> output = ${question.examples[0]?.output}. Let me know your high-level intuition!`;
      suggestedPrompt = "What if the input contains duplicate values or is empty?";
    }
    return { content: reply, stageId: nextStageId, suggestedPrompt };
  }

  // Case 5: Stage 2 Approach progression
  if (stageId === 'approach') {
    const mentionsOptimal = /two pointer|sliding window|hash|map|set|prefix sum|binary search|heap|priority queue|graph|bfs|dfs|o\(n\)|o\(log n\)|linear|greedy|dp/i.test(lowerMsg);
    if (mentionsOptimal || messages.filter(m => m.role === 'candidate').length >= 3) {
      reply = `Excellent intuition! That optimal approach matches what we look for in candidate screens at **${question.companyName}**.
Target complexity: **${question.expectedComplexity.time}** with **${question.expectedComplexity.space}**.

Let's transition to **Stage 3: Code Implementation**.
Please begin writing out your solution in the code editor on the right (${language}). 
As you write, talk me through your variable choices and loop bounds. Click **"Review My Code"** whenever you'd like feedback!`;
      nextStageId = 'implementation';
      suggestedPrompt = "I've outlined my function and pointers in the editor.";
    } else {
      reply = `That's an interesting direction. Let's analyze the time complexity of that idea. 
If we use that approach, would we have to re-scan elements repeatedly? 
Can we use a helper technique like ${question.topic.toLowerCase()} to avoid redundant work and achieve **${question.expectedComplexity.time}**?`;
      suggestedPrompt = `Can we optimize this to ${question.expectedComplexity.time} using an optimal data structure?`;
    }
    return { content: reply, stageId: nextStageId, suggestedPrompt };
  }

  // Case 6: Stage 3 Implementation dialogue (when not an explicit code review request)
  if (stageId === 'implementation') {
    if (codeAnalysis.linesCount > 4 && !codeAnalysis.isStarterCode) {
      reply = `I see you're actively building out your ${language} logic in the editor (${codeAnalysis.linesCount} lines).
Talk me through what you're writing right now, or click **"Review My Code"** above if you'd like a complete line-by-line review!`;
      suggestedPrompt = "Could you review my current solution code in the editor?";
    } else {
      reply = `Take your time to write your solution in the code editor on the right. 
Remember to handle the base condition first, then structure your main loop. 
Let me know if you run into any questions, or click **"Review My Code"** when you want me to check it!`;
      suggestedPrompt = "I am writing the main loop now.";
    }
    return { content: reply, stageId: 'implementation', suggestedPrompt };
  }

  // Case 7: Stage 4 Complexity Analysis
  reply = `Well done walking through the trade-offs! You accurately highlighted how the algorithmic invariants and pointer increments behave.

We have reached the end of our allotted technical screen for **${question.title}**!
Whenever you are ready, please click **"End & Generate Scorecard"** in the top bar to review your comprehensive FAANG evaluation scorecard and hire verdict!`;
  nextStageId = 'complexity';
  suggestedPrompt = "Thank you! I am ready to generate my scorecard.";

  return { content: reply, stageId: nextStageId, suggestedPrompt };
}

/**
 * Main AI Interviewer Dialogue Generator
 * Combines Groq LPU / Gemini Cloud LLMs with real-time Code Snippet awareness
 * and graceful Pedagogical Heuristic Fallback.
 */
export async function generateInterviewerResponse({
  question,
  currentCode = '',
  language = 'python',
  messages = [],
  message = '',
  stageId = 'clarification',
  currentStageIndex = 0
}) {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const STAGE_NAMES = ['clarification', 'approach', 'implementation', 'complexity'];
  const activeStage = stageId || STAGE_NAMES[currentStageIndex] || 'clarification';

  const systemInstruction = `You are a Senior Staff Software Engineer and Hiring Committee Member at ${question.companyName} conducting an authentic 15-minute technical mock interview.

INTERVIEW SPECIFICATION:
- Problem: "${question.title}" (${question.difficulty})
- Topic: "${question.topic}"
- Description: ${question.description}
- Constraints:
${question.constraints.map(c => `  * ${c}`).join('\n')}
- Expected Optimal Time Complexity: ${question.expectedComplexity.time}
- Expected Auxiliary Space: ${question.expectedComplexity.space}
- Rubric Standards:
  * Clarification: ${question.stageRubric.clarification}
  * Approach: ${question.stageRubric.approach}
  * Implementation: ${question.stageRubric.implementation}
  * Complexity: ${question.stageRubric.complexity}

CURRENT ACTIVE STAGE: ${activeStage.toUpperCase()}

CURRENT CODE IN CANDIDATE'S EDITOR (${language}):
\`\`\`${language}
${currentCode && currentCode.trim() ? currentCode : '(The editor is currently empty or has starter code)'}
\`\`\`

CORE INTERACTION RULES:
1. CODE AWARENESS & CODE REVIEW (ESSENTIAL):
- You have complete access to the candidate's code snippet above.
- If the candidate asks you to review, check, or debug their code, or if they write code in Stage 3:
  * Reference their specific variable names, loop conditions, and data structures.
  * Point out any syntax issues, off-by-one errors, or missing edge case checks (e.g. empty string/array, negative numbers, single element).
  * Confirm whether their implementation achieves the optimal ${question.expectedComplexity.time} time complexity.
- If the candidate pastes a code snippet in their message, read and critique that snippet directly!

2. CONVERSATIONAL & SOCRATIC STYLE:
- Speak directly to the candidate as a supportive, senior FAANG interviewer.
- Keep responses focused, encouraging, and under 150 words so dialogue moves fast.
- Do NOT write out the entire solution for them. Guide them with targeted Socratic questions, edge case challenges, and mini code examples when helpful.

3. STAGE MANAGEMENT:
- Guide candidate through the 4 stages: Clarification -> Approach & Trade-offs -> Code Implementation -> Complexity & Optimization.
- When they complete the goals of the current stage, invite them to transition to the next stage.

4. MANDATORY TERMINATION TAGS:
End your entire response with exactly these two tags on their own lines:
---STAGE: <clarification|approach|implementation|complexity>---
---SUGGESTED_PROMPT: <short 1-sentence prompt the candidate can click or say next>---`;

  // --- TIER 1: GROQ CLOUD LPU ---
  if (groqKey && groqKey.trim() !== '' && groqKey !== 'YOUR_GROQ_API_KEY') {
    const candidateModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'qwen/qwen3.8-27b',
      'mixtral-8x7b-32768'
    ];

    for (const model of candidateModels) {
      try {
        const groqMessages = [
          { role: 'system', content: systemInstruction }
        ];

        // Include recent conversation context
        if (messages.length > 0) {
          messages.slice(-6).forEach(m => {
            groqMessages.push({
              role: m.role === 'candidate' ? 'user' : 'assistant',
              content: m.content
            });
          });
        }

        // Add user's latest message with current code context
        const userPromptWithContext = `[Candidate's Current Editor Code (${language})]:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\nCandidate says: "${message}"`;
        groqMessages.push({ role: 'user', content: userPromptWithContext });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: groqMessages,
            temperature: 0.6,
            max_tokens: 1024
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content;
          if (rawContent && rawContent.trim()) {
            const parsed = parseInterviewAIOutput(rawContent, activeStage);
            return {
              reply: parsed.content,
              stageId: parsed.stageId,
              suggestedPrompt: parsed.suggestedPrompt,
              provider: 'groq',
              model
            };
          }
        }
      } catch (err) {
        console.warn(`[Groq Interview AI] Model ${model} failed:`, err.message);
      }
    }
  }

  // --- TIER 2: GEMINI API ---
  if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let prompt = `${systemInstruction}\n\n`;
      if (messages.length > 0) {
        prompt += 'Recent Interview Transcript:\n';
        messages.slice(-4).forEach(m => {
          prompt += `${m.role === 'candidate' ? 'Candidate' : 'Interviewer'}: ${m.content}\n`;
        });
      }
      prompt += `\nCandidate: ${message}\nInterviewer:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawContent = response.text();
      if (rawContent && rawContent.trim()) {
        const parsed = parseInterviewAIOutput(rawContent, activeStage);
        return {
          reply: parsed.content,
          stageId: parsed.stageId,
          suggestedPrompt: parsed.suggestedPrompt,
          provider: 'gemini',
          model: 'gemini-1.5-flash'
        };
      }
    } catch (err) {
      console.warn('[Gemini Interview AI] Failed:', err.message);
    }
  }

  // --- TIER 3: HIGH-FIDELITY PEDAGOGICAL CODE-AWARE FALLBACK ---
  console.log('[Interview AI] Using High-Fidelity Code-Aware Pedagogical Fallback Engine.');
  const fallback = generateHeuristicInterviewReply({
    question,
    currentCode,
    language,
    message,
    stageId: activeStage,
    currentStageIndex,
    messages
  });

  return {
    reply: fallback.content,
    stageId: fallback.stageId,
    suggestedPrompt: fallback.suggestedPrompt,
    provider: 'heuristic',
    model: 'LearnLoop-Interview-Engine-V2'
  };
}
