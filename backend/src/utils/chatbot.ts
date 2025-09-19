// Simple CBT-based response generator
// In a production environment, this would integrate with OpenAI GPT API

interface CBTTechnique {
  trigger: RegExp;
  responses: string[];
  technique: string;
}

const cbtTechniques: CBTTechnique[] = [
  {
    trigger: /anxiety|anxious|worried|stress|panic/i,
    technique: 'Anxiety Management',
    responses: [
      "I can sense you're feeling anxious. Let's try a grounding technique: Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste?",
      "Anxiety often comes from thoughts about the future. What specific situation is causing you worry? Let's break it down into manageable parts.",
      "When we're anxious, our breathing often becomes shallow. Try taking a deep breath in for 4 counts, hold for 4, and exhale for 6. Would you like to try this together?",
    ],
  },
  {
    trigger: /sad|depressed|down|hopeless|worthless/i,
    technique: 'Mood Lifting',
    responses: [
      "I hear that you're going through a difficult time. Remember that feelings are temporary and will pass. What's one small thing that usually brings you comfort?",
      "When we feel down, we often focus on negatives. Can you think of one positive thing that happened today, no matter how small?",
      "Depression can make everything feel overwhelming. Let's focus on just the next hour - what's one small, manageable thing you could do for yourself?",
    ],
  },
  {
    trigger: /angry|frustrated|mad|irritated/i,
    technique: 'Anger Management',
    responses: [
      "I can sense your frustration. Anger often signals that something important to us feels threatened. What do you think is underneath this anger?",
      "Let's pause for a moment. Take three deep breaths with me. Sometimes stepping back helps us see the situation more clearly.",
      "Anger is a valid emotion. What would it look like to express this feeling in a way that helps rather than hurts?",
    ],
  },
  {
    trigger: /can't|impossible|won't work|give up/i,
    technique: 'Cognitive Restructuring',
    responses: [
      "I notice you're using absolute language like 'can't' or 'impossible'. What if we reframed this: instead of 'I can't', what if we said 'I haven't figured out how yet'?",
      "Those thoughts sound really challenging. Let's examine the evidence: what facts support this thought, and what facts challenge it?",
      "What would you tell a good friend who came to you with this exact same problem?",
    ],
  },
  {
    trigger: /help|support|don't know/i,
    technique: 'Supportive Guidance',
    responses: [
      "I'm here to help. Sometimes just talking through our thoughts can bring clarity. What's the most pressing thing on your mind right now?",
      "You've taken a brave step by reaching out. What kind of support feels most helpful to you right now - practical advice, emotional support, or just someone to listen?",
      "Let's take this one step at a time. What feels like the most manageable first step from where you are now?",
    ],
  },
];

const defaultResponses = [
  "Thank you for sharing that with me. Can you tell me more about how you're feeling?",
  "I'm here to listen and support you. What's been on your mind lately?",
  "It sounds like you're going through something important. How can I best help you today?",
  "I appreciate you opening up. What would be most helpful for you to explore right now?",
];

export const generateCBTResponse = async (
  message: string,
  sentimentScore?: number
): Promise<string> => {
  // Find matching CBT technique
  for (const technique of cbtTechniques) {
    if (technique.trigger.test(message)) {
      const randomResponse = technique.responses[
        Math.floor(Math.random() * technique.responses.length)
      ];
      return randomResponse;
    }
  }

  // If no specific technique matches, use sentiment-based response
  if (sentimentScore !== undefined) {
    if (sentimentScore < -0.5) {
      return "I can sense you're going through a difficult time. Remember that I'm here to support you, and these feelings will pass. What's one small thing you can do right now to take care of yourself?";
    } else if (sentimentScore > 0.5) {
      return "It's wonderful to hear positive energy in your message! How can we build on these good feelings?";
    }
  }

  // Default supportive response
  const randomDefault = defaultResponses[
    Math.floor(Math.random() * defaultResponses.length)
  ];
  return randomDefault;
};

// Advanced version that would integrate with OpenAI GPT
export const generateAdvancedCBTResponse = async (
  message: string,
  sentimentScore?: number,
  conversationHistory?: string[]
): Promise<string> => {
  // This would integrate with OpenAI API in production
  // For now, return the basic CBT response
  return generateCBTResponse(message, sentimentScore);
};