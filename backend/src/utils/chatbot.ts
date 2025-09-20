// Simple CBT-based response generator
// In a production environment, this would integrate with OpenAI GPT API

interface CBTTechnique {
  trigger: RegExp;
  responses: string[];
  technique: string;
  followUpQuestions?: string[];
}

const cbtTechniques: CBTTechnique[] = [
  {
    trigger: /suicidal|suicide|kill myself|end it all|want to die/i,
    technique: 'Crisis Intervention',
    responses: [
      "I'm really concerned about you right now. Your life has value and there are people who want to help. Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988 or 1-800-273-8255. You don't have to go through this alone.",
      "Thank you for trusting me with something so serious. Please know that suicidal thoughts are a sign that you're in tremendous pain, not that you want to die. Help is available right now: Text HOME to 741741 for the Crisis Text Line.",
      "I hear how much pain you're in. These feelings can be overwhelming, but they are temporary. Please contact emergency services (911) or go to your nearest emergency room. You deserve support and care right now.",
    ],
    followUpQuestions: [
      "Are you in a safe place right now?",
      "Do you have someone you can call or be with?",
      "Have you contacted a mental health professional recently?",
    ],
  },
  {
    trigger: /anxiety|anxious|worried|stress|panic|nervous/i,
    technique: 'Anxiety Management',
    responses: [
      "I understand anxiety can feel overwhelming. Let's try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This can help bring you back to the present moment.",
      "Anxiety often comes from our mind racing to worst-case scenarios. Let's challenge those thoughts: What evidence do you have that your worry will actually happen? What's a more realistic outcome?",
      "When anxiety hits, our breathing becomes shallow. Try this: Breathe in slowly for 4 counts, hold for 4, then exhale slowly for 6 counts. Repeat this 5 times. This activates your body's relaxation response.",
      "Anxiety is your brain trying to protect you, but sometimes it's overactive. What specific situation is triggering this anxiety? Let's break it down into smaller, manageable parts and create an action plan.",
    ],
    followUpQuestions: [
      "What specific situation is causing you the most anxiety right now?",
      "When did you first notice these anxious feelings today?",
      "What usually helps you feel calmer?",
    ],
  },
  {
    trigger: /sad|depressed|down|hopeless|worthless|empty|numb/i,
    technique: 'Depression Support',
    responses: [
      "I hear that you're struggling with difficult feelings. Depression can make everything feel hopeless, but please know that these feelings will pass. What's one small thing that used to bring you joy, even if it doesn't right now?",
      "When we're depressed, our brain focuses on the negatives. Let's challenge this: Can you think of one person who cares about you? One thing you accomplished recently, even something small?",
      "Depression often makes us want to isolate, but connection helps healing. Is there one person you could reach out to today? Even sending a simple text counts as a victory.",
      "You mentioned feeling worthless, but depression lies to us. You have inherent value as a human being. What would you tell a friend who felt this way? Can you show yourself that same compassion?",
    ],
    followUpQuestions: [
      "How long have you been feeling this way?",
      "Are you getting enough sleep and eating regularly?",
      "What's one tiny step you could take today to care for yourself?",
    ],
  },
  {
    trigger: /angry|frustrated|mad|irritated|furious|rage/i,
    technique: 'Anger Management',
    responses: [
      "I can sense your frustration. Anger is often a secondary emotion covering hurt, fear, or disappointment. What do you think might be underneath this anger? Understanding the root can help us address it constructively.",
      "Let's pause and use the STOP technique: Stop what you're doing, Take a breath, Observe your thoughts and feelings, Proceed mindfully. What would responding (not reacting) look like in this situation?",
      "Anger gives us energy for action, but we want to channel it productively. What boundary needs to be set? What problem needs solving? How can we address the real issue behind the anger?",
      "It sounds like something important to you feels threatened or violated. What values or needs aren't being met in this situation? Identifying this can help us find a constructive path forward.",
    ],
    followUpQuestions: [
      "What triggered this anger?",
      "How do you usually handle anger? What works and what doesn't?",
      "What would a positive outcome look like in this situation?",
    ],
  },
  {
    trigger: /can't|impossible|won't work|give up|hopeless|pointless/i,
    technique: 'Cognitive Restructuring',
    responses: [
      "I notice you're using all-or-nothing language. Let's reframe this: Instead of 'I can't,' try 'I haven't figured out how yet.' Instead of 'It's impossible,' try 'It's challenging, but let me think of different approaches.'",
      "Those thoughts sound really overwhelming. Let's examine the evidence: What facts support this thought? What facts challenge it? What would you tell a good friend facing this exact situation?",
      "When we feel stuck, our thinking narrows. Let's brainstorm: What are 3 different approaches you could try? Even if they seem unlikely to work, what options exist that you haven't considered?",
      "Perfectionist thinking can paralyze us. What would 'good enough' look like here? Sometimes taking imperfect action is better than no action at all.",
    ],
    followUpQuestions: [
      "What specifically feels impossible right now?",
      "What resources or support do you have available?",
      "What's the smallest possible step you could take?",
    ],
  },
  {
    trigger: /lonely|alone|isolated|no friends|nobody/i,
    technique: 'Connection Building',
    responses: [
      "Loneliness is painful, and it's brave of you to acknowledge it. Connection starts with small steps: Could you smile at a cashier, send a text to an acquaintance, or join an online community around an interest you have?",
      "Feeling alone doesn't mean you are alone. Sometimes we feel disconnected even around people. What kind of connection are you craving - someone to talk to, do activities with, or just feel understood by?",
      "Building relationships takes time, but every interaction is a seed. What interests or hobbies do you have? There are others who share them. Consider joining a group, class, or online community.",
      "Loneliness often makes us feel like we're the only ones struggling, but many people feel this way. What's one way you could reach out today? Even volunteering can create meaningful connections while helping others.",
    ],
    followUpQuestions: [
      "When did you last feel truly connected to someone?",
      "What interests or activities make you feel most like yourself?",
      "Is there anyone in your life you've lost touch with that you could reconnect with?",
    ],
  },
  {
    trigger: /relationship|boyfriend|girlfriend|marriage|partner|breakup|divorce/i,
    technique: 'Relationship Support',
    responses: [
      "Relationships can be one of our greatest sources of joy and pain. What's happening in your relationship that's concerning you? Understanding the specific issue can help us work through it together.",
      "Healthy relationships require communication, boundaries, and mutual respect. Are these elements present in your relationship? What feels missing or problematic?",
      "If you're going through a breakup or divorce, it's normal to feel a range of emotions. Grief, anger, relief, fear - all are valid. What support do you have during this transition?",
      "Relationship conflicts often stem from unmet needs or different communication styles. Can you identify what you need that you're not getting? How might you express this constructively?",
    ],
    followUpQuestions: [
      "What aspect of your relationship is most challenging right now?",
      "How do you and your partner typically handle disagreements?",
      "What does a healthy relationship look like to you?",
    ],
  },
];

const mentalHealthResources = [
  "If you're in crisis, please reach out: National Suicide Prevention Lifeline: 988",
  "Crisis Text Line: Text HOME to 741741",
  "For ongoing support, consider: Psychology Today directory to find therapists",
  "BetterHelp or Talkspace for online therapy options",
  "Local community mental health centers often offer sliding scale fees",
];

const selfCareStrategies = [
  "Take a 5-minute walk outside - fresh air and movement can shift your mood",
  "Practice deep breathing: 4 counts in, 4 counts hold, 6 counts out",
  "Write down 3 things you're grateful for, no matter how small",
  "Reach out to one person you care about with a simple check-in",
  "Do something creative for 10 minutes - draw, write, sing, dance",
  "Listen to music that matches then gradually improves your mood",
  "Take a warm shower or bath with intention to wash away stress",
  "Spend time in nature, even if it's just looking out a window",
];

const defaultResponses = [
  "Thank you for sharing with me. I can hear that something important is on your mind. What's been weighing on you most lately?",
  "I'm here to listen and support you. What would be most helpful for you right now - talking through your feelings, exploring solutions, or just having someone understand?",
  "It takes courage to reach out. What's happening in your life that prompted you to connect today? I want to understand so I can better support you.",
  "I appreciate you opening up. Sometimes just putting our thoughts into words can bring clarity. What's the most pressing thing you'd like to work through?",
];

// Conversation history tracking
const conversationHistory: Map<string, string[]> = new Map();

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const addToConversationHistory = (userId: string, message: string, response: string) => {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }
  const history = conversationHistory.get(userId)!;
  history.push(`User: ${message}`, `Assistant: ${response}`);
  
  // Keep only last 10 exchanges to prevent memory issues
  if (history.length > 20) {
    history.splice(0, history.length - 20);
  }
};

const getWellnessCheckIn = (): string => {
  const checkIns = [
    "How are you taking care of yourself today?",
    "What's one thing that's going well in your life right now?",
    "Have you had enough water and rest today?",
    "What's one small thing you can do for yourself right now?",
    "How are your energy levels today?",
    "What would make today feel a little better for you?",
  ];
  return getRandomItem(checkIns);
};

const getCopingStrategy = (technique: string): string => {
  const strategies: Record<string, string[]> = {
    'anxiety': [
      "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8",
      "Ground yourself by naming 5 things you can see around you right now",
      "Gently remind yourself: 'This feeling will pass. I am safe right now.'",
      "Try progressive muscle relaxation: tense and release each muscle group",
    ],
    'depression': [
      "Set a tiny goal for today - even getting dressed counts as an achievement",
      "Reach out to one person, even just to say hello",
      "Spend 5 minutes outside if possible, or near a window with natural light",
      "Listen to music that matches your mood, then gradually shift to something uplifting",
    ],
    'anger': [
      "Take 10 deep breaths before responding to whatever triggered you",
      "Write down your feelings without censoring yourself, then tear up the paper",
      "Do something physical - walk, stretch, or do jumping jacks for 2 minutes",
      "Ask yourself: 'What do I need right now?' and honor that need constructively",
    ],
    'stress': [
      "Make a to-do list and pick just ONE thing to focus on right now",
      "Take a 5-minute break to do something you enjoy",
      "Practice saying 'no' to additional commitments today",
      "Remember: You don't have to be perfect, you just have to show up",
    ],
  };
  
  const categoryStrategies = Object.values(strategies).flat();
  return getRandomItem(categoryStrategies);
};

export const generateCBTResponse = async (
  message: string,
  sentimentScore?: number,
  userId?: string
): Promise<string> => {
  // Check for crisis keywords first - highest priority
  const crisisKeywords = /suicidal|suicide|kill myself|end it all|want to die|harm myself|hurt myself/i;
  if (crisisKeywords.test(message)) {
    const crisisTechnique = cbtTechniques.find(t => t.technique === 'Crisis Intervention');
    if (crisisTechnique) {
      const response = getRandomItem(crisisTechnique.responses);
      if (userId) addToConversationHistory(userId, message, response);
      return response;
    }
  }

  // Look for specific CBT technique matches
  for (const technique of cbtTechniques) {
    if (technique.trigger.test(message)) {
      let response = getRandomItem(technique.responses);
      
      // Add follow-up questions for engagement
      if (technique.followUpQuestions && Math.random() > 0.5) {
        const followUp = getRandomItem(technique.followUpQuestions);
        response += `\n\n${followUp}`;
      }
      
      // Add practical suggestions based on technique type
      if (technique.technique === 'Anxiety Management') {
        if (Math.random() > 0.6) {
          response += `\n\n💡 Quick strategy: ${getCopingStrategy('anxiety')}`;
        }
      } else if (technique.technique === 'Depression Support') {
        if (Math.random() > 0.6) {
          response += `\n\n💡 Gentle reminder: ${getCopingStrategy('depression')}`;
        }
      } else if (technique.technique === 'Anger Management') {
        if (Math.random() > 0.6) {
          response += `\n\n💡 Try this: ${getCopingStrategy('anger')}`;
        }
      }
      
      if (userId) addToConversationHistory(userId, message, response);
      return response;
    }
  }

  // Use sentiment analysis for more targeted responses
  if (sentimentScore !== undefined) {
    if (sentimentScore < -0.6) {
      const responses = [
        "I can sense you're going through a really difficult time. Your feelings are valid, and you don't have to face this alone. What's one small step you could take right now to care for yourself?",
        "It sounds like you're carrying a heavy emotional load. Sometimes when we're in pain, it helps to remember that feelings are temporary, even when they feel overwhelming. What usually helps you feel even slightly better?",
        "I hear how much you're struggling. When we're in emotional pain, it's important to be gentle with ourselves. Is there someone in your life you can reach out to for support?",
      ];
      let response = getRandomItem(responses);
      
      // Add a resource or strategy
      if (Math.random() > 0.5) {
        response += `\n\nRemember: ${getRandomItem(mentalHealthResources)}`;
      } else {
        response += `\n\nTry this: ${getRandomItem(selfCareStrategies)}`;
      }
      
      if (userId) addToConversationHistory(userId, message, response);
      return response;
    } else if (sentimentScore > 0.4) {
      const responses = [
        "I can hear some positive energy in your message! That's wonderful. How can we build on these good feelings and maintain this momentum?",
        "It's great to connect with you when you're feeling more positive! What's contributing to this good mood? Understanding what helps can be valuable for tougher days.",
        "I love hearing when things are going well! What's been working for you lately? Sometimes sharing our successes can help us and others.",
      ];
      const response = getRandomItem(responses);
      if (userId) addToConversationHistory(userId, message, response);
      return response;
    } else if (sentimentScore < -0.2) {
      // Mildly negative
      const responses = [
        "I can sense some difficulty in what you're sharing. It's okay to not be okay sometimes. What's been on your mind that's causing some stress?",
        "It sounds like you might be working through some challenges. That's completely normal. What aspect of your situation feels most manageable to start with?",
        "I hear that things might feel a bit heavy right now. Sometimes talking through our thoughts can help lighten the load. What would be helpful to explore?",
      ];
      const response = getRandomItem(responses);
      if (userId) addToConversationHistory(userId, message, response);
      return response;
    }
  }

  // Check conversation history for context
  if (userId && conversationHistory.has(userId)) {
    const history = conversationHistory.get(userId)!;
    const recentMessages = history.slice(-6); // Last 3 exchanges
    
    // If user seems to be continuing a theme
    if (recentMessages.some(msg => msg.includes('anxiety') || msg.includes('anxious'))) {
      const response = `I notice we've been talking about anxiety. How are you feeling now? Are the strategies we discussed helping, or would you like to try something different?\n\n💡 Remember: ${getCopingStrategy('anxiety')}`;
      addToConversationHistory(userId, message, response);
      return response;
    }
    
    if (recentMessages.some(msg => msg.includes('sad') || msg.includes('depressed'))) {
      const response = `You mentioned feeling down earlier. How are you doing now? Sometimes it helps to check in with ourselves throughout the day.\n\n${getWellnessCheckIn()}`;
      addToConversationHistory(userId, message, response);
      return response;
    }
    
    // Wellness check-in after several exchanges
    if (history.length >= 8 && Math.random() > 0.7) {
      const response = `I appreciate you sharing so openly with me. ${getWellnessCheckIn()}\n\nRemember, I'm here to support you through whatever you're experiencing.`;
      addToConversationHistory(userId, message, response);
      return response;
    }
  }

  // Enhanced default responses with more engagement
  const enhancedDefaults = [
    "Thank you for sharing with me. I can hear that something important is on your mind. What's been weighing on you most lately? I'm here to listen and support you.",
    "I'm here to support you through whatever you're experiencing. What would be most helpful right now - talking through your feelings, exploring some coping strategies, or just having someone who understands?",
    "It takes courage to reach out and share. What's happening in your life that brought you here today? I want to understand so I can better support you.",
    "I appreciate you opening up to me. Sometimes just putting our thoughts into words can bring clarity. What feels most important for you to work through right now?",
    `I'm glad you're here. Whether you're looking for support, strategies, or just someone to listen, I'm here for you. What's on your mind? ${Math.random() > 0.5 ? '\n\nRemember, you can talk to me about anything - your feelings, relationships, stress, or whatever else is important to you.' : ''}`,
  ];

  const response = getRandomItem(enhancedDefaults);
  if (userId) addToConversationHistory(userId, message, response);
  return response;
};

// Advanced version that would integrate with OpenAI GPT
export const generateAdvancedCBTResponse = async (
  message: string,
  sentimentScore?: number,
  conversationHistory?: string[],
  userId?: string
): Promise<string> => {
  // This would integrate with OpenAI API in production
  // For now, return the enhanced CBT response
  return generateCBTResponse(message, sentimentScore, userId);
};