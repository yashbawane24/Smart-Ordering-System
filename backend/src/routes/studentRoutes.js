import express from 'express';
import { getStudentDashboard, updateStudentProfile } from '../controllers/studentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('STUDENT'));

router.get('/dashboard', getStudentDashboard);
router.patch('/profile', updateStudentProfile);

export default router;
