import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createLogger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { config } from '../config';

const logger = createLogger('authMiddleware');

export interface JwtPayload {
  id: number;
  role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.warn('No token provided', { path: req.path });
    throw new AppError('Unauthorized', 401, ['No token provided']);
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    logger.info('Token verified', { userId: decoded.id, role: decoded.role });
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Invalid token', { error });
    throw new AppError('Unauthorized', 401, ['Invalid or expired token']);
  }
};