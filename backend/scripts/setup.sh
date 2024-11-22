#!/bin/bash

echo "🚀 Setting up Civic Education Kenya Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating project structure..."
mkdir -p src/types
mkdir -p src/config
mkdir -p src/routes
mkdir -p src/middleware
mkdir -p src/models
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/tests
mkdir -p public/uploads

# Create default .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔑 Creating default .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/civic_education
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
EOF
fi

# Create default .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
*.log
coverage/
.DS_Store
uploads/*
!uploads/.gitkeep
EOF
fi

# Create empty .gitkeep files to track empty directories
echo "👉 Creating .gitkeep files..."
touch src/types/.gitkeep
touch src/config/.gitkeep
touch src/routes/.gitkeep
touch src/middleware/.gitkeep
touch src/models/.gitkeep
touch src/services/.gitkeep
touch src/utils/.gitkeep
touch src/tests/.gitkeep
touch public/uploads/.gitkeep

# Build the project
echo "🔨 Building the project..."
npm run build

# Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
    echo "🧪 Running tests..."
    npm test
fi

# Check if MongoDB is running in Docker
if command -v docker &> /dev/null; then
    if ! docker ps | grep -q "mongodb"; then
        echo "⚠️  MongoDB container not detected. Make sure to run:"
        echo "docker-compose up -d mongodb"
    else
        echo "✅ MongoDB container is running"
    fi
fi

echo "✨ Setup complete! You can now start the development server with:"
echo "npm run dev"

# Add execution permissions to development scripts
chmod +x scripts/*.sh

echo "
🎉 Civic Education Kenya Backend is ready!
👉 Next steps:
   1. Update the .env file with your actual credentials
   2. Start MongoDB with 'docker-compose up -d mongodb'
   3. Run 'npm run dev' to start the development server
   4. Visit http://localhost:5000 to check the API
"