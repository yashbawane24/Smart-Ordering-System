import express from 'express';
import { getChefOrders, updateOrderStatusByChef } from '../controllers/orderController.js';
import { updateItemAvailability } from '../controllers/menuController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('CHEF', 'ADMIN'));

router.get('/orders', getChefOrders);
router.patch('/orders/:id/status', updateOrderStatusByChef);
router.patch('/menu/:id/availability', updateItemAvailability);

export default router;
