# Supabase PostgreSQL Setup for Smart Code Reviewer

## Quick Setup Steps

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub (free, no credit card required)

2. **Create New Project**
   - Click "New Project"
   - Choose organization (personal is fine)
   - Enter project name: `smart-code-reviewer`
   - Set database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

3. **Get Database URL**
   - Go to Project Settings → Database
   - Copy the "Connection string" under "Connection parameters"
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

4. **Update Backend Environment**
   ```bash
   cd backend
   # Edit .env file and replace DATABASE_URL with your Supabase URL
   ```

5. **Deploy Schema**
   ```bash
   npx prisma db push
   ```

## Your Supabase Dashboard

After setup, you can:
- View data in Table Editor
- Run SQL queries in SQL Editor  
- Monitor database metrics
- Set up Row Level Security (optional)

## Free Tier Limits
- 500MB database storage
- 2 projects max
- Pauses after 1 week of inactivity (easily reactivated)
- Perfect for student projects!

## Example DATABASE_URL
```
DATABASE_URL="postgresql://postgres:your_password@db.project_id.supabase.co:5432/postgres"
```