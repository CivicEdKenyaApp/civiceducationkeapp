#!/bin/bash

echo "🧹 Cleaning up development environment..."

# Remove build artifacts
echo "🗑️  Removing build artifacts..."
rm -rf dist/

# Remove dependencies
echo "🗑️  Removing node_modules..."
rm -rf node_modules/

# Remove logs
echo "🗑️  Removing logs..."
rm -rf *.log

# Remove Docker containers and volumes
if command -v docker &> /dev/null; then
    echo "🐳 Cleaning Docker resources..."
    docker-compose down -v
fi

echo "✨ Cleanup complete!" 