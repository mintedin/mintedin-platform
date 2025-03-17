#!/bin/bash

# Exit on error
set -e

echo "📦 Starting build process..."

# Install dependencies
echo "🔧 Installing dependencies..."
npm install --legacy-peer-deps

# Run the module resolution script
echo "🔄 Setting up module resolution..."
node resolve-modules.js

# Build the Next.js app
echo "🏗️ Building Next.js app..."
NODE_PATH=. npx next build

echo "✅ Build completed successfully!" 