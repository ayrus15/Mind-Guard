import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import moodRoutes from './routes/mood';
import crisisRoutes from './routes/crisis';
import analyticsRoutes from './routes/analytics';
import { errorHandler, notFound } from './middleware/errorHandler';
import { setupChatNamespace } from './controllers/chatController';
import { setupEmotionNamespace } from './controllers/emotionController';
import { apiLimiter, authLimiter, crisisLimiter } from './middleware/rateLimiter';
import { sanitizeInput, validateEnvironment } from './middleware/security';

// Load environment variables
dotenv.config();

// Validate critical environment variables
validateEnvironment();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:5173"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, desktop apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply security middleware
app.use(sanitizeInput);
app.use(apiLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MindGuard AI Backend is running!' });
});

app.use('/auth', authLimiter, authRoutes);
app.use('/mood', moodRoutes);
app.use('/crisis', crisisLimiter, crisisRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Setup Socket.IO namespaces
setupChatNamespace(io);
setupEmotionNamespace(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    const databaseConnected = await initializeDatabase();
    
    // Initialize demo data if database is not connected
    if (!databaseConnected) {
      const { demoStorage } = await import('./utils/demoStorage');
      await demoStorage.initializeDemo();
    }
    
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      if (!databaseConnected) {
        console.log('⚠️  Running in DEMO MODE without database connection');
        console.log('💡 To enable full functionality, set up PostgreSQL and update .env file');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };