# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

## Code Style Guidelines
- Use functional components with React hooks
- Include JSDoc comments for functions and components
- Follow camelCase for variables/functions, PascalCase for components
- Group imports: React, libraries, local components, styles
- Use async/await with try/catch for error handling
- Ensure consistent error formatting using error helpers
- Use API services module for all backend requests
- Leverage context for global state management
- Cache expensive operations when appropriate

## Project Structure
- Components are organized by feature/page in `/src/components`
- API services centralized in `/src/services/api.js`
- Global state in context providers
- Tailwind for styling (extended with custom colors)