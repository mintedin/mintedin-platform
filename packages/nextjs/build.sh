#!/bin/bash

# Exit on any error
set -e

echo "📦 Setting up Next.js project..."

# Install dependencies with detailed output
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Ensure CSS dependencies are installed
echo "🎨 Installing CSS processors..."
npm install autoprefixer postcss tailwindcss --no-save

# Run the build
echo "🏗️ Building Next.js app..."
npm run build

echo "✅ Build completed successfully" 