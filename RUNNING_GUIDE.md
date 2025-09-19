# 🚀 MindGuard AI - Complete Running Guide

This comprehensive guide will walk you through setting up and running the MindGuard AI mental health platform on your local machine or in production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Recommended - Docker)](#quick-start-recommended---docker)
3. [Traditional Local Setup](#traditional-local-setup)
4. [Testing the Application](#testing-the-application)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free space
- **Internet**: Required for downloading dependencies

### Required Software

#### Option 1: Docker Setup (Recommended)
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download here](https://git-scm.com/downloads)

#### Option 2: Traditional Setup
- **Node.js**: Version 18 or higher ([Download here](https://nodejs.org/))
- **PostgreSQL**: Version 13 or higher ([Download here](https://www.postgresql.org/download/))
- **Git**: [Download here](https://git-scm.com/downloads)
- **npm**: Comes with Node.js

---

## Quick Start (Recommended - Docker)

This is the fastest way to get MindGuard AI running with minimal setup.

### Step 1: Clone the Repository

```bash
git clone https://github.com/ayrus15/Mind-Guard.git
cd Mind-Guard
```

### Step 2: Choose Your Environment

#### For Development (Hot Reloading)
```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up --build
```

#### For Production Simulation
```bash
# Start production-like environment
docker-compose up --build
```

### Step 3: Access the Application

**Development Mode:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

**Production Mode:**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### Step 4: Default Credentials

The application runs in demo mode initially. You can:
- Register a new account through the UI
- Use the chat functionality immediately
- Access emotion detection features

### Step 5: Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down -v
```

---

## Traditional Local Setup

If you prefer to run without Docker or need to develop with direct access to the code.

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/ayrus15/Mind-Guard.git
cd Mind-Guard

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### Step 2: Setup Environment Variables

```bash
# Copy environment templates
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

**Edit `backend/.env`:**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindguard
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Secrets (change these!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Optional: OpenAI API Key for enhanced chat features
OPENAI_API_KEY=your-openai-api-key-here
```

**Edit `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MindGuard AI
```

### Step 3: Setup PostgreSQL Database

#### Option A: Using PostgreSQL locally
```bash
# Create database (assuming PostgreSQL is installed and running)
createdb mindguard

# Or using psql
psql -U postgres -c "CREATE DATABASE mindguard;"
```

#### Option B: Using Docker for database only
```bash
# Run only PostgreSQL in Docker
docker run --name mindguard-postgres \
  -e POSTGRES_DB=mindguard \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Step 4: Start the Application

#### Option A: Start Both Services Together
```bash
# From the root directory
npm run dev
```
This starts both frontend (port 5173) and backend (port 5000) simultaneously.

#### Option B: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/ (should show "MindGuard AI Backend is running!")

---

## Testing the Application

### Running Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run tests in watch mode
cd backend && npm run test:watch
cd frontend && npm run test:watch
```

### End-to-End Testing

```bash
# First, make sure the application is running
npm run dev

# In another terminal, run E2E tests
npm run test:e2e

# Or open Cypress GUI
npm run test:e2e:open
```

### Code Quality

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run prettier

# Fix formatting
npm run prettier:fix
```

---

## Development Workflow

### Making Changes

1. **Start the development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   # OR
   npm run dev
   ```

2. **Make your changes** to the code

3. **Test your changes**:
   ```bash
   npm test
   npm run lint
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Key Development Commands

```bash
# Build applications
npm run build                 # Build both frontend and backend
npm run build:frontend        # Build frontend only
npm run build:backend         # Build backend only

# Development with hot reloading
npm run dev                   # Start both services
npm run dev:frontend          # Start frontend only (port 5173)
npm run dev:backend           # Start backend only (port 5000)

# Testing
npm test                      # Run all tests
npm run test:backend          # Backend unit tests
npm run test:frontend         # Frontend component tests
npm run test:e2e             # End-to-end tests (requires running app)
```

### File Structure Overview

```
Mind-Guard/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route-level components
│   │   ├── contexts/       # React contexts (auth, theme)
│   │   └── services/       # API service calls
│   └── package.json
├── backend/                 # Express TypeScript backend
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── models/         # Database models
│   └── package.json
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
└── package.json            # Root package with workspace scripts
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Error: Port 5000 is already in use

# Solution: Kill the process using the port
lsof -ti:5000 | xargs kill
# OR change the port in backend/.env
PORT=5001
```

#### 2. Database Connection Failed
```bash
# Error: connection to server at "localhost" (127.0.0.1), port 5432 failed

# Solution 1: Ensure PostgreSQL is running
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Solution 2: Check database credentials in backend/.env
# Solution 3: Create the database if it doesn't exist
createdb mindguard
```

#### 3. Module Not Found Errors
```bash
# Error: Cannot find module 'xyz'

# Solution 1: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Solution 2: Clean workspace install
rm -rf node_modules package-lock.json frontend/node_modules backend/node_modules
npm install

# Solution 3: If rollup/build issues persist
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ../backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

#### 4. Docker Issues
```bash
# Error: Docker daemon not running
# Solution: Start Docker Desktop

# Error: Port conflicts in Docker
# Solution: Stop conflicting containers
docker ps                    # List running containers
docker stop <container_id>   # Stop specific container
docker-compose down          # Stop all services
```

#### 5. Frontend Build Errors
```bash
# Error: TypeScript compilation errors or rollup issues

# Solution 1: Clean install dependencies
rm -rf node_modules package-lock.json frontend/node_modules backend/node_modules
npm install

# Solution 2: Check for syntax errors in your code
npm run lint

# Solution 3: Try building with relaxed TypeScript settings (temporary)
cd frontend
npm run build

# Solution 4: If persistent issues with dependencies
npm audit fix --force
npm install
```

### Debug Mode

#### Backend Debug Mode
```bash
cd backend
DEBUG=* npm run dev  # Enable all debug logs
```

#### Frontend Debug Mode
Edit `frontend/.env`:
```env
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Logs and Monitoring

#### View Docker Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f backend
```

#### Application Logs
- **Backend logs**: Console output in the terminal running the backend
- **Frontend logs**: Browser developer console (F12)
- **Database logs**: Check PostgreSQL logs in `/var/log/postgresql/`

---

## Production Deployment

### Environment Preparation

1. **Set production environment variables**:
   ```bash
   # backend/.env
   NODE_ENV=production
   JWT_SECRET=your-256-bit-production-secret
   JWT_REFRESH_SECRET=your-256-bit-production-refresh-secret
   DATABASE_URL=your-production-database-url
   FRONTEND_URL=https://your-domain.com
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

### Docker Production Deployment

```bash
# Build and start production containers
docker-compose up --build -d

# Check container health
docker-compose ps

# View production logs
docker-compose logs -f
```

### Cloud Deployment Options

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create apps
heroku login
heroku create mindguard-backend
heroku create mindguard-frontend

# Set environment variables
heroku config:set NODE_ENV=production --app mindguard-backend
heroku config:set JWT_SECRET=your-secret --app mindguard-backend

# Deploy
git subtree push --prefix backend heroku main
```

#### Docker Registry
```bash
# Build and tag images
docker build -t mindguard-backend ./backend
docker build -t mindguard-frontend ./frontend

# Push to registry (replace with your registry)
docker tag mindguard-backend your-registry/mindguard-backend:latest
docker push your-registry/mindguard-backend:latest
```

---

## Additional Resources

### Documentation Links
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Support and Contributions
- **Issues**: [GitHub Issues](https://github.com/ayrus15/Mind-Guard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ayrus15/Mind-Guard/discussions)
- **Contributing**: See `CONTRIBUTING.md` for guidelines

### Security Notes
- Change default JWT secrets in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly update dependencies
- Follow the security checklist in the main README

---

**🎉 Congratulations!** You should now have MindGuard AI running successfully. If you encounter any issues not covered in this guide, please check the [troubleshooting section](#troubleshooting) or create an issue on GitHub.

## Verification Checklist

After following this guide, you should be able to:

- [ ] Build the application successfully (`npm run build`)
- [ ] Run tests successfully (`npm test`)
- [ ] Access the frontend at http://localhost:5173 (dev) or http://localhost:8080 (prod)
- [ ] Access the backend API at http://localhost:5000
- [ ] See "MindGuard AI Backend is running!" at http://localhost:5000/
- [ ] Register a new user account
- [ ] Login with your credentials
- [ ] Access the dashboard and main features

If any of these steps fail, refer to the [troubleshooting section](#troubleshooting) above.