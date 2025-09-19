import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Conversation } from '../models/Conversation';
import { Emotion } from '../models/Emotion';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mindguard',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Conversation, Emotion],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('Database connection failed, running in demo mode:', errorMessage);
    // In demo mode, we'll skip database operations
    return false;
  }
  return true;
};