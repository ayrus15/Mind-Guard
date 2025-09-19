import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MoodEntry } from '../models/MoodEntry';
import { analyzeSentiment } from '../utils/sentiment';
import { demoStorage } from '../utils/demoStorage';
import { validationResult } from 'express-validator';

const moodRepository = AppDataSource.getRepository(MoodEntry);

const isDatabaseConnected = () => {
  return AppDataSource.isInitialized;
};

export const createMoodEntry = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moodScore, text } = req.body;
    const userId = (req as any).user.id;

    // Analyze sentiment if text is provided
    let textAnalysis = null;
    if (text) {
      textAnalysis = await analyzeSentiment(text);
    }

    let moodEntry;

    if (isDatabaseConnected()) {
      // Database mode
      moodEntry = moodRepository.create({
        moodScore,
        text: text || '',
        textAnalysis,
        userId,
      });
      await moodRepository.save(moodEntry);
    } else {
      // Demo mode
      moodEntry = await demoStorage.saveMoodEntry({
        moodScore,
        text: text || '',
        textAnalysis,
        userId,
      });
    }

    res.status(201).json({
      id: moodEntry.id,
      moodScore: moodEntry.moodScore,
      text: moodEntry.text,
      textAnalysis: moodEntry.textAnalysis,
      timestamp: moodEntry.timestamp,
    });

  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({ message: 'Failed to save mood entry' });
  }
};

export const getMoodHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 50;

    let moodEntries;

    if (isDatabaseConnected()) {
      // Database mode
      moodEntries = await moodRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: limit,
      });
    } else {
      // Demo mode
      moodEntries = await demoStorage.getMoodEntriesByUserId(userId);
      moodEntries = moodEntries
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    }

    res.json(moodEntries);

  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ message: 'Failed to fetch mood history' });
  }
};