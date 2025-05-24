import { Express, Router, Request, Response } from 'express';
import { createLogger } from './utils/logger';
import authRoutes from './auth/routes';
import taskRoutes from './task/routes';

const logger = createLogger('routes');
const appRouter = Router();

appRouter.use('/auth', authRoutes);
appRouter.use('/tasks', taskRoutes);

export default function registerRoutes(app: Express) {

  app.get('/status', (req: Request, res: Response) => {
    logger.info('Handling status request', { ip: req.ip, url: req.originalUrl });
    res.status(200).json({
      success: true,
      message: 'OK',
      timestamp: new Date().toISOString(),
      IP: req.ip,
      URL: req.originalUrl,
    });
  });

  app.use('/api', appRouter);
}