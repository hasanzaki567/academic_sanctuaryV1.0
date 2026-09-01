import { Router } from 'express';
import { getMe, login, signup, logout } from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', getMe);
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

export default router;
