#!/usr/bin/env bash
# LearnLoop AI Local Development Runner

# Ensure local node is in PATH if available
if [ -d "../.node/bin" ]; then
  export PATH="$(pwd)/../.node/bin:$PATH"
elif [ -d "$HOME/.local/node/bin" ]; then
  export PATH="$HOME/.local/node/bin:$PATH"
fi

echo "=========================================================="
echo "🚀 Starting LearnLoop AI (Backend & Frontend Local Servers)"
echo "=========================================================="

# 1. Start Backend in background
echo "⚡ Launching Express REST API on http://localhost:5001 ..."
(cd backend && node server.js) &
BACKEND_PID=$!

# Ensure backend terminates when script exits
trap "kill $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT

sleep 2

# 2. Start Frontend Vite Dev Server
echo "⚡ Launching React Vite Client on http://localhost:3000 ..."
(cd frontend && npx vite --port 3000)


