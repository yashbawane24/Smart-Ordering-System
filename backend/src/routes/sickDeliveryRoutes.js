import express from 'express';
import {
  submitRequest,
  getMyRequests,
  getWardenRequests,
  approveRequest,
  rejectRequest,
  checkMyAccess
} from '../controllers/sickDeliveryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Student endpoints
router.post('/requests', authorizeRoles('STUDENT'), submitRequest);
router.get('/requests/me', authorizeRoles('STUDENT'), getMyRequests);
router.get('/access/me', authorizeRoles('STUDENT'), checkMyAccess);

// Warden & Admin approval endpoints
router.get('/requests', authorizeRoles('WARDEN', 'ADMIN'), getWardenRequests);
router.put('/requests/:id/approve', authorizeRoles('WARDEN', 'ADMIN'), approveRequest);
router.put('/requests/:id/reject', authorizeRoles('WARDEN', 'ADMIN'), rejectRequest);

export default router;
