#!/usr/bin/env bash
# LearnLoop AI Local Development Runner

# Ensure local node is in PATH if available
if [ -d "$HOME/.nvm/versions/node/v24.22.0/bin" ]; then
  export PATH="$HOME/.nvm/versions/node/v24.22.0/bin:$PATH"
elif [ -d "../.node/bin" ]; then
  export PATH="$(pwd)/../.node/bin:$PATH"
elif [ -d "$HOME/.local/node/bin" ]; then
  export PATH="$HOME/.local/node/bin:$PATH"
fi

echo "=========================================================="
echo "🚀 Starting LearnLoop AI (Backend & Frontend Local Servers)"
echo "=========================================================="

# 0. Clean up any previous leftover processes on ports 5001 and 3000
echo "🧹 Ensuring ports 5001 and 3000 are free..."
lsof -ti :5001 | xargs kill -9 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
sleep 1

# 1. Start Backend in background with native watch mode for live hot-reloading
echo "⚡ Launching Express REST API on http://localhost:5001 (watch mode) ..."
(cd backend && node --watch server.js) &
BACKEND_PID=$!

# Ensure backend terminates cleanly when script exits
trap "kill $BACKEND_PID 2>/dev/null; lsof -ti :5001 2>/dev/null | xargs kill -9 2>/dev/null; exit" SIGINT SIGTERM EXIT

sleep 2

# 2. Start Frontend Vite Dev Server
echo "⚡ Launching React Vite Client on http://localhost:3000 ..."
(cd frontend && npx vite --port 3000)


