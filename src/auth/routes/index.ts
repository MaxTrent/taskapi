import { Router } from 'express';
import { registerUser, loginUser, verifyUserOtp } from '../controllers/authController';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, verifyOtpSchema } from '../schemas';

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/verify-otp', validate(verifyOtpSchema), verifyUserOtp);

export default router;