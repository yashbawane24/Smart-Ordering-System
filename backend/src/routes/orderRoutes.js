import express from 'express';
import { placeOrder, getStudentOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', placeOrder);
router.get('/', getStudentOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

export default router;
