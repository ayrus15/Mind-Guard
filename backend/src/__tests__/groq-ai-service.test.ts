import { GroqAIService, generateGroqResponse } from '../utils/groq-ai-service';

// Mock the Groq SDK
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }));
});

describe('GroqAIService', () => {
  let groqService: GroqAIService;
  let mockGroqClient: any;

  beforeEach(() => {
    // Set up environment
    process.env.GROQ_API_KEY = 'test-api-key';
    
    groqService = new GroqAIService();
    mockGroqClient = (groqService as any).groqClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Risk Assessment', () => {
    test('should identify high risk messages', () => {
      const highRiskMessages = [
        'I want to kill myself',
        'I have a plan to die',
        'I want to end my life',
        'I am going to suicide',
        'I want to end it all'
      ];

      highRiskMessages.forEach(message => {
        const riskLevel = (groqService as any).assessRiskLevel(message);
        expect(riskLevel).toBe('high');
      });
    });

    test('should identify medium risk messages', () => {
      const mediumRiskMessages = [
        'I want to harm myself',
        'I feel hopeless and worthless',
        'I can\'t go on anymore',
        'There is no point in living'
      ];

      mediumRiskMessages.forEach(message => {
        const riskLevel = (groqService as any).assessRiskLevel(message);
        expect(riskLevel).toBe('medium');
      });
    });

    test('should identify low risk messages', () => {
      const lowRiskMessages = [
        'I had a difficult day',
        'I feel a bit sad',
        'Work was stressful',
        'I need someone to talk to'
      ];

      lowRiskMessages.forEach(message => {
        const riskLevel = (groqService as any).assessRiskLevel(message);
        expect(riskLevel).toBe('low');
      });
    });

    test('should consider sentiment score in risk assessment', () => {
      const message = 'I feel really down';
      
      // Very negative sentiment should increase risk to medium
      const highRisk = (groqService as any).assessRiskLevel(message, -0.8);
      expect(highRisk).toBe('medium');
      
      // Neutral sentiment should remain low
      const lowRisk = (groqService as any).assessRiskLevel(message, 0.1);
      expect(lowRisk).toBe('low');
    });
  });

  describe('System Prompt Building', () => {
    test('should build basic system prompt', () => {
      const userContext = {};
      const riskLevel = 'low';
      
      const prompt = (groqService as any).buildSystemPrompt(userContext, riskLevel);
      
      expect(prompt).toContain('MindGuard AI');
      expect(prompt).toContain('mental health companion');
      expect(prompt).toContain('empathy, professionalism');
    });

    test('should include user context in prompt', () => {
      const userContext = {
        name: 'John',
        preferredPersonality: 'empathetic',
        currentMood: 'anxious',
        effectiveStrategies: ['deep breathing', 'meditation'],
        triggers: ['work stress', 'family issues']
      };
      const riskLevel = 'medium';
      
      const prompt = (groqService as any).buildSystemPrompt(userContext, riskLevel);
      
      expect(prompt).toContain('John');
      expect(prompt).toContain('EMPATHETIC MODE');
      expect(prompt).toContain('anxious');
      expect(prompt).toContain('deep breathing, meditation');
      expect(prompt).toContain('work stress, family issues');
      expect(prompt).toContain('ELEVATED CONCERN');
    });

    test('should include crisis alert for high risk', () => {
      const userContext = {};
      const riskLevel = 'high';
      
      const prompt = (groqService as any).buildSystemPrompt(userContext, riskLevel);
      
      expect(prompt).toContain('CRISIS ALERT');
      expect(prompt).toContain('HIGH RISK');
      expect(prompt).toContain('immediate crisis resources');
    });
  });

  describe('Conversation History Building', () => {
    test('should handle empty conversation history', () => {
      const userContext = {};
      
      const history = (groqService as any).buildConversationHistory(userContext);
      
      expect(history).toEqual([]);
    });

    test('should build conversation history correctly', () => {
      const userContext = {
        conversationHistory: [
          { isUser: true, message: 'Hello', response: '' },
          { isUser: false, message: '', response: 'Hi there! How are you?' },
          { isUser: true, message: 'I feel sad', response: '' },
          { isUser: false, message: '', response: 'I hear that you\'re feeling sad.' }
        ]
      };
      
      const history = (groqService as any).buildConversationHistory(userContext);
      
      expect(history).toHaveLength(4);
      expect(history[0]).toEqual({ role: 'user', content: 'Hello' });
      expect(history[1]).toEqual({ role: 'assistant', content: 'Hi there! How are you?' });
    });

    test('should limit conversation history to last 6 messages', () => {
      const userContext = {
        conversationHistory: Array.from({ length: 10 }, (_, i) => ({
          isUser: i % 2 === 0,
          message: i % 2 === 0 ? `Message ${i}` : '',
          response: i % 2 === 1 ? `Response ${i}` : ''
        }))
      };
      
      const history = (groqService as any).buildConversationHistory(userContext);
      
      expect(history).toHaveLength(6);
      // Should include the last 6 messages (indexes 4-9)
      expect(history[0].content).toContain('4');
    });
  });

  describe('Response Generation', () => {
    test('should generate response successfully', async () => {
      const mockCompletion = {
        choices: [{
          message: {
            content: 'I understand you\'re feeling difficult emotions right now. Can you tell me more about what\'s been weighing on you?'
          }
        }]
      };
      
      mockGroqClient.chat.completions.create.mockResolvedValue(mockCompletion);
      
      const response = await groqService.generateResponse(
        'I feel really sad',
        'user123',
        { currentMood: 'sad' },
        -0.5
      );
      
      expect(response.response).toBe(mockCompletion.choices[0].message.content);
      expect(response.metadata.riskLevel).toBe('low');
      expect(response.metadata.processingTime).toBeGreaterThanOrEqual(0);
      expect(response.metadata.followUpQuestions).toBeDefined();
      expect(response.metadata.suggestedActions).toBeDefined();
    });

    test('should handle API errors with fallback response', async () => {
      mockGroqClient.chat.completions.create.mockRejectedValue(new Error('API Error'));
      
      const response = await groqService.generateResponse(
        'I feel sad',
        'user123',
        {},
        -0.3
      );
      
      expect(response.response).toContain('I\'m here to support you');
      expect(response.metadata.riskLevel).toBe('low');
      expect(response.metadata.processingTime).toBe(0);
    });

    test('should provide crisis response for high risk situations', async () => {
      mockGroqClient.chat.completions.create.mockRejectedValue(new Error('API Error'));
      
      const response = await groqService.generateResponse(
        'I want to kill myself',
        'user123',
        {},
        -0.9
      );
      
      expect(response.response).toContain('988');
      expect(response.response).toContain('emergency room');
      expect(response.metadata.riskLevel).toBe('high');
    });
  });

  describe('Response Analysis', () => {
    test('should detect intervention types correctly', () => {
      const crisisResponse = 'Please call 988 for immediate crisis support';
      const anxietyResponse = 'Let\'s try some breathing exercises to help you ground yourself';
      const depressionResponse = 'Taking small steps and practicing self-care can help';
      const relationshipResponse = 'Communication skills are important in relationships';
      
      const crisisMetadata = (groqService as any).analyzeResponse(crisisResponse, 'high', 100);
      expect(crisisMetadata.intervention).toBe('crisis_intervention');
      
      const anxietyMetadata = (groqService as any).analyzeResponse(anxietyResponse, 'low', 100);
      expect(anxietyMetadata.intervention).toBe('anxiety_management');
      
      const depressionMetadata = (groqService as any).analyzeResponse(depressionResponse, 'low', 100);
      expect(depressionMetadata.intervention).toBe('depression_support');
      
      const relationshipMetadata = (groqService as any).analyzeResponse(relationshipResponse, 'low', 100);
      expect(relationshipMetadata.intervention).toBe('relationship_support');
    });

    test('should detect personality modes correctly', () => {
      const empatheticResponse = 'I can really feel how difficult this must be for you and I understand';
      const practicalResponse = 'Let\'s create a step-by-step plan to address this';
      const mindfulResponse = 'Let\'s pause and breathe together in this present moment';
      const wiseResponse = 'This challenge might be showing you something important about your growth and meaning';
      
      const empatheticMetadata = (groqService as any).analyzeResponse(empatheticResponse, 'low', 100);
      expect(empatheticMetadata.personality).toBe('empathetic');
      
      const practicalMetadata = (groqService as any).analyzeResponse(practicalResponse, 'low', 100);
      expect(practicalMetadata.personality).toBe('practical');
      
      const mindfulMetadata = (groqService as any).analyzeResponse(mindfulResponse, 'low', 100);
      expect(mindfulMetadata.personality).toBe('mindful');
      
      const wiseMetadata = (groqService as any).analyzeResponse(wiseResponse, 'low', 100);
      expect(wiseMetadata.personality).toBe('wise');
    });
  });

  describe('Follow-up Questions and Actions', () => {
    test('should generate appropriate follow-up questions for crisis intervention', () => {
      const questions = (groqService as any).generateFollowUpQuestions('crisis_intervention');
      
      expect(questions).toContain('Are you in a safe place right now?');
      expect(questions).toContain('Do you have someone you can call for support?');
    });

    test('should generate appropriate actions for different risk levels', () => {
      const highRiskActions = (groqService as any).generateSuggestedActions('general_support', 'high');
      expect(highRiskActions).toContain('Call 988 immediately');
      
      const mediumRiskActions = (groqService as any).generateSuggestedActions('general_support', 'medium');
      expect(mediumRiskActions).toContain('Call crisis hotline');
      
      const lowRiskActions = (groqService as any).generateSuggestedActions('anxiety_management', 'low');
      expect(lowRiskActions).toContain('Practice 4-7-8 breathing');
    });
  });

  describe('Helper Function', () => {
    test('generateGroqResponse should work correctly', async () => {
      const mockCompletion = {
        choices: [{
          message: {
            content: 'I\'m here to help you through this.'
          }
        }]
      };
      
      mockGroqClient.chat.completions.create.mockResolvedValue(mockCompletion);
      
      const response = await generateGroqResponse(
        'I need help',
        'user123',
        { currentMood: 'neutral' },
        0.1
      );
      
      expect(response.response).toBe('I\'m here to help you through this.');
      expect(response.metadata).toBeDefined();
    });
  });
});