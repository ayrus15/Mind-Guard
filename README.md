# MindGuard AI

A comprehensive mental health support platform powered by AI, featuring real-time emotion detection, intelligent chatbot interactions, and personalized mental wellness tools.

## 🌟 Features

### Core Functionality
- **AI-Powered Chatbot**: CBT-based conversational support with sentiment analysis
- **Real-time Emotion Detection**: Webcam-based emotion recognition using TensorFlow.js
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Real-time Communication**: WebSocket-powered chat and emotion data streaming
- **Data Visualization**: Interactive charts for emotional wellness tracking

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

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **Security**: Helmet, CORS

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

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

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors
npm run prettier           # Check code formatting
npm run prettier:fix       # Fix code formatting

# Testing (when implemented)
npm run test               # Run all tests
npm run test:frontend      # Frontend tests
npm run test:backend       # Backend tests
```

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
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindguard
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI (for GPT integration)
OPENAI_API_KEY=your-openai-api-key
```

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