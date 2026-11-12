/**
 * LearnLoop Companion — LeetCode Speed & Submission Tracker
 * Content Script injected on leetcode.com/problems/*
 */

(() => {
  // Prevent duplicate injections
  if (window.__LEARNLOOP_EXTENSION_INJECTED__) return;
  window.__LEARNLOOP_EXTENSION_INJECTED__ = true;

  console.log('[LearnLoop Companion] Content Script active on LeetCode.');

  let currentSlug = '';
  let timerInterval = null;
  let elapsedSeconds = 0;
  let isRunning = false;
  let isMinimized = false;
  let lastRecordedSubmissionId = '';
  let submissionDetected = false;

  // Configuration (syncs with chrome.storage)
  let config = {
    backendUrl: 'http://localhost:5001/api',
    leetcodeUsername: 'alex_mercer',
    autoStart: true
  };

  // Load stored settings
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['backendUrl', 'leetcodeUsername', 'autoStart'], (res) => {
      if (res.backendUrl) config.backendUrl = res.backendUrl;
      if (res.leetcodeUsername) config.leetcodeUsername = res.leetcodeUsername;
      if (res.autoStart !== undefined) config.autoStart = res.autoStart;
    });
  }

  // Helper: Format seconds to HH:MM:SS
  function formatTime(totalSec) {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Helper: Format to human readable string (e.g. 14m 22s)
  function formatHumanTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  // Slug to Title Converter fallback
  function slugToTitle(slug) {
    if (!slug) return 'LeetCode Problem';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Extract Difficulty from LeetCode DOM
  function detectDifficulty() {
    const diffKeywords = ['Easy', 'Medium', 'Hard'];
    // 1. Search in DOM badges
    const badges = document.querySelectorAll('div, span, p');
    for (const el of badges) {
      const text = el.textContent ? el.textContent.trim() : '';
      if (diffKeywords.includes(text)) {
        // Confirm it looks like a badge
        const color = window.getComputedStyle(el).color;
        if (text === 'Easy' && (color.includes('0, 184') || color.includes('0, 175') || color.includes('green') || text === 'Easy')) {
          return 'Easy';
        }
        if (text === 'Medium' && (color.includes('255, 184') || color.includes('yellow') || color.includes('amber') || text === 'Medium')) {
          return 'Medium';
        }
        if (text === 'Hard' && (color.includes('255, 45') || color.includes('red') || color.includes('rose') || text === 'Hard')) {
          return 'Hard';
        }
      }
    }
    return 'Medium'; // default assumption
  }

  // Extract Question Title from DOM
  function detectQuestionTitle(slug) {
    // Check known LeetCode title elements
    const titleEl = document.querySelector('[data-cy="question-title"], h4, .text-title-large, a[href*="/problems/"]');
    if (titleEl && titleEl.textContent && titleEl.textContent.trim().length > 2) {
      const clean = titleEl.textContent.trim().replace(/^\d+\.\s*/, '');
      if (clean.length > 2 && clean.length < 80) return clean;
    }
    return slugToTitle(slug);
  }

  // Create & Inject Floating Widget
  function injectWidget() {
    if (document.getElementById('learnloop-stopwatch-container')) return;

    const container = document.createElement('div');
    container.id = 'learnloop-stopwatch-container';
    container.innerHTML = `
      <div id="learnloop-stopwatch" class="learnloop-card">
        <div class="learnloop-header" id="learnloop-drag-handle">
          <div class="learnloop-title-box">
            <div class="learnloop-pulse-dot"></div>
            <span class="learnloop-brand">LearnLoop</span>
            <span class="learnloop-badge">LIVE TRACKER</span>
          </div>
          <div class="learnloop-actions">
            <button id="learnloop-btn-minimize" title="Minimize/Expand" class="learnloop-btn-icon">−</button>
          </div>
        </div>

        <div id="learnloop-body" class="learnloop-body">
          <div class="learnloop-problem-info">
            <span id="learnloop-problem-name" class="learnloop-problem-name">Loading...</span>
            <span id="learnloop-difficulty" class="learnloop-diff-badge diff-medium">Medium</span>
          </div>

          <div class="learnloop-timer-display" id="learnloop-time">00:00</div>

          <div class="learnloop-controls">
            <button id="learnloop-btn-toggle" class="learnloop-btn-primary">
              <span id="learnloop-toggle-icon">⏸</span>
              <span id="learnloop-toggle-text">Pause</span>
            </button>
            <button id="learnloop-btn-reset" class="learnloop-btn-secondary" title="Reset Stopwatch">
              ↺ Reset
            </button>
          </div>

          <div id="learnloop-status" class="learnloop-status">
            ⏱️ Tracking solve time for LearnLoop
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    setupWidgetEvents();
    makeDraggable(container);
  }

  // Widget event listeners
  function setupWidgetEvents() {
    const btnToggle = document.getElementById('learnloop-btn-toggle');
    const btnReset = document.getElementById('learnloop-btn-reset');
    const btnMinimize = document.getElementById('learnloop-btn-minimize');
    const body = document.getElementById('learnloop-body');

    btnToggle.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });

    btnReset.addEventListener('click', () => {
      resetTimer();
    });

    btnMinimize.addEventListener('click', () => {
      isMinimized = !isMinimized;
      if (isMinimized) {
        body.style.display = 'none';
        btnMinimize.textContent = '+';
      } else {
        body.style.display = 'block';
        btnMinimize.textContent = '−';
      }
    });
  }

  // Draggable widget helper
  function makeDraggable(el) {
    const handle = document.getElementById('learnloop-drag-handle');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.style.cursor = 'move';

    handle.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      el.style.bottom = 'auto';
      el.style.right = 'auto';
      el.style.left = `${initialLeft}px`;
      el.style.top = `${initialTop}px`;

      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${Math.max(10, initialLeft + dx)}px`;
      el.style.top = `${Math.max(10, initialTop + dy)}px`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Timer controls
  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
    updateButtonStates();
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    updateButtonStates();
  }

  function resetTimer() {
    pauseTimer();
    elapsedSeconds = 0;
    submissionDetected = false;
    updateTimerDisplay();
    const statusEl = document.getElementById('learnloop-status');
    if (statusEl) {
      statusEl.className = 'learnloop-status';
      statusEl.textContent = '⏱️ Tracking solve time for LearnLoop';
    }
    startTimer();
  }

  function updateTimerDisplay() {
    const el = document.getElementById('learnloop-time');
    if (el) el.textContent = formatTime(elapsedSeconds);
  }

  function updateButtonStates() {
    const icon = document.getElementById('learnloop-toggle-icon');
    const text = document.getElementById('learnloop-toggle-text');
    if (icon && text) {
      if (isRunning) {
        icon.textContent = '⏸';
        text.textContent = 'Pause';
      } else {
        icon.textContent = '▶';
        text.textContent = 'Resume';
      }
    }
  }

  // Called when navigating to a problem
  function onProblemDetected(slug) {
    currentSlug = slug;
    elapsedSeconds = 0;
    submissionDetected = false;

    injectWidget();

    // Give DOM 1 second to hydrate title & difficulty
    setTimeout(() => {
      const title = detectQuestionTitle(slug);
      const difficulty = detectDifficulty();

      const titleEl = document.getElementById('learnloop-problem-name');
      const diffEl = document.getElementById('learnloop-difficulty');

      if (titleEl) titleEl.textContent = title;
      if (diffEl) {
        diffEl.textContent = difficulty;
        diffEl.className = `learnloop-diff-badge diff-${difficulty.toLowerCase()}`;
      }

      resetTimer();
    }, 1000);
  }

  // Send Submission Data to LearnLoop Backend API
  async function syncSubmissionToBackend(submissionData) {
    const statusEl = document.getElementById('learnloop-status');
    if (statusEl) {
      statusEl.className = 'learnloop-status status-syncing';
      statusEl.textContent = '🚀 Syncing submission to LearnLoop...';
    }

    try {
      const endpoint = `${config.backendUrl.replace(/\/$/, '')}/leetcode/log-submission`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const resData = await response.json();
        console.log('[LearnLoop Companion] Successfully logged submission:', resData);

        if (statusEl) {
          statusEl.className = 'learnloop-status status-success';
          statusEl.innerHTML = `✅ <strong>Accepted in ${submissionData.timeSpentFormatted}!</strong> Synced to LearnLoop (+${resData.awardedXp || 100} XP)`;
        }

        // Save into local extension storage for popup quick view
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['recentSubmissions'], (res) => {
            const list = res.recentSubmissions || [];
            list.unshift(submissionData);
            chrome.storage.local.set({ recentSubmissions: list.slice(0, 10) });
          });
        }
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.warn('[LearnLoop Companion] Failed to sync to LearnLoop:', err.message);
      if (statusEl) {
        statusEl.className = 'learnloop-status status-warning';
        statusEl.textContent = `⏱️ Solved in ${submissionData.timeSpentFormatted} (Local only, server unreachable)`;
      }
    }
  }

  // Intercept & Detect LeetCode Submissions
  function observeSubmissions() {
    // Watch DOM changes on the page for LeetCode's submission result
    const observer = new MutationObserver((mutations) => {
      if (submissionDetected) return;

      const pageText = document.body.innerText || '';
      // Look for "Accepted" banner that appears after clicking submit
      const acceptedNodes = document.querySelectorAll('[data-e2e-locator="submission-result"], .text-green-s, .text-green-60');
      
      let isAccepted = false;
      for (const node of acceptedNodes) {
        if (node.textContent && node.textContent.trim().toLowerCase() === 'accepted') {
          isAccepted = true;
          break;
        }
      }

      // Also check general accepted indicator in submission panels
      if (!isAccepted && pageText.includes('Runtime') && pageText.includes('Beats') && pageText.includes('Accepted')) {
        isAccepted = true;
      }

      if (isAccepted) {
        submissionDetected = true;
        pauseTimer();

        // Extract Runtime and Memory stats if available
        let runtime = 'N/A';
        let runtimePercentile = null;
        let memory = 'N/A';
        let memoryPercentile = null;

        // Try extracting runtime (e.g. "45 ms", "Beats 82.5%")
        const runtimeMatch = pageText.match(/Runtime\s*[:\n]\s*([0-9.]+\s*ms)/i);
        if (runtimeMatch) runtime = runtimeMatch[1];
        const runtimeBeatsMatch = pageText.match(/Beats\s*([0-9.]+)%/i);
        if (runtimeBeatsMatch) runtimePercentile = parseFloat(runtimeBeatsMatch[1]);

        // Try extracting memory
        const memoryMatch = pageText.match(/Memory\s*[:\n]\s*([0-9.]+\s*MB)/i);
        if (memoryMatch) memory = memoryMatch[1];

        const title = detectQuestionTitle(currentSlug);
        const difficulty = detectDifficulty();

        const payload = {
          leetcodeUsername: config.leetcodeUsername || 'alex_mercer',
          title,
          titleSlug: currentSlug,
          difficulty,
          timeSpentSeconds: elapsedSeconds,
          timeSpentFormatted: formatHumanTime(elapsedSeconds),
          runtime,
          runtimePercentile: runtimePercentile || 75.0,
          memory,
          memoryPercentile: memoryPercentile || 70.0,
          status: 'Accepted',
          timestamp: new Date().toISOString()
        };

        syncSubmissionToBackend(payload);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // SPA URL Change Monitoring
  function monitorUrlChanges() {
    const checkUrl = () => {
      const match = window.location.pathname.match(/\/problems\/([^/]+)/);
      if (match && match[1]) {
        const slug = match[1];
        if (slug !== currentSlug) {
          onProblemDetected(slug);
        }
      }
    };

    // Check on history mutations
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(checkUrl, 300);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(checkUrl, 300);
    };

    window.addEventListener('popstate', () => setTimeout(checkUrl, 300));
    setInterval(checkUrl, 1500);

    // Initial check
    checkUrl();
  }

  // Initialize
  monitorUrlChanges();
  observeSubmissions();
})();
