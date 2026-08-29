import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  getOrCreateCollectionToken,
  verifyCollectionTokenTransaction,
  checkAndUpdateNoShows
} from '../services/collectionService.js';

export const getOrderCollectionQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const tokenRecord = await getOrCreateCollectionToken(id, student.id);
    return successResponse(res, 200, 'Collection token generated', tokenRecord);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to retrieve collection QR');
  }
};

export const verifyCollectionQR = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 400, 'Collection token or order number is required');
    }

    // Auto-update any expired no-shows first
    await checkAndUpdateNoShows();

    const result = await verifyCollectionTokenTransaction({ tokenInput: token });
    return successResponse(res, 200, 'Meal marked as COLLECTED successfully', result);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Verification failed');
  }
};
