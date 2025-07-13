# Smart Code Reviewer

## Overview
Smart Code Reviewer is an AI-powered web application that analyzes code files and provides intelligent feedback to help developers improve their code quality. Built with TypeScript, this tool combines static code analysis with AI-generated suggestions to deliver comprehensive code reviews.

## Why I Built This
As a developer learning new technologies, I often write code that could be improved but don't always catch the issues myself. I wanted to create a tool that would help me identify problems early and learn better coding practices. This project also aligns with my career goal in AI development, where code quality and type safety are crucial for building reliable systems.

## Purpose
This project was created for CSE 310 to demonstrate mastery of TypeScript while building a practical tool that addresses real developer needs. The application showcases advanced TypeScript features, proper error handling, and integration with modern web technologies.

## Features
- **Multi-language Support**: Analyzes TypeScript, JavaScript, Python, Java, Go, and Rust files
- **Comprehensive Metrics**: Calculates lines of code, cyclomatic complexity, maintainability index, and function count
- **AI-Powered Suggestions**: Generates intelligent recommendations for code improvement using advanced algorithms
- **Issue Detection**: Identifies potential security vulnerabilities, complexity issues, and style problems
- **Professional Reports**: Export detailed analysis reports in Markdown format
- **Drag-and-Drop Interface**: Intuitive file upload with visual feedback
- **Real-time Analysis**: Live progress updates during code analysis
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack
- **Frontend**: React 18 with TypeScript 5.3+
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds
- **Code Analysis**: Custom TypeScript-based analysis engine
- **AI Integration**: Simulated AI service (ready for OpenAI API integration)

## TypeScript Features Demonstrated
- **Advanced Type Safety**: Custom interfaces, union types, and type guards
- **Generic Programming**: Type-safe utility functions and reusable components
- **Utility Types**: Record, Extract, and custom mapped types
- **Error Handling**: Proper async/await patterns with typed error boundaries
- **Modular Architecture**: Clean separation of concerns with TypeScript modules
- **API Integration**: Type-safe service layer patterns

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with ES2020 support

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/francoisthibala/smart-code-reviewer.git
cd smart-code-reviewer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Basic Analysis
1. **Upload a File**: Drag and drop a code file or click to browse
2. **Wait for Analysis**: The app will process your code and generate metrics
3. **Review Results**: Examine the score, metrics, suggestions, and issues
4. **Export Report**: Download a comprehensive analysis report

### Supported File Types
- `.ts` - TypeScript files
- `.js` - JavaScript files  
- `.py` - Python files
- `.java` - Java files
- `.go` - Go files
- `.rs` - Rust files

## Challenges and Solutions

### Challenge 1: Understanding TypeScript Type System
**Problem**: Coming from JavaScript, the strict typing and advanced TypeScript concepts like union types and Record types were initially confusing.
**Solution**: I broke down each concept individually, using TypeScript Playground to test small examples before implementing them in my project. The type safety proved invaluable for catching bugs early.

### Challenge 2: Code Analysis Implementation
**Problem**: Implementing meaningful code analysis without building a full parser was challenging. I needed to balance accuracy with complexity.
**Solution**: I developed a pattern-based analysis system using regular expressions and line-by-line processing. While not as sophisticated as a full AST parser, it provides valuable insights for developers.

### Challenge 3: User Experience Design
**Problem**: Making the interface intuitive while displaying complex analysis data required careful design considerations.
**Solution**: I implemented progressive disclosure - showing the most important information first (score and basic metrics) then allowing users to dive deeper into suggestions and issues.

## Learning Outcomes

### TypeScript Mastery
- **Advanced Type System**: Gained deep understanding of TypeScript's type system, including interfaces, union types, and utility types
- **Error Handling**: Learned proper async/await patterns and error boundary implementation
- **Architecture Patterns**: Implemented service layer and modular design patterns
- **Type Safety Benefits**: Experienced firsthand how TypeScript prevents runtime errors and improves code reliability

### Software Engineering Skills
- **Code Quality**: Understood metrics like cyclomatic complexity and maintainability index
- **Static Analysis**: Learned principles of code analysis and pattern detection
- **User Experience**: Designed intuitive interfaces with proper loading states and feedback
- **Professional Development**: Built a tool that I actually use for my own code reviews

## Demo Video
[🎥 Watch the 4-5 minute demo video](https://youtu.be/KD7koB-YOxw)

The video demonstrates:
- Complete application walkthrough
- Live code analysis with real files
- TypeScript code explanation and architecture
- Key learning outcomes and personal challenges overcome

## Future Enhancements
- **Real AI Integration**: Connect to OpenAI GPT-4 API for advanced suggestions
- **Batch Processing**: Support analyzing multiple files simultaneously
- **Custom Rules**: Allow users to define project-specific analysis rules
- **Team Features**: Multi-user workspaces and shared analysis history

## Contact
**Francois Tshibala**
- GitHub: [@francoistshibala](https://github.com/francoisthibala)
- Email: ftshibala@byui.edu
- LinkedIn: [Francois Tshibala](https://linkedin.com/in/francois-tshibala)

## Acknowledgments
- CSE 310 course materials and instruction
- TypeScript community and documentation
- React and modern web development ecosystem

---

*Built with ❤️ and TypeScript for CSE 310 - Applied Programming*