#!/bin/bash

# FortiPass Electron Setup Script
# This script handles the initial setup for Electron development

echo "🚀 FortiPass Electron Setup"
echo "============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev:electron' to start development"
echo "2. Read ELECTRON_SETUP.md for complete documentation"
echo ""
echo "Quick commands:"
echo "  npm run dev              - Web development mode"
echo "  npm run dev:electron     - Electron + hot reload"
echo "  npm run build            - Build web app"
echo "  npm run build:electron   - Build Electron app + installers"
echo ""
