/**
 * IMPLEMENTATION GUIDE: ADVANCED MINDGUARD AI INTEGRATION
 * 
 * This file shows you exactly how to integrate the advanced AI prompt system
 * with your existing MindGuard platform using OpenAI GPT-4 or similar models.
 */

import { MINDGUARD_AI_SYSTEM_PROMPT, generateUserContext } from './advanced-ai-prompt';

// Types for the advanced AI system
interface UserPersonality {
  preferredMode: 'empathetic' | 'practical' | 'mindful' | 'wise' | 'adaptive';
  communicationStyle: 'casual' | 'professional' | 'gentle' | 'direct';
  interventionPreference: 'immediate' | 'gradual' | 'self-directed';
}

interface UserAIContext {
  name?: string;
  preferredPersonality?: string;
  currentMood?: string;
  moodTrend?: string;
  frequentTopics?: string[];
  effectiveStrategies?: string[];
  triggers?: string[];
  lastSession?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  conversationHistory?: ConversationMessage[];
  recentMoodData?: any[];
  recentEmotionData?: any[];
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    mood?: string;
    emotion?: string;
    strategy?: string;
  };
}

/**
 * STEP 1: REPLACE YOUR EXISTING CHATBOT FUNCTION
 * 
 * Replace your current generateCBTResponse function with this advanced version
 */
export const generateAdvancedAIResponse = async (
  message: string,
  userId: string,
  userContext: UserAIContext,
  sentimentScore?: number
): Promise<{
  response: string;
  metadata: {
    personality: string;
    intervention: string;
    followUp: string[];
    riskLevel: 'low' | 'medium' | 'high';
    suggestedActions: string[];
  };
}> => {
  
  // CRISIS DETECTION - Handle immediately
  const crisisKeywords = /suicidal|suicide|kill myself|end it all|want to die|harm myself|hurt myself|can't go on|no point living/i;
  const severeCrisisKeywords = /tonight|today|plan to|ready to|pills|bridge|gun|rope/i;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  
  if (crisisKeywords.test(message)) {
    riskLevel = severeCrisisKeywords.test(message) ? 'high' : 'medium';
  } else if (sentimentScore && sentimentScore < -0.8) {
    riskLevel = 'medium';
  }

  // If using OpenAI GPT-4 (recommended for production)
  if (process.env.OPENAI_API_KEY) {
    return await generateOpenAIResponse(message, userId, userContext, riskLevel);
  }
  
  // Fallback to enhanced local AI (your current system + advanced logic)
  return await generateEnhancedLocalResponse(message, userId, userContext, riskLevel, sentimentScore);
};

/**
 * STEP 2: OPENAI GPT-4 INTEGRATION (RECOMMENDED)
 * 
 * For production-grade AI responses, integrate with OpenAI GPT-4
 */
async function generateOpenAIResponse(
  message: string,
  userId: string,
  userContext: UserAIContext,
  riskLevel: 'low' | 'medium' | 'high'
): Promise<any> {
  
  // You'll need to install openai: npm install openai
  // const OpenAI = require('openai');
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemContext = generateUserContext(userContext);
  const conversationHistory = userContext.conversationHistory || [];

  const messages = [
    { role: 'system', content: MINDGUARD_AI_SYSTEM_PROMPT },
    { role: 'system', content: systemContext },
    { role: 'system', content: `Current Risk Level: ${riskLevel}. ${riskLevel === 'high' ? 'IMMEDIATE CRISIS - Prioritize safety and professional help.' : ''}` },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    { role: 'user', content: message }
  ];

  // Example OpenAI API call (uncomment when you have API key)
  /*
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    });

    const response = completion.choices[0].message.content;
    
    return {
      response,
      metadata: {
        personality: userContext.preferredPersonality || 'adaptive',
        intervention: detectInterventionType(response),
        followUp: generateFollowUpQuestions(response),
        riskLevel,
        suggestedActions: generateSuggestedActions(response, riskLevel)
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Fallback to enhanced local response
    return generateEnhancedLocalResponse(message, userId, userContext, riskLevel);
  }
  */

  // For now, return enhanced local response
  return generateEnhancedLocalResponse(message, userId, userContext, riskLevel);
}

/**
 * STEP 3: ENHANCED LOCAL AI SYSTEM
 * 
 * This enhances your existing local AI with advanced prompt engineering
 */
async function generateEnhancedLocalResponse(
  message: string,
  userId: string,
  userContext: UserAIContext,
  riskLevel: 'low' | 'medium' | 'high',
  sentimentScore?: number
): Promise<any> {

  // Advanced pattern matching with context awareness
  const patterns = [
    {
      name: 'crisis_intervention',
      regex: /suicidal|suicide|kill myself|end it all|want to die|harm myself/i,
      personality: 'empathetic',
      responses: getCrisisResponses(riskLevel),
      followUp: ['Are you in a safe place right now?', 'Do you have someone you can call?', 'Have you contacted a mental health professional recently?'],
      suggestedActions: ['Call 988 immediately', 'Go to nearest emergency room', 'Contact trusted friend or family member']
    },
    {
      name: 'depression_support',
      regex: /sad|depressed|down|hopeless|worthless|empty|numb|no energy|can't get out of bed/i,
      personality: userContext.preferredPersonality || 'empathetic',
      responses: getDepressionResponses(userContext),
      followUp: ['How long have you been feeling this way?', 'What usually helps you feel even slightly better?', 'Have you been taking care of your basic needs?'],
      suggestedActions: ['Try one small self-care activity', 'Reach out to one supportive person', 'Consider professional help if persistent']
    },
    {
      name: 'anxiety_management',
      regex: /anxiety|anxious|worried|stress|panic|nervous|overwhelmed|can't breathe/i,
      personality: userContext.preferredPersonality || 'mindful',
      responses: getAnxietyResponses(userContext),
      followUp: ['What specific situation is triggering this anxiety?', 'Have you tried any grounding techniques?', 'What does your body feel like right now?'],
      suggestedActions: ['Practice 4-7-8 breathing', 'Try 5-4-3-2-1 grounding technique', 'Take a short walk if possible']
    },
    {
      name: 'relationship_support',
      regex: /relationship|partner|boyfriend|girlfriend|marriage|divorce|breakup|lonely|alone|fight|argument/i,
      personality: userContext.preferredPersonality || 'practical',
      responses: getRelationshipResponses(userContext),
      followUp: ['What aspect of this relationship is most challenging?', 'How do you typically handle conflicts?', 'What kind of support do you need right now?'],
      suggestedActions: ['Practice "I" statements', 'Take time to cool down before responding', 'Consider couples counseling if appropriate']
    },
    {
      name: 'work_stress',
      regex: /work|job|boss|career|deadline|fired|quit|colleague|workplace|burnout|overworked/i,
      personality: userContext.preferredPersonality || 'practical',
      responses: getWorkStressResponses(userContext),
      followUp: ['What specific aspect of work is most stressful?', 'Do you have support at work?', 'How is this affecting your life outside work?'],
      suggestedActions: ['Set boundaries with work hours', 'Take regular breaks', 'Consider talking to HR or supervisor']
    }
  ];

  // Find matching pattern
  for (const pattern of patterns) {
    if (pattern.regex.test(message)) {
      const response = getRandomItem(pattern.responses);
      const intervention = pattern.name;
      
      // Add personalized touches based on user history
      const personalizedResponse = personalizeResponse(response, userContext);
      
      return {
        response: personalizedResponse,
        metadata: {
          personality: pattern.personality,
          intervention,
          followUp: pattern.followUp,
          riskLevel,
          suggestedActions: pattern.suggestedActions
        }
      };
    }
  }

  // Sentiment-based responses if no pattern matches
  if (sentimentScore !== undefined) {
    return getSentimentBasedResponse(message, sentimentScore, userContext, riskLevel);
  }

  // Default adaptive response
  return getAdaptiveDefaultResponse(message, userContext, riskLevel);
}

/**
 * STEP 4: SPECIALIZED RESPONSE GENERATORS
 */

function getCrisisResponses(riskLevel: 'low' | 'medium' | 'high'): string[] {
  if (riskLevel === 'high') {
    return [
      "I'm extremely concerned about you right now. Your safety is the most important thing. Please call 988 (Suicide Prevention Lifeline) immediately or go to your nearest emergency room. You matter, and there are people who want to help you right now.",
      "This sounds like a crisis situation, and I want to make sure you're safe. Please reach out to emergency services (911) or the Crisis Text Line (text HOME to 741741) right now. Can you tell me if you're in a safe place?",
      "I hear how much pain you're in, and I'm worried about your immediate safety. Please don't go through this alone - call 988 or go to the nearest emergency room. Your life has value, and help is available right now."
    ];
  } else if (riskLevel === 'medium') {
    return [
      "I'm really concerned about what you're sharing. These thoughts can feel overwhelming, but you don't have to face them alone. Please consider calling 988 (Suicide Prevention Lifeline) to talk to someone right now. How can we get you some immediate support?",
      "Thank you for trusting me with something so serious. What you're feeling is a sign of deep emotional pain, not that ending your life is the answer. Please reach out to the Crisis Text Line (text HOME to 741741) or call 988. Are you somewhere safe right now?",
      "I can hear how much you're struggling. These thoughts are scary, but they're also a signal that you need support right now. Please contact 988 or your local crisis line. You deserve care and help through this difficult time."
    ];
  } else {
    return [
      "I'm glad you felt comfortable sharing these difficult thoughts with me. Even having passing thoughts about not wanting to be here can be concerning. Have you considered talking to a mental health professional about these feelings?",
      "Thank you for being open about such a difficult topic. Sometimes when life feels overwhelming, these thoughts can surface. What support do you have available to you right now?",
      "It takes courage to talk about these kinds of thoughts. While they might feel manageable right now, it's important to have support. Do you have a therapist or counselor you can speak with?"
    ];
  }
}

function getDepressionResponses(userContext: UserAIContext): string[] {
  const name = userContext.name ? `, ${userContext.name}` : '';
  const recentStrategies = userContext.effectiveStrategies?.length ? 
    `I remember ${userContext.effectiveStrategies[0]} helped you before. ` : '';

  return [
    `I can really hear the heaviness in what you're sharing${name}. Depression can make everything feel impossible, but you're not alone in this. ${recentStrategies}What's one tiny thing you could do today just to take care of yourself?`,
    `Thank you for sharing how you're feeling${name}. Depression lies to us and tells us we're worthless, but that's not the truth. You have value, and these feelings will pass. What's something that used to bring you even small moments of comfort?`,
    `I hear you${name}, and I want you to know that reaching out like this shows real strength. Depression can make us feel disconnected from everything we used to enjoy. ${recentStrategies}What would taking care of yourself look like today, even in the smallest way?`
  ];
}

function getAnxietyResponses(userContext: UserAIContext): string[] {
  const name = userContext.name ? `, ${userContext.name}` : '';
  const previousWork = userContext.effectiveStrategies?.includes('breathing') ? 
    'I know breathing exercises have helped you before. ' : '';

  return [
    `I can sense how anxious you're feeling right now${name}. Let's try to ground you in this moment. ${previousWork}Can you take a slow breath with me and tell me 5 things you can see around you right now?`,
    `Anxiety can make our minds race with worst-case scenarios. ${name}, let's slow down and challenge some of those thoughts. What evidence do you have that your worry will actually happen? What's a more realistic outcome?`,
    `I understand how overwhelming anxiety can feel${name}. Your body is trying to protect you, but sometimes it goes into overdrive. ${previousWork}Let's try the 4-7-8 breathing: breathe in for 4, hold for 7, exhale for 8. Want to try it together?`
  ];
}

function getRelationshipResponses(userContext: UserAIContext): string[] {
  const name = userContext.name ? `, ${userContext.name}` : '';
  
  return [
    `Relationships can be one of our greatest sources of both joy and pain${name}. I hear that you're going through something difficult. What aspect of this situation feels most challenging for you right now?`,
    `Thank you for sharing what's happening in your relationship${name}. Conflicts and challenges are normal, even in healthy relationships. What kind of support would be most helpful - talking through your feelings, exploring solutions, or just having someone listen?`,
    `I can sense this relationship situation is really affecting you${name}. Sometimes when we're in the middle of relationship stress, it's hard to see clearly. What would you tell a good friend who came to you with this same situation?`
  ];
}

function getWorkStressResponses(userContext: UserAIContext): string[] {
  const name = userContext.name ? `, ${userContext.name}` : '';
  
  return [
    `Work stress can really take a toll on our mental health${name}. It sounds like things have been particularly challenging lately. What aspect of work is causing you the most stress right now?`,
    `I hear how overwhelming work has become${name}. When we're stressed at work, it often spills over into every other area of our life. What boundaries could you set to protect your well-being?`,
    `Workplace stress is so common, but that doesn't make it any less difficult${name}. Have you been able to take breaks during your day, or has it been non-stop pressure?`
  ];
}

/**
 * STEP 5: PERSONALIZATION FUNCTIONS
 */

function personalizeResponse(response: string, userContext: UserAIContext): string {
  let personalized = response;

  // Add name if available
  if (userContext.name && !response.includes(userContext.name)) {
    personalized = response.replace(/\. /, `, ${userContext.name}. `);
  }

  // Reference previous effective strategies
  if (userContext.effectiveStrategies?.length) {
    const strategy = userContext.effectiveStrategies[0];
    personalized += `\n\n💡 Remember, ${strategy} helped you before - might it be worth trying again?`;
  }

  // Add mood-aware suggestions
  if (userContext.currentMood) {
    if (userContext.currentMood === 'low' && Math.random() > 0.7) {
      personalized += "\n\n🌱 Sometimes when we're feeling low, even tiny steps count as victories.";
    } else if (userContext.currentMood === 'anxious' && Math.random() > 0.7) {
      personalized += "\n\n🌬️ When anxiety rises, remember that you can always return to your breath.";
    }
  }

  return personalized;
}

function getSentimentBasedResponse(
  message: string,
  sentimentScore: number,
  userContext: UserAIContext,
  riskLevel: 'low' | 'medium' | 'high'
): any {
  const name = userContext.name ? `, ${userContext.name}` : '';
  
  if (sentimentScore < -0.6) {
    return {
      response: `I can sense you're going through a really difficult time${name}. Your feelings are completely valid, and you don't have to face this alone. What's one small step you could take right now to care for yourself?`,
      metadata: {
        personality: 'empathetic',
        intervention: 'emotional_support',
        followUp: ['How long have you been feeling this way?', 'What support do you have available?'],
        riskLevel,
        suggestedActions: ['Practice self-compassion', 'Reach out to a trusted friend', 'Consider professional support']
      }
    };
  } else if (sentimentScore > 0.4) {
    return {
      response: `I can hear some positive energy in your message${name}! That's wonderful to see. How can we build on these good feelings and maintain this momentum?`,
      metadata: {
        personality: 'empathetic',
        intervention: 'positive_reinforcement',
        followUp: ['What contributed to this good mood?', 'How can we maintain this positive energy?'],
        riskLevel,
        suggestedActions: ['Notice and savor this positive moment', 'Share this good feeling with someone', 'Write down what helped']
      }
    };
  }

  // Neutral sentiment
  return getAdaptiveDefaultResponse(message, userContext, riskLevel);
}

function getAdaptiveDefaultResponse(
  message: string,
  userContext: UserAIContext,
  riskLevel: 'low' | 'medium' | 'high'
): any {
  const name = userContext.name ? `, ${userContext.name}` : '';
  
  const responses = [
    `Thank you for sharing with me${name}. I can hear that something important is on your mind. What would be most helpful for you right now - talking through your feelings, exploring some strategies, or just having someone listen?`,
    `I'm here to support you through whatever you're experiencing${name}. What's been weighing on you most lately? I want to understand so I can better help you.`,
    `It takes courage to reach out and share${name}. What's happening in your life that brought you here today? I'm here to listen and support you however I can.`
  ];

  return {
    response: getRandomItem(responses),
    metadata: {
      personality: userContext.preferredPersonality || 'adaptive',
      intervention: 'general_support',
      followUp: ['What brings you here today?', 'How are you feeling right now?', 'What kind of support would help most?'],
      riskLevel,
      suggestedActions: ['Share what\'s on your mind', 'Take your time', 'Know that you\'re not alone']
    }
  };
}

/**
 * STEP 6: UTILITY FUNCTIONS
 */

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function detectInterventionType(response: string): string {
  if (response.includes('988') || response.includes('crisis')) return 'crisis_intervention';
  if (response.includes('breathing') || response.includes('ground')) return 'anxiety_management';
  if (response.includes('small step') || response.includes('self-care')) return 'depression_support';
  if (response.includes('relationship') || response.includes('communication')) return 'relationship_support';
  return 'general_support';
}

function generateFollowUpQuestions(response: string): string[] {
  // AI would analyze the response and suggest relevant follow-ups
  return [
    'How does that resonate with you?',
    'What feels most important to explore right now?',
    'Is there anything else you\'d like to share about this?'
  ];
}

function generateSuggestedActions(response: string, riskLevel: 'low' | 'medium' | 'high'): string[] {
  if (riskLevel === 'high') {
    return ['Call 988 immediately', 'Go to emergency room', 'Contact trusted person'];
  } else if (riskLevel === 'medium') {
    return ['Call crisis hotline', 'Reach out for support', 'Practice safety planning'];
  }
  
  return ['Try suggested coping strategy', 'Check in with yourself regularly', 'Consider professional support'];
}

/**
 * STEP 7: INTEGRATION WITH YOUR EXISTING SYSTEM
 * 
 * Replace your chatController.ts logic with this:
 */

export const integrateWithChatController = async (data: any) => {
  // Get user context from your database/storage
  const userContext: UserAIContext = {
    name: data.user?.name,
    preferredPersonality: data.user?.aiPersonality || 'adaptive',
    currentMood: data.user?.currentMood,
    // Add more context from your existing data
  };

  // Generate advanced AI response
  const aiResponse = await generateAdvancedAIResponse(
    data.message,
    data.userId,
    userContext,
    data.sentimentScore
  );

  // Store conversation and metadata
  const conversation = {
    message: data.message,
    response: aiResponse.response,
    sentimentScore: data.sentimentScore,
    userId: data.userId,
    metadata: aiResponse.metadata,
    timestamp: new Date()
  };

  // Save to your storage system
  // await saveConversation(conversation);

  return conversation;
};

export default {
  generateAdvancedAIResponse,
  integrateWithChatController,
  MINDGUARD_AI_SYSTEM_PROMPT
};