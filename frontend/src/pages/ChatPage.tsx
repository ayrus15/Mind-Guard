import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { getSentimentEmoji } from '../utils/sentiment';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
`;

const ConnectionStatus = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  background: ${props => props.isUser ? '#667eea' : 'white'};
  color: ${props => props.isUser ? 'white' : '#333'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  line-height: 1.5;

  ${props => props.isUser ? `
    border-bottom-right-radius: 0.5rem;
  ` : `
    border-bottom-left-radius: 0.5rem;
  `}
`;

const MessageMeta = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SentimentIndicator = styled.span`
  font-size: 1rem;
`;

const TypingIndicator = styled.div`
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 1.5rem;
  border-bottom-left-radius: 0.5rem;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-style: italic;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 2px;
  
  span {
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

const InputContainer = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
`;

const InputForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  max-height: 120px;
  min-height: 50px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const ChatPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, sendMessage, isConnected, isTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <Header>
        <Title>MindGuard AI Chat</Title>
        <ConnectionStatus connected={isConnected}>
          <StatusDot connected={isConnected} />
          {isConnected ? 'Connected' : 'Connecting...'}
        </ConnectionStatus>
      </Header>

      <ChatContainer>
        <MessagesContainer>
          {messages.length === 0 && (
            <WelcomeMessage>
              <h3>Welcome to MindGuard AI</h3>
              <p>
                I'm here to provide mental health support using cognitive behavioral therapy 
                techniques. Feel free to share what's on your mind, and I'll do my best to 
                help you work through your thoughts and feelings.
              </p>
            </WelcomeMessage>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} isUser={message.isUser}>
              {message.isUser ? message.message : message.response}
              <MessageMeta>
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                {message.sentimentScore !== undefined && message.isUser && (
                  <SentimentIndicator>
                    {getSentimentEmoji(message.sentimentScore)}
                  </SentimentIndicator>
                )}
              </MessageMeta>
            </MessageBubble>
          ))}

          {isTyping && (
            <TypingIndicator>
              MindGuard AI is typing
              <TypingDots>
                <span></span>
                <span></span>
                <span></span>
              </TypingDots>
            </TypingIndicator>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <InputForm onSubmit={handleSubmit}>
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={!isConnected}
            />
            <SendButton 
              type="submit" 
              disabled={!inputMessage.trim() || !isConnected}
            >
              Send
            </SendButton>
          </InputForm>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default ChatPage;