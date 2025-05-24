import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { AuthRequest } from './authMiddleware';

const logger = createLogger('roleMiddleware');

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      logger.warn('Access denied', { userId: req.user?.id, requiredRoles: roles });
      throw new AppError('Access denied', 403);
    }
    logger.info('Role verified', { userId: req.user?.id, role: userRole });
    next();
  };
};