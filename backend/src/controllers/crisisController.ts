import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { CrisisAlert } from '../models/CrisisAlert';
import { MoodEntry } from '../models/MoodEntry';
import { Emotion } from '../models/Emotion';
import { Conversation } from '../models/Conversation';
import { demoStorage } from '../utils/demoStorage';

const crisisAlertRepository = AppDataSource.getRepository(CrisisAlert);
const moodRepository = AppDataSource.getRepository(MoodEntry);
const emotionRepository = AppDataSource.getRepository(Emotion);
const conversationRepository = AppDataSource.getRepository(Conversation);

const isDatabaseConnected = () => {
  return AppDataSource.isInitialized;
};

// Simple risk assessment algorithm
const assessRiskLevel = (data: any): 'low' | 'medium' | 'high' => {
  let riskScore = 0;
  
  // Mood analysis
  if (data.recentMoods && data.recentMoods.length > 0) {
    const avgMood = data.recentMoods.reduce((sum: number, mood: any) => sum + mood.moodScore, 0) / data.recentMoods.length;
    if (avgMood <= 3) riskScore += 3;
    else if (avgMood <= 5) riskScore += 1;
    
    // Check for consistent low mood
    const lowMoodCount = data.recentMoods.filter((mood: any) => mood.moodScore <= 3).length;
    if (lowMoodCount >= 3) riskScore += 2;
  }

  // Emotion analysis
  if (data.recentEmotions && data.recentEmotions.length > 0) {
    const negativeEmotions = ['sad', 'angry', 'fear', 'disgust', 'anxious', 'depressed'];
    const negativeCount = data.recentEmotions.filter((emotion: any) => 
      negativeEmotions.includes(emotion.emotion.toLowerCase())
    ).length;
    
    if (negativeCount >= 5) riskScore += 2;
    else if (negativeCount >= 3) riskScore += 1;
  }

  // Sentiment analysis from conversations
  if (data.recentConversations && data.recentConversations.length > 0) {
    const avgSentiment = data.recentConversations.reduce((sum: number, conv: any) => 
      sum + (conv.sentimentScore || 0), 0) / data.recentConversations.length;
    
    if (avgSentiment <= -0.5) riskScore += 2;
    else if (avgSentiment <= -0.2) riskScore += 1;
  }

  // Crisis keywords in text
  if (data.recentMoods && data.recentMoods.some((mood: any) => mood.text)) {
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself', 'self-harm'];
    const hasKeywords = data.recentMoods.some((mood: any) => 
      mood.text && crisisKeywords.some(keyword => mood.text.toLowerCase().includes(keyword))
    );
    if (hasKeywords) riskScore += 5;
  }

  if (riskScore >= 6) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
};

export const assessCrisisRisk = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Gather recent data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let recentMoods, recentEmotions, recentConversations;

    if (isDatabaseConnected()) {
      // Database mode
      recentMoods = await moodRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: 10,
      });

      recentEmotions = await emotionRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: 20,
      });

      recentConversations = await conversationRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: 10,
      });
    } else {
      // Demo mode
      recentMoods = await demoStorage.getMoodEntriesByUserId(userId);
      recentMoods = recentMoods.slice(0, 10);

      recentEmotions = await demoStorage.getEmotionsByUserId(userId);
      recentEmotions = recentEmotions.slice(0, 20);

      recentConversations = await demoStorage.getConversationsByUserId(userId);
      recentConversations = recentConversations.slice(0, 10);
    }

    const triggerData = {
      moodData: recentMoods,
      emotionData: recentEmotions,
      chatData: recentConversations,
      analysis: 'Automated risk assessment based on recent activity'
    };

    const riskLevel = assessRiskLevel({
      recentMoods,
      recentEmotions,
      recentConversations
    });

    // Create crisis alert if medium or high risk
    if (riskLevel !== 'low') {
      let crisisAlert;

      if (isDatabaseConnected()) {
        crisisAlert = crisisAlertRepository.create({
          riskLevel,
          triggerData,
          userId,
        });
        await crisisAlertRepository.save(crisisAlert);
      } else {
        crisisAlert = await demoStorage.saveCrisisAlert({
          riskLevel,
          triggerData,
          userId,
        });
      }
    }

    res.json({
      riskLevel,
      timestamp: new Date(),
      dataAnalyzed: {
        moodEntries: recentMoods.length,
        emotions: recentEmotions.length,
        conversations: recentConversations.length
      }
    });

  } catch (error) {
    console.error('Error assessing crisis risk:', error);
    res.status(500).json({ message: 'Failed to assess crisis risk' });
  }
};

export const sendCrisisAlert = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { riskLevel, triggerData } = req.body;

    // In a real implementation, this would:
    // 1. Send email notifications to emergency contacts
    // 2. Alert monitoring systems
    // 3. Potentially contact emergency services for high risk

    console.log(`🚨 CRISIS ALERT - User ${userId} - Risk Level: ${riskLevel}`);
    console.log('Emergency contacts would be notified in production');

    let crisisAlert;

    if (isDatabaseConnected()) {
      crisisAlert = crisisAlertRepository.create({
        riskLevel,
        triggerData: triggerData || { manual: true },
        userId,
      });
      await crisisAlertRepository.save(crisisAlert);
    } else {
      crisisAlert = await demoStorage.saveCrisisAlert({
        riskLevel,
        triggerData: triggerData || { manual: true },
        userId,
      });
    }

    res.json({
      message: 'Crisis alert sent successfully',
      alertId: crisisAlert.id,
      timestamp: crisisAlert.timestamp
    });

  } catch (error) {
    console.error('Error sending crisis alert:', error);
    res.status(500).json({ message: 'Failed to send crisis alert' });
  }
};