#!/bin/bash

# Set test environment
export NODE_ENV=test
export TEST_MONGODB_URI="mongodb://localhost:27017/civic_education_test"

echo "🧪 Running test suite for Civic Education Kenya..."

# Function to cleanup test database
cleanup_test_db() {
    echo "🧹 Cleaning up test database..."
    docker exec mongodb mongosh $TEST_MONGODB_URI --eval "db.dropDatabase()"
}

# Setup test environment
echo "🔧 Setting up test environment..."
if ! docker ps | grep -q "mongodb"; then
    echo "Starting MongoDB container..."
    docker-compose up -d mongodb
    sleep 5
fi

# Clean start
cleanup_test_db

# Run different types of tests based on arguments
case "$1" in
    "e2e")
        echo "🔄 Running E2E tests..."
        jest --config jest.e2e.config.js --forceExit
        ;;
    
    "unit")
        echo "📋 Running unit tests..."
        jest --config jest.unit.config.js
        ;;
    
    "coverage")
        echo "📊 Running tests with coverage..."
        jest --coverage --forceExit
        ;;
    
    *)
        echo "🔍 Running all tests..."
        jest --forceExit
        ;;
esac

TEST_RESULT=$?

# Cleanup
cleanup_test_db

# Report results
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed!"
    exit 1
fi 