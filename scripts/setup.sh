#!/bin/bash

echo "🚀 Setting up Civic Education Kenya project..."

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️ MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating project structure..."
mkdir -p frontend/src/{components,pages,styles,lib,types,hooks,context}
mkdir -p backend/src/{routes,middleware,config,types,models,services,utils,scripts}

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
cd ..

# Setup backend
echo "⚙️ Setting up backend..."
cd backend
npm install
cd ..

# Create default .env files if they don't exist
if [ ! -f .env ]; then
    echo "🔑 Creating root .env file..."
    cat > .env << EOF
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic_education
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
EOF
fi

if [ ! -f frontend/.env.local ]; then
    echo "🔑 Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/civic_education
EOF
fi

# Test database connection
echo "🔍 Testing database connection..."
node test-db-connection.js

echo "✨ Setup complete!" 