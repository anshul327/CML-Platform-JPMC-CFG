import express from 'express';
import { 
  signup, 
  login, 
  signout, 
  getProfile, 
  updateProfile 
} from '../controllers/expertAuth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require JWT authentication)
router.post('/signout', authenticateToken, signout);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router; 