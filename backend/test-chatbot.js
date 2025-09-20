// Test chatbot pattern matching
const testMessage = "hi i feel depressed";

const patterns = [
  { name: 'depression', regex: /sad|depressed|down|hopeless|worthless|empty|numb/i },
  { name: 'anxiety', regex: /anxiety|anxious|worried|stress|panic|nervous/i },
  { name: 'anger', regex: /angry|frustrated|mad|irritated|furious|rage/i },
];

patterns.forEach(pattern => {
  console.log(`Testing "${testMessage}" against ${pattern.name}:`, pattern.regex.test(testMessage));
});

// Test sentiment analysis
const words = testMessage.toLowerCase().split(/\s+/);
console.log('Words:', words);

const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'stress', 'panic'];
let score = 0;
words.forEach(word => {
  if (negativeWords.includes(word)) {
    score -= 1;
    console.log(`Found negative word: ${word}`);
  }
});

console.log('Sentiment score:', score / words.length);