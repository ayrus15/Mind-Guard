# MindGuard AI

A comprehensive mental health support platform powered by AI, featuring real-time emotion detection, intelligent chatbot interactions, and personalized mental wellness tools.

![Build Status](https://github.com/ayrus15/Mind-Guard/workflows/CI%2FCD%20Pipeline/badge.svg)
![Security Scan](https://github.com/ayrus15/Mind-Guard/workflows/Security%20Scan/badge.svg)

## 🌟 Features

### Core Functionality
- **AI-Powered Chatbot**: Advanced Groq AI integration with CBT-based conversational support and sentiment analysis
- **Real-time Emotion Detection**: Webcam-based emotion recognition using TensorFlow.js
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Real-time Communication**: WebSocket-powered chat and emotion data streaming
- **Data Visualization**: Interactive charts for emotional wellness tracking
- **Crisis Detection**: AI-powered crisis risk assessment with emergency contact system

### Security Features
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: XSS and injection attack prevention
- **HTTPS Enforcement**: Secure communication in production
- **CORS Protection**: Restricted cross-origin requests
- **Content Security Policy**: Browser-level security headers

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Styled Components
- **Forms**: React Hook Form with Yup validation
- **Real-time**: Socket.io Client
- **AI/ML**: TensorFlow.js, Face Landmarks Detection
- **Charts**: Recharts
- **Notifications**: React Toastify
- **Testing**: Vitest, React Testing Library

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **AI Integration**: Groq API with advanced mental health prompting
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest

#### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky
- **Security Scanning**: Trivy vulnerability scanner
- **E2E Testing**: Cypress

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher) OR Docker
- npm or yarn

### Local Development Setup

#### Option 1: Traditional Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayrus15/Mind-Guard.git
   cd Mind-Guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Environment Setup**
   
   Copy and configure environment files:
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env
   
   # Backend
   cp backend/.env.example backend/.env
   ```
   
   Update the environment variables with your configuration.

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb mindguard
   
   # Run migrations (once implemented)
   cd backend && npm run migration:run
   ```

5. **Start Development Servers**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   
   # Or individually:
   npm run dev:frontend  # Frontend on http://localhost:5173
   npm run dev:backend   # Backend on http://localhost:5000
   ```

#### Option 2: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayrus15/Mind-Guard.git
   cd Mind-Guard
   ```

2. **Start with Docker Compose**
   ```bash
   # For development
   docker-compose -f docker-compose.dev.yml up --build

   # For production simulation
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Backend API on port 5000
   - Frontend on port 8080 (production) or 5173 (development)

3. **Access the application**
   - Frontend: http://localhost:8080 (production) or http://localhost:5173 (dev)
   - Backend API: http://localhost:5000
   - Database: localhost:5432

## 📁 Project Structure

```
mindguard-ai/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route-level components
│   │   ├── services/       # API and external service calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts (auth, theme, etc.)
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # Global styles and theme
│   └── public/             # Static assets
├── backend/                 # Express TypeScript backend
│   ├── src/
│   │   ├── routes/         # Express route definitions
│   │   ├── controllers/    # Route handlers and business logic
│   │   ├── models/         # Database models (TypeORM entities)
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Helper functions and utilities
│   │   └── config/         # Configuration files
│   └── migrations/         # Database migrations
└── docs/                   # Project documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend       # Start frontend only
npm run dev:backend        # Start backend only

# Building
npm run build              # Build both applications
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Testing
npm run test               # Run all tests
npm run test:backend       # Backend unit tests
npm run test:frontend      # Frontend component tests
npm run test:e2e           # End-to-end tests (requires apps running)
npm run test:e2e:open      # Open Cypress test runner

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors
npm run prettier           # Check code formatting
npm run prettier:fix       # Fix code formatting
```

### Testing Strategy

#### Backend Testing (Jest + Supertest)
```bash
cd backend
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Generate coverage report
```

Our backend tests cover:
- API endpoint validation
- Authentication middleware
- Input sanitization
- Rate limiting
- Crisis assessment logic

#### Frontend Testing (Vitest + React Testing Library)
```bash
cd frontend
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Generate coverage report
```

Our frontend tests cover:
- Component rendering
- User interactions
- Form validations
- Protected routes
- Error handling

#### End-to-End Testing (Cypress)
```bash
# Start the application first
npm run dev

# In another terminal
npm run test:e2e          # Run E2E tests headlessly
npm run test:e2e:open     # Open Cypress GUI
```

E2E tests cover:
- Complete authentication flows
- Chat functionality
- Emotion detection features
- Crisis assessment workflow
- Multi-page navigation

### Code Quality Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit quality checks
- **TypeScript**: Static type checking

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MindGuard AI
```

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindguard
DB_USER=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# External APIs
OPENAI_API_KEY=your-openai-api-key

# Security (Production)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

### Production Environment Variables
For production deployment, ensure these additional variables are set:
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-production-jwt-secret-256-bit
JWT_REFRESH_SECRET=your-production-refresh-secret-256-bit
FRONTEND_URL=https://your-domain.com
```

## 🐳 Docker Deployment

### Development with Docker
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production with Docker
```bash
# Build and start production services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v
```

### Individual Container Commands
```bash
# Build backend image
docker build -t mindguard-backend ./backend

# Build frontend image
docker build -t mindguard-frontend ./frontend

# Run backend container
docker run -p 5000:5000 --env-file ./backend/.env mindguard-backend

# Run frontend container
docker run -p 8080:8080 mindguard-frontend
```

## 🚀 Deployment

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline that:

1. **Code Quality Checks**
   - Runs ESLint and Prettier
   - Type checking with TypeScript
   - Security vulnerability scanning

2. **Testing**
   - Backend unit tests with Jest
   - Frontend component tests with Vitest
   - Test coverage reporting

3. **Building**
   - Builds both applications
   - Creates optimized production bundles
   - Generates build artifacts

4. **Docker Images**
   - Builds Docker images for production
   - Pushes to GitHub Container Registry
   - Multi-platform support

5. **Deployment**
   - Staging deployment (develop branch)
   - Production deployment (main branch)
   - Environment-specific configurations

### Manual Deployment Options

#### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create applications
heroku create mindguard-backend
heroku create mindguard-frontend

# Set environment variables
heroku config:set NODE_ENV=production --app mindguard-backend
heroku config:set JWT_SECRET=your-secret --app mindguard-backend

# Deploy backend
git subtree push --prefix backend heroku main

# Deploy frontend
git subtree push --prefix frontend heroku main
```

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init mindguard-app

# Create environment
eb create production

# Deploy
eb deploy
```

#### Digital Ocean App Platform
1. Connect your GitHub repository
2. Configure build settings:
   - Backend: `cd backend && npm run build`
   - Frontend: `cd frontend && npm run build`
3. Set environment variables in the dashboard
4. Deploy with automatic builds on push

### SSL/HTTPS Setup

#### Using Let's Encrypt with Nginx
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### Using Cloudflare
1. Add your domain to Cloudflare
2. Update DNS settings
3. Enable "Full (strict)" SSL mode
4. Enable automatic HTTPS redirects

## 🔒 Security Considerations

### Production Security Checklist

- [ ] **Environment Variables**
  - [ ] Use strong, unique JWT secrets (256-bit minimum)
  - [ ] Set secure database passwords
  - [ ] Configure proper CORS origins
  - [ ] Enable HTTPS enforcement

- [ ] **Rate Limiting**
  - [ ] Authentication endpoints: 5 requests/15 minutes
  - [ ] General API: 100 requests/15 minutes
  - [ ] Crisis endpoints: 20 requests/5 minutes

- [ ] **Database Security**
  - [ ] Use connection pooling
  - [ ] Enable SSL for database connections
  - [ ] Regular backups and encryption
  - [ ] Principle of least privilege for DB users

- [ ] **Input Validation**
  - [ ] All user inputs sanitized
  - [ ] File upload restrictions
  - [ ] SQL injection prevention
  - [ ] XSS protection enabled

- [ ] **Infrastructure Security**
  - [ ] Regular security updates
  - [ ] Firewall configuration
  - [ ] Intrusion detection
  - [ ] Log monitoring and alerting

### Security Features Implemented

1. **Rate Limiting**: Prevents brute force attacks and API abuse
2. **Input Sanitization**: Protects against XSS and injection attacks
3. **CORS Protection**: Restricts cross-origin requests to allowed domains
4. **Helmet Security Headers**: Adds various HTTP security headers
5. **JWT Authentication**: Stateless authentication with refresh tokens
6. **Content Security Policy**: Browser-level security policies
7. **HTTPS Enforcement**: Redirects HTTP to HTTPS in production

### Monitoring and Alerting

For production environments, implement:
- **Application Performance Monitoring** (APM)
- **Error tracking** (Sentry, Rollbar)
- **Security monitoring** (Fail2ban, intrusion detection)
- **Uptime monitoring** (Pingdom, UptimeRobot)
- **Log aggregation** (ELK stack, Splunk)

## 📊 Performance Optimization

### Backend Optimizations
- Connection pooling for database
- Redis caching for session data
- Compression middleware for responses
- Async/await for non-blocking operations
- Database query optimization

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Service worker for caching
- Bundle size optimization
- CDN for static assets

## 🏗️ API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user profile

### Chat Endpoints
- WebSocket namespace: `/chat`
- Events: `message`, `response`, `typing`

### Emotion Detection
- WebSocket namespace: `/emotion`
- Events: `emotion_data`, `emotion_history`

### Crisis Management
- `POST /crisis/assess` - Assess crisis risk level
- `POST /crisis/alert` - Send crisis alert

### Analytics
- `GET /analytics/mood-trends` - Get mood trend data
- `GET /analytics/usage-stats` - Get usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Review Process
- All changes require review before merging
- Automated CI/CD checks must pass
- Security considerations must be addressed
- Performance impact should be evaluated

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Important Notes

### Privacy & Security
- This application handles sensitive mental health data
- Ensure proper security measures in production
- Follow HIPAA guidelines if applicable
- Implement proper data encryption and storage

### AI/ML Considerations
- Emotion detection requires camera permissions
- TensorFlow.js models need proper browser support
- Consider offline functionality for core features

## 📞 Support

For support, email [your-email] or create an issue in this repository.

## 🙏 Acknowledgments

- TensorFlow.js team for face detection models
- React and Express.js communities
- Mental health advocacy organizations

---

**Note**: This is an educational project. For production use in healthcare settings, ensure compliance with relevant regulations and consult with medical professionals.