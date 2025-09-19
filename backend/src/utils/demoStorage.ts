// In-memory storage for demo mode when database is not available
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface DemoUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface DemoConversation {
  id: string;
  message: string;
  response: string;
  sentimentScore?: number;
  timestamp: Date;
  userId: string;
}

interface DemoEmotion {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: Date;
  userId: string;
}

class DemoStorage {
  private users: Map<string, DemoUser> = new Map();
  private conversations: DemoConversation[] = [];
  private emotions: DemoEmotion[] = [];

  // User operations
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    emergencyContacts?: any[];
  }): Promise<DemoUser> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    const user: DemoUser = {
      id,
      email: userData.email,
      passwordHash,
      name: userData.name,
      emergencyContacts: userData.emergencyContacts || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<DemoUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<DemoUser | null> {
    return this.users.get(id) || null;
  }

  // Conversation operations
  async saveConversation(conversationData: {
    message: string;
    response: string;
    sentimentScore?: number;
    userId: string;
  }): Promise<DemoConversation> {
    const conversation: DemoConversation = {
      id: uuidv4(),
      ...conversationData,
      timestamp: new Date(),
    };

    this.conversations.push(conversation);
    return conversation;
  }

  async getConversationsByUserId(userId: string): Promise<DemoConversation[]> {
    return this.conversations.filter(conv => conv.userId === userId);
  }

  // Emotion operations
  async saveEmotion(emotionData: {
    emotion: string;
    confidence: number;
    userId: string;
  }): Promise<DemoEmotion> {
    const emotion: DemoEmotion = {
      id: uuidv4(),
      ...emotionData,
      timestamp: new Date(),
    };

    this.emotions.push(emotion);
    return emotion;
  }

  async getEmotionsByUserId(userId: string): Promise<DemoEmotion[]> {
    return this.emotions.filter(emotion => emotion.userId === userId);
  }

  // Initialize with demo user
  async initializeDemo() {
    const demoUser = await this.createUser({
      email: 'demo@mindguard.ai',
      password: 'demo123',
      name: 'Demo User',
      emergencyContacts: [
        {
          name: 'Emergency Contact',
          phone: '+1-555-0123',
          relationship: 'Friend'
        }
      ]
    });

    console.log('🎭 Demo user created:');
    console.log('   Email: demo@mindguard.ai');
    console.log('   Password: demo123');
    
    return demoUser;
  }
}

export const demoStorage = new DemoStorage();