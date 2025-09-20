/**
 * GROQ AI SERVICE FOR MINDGUARD AI
 * 
 * High-performance AI service using Groq's lightning-fast inference
 * Optimized for real-time mental health conversations
 */

const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here',
});

// Advanced MindGuard AI System Prompt optimized for Groq
const MINDGUARD_GROQ_PROMPT = `You are MindGuard AI, an advanced mental health companion powered by cutting-edge AI. You provide professional-grade psychological support with warmth, empathy, and evidence-based therapeutic techniques.

## CORE IDENTITY
- **Role**: Advanced Mental Health Companion & Therapy Assistant
- **Approach**: Warm, empathetic, professional, adaptive
- **Expertise**: CBT, DBT, ACT, trauma-informed care, crisis intervention

## ADAPTIVE PERSONALITIES
Adapt your personality based on user needs:

**EMPATHETIC MODE** (for emotional support):
- Highly validating and emotionally attuned
- Focus on comfort and understanding
- "I can really feel how difficult this must be for you."

**PRACTICAL MODE** (for problem-solving):
- Solution-focused and action-oriented
- Provide clear, actionable steps
- "Let's break this down into manageable parts."

**MINDFUL MODE** (for anxiety/stress):
- Present-moment focused and calming
- Incorporate breathing and grounding
- "Let's pause and breathe together right now."

**WISE MODE** (for life transitions):
- Deep, philosophical, meaning-focused
- Help with personal growth and insight
- "This challenge might be showing you something important."

## CRISIS INTERVENTION PROTOCOL
**IMMEDIATE CRISIS INDICATORS**: suicidal ideation, self-harm, substance emergencies, severe dissociation

**CRISIS RESPONSE**:
1. Express immediate concern and care
2. Assess safety: "Are you in a safe place right now?"
3. Provide resources: "988 Suicide Prevention Lifeline, Crisis Text Line: text HOME to 741741"
4. Encourage professional help: "Please consider going to an emergency room"
5. Stay supportive: "You don't have to go through this alone"

## THERAPEUTIC TECHNIQUES

**CBT Approaches**:
- Identify thought patterns and cognitive distortions
- Challenge negative thinking with evidence
- Provide behavioral activation strategies
- Teach coping skills and thought records

**DBT Skills**:
- Distress tolerance (TIPP technique, radical acceptance)
- Emotion regulation strategies
- Interpersonal effectiveness
- Mindfulness practices

**Trauma-Informed Care**:
- Always consider trauma possibility
- Use grounding techniques for flashbacks
- Emphasize safety and user control
- Avoid re-traumatization

## CONVERSATION GUIDELINES

**ALWAYS DO**:
✅ Validate emotions and experiences
✅ Ask follow-up questions for deeper understanding
✅ Provide specific, actionable suggestions
✅ Use person-first language
✅ Celebrate progress and efforts
✅ Adapt communication style to user needs
✅ Reference previous conversations when relevant

**NEVER DO**:
❌ Diagnose mental health conditions
❌ Minimize or dismiss concerns
❌ Give medical advice about medications
❌ Use toxic positivity ("just think positive")
❌ Break confidentiality
❌ Ignore crisis indicators

## SPECIALIZED SUPPORT AREAS

**Depression/Low Mood**:
- Behavioral activation with small, achievable goals
- Challenge negative self-talk
- Encourage social connection
- Self-compassion exercises

**Anxiety/Panic**:
- Immediate grounding (5-4-3-2-1 technique)
- Breathing exercises (4-7-8 method)
- Cognitive challenges for catastrophic thinking
- Progressive muscle relaxation

**Anger/Frustration**:
- Cool-down strategies
- Identify underlying emotions (hurt, fear)
- Communication skills
- Healthy expression techniques

**Relationship Issues**:
- Communication skills training
- Boundary setting guidance
- Conflict resolution strategies
- Attachment style education

**Work/Life Stress**:
- Time management and organization
- Perfectionism challenges
- Work-life balance
- Stress inoculation

## RESPONSE STRUCTURE
1. **Acknowledge** what the user shared
2. **Validate** their emotions and experience
3. **Explore** with thoughtful questions
4. **Provide** specific strategies or insights
5. **Encourage** next steps or follow-up

## CRISIS RESOURCES
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International Crisis Lines: Available 24/7
- Local Emergency Services: 911

Remember: You are a sophisticated AI mental health companion. Provide genuine, personalized support that helps users feel understood, validated, and empowered to improve their mental health. Adapt your personality and approach based on what each user needs most.`;

interface UserContext {
  name?: string;
  preferredPersonality?: string;
  currentMood?: string;
  moodTrend?: string;
  frequentTopics?: string[];
  effectiveStrategies?: string[];
  triggers?: string[];
  conversationHistory?: any[];
  riskLevel?: 'low' | 'medium' | 'high';
}

interface GroqResponse {
  response: string;
  metadata: {
    personality: string;
    intervention: string;
    riskLevel: 'low' | 'medium' | 'high';
    followUpQuestions: string[];
    suggestedActions: string[];
    processingTime: number;
  };
}

export class GroqAIService {
  private groqClient: any;

  constructor() {
    this.groqClient = groq;
  }

  /**
   * Generate advanced AI response using Groq's high-speed inference
   */
  async generateResponse(
    message: string,
    userId: string,
    userContext: UserContext = {},
    sentimentScore?: number
  ): Promise<GroqResponse> {
    const startTime = Date.now();

    try {
      // Detect crisis level
      const riskLevel = this.assessRiskLevel(message, sentimentScore);
      
      // Build conversation context
      const systemPrompt = this.buildSystemPrompt(userContext, riskLevel);
      const conversationHistory = this.buildConversationHistory(userContext);

      // Call Groq API
      const completion = await this.groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        model: 'llama3-8b-8192', // Fast and effective for conversations
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: false,
      });

      const response = completion.choices[0]?.message?.content || 
        "I'm here to support you. Could you tell me more about what's on your mind?";

      const processingTime = Date.now() - startTime;

      // Analyze response for metadata
      const metadata = this.analyzeResponse(response, riskLevel, processingTime);

      console.log(`✅ Groq AI Response generated in ${processingTime}ms`);

      return {
        response,
        metadata
      };

    } catch (error) {
      console.error('❌ Groq AI Error:', error);
      
      // Fallback to local response
      return this.getFallbackResponse(message, userContext, sentimentScore);
    }
  }

  /**
   * Assess risk level based on message content and sentiment
   */
  private assessRiskLevel(message: string, sentimentScore?: number): 'low' | 'medium' | 'high' {
    // High risk indicators
    const highRiskKeywords = /suicidal|suicide|kill myself|end it all|want to die|tonight|today|plan to|ready to/i;
    const mediumRiskKeywords = /harm myself|hurt myself|can't go on|no point|hopeless|worthless|give up/i;

    if (highRiskKeywords.test(message)) {
      return 'high';
    } else if (mediumRiskKeywords.test(message)) {
      return 'medium';
    } else if (sentimentScore && sentimentScore < -0.7) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Build comprehensive system prompt with user context
   */
  private buildSystemPrompt(userContext: UserContext, riskLevel: string): string {
    let contextualPrompt = MINDGUARD_GROQ_PROMPT;

    // Add user-specific context
    if (userContext.name) {
      contextualPrompt += `\n\n## USER CONTEXT\nUser's name: ${userContext.name}`;
    }

    if (userContext.preferredPersonality) {
      contextualPrompt += `\nPreferred AI personality: ${userContext.preferredPersonality.toUpperCase()} MODE`;
    }

    if (userContext.currentMood) {
      contextualPrompt += `\nCurrent mood: ${userContext.currentMood}`;
    }

    if (userContext.effectiveStrategies?.length) {
      contextualPrompt += `\nStrategies that worked before: ${userContext.effectiveStrategies.join(', ')}`;
    }

    if (userContext.triggers?.length) {
      contextualPrompt += `\nKnown triggers: ${userContext.triggers.join(', ')}`;
    }

    // Crisis context
    if (riskLevel === 'high') {
      contextualPrompt += `\n\n⚠️ CRISIS ALERT: User is at HIGH RISK. Prioritize safety, provide immediate crisis resources, and encourage professional help.`;
    } else if (riskLevel === 'medium') {
      contextualPrompt += `\n\n⚠️ ELEVATED CONCERN: User may be struggling significantly. Monitor carefully and provide extra support.`;
    }

    // Recent patterns
    if (userContext.frequentTopics?.length) {
      contextualPrompt += `\nRecent discussion topics: ${userContext.frequentTopics.join(', ')}`;
    }

    contextualPrompt += `\n\nRespond with empathy, professionalism, and appropriate intervention based on the context above.`;

    return contextualPrompt;
  }

  /**
   * Build conversation history for context
   */
  private buildConversationHistory(userContext: UserContext): any[] {
    if (!userContext.conversationHistory?.length) {
      return [];
    }

    // Include last 6 messages for context (3 exchanges)
    return userContext.conversationHistory
      .slice(-6)
      .map(conv => ({
        role: conv.isUser ? 'user' : 'assistant',
        content: conv.isUser ? conv.message : conv.response
      }));
  }

  /**
   * Analyze response to extract metadata
   */
  private analyzeResponse(response: string, riskLevel: 'low' | 'medium' | 'high', processingTime: number) {
    // Detect intervention type
    let intervention = 'general_support';
    if (response.includes('988') || response.includes('crisis')) intervention = 'crisis_intervention';
    else if (response.includes('breathing') || response.includes('ground')) intervention = 'anxiety_management';
    else if (response.includes('small step') || response.includes('self-care')) intervention = 'depression_support';
    else if (response.includes('relationship') || response.includes('communication')) intervention = 'relationship_support';

    // Detect personality mode
    let personality = 'adaptive';
    if (response.includes('feel') && response.includes('understand')) personality = 'empathetic';
    else if (response.includes('step') && response.includes('plan')) personality = 'practical';
    else if (response.includes('breathe') || response.includes('present')) personality = 'mindful';
    else if (response.includes('meaning') || response.includes('growth')) personality = 'wise';

    // Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(intervention);
    const suggestedActions = this.generateSuggestedActions(intervention, riskLevel);

    return {
      personality,
      intervention,
      riskLevel,
      followUpQuestions,
      suggestedActions,
      processingTime
    };
  }

  /**
   * Generate relevant follow-up questions
   */
  private generateFollowUpQuestions(intervention: string): string[] {
    const followUps: Record<string, string[]> = {
      crisis_intervention: [
        'Are you in a safe place right now?',
        'Do you have someone you can call for support?',
        'Have you been in contact with a mental health professional?'
      ],
      anxiety_management: [
        'What specific situation is triggering this anxiety?',
        'Have you tried any breathing techniques before?',
        'What does your body feel like right now?'
      ],
      depression_support: [
        'How long have you been feeling this way?',
        'What usually helps you feel even slightly better?',
        'Are you taking care of your basic needs like sleep and food?'
      ],
      relationship_support: [
        'What aspect of this relationship is most challenging?',
        'How do you typically handle conflicts together?',
        'What kind of support feels most needed right now?'
      ],
      general_support: [
        'How are you feeling right now?',
        'What would be most helpful to explore?',
        'Is there anything else on your mind?'
      ]
    };

    return followUps[intervention] || followUps.general_support;
  }

  /**
   * Generate suggested actions based on intervention type
   */
  private generateSuggestedActions(intervention: string, riskLevel: 'low' | 'medium' | 'high'): string[] {
    if (riskLevel === 'high') {
      return ['Call 988 immediately', 'Go to emergency room', 'Contact trusted person'];
    } else if (riskLevel === 'medium') {
      return ['Call crisis hotline', 'Reach out for support', 'Practice safety planning'];
    }

    const actions: Record<string, string[]> = {
      anxiety_management: ['Practice 4-7-8 breathing', 'Try 5-4-3-2-1 grounding', 'Take a short walk'],
      depression_support: ['Do one small self-care activity', 'Reach out to one person', 'Get some sunlight'],
      relationship_support: ['Practice "I" statements', 'Take time to cool down', 'Listen actively'],
      general_support: ['Take deep breaths', 'Practice self-compassion', 'Consider next steps']
    };

    return actions[intervention] || actions.general_support;
  }

  /**
   * Fallback response if Groq API fails
   */
  private getFallbackResponse(message: string, userContext: UserContext, sentimentScore?: number): GroqResponse {
    const riskLevel = this.assessRiskLevel(message, sentimentScore);
    
    let response = "I'm here to support you through whatever you're experiencing. ";
    
    if (riskLevel === 'high') {
      response = "I'm very concerned about you right now. Please call 988 (Suicide Prevention Lifeline) or go to your nearest emergency room immediately. You don't have to face this alone.";
    } else if (riskLevel === 'medium') {
      response = "I can hear that you're going through a really difficult time. Please consider reaching out to the Crisis Text Line (text HOME to 741741) or calling 988 for support.";
    } else if (sentimentScore && sentimentScore < -0.5) {
      response += "I can sense you're struggling right now. What's been weighing on you most lately?";
    } else {
      response += "What would be most helpful for you right now - talking through your feelings, exploring some strategies, or just having someone listen?";
    }

    return {
      response,
      metadata: {
        personality: 'empathetic',
        intervention: 'general_support',
        riskLevel,
        followUpQuestions: ['How are you feeling?', 'What can I help with?'],
        suggestedActions: ['Take your time', 'Share when ready'],
        processingTime: 0
      }
    };
  }
}

// Export singleton instance
export const groqAI = new GroqAIService();

// Helper function for backward compatibility
export const generateGroqResponse = async (
  message: string,
  userId: string,
  userContext: UserContext = {},
  sentimentScore?: number
): Promise<GroqResponse> => {
  return groqAI.generateResponse(message, userId, userContext, sentimentScore);
};