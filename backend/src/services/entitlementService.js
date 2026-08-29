import prisma from '../utils/prisma.js';

export const getStudentTodayEntitlements = async (studentId) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Fetch Student & Active Meal Plan
  const studentPlan = await prisma.studentMealPlan.findFirst({
    where: {
      studentId,
      status: 'ACTIVE'
    },
    include: { mealPlan: true }
  });

  // 2. Fetch Usage for Today
  const usages = await prisma.mealEntitlementUsage.findMany({
    where: {
      studentId,
      usageDate: todayStr
    }
  });

  const usedMealTypes = usages.map((u) => u.mealType);

  // 3. Fetch Today's Orders & Declarations
  const declarations = await prisma.mealDeclaration.findMany({
    where: { studentId, mealDate: todayStr }
  });

  const decMap = {};
  declarations.forEach(d => { decMap[d.mealType] = d.status; });

  const result = {
    today: todayStr,
    planName: studentPlan?.mealPlan?.name || 'Standard Campus Meal Plan',
    entitlements: {
      Breakfast: {
        limit: studentPlan?.mealPlan?.breakfastEntitlement || 1,
        isUsed: usedMealTypes.includes('Breakfast'),
        declarationStatus: decMap['Breakfast'] || 'NOT_DECLARED',
        status: usedMealTypes.includes('Breakfast') ? 'CONSUMED' : 'AVAILABLE'
      },
      Lunch: {
        limit: studentPlan?.mealPlan?.lunchEntitlement || 1,
        isUsed: usedMealTypes.includes('Lunch'),
        declarationStatus: decMap['Lunch'] || 'NOT_DECLARED',
        status: usedMealTypes.includes('Lunch') ? 'CONSUMED' : 'AVAILABLE'
      },
      Dinner: {
        limit: studentPlan?.mealPlan?.dinnerEntitlement || 1,
        isUsed: usedMealTypes.includes('Dinner'),
        declarationStatus: decMap['Dinner'] || 'NOT_DECLARED',
        status: usedMealTypes.includes('Dinner') ? 'CONSUMED' : 'AVAILABLE'
      }
    }
  };

  return result;
};

export const checkAndConsumeEntitlement = async (tx, { studentId, mealType, orderId }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if standard entitlement for this meal type was already consumed today
  const existingUsage = await tx.mealEntitlementUsage.findFirst({
    where: {
      studentId,
      usageDate: todayStr,
      mealType,
      usageType: 'STANDARD'
    }
  });

  const isEligibleForStandard = !existingUsage;
  const usageType = isEligibleForStandard ? 'STANDARD' : 'EXTRA';

  // Record usage
  await tx.mealEntitlementUsage.create({
    data: {
      studentId,
      usageDate: todayStr,
      mealType: mealType || 'Lunch',
      orderId,
      usageType
    }
  });

  return { isEligibleForStandard, usageType };
};
