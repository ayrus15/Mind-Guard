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

// Load environment variables
dotenv.config();

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
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MindGuard AI Backend is running!' });
});

app.use('/auth', authRoutes);
app.use('/mood', moodRoutes);
app.use('/crisis', crisisRoutes);
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