# Smart Code Reviewer

## CSE 310 Module 1: TypeScript Learning Project

### Course Context
I built this project for my CSE 310 class as Module 1. The goal was to learn TypeScript from scratch and build something real with it. I had never used TypeScript before this class - only JavaScript. I had one week to learn it and create this application.

### Module Requirements Met
✅ **Made my own software**: I created an AI code reviewer tool (didn't follow any tutorial)  
✅ **Learned TypeScript**: Used TypeScript features I never knew before  
✅ **Added good comments**: Every function has comments explaining what it does  
✅ **Made this README**: Complete documentation with setup steps  
✅ **Made a demo video**: 4-5 minute video showing how it works and explaining my code  
✅ **Put it on GitHub**: Public repository that anyone can see  

### How I Learned TypeScript (1 Week Sprint)

**Days 1-2: Learning the Basics**
I followed the course research method:

1. **Official TypeScript Docs**: Read the TypeScript handbook to understand types and interfaces
2. **Background Research**: Used Wikipedia to understand what static typing means
3. **YouTube Tutorials**: Watched beginner TypeScript videos to see real examples
4. **AI Help**: Asked ChatGPT and Claude questions when I got confused

**Days 3-5: Building the Project**
Started coding:
- Made file upload that works with different code files
- Built code analysis that finds problems in code
- Connected everything with proper TypeScript types
- Made the user interface look good

**Days 6-7: Finishing Up**
- Added comments to all my code
- Wrote this documentation
- Made the demo video
- Fixed any bugs I found

### Why I Picked TypeScript

**For the class**: TypeScript was completely new to me. I only knew JavaScript before CSE 310.

**For my career**: TypeScript is used everywhere in modern web development. Learning it makes me more employable.

**For this project**: Building a code analysis tool needed TypeScript's type safety to handle different programming languages without crashing.

### What I Learned

**TypeScript Skills I Got:**
- How to define custom types for my data
- How to make functions that work with different types safely
- How to catch errors before the code runs
- How to organize code better with interfaces
- How to connect to APIs without breaking things

**Problems I Solved:**
- **Type Confusion**: At first, TypeScript felt limiting coming from JavaScript. I learned types actually prevent bugs.
- **API Integration**: Had trouble typing API responses safely. I figured out how to handle optional data properly.
- **Code Organization**: Learned how to split code into modules that work together.

### Time Spent
**Total**: 14 hours in 1 week
- Learning TypeScript: 4 hours
- Building the app: 8 hours  
- Testing and docs: 2 hours

This is more than the required 12 hours for the module.

### Academic Reflection

This project shows I can learn a new programming language quickly and build something useful with it. In one week, I went from never using TypeScript to making a working application that uses advanced TypeScript features.

The hardest part was understanding how types work, but once I got it, my code became much more reliable. This will help me in future modules where I need to build bigger, more complex systems.

---

## Overview
Smart Code Reviewer is a web app that looks at your code and tells you how to make it better. It uses AI to give you suggestions, just like having an experienced programmer review your work.

## Why I Built This
As a student learning to code, I write code that works but could be better. I wanted a tool that would catch my mistakes and teach me better ways to write code. This also helps me learn about AI development, which is where I want my career to go.

## Purpose
I made this for CSE 310 to show I can use TypeScript well. The app solves a real problem that developers face - getting good feedback on their code.

## Features
- **Works with many languages**: Checks TypeScript, JavaScript, Python, Java, Go, and Rust files
- **Gives you metrics**: Tells you how complex your code is and how many lines you have
- **AI suggestions**: Uses smart algorithms to suggest improvements
- **Finds problems**: Spots security issues, overly complex code, and style problems
- **Makes reports**: You can download a professional report of the analysis
- **Easy to use**: Just drag and drop your files
- **Shows progress**: You can see the analysis happening in real time
- **Works everywhere**: Works on computers and phones

## Technology Stack
- **Frontend**: React 18 with TypeScript 5.3+
- **Styling**: Tailwind CSS for nice design
- **Icons**: Lucide React for consistent icons
- **Build Tool**: Vite for fast development
- **Code Analysis**: My own TypeScript-based analysis system
- **AI Integration**: Ready to connect to OpenAI API

## TypeScript Features I Used
- **Type Safety**: Custom interfaces and union types to prevent errors
- **Generic Programming**: Functions that work with multiple types safely
- **Utility Types**: Advanced TypeScript features like Record and Extract
- **Error Handling**: Proper async/await with typed error handling
- **Modular Code**: Clean code organization with TypeScript modules
- **API Integration**: Type-safe connections to external services

## Installation and Setup

### What You Need
- Node.js 18+ and npm
- A modern web browser

### How to Install
```bash
# Get the code
git clone https://github.com/francktshibala/smart-code-reviewer
cd smart-code-reviewer

# Install dependencies
npm install

# Start the app
npm run dev

# Build for production
npm run build
```

## How to Use

### Basic Steps
1. **Upload a File**: Drag and drop a code file or click to browse
2. **Wait for Analysis**: The app will look at your code and create metrics
3. **Check Results**: Look at the score, metrics, suggestions, and issues
4. **Download Report**: Get a complete analysis report

### File Types That Work
- `.ts` - TypeScript files
- `.js` - JavaScript files  
- `.py` - Python files
- `.java` - Java files
- `.go` - Go files
- `.rs` - Rust files

## Problems I Solved

### Problem 1: Learning TypeScript Types
**What went wrong**: Coming from JavaScript, TypeScript's strict typing felt weird and hard.
**How I fixed it**: I practiced with small examples in TypeScript Playground before using them in my real project. I learned that types actually help prevent bugs.

### Problem 2: Making Code Analysis Work
**What went wrong**: Building a code analyzer is really hard. I couldn't build a full parser.
**How I fixed it**: I made a simpler system using patterns and line-by-line checking. It's not perfect but it gives useful feedback.

### Problem 3: Making It Easy to Use
**What went wrong**: Showing complex analysis data in a simple way was challenging.
**How I fixed it**: I showed the most important stuff first (the score) then let users click to see more details.

## What I Learned

### TypeScript Skills
- **Type System**: I understand how TypeScript's types work, including interfaces and union types
- **Error Handling**: I know how to handle errors properly with async/await
- **Code Structure**: I can organize code well with TypeScript modules
- **Type Safety**: I experienced how TypeScript prevents bugs and makes code more reliable

### Programming Skills
- **Code Quality**: I understand what makes code good or bad (complexity, maintainability)
- **Static Analysis**: I learned how to analyze code automatically
- **User Experience**: I can design interfaces that are easy to use
- **Professional Development**: I built something I actually use for my own projects

## Demo Video
[🎥 Watch my demo video](https://youtu.be/KD7koB-YOxw?si=pBfDcpWxEqZ4L-f7)

The video shows:
- How the whole app works
- Me analyzing real code files
- My TypeScript code and how it works
- What I learned and problems I solved

## Future Improvements
- **Real AI**: Connect to OpenAI GPT-4 for smarter suggestions
- **Multiple Files**: Let people analyze many files at once
- **Custom Rules**: Let users set their own code standards
- **Team Features**: Let teams share analyses and work together

## Contact
**Francois Tshibala**
- GitHub: [@francoistshibala](https://github.com/francktshibala)
- Email: ftshibala@byui.edu
- LinkedIn: [Francois Tshibala](https://www.linkedin.com/feed/)

## Thank You
- CSE 310 course and teachers
- TypeScript community and documentation
- React and web development community

---

## CSE 310 Module 2: Cloud Databases Integration

### Course Context
I built Module 2 for my CSE 310 class to transform my Module 1 TypeScript application into a full-stack platform with cloud database persistence. The goal was to learn backend development with databases while preserving all existing functionality from Module 1.

### Module Requirements Met
✅ **Cloud Database Implementation**: Used PostgreSQL with Railway/Supabase (switched to SQLite for development)  
✅ **Data Modeling & Schema Design**: Created proper database relationships for users, projects, and analyses  
✅ **Advanced Database Operations**: Implemented search, filtering, statistics, and complex queries  
✅ **Performance & Optimization**: Added database indexing, connection pooling, and caching  
✅ **Backend API Development**: Built Express.js server with TypeScript  
✅ **User Authentication**: JWT-based login system with password hashing  
✅ **Data Persistence**: All analyses now saved permanently with user accounts  

### How I Transformed the Application (2 Week Sprint)

**Week 1: Planning and Backend Foundation**
1. **Database Architecture Design**: Planned schema with proper relationships between users, projects, and analyses
2. **Backend Setup**: Created Express.js server with TypeScript configuration matching frontend
3. **Database Integration**: Set up Prisma ORM with PostgreSQL (later switched to SQLite for network compatibility)
4. **API Structure**: Designed RESTful endpoints for authentication, projects, and analyses
5. **Authentication System**: Implemented JWT tokens with bcrypt password hashing

**Week 2: Integration and Advanced Features**
1. **Frontend Integration**: Connected existing React components to new backend APIs
2. **User Dashboard**: Built analysis history view with statistics and project organization
3. **Data Persistence**: Modified analysis workflow to save results after each code review
4. **Advanced Features**: Added search, filtering, pagination, and analysis viewer modal
5. **Performance Optimization**: Implemented caching layer and database indexing
6. **Testing & Debugging**: Resolved API routing conflicts and database connection issues

### What Changed from Module 1

**Before (Module 1)**:
- ✅ TypeScript code analysis tool
- ✅ Drag-and-drop interface
- ❌ Data lost on page refresh
- ❌ No user accounts
- ❌ No analysis history

**After (Module 2)**:
- ✅ Everything from Module 1 PLUS:
- ✅ User registration and login
- ✅ Permanent data storage
- ✅ Analysis history dashboard
- ✅ Project organization
- ✅ Multi-user support
- ✅ Search and filtering
- ✅ Detailed analysis viewer

### New Technology Stack Added

**Backend**:
- Express.js 4.18+ with TypeScript
- Prisma ORM for database operations
- JWT authentication with bcrypt
- CORS middleware for frontend integration

**Database**:
- SQLite for development (PostgreSQL compatible)
- Proper schema with foreign key relationships
- Database indexing for performance
- Connection pooling and caching

**Authentication & Security**:
- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- User data isolation

### Database Schema Design

```sql
-- Users table for authentication
users: id, email, password_hash, name, created_at

-- Projects for organizing analyses
projects: id, user_id, name, description, created_at

-- Analyses storing code review results
analyses: id, project_id, filename, language, analysis_data, score, created_at
```

### Problems I Solved in Module 2

### Problem 1: Preserving Module 1 Functionality
**What went wrong**: Adding backend could break existing analysis features
**How I fixed it**: Used incremental development - kept frontend working while gradually adding persistence layer

### Problem 2: Database Connection Issues
**What went wrong**: PostgreSQL connections blocked by network firewall
**How I fixed it**: Switched to SQLite for development while keeping PostgreSQL compatibility through Prisma ORM

### Problem 3: API Route Conflicts
**What went wrong**: Dashboard showed empty results due to route ordering conflicts
**How I fixed it**: Reorganized Express routes to prioritize specific endpoints before parameterized ones

### Problem 4: User Experience Integration
**What went wrong**: Users needed to understand new save/load workflow
**How I fixed it**: Made saving optional - analysis still works without accounts, but registered users get persistence

### What I Learned in Module 2

**Cloud Database Skills**:
- Database schema design with proper relationships
- SQL and NoSQL query optimization
- Connection pooling and performance tuning
- Data migration and schema evolution
- Cloud database deployment and management

**Backend Development Skills**:
- RESTful API design with Express.js
- Authentication system implementation
- Middleware development for security
- Error handling and validation
- Integration between frontend and backend

**Full-Stack Integration**:
- How to add backend to existing frontend without breaking functionality
- State management across client and server
- Real-time data synchronization
- User session management

### Time Spent on Module 2
**Total**: 30 hours over 2 weeks
- Planning and architecture: 6 hours
- Backend development: 12 hours
- Database integration: 6 hours
- Frontend integration: 4 hours
- Testing and debugging: 2 hours

This exceeds the required 12 hours and demonstrates comprehensive full-stack development skills.

### Academic Reflection

Module 2 transformed my simple TypeScript tool into a professional web platform. I learned that adding persistence to an existing application requires careful planning to avoid breaking existing functionality.

The biggest challenge was understanding how backend and frontend work together. Once I mastered API integration and state management, I could see how to build scalable web applications that serve multiple users simultaneously.

This project now demonstrates both strong TypeScript skills (Module 1) and full-stack development with cloud databases (Module 2), preparing me for building enterprise-level applications.

### Demo Video - Module 2
[🎥 Watch my Module 2 demo video](https://youtu.be/xIFpcpOoOoA)

The video shows:
- How the enhanced application works with user accounts
- Database persistence and analysis history
- Backend API integration and authentication
- Code walkthrough of new database and backend features
- Comparison with Module 1 and lessons learned

---

*Enhanced with Cloud Databases for CSE 310 - Applied Programming*