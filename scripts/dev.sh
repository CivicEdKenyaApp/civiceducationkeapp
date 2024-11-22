#!/bin/bash

echo "🚀 Starting development servers..."

# Run frontend and backend concurrently
npx concurrently \
    "cd frontend && npm run dev" \
    "cd backend && npm run dev" 