import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getTodayEntitlements } from '../controllers/entitlementController.js';

const router = express.Router();

router.use(authenticate);

router.get('/today', authorizeRoles('STUDENT'), getTodayEntitlements);

export default router;
