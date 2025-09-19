export const getSentimentEmoji = (score: number): string => {
  if (score > 0.5) return '😊';
  if (score > 0.1) return '🙂';
  if (score < -0.5) return '😢';
  if (score < -0.1) return '😟';
  return '😐';
};

export const getSentimentLabel = (score: number): string => {
  if (score > 0.3) return 'positive';
  if (score < -0.3) return 'negative';
  return 'neutral';
};

export const getSentimentColor = (score: number): string => {
  if (score > 0.3) return '#27ae60';
  if (score < -0.3) return '#e74c3c';
  return '#f39c12';
};