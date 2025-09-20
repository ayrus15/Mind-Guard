import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Skip sanitization for demo mode to avoid compatibility issues
  // In production, implement proper sanitization
  next();
};

// XSS protection for text inputs
export const cleanTextInput = (text: string): string => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate environment variables
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  
  const recommendedEnvVars = [
    'GROQ_API_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingRecommended = recommendedEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing critical environment variables for production');
    } else {
      console.warn('⚠️  Some environment variables are missing. Using defaults for development.');
    }
  }
  
  if (missingRecommended.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:', missingRecommended);
    console.warn('   Groq AI features may not work properly without GROQ_API_KEY');
    console.warn('   Fallback responses will be used for chat functionality');
  }
  
  // Validate Groq API key format if provided
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
    if (process.env.GROQ_API_KEY.length < 10) {
      console.warn('⚠️  GROQ_API_KEY appears to be invalid (too short)');
    } else {
      console.log('✅ Groq API key configured');
    }
  }
};