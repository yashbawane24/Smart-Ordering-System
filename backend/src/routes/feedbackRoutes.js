import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  submitMealFeedback,
  getFeedbackSummary,
  updateComplaintStatus
} from '../controllers/feedbackController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('STUDENT'), submitMealFeedback);
router.get('/', getFeedbackSummary);
router.put('/complaints/:id/status', authorizeRoles('ADMIN'), updateComplaintStatus);

export default router;
