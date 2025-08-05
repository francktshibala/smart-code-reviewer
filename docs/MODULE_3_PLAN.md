Name: Franck Tshibala
Date: 7/28/2025
Module # (1-3): 3

1.	Identify which module you have selected to work on.  Place an "X" in front of your selected module.
 
     Cloud Databases
     Data Analysis
     Game Framework
     GIS Mapping
     Mobile App
  X  Networking
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
Project: Real-Time Collaborative Smart Code Reviewer
I'm transforming my individual code analysis tool into a team collaboration platform. Right now, developers use my app alone - they upload their code, get AI feedback, and that's it. I want to create something where entire development teams can work together, share code reviews in real-time, and learn from each other's code quality improvements.

Software Description:
•	Real-Time Code Sessions: Multiple developers can join the same code review session and see changes instantly
•	Live Chat Integration: Team members can discuss code issues and suggestions as they appear
•	Collaborative Annotations: Users can add comments and suggestions directly on code lines that everyone sees immediately
•	Team Dashboard: Shows what everyone on the team is working on and their code quality progress
•	Instant Notifications: When someone shares a code review or asks for help, teammates get notified right away
•	Multi-User Analysis: Several people can analyze the same codebase simultaneously and share insights

How Networking Requirements Will Be Met:
Real-Time Communication: I'll implement WebSocket connections using Socket.io to enable instant communication between users. When one person makes a comment or starts an analysis, everyone in the session sees it happen live - no refreshing needed.

API Integration & Microservices: I'll break my current single backend into smaller services:
•	User Authentication Service (handles login/logout for teams)
•	Code Analysis Service (the AI analysis engine I already built)
•	Collaboration Service (manages real-time sessions and comments)
•	Notification Service (sends updates when teammates need help)

Network Protocols & Data Exchange: I'll use a combination of HTTP REST APIs for standard operations (saving projects, user management) and WebSocket protocols for real-time features (live chat, instant code updates, collaborative cursors showing where teammates are looking).

Multi-User Architecture: I'll design the system so multiple developers can work on the same code review without conflicts. Each person gets their own "view" but can see what others are doing through live updates and shared state management.

Integration Strategy: Instead of rebuilding everything, I'm adding a collaboration layer on top of my existing Module 1 + Module 2 foundation. My code analysis engine stays the same, but now the results get shared with the whole team instead of just one person. Think of it like turning a single-player game into multiplayer - the core game stays the same, but now friends can play together.



3.	Create a detailed schedule using the table below to complete your selected module during this Sprint.  Include the task and duration for each day.  You are expected to spend 24 hours every Sprint working on this individual module and other activities in the course.  Time spent on this individual module should be at least 12 hours.

	First Week of Sprint	Second Week of Sprint
Monday	Learn WebSocket basics and Socket.io setup (2 hours)
Plan real-time architecture for my existing app (1 hour)	Build team dashboard showing active users (2 hours)
Add user presence indicators (online/offline) (1 hour)

Tuesday	Set up Socket.io server with my Express backend (2 hours)
Create basic real-time connection testing (1 hour)	Implement collaborative code commenting system (2 hours)
Test multi-user comment synchronization (1 hour)
Wednesday	Build real-time session management (1 hour)
Allow users to create and join code review rooms (2 hours)	Add instant notifications for team activities (2 hours)
Build simple team chat for code discussions (1 hour)
Thursday	Implement live code sharing between users (2 hours)
Sync analysis results across all session members (1 hour)	Polish real-time UI with loading states and animations (2 hours)
Add error handling for connection issues (1 hour)
Friday	Add collaborative cursors and user indicators (2 hours)
Test with multiple browser windows (simulate users) (1 hour)	Comprehensive testing with multiple devices (1 hour)
Performance optimization for many concurrent users (2 hours)
Saturday	Debug any connection or synchronization issues (1 hour)
Plan deployment strategy for real-time features (1 hour)	Record demo video showing team collaboration (2 hours)
Final deployment and documentation (1 hour)


4.	Identify at least two risks that you feel will make it difficult to succeed in this module.  Identify an action plan to overcome each of these risks.
Risk #1: Real-Time Features Are Complex and New to Me
I've never built anything with WebSockets or real-time communication before. Managing multiple users, keeping everyone synchronized, and handling connection drops seems really complicated. I'm worried I might get overwhelmed trying to make everything work together smoothly.
Action Plan:
•	Start with the simplest possible real-time feature - just showing who's online in a session
•	Use Socket.io library instead of raw WebSockets since it handles most complexity automatically
•	Test with just 2 users (two browser windows) before trying to support many people
•	Build one real-time feature completely before adding the next one
•	Focus on basic functionality first - fancy features like collaborative cursors can come later
•	If struggling by Wednesday of Week 1, simplify to just real-time chat without complex code synchronization
•	Watch Socket.io tutorials and follow their official documentation step-by-step

Risk #2: Keeping Multiple Users Synchronized Without Breaking Everything
My current app works great for one person, but when multiple people start using it simultaneously, I'm worried about data conflicts, users seeing different information, or the whole system getting confused about who did what.
Action Plan:
•	Create a separate git branch to protect my working Module 1 + 2 code
•	Design simple rules for who can do what (maybe only one person can run analysis at a time)
•	Use my existing database to store session state so if connections drop, users can rejoin
•	Implement basic conflict resolution - if two people try to do the same thing, the first one wins
•	Test thoroughly with multiple browser tabs before involving other real people
•	Keep detailed logs of what each user does so I can debug synchronization problems
•	Start with read-only collaborative features (watching someone else's analysis) before allowing everyone to make changes
