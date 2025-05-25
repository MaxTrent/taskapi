import sgMail from '@sendgrid/mail';
   import twilio from 'twilio';
   import { config } from '../config';
   import { createLogger } from './logger';

   const logger = createLogger('notification');

   export class NotificationService {
     private static twilioClient: twilio.Twilio | null = null;

     static init() {
       if (config.SENDGRID_API_KEY) {
         sgMail.setApiKey(config.SENDGRID_API_KEY);
       }
       if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
         this.twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
       }
     }

     static generateOtp(): string {
       return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
     }

     static async sendOtpEmail(to: string, otp: string) {
       if (!config.SENDGRID_API_KEY) {
         logger.warn('SendGrid API key not set');
         return false;
       }
       const msg = {
         to,
         from: 'no-reply@taskapi.com', // Verified sender
         subject: 'TaskAPI OTP Verification',
         html: `
           <p>Your TaskAPI verification OTP is: <strong>${otp}</strong></p>
           <p>Use this code to verify your account. It expires in 10 minutes.</p>
           ${config.FRONTEND_URL ? `<p>Verify here: <a href="${config.FRONTEND_URL}/verify?otp=${otp}&email=${encodeURIComponent(to)}">${config.FRONTEND_URL}/verify</a></p>` : ''}
         `,
       };
       try {
         await sgMail.send(msg);
         logger.info('OTP email sent', { to });
         return true;
       } catch (error) {
         logger.error('Failed to send OTP email', { error });
         return false;
       }
     }

     static async sendOtpSms(phone: string, otp: string) {
       if (!this.twilioClient || !config.TWILIO_PHONE_NUMBER) {
         logger.warn('Twilio not configured');
         return false;
       }
       try {
         await this.twilioClient.messages.create({
           body: `Your TaskAPI OTP is ${otp}. It expires in 10 minutes.`,
           from: config.TWILIO_PHONE_NUMBER,
           to: phone,
         });
         logger.info('OTP SMS sent', { phone });
         return true;
       } catch (error) {
         logger.error('Failed to send OTP SMS', { error });
         return false;
       }
     }
   }