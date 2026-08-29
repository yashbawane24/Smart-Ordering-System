import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getKitchenDemand = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const totalStudentsCount = await prisma.student.count({ where: { isActive: true } });

    const declarations = await prisma.mealDeclaration.findMany({
      where: { mealDate: targetDate }
    });

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    const participationRate = 0.60;

    const breakdown = {};

    for (const mt of mealTypes) {
      const declaredCount = declarations.filter(d => d.mealType === mt && d.status === 'DECLARED').length;
      const skippedCount = declarations.filter(d => d.mealType === mt && d.status === 'SKIPPED').length;
      const notDeclaredCount = Math.max(0, totalStudentsCount - (declaredCount + skippedCount));

      const estimatedParticipation = Math.round(notDeclaredCount * participationRate);
      const expectedDemand = declaredCount + estimatedParticipation;
      const prepMin = expectedDemand;
      const prepMax = Math.round(expectedDemand * 1.05);

      breakdown[mt] = {
        declared: declaredCount,
        skipped: skippedCount,
        notDeclared: notDeclaredCount,
        estimatedParticipation,
        expectedDemand,
        preparationRange: `${prepMin} – ${prepMax} servings`
      };
    }

    // Food item demand
    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true }
    });

    const itemDemand = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      preBooked: 100 - item.availableQuantity,
      capacity: 100,
      remaining: item.availableQuantity,
      isSoldOut: item.availableQuantity <= 0 || !item.isAvailable
    }));

    return successResponse(res, 200, 'Demand planning data retrieved', {
      date: targetDate,
      totalStudents: totalStudentsCount,
      breakdown,
      itemDemand
    });
  } catch (error) {
    next(error);
  }
};
