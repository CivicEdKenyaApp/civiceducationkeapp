#!/bin/bash

echo "👥 Community Management Tools for Civic Education Kenya..."

function moderate_content() {
    echo "🔍 Moderating community content..."
    npx ts-node src/scripts/moderate-content.ts
}

function generate_reports() {
    echo "📊 Generating community engagement reports..."
    npx ts-node src/scripts/generate-reports.ts
}

function process_feedback() {
    echo "📝 Processing community feedback..."
    npx ts-node src/scripts/process-feedback.ts
}

case "$1" in
    "moderate")
        moderate_content
        ;;
    "reports")
        generate_reports
        ;;
    "feedback")
        process_feedback
        ;;
    *)
        echo "Usage: ./scripts/community.sh [moderate|reports|feedback]"
        ;;
esac 