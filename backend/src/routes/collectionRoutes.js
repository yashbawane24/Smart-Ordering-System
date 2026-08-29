import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getOrderCollectionQR, verifyCollectionQR } from '../controllers/collectionController.js';

const router = express.Router();

router.use(authenticate);

router.get('/orders/:id/collection-qr', authorizeRoles('STUDENT'), getOrderCollectionQR);
router.post('/verify', authorizeRoles('CHEF', 'ADMIN'), verifyCollectionQR);

export default router;
