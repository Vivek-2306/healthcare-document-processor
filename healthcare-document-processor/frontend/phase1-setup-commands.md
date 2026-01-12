# Phase 1: Frontend Setup Commands

## Overview
This document contains all commands needed to set up the frontend React application for Phase 1 of the Healthcare Document Processing System.

## Prerequisites
- Node.js v18+ installed
- npm/yarn/pnpm installed

## 1.1 Initialize React Project

### Check Node.js version
```bash
node --version  # Should be v18 or higher
npm --version   # or yarn --version / pnpm --version
```

### Navigate to project directory
```bash
cd healthcare-document-processor
```

### Create React project with Vite (TypeScript template)
```bash
npm create vite@latest frontend -- --template react-ts
# OR
yarn create vite frontend --template react-ts
# OR
pnpm create vite frontend --template react-ts
```

### Navigate to frontend directory
```bash
cd frontend
```

## 1.2 Install Core Dependencies

### Install React Router DOM
```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### Install React Query (TanStack Query)
```bash
npm install @tanstack/react-query
```

### Install Material-UI (MUI) and dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

### Install Axios for API calls
```bash
npm install axios
```

### Install form libraries
```bash
npm install react-hook-form @hookform/resolvers
npm install yup  # OR zod
# If using zod:
# npm install zod
```

### Install additional utility libraries
```bash
npm install date-fns
npm install react-dropzone
npm install react-pdf
npm install recharts  # OR chart.js (if preferred)
```

### Update package.json scripts (verify these exist)
The following scripts should already be in package.json:
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `lint`: Run ESLint

## 1.3 Configure Development Environment

### Create .env.local file
```bash
# Create .env.local in frontend directory
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Healthcare Document Processor
VITE_APP_VERSION=1.0.0
EOF
```

### Create .env.example file (for reference)
```bash
cat > .env.example << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Healthcare Document Processor
VITE_APP_VERSION=1.0.0
EOF
```

## 1.4 Project Structure Setup

After installing dependencies, create the folder structure manually or use these commands:

### Create main directories
```bash
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/documents
mkdir -p src/components/search
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/contexts
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/theme
mkdir -p src/constants
```

### Create index files for clean imports
```bash
touch src/components/common/index.ts
touch src/components/layout/index.ts
touch src/components/documents/index.ts
touch src/components/search/index.ts
touch src/pages/index.ts
touch src/hooks/index.ts
touch src/services/index.ts
touch src/contexts/index.ts
touch src/utils/index.ts
touch src/types/index.ts
```

## 1.5 Configure TypeScript and Tools

### Verify tsconfig.json exists and update if needed
The Vite template should include a basic tsconfig.json. Verify it includes:
- `strict: true`
- Path aliases configuration

### Install ESLint and Prettier (if not included)
```bash
npm install --save-dev eslint prettier
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Create .prettierrc file
```bash
cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF
```

### Create .eslintrc.cjs (if needed)
```bash
# This should be configured based on your preferences
```

## Summary of All Commands (Quick Reference)

```bash
# 1. Navigate to project
cd healthcare-document-processor

# 2. Create Vite React TypeScript project
npm create vite@latest frontend -- --template react-ts

# 3. Navigate to frontend
cd frontend

# 4. Install all dependencies (run all at once)
npm install react-router-dom @types/react-router-dom @tanstack/react-query \
  @mui/material @emotion/react @emotion/styled @mui/icons-material \
  axios react-hook-form @hookform/resolvers yup \
  date-fns react-dropzone react-pdf recharts \
  eslint prettier eslint-config-prettier eslint-plugin-prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser

# 5. Create folder structure
mkdir -p src/{components/{common,layout,documents,search},pages,hooks,services,contexts,utils,types,theme,constants}
touch src/components/{common,layout,documents,search}/index.ts
touch src/{pages,hooks,services,contexts,utils,types}/index.ts

# 6. Create environment files
echo "VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Healthcare Document Processor
VITE_APP_VERSION=1.0.0" > .env.local

echo "VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Healthcare Document Processor
VITE_APP_VERSION=1.0.0" > .env.example
```

## Next Steps

After completing Phase 1:
1. Verify all dependencies are installed correctly
2. Test that the development server starts: `npm run dev`
3. Verify TypeScript compilation: `npm run build`
4. Proceed to Phase 2: Authentication and User Management