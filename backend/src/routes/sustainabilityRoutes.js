import express from 'express';
import {
  getPublicMetrics,
  getMethodology,
  updateConfig,
  triggerRecalculate
} from '../controllers/sustainabilityController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getPublicMetrics);
router.get('/methodology', getMethodology);

// Admin protected routes
router.put('/config', authenticate, authorizeRoles('ADMIN'), updateConfig);
router.post('/recalculate', authenticate, authorizeRoles('ADMIN'), triggerRecalculate);

export default router;
