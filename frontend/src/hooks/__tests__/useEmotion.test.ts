// Test emotion detection with mock MediaPipe landmarks
import { describe, it, expect } from 'vitest';

// Mock the classifyEmotion function logic for testing
const classifyEmotion = (landmarks: any) => {
  if (!landmarks || landmarks.length === 0) {
    return { emotion: 'neutral', confidence: 0.5 };
  }

  const keypoints = landmarks[0].keypoints;
  if (!keypoints || keypoints.length < 468) {
    return { emotion: 'neutral', confidence: 0.4 };
  }

  try {
    // MediaPipe Face Mesh landmark indices for key facial features
    const leftEyeCenter = keypoints[159];   
    const rightEyeCenter = keypoints[386];  
    const leftEyeTop = keypoints[159];      
    const leftEyeBottom = keypoints[145];   
    const rightEyeTop = keypoints[386];     
    const rightEyeBottom = keypoints[374];  
    
    const leftMouthCorner = keypoints[61];  
    const rightMouthCorner = keypoints[291]; 
    const upperLip = keypoints[13];         
    const lowerLip = keypoints[14];         
    
    const leftEyebrow = keypoints[70];      
    const rightEyebrow = keypoints[300];    

    // Validate that we have all required points
    const requiredPoints = [leftEyeCenter, rightEyeCenter, leftEyeTop, leftEyeBottom, 
                           rightEyeTop, rightEyeBottom, leftMouthCorner, rightMouthCorner, 
                           upperLip, lowerLip, leftEyebrow, rightEyebrow];
    
    if (requiredPoints.some(point => !point || typeof point.x !== 'number' || typeof point.y !== 'number')) {
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

    return { emotion, confidence };

  } catch (error) {
    return { emotion: 'neutral', confidence: 0.3 };
  }
};

// Helper function to create mock landmarks
const createMockLandmarks = () => {
  const keypoints = new Array(468).fill(null).map(() => ({
    x: 100 + Math.random() * 20,
    y: 100 + Math.random() * 20,
    z: 0
  }));
  
  return [{ keypoints }];
};

// Create specific landmarks for testing emotions
const createHappyLandmarks = () => {
  const landmarks = createMockLandmarks();
  const keypoints = landmarks[0].keypoints;
  
  // Set specific facial features for happy expression
  keypoints[159] = { x: 80, y: 100, z: 0 };   // Left eye center
  keypoints[386] = { x: 120, y: 100, z: 0 };  // Right eye center
  keypoints[145] = { x: 80, y: 105, z: 0 };   // Left eye bottom
  keypoints[374] = { x: 120, y: 105, z: 0 };  // Right eye bottom
  
  // Happy mouth - corners raised, wider
  keypoints[61] = { x: 85, y: 118, z: 0 };    // Left mouth corner (raised)
  keypoints[291] = { x: 115, y: 118, z: 0 };  // Right mouth corner (raised)
  keypoints[13] = { x: 100, y: 120, z: 0 };   // Upper lip
  keypoints[14] = { x: 100, y: 125, z: 0 };   // Lower lip
  
  keypoints[70] = { x: 80, y: 95, z: 0 };     // Left eyebrow
  keypoints[300] = { x: 120, y: 95, z: 0 };   // Right eyebrow
  
  return landmarks;
};

const createSadLandmarks = () => {
  const landmarks = createMockLandmarks();
  const keypoints = landmarks[0].keypoints;
  
  // Set specific facial features for sad expression
  keypoints[159] = { x: 80, y: 100, z: 0 };   // Left eye center
  keypoints[386] = { x: 120, y: 100, z: 0 };  // Right eye center
  keypoints[145] = { x: 80, y: 102, z: 0 };   // Left eye bottom (smaller eyes)
  keypoints[374] = { x: 120, y: 102, z: 0 };  // Right eye bottom
  
  // Sad mouth - corners lowered
  keypoints[61] = { x: 85, y: 125, z: 0 };    // Left mouth corner (lowered)
  keypoints[291] = { x: 115, y: 125, z: 0 };  // Right mouth corner (lowered)
  keypoints[13] = { x: 100, y: 120, z: 0 };   // Upper lip
  keypoints[14] = { x: 100, y: 122, z: 0 };   // Lower lip
  
  keypoints[70] = { x: 80, y: 95, z: 0 };     // Left eyebrow
  keypoints[300] = { x: 120, y: 95, z: 0 };   // Right eyebrow
  
  return landmarks;
};

describe('Emotion Detection', () => {
  it('should detect happy emotion with raised mouth corners', () => {
    const happyLandmarks = createHappyLandmarks();
    const result = classifyEmotion(happyLandmarks);
    
    expect(result.emotion).toBe('happy');
    expect(result.confidence).toBeGreaterThan(0.6);
  });

  it('should detect sad emotion with lowered mouth corners', () => {
    const sadLandmarks = createSadLandmarks();
    const result = classifyEmotion(sadLandmarks);
    
    expect(result.emotion).toBe('sad');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should return neutral for empty landmarks', () => {
    const result = classifyEmotion([]);
    
    expect(result.emotion).toBe('neutral');
    expect(result.confidence).toBe(0.5);
  });

  it('should return neutral for insufficient keypoints', () => {
    const insufficientLandmarks = [{ keypoints: new Array(100).fill({ x: 0, y: 0, z: 0 }) }];
    const result = classifyEmotion(insufficientLandmarks);
    
    expect(result.emotion).toBe('neutral');
    expect(result.confidence).toBe(0.4);
  });

  it('should handle invalid landmarks gracefully', () => {
    const invalidLandmarks = [{ keypoints: null }];
    const result = classifyEmotion(invalidLandmarks);
    
    expect(result.emotion).toBe('neutral');
    expect(result.confidence).toBeLessThanOrEqual(0.5);
  });
});