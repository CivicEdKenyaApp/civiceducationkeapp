#!/bin/bash

echo "🧹 Cleaning up project..."

# Clean frontend
echo "📱 Cleaning frontend..."
cd frontend
rm -rf .next
rm -rf node_modules
rm -rf coverage

# Clean backend
echo "⚙️ Cleaning backend..."
cd ../backend
rm -rf dist
rm -rf node_modules
rm -rf coverage

# Clean root
echo "🌳 Cleaning root directory..."
cd ..
rm -rf node_modules

# Clean Docker resources
if command -v docker &> /dev/null; then
    echo "🐳 Cleaning Docker resources..."
    docker-compose down -v
fi

echo "✨ Cleanup complete!" 