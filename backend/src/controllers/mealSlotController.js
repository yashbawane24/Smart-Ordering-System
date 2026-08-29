import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getOrCreateSlotsForDateAndMeal, bookSlotTransaction } from '../services/mealSlotService.js';

export const getMealSlots = async (req, res, next) => {
  try {
    const { date, mealType } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetMeal = mealType || 'Lunch';

    const slots = await getOrCreateSlotsForDateAndMeal(targetDate, targetMeal);

    let myBooking = null;
    if (req.user && req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (student) {
        myBooking = await prisma.slotBooking.findFirst({
          where: {
            studentId: student.id,
            mealDate: targetDate,
            status: 'BOOKED',
            slot: { mealType: targetMeal }
          },
          include: { slot: true }
        });
      }
    }

    return successResponse(res, 200, 'Meal slots fetched successfully', {
      slots,
      myBooking,
      date: targetDate,
      mealType: targetMeal
    });
  } catch (error) {
    next(error);
  }
};

export const bookMealSlot = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const { slotId } = req.body;
    if (!slotId) {
      return errorResponse(res, 400, 'slotId is required');
    }

    const booking = await bookSlotTransaction(student.id, { slotId });
    return successResponse(res, 200, 'Meal slot booked successfully', booking);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to book slot');
  }
};

export const cancelSlotBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const booking = await prisma.slotBooking.findUnique({
      where: { id },
      include: { slot: true }
    });

    if (!booking || booking.studentId !== student.id) {
      return errorResponse(res, 404, 'Booking record not found');
    }

    await prisma.$transaction([
      prisma.slotBooking.update({
        where: { id },
        data: { status: 'CANCELLED' }
      }),
      prisma.mealSlot.update({
        where: { id: booking.slotId },
        data: {
          bookedCount: Math.max(0, booking.slot.bookedCount - 1),
          status: 'ACTIVE'
        }
      })
    ]);

    return successResponse(res, 200, 'Slot booking cancelled');
  } catch (error) {
    next(error);
  }
};
