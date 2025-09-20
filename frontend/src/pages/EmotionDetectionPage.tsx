import React, { useRef } from 'react';
import styled from 'styled-components';
import { useEmotion } from '../hooks/useEmotion';
import { getSentimentEmoji } from '../utils/sentiment';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VideoSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const VideoContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: #000;
  margin-bottom: 1.5rem;
`;

const Video = styled.video`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
`;

const ControlButton = styled.button<{ variant?: 'start' | 'stop' }>`
  background: ${props => props.variant === 'stop' ? '#e74c3c' : '#27ae60'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmotionDisplay = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CurrentEmotion = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const EmotionLabel = styled.h2<{ color: string }>`
  color: ${props => props.color};
  font-size: 2rem;
  margin: 0.5rem 0;
  text-transform: capitalize;
`;

const EmotionEmoji = styled.div`
  font-size: 4rem;
  margin: 1rem 0;
`;

const ConfidenceBar = styled.div`
  background: #ecf0f1;
  border-radius: 1rem;
  height: 1rem;
  margin: 1rem 0;
  overflow: hidden;
`;

const ConfidenceFill = styled.div<{ confidence: number; color: string }>`
  background: ${props => props.color};
  height: 100%;
  width: ${props => props.confidence * 100}%;
  border-radius: 1rem;
  transition: width 0.3s ease;
`;

const ConfidenceText = styled.p`
  color: #666;
  margin: 0.5rem 0;
`;

const StatusIndicator = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

const HistorySection = styled.div`
  grid-column: 1 / -1;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const HistoryTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const HistoryItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  border-left: 4px solid #667eea;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #e74c3c;
`;

const DebugSection = styled.div`
  grid-column: 1 / -1;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 2rem;
`;

const DebugTitle = styled.h3`
  color: #495057;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const DebugGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
`;

const DebugItem = styled.div`
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
`;

const EmotionDetectionPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isDetecting,
    currentEmotion,
    emotionHistory,
    startDetection,
    stopDetection,
    error,
    isConnected,
  } = useEmotion(videoRef);

  const handleStartDetection = async () => {
    try {
      await startDetection();
    } catch (err) {
      console.error('Failed to start detection:', err);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    switch (emotion) {
      case 'happy': return '#f39c12';
      case 'sad': return '#3498db';
      case 'angry': return '#e74c3c';
      case 'surprised': return '#9b59b6';
      case 'neutral': return '#95a5a6';
      case 'tired': return '#34495e';
      default: return '#7f8c8d';
    }
  };

  return (
    <Container>
      <Header>
        <Title>Real-Time Emotion Detection</Title>
        <Subtitle>
          Using advanced AI and computer vision to analyze your facial expressions 
          and track your emotional state in real-time.
        </Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <MainContent>
        <VideoSection>
          <h3>Live Camera Feed</h3>
          <StatusIndicator connected={isConnected}>
            <StatusDot connected={isConnected} />
            {isConnected ? 'Connected to emotion server' : 'Connecting...'}
          </StatusIndicator>
          
          <VideoContainer>
            {isDetecting ? (
              <Video
                ref={videoRef}
                autoPlay
                muted
                playsInline
              />
            ) : (
              <VideoPlaceholder>
                📹 Click "Start Detection" to begin emotion analysis
              </VideoPlaceholder>
            )}
          </VideoContainer>

          <div>
            {!isDetecting ? (
              <ControlButton 
                variant="start" 
                onClick={handleStartDetection}
                disabled={!isConnected}
              >
                Start Detection
              </ControlButton>
            ) : (
              <ControlButton 
                variant="stop" 
                onClick={stopDetection}
              >
                Stop Detection
              </ControlButton>
            )}
          </div>
        </VideoSection>

        <EmotionDisplay>
          <h3>Current Emotion</h3>
          
          {currentEmotion ? (
            <CurrentEmotion>
              <EmotionEmoji>
                {getSentimentEmoji(currentEmotion.emotion === 'happy' ? 0.8 : 
                                  currentEmotion.emotion === 'sad' ? -0.8 : 0)}
              </EmotionEmoji>
              <EmotionLabel color={getEmotionColor(currentEmotion.emotion)}>
                {currentEmotion.emotion}
              </EmotionLabel>
              <ConfidenceBar>
                <ConfidenceFill 
                  confidence={currentEmotion.confidence}
                  color={getEmotionColor(currentEmotion.emotion)}
                />
              </ConfidenceBar>
              <ConfidenceText>
                Confidence: {Math.round(currentEmotion.confidence * 100)}%
              </ConfidenceText>
            </CurrentEmotion>
          ) : (
            <CurrentEmotion>
              <EmotionEmoji>😐</EmotionEmoji>
              <EmotionLabel color="#95a5a6">
                {isDetecting ? 'Detecting...' : 'No Detection'}
              </EmotionLabel>
              <ConfidenceText>
                {isDetecting ? 'Looking for faces...' : 'Start detection to see emotions'}
              </ConfidenceText>
            </CurrentEmotion>
          )}
        </EmotionDisplay>
      </MainContent>

      <HistorySection>
        <HistoryTitle>Recent Emotion History</HistoryTitle>
        {emotionHistory.length > 0 ? (
          <HistoryGrid>
            {emotionHistory.slice(0, 10).map((emotion) => (
              <HistoryItem key={emotion.id}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {getSentimentEmoji(emotion.emotion === 'happy' ? 0.8 : 
                                    emotion.emotion === 'sad' ? -0.8 : 0)}
                </div>
                <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {emotion.emotion}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {Math.round(emotion.confidence * 100)}% confidence
                </div>
                <div style={{ fontSize: '0.7rem', color: '#999' }}>
                  {new Date(emotion.timestamp).toLocaleTimeString()}
                </div>
              </HistoryItem>
            ))}
          </HistoryGrid>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>
            No emotion data recorded yet. Start detection to begin tracking your emotions.
          </p>
        )}
      </HistorySection>

      {/* Debug Panel for Development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugSection>
          <DebugTitle>Debug Information</DebugTitle>
          <DebugGrid>
            <DebugItem>
              <strong>Detection Status:</strong> {isDetecting ? 'Active' : 'Inactive'}
            </DebugItem>
            <DebugItem>
              <strong>Connection:</strong> {isConnected ? 'Connected' : 'Disconnected'}
            </DebugItem>
            <DebugItem>
              <strong>Current Emotion:</strong> {currentEmotion ? 
                `${currentEmotion.emotion} (${(currentEmotion.confidence * 100).toFixed(1)}%)` : 
                'None'}
            </DebugItem>
            <DebugItem>
              <strong>Error:</strong> {error || 'None'}
            </DebugItem>
          </DebugGrid>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
            Check browser console for detailed emotion detection logs including facial feature calculations.
          </div>
        </DebugSection>
      )}
    </Container>
  );
};

export default EmotionDetectionPage;