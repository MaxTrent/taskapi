import express from 'express';
import { createLogger } from './utils/logger';
import cors from 'cors';
import { syncDatabase } from './models';
import {registerErrorMiddleware } from './middleware/errorMiddleware';
import registerRoutes from './routes';
import { config } from './config';

const logger = createLogger('app');

export const app = express();

app.use(cors());
// app.options("*", cors());
app.use(express.json());


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