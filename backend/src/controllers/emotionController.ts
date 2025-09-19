import { Server, Socket } from 'socket.io';
import { AppDataSource } from '../config/database';
import { Emotion } from '../models/Emotion';
import { demoStorage } from '../utils/demoStorage';

const emotionRepository = AppDataSource.getRepository(Emotion);

interface EmotionData {
  emotion: string;
  confidence: number;
  userId: string;
}

const isDatabaseConnected = () => {
  return AppDataSource.isInitialized;
};

export const setupEmotionNamespace = (io: Server) => {
  const emotionNamespace = io.of('/emotion');

  emotionNamespace.on('connection', (socket: Socket) => {
    console.log('Client connected to emotion detection:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined emotion detection`);
    });

    socket.on('emotion_data', async (data: EmotionData) => {
      try {
        console.log('Received emotion data:', data);

        let emotion;

        if (isDatabaseConnected()) {
          // Database mode
          emotion = emotionRepository.create({
            emotion: data.emotion,
            confidence: data.confidence,
            userId: data.userId,
          });
          await emotionRepository.save(emotion);
        } else {
          // Demo mode
          emotion = await demoStorage.saveEmotion({
            emotion: data.emotion,
            confidence: data.confidence,
            userId: data.userId,
          });
        }

        // Emit confirmation back to user
        socket.emit('emotion_saved', {
          id: emotion.id,
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          timestamp: emotion.timestamp,
        });

        // Broadcast to other connected devices for the same user
        socket.to(`user-${data.userId}`).emit('emotion_update', {
          id: emotion.id,
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          timestamp: emotion.timestamp,
        });

      } catch (error) {
        console.error('Error saving emotion data:', error);
        socket.emit('error', { message: 'Failed to save emotion data' });
      }
    });

    socket.on('get_emotion_history', async (data: { userId: string; limit?: number }) => {
      try {
        let emotions;

        if (isDatabaseConnected()) {
          // Database mode
          emotions = await emotionRepository.find({
            where: { userId: data.userId },
            order: { timestamp: 'DESC' },
            take: data.limit || 50,
          });
        } else {
          // Demo mode
          emotions = await demoStorage.getEmotionsByUserId(data.userId);
          emotions = emotions
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, data.limit || 50);
        }

        socket.emit('emotion_history', emotions);

      } catch (error) {
        console.error('Error fetching emotion history:', error);
        socket.emit('error', { message: 'Failed to fetch emotion history' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from emotion detection:', socket.id);
    });
  });

  return emotionNamespace;
};