import express from 'express';
import { getAllMenuItems } from '../controllers/menuController.js';

const router = express.Router();

// Public endpoint for menu listing
router.get('/', getAllMenuItems);

export default router;
