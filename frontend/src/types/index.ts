export interface User {
  id: string;
  email: string;
  name: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  emergencyContacts?: {
    name: string;
    phone: string;
    relationship: string;
  }[];
}

export interface EmotionData {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  userId: string;
}

export interface ConversationData {
  id: string;
  message: string;
  response: string;
  sentimentScore?: number;
  timestamp: string;
  userId: string;
}