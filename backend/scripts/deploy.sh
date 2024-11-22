#!/bin/bash

echo "🚀 Deploying Civic Education Kenya..."

# Ensure we're in production mode
export NODE_ENV=production

# Verify all required environment variables
required_vars=("MONGODB_URI" "OPENAI_API_KEY" "JWT_SECRET")
missing_vars=0

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        missing_vars=1
    fi
done

if [ $missing_vars -eq 1 ]; then
    echo "Please set all required environment variables before deploying"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting deployment."
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

# Create backup before deployment
echo "📦 Creating backup before deployment..."
./scripts/db.sh backup

# Build and deploy Docker containers
echo "🐳 Building and deploying Docker containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify deployment
echo "🔍 Verifying deployment..."
sleep 10

if curl -s http://localhost:5000/health | grep -q "ok"; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment verification failed. Rolling back..."
    docker-compose down
    ./scripts/db.sh restore
    exit 1
fi

echo "
🎉 Deployment complete!
📊 Monitor the application at:
   - API: http://localhost:5000
   - Logs: docker-compose logs -f
   - Health: http://localhost:5000/health
" 