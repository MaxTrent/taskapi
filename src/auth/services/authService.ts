import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';
   import { User, UserCreationAttributes } from '../../models/user';
   import { config } from '../../config';
   import { AppError } from '../../utils/errors';
import { NotificationService } from 'utils/notificatioService';

   export async function registerUser(
     email: string,
     password: string,
     phone: string | null,
     deliveryMethod: 'email' | 'phone',
     role: 'user' | 'admin' = 'user'
   ) {
     NotificationService.init();
     const hashedPassword = await bcrypt.hash(password, 10);
     const otp = NotificationService.generateOtp();
     const userData: UserCreationAttributes = {
       email,
       password: hashedPassword,
       phone: phone || undefined,
       role,
       otp,
       isVerified: false,
     };

     try {
       const user = await User.create(userData);
       let otpSent = false;
       if (deliveryMethod === 'email') {
         otpSent = await NotificationService.sendOtpEmail(email, otp);
       } else if (deliveryMethod === 'phone' && phone) {
         otpSent = await NotificationService.sendOtpSms(phone, otp);
       }
       if (!otpSent) {
         throw new AppError('Failed to send OTP', 500);
       }
       return user;
     } catch (error) {
       if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
         throw new AppError('Email already exists', 400);
       }
       throw error;
     }
   }

   export async function verifyOtp(email: string, otp: string) {
     const user = await User.findOne({ where: { email, otp } });
     if (!user) {
         throw new AppError('Invalid OTP or email', 400);
     }
     await user.update({ isVerified: true, otp: null });
     const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
       expiresIn: '1h',
     });
     return { user, token };
   }

   export async function loginUser(email: string, password: string) {
     const user = await User.findOne({ where: { email } });
     if (!user) {
       throw new AppError('Invalid credentials', 400);
     }
     if (!user.isVerified) {
       throw new AppError('Account not verified. Please verify your OTP.', 403);
     }
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       throw new AppError('Invalid credentials', 400);
     }
     const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
       expiresIn: '1h',
     });
     return { user, token };
   }