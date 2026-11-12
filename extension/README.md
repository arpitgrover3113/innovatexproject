# LearnLoop Companion — Chrome Extension (LeetCode Speed & Submission Tracker)

The **LearnLoop Companion** is a lightweight, zero-dependency Manifest V3 Chrome Extension that automatically tracks your problem-solving speed on [LeetCode](https://leetcode.com), captures runtime and memory stats, and syncs your submissions to your **LearnLoop.ai** dashboard.

---

## 🚀 10-Second Installation in Chrome

1. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
2. In the top-right corner, toggle on **Developer mode**.
3. Click the **"Load unpacked"** button in the top-left.
4. Select this directory:
   ```
   /Users/Ganga/.gemini/antigravity/scratch/innovatexproject/extension
   ```
5. Done! You will see **"LearnLoop Companion"** in your Chrome extensions bar.

---

## ⚡ How It Works

1. Open any problem on LeetCode (e.g. `https://leetcode.com/problems/two-sum/`).
2. A sleek, floating **LearnLoop Stopwatch** will automatically appear in the bottom-right corner of your screen.
3. The timer automatically starts counting up your solve time. You can pause, resume, or drag the widget anywhere.
4. When you click **Submit** and LeetCode shows **"Accepted"**:
   - The stopwatch automatically pauses.
   - It captures:
     - **Problem Title & Slug**
     - **Difficulty** (Easy, Medium, Hard)
     - **Total Solve Time** (e.g. `14m 22s`)
     - **Runtime & Percentile** (e.g. `45 ms, Beats 88.5%`)
     - **Memory & Percentile**
   - It instantly sends this payload to `http://localhost:5001/api/leetcode/log-submission`.
   - Your **LearnLoop Dashboard** updates with speed analytics, average times, and XP rewards!
