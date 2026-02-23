import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginRateLimit, registerRateLimit } from '../middleware/security.js';

const router = express.Router();

// Rotas com Rate Limiting
router.post('/register', registerRateLimit, register);
router.post('/login', loginRateLimit, login);
router.get('/profile', protect, getProfile);

export default router;
