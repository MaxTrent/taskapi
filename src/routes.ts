import { Express, Router, Request, Response } from 'express';
import { createLogger } from './utils/logger';
import authRoutes from './auth/routes';
import taskRoutes from './task/routes';
import healthRoutes from './health';
import { getAccessToken, getAuthUrl } from 'utils/googleCalendar';
import { AppError } from 'utils/errors';

const logger = createLogger('routes');
const appRouter = Router();

appRouter.use('/auth', authRoutes);
appRouter.use('/tasks', taskRoutes);
appRouter.use('/health', healthRoutes);

appRouter.get('/auth/google', (req: Request, res: Response) => {
  logger.info('Handling Google auth redirect');
  const url = getAuthUrl();
  res.redirect(url);
});

appRouter.get('/auth/google/callback', async (req: Request, res: Response) => {
  logger.info('Handling Google auth callback', { code: req.query.code });
  try {
    const { code } = req.query as { code: string };
    if (!code) {
      throw new AppError('Authorization code is required', 400, ['Authorization code is required']);
    }
    const tokens = await getAccessToken(code);
    res.json({ success: true, tokens });
  } catch (error) {
    logger.error('Google auth failed', { error });
    throw error instanceof AppError ? error : new AppError('Google auth failed', 500, [(error as Error).message]);
  }
});

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