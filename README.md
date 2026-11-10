# LearnLoop AI – Intelligent Adaptive Learning Platform

> **Problem Statement 03 – Intelligent Education**  
> An AI-powered adaptive learning platform that identifies students’ cognitive gaps, dynamically calibrates practice difficulties, and sequences personalized learning journeys.

---

## 🌟 1. Product Vision

Unlike traditional EdTech platforms that force students through rigid linear playlists, **LearnLoop AI** operates like an expert personal computer science tutor. It continuously evaluates student telemetry and dynamically adapts:
- **Learning Difficulty:** Stepping up on conceptual mastery, stepping down on confusion.
- **Practice Questions:** Targeting active cognitive frontiers and foundational prerequisites.
- **Teaching Explanations:** Explaining at the student's exact mastery level using Socratic dialogue.
- **Topic Progression:** Topologically ordering topics to prevent cognitive overload.

---

## 🛠️ 2. Technology Stack

### Frontend
- **React.js + Vite** – Fast, modular modern web architecture
- **Tailwind CSS** – Custom EdTech SaaS design language inspired by Linear, Notion, and Duolingo
- **Framer Motion** – Smooth micro-interactions, layout transitions, and result reveals
- **Recharts** – Interactive topic mastery radar, weekly study velocity, and accuracy trends
- **Lucide React** – Clean vector iconography
- **Canvas-Confetti** – Gamified assessment completion celebrations

### Backend & AI
- **Node.js & Express.js** – RESTful API architecture with modular routers
- **MongoDB & Mongoose** – Relational schema models for Users, Topics, Questions, Progress, Assessments, and Chat Histories
- **High-Fidelity Resilient Fallback Engine** – Automatically activates in-memory storage if a local MongoDB daemon is not running, ensuring a 100% crash-proof local evaluation!
- **Google Gemini API** – Integration for contextual Socratic tutoring with dynamic cognitive profile injection
- **Pedagogical Rule Fallback** – Provides comprehensive, tailored algorithmic breakdowns when Gemini API keys are unconfigured

---

## 🚀 3. Local Development Setup

Everything runs locally. No cloud deployment or third-party hosting required.

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Step 1: Clone / Navigate to Directory
```bash
cd "learnloop-ai"
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```
*(Optional: Add your `GEMINI_API_KEY` to `backend/.env` for live Google Gemini models. If omitted, LearnLoop AI's built-in pedagogical heuristic engine activates automatically!)*

### Step 3: Run the Backend Server
```bash
cd backend
npm install
npm start
```
The backend will launch on **`http://localhost:5001`**.

*(Optional Database Seed Script)*:
```bash
npm run seed
```

### Step 4: Run the Frontend Client
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will launch on **`http://localhost:3000`** with live proxying to port 5001.

---

## 🧪 4. Critical Demo Scenario (Hackathon Evaluation Walkthrough)

To verify the end-to-end functionality of LearnLoop AI locally, execute this sequence:

1. **Open Landing Page:** Visit `http://localhost:3000`. Observe the hero banner, interactive preview tabs, and features overview.
2. **1-Click Demo Login:** Click **"Launch Live Demo"** or navigate to Sign In → **"1-Click Demo Access"**. You will be authenticated as **Alex Mercer** with 10 DSA topics, a 4-day streak, and calibrated baseline mastery.
3. **Inspect the Dashboard:** View the topic mastery distribution, weekly velocity chart, strongest topics, and notice that **Recursion (35%)** is flagged as a **Critical Gateway Bottleneck**.
4. **Take Diagnostic Assessment:** Click **"Diagnostic"** in the top navigation. Complete or sample the 10-topic diagnostic assessment (covering Arrays, Strings, Recursion, Binary Search, Sorting, Linked Lists, Stacks, Trees, Graphs, and DP).
5. **Review Recalibrated Scores:** Submit the assessment to see your overall score, detailed explanations, and the exact deterministic mastery delta formulas.
6. **Experience the Adaptive Practice Engine:** Click **"Adaptive Quiz"**.
   - Answer a question correctly: observe difficulty escalating from Easy to Medium or Medium to Hard, with an engine adaptation reason.
   - Answer incorrectly: observe the engine stepping down to foundational questions and displaying cognitive misconception tips.
7. **Consult the AI Tutor:** Click **"AI Tutor"**. Ask: *"Why is recursion failing for me?"* or choose a suggested prompt. Notice how the tutor explicitly references your active mastery level (e.g. 35%) and emphasizes base-case visualization.
8. **Explore the Dynamic Roadmap:** Click **"Roadmap"**. Notice how topics are topologically ordered: **Recursion** is listed as Priority #1 because it blocks **Trees (60%)** and **Dynamic Programming (15%)**.

---

## 📐 5. Deterministic Knowledge Mapping Formula

LearnLoop does not use arbitrary LLMs to guess student mastery. Mastery scores (0–100) are updated deterministically after every response:

$$\text{Delta} = \text{BaseWeight}(\text{Difficulty}) \times \text{StreakMultiplier} \times \text{PacingFactor}$$

- **Difficulty Weights:**
  - Easy: Correct $= +8$, Incorrect $= -12$ (foundational failure penalized heavier)
  - Medium: Correct $= +14$, Incorrect $= -8$
  - Hard: Correct $= +20$, Incorrect $= -5$ (ambitious challenges rewarded)
- **Consecutive Mistake Multiplier:** $\ge 2$ consecutive errors triggers a $1.2\times$ adjustment and flags a **Cognitive Misconception**.
- **Recent Accuracy:** Calculated via exponential moving average ($\alpha = 0.3$).

---

## 🔒 6. Demo Account Credentials
- **Email:** `alex@learnloop.ai`
- **Password:** `password123`
- *(Or simply click the "1-Click Demo Access" button on the login screen!)*

