import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../services/api';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const AssessButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isAssessing'].includes(prop),
})<{ isAssessing: boolean }>`
  background: ${props => props.isAssessing ? '#95a5a6' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.isAssessing ? 'not-allowed' : 'pointer'};
  width: 100%;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    transform: ${props => props.isAssessing ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isAssessing ? 'none' : '0 4px 8px rgba(231, 76, 60, 0.3)'};
  }
`;

const ResultContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['riskLevel'].includes(prop),
})<{ riskLevel: 'low' | 'medium' | 'high' }>`
  background: ${props => {
    switch (props.riskLevel) {
      case 'high': return '#ffe6e6';
      case 'medium': return '#fff8e1';
      case 'low': return '#e8f5e8';
      default: return '#f8f9fa';
    }
  }};
  border: 2px solid ${props => {
    switch (props.riskLevel) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#ddd';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const RiskLevel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['level'].includes(prop),
})<{ level: 'low' | 'medium' | 'high' }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => {
    switch (props.level) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#333';
    }
  }};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const RiskDescription = styled.p`
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const DataSummary = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
`;

const DataPoint = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
`;

const EmergencyModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
`;

const EmergencyButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin: 0.5rem 0;
  transition: all 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const ResourceLink = styled.a`
  display: block;
  color: #3498db;
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CloseButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
`;

interface AssessmentResult {
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  dataAnalyzed: {
    moodEntries: number;
    emotions: number;
    conversations: number;
  };
}

const CrisisAssessment: React.FC = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleAssessment = async () => {
    setIsAssessing(true);
    try {
      const response = await api.post('/crisis/assess');
      const result = response.data as AssessmentResult;
      setAssessmentResult(result);
      
      if (result.riskLevel === 'high') {
        setShowEmergencyModal(true);
        // Automatically send crisis alert for high risk
        await api.post('/crisis/alert', {
          riskLevel: result.riskLevel,
          triggerData: { automatic: true, assessment: result }
        });
      }
      
      toast.success('Risk assessment completed');
    } catch (error) {
      console.error('Error during assessment:', error);
      toast.error('Failed to complete risk assessment');
    } finally {
      setIsAssessing(false);
    }
  };

  const getRiskDescription = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'Your recent activity shows concerning patterns that indicate you may be experiencing significant distress. Please consider reaching out for immediate support.';
      case 'medium':
        return 'Your recent activity shows some concerning patterns. It might be helpful to talk to someone or consider additional support resources.';
      case 'low':
        return 'Your recent activity indicates you are managing well. Keep up the good work with your mental health practices.';
      default:
        return '';
    }
  };

  const emergencyContacts = [
    { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 Crisis Support' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free 24/7 Support' },
    { name: 'Emergency Services', number: '911', description: 'Immediate Emergency' },
  ];

  const resources = [
    { name: 'National Alliance on Mental Illness', url: 'https://nami.org', description: 'Mental health information and support' },
    { name: 'Mental Health America', url: 'https://mhanational.org', description: 'Mental health resources and screening tools' },
    { name: 'Crisis Text Line', url: 'https://crisistextline.org', description: 'Free crisis support via text' },
    { name: 'SAMHSA National Helpline', url: 'https://samhsa.gov', description: 'Treatment referral and information service' },
  ];

  return (
    <>
      <Container>
        <Title>
          🛡️ Crisis Risk Assessment
        </Title>
        <Description>
          This tool analyzes your recent mood entries, emotions, and conversations to assess your current mental health status. 
          If you're in immediate danger, please call 911 or your local emergency services right away.
        </Description>

        <AssessButton 
          onClick={handleAssessment} 
          disabled={isAssessing}
          isAssessing={isAssessing}
        >
          {isAssessing ? 'Analyzing Your Data...' : 'Assess My Current Risk Level'}
        </AssessButton>

        {assessmentResult && (
          <ResultContainer riskLevel={assessmentResult.riskLevel}>
            <RiskLevel level={assessmentResult.riskLevel}>
              Risk Level: {assessmentResult.riskLevel}
            </RiskLevel>
            <RiskDescription>
              {getRiskDescription(assessmentResult.riskLevel)}
            </RiskDescription>
            
            <DataSummary>
              <h4>Data Analyzed:</h4>
              <DataPoint>
                <span>Mood Entries:</span>
                <span>{assessmentResult.dataAnalyzed.moodEntries}</span>
              </DataPoint>
              <DataPoint>
                <span>Emotion Detections:</span>
                <span>{assessmentResult.dataAnalyzed.emotions}</span>
              </DataPoint>
              <DataPoint>
                <span>Conversations:</span>
                <span>{assessmentResult.dataAnalyzed.conversations}</span>
              </DataPoint>
              <DataPoint>
                <span>Assessment Time:</span>
                <span>{new Date(assessmentResult.timestamp).toLocaleString()}</span>
              </DataPoint>
            </DataSummary>

            {assessmentResult.riskLevel !== 'low' && (
              <EmergencyButton onClick={() => setShowEmergencyModal(true)}>
                🚨 View Emergency Resources
              </EmergencyButton>
            )}
          </ResultContainer>
        )}
      </Container>

      {showEmergencyModal && (
        <EmergencyModal onClick={() => setShowEmergencyModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>🚨 Emergency Support Resources</ModalTitle>
            
            <h3>Immediate Help:</h3>
            {emergencyContacts.map((contact, index) => (
              <EmergencyButton 
                key={index}
                onClick={() => window.open(`tel:${contact.number.replace(/\D/g, '')}`)}
              >
                📞 {contact.name}: {contact.number}
                <div style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                  {contact.description}
                </div>
              </EmergencyButton>
            ))}

            <h3 style={{ marginTop: '2rem' }}>Additional Resources:</h3>
            {resources.map((resource, index) => (
              <ResourceLink 
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 {resource.name}
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {resource.description}
                </div>
              </ResourceLink>
            ))}

            <CloseButton onClick={() => setShowEmergencyModal(false)}>
              Close
            </CloseButton>
          </ModalContent>
        </EmergencyModal>
      )}
    </>
  );
};

export default CrisisAssessment;