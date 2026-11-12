// Centralized API Client with Direct Backend Connection & JWT Auth
const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5001/api'
  : '/api';

export const getAuthToken = () => {
  return localStorage.getItem('learnloop_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('learnloop_token', token);
  } else {
    localStorage.removeItem('learnloop_token');
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
};

// API Services
export const authApi = {
  login: (email, password) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (payload) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  demoLogin: () => apiFetch('/auth/demo', { method: 'POST' }),
  guestLogin: () => apiFetch('/auth/guest', { method: 'POST' }),
  getCurrentUser: () => apiFetch('/auth/me'),
  updateProfile: (updates) => apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
};

export const topicsApi = {
  getTopics: () => apiFetch('/topics'),
  getTopicBySlug: (slug) => apiFetch(`/topics/${slug}`)
};

export const questionsApi = {
  getDiagnostic: () => apiFetch('/questions/diagnostic'),
  getQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/questions${query ? `?${query}` : ''}`);
  }
};

export const assessmentApi = {
  submit: (payload) => apiFetch('/assessment/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getHistory: () => apiFetch('/assessment/history')
};

export const adaptiveApi = {
  getQuestion: (topicSlug) => apiFetch(`/adaptive/question?topic=${topicSlug || 'recursion'}`),
  submitAnswer: (payload) => apiFetch('/adaptive/answer', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export const tutorApi = {
  getStatus: () => apiFetch('/tutor/status'),
  getHistory: () => apiFetch('/tutor/history'),
  sendMessage: (message, topicContext) => apiFetch('/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, topicContext })
  }),
  clearHistory: () => apiFetch('/tutor/clear', { method: 'POST' }),
  updateConfig: (payload) => apiFetch('/tutor/config', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export const roadmapApi = {
  getRoadmap: () => apiFetch('/roadmap')
};

export const analyticsApi = {
  getDashboard: () => apiFetch('/analytics/dashboard')
};

export const interviewApi = {
  getProblems: () => apiFetch('/interview/problems'),
  start: (payload = {}) => apiFetch('/interview/start', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  sendMessage: (payload) => apiFetch('/interview/message', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  evaluate: (payload) => apiFetch('/interview/evaluate', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

