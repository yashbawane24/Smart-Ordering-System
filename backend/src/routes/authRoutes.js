import express from 'express';
import { login, getCurrentUser, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
