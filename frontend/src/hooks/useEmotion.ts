import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import type { EmotionData } from '../types';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

interface EmotionPrediction {
  emotion: string;
  confidence: number;
}

interface UseEmotionReturn {
  isDetecting: boolean;
  currentEmotion: EmotionPrediction | null;
  emotionHistory: EmotionData[];
  startDetection: () => Promise<void>;
  stopDetection: () => void;
  error: string | null;
  isConnected: boolean;
}

// Simple emotion classification based on facial landmarks
const classifyEmotion = (landmarks: any): EmotionPrediction => {
  // This is a simplified emotion detection algorithm
  // In a real-world scenario, you'd use a trained neural network
  
  if (!landmarks || landmarks.length === 0) {
    return { emotion: 'neutral', confidence: 0.5 };
  }

  // Get key facial points
  const leftEye = landmarks[0].keypoints.slice(33, 42);
  const rightEye = landmarks[0].keypoints.slice(362, 374);
  const mouth = landmarks[0].keypoints.slice(61, 68);
  
  // Calculate basic features
  const leftEyeHeight = Math.abs(leftEye[1].y - leftEye[5].y);
  const rightEyeHeight = Math.abs(rightEye[1].y - rightEye[5].y);
  const mouthHeight = Math.abs(mouth[1].y - mouth[5].y);
  const mouthWidth = Math.abs(mouth[0].x - mouth[6].x);
  
  const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;
  const mouthRatio = mouthHeight / mouthWidth;
  
  // Simple emotion classification rules
  if (mouthRatio > 0.5 && avgEyeHeight > 10) {
    return { emotion: 'happy', confidence: 0.8 };
  } else if (mouthRatio < 0.3 && avgEyeHeight < 8) {
    return { emotion: 'sad', confidence: 0.7 };
  } else if (avgEyeHeight < 6) {
    return { emotion: 'tired', confidence: 0.6 };
  } else if (mouthRatio > 0.6) {
    return { emotion: 'surprised', confidence: 0.7 };
  } else {
    return { emotion: 'neutral', confidence: 0.6 };
  }
};

export const useEmotion = (videoRef?: React.RefObject<HTMLVideoElement | null>): UseEmotionReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionPrediction | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const detectorRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    // Connect to emotion namespace
    const socket = io(`${socketUrl}/emotion`, {
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to emotion namespace');
      setIsConnected(true);
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from emotion namespace');
      setIsConnected(false);
    });

    socket.on('emotion_saved', (data) => {
      console.log('Emotion saved:', data);
    });

    socket.on('emotion_history', (history: EmotionData[]) => {
      setEmotionHistory(history);
    });

    socket.on('error', (error) => {
      console.error('Emotion socket error:', error);
      setError(error.message);
    });

    // Request emotion history
    socket.emit('get_emotion_history', { userId: user.id, limit: 20 });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  const initializeFaceDetection = async () => {
    try {
      // Initialize TensorFlow.js
      await tf.ready();
      
      // Create face landmarks detector
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs' as const,
        refineLandmarks: true,
      };
      
      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
      console.log('Face detection model loaded');
    } catch (err) {
      console.error('Error loading face detection model:', err);
      setError('Failed to load face detection model');
    }
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      return stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera');
      throw err;
    }
  };

  const detectEmotions = async () => {
    if (!detectorRef.current || !videoRef?.current || !user) return;

    try {
      const predictions = await detectorRef.current.estimateFaces(videoRef?.current);
      
      if (predictions && predictions.length > 0) {
        const emotion = classifyEmotion(predictions);
        setCurrentEmotion(emotion);

        // Send emotion data to backend (throttled to every 2 seconds)
        if (socketRef.current && Math.random() < 0.1) { // 10% chance to reduce spam
          socketRef.current.emit('emotion_data', {
            emotion: emotion.emotion,
            confidence: emotion.confidence,
            userId: user.id,
          });
        }
      } else {
        setCurrentEmotion(null);
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
    }
  };

  const startDetection = async () => {
    try {
      setError(null);
      setIsDetecting(true);

      // Initialize face detection if not already done
      if (!detectorRef.current) {
        await initializeFaceDetection();
      }

      // Start video stream if not already started
      if (!videoRef?.current?.srcObject) {
        await startVideoStream();
      }

      // Start emotion detection loop
      intervalRef.current = setInterval(detectEmotions, 500); // 2 FPS

    } catch (err) {
      setError('Failed to start emotion detection');
      setIsDetecting(false);
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setCurrentEmotion(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef?.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return {
    isDetecting,
    currentEmotion,
    emotionHistory,
    startDetection,
    stopDetection,
    error,
    isConnected,
  };
};