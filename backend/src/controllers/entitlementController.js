import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getStudentTodayEntitlements } from '../services/entitlementService.js';

export const getTodayEntitlements = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const data = await getStudentTodayEntitlements(student.id);
    return successResponse(res, 200, 'Entitlements retrieved', data);
  } catch (error) {
    next(error);
  }
};
