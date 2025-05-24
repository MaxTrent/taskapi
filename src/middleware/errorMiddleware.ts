import { Request, Response, NextFunction, Express} from 'express';
import { createLogger } from '../utils/logger';
import { AppError } from '../utils/errors';

const logger = createLogger('errorMiddleware');

export const errorMiddleware = (
  error: AppError | Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (error instanceof AppError) {
    logger.error('AppError', { message: error.message, statusCode: error.statusCode, details: error.details });
     res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  }
  
  logger.error('Unexpected error', { error });
   res.status(500).json({ error: 'Internal server error' });
};

export const registerErrorMiddleware = (app: Express) => {
    app.use(errorMiddleware);
  };