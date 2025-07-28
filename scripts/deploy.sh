#!/bin/bash

# Smart Code Reviewer Deployment Script
# Supports multiple deployment platforms

set -e

echo "🚀 Smart Code Reviewer Deployment Script"
echo "========================================"

# Check if deployment platform is specified
PLATFORM=${1:-""}

if [ -z "$PLATFORM" ]; then
    echo "Usage: ./scripts/deploy.sh [platform]"
    echo ""
    echo "Available platforms:"
    echo "  vercel    - Deploy to Vercel"
    echo "  railway   - Deploy to Railway"
    echo "  render    - Deploy to Render"
    echo "  docker    - Build Docker image"
    echo "  heroku    - Deploy to Heroku"
    echo ""
    exit 1
fi

# Common pre-deployment steps
echo "📋 Running pre-deployment checks..."

# Check if backend builds successfully
echo "🔨 Building backend..."
cd backend
npm install
npm run build
cd ..

# Check if frontend builds successfully  
echo "🔨 Building frontend..."
npm install
npm run build

echo "✅ Pre-deployment checks passed!"

case $PLATFORM in
    "vercel")
        echo "🚀 Deploying to Vercel..."
        
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        
        # Deploy to Vercel
        vercel --prod
        
        echo "✅ Deployed to Vercel!"
        echo "📝 Remember to set environment variables in Vercel dashboard:"
        echo "   - DATABASE_URL"
        echo "   - JWT_SECRET"
        ;;
        
    "railway")
        echo "🚀 Deploying to Railway..."
        
        # Install Railway CLI if not present
        if ! command -v railway &> /dev/null; then
            echo "Please install Railway CLI: https://docs.railway.app/develop/cli"
            exit 1
        fi
        
        # Deploy to Railway
        railway up
        
        echo "✅ Deployed to Railway!"
        echo "📝 Remember to set environment variables in Railway dashboard:"
        echo "   - DATABASE_URL"
        echo "   - JWT_SECRET"
        ;;
        
    "render")
        echo "🚀 Deploying to Render..."
        echo "Please push your code to GitHub and connect it to Render using render.yaml"
        echo "Render will automatically deploy when you push to your main branch."
        
        echo "✅ Render configuration ready!"
        echo "📝 Remember to set environment variables in Render dashboard:"
        echo "   - DATABASE_URL"
        echo "   - JWT_SECRET"
        ;;
        
    "docker")
        echo "🚀 Building Docker image..."
        
        cd backend
        docker build -t smart-code-reviewer-backend .
        cd ..
        
        echo "✅ Docker image built!"
        echo ""
        echo "To run the Docker container:"
        echo "docker run -p 3001:3001 -e DATABASE_URL='your_db_url' -e JWT_SECRET='your_secret' smart-code-reviewer-backend"
        ;;
        
    "heroku")
        echo "🚀 Deploying to Heroku..."
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "Please install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Create Procfile for Heroku
        echo "web: cd backend && npm start" > Procfile
        
        # Add Heroku buildpacks
        heroku buildpacks:clear
        heroku buildpacks:add --index 1 heroku/nodejs
        
        # Deploy to Heroku
        git add .
        git commit -m "Deploy to Heroku" || true
        git push heroku main
        
        echo "✅ Deployed to Heroku!"
        echo "📝 Remember to set environment variables:"
        echo "   heroku config:set DATABASE_URL='your_db_url'"
        echo "   heroku config:set JWT_SECRET='your_secret'"
        ;;
        
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Available platforms: vercel, railway, render, docker, heroku"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed for $PLATFORM!"
echo ""
echo "🔧 Post-deployment checklist:"
echo "  ✅ Verify environment variables are set"
echo "  ✅ Check database connection"
echo "  ✅ Test API endpoints"
echo "  ✅ Verify frontend loads correctly"
echo "  ✅ Test user registration and login"
echo ""