import express from 'express';
import {
  getAdminDashboardStats,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllChefs,
  createChef,
  updateChefStatus
} from '../controllers/adminController.js';
import { getAllOrdersAdmin } from '../controllers/orderController.js';
import { adminAdjustCredit, adminResetMonthlyCredits, getAllStudentCreditsAdmin } from '../controllers/creditController.js';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { getAdminReportsData } from '../controllers/reportController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

// Stats & Reports
router.get('/dashboard', getAdminDashboardStats);
router.get('/reports', getAdminReportsData);

// Students CRUD
router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Chefs CRUD
router.get('/chefs', getAllChefs);
router.post('/chefs', createChef);
router.patch('/chefs/:id/status', updateChefStatus);

// Menu Management
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Orders & Credits
router.get('/orders', getAllOrdersAdmin);
router.get('/credits', getAllStudentCreditsAdmin);
router.post('/credits/allocate', adminResetMonthlyCredits);
router.patch('/credits/adjust', adminAdjustCredit);

export default router;
