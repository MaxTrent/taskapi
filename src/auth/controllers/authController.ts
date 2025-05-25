import { Request, Response, NextFunction } from 'express';
import { register, login, verifyOtp } from '../services/authService';
import { createLogger } from '../../utils/logger';
import { RegisterInput, LoginInput, VerifyOtpInput } from '../schemas';
import { AppError } from '../../utils/errors';

const logger = createLogger('authController');

export const registerUser = async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
  try {
    logger.info('Handling register request', { email: req.body.email });
    const { email, password, phone, deliveryMethod, role } = req.body;
    if (deliveryMethod === 'phone' && !phone) {
      throw new AppError('Phone number required for SMS OTP', 400);
    }
    const user = await register({ email, password, phone, deliveryMethod, role });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, message: 'OTP sent' });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
  try {
    logger.info('Handling login request', { email: req.body.email });
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyUserOtp = async (req: Request<{}, {}, VerifyOtpInput>, res: Response, next: NextFunction) => {
  try {
    logger.info('Handling OTP verification', { email: req.body.email });
    const { email, otp } = req.body;
    const { user, token } = await verifyOtp({ email, otp });
    res.status(200).json({ id: user.id, email: user.email, role: user.role, token, message: 'Account verified' });
  } catch (error) {
    next(error);
  }
};