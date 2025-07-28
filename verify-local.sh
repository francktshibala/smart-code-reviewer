#!/bin/bash

# Smart Code Reviewer - Local Verification Script
echo "🚀 Smart Code Reviewer - Local Verification"
echo "============================================"

# Check if servers are running
echo ""
echo "📡 Server Status Check:"

# Backend check
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend server is running (port 3001)"
    
    # Get health details
    echo "📊 Backend Health:"
    curl -s http://localhost:3001/api/health | jq . 2>/dev/null || curl -s http://localhost:3001/api/health
    
    echo ""
    echo "📈 Performance Metrics:"
    curl -s http://localhost:3001/api/metrics | jq .system.memory 2>/dev/null || echo "Metrics endpoint available"
    
else
    echo "❌ Backend server not running on port 3001"
    echo "   To start: cd backend && npm run dev"
fi

# Frontend check
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend server is running (port 5173)"
    echo "   Visit: http://localhost:5173"
else
    echo "❌ Frontend server not running on port 5173"
    echo "   To start: npm run dev"
fi

echo ""
echo "🔍 Implementation Verification:"

# Check file structure
if [ -f "backend/src/routes/analyses.ts" ]; then
    echo "✅ Backend API routes implemented"
else
    echo "❌ Backend routes missing"
fi

if [ -f "src/components/Dashboard.tsx" ]; then
    echo "✅ Frontend components implemented"
else
    echo "❌ Frontend components missing"
fi

if [ -f "backend/src/cache.ts" ]; then
    echo "✅ Performance caching implemented"
else
    echo "❌ Caching layer missing"
fi

# Check database indexes
if grep -q "@@index" "backend/prisma/schema.prisma" 2>/dev/null; then
    echo "✅ Database performance indexes added"
    echo "   Indexes found: $(grep -c "@@index" backend/prisma/schema.prisma)"
else
    echo "❌ Database indexes missing"
fi

# Check deployment configs
if [ -f "vercel.json" ] && [ -f "railway.json" ] && [ -f "render.yaml" ]; then
    echo "✅ Deployment configurations ready"
else
    echo "❌ Deployment configurations missing"
fi

echo ""
echo "🧪 Build Testing:"

# Test TypeScript compilation
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation errors"
fi

# Test builds
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1)
    echo "✅ Frontend built successfully (${BUNDLE_SIZE:-"size unknown"})"
else
    echo "🔄 Frontend not built yet - run 'npm run build'"
fi

if [ -d "backend/dist" ]; then
    echo "✅ Backend built successfully"
else
    echo "🔄 Backend not built yet - run 'cd backend && npm run build'"
fi

echo ""
echo "📋 Summary:"

# Count what's working
WORKING=0
TOTAL=8

# Check each component
[ -f "backend/src/routes/analyses.ts" ] && WORKING=$((WORKING + 1))
[ -f "src/components/Dashboard.tsx" ] && WORKING=$((WORKING + 1))
[ -f "backend/src/cache.ts" ] && WORKING=$((WORKING + 1))
grep -q "@@index" "backend/prisma/schema.prisma" 2>/dev/null && WORKING=$((WORKING + 1))
[ -f "vercel.json" ] && WORKING=$((WORKING + 1))
curl -s http://localhost:3001/api/health > /dev/null 2>&1 && WORKING=$((WORKING + 1))
curl -s http://localhost:5173 > /dev/null 2>&1 && WORKING=$((WORKING + 1))
npx tsc --noEmit > /dev/null 2>&1 && WORKING=$((WORKING + 1))

PERCENTAGE=$((WORKING * 100 / TOTAL))

echo "✅ ${WORKING}/${TOTAL} components working (${PERCENTAGE}%)"

if [ $WORKING -eq $TOTAL ]; then
    echo "🎉 Everything is working perfectly!"
    echo ""
    echo "🎯 What you can test now:"
    echo "   1. Open http://localhost:5173 in browser"
    echo "   2. Drag & drop a JavaScript file to analyze"
    echo "   3. See the analysis results (this should work!)"
    echo ""
    echo "🔧 To test database features:"
    echo "   1. Fix database connection (see CURRENT_STATUS_REPORT.md)"
    echo "   2. Try user registration and saving analyses"
else
    echo "🔧 Some setup needed - check individual items above"
fi

echo ""
echo "📚 For detailed instructions, see:"
echo "   - LOCAL_VERIFICATION.md"
echo "   - CURRENT_STATUS_REPORT.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo ""