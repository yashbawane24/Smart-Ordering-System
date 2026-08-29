import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getConsumptionAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authenticate);

router.get('/consumption', authorizeRoles('ADMIN', 'CHEF'), getConsumptionAnalytics);

export default router;
