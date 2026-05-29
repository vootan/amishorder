import { Router } from 'express';
import { signup, verifyEmail, login, logout, me } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/signup', signup);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
