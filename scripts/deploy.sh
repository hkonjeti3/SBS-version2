#!/bin/bash

# Deployment Script for SBS on Vercel + Render
# This script helps prepare the application for deployment

echo "🚀 SBS Deployment Preparation Script"
echo "====================================="

# Check if we're on the deploy branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "deploy" ]; then
    echo "❌ Error: You must be on the 'deploy' branch to deploy"
    echo "Please run: git checkout deploy"
    exit 1
fi

echo "✅ Current branch: $CURRENT_BRANCH"

# Check if all changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit all changes before deploying"
    git status
    exit 1
fi

echo "✅ All changes committed"

# Check if remote is up to date
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "❌ Error: Local branch is not up to date with remote"
    echo "Please pull latest changes: git pull origin deploy"
    exit 1
fi

echo "✅ Local branch is up to date"

# Test backend build
echo "🔨 Testing backend build..."
cd SBS_Backend/sbs
if ./mvnw clean compile -q; then
    echo "✅ Backend compiles successfully"
else
    echo "❌ Backend compilation failed"
    exit 1
fi
cd ../../

# Test frontend build
echo "🔨 Testing frontend build..."
cd SBS_Frontend
if npm run build:prod > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ../

echo ""
echo "🎉 Deployment preparation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin deploy"
echo "2. Deploy backend on Render:"
echo "   - Go to render.com"
echo "   - Create new web service"
echo "   - Connect to your GitHub repo"
echo "   - Select 'deploy' branch"
echo "   - Root directory: SBS_Backend"
echo "3. Deploy frontend on Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Root directory: SBS_Frontend"
echo "4. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" 