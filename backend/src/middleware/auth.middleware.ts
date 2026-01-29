import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import User from '../models/User.model';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/tokenService';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    console.log('    Auth Header:', authHeader);
    
    const token = extractTokenFromHeader(authHeader);
    console.log('    Extracted Token:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      throw new AppError('Access token required. Use: Authorization: Bearer {token}', 401);
    }

    // Verify access token
    let decoded;
    try {
      console.log('🔍 Verifying access token...');
      decoded = verifyAccessToken(token);
      console.log('    Token verified:', { userId: decoded.userId, email: decoded.email });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Token verification failed';
      console.log('  Token verification failed:', errorMsg);
      throw new AppError(`Invalid token: ${errorMsg}`, 401);
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Access token has expired. Please use refresh token to get new access token.', 401);
    }
    next(error);
  }
};