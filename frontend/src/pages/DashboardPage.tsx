import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0;
`;

const UserGreeting = styled.div`
  color: #666;
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const CardButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.3s;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Header>
        <div>
          <Title>MindGuard AI Dashboard</Title>
          <UserGreeting>Welcome back, {user?.name}!</UserGreeting>
        </div>
        <Navigation>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/emotion-detection">Emotion Detection</NavLink>
        </Navigation>
      </Header>

      <Grid>
        <Card>
          <CardIcon>🤖</CardIcon>
          <CardTitle>AI Chatbot</CardTitle>
          <CardDescription>
            Talk to our AI-powered mental health assistant. Get support, guidance, and 
            cognitive behavioral therapy techniques tailored to your needs.
          </CardDescription>
          <CardButton to="/chat">Start Chatting</CardButton>
        </Card>

        <Card>
          <CardIcon>😊</CardIcon>
          <CardTitle>Emotion Detection</CardTitle>
          <CardDescription>
            Use real-time emotion detection to track your emotional state. Our AI 
            analyzes your facial expressions to provide insights into your mood.
          </CardDescription>
          <CardButton to="/emotion-detection">Start Detection</CardButton>
        </Card>

        <Card>
          <CardIcon>📊</CardIcon>
          <CardTitle>Wellness Analytics</CardTitle>
          <CardDescription>
            View your emotional wellness trends, conversation insights, and progress 
            over time with interactive charts and analytics.
          </CardDescription>
          <CardButton to="/analytics">View Analytics</CardButton>
        </Card>

        <Card>
          <CardIcon>👤</CardIcon>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings, emergency contacts, and personalize your 
            MindGuard AI experience to better suit your needs.
          </CardDescription>
          <CardButton to="/profile">View Profile</CardButton>
        </Card>
      </Grid>
    </Container>
  );
};

export default DashboardPage;