// src/utils/emailService.ts
import sgMail from '@sendgrid/mail';
import { config } from '../config';
import { createLogger } from './logger';

const logger = createLogger('email');

export class EmailService {
  static init() {
    if (config.SENDGRID_API_KEY) {
      sgMail.setApiKey(config.SENDGRID_API_KEY);
    }
  }

  static async sendWelcomeEmail(to: string, name: string) {
    if (!config.SENDGRID_API_KEY) {
      logger.warn('SendGrid API key not set');
      return;
    }
    const msg = {
      to,
      from: 'no-reply@taskapi.com', // Verified sender
      subject: 'Welcome to TaskAPI!',
      html: `<p>Hi ${name},</p><p>Welcome to TaskAPI! Start managing your tasks at <a href="${config.FRONTEND_URL}">${config.FRONTEND_URL}</a>.</p>`,
    };
    try {
      await sgMail.send(msg);
      logger.info('Welcome email sent', { to });
    } catch (error) {
      logger.error('Failed to send welcome email', { error });
    }
  }

  static async sendPasswordResetEmail(to: string, token: string) {
    if (!config.SENDGRID_API_KEY) {
      logger.warn('SendGrid API key not set');
      return;
    }
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
    const msg = {
      to,
      from: 'no-reply@taskapi.com',
      subject: 'Reset Your TaskAPI Password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    };
    try {
      await sgMail.send(msg);
      logger.info('Password reset email sent', { to });
    } catch (error) {
      logger.error('Failed to send password reset email', { error });
    }
  }
}