import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getKitchenDemand } from '../controllers/demandController.js';

const router = express.Router();

router.use(authenticate);

router.get('/summary', authorizeRoles('CHEF', 'ADMIN'), getKitchenDemand);

export default router;
