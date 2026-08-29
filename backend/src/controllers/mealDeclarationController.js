import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  getStudentDeclarationsService,
  upsertDeclarationService,
  MEAL_CUTOFFS
} from '../services/mealDeclarationService.js';

export const getStudentDeclarations = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowObj = new Date(Date.now() + 86400000);
    const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

    const declarations = await getStudentDeclarationsService(student.id, [todayStr, tomorrowStr]);

    return successResponse(res, 200, 'Meal declarations fetched', {
      declarations,
      cutoffs: MEAL_CUTOFFS,
      today: todayStr,
      tomorrow: tomorrowStr
    });
  } catch (error) {
    next(error);
  }
};

export const updateMealDeclaration = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const { mealDate, mealType, status } = req.body;
    const updated = await upsertDeclarationService(student.id, { mealDate, mealType, status });

    return successResponse(res, 200, `Meal declaration updated to ${status}`, updated);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to update meal declaration');
  }
};
