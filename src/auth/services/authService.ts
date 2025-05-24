import { User } from '../../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import { AppError } from '../../utils/errors';
import { RegisterInput, LoginInput } from '../schemas';
import { config } from 'config';

const logger = createLogger('authService');

export const register = async ({ email, password, role = 'user' }: RegisterInput) => {
  logger.info('Registering user...', { email, role });
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    logger.warn('User already exists', { email });
    throw new AppError('User already exists', 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role });
  logger.info('User registered', { userId: user.id });
  return user;
};

export const login = async ({ email, password }: LoginInput) => {
  logger.info('logging in...', { email });
  const user = await User.findOne({ where: { email } });
  if (!user) {
    logger.warn('User not found', { email });
    throw new AppError('Invalid credentials', 401);
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    logger.warn('Invalid password', { email });
    throw new AppError('Invalid credentials', 401);
  }
  const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: '1h' });
  logger.info('Login successful', { userId: user.id });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};