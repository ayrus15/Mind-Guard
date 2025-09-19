import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';
import { demoStorage } from '../utils/demoStorage';

const userRepository = AppDataSource.getRepository(User);

// Check if database is connected
const isDatabaseConnected = () => {
  return AppDataSource.isInitialized;
};

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, emergencyContacts } = req.body;

    if (isDatabaseConnected()) {
      // Database mode
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = userRepository.create({
        email,
        passwordHash,
        name,
        emergencyContacts: emergencyContacts || [],
      });

      await userRepository.save(user);

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
        },
        accessToken,
        refreshToken,
      });
    } else {
      // Demo mode
      const existingUser = await demoStorage.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      const user = await demoStorage.createUser({
        email,
        password,
        name,
        emergencyContacts: emergencyContacts || [],
      });

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.status(201).json({
        message: 'User created successfully (Demo Mode)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
        },
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (isDatabaseConnected()) {
      // Database mode
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
        },
        accessToken,
        refreshToken,
      });
    } else {
      // Demo mode
      const user = await demoStorage.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.json({
        message: 'Login successful (Demo Mode)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
        },
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (isDatabaseConnected()) {
      // Database mode
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } else {
      // Demo mode
      const user = await demoStorage.findUserById(userId!);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emergencyContacts: user.emergencyContacts,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};