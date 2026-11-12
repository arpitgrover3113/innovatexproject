import express from 'express';
import { dbStore } from '../services/storage.js';

const router = express.Router();

// Helper to extract authenticated user ID or fallback to demo
const getUserId = (req) => {
  if (req.user && req.user._id) return req.user._id;
  if (req.user && req.user.id) return req.user.id;
  if (req.body && req.body.userId) return req.body.userId;
  if (req.query && req.query.userId) return req.query.userId;
  return 'demo_student_01';
};

/**
 * @route   POST /api/leetcode/log-submission
 * @desc    Log a new LeetCode submission from the Chrome Extension
 * @access  Public (CORS open for Chrome Extension)
 */
router.post('/log-submission', async (req, res) => {
  try {
    const {
      leetcodeUsername,
      title,
      titleSlug,
      difficulty = 'Medium',
      timeSpentSeconds = 0,
      timeSpentFormatted,
      runtime = 'N/A',
      runtimePercentile = 75,
      memory = 'N/A',
      memoryPercentile = 70,
      status = 'Accepted',
      userId: explicitUserId
    } = req.body;

    if (!title && !titleSlug) {
      return res.status(400).json({ error: 'Problem title or slug is required.' });
    }

    const userId = explicitUserId || 'demo_student_01';

    // Format human readable time if not provided
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const formatted = timeSpentFormatted || (mins === 0 ? `${secs}s` : `${mins}m ${secs}s`);

    const xpReward = difficulty === 'Hard' ? 200 : difficulty === 'Medium' ? 100 : 50;

    const submissionRecord = await dbStore.addLeetCodeSubmission({
      userId,
      leetcodeUsername: leetcodeUsername || 'alex_mercer',
      title: title || titleSlug,
      titleSlug: titleSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      timeSpentFormatted: formatted,
      runtime,
      runtimePercentile: Number(runtimePercentile) || 75,
      memory,
      memoryPercentile: Number(memoryPercentile) || 70,
      status: status || 'Accepted',
      awardedXp: xpReward,
      syncedVia: 'LearnLoop Companion Chrome Extension'
    });

    console.log(`[LeetCode Log] Recorded ${submissionRecord.title} (${difficulty}) for ${userId} in ${formatted}`);

    res.status(201).json({
      success: true,
      submission: submissionRecord,
      awardedXp: xpReward,
      message: `Successfully synced ${submissionRecord.title} to LearnLoop (+${xpReward} XP)!`
    });
  } catch (err) {
    console.error('Failed to log LeetCode submission:', err);
    res.status(500).json({ error: 'Failed to record LeetCode submission.' });
  }
});

/**
 * @route   GET /api/leetcode/submissions
 * @desc    Fetch recent submissions logged for the user
 */
router.get('/submissions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const submissions = await dbStore.getLeetCodeSubmissions(userId);
    res.json({
      count: submissions.length,
      submissions
    });
  } catch (err) {
    console.error('Failed to get LeetCode submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

/**
 * @route   GET /api/leetcode/analytics
 * @desc    Calculate solve speed analytics and FAANG readiness benchmarks
 */
router.get('/analytics', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analytics = await dbStore.getLeetCodeAnalytics(userId);

    // Get user's linked LeetCode handle
    const user = dbStore.users.get(userId);
    const linkedHandle = user?.leetcodeUsername || 'alex_mercer';

    res.json({
      linkedHandle,
      ...analytics,
      benchmarks: {
        easyTarget: '< 10 mins (Optimal)',
        mediumTarget: '< 20 mins (FAANG Screen Standard)',
        hardTarget: '< 45 mins (Senior Bar)'
      }
    });
  } catch (err) {
    console.error('Failed to get LeetCode analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

/**
 * @route   POST /api/leetcode/link-handle
 * @desc    Link user's LeetCode username to their profile
 */
router.post('/link-handle', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'LeetCode username is required.' });
    }

    const cleanUsername = username.trim();
    const userId = getUserId(req);

    const user = dbStore.users.get(userId);
    if (user) {
      user.leetcodeUsername = cleanUsername;
      dbStore.users.set(userId, user);
      dbStore.debouncedSave();
    }

    res.json({
      success: true,
      leetcodeUsername: cleanUsername,
      message: `Linked LeetCode handle @${cleanUsername} to your LearnLoop profile!`
    });
  } catch (err) {
    console.error('Failed to link LeetCode handle:', err);
    res.status(500).json({ error: 'Failed to link handle.' });
  }
});

/**
 * @route   GET /api/leetcode/profile/:username
 * @desc    Fetch public LeetCode stats for a given username
 */
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Attempt public LeetCode GraphQL fetch if online
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);

    if (lcRes && lcRes.ok) {
      const data = await lcRes.json();
      const matched = data?.data?.matchedUser;
      if (matched) {
        const stats = matched.submitStats?.acSubmissionNum || [];
        const easy = stats.find(s => s.difficulty === 'Easy')?.count || 0;
        const medium = stats.find(s => s.difficulty === 'Medium')?.count || 0;
        const hard = stats.find(s => s.difficulty === 'Hard')?.count || 0;
        return res.json({
          username: matched.username,
          ranking: matched.profile?.ranking || 124500,
          totalSolved: easy + medium + hard,
          easySolved: easy,
          mediumSolved: medium,
          hardSolved: hard,
          isLive: true
        });
      }
    }
  } catch (e) {
    // Graceful fallback below
  }

  // Realistic fallback profile for offline/sandboxed development
  res.json({
    username,
    ranking: 85210,
    totalSolved: 312,
    easySolved: 110,
    mediumSolved: 164,
    hardSolved: 38,
    acceptanceRate: 68.4,
    isLive: false,
    note: 'Cached profile snapshot'
  });
});

export default router;
