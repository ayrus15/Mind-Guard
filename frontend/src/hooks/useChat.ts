import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import type { ConversationData } from '../types';

interface ChatMessage extends ConversationData {
  isUser: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isConnected: boolean;
  isTyping: boolean;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    // Connect to chat namespace
    const socket = io(`${socketUrl}/chat`, {
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat namespace');
      setIsConnected(true);
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat namespace');
      setIsConnected(false);
    });

    socket.on('response', (data: ConversationData) => {
      console.log('Received response:', data);
      
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          id: `user-${data.id}`,
          message: data.message,
          response: data.message,
          isUser: true,
        },
      ]);

      // Add bot response after a short delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            id: `bot-${data.id}`,
            message: data.response,
            response: data.response,
            isUser: false,
          },
        ]);
        setIsTyping(false);
      }, 1000);
    });

    socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user.id) {
        setIsTyping(data.isTyping);
      }
    });

    socket.on('error', (error) => {
      console.error('Chat error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  const sendMessage = (message: string) => {
    if (!socketRef.current || !user || !message.trim()) return;

    console.log('Sending message:', message);
    setIsTyping(true);
    
    socketRef.current.emit('message', {
      message: message.trim(),
      userId: user.id,
    });
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isTyping,
  };
};