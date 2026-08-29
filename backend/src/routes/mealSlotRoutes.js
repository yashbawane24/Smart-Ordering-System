import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getMealSlots,
  bookMealSlot,
  cancelSlotBooking
} from '../controllers/mealSlotController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMealSlots);
router.post('/book', authorizeRoles('STUDENT'), bookMealSlot);
router.delete('/bookings/:id', authorizeRoles('STUDENT'), cancelSlotBooking);

export default router;
