#!/bin/bash

# Real-Time Stock Feed App - Build Script
# This script prepares the app for Android and iOS builds

echo "🚀 Building Real-Time Stock Feed App..."

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI not found. Installing..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for any TypeScript errors
echo "🔍 Checking for TypeScript errors..."
npm run lint

# Prepare for builds
echo "📱 Preparing builds..."

echo "✅ Setup complete!"
echo ""
echo "To build the app:"
echo "  Android: expo build:android"
echo "  iOS: expo build:ios"
echo ""
echo "To test locally:"
echo "  Start dev server: npm start"
echo "  iOS Simulator: npm run ios"
echo "  Android Emulator: npm run android"
echo "  Web: npm run web"
echo ""
echo "🔗 QR Code above can be scanned with Expo Go app for testing on physical devices"
