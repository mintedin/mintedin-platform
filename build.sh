#!/bin/bash

# Exit on any error
set -e

echo "📦 Setting up Next.js project..."
cd packages/nextjs

# Remove problematic .babelrc files
echo "🧹 Removing any .babelrc files..."
rm -f .babelrc
rm -f .babelrc.js
rm -f .babelrc.json

# Install dependencies with detailed output
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Ensure CSS dependencies are installed
echo "🎨 Installing CSS processors..."
npm install autoprefixer postcss tailwindcss --no-save

# Create symlinks to ensure module resolution works
echo "🔗 Setting up module resolution..."
mkdir -p node_modules/@
ln -sf $(pwd) node_modules/@/

# Run the build
echo "🏗️ Building Next.js app..."
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "✅ Build completed successfully" 