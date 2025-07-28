# Smart Code Reviewer - Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)
```bash
# Deploy everything to Vercel
./scripts/deploy.sh vercel
```

### Option 2: Railway (Best for Backend + Database)
```bash  
# Deploy backend to Railway
./scripts/deploy.sh railway
```

### Option 3: Render (Free Tier Available)
```bash
# Configure for Render deployment
./scripts/deploy.sh render
```

## Detailed Deployment Instructions

### 🚀 Vercel Deployment (Full-Stack)

**Prerequisites:**
- GitHub repository
- Vercel account

**Steps:**
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables:**
   Create `.env.production`:
   ```bash
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_secure_secret_key"
   NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   ./scripts/deploy.sh vercel
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `DATABASE_URL` and `JWT_SECRET`

**Result:** Both frontend and backend deployed to Vercel with automatic HTTPS

---

### 🚂 Railway Deployment (Backend + Database)

**Prerequisites:**
- Railway account
- Railway CLI installed

**Steps:**
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Create New Project:**
   ```bash
   railway new
   ```

4. **Deploy Backend:**
   ```bash
   ./scripts/deploy.sh railway
   ```

5. **Add PostgreSQL Database:**
   - Go to Railway dashboard
   - Add PostgreSQL service
   - Copy connection URL to `DATABASE_URL` environment variable

6. **Configure Frontend:**
   Create `.env.production`:
   ```bash
   VITE_API_URL=https://your-railway-backend.railway.app/api
   ```

7. **Deploy Frontend to Vercel/Netlify:**
   ```bash
   npm run build
   # Upload dist/ folder to your preferred static hosting
   ```

**Result:** Backend on Railway with PostgreSQL, Frontend on static hosting

---

### 🎨 Render Deployment (Free Tier)

**Prerequisites:**
- GitHub repository
- Render account

**Steps:**
1. **Push Code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Configure Render Services:**
   - The `render.yaml` file is already configured
   - Connect your GitHub repository to Render
   - Render will automatically detect the configuration

3. **Set Environment Variables:**
   In Render dashboard for backend service:
   ```
   DATABASE_URL = your_postgresql_url
   JWT_SECRET = auto-generated
   NODE_ENV = production
   ```

4. **Add PostgreSQL Database:**
   - Create PostgreSQL service in Render
   - Use internal connection URL for `DATABASE_URL`

**Result:** Both frontend and backend on Render with PostgreSQL

---

### 🐳 Docker Deployment (Self-Hosted)

**Prerequisites:**
- Docker installed
- PostgreSQL database available

**Steps:**
1. **Build Docker Image:**
   ```bash
   ./scripts/deploy.sh docker
   ```

2. **Run Backend Container:**
   ```bash
   docker run -d \
     --name smart-code-reviewer-backend \
     -p 3001:3001 \
     -e DATABASE_URL="your_postgresql_url" \
     -e JWT_SECRET="your_secure_secret" \
     -e NODE_ENV=production \
     smart-code-reviewer-backend
   ```

3. **Serve Frontend:**
   ```bash
   npm run build
   # Serve dist/ folder with nginx, Apache, or any static server
   ```

4. **Configure Frontend API URL:**
   Set `VITE_API_URL=http://your-server:3001/api` before building

**Result:** Self-hosted deployment with full control

---

### 🔺 Heroku Deployment (Backend)

**Prerequisites:**
- Heroku account
- Heroku CLI installed

**Steps:**
1. **Deploy to Heroku:**
   ```bash
   ./scripts/deploy.sh heroku
   ```

2. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET="your_secure_secret"
   ```

4. **Deploy Frontend Separately:**
   Use Vercel, Netlify, or GitHub Pages for frontend with:
   ```bash
   VITE_API_URL=https://your-heroku-app.herokuapp.com/api
   ```

---

## Environment Variables Reference

### Backend (.env)
```bash
# Required
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-super-secure-secret-key-min-32-chars"

# Optional
PORT=3001
NODE_ENV=production
PRISMA_LOG_LEVEL=error
```

### Frontend (.env)
```bash
# Production API URL
VITE_API_URL=https://your-backend-url.com/api
```

## Database Setup

### PostgreSQL on Supabase (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Use as `DATABASE_URL`

### PostgreSQL on Railway
1. Add PostgreSQL service to Railway project
2. Copy connection URL
3. Use as `DATABASE_URL`

### PostgreSQL on Render
1. Create PostgreSQL service
2. Use internal connection URL
3. External URL for development

## Post-Deployment Checklist

### ✅ Backend Health Check
```bash
curl https://your-backend-url.com/api/health
```
Expected response:
```json
{
  "status": "OK",
  "database": "Connected",
  "prisma": "Ready"
}
```

### ✅ Frontend Functionality
1. Visit your frontend URL
2. Test file upload and analysis
3. Test user registration/login
4. Test saving analyses
5. Test dashboard features

### ✅ Database Migration
```bash
# Run if needed
npx prisma db push
```

### ✅ Performance Monitoring
```bash
curl https://your-backend-url.com/api/metrics
```

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check `DATABASE_URL` format
- Verify database is running and accessible
- Check firewall settings

**CORS Errors:**
- Ensure backend URL is correctly set in frontend
- Check CORS configuration in backend

**Build Failures:**
- Verify Node.js version (18+)
- Check all dependencies are installed
- Review build logs for specific errors

**Environment Variables:**
- Ensure all required variables are set
- Check variable names are correct
- Verify no trailing spaces in values

### Getting Help

1. Check deployment platform logs
2. Monitor backend `/api/health` endpoint
3. Use `/api/metrics` for performance insights
4. Check browser console for frontend errors

## Performance Considerations

### Backend Optimization
- Database indexes are pre-configured
- Connection pooling enabled
- Caching layer implemented
- Health monitoring available

### Frontend Optimization
- Build size: ~252KB (optimized)
- Code splitting enabled
- Static assets cached
- Responsive design implemented

## Security

### Backend Security
- JWT authentication with secure tokens
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS properly configured

### Database Security
- Connection string encryption
- No sensitive data in logs
- Proper user permissions
- Regular backups recommended

---

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start frontend
cd backend && npm run dev      # Start backend

# Building
npm run build                  # Build frontend
cd backend && npm run build    # Build backend

# Deployment
./scripts/deploy.sh vercel     # Deploy to Vercel
./scripts/deploy.sh railway    # Deploy to Railway
./scripts/deploy.sh render     # Deploy to Render
./scripts/deploy.sh docker     # Build Docker image

# Testing
npx ts-node backend/src/integration-test.ts  # Run integration tests
curl http://localhost:3001/api/health         # Health check
```

🎉 **Your Smart Code Reviewer is now ready for production deployment!**