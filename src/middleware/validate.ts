import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';
import { createLogger } from '../utils/logger';
import { AppError } from '../utils/errors';

const logger = createLogger('validateMiddleware');

export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return async (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
    try {
      logger.info('Validating request body', { path: req.path, body: req.body });
      const result = await schema.parseAsync(req.body);
      req.body = result as z.infer<T>;
      logger.info('Validation successful', { path: req.path, parsedBody: req.body });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Validation failed', { path: req.path, details });
        throw new AppError('Validation failed', 400, details);
      }
      logger.error('Unexpected validation error', { error });
      throw new AppError('Internal server error', 500);
    }
  };
};