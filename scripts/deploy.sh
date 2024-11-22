#!/bin/bash

echo "🚀 Deploying Civic Education Kenya..."

# Run tests
echo "🧪 Running tests..."
./scripts/test.sh

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting deployment."
    exit 1
fi

# Build projects
echo "🔨 Building projects..."
cd frontend && npm run build
cd ../backend && npm run build

# Deploy using Docker
echo "🐳 Deploying with Docker..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!" 