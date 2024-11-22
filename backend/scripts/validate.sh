#!/bin/bash

echo "✅ Running Data Validation for Civic Education Kenya..."

# Validate database integrity
function validate_db() {
    echo "🔍 Checking database integrity..."
    npx ts-node src/scripts/validate-db.ts
}

# Validate content
function validate_content() {
    echo "📝 Validating content..."
    npx ts-node src/scripts/validate-content.ts
}

# Validate user submissions
function validate_submissions() {
    echo "👥 Validating user submissions..."
    npx ts-node src/scripts/validate-submissions.ts
}

case "$1" in
    "db")
        validate_db
        ;;
    "content")
        validate_content
        ;;
    "submissions")
        validate_submissions
        ;;
    "all")
        validate_db
        validate_content
        validate_submissions
        ;;
    *)
        echo "Usage: ./scripts/validate.sh [db|content|submissions|all]"
        ;;
esac 