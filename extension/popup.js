/**
 * LearnLoop Companion — Extension Popup Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  const inputUsername = document.getElementById('input-username');
  const inputBackend = document.getElementById('input-backend');
  const btnSave = document.getElementById('btn-save');
  const connStatus = document.getElementById('conn-status');
  const connText = document.getElementById('conn-text');
  const submissionsList = document.getElementById('submissions-list');

  // Load saved settings
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['backendUrl', 'leetcodeUsername', 'recentSubmissions'], (res) => {
      if (res.backendUrl) inputBackend.value = res.backendUrl;
      if (res.leetcodeUsername) inputUsername.value = res.leetcodeUsername;
      renderRecentSubmissions(res.recentSubmissions || []);
    });
  }

  // Check backend health
  async function checkConnection() {
    const backendUrl = inputBackend.value.replace(/\/$/, '');
    try {
      const res = await fetch(`${backendUrl}/health`, { method: 'GET' });
      if (res.ok) {
        connStatus.className = 'status-pill status-connected';
        connText.textContent = 'Connected';
      } else {
        throw new Error();
      }
    } catch {
      connStatus.className = 'status-pill status-disconnected';
      connText.textContent = 'Offline';
    }
  }

  checkConnection();

  // Save Settings
  btnSave.addEventListener('click', () => {
    const backendUrl = inputBackend.value.trim() || 'http://localhost:5001/api';
    const leetcodeUsername = inputUsername.value.trim() || 'alex_mercer';

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ backendUrl, leetcodeUsername }, () => {
        btnSave.textContent = '✓ Saved!';
        setTimeout(() => { btnSave.textContent = 'Save Settings'; }, 1500);
        checkConnection();
      });
    }
  });

  // Render recent submissions
  function renderRecentSubmissions(subs) {
    if (!subs || subs.length === 0) {
      submissionsList.innerHTML = `<div class="empty-state">No solves recorded yet.<br>Open any LeetCode problem to begin tracking!</div>`;
      return;
    }

    submissionsList.innerHTML = subs.slice(0, 4).map(sub => `
      <div class="submission-item">
        <div>
          <div class="sub-title">${sub.title || 'LeetCode Problem'}</div>
          <div class="sub-meta">${sub.difficulty || 'Medium'} · ${sub.runtime || 'Accepted'}</div>
        </div>
        <div class="sub-time">${sub.timeSpentFormatted || `${Math.floor(sub.timeSpentSeconds / 60)}m`}</div>
      </div>
    `).join('');
  }
});
