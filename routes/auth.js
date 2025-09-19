import express from 'express';
import { googleAuth } from '../controllers/authController.js';

const router = express.Router();

// Google authentication route
router.post('/google', googleAuth);

export default router; 