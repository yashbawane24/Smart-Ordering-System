import prisma from '../utils/prisma.js';

export const getOrCreateSlotsForDateAndMeal = async (slotDateStr, mealType) => {
  let slots = await prisma.mealSlot.findMany({
    where: { slotDate: slotDateStr, mealType },
    orderBy: { startTime: 'asc' },
    include: {
      _count: { select: { bookings: true } }
    }
  });

  // Default standard slot schedules if none created yet
  if (slots.length === 0) {
    const schedules = {
      Breakfast: [
        { start: '07:00', end: '07:30' },
        { start: '07:30', end: '08:00' },
        { start: '08:00', end: '08:30' },
        { start: '08:30', end: '09:00' }
      ],
      Lunch: [
        { start: '12:30', end: '12:45' },
        { start: '12:45', end: '1:00' },
        { start: '1:00', end: '1:15' },
        { start: '1:15', end: '1:30' }
      ],
      Dinner: [
        { start: '19:30', end: '19:45' },
        { start: '19:45', end: '20:00' },
        { start: '20:00', end: '20:15' },
        { start: '20:15', end: '20:30' }
      ]
    };

    const defaultSlots = schedules[mealType] || schedules.Lunch;

    for (const item of defaultSlots) {
      await prisma.mealSlot.create({
        data: {
          mealType,
          slotDate: slotDateStr,
          startTime: item.start,
          endTime: item.end,
          capacity: 50,
          bookedCount: 0,
          status: 'ACTIVE'
        }
      });
    }

    slots = await prisma.mealSlot.findMany({
      where: { slotDate: slotDateStr, mealType },
      orderBy: { startTime: 'asc' }
    });
  }

  return slots;
};

export const bookSlotTransaction = async (studentId, { slotId, mealDate, mealType }) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch Target Slot
    const slot = await tx.mealSlot.findUnique({
      where: { id: slotId }
    });

    if (!slot || slot.status === 'CLOSED') {
      throw new Error('Selected meal slot is unavailable or closed');
    }

    if (slot.bookedCount >= slot.capacity) {
      throw new Error('This time slot is FULL. Please choose another available slot.');
    }

    // 2. Check if student already booked a slot for this meal on this date
    const existingBookings = await tx.slotBooking.findMany({
      where: {
        studentId,
        mealDate: slot.slotDate,
        status: 'BOOKED',
        slot: { mealType: slot.mealType }
      },
      include: { slot: true }
    });

    // Cancel old booking if changing slots
    for (const oldBooking of existingBookings) {
      await tx.slotBooking.update({
        where: { id: oldBooking.id },
        data: { status: 'CANCELLED' }
      });

      await tx.mealSlot.update({
        where: { id: oldBooking.slotId },
        data: {
          bookedCount: Math.max(0, oldBooking.slot.bookedCount - 1),
          status: 'ACTIVE'
        }
      });
    }

    // 3. Create New Slot Booking
    const newBooking = await tx.slotBooking.create({
      data: {
        studentId,
        slotId: slot.id,
        mealDate: slot.slotDate,
        status: 'BOOKED'
      },
      include: { slot: true }
    });

    // 4. Increment Booked Count on Slot
    const newCount = slot.bookedCount + 1;
    const isFull = newCount >= slot.capacity;

    await tx.mealSlot.update({
      where: { id: slot.id },
      data: {
        bookedCount: newCount,
        status: isFull ? 'FULL' : 'ACTIVE'
      }
    });

    return newBooking;
  });
};
