#!/bin/bash

echo "📜 Legislative Tracking Tools for Civic Education Kenya..."

function update_bills() {
    echo "🔄 Updating bill statuses..."
    npx ts-node src/scripts/update-bills.ts
}

function generate_summaries() {
    echo "📝 Generating bill summaries..."
    npx ts-node src/scripts/generate-summaries.ts
}

function process_updates() {
    echo "📨 Processing legislative updates..."
    npx ts-node src/scripts/process-updates.ts
}

case "$1" in
    "update")
        update_bills
        ;;
    "summarize")
        generate_summaries
        ;;
    "process")
        process_updates
        ;;
    "all")
        update_bills
        generate_summaries
        process_updates
        ;;
    *)
        echo "Usage: ./scripts/legislative.sh [update|summarize|process|all]"
        ;;
esac 