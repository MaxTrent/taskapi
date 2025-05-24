import { Request, Response } from 'express';
import { register, login } from '../services/authService';
import { createLogger } from '../../utils/logger';
import { RegisterInput, LoginInput } from '../schemas';

const logger = createLogger('authController');

export const registerUser = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  logger.info('Handling register request', { email: req.body.email });
  const user = await register(req.body);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
};

export const loginUser = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  logger.info('Handling login request', { email: req.body.email });
  const result = await login(req.body);
  res.status(200).json(result);
};