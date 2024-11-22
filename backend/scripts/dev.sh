#!/bin/bash

echo "🚀 Starting Civic Education Kenya in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Running setup first..."
    ./scripts/setup.sh
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running
if command -v docker &> /dev/null; then
    if ! docker ps | grep -q "mongodb"; then
        echo "🔄 Starting MongoDB container..."
        docker-compose up -d mongodb
        # Wait for MongoDB to be ready
        sleep 5
    fi
fi

# Start the development server with nodemon
echo "🔥 Starting development server..."
npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts 