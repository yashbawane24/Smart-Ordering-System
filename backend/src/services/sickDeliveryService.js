import prisma from '../utils/prisma.js';
import { createNotification } from './notificationService.js';

/**
 * Student submits a new sick meal delivery request
 */
export const createSickDeliveryRequest = async ({
  studentUserId,
  roomNumber,
  hostel,
  reason,
  requestedStartDate,
  requestedEndDate,
  requestedMeals
}) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId },
    include: { user: true }
  });

  if (!student) {
    throw new Error('Student profile not found');
  }

  // Ensure requested dates are valid
  const startDate = new Date(requestedStartDate);
  const endDate = new Date(requestedEndDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid start or end date for sick delivery request');
  }

  if (endDate < startDate) {
    throw new Error('Requested end date cannot be earlier than start date');
  }

  // Format requested meals if array
  const mealsStr = Array.isArray(requestedMeals)
    ? requestedMeals.join(',')
    : (requestedMeals || 'Breakfast,Lunch,Dinner');

  const request = await prisma.sickDeliveryRequest.create({
    data: {
      studentId: student.id,
      roomNumber: roomNumber || student.roomNumber || 'N/A',
      hostel: hostel || student.hostel || 'Main Campus Hostel',
      reason,
      requestedStartDate: startDate,
      requestedEndDate: endDate,
      requestedMeals: mealsStr,
      status: 'PENDING_WARDEN_APPROVAL'
    },
    include: {
      student: {
        include: { user: { select: { name: true, email: true, phone: true } } }
      }
    }
  });

  // Notify student
  await createNotification({
    userId: studentUserId,
    title: 'Sick Delivery Request Submitted',
    message: `Your request #${request.id.slice(0, 8)} for ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} is pending warden approval.`,
    type: 'GENERAL'
  }).catch(err => console.error('Notification error:', err));

  return request;
};

/**
 * Get sick delivery requests for the logged-in student
 */
export const getStudentSickDeliveryRequests = async (studentUserId) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId }
  });

  if (!student) {
    throw new Error('Student profile not found');
  }

  return await prisma.sickDeliveryRequest.findMany({
    where: { studentId: student.id },
    include: {
      approval: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Warden / Admin view: fetch requests with status filters
 */
export const getWardenSickDeliveryRequests = async ({ status, search } = {}) => {
  const where = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { student: { studentIdStr: { contains: search } } },
      { student: { user: { name: { contains: search } } } },
      { roomNumber: { contains: search } }
    ];
  }

  return await prisma.sickDeliveryRequest.findMany({
    where,
    include: {
      student: {
        include: {
          user: { select: { name: true, email: true, phone: true } }
        }
      },
      approval: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Warden approves a sick delivery request
 */
export const approveSickDeliveryRequest = async ({
  requestId,
  wardenUserId,
  approvalStartDate,
  approvalEndDate,
  allowedMeals,
  maxDeliveriesPerDay = 3
}) => {
  const request = await prisma.sickDeliveryRequest.findUnique({
    where: { id: requestId },
    include: { student: { include: { user: true } } }
  });

  if (!request) {
    throw new Error('Sick delivery request not found');
  }

  const startDate = approvalStartDate ? new Date(approvalStartDate) : new Date(request.requestedStartDate);
  const endDate = approvalEndDate ? new Date(approvalEndDate) : new Date(request.requestedEndDate);

  const mealsStr = Array.isArray(allowedMeals)
    ? allowedMeals.join(',')
    : (allowedMeals || request.requestedMeals);

  // Update request status & create approval record in transaction
  const updated = await prisma.$transaction(async (tx) => {
    const updatedReq = await tx.sickDeliveryRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: wardenUserId
      }
    });

    const approval = await tx.deliveryAccessApproval.upsert({
      where: { requestId },
      update: {
        approvalStartDate: startDate,
        approvalEndDate: endDate,
        allowedMeals: mealsStr,
        maxDeliveriesPerDay: Number(maxDeliveriesPerDay),
        status: 'ACTIVE',
        expiresAt: endDate,
        approvedBy: wardenUserId
      },
      create: {
        requestId,
        studentId: request.studentId,
        approvedBy: wardenUserId,
        approvalStartDate: startDate,
        approvalEndDate: endDate,
        allowedMeals: mealsStr,
        maxDeliveriesPerDay: Number(maxDeliveriesPerDay),
        status: 'ACTIVE',
        expiresAt: endDate
      }
    });

    return { request: updatedReq, approval };
  });

  // Notify student
  if (request.student?.userId) {
    await createNotification({
      userId: request.student.userId,
      title: 'Sick Meal Delivery Approved! 🔓',
      message: `Your sick meal delivery access has been UNLOCKED valid from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for [${mealsStr}].`,
      type: 'GENERAL'
    }).catch(err => console.error('Notification error:', err));
  }

  return updated;
};

/**
 * Warden rejects a sick delivery request
 */
export const rejectSickDeliveryRequest = async ({ requestId, wardenUserId, rejectionReason }) => {
  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is required');
  }

  const request = await prisma.sickDeliveryRequest.findUnique({
    where: { id: requestId },
    include: { student: { include: { user: true } } }
  });

  if (!request) {
    throw new Error('Sick delivery request not found');
  }

  const updatedReq = await prisma.sickDeliveryRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      rejectionReason: rejectionReason.trim(),
      reviewedAt: new Date(),
      reviewedBy: wardenUserId
    }
  });

  // Notify student
  if (request.student?.userId) {
    await createNotification({
      userId: request.student.userId,
      title: 'Sick Meal Delivery Request Update',
      message: `Your sick meal delivery request was not approved. Reason: ${rejectionReason}`,
      type: 'GENERAL'
    }).catch(err => console.error('Notification error:', err));
  }

  return updatedReq;
};

/**
 * Check if a student currently has unlocked sick delivery access
 * Can be queried by student or validated on order placement.
 */
export const checkSickDeliveryAccess = async ({ studentId, mealType, targetDate = new Date() }) => {
  const now = new Date(targetDate);
  const nowTime = now.getTime();

  // Find active approvals for student
  const approvals = await prisma.deliveryAccessApproval.findMany({
    where: {
      studentId,
      status: 'ACTIVE'
    },
    include: { request: true },
    orderBy: { createdAt: 'desc' }
  });

  if (!approvals || approvals.length === 0) {
    return {
      isUnlocked: false,
      status: 'LOCKED',
      reason: 'No warden approval found for sick meal delivery.'
    };
  }

  // Find approval matching date range & meal type
  const matchingApproval = approvals.find((app) => {
    const startDateMidnight = new Date(app.approvalStartDate);
    startDateMidnight.setHours(0, 0, 0, 0);
    
    const endDateEndDay = new Date(app.approvalEndDate);
    endDateEndDay.setHours(23, 59, 59, 999);

    const isDateWithin = nowTime >= startDateMidnight.getTime() && nowTime <= endDateEndDay.getTime();

    if (!isDateWithin) return false;

    if (mealType) {
      const allowedList = app.allowedMeals.split(',').map(m => m.trim().toLowerCase());
      const isMealAllowed = allowedList.includes(mealType.trim().toLowerCase()) || allowedList.includes('all');
      return isMealAllowed;
    }

    return true;
  });

  if (!matchingApproval) {
    return {
      isUnlocked: false,
      status: 'LOCKED',
      reason: 'Warden approval is not valid for the selected date or meal type.'
    };
  }

  // Check today's delivery usage count vs limit
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const deliveriesTodayCount = await prisma.order.count({
    where: {
      studentId,
      fulfillmentType: 'SICK_DELIVERY',
      createdAt: {
        gte: todayStart,
        lte: todayEnd
      },
      status: { notIn: ['CANCELLED'] }
    }
  });

  if (deliveriesTodayCount >= matchingApproval.maxDeliveriesPerDay) {
    return {
      isUnlocked: false,
      status: 'LIMIT_EXCEEDED',
      reason: `Maximum daily sick meal delivery limit (${matchingApproval.maxDeliveriesPerDay}) reached for today.`
    };
  }

  return {
    isUnlocked: true,
    status: 'UNLOCKED',
    approval: {
      id: matchingApproval.id,
      approvalStartDate: matchingApproval.approvalStartDate,
      approvalEndDate: matchingApproval.approvalEndDate,
      allowedMeals: matchingApproval.allowedMeals,
      maxDeliveriesPerDay: matchingApproval.maxDeliveriesPerDay,
      deliveriesUsedToday: deliveriesTodayCount,
      roomNumber: matchingApproval.request?.roomNumber || 'N/A',
      hostel: matchingApproval.request?.hostel || 'Main Campus Hostel'
    }
  };
};
