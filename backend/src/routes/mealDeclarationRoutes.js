import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getStudentDeclarations,
  updateMealDeclaration
} from '../controllers/mealDeclarationController.js';

const router = express.Router();

router.use(authenticate);

router.get('/declarations', authorizeRoles('STUDENT'), getStudentDeclarations);
router.post('/declarations', authorizeRoles('STUDENT'), updateMealDeclaration);

export default router;
