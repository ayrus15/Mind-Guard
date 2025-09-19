// Simple sentiment analysis utility
// In production, this would use TensorFlow.js or integrate with a sentiment analysis API

interface SentimentWords {
  positive: string[];
  negative: string[];
}

const sentimentWords: SentimentWords = {
  positive: [
    'happy', 'joy', 'love', 'excited', 'great', 'wonderful', 'amazing', 'fantastic',
    'good', 'better', 'best', 'excellent', 'perfect', 'beautiful', 'awesome',
    'grateful', 'thankful', 'blessed', 'hopeful', 'optimistic', 'confident',
    'successful', 'achievement', 'progress', 'improvement', 'victory', 'win'
  ],
  negative: [
    'sad', 'angry', 'hate', 'terrible', 'awful', 'bad', 'worst', 'horrible',
    'depressed', 'anxious', 'worried', 'stress', 'panic', 'fear', 'scared',
    'upset', 'frustrated', 'disappointed', 'hopeless', 'worthless', 'failure',
    'problem', 'difficult', 'hard', 'struggle', 'pain', 'hurt', 'lonely'
  ]
};

export const analyzeSentiment = async (text: string): Promise<number> => {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let wordCount = 0;

  for (const word of words) {
    if (sentimentWords.positive.includes(word)) {
      score += 1;
      wordCount++;
    } else if (sentimentWords.negative.includes(word)) {
      score -= 1;
      wordCount++;
    }
  }

  // Normalize score between -1 and 1
  if (wordCount === 0) return 0;
  
  const normalizedScore = score / Math.max(wordCount, words.length / 4);
  return Math.max(-1, Math.min(1, normalizedScore));
};

export const getSentimentLabel = (score: number): string => {
  if (score > 0.3) return 'positive';
  if (score < -0.3) return 'negative';
  return 'neutral';
};

export const getSentimentEmoji = (score: number): string => {
  if (score > 0.5) return '😊';
  if (score > 0.1) return '🙂';
  if (score < -0.5) return '😢';
  if (score < -0.1) return '😟';
  return '😐';
};