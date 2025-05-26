import express from 'express';
import { createLogger } from './utils/logger';
import cors from 'cors';
import { syncDatabase } from './models';
import {registerErrorMiddleware } from './middleware/errorMiddleware';
import registerRoutes from './routes';
import { config } from './config';
import rateLimit from 'express-rate-limit';
import path from 'path';

const logger = createLogger('app');

export const app = express();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

app.use(limiter);
app.use(cors());
// app.options("*", cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));




registerRoutes(app);
registerErrorMiddleware(app);

const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();