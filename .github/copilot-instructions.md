# Copilot Instructions for RankUp Client

## Project Overview

This is a TypeScript/JavaScript web application built with Lit web components and organized as a monorepo using Yarn workspaces.

## Project Structure

### Workspace Organization
This is a monorepo with three workspaces:
- `packages/app` - Main application package containing pages, elements, and routing
- `packages/samba` - Component library with reusable UI components (toggle-input, overlay, load-spinner, progress-bar, etc.)
- `packages/common` - Shared utilities and common code

### Technology Stack
- **Language**: TypeScript (with some JavaScript files)
- **Framework**: Lit 2.x for web components
- **Package Manager**: Yarn 3.0.1
- **Module System**: ESNext modules
- **Dev Tools**: Web Test Runner, Rollup, ESLint, Prettier

## Code Style and Standards

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Experimental decorators enabled for Lit components
- Target: ESNext
- Module resolution: Node

### Code Formatting
- **Prettier** configuration:
  - Print width: 100 characters
  - Single quotes
  - Tabs for indentation
  - Semicolons required
  - Arrow parens: avoid
  - Trailing commas: all

### Linting Rules
- ESLint with `@open-wc` configuration
- TypeScript ESLint rules enabled
- Import sorting with `simple-import-sort` plugin
- Console statements allowed
- Promise rules relaxed (`catch-or-return` and `always-return` disabled)
- Import extensions required (`.ts`, `.js`)

## Development Commands

### Starting the Application
```bash
npm start  # or yarn start
# Runs dev server with hot reload (from packages/app)
```

### Validation
```bash
npm run validate  # or yarn validate
# Runs TypeScript type checking and ESLint
```

### Legacy Commands (prefixed with OLD_)
These commands are deprecated but still present:
- `OLD_test`, `OLD_test:watch` - Testing commands
- `OLD_build` - Build command
- `OLD_start:build` - Production server
- `OLD_analyze` - Custom elements analysis

## Component Development

### Lit Components
- Use TypeScript for all new components
- Follow Lit 2.x patterns with decorators
- Components should be self-contained web components
- Use shadow DOM when appropriate

### File Extensions
- Always include file extensions in imports (`.ts`, `.js`)
- This is enforced by ESLint rules

### Import Sorting
- Imports are automatically sorted by `simple-import-sort`
- External packages first, then internal modules

## Authentication
The app uses Amazon Cognito Identity JS for authentication. There are separate apps:
- `rk-app.ts` - Authenticated application
- `rk-unauthenticated-app.ts` - Unauthenticated views

## Testing
- Uses Web Test Runner (`@web/test-runner`)
- Test files should be in `test` directories
- TypeScript needs to be compiled before running tests

## Build Process
- Rollup for bundling
- TypeScript compilation to dist directory
- Service worker support via rollup-plugin-workbox

## Important Notes
- This is a private repository (not published to npm)
- Node version: 16.16.0 (specified in `.nvmrc`)
- Husky git hooks configured for pre-commit checks
- Custom elements manifest generation via `@custom-elements-manifest/analyzer`

## When Making Changes
1. Follow existing code style and patterns
2. Maintain workspace separation (app, samba, common)
3. Run validation before committing
4. Keep TypeScript strict mode compliance
5. Use existing component patterns from samba package when possible
6. Include file extensions in all import statements
7. Don't modify `OLD_*` scripts unless specifically requested
