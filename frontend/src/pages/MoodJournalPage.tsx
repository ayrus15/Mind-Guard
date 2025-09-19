import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const MoodSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #e74c3c, #f39c12, #f1c40f, #2ecc71);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    border: none;
  }
`;

const MoodDisplay = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EmojiSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const EmojiButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
})<{ selected: boolean }>`
  background: ${props => props.selected ? '#3498db' : 'transparent'};
  border: 2px solid ${props => props.selected ? '#3498db' : '#ddd'};
  border-radius: 50%;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const HistoryContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HistoryTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const MoodEntry = styled.div`
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MoodEntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MoodScore = styled.span.withConfig({
  shouldForwardProp: (prop) => !['score'].includes(prop),
})<{ score: number }>`
  background: ${props => {
    if (props.score <= 3) return '#e74c3c';
    if (props.score <= 5) return '#f39c12';
    if (props.score <= 7) return '#f1c40f';
    return '#2ecc71';
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
`;

const Timestamp = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const EntryText = styled.p`
  color: #333;
  margin: 0;
  font-style: italic;
`;

interface MoodFormData {
  moodScore: number;
  text: string;
}

interface MoodEntryData {
  id: string;
  moodScore: number;
  text: string;
  textAnalysis: number | null;
  timestamp: string;
}

const moodEmojis = [
  { emoji: '😢', score: 1, label: 'Very sad' },
  { emoji: '😟', score: 2, label: 'Sad' },
  { emoji: '😕', score: 3, label: 'Down' },
  { emoji: '😐', score: 4, label: 'Neutral' },
  { emoji: '🙂', score: 5, label: 'Okay' },
  { emoji: '😊', score: 6, label: 'Good' },
  { emoji: '😄', score: 7, label: 'Happy' },
  { emoji: '😁', score: 8, label: 'Very happy' },
  { emoji: '🤗', score: 9, label: 'Excited' },
  { emoji: '🥳', score: 10, label: 'Euphoric' },
];

const MoodJournalPage: React.FC = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [selectedEmoji, setSelectedEmoji] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntryData[]>([]);
  
  const { register, handleSubmit, reset, setValue } = useForm<MoodFormData>();

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const response = await api.get('/mood/history?limit=10');
      setMoodHistory(response.data);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      toast.error('Failed to load mood history');
    }
  };

  const onSubmit = async (data: MoodFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/mood', {
        moodScore: data.moodScore,
        text: data.text
      });
      
      toast.success('Mood entry saved successfully!');
      reset();
      setMoodScore(5);
      setSelectedEmoji(5);
      fetchMoodHistory();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast.error('Failed to save mood entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoodChange = (score: number) => {
    setMoodScore(score);
    setSelectedEmoji(score);
    setValue('moodScore', score);
  };

  const handleEmojiSelect = (score: number) => {
    setSelectedEmoji(score);
    setMoodScore(score);
    setValue('moodScore', score);
  };

  const getMoodLabel = (score: number) => {
    const emoji = moodEmojis.find(e => e.score === score);
    return emoji ? emoji.label : 'Neutral';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container>
      <Header>
        <Title>Mood Journal</Title>
        <Subtitle>Track your daily mood and emotional well-being</Subtitle>
      </Header>

      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>How are you feeling today? (1-10)</Label>
            <MoodSlider
              type="range"
              min="1"
              max="10"
              value={moodScore}
              {...register('moodScore', { valueAsNumber: true })}
              onChange={(e) => handleMoodChange(parseInt(e.target.value))}
            />
            <MoodDisplay>
              {moodScore}/10 - {getMoodLabel(moodScore)}
            </MoodDisplay>
          </FormGroup>

          <FormGroup>
            <Label>Quick mood selection:</Label>
            <EmojiSelector>
              {moodEmojis.map((item) => (
                <EmojiButton
                  key={item.score}
                  type="button"
                  selected={selectedEmoji === item.score}
                  onClick={() => handleEmojiSelect(item.score)}
                  title={item.label}
                >
                  {item.emoji}
                </EmojiButton>
              ))}
            </EmojiSelector>
          </FormGroup>

          <FormGroup>
            <Label>How was your day? (Optional)</Label>
            <TextArea
              {...register('text')}
              placeholder="Share your thoughts, experiences, or anything that's on your mind..."
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
          </SubmitButton>
        </form>
      </FormContainer>

      <HistoryContainer>
        <HistoryTitle>Recent Mood Entries</HistoryTitle>
        {moodHistory.length === 0 ? (
          <p>No mood entries yet. Start tracking your mood above!</p>
        ) : (
          moodHistory.map((entry) => (
            <MoodEntry key={entry.id}>
              <MoodEntryHeader>
                <MoodScore score={entry.moodScore}>
                  {entry.moodScore}/10
                </MoodScore>
                <Timestamp>{formatDate(entry.timestamp)}</Timestamp>
              </MoodEntryHeader>
              {entry.text && <EntryText>"{entry.text}"</EntryText>}
            </MoodEntry>
          ))
        )}
      </HistoryContainer>
    </Container>
  );
};

export default MoodJournalPage;