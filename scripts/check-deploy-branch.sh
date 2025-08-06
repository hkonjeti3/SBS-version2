#!/bin/bash

# Check Deploy Branch Configuration Script
echo "🔍 Checking Deploy Branch Configuration"
echo "====================================="

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "deploy" ]; then
    echo "❌ ERROR: You are not on the deploy branch!"
    echo "Please run: git checkout deploy"
    exit 1
fi

echo "✅ Current branch is deploy"

# Check if render.yaml exists and has correct branch
if [ -f "render.yaml" ]; then
    if grep -q "branch: deploy" render.yaml; then
        echo "✅ render.yaml exists and specifies deploy branch"
    else
        echo "❌ render.yaml exists but doesn't specify deploy branch"
    fi
else
    echo "⚠️  render.yaml not found in root directory"
fi

# Check if SBS_Backend/render.yaml has branch specification
if [ -f "SBS_Backend/render.yaml" ]; then
    if grep -q "branch: deploy" SBS_Backend/render.yaml; then
        echo "✅ SBS_Backend/render.yaml specifies deploy branch"
    else
        echo "❌ SBS_Backend/render.yaml doesn't specify deploy branch"
    fi
else
    echo "⚠️  SBS_Backend/render.yaml not found"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes:"
    git status --short
    echo ""
    echo "Please commit your changes before deploying:"
    echo "git add ."
    echo "git commit -m 'Your commit message'"
    echo "git push origin deploy"
else
    echo "✅ No uncommitted changes"
fi

# Check if remote is up to date
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "⚠️  Local branch is not up to date with remote"
    echo "Please run: git pull origin deploy"
else
    echo "✅ Local branch is up to date with remote"
fi

echo ""
echo "🎯 Render Deployment Checklist:"
echo "1. ✅ Branch is set to 'deploy'"
echo "2. ✅ render.yaml specifies deploy branch"
echo "3. ✅ All changes committed"
echo "4. ✅ Remote is up to date"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git push origin deploy"
echo "2. Deploy on Render using the render.yaml configuration"
echo "3. Or manually set branch to 'deploy' in Render dashboard" 