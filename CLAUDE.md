# Claude Instructions for Smart Code Reviewer Module 2

## Project Context
This is Module 2 of a CSE 310 course project. Module 1 (completed) created a working frontend TypeScript code analysis tool. Module 2 adds backend infrastructure and cloud database persistence while preserving all existing functionality.

## Current State
- ✅ Working React + TypeScript frontend with code analysis
- ✅ Drag-and-drop file upload and analysis display
- ❌ No backend - all data lost on refresh
- ❌ No user accounts or persistence

## Goal
Transform the client-side tool into a persistent platform with user accounts, project organization, and analysis history, using Express.js backend and PostgreSQL cloud database.

## Key Implementation Guidelines

### 🚨 Critical Requirements
- **NEVER break existing functionality** - current analysis workflow must continue working
- **Incremental development** - each task must be testable independently
- **Test after each change** - verify nothing breaks before proceeding
- **Branch protection** - create git branches before major changes

### 🏗️ Architecture Decisions
- **Backend**: Express.js with TypeScript (matches frontend language)
- **Database**: PostgreSQL cloud-hosted (Railway or Supabase)
- **ORM**: Prisma (simplifies database operations)
- **Auth**: JWT tokens with bcrypt password hashing
- **Integration**: Add persistence layer without changing analysis engine

### 📊 Database Schema
```sql
users: id, email, password_hash, name, created_at
projects: id, user_id, name, description, created_at  
analyses: id, project_id, filename, language, analysis_data, score, created_at
```

### 🧪 Testing Commands
When working on this project, use these commands to verify functionality:

```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Test production build
npm run lint         # Check code style
npm run typecheck    # Verify TypeScript types

# Backend development (once created)
cd backend
npm run dev          # Start backend server
npm run build        # Build backend for production
npm test             # Run backend tests
```

### 📁 Project Structure
```
smart-code-reviewer/
├── src/                 # Existing frontend (DO NOT BREAK)
├── backend/            # New Express.js server
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── models/     # Prisma schema
│   │   ├── middleware/ # Auth, validation
│   │   └── utils/      # Helper functions
│   ├── prisma/         # Database schema
│   └── package.json
├── TODO.md            # Implementation checklist
└── CLAUDE.md          # This file
```

### 🔄 Development Workflow
1. **Before starting any task**: Create git branch and read TODO.md
2. **During development**: Test frequently, preserve existing functionality
3. **After each task**: Update TODO.md, mark task complete
4. **Commits**: User handles all git commits - Claude will suggest when to commit and provide clean commit messages
5. **Integration**: Test that frontend still works without backend
6. **Deployment**: Ensure production environment works

### 📝 Commit Message Policy
**IMPORTANT**: All commit messages should appear as student's original work with NO AI attribution.
- ❌ Never include "Generated with Claude Code" or similar AI references
- ❌ Never include "Co-Authored-By: Claude" lines
- ✅ Provide clean, professional commit messages that reflect student authorship
- ✅ Follow standard commit message format for academic projects
- ✅ Messages should sound like they were written by the student developer

### 🔍 Common Debugging Areas
- **CORS issues**: Frontend and backend on different ports
- **Environment variables**: Database connection strings
- **TypeScript types**: Ensure backend types match frontend expectations
- **Authentication flow**: JWT token management and storage
- **Database connections**: Connection pooling and error handling

### 💡 Implementation Tips
- Start with simplest possible backend setup
- Use Prisma migrate for database schema changes
- Implement read-only features before write operations
- Add loading states and error handling to frontend
- Test with multiple users to verify data isolation

### 🚀 Success Metrics
- All existing analysis features work unchanged
- Users can register, login, and save analyses
- Data persists between browser sessions
- Multiple users can use system simultaneously
- Backend handles errors gracefully

### ⚠️ Risk Mitigation
- If backend is too complex, reduce scope to just save/load analyses
- If authentication fails, implement later - focus on persistence first
- If database integration breaks frontend, revert and try smaller changes
- Keep Module 1 functionality as fallback if backend fails

## Quick Reference

### Essential NPM Packages for Backend
```json
{
  "express": "^4.18.0",
  "@types/express": "^4.17.0", 
  "typescript": "^5.0.0",
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Environment Variables Needed
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

This file should guide all development decisions and help maintain project focus on the Module 2 learning objectives while preserving the working Module 1 foundation.