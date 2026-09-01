import { successResponse, errorResponse } from '../utils/response.js';
import {
  createSickDeliveryRequest,
  getStudentSickDeliveryRequests,
  getWardenSickDeliveryRequests,
  approveSickDeliveryRequest,
  rejectSickDeliveryRequest,
  checkSickDeliveryAccess
} from '../services/sickDeliveryService.js';

export const submitRequest = async (req, res, next) => {
  try {
    const { roomNumber, hostel, reason, requestedStartDate, requestedEndDate, requestedMeals } = req.body;
    
    if (!reason || !requestedStartDate || !requestedEndDate) {
      return errorResponse(res, 400, 'Reason, requested start date, and end date are required');
    }

    const request = await createSickDeliveryRequest({
      studentUserId: req.user.id,
      roomNumber,
      hostel,
      reason,
      requestedStartDate,
      requestedEndDate,
      requestedMeals
    });

    return successResponse(res, 201, 'Sick delivery request submitted successfully', request);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to submit sick delivery request');
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await getStudentSickDeliveryRequests(req.user.id);
    return successResponse(res, 200, 'Student sick delivery requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

export const getWardenRequests = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const requests = await getWardenSickDeliveryRequests({ status, search });
    return successResponse(res, 200, 'Warden sick delivery requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStartDate, approvalEndDate, allowedMeals, maxDeliveriesPerDay } = req.body;

    const result = await approveSickDeliveryRequest({
      requestId: id,
      wardenUserId: req.user.id,
      approvalStartDate,
      approvalEndDate,
      allowedMeals,
      maxDeliveriesPerDay
    });

    return successResponse(res, 200, 'Sick meal delivery request approved successfully', result);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to approve request');
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const result = await rejectSickDeliveryRequest({
      requestId: id,
      wardenUserId: req.user.id,
      rejectionReason
    });

    return successResponse(res, 200, 'Sick meal delivery request rejected', result);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to reject request');
  }
};

export const checkMyAccess = async (req, res, next) => {
  try {
    const { mealType, date } = req.query;
    
    // Fetch student ID from user
    const student = await req.student || await import('../utils/prisma.js').then(p => p.default.student.findUnique({ where: { userId: req.user.id } }));
    
    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const accessInfo = await checkSickDeliveryAccess({
      studentId: student.id,
      mealType,
      targetDate: date || new Date()
    });

    return successResponse(res, 200, 'Sick delivery access status retrieved', accessInfo);
  } catch (error) {
    next(error);
  }
};
