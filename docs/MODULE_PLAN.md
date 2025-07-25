
Name: Franck Tshibala
Date: 7/19/2025
Module # (1-3): 2

1.	Identify which module you have selected to work on.  Place an “X” in front of your selected module.
 
  X   Cloud Databases
     Data Analysis
     Game Framework
     GIS Mapping
     Mobile App
     Networking
     SQL Relational Databases
     Web Apps
     Language – C++
     Language – Java
     Language – Kotlin
     Language – R 
     Language – Erlang
     Language – JavaScript 
     Language – C#
     Language - TypeScript
     Language – Rust 

2.	At a high level, describe the software you plan to create that will fulfill the requirements of this module.  Describe how each requirement will be met.  This may change as you learn more about the technology or language you are learning.
Project: Enhanced Smart Code Reviewer with Database Integration
I'm building on my successful Module 1 TypeScript project by adding backend infrastructure and database storage. Currently, my code analyzer works great but loses all data when users refresh the page. I'm transforming it into a persistent platform where developers can save analyses, create accounts, and track their code quality over time.
Software Description:
•	Backend API: Express.js server written in TypeScript to handle data operations
•	Database: PostgreSQL cloud database to store user accounts, projects, and analysis results
•	User Accounts: Registration and login system so users can save their work
•	Persistent Storage: All code analyses saved permanently with search capabilities
•	Project Organization: Users can group related code files into projects
•	Analysis History: Dashboard showing past analyses and quality trends
How Cloud Database Requirements Will Be Met:
Cloud Database Implementation: I'll use PostgreSQL hosted on Railway or Supabase, demonstrating real cloud database usage with multiple users and scalable architecture.
Data Modeling & Schema Design: I'll design three core tables with proper relationships:
•	users table (id, email, password_hash, name, created_at)
•	projects table (id, user_id, name, description, created_at)
•	analyses table (id, project_id, filename, language, analysis_data, score, created_at)
Advanced Database Operations: I'll implement complex queries including:
•	Search analyses by date range, programming language, and quality score
•	User dashboard with statistics and trends over time
•	Project-based analysis grouping with aggregated metrics
•	Full-text search through analysis suggestions and issues
Performance & Optimization: I'll add database indexing on frequently queried fields (user_id, created_at, language), implement connection pooling, and add basic caching for dashboard data to ensure good performance.
Integration Strategy: Rather than rebuilding, I'm enhancing my existing working application by adding a backend layer that preserves all current functionality while adding persistence. My current drag-and-drop interface, analysis engine, and results display will remain unchanged - I'm just adding the ability to save and organize results.



3.	Create a detailed schedule using the table below to complete your selected module during this Sprint.  Include the task and duration for each day.  You are expected to spend 24 hours every Sprint working on this individual module and other activities in the course.  Time spent on this individual module should be at least 12 hours.

	First Week of Sprint	Second Week of Sprint
Monday	Research Express.js + TypeScript setup (2 hours)
Learn PostgreSQL basics and cloud hosting (1 hour)
	Integrate frontend with backend APIs (3 hours)
Modify existing components to save analyses (1 hour)

Tuesday	Set up Express server with TypeScript (2 hours)
Create basic API structure and routing (1 hour)	Add user authentication to frontend (2 hours)
Test complete user registration/login flow (1 hour)
Wednesday	Set up PostgreSQL database connection (1 hour)
Design database schema and create tables (2 hours)	Build personal dashboard for saved analyses (2 hours)
Add search functionality for past analyses (1 hour)
Thursday	Build API endpoints for saving analyses (2 hours)
Test database operations with sample data (1 hour)	Implement project organization features (2 hours)
Add database indexing and optimization (1 hour)
Friday	Create user authentication endpoints (2 hours)
Implement JWT token system (1 hour)	Polish UI and add loading states (1 hour)
Thorough testing and bug fixes (2 hours)
Saturday	Test all backend endpoints thoroughly (1 hour)
Plan frontend integration strategy (1 hour)	Record demo video and finalize documentation (2 hours)
Final deployment and submission (1 hour)


4.	Identify at least two risks that you feel will make it difficult to succeed in this module.  Identify an action plan to overcome each of these risks.
Risk #1: Backend Development Complexity
I've never built a complete backend server before. Setting up Express.js with TypeScript, connecting to PostgreSQL, designing APIs, and handling authentication are all new concepts that might overwhelm me within the two-week timeframe.
Action Plan:
•	Start with the simplest possible Express setup using proven tutorials from official documentation
•	Focus on getting one API endpoint working completely before building others
•	Use Prisma ORM to simplify database operations instead of writing complex SQL
•	Test each component independently before integrating with my frontend
•	If overwhelmed by Wednesday of Week 1, reduce scope to just saving/loading analyses without full user authentication
•	Set daily mini-goals and ask for help if stuck on any problem for more than 2 hours
Risk #2: Database Integration Without Breaking Existing Code
My current TypeScript application works perfectly as a client-side tool. Adding backend integration might require significant changes that could break my existing functionality or take longer than expected to implement properly.
Action Plan:
•	Create a separate git branch before making any changes to preserve my working Module 1 version
•	Plan integration points carefully - identify exactly where in my current code I'll add API calls
•	Start with read-only operations (loading saved analyses) before adding write operations
•	Keep my existing analysis engine and UI components unchanged - only add persistence layer
•	Test that current functionality still works after each integration step

