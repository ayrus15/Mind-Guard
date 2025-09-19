import React from 'react';
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
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const UserInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  strong {
    min-width: 120px;
    color: #555;
  }
`;

const EmergencyContacts = styled.div`
  margin-top: 2rem;
`;

const ContactCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
`;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Profile</Title>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </Header>

      <Card>
        <UserInfo>
          <h2>User Information</h2>
          <InfoRow>
            <strong>Name:</strong>
            <span>{user.name}</span>
          </InfoRow>
          <InfoRow>
            <strong>Email:</strong>
            <span>{user.email}</span>
          </InfoRow>
          <InfoRow>
            <strong>Member Since:</strong>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </InfoRow>
        </UserInfo>

        {user.emergencyContacts && user.emergencyContacts.length > 0 && (
          <EmergencyContacts>
            <h3>Emergency Contacts</h3>
            {user.emergencyContacts.map((contact, index) => (
              <ContactCard key={index}>
                <InfoRow>
                  <strong>Name:</strong>
                  <span>{contact.name}</span>
                </InfoRow>
                <InfoRow>
                  <strong>Phone:</strong>
                  <span>{contact.phone}</span>
                </InfoRow>
                <InfoRow>
                  <strong>Relationship:</strong>
                  <span>{contact.relationship}</span>
                </InfoRow>
              </ContactCard>
            ))}
          </EmergencyContacts>
        )}
      </Card>
    </Container>
  );
};

export default ProfilePage;