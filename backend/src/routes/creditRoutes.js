import express from 'express';
import { getStudentCreditWallet, getStudentTransactions } from '../controllers/creditController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getStudentCreditWallet);
router.get('/transactions', getStudentTransactions);

export default router;
