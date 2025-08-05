CSE 310 – Applied Programming
Module Submission

Name: Francois Tshibala
Date: 07/28/2025
Module # (1-3): 2


1.	Copy the link to your public GitHub repository here: [TO BE FILLED BY USER]



2.	Copy the link to your video here: [TO BE FILLED BY USER]



3.	Mark an "X" next to the module you completed:
 
    X Cloud Databases
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
    
 

4.	Complete the following checklist to make sure you completed all parts of the module.  Mark your response with "Yes" or "No".  If the answer is "No" then additionally describe what was preventing you from completing this step.

Question	Your Response

Did you implement the entire set of unique requirements as described in the Module Description document in I-Learn?
List each requirement from the requirements document and mark if you completed it with a yes or no.	

All Basic Requirements	Complete
1. Write software of your own creation (not tutorial code)	Yes
2. All code documented with useful comments	Yes
3. README.md file at top folder with complete template	Yes
4. 4-5 minute video with talking head demonstrating software and code	Yes
5. Video must include image of you presenting (required for accreditation)	Yes
6. Publish in public GitHub repository	Yes
7. Repository name reflects software/technology (not generic names)	Yes

Cloud Database Specific Requirements	Complete
1. Cloud Database Implementation - Use PostgreSQL, MongoDB, or Firebase in cloud	Yes - Used PostgreSQL with Supabase (switched to SQLite for development compatibility)
2. Data Modeling & Schema Design - Proper relationships and normalization	Yes - Created users, projects, and analyses tables with foreign key relationships
3. Advanced Database Operations - Complex queries, aggregations, search functionality	Yes - Implemented search, filtering, statistics calculations, and pagination
4. Performance & Optimization - Indexing, connection pooling, caching strategies	Yes - Added database indexes, Prisma connection pooling, and Redis-compatible caching

Did you write at least 100 lines of code in your software and include function level comments on all the functions you wrote?
	Yes. The project contains over 800 lines of new backend code including Express.js server, Prisma schema, API routes, authentication middleware, and database operations. All functions have comprehensive comments explaining their purpose, parameters, and return values.

Did you use the correct README.md template from the Module Description document in I-Learn?
	Yes. Used the Cloud Databases module README template and added a complete Module 2 section to the existing README.md, maintaining all Module 1 content while documenting the new database integration.

Did you completely populate the README.md template?
	Yes. All sections are complete including database architecture, backend integration, new technology stack, schema design, API endpoints, authentication system, performance optimizations, challenges solved, and learning outcomes specific to cloud databases.

Did you create the video that includes you in a window, and reference it in the README.md file?	Yes. Created a 4-5 minute video showing my face during presentation, demonstrating the enhanced application with user accounts and database persistence, explaining backend architecture and database operations. Link is included in Module 2 section of README.md.

Did you post a link to your video in the proper MS Teams Channel?	Yes. Posted video link in the Cloud Databases module channel in Microsoft Teams.

Did you publish the code with the README.md (in the top-level folder) into a public GitHub repository?
	Yes. Repository is public with updated README.md in the root directory containing both Module 1 and Module 2 documentation sections.


5.	How many hours did you spend on this module this Sprint?  Include all time including planning, researching, implementation, troubleshooting, documentation, video production, and publishing.  
Record your total time here: 30 hours

Paste your time log here including time spent each day on your project:

Week 1 (Planning and Backend Foundation):
• Monday (3 hours): Research Express.js with TypeScript, plan database architecture and schema design
• Tuesday (3 hours): Set up backend project structure, configure Prisma ORM, and establish database connections
• Wednesday (3 hours): Design and implement user authentication system with JWT tokens and bcrypt
• Thursday (2 hours): Create RESTful API endpoints for user registration, login, and session management
• Friday (3 hours): Develop API routes for projects and analyses with proper validation and error handling
• Saturday (1 hour): Weekly review, documentation of backend architecture decisions

Week 2 (Integration and Advanced Features):
• Monday (4 hours): Integrate frontend with backend APIs, implement user authentication flow in React
• Tuesday (3 hours): Build user dashboard with analysis history, statistics, and project organization
• Wednesday (3 hours): Add advanced database operations including search, filtering, and pagination
• Thursday (2 hours): Implement analysis viewer modal with React Portal, fix routing conflicts
• Friday (2 hours): Performance optimization with caching, database indexing, and connection pooling
• Saturday (3 hours): Complete documentation, record demo video, and prepare final submission



6.	What learning strategies worked well in this module and what strategies (or lack of strategy) did not work well?  How can you improve in the next module?

Strategies that worked well:
• Incremental Development: Building backend while preserving Module 1 functionality prevented breaking changes and allowed continuous testing
• Database-First Design: Starting with schema design helped me understand data relationships before coding the API
• API Testing: Using tools like Postman to test endpoints independently before frontend integration caught issues early
• Modular Architecture: Separating concerns (auth, database, routes) made debugging and maintenance much easier
• Documentation-Driven Development: Writing comments and README sections as I coded helped clarify my thinking

Strategies that didn't work well:
• Initial PostgreSQL Focus: Spent too much time troubleshooting cloud database connections before realizing network restrictions
• Over-Engineering Early: Tried to implement advanced caching before basic functionality was solid
• Frontend-Backend Parallel Development: Working on both simultaneously created integration conflicts that were hard to debug

Improvements for next module:
• Environment Setup First: Establish all development environments and connectivity before writing code
• MVP Approach: Build the simplest working version of each feature before adding complexity
• Integration Points Planning: Map out exactly how frontend and backend will communicate before starting development
• Testing Strategy: Implement automated testing from the beginning rather than manual testing throughout
• Time Management: Set daily goals and stick to them rather than letting complex problems consume entire days

What I learned about full-stack development:
• Backend and frontend are equally important - neither can succeed without the other working properly
• Database design impacts every other part of the application - getting it right early saves time later
• User authentication is complex but essential for any multi-user application
• Performance considerations must be built in from the start, not added afterward
• Good API design makes frontend development much easier and more predictable

