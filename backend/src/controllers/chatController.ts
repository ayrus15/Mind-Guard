import { Server, Socket } from 'socket.io';
import { AppDataSource } from '../config/database';
import { Conversation } from '../models/Conversation';
import { generateCBTResponse } from '../utils/chatbot';
import { analyzeSentiment } from '../utils/sentiment';
import { demoStorage } from '../utils/demoStorage';

const conversationRepository = AppDataSource.getRepository(Conversation);

interface ChatMessage {
  message: string;
  userId: string;
}

const isDatabaseConnected = () => {
  return AppDataSource.isInitialized;
};

export const setupChatNamespace = (io: Server) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket: Socket) => {
    console.log('Client connected to chat:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined chat`);
    });

    socket.on('message', async (data: ChatMessage) => {
      try {
        console.log('Received message:', data);

        // Analyze sentiment
        const sentimentScore = await analyzeSentiment(data.message);

        // Generate CBT-based response
        const response = await generateCBTResponse(data.message, sentimentScore);

        let conversation;

        if (isDatabaseConnected()) {
          // Database mode
          conversation = conversationRepository.create({
            message: data.message,
            response: response,
            sentimentScore: sentimentScore,
            userId: data.userId,
          });
          await conversationRepository.save(conversation);
        } else {
          // Demo mode
          conversation = await demoStorage.saveConversation({
            message: data.message,
            response: response,
            sentimentScore: sentimentScore,
            userId: data.userId,
          });
        }

        // Emit response back to user
        const responseData = {
          id: conversation.id,
          message: data.message,
          response: response,
          sentimentScore: sentimentScore,
          timestamp: conversation.timestamp,
        };

        socket.to(`user-${data.userId}`).emit('response', responseData);
        socket.emit('response', responseData);

      } catch (error) {
        console.error('Error processing chat message:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });

    socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
      socket.to(`user-${data.userId}`).emit('typing', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from chat:', socket.id);
    });
  });

  return chatNamespace;
};