#!/bin/bash

echo "🤖 Running AI Content Processing for Civic Education Kenya..."

# Check environment
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set. Please configure your environment."
    exit 1
fi

function process_bills() {
    echo "📜 Processing legislative bills..."
    npx ts-node src/scripts/process-bills.ts
}

function process_resources() {
    echo "📚 Processing educational resources..."
    npx ts-node src/scripts/process-resources.ts
}

function process_contributions() {
    echo "👥 Processing community contributions..."
    npx ts-node src/scripts/process-contributions.ts
}

case "$1" in
    "bills")
        process_bills
        ;;
    "resources")
        process_resources
        ;;
    "contributions")
        process_contributions
        ;;
    "all")
        process_bills
        process_resources
        process_contributions
        ;;
    *)
        echo "Usage: ./scripts/process-content.sh [bills|resources|contributions|all]"
        ;;
esac 