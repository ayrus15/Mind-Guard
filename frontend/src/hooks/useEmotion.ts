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

// Improved emotion classification based on facial landmarks
const classifyEmotion = (landmarks: any): EmotionPrediction => {
  // This is an enhanced emotion detection algorithm using proper MediaPipe landmarks
  
  if (!landmarks || landmarks.length === 0) {
    console.log('No landmarks detected');
    return { emotion: 'neutral', confidence: 0.5 };
  }

  const keypoints = landmarks[0].keypoints;
  if (!keypoints || keypoints.length < 468) {
    console.log('Insufficient keypoints:', keypoints?.length);
    return { emotion: 'neutral', confidence: 0.4 };
  }

  try {
    // MediaPipe Face Mesh landmark indices for key facial features
    const leftEyeCenter = keypoints[159];   // Left eye center
    const rightEyeCenter = keypoints[386];  // Right eye center
    const leftEyeTop = keypoints[159];      // Left eye top
    const leftEyeBottom = keypoints[145];   // Left eye bottom
    const rightEyeTop = keypoints[386];     // Right eye top  
    const rightEyeBottom = keypoints[374];  // Right eye bottom
    
    const leftMouthCorner = keypoints[61];  // Left mouth corner
    const rightMouthCorner = keypoints[291]; // Right mouth corner
    const upperLip = keypoints[13];         // Upper lip center
    const lowerLip = keypoints[14];         // Lower lip center
    
    const leftEyebrow = keypoints[70];      // Left eyebrow
    const rightEyebrow = keypoints[300];    // Right eyebrow

    // Validate that we have all required points
    const requiredPoints = [leftEyeCenter, rightEyeCenter, leftEyeTop, leftEyeBottom, 
                           rightEyeTop, rightEyeBottom, leftMouthCorner, rightMouthCorner, 
                           upperLip, lowerLip, leftEyebrow, rightEyebrow];
    
    if (requiredPoints.some(point => !point || typeof point.x !== 'number' || typeof point.y !== 'number')) {
      console.log('Invalid landmark points detected');
      return { emotion: 'neutral', confidence: 0.3 };
    }

    // Calculate facial features for emotion detection
    const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
    const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y);
    const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;
    
    const mouthWidth = Math.abs(leftMouthCorner.x - rightMouthCorner.x);
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);
    const mouthRatio = mouthWidth > 0 ? mouthHeight / mouthWidth : 0;
    
    // Calculate mouth curvature (smile detection)
    const mouthCenterY = (upperLip.y + lowerLip.y) / 2;
    const leftCornerRelative = leftMouthCorner.y - mouthCenterY;
    const rightCornerRelative = rightMouthCorner.y - mouthCenterY;
    const mouthCurvature = (leftCornerRelative + rightCornerRelative) / 2;
    
    // Calculate eyebrow position (relative to eyes)
    const leftEyebrowDistance = leftEyebrow.y - leftEyeCenter.y;
    const rightEyebrowDistance = rightEyebrow.y - rightEyeCenter.y;
    const avgEyebrowDistance = (leftEyebrowDistance + rightEyebrowDistance) / 2;

    // Debug logging
    console.log('Emotion detection features:', {
      avgEyeHeight: avgEyeHeight.toFixed(2),
      mouthRatio: mouthRatio.toFixed(3),
      mouthCurvature: mouthCurvature.toFixed(2),
      avgEyebrowDistance: avgEyebrowDistance.toFixed(2),
      mouthWidth: mouthWidth.toFixed(2),
      mouthHeight: mouthHeight.toFixed(2)
    });

    // Improved emotion classification rules
    let emotion = 'neutral';
    let confidence = 0.6;

    // Happy: Mouth corners raised (negative curvature) and wider mouth
    if (mouthCurvature < -2 && mouthRatio > 0.03) {
      emotion = 'happy';
      confidence = Math.min(0.9, 0.6 + Math.abs(mouthCurvature) * 0.05);
    }
    // Sad: Mouth corners lowered (positive curvature) and smaller eye height
    else if (mouthCurvature > 1 && avgEyeHeight < 8) {
      emotion = 'sad';
      confidence = Math.min(0.8, 0.5 + mouthCurvature * 0.05);
    }
    // Surprised: Large eye height and open mouth
    else if (avgEyeHeight > 12 && mouthRatio > 0.05) {
      emotion = 'surprised';
      confidence = Math.min(0.85, 0.6 + (avgEyeHeight - 12) * 0.02);
    }
    // Angry: Lowered eyebrows and tense mouth
    else if (avgEyebrowDistance < -5 && mouthRatio < 0.02) {
      emotion = 'angry';
      confidence = Math.min(0.8, 0.6 + Math.abs(avgEyebrowDistance) * 0.02);
    }
    // Tired: Small eye height
    else if (avgEyeHeight < 5) {
      emotion = 'tired';
      confidence = Math.min(0.75, 0.5 + (5 - avgEyeHeight) * 0.05);
    }

    console.log(`Detected emotion: ${emotion} (confidence: ${(confidence * 100).toFixed(1)}%)`);
    
    return { emotion, confidence };

  } catch (error) {
    console.error('Error in emotion classification:', error);
    return { emotion: 'neutral', confidence: 0.3 };
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
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Use front camera
        }
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          
          const onLoadedData = () => {
            console.log('Video stream ready:', {
              width: video.videoWidth,
              height: video.videoHeight,
              readyState: video.readyState
            });
            video.removeEventListener('loadeddata', onLoadedData);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = (err: Event) => {
            console.error('Video loading error:', err);
            video.removeEventListener('loadeddata', onLoadedData);
            video.removeEventListener('error', onError);
            reject(new Error('Video failed to load'));
          };
          
          video.addEventListener('loadeddata', onLoadedData);
          video.addEventListener('error', onError);
        });

        await videoRef.current.play();
        console.log('Video playback started successfully');
      }

      return stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera: ' + (err as Error).message);
      throw err;
    }
  };

  const detectEmotions = async () => {
    if (!detectorRef.current || !videoRef?.current || !user) {
      console.log('Detection requirements not met:', {
        detector: !!detectorRef.current,
        video: !!videoRef?.current,
        user: !!user
      });
      return;
    }

    try {
      // Ensure video is ready
      if (videoRef.current.readyState < 2) {
        console.log('Video not ready, readyState:', videoRef.current.readyState);
        return;
      }

      console.log('Starting face detection...');
      const predictions = await detectorRef.current.estimateFaces(videoRef.current);
      console.log('Face detection result:', predictions?.length || 0, 'faces detected');
      
      if (predictions && predictions.length > 0) {
        console.log('Processing landmarks for emotion detection...');
        const emotion = classifyEmotion(predictions);
        setCurrentEmotion(emotion);

        // Send emotion data to backend (throttled to reduce spam)
        if (socketRef.current && Math.random() < 0.1) { // 10% chance to reduce spam
          console.log('Sending emotion data to backend:', emotion);
          socketRef.current.emit('emotion_data', {
            emotion: emotion.emotion,
            confidence: emotion.confidence,
            userId: user.id,
          });
        }
      } else {
        console.log('No faces detected in frame');
        // Set neutral emotion when no faces detected, instead of null
        setCurrentEmotion({ emotion: 'neutral', confidence: 0.2 });
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
      setError('Emotion detection failed: ' + (err as Error).message);
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