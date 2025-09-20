import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = mongoSanitize.sanitize(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params);
  }
  
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
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing critical environment variables for production');
    } else {
      console.warn('⚠️  Some environment variables are missing. Using defaults for development.');
    }
  }
};