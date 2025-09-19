import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import CrisisAssessment from '../components/CrisisAssessment';
import api from '../services/api';

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

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 2rem auto;
`;

const WidgetCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const WidgetTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1rem;
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics?days=30');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Create mock data for demo if API fails
      setAnalytics({
        summary: {
          totalMoodEntries: 0,
          totalEmotions: 0,
          totalConversations: 0,
          averageMoodScore: 0,
          averageSentimentScore: 0,
          mostFrequentEmotion: 'none'
        },
        moodTrends: [],
        emotionDistribution: [],
        sentimentTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e'];

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
          <NavLink to="/mood-journal">Mood Journal</NavLink>
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
          <CardIcon>📝</CardIcon>
          <CardTitle>Mood Journal</CardTitle>
          <CardDescription>
            Track your daily mood and emotional well-being with our interactive 
            mood journal. Add notes and see your mood patterns over time.
          </CardDescription>
          <CardButton to="/mood-journal">Start Journaling</CardButton>
        </Card>

        <Card>
          <CardIcon>📊</CardIcon>
          <CardTitle>Wellness Analytics</CardTitle>
          <CardDescription>
            View your emotional wellness trends, conversation insights, and progress 
            over time with interactive charts and analytics.
          </CardDescription>
          <CardButton to="#analytics" onClick={(e) => {
            e.preventDefault();
            document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' });
          }}>View Analytics</CardButton>
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

      {/* Crisis Assessment Section */}
      <CrisisAssessment />

      {/* Analytics Section */}
      <div id="analytics">
        <Header>
          <Title>Your Wellness Analytics</Title>
          <UserGreeting>Last 30 days overview</UserGreeting>
        </Header>

        {loading ? (
          <WidgetCard>
            <WidgetTitle>Loading analytics...</WidgetTitle>
          </WidgetCard>
        ) : analytics ? (
          <>
            {/* Summary Stats */}
            <AnalyticsGrid>
              <WidgetCard>
                <WidgetTitle>Overall Summary</WidgetTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <StatValue>{analytics.summary.totalMoodEntries}</StatValue>
                    <StatLabel>Mood Entries</StatLabel>
                  </div>
                  <div>
                    <StatValue>{analytics.summary.totalEmotions}</StatValue>
                    <StatLabel>Emotions Tracked</StatLabel>
                  </div>
                  <div>
                    <StatValue>{analytics.summary.averageMoodScore}</StatValue>
                    <StatLabel>Avg Mood Score</StatLabel>
                  </div>
                  <div>
                    <StatValue>{analytics.summary.totalConversations}</StatValue>
                    <StatLabel>Conversations</StatLabel>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard>
                <WidgetTitle>Mood Trends</WidgetTitle>
                <ChartContainer>
                  {analytics.moodTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.moodTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 10]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="averageMood" 
                          stroke="#3498db" 
                          strokeWidth={2}
                          dot={{ fill: '#3498db' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No mood data available. Start tracking your mood to see trends!
                    </div>
                  )}
                </ChartContainer>
              </WidgetCard>

              <WidgetCard>
                <WidgetTitle>Emotion Distribution</WidgetTitle>
                <ChartContainer>
                  {analytics.emotionDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.emotionDistribution}
                          dataKey="count"
                          nameKey="emotion"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                        >
                          {analytics.emotionDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No emotion data available. Use emotion detection to see your emotion patterns!
                    </div>
                  )}
                </ChartContainer>
              </WidgetCard>

              <WidgetCard>
                <WidgetTitle>Sentiment Trends</WidgetTitle>
                <ChartContainer>
                  {analytics.sentimentTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.sentimentTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[-1, 1]} />
                        <Tooltip />
                        <Bar dataKey="averageSentiment" fill="#2ecc71" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No conversation data available. Chat with the AI to see sentiment analysis!
                    </div>
                  )}
                </ChartContainer>
              </WidgetCard>
            </AnalyticsGrid>
          </>
        ) : null}
      </div>
    </Container>
  );
};

export default DashboardPage;