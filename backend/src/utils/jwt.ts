import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JwtPayload;
};