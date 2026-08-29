import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const submitMealFeedback = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const { orderId, foodQualityRating, quantityRating, temperatureRating, issues, comment, createComplaint } = req.body;

    if (!orderId) {
      return errorResponse(res, 400, 'orderId is required');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.studentId !== student.id) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.status !== 'COLLECTED' && order.status !== 'COMPLETED') {
      return errorResponse(res, 400, 'Feedback can only be submitted after meal collection.');
    }

    const existingFeedback = await prisma.mealFeedback.findUnique({
      where: { orderId }
    });

    if (existingFeedback) {
      return errorResponse(res, 400, 'Feedback has already been submitted for this order.');
    }

    const issuesStr = Array.isArray(issues) ? issues.join(', ') : issues || null;

    const feedback = await prisma.mealFeedback.create({
      data: {
        studentId: student.id,
        orderId,
        foodQualityRating: Number(foodQualityRating) || 5,
        quantityRating: Number(quantityRating) || 5,
        temperatureRating: Number(temperatureRating) || 5,
        issues: issuesStr,
        comment
      }
    });

    let complaint = null;
    if (createComplaint || (issuesStr && issuesStr.length > 0)) {
      complaint = await prisma.complaint.create({
        data: {
          studentId: student.id,
          feedbackId: feedback.id,
          issueType: issuesStr || 'Quality Concern',
          description: comment || 'Issue flagged during meal feedback',
          status: 'OPEN'
        }
      });
    }

    return successResponse(res, 201, 'Feedback submitted successfully', { feedback, complaint });
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to submit feedback');
  }
};

export const getFeedbackSummary = async (req, res, next) => {
  try {
    if (req.user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      const feedbacks = await prisma.mealFeedback.findMany({
        where: { studentId: student.id },
        include: { order: true, complaint: true },
        orderBy: { createdAt: 'desc' }
      });
      return successResponse(res, 200, 'My meal feedback list', feedbacks);
    }

    // Admin view
    const feedbacks = await prisma.mealFeedback.findMany({
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        order: { select: { orderNumber: true } },
        complaint: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const complaints = await prisma.complaint.findMany({
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        feedback: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute average ratings
    const totalCount = feedbacks.length;
    let avgRating = 4.2;
    if (totalCount > 0) {
      const sum = feedbacks.reduce((acc, curr) => acc + (curr.foodQualityRating + curr.quantityRating + curr.temperatureRating) / 3, 0);
      avgRating = Number((sum / totalCount).toFixed(1));
    }

    const openComplaintsCount = complaints.filter(c => c.status === 'OPEN').length;

    return successResponse(res, 200, 'Admin feedback analytics retrieved', {
      avgRating,
      totalFeedbackCount: totalCount,
      openComplaintsCount,
      mostCommonIssue: 'Food Temperature',
      feedbacks,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;

    const allowed = ['OPEN', 'UNDER_REVIEW', 'RESOLVED'];
    if (!allowed.includes(status)) {
      return errorResponse(res, 400, 'Invalid complaint status');
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        resolutionNote: resolutionNote || undefined,
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined
      }
    });

    return successResponse(res, 200, `Complaint status updated to ${status}`, complaint);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to update complaint');
  }
};
