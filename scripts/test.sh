#!/bin/bash

echo "🧪 Running tests..."

# Run frontend tests
echo "📱 Testing frontend..."
cd frontend && npm test

# Run backend tests
echo "⚙️ Testing backend..."
cd backend && npm test

# Check if any tests failed
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All tests passed!" 