#!/bin/bash

echo "📱 Offline Content Management for Civic Education Kenya..."

function prepare_content() {
    echo "📦 Preparing content for offline access..."
    npx ts-node src/scripts/prepare-offline-content.ts
}

function validate_offline() {
    echo "✅ Validating offline content..."
    npx ts-node src/scripts/validate-offline-content.ts
}

function update_cache() {
    echo "🔄 Updating offline cache..."
    npx ts-node src/scripts/update-offline-cache.ts
}

case "$1" in
    "prepare")
        prepare_content
        ;;
    "validate")
        validate_offline
        ;;
    "update")
        update_cache
        ;;
    "all")
        prepare_content
        validate_offline
        update_cache
        ;;
    *)
        echo "Usage: ./scripts/offline-content.sh [prepare|validate|update|all]"
        ;;
esac 