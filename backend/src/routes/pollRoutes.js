import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getActivePolls,
  submitVote,
  createPollAdmin,
  getPollResultsAdmin
} from '../controllers/pollController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getActivePolls);
router.post('/:id/vote', authorizeRoles('STUDENT'), submitVote);
router.post('/', authorizeRoles('ADMIN'), createPollAdmin);
router.get('/:id/results', authorizeRoles('ADMIN'), getPollResultsAdmin);

export default router;
