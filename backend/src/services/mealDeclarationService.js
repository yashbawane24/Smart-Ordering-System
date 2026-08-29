import prisma from '../utils/prisma.js';

// Default cutoff times for meal declarations (24h format HH:mm)
export const MEAL_CUTOFFS = {
  Breakfast: { time: '06:30', name: 'Breakfast (7:00 AM - 9:00 AM)' },
  Lunch: { time: '11:00', name: 'Lunch (12:30 PM - 2:30 PM)' },
  Dinner: { time: '18:30', name: 'Dinner (7:30 PM - 9:30 PM)' }
};

export const checkIsCutoffPassed = (mealDateStr, mealType) => {
  const cutoff = MEAL_CUTOFFS[mealType];
  if (!cutoff) return false;

  const now = new Date();
  const [cutoffHour, cutoffMinute] = cutoff.time.split(':').map(Number);
  
  // Construct deadline date object in local time
  const [year, month, day] = mealDateStr.split('-').map(Number);
  const deadline = new Date(year, month - 1, day, cutoffHour, cutoffMinute, 0, 0);

  return now > deadline;
};

export const getStudentDeclarationsService = async (studentId, dates) => {
  const declarations = await prisma.mealDeclaration.findMany({
    where: {
      studentId,
      mealDate: { in: dates }
    }
  });

  // Map declarations into dates object
  const result = {};
  for (const date of dates) {
    result[date] = {
      Breakfast: { status: 'NOT_DECLARED', cutoffPassed: checkIsCutoffPassed(date, 'Breakfast') },
      Lunch: { status: 'NOT_DECLARED', cutoffPassed: checkIsCutoffPassed(date, 'Lunch') },
      Dinner: { status: 'NOT_DECLARED', cutoffPassed: checkIsCutoffPassed(date, 'Dinner') }
    };
  }

  for (const dec of declarations) {
    if (result[dec.mealDate] && result[dec.mealDate][dec.mealType]) {
      result[dec.mealDate][dec.mealType].status = dec.status;
      result[dec.mealDate][dec.mealType].id = dec.id;
    }
  }

  return result;
};

export const upsertDeclarationService = async (studentId, { mealDate, mealType, status }) => {
  const allowedStatuses = ['DECLARED', 'SKIPPED', 'NOT_DECLARED'];
  const allowedTypes = ['Breakfast', 'Lunch', 'Dinner'];

  if (!allowedTypes.includes(mealType)) {
    throw new Error('Invalid meal type');
  }
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid declaration status');
  }

  // Enforce cutoff deadline
  if (checkIsCutoffPassed(mealDate, mealType)) {
    throw new Error(`Declaration deadline (${MEAL_CUTOFFS[mealType]?.time}) has passed for ${mealType} on ${mealDate}`);
  }

  const declaration = await prisma.mealDeclaration.upsert({
    where: {
      studentId_mealDate_mealType: {
        studentId,
        mealDate,
        mealType
      }
    },
    update: {
      status,
      updatedAt: new Date()
    },
    create: {
      studentId,
      mealDate,
      mealType,
      status
    }
  });

  return declaration;
};
