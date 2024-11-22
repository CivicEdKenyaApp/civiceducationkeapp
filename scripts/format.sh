#!/bin/bash

echo "🎨 Formatting code..."

# Format with Prettier
echo "Running Prettier..."
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Run ESLint fixes
echo "Running ESLint..."
npx eslint . --ext .js,.jsx,.ts,.tsx --fix

# Check TypeScript
echo "Running TypeScript check..."
npx tsc --noEmit

echo "✨ Done formatting!" 