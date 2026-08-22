import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';
import { getStudentCreditAccount } from '../services/creditService.js';

const prisma = new PrismaClient();

export const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const creditAccount = await getStudentCreditAccount(student.id);

    // Get order counts for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const ordersThisMonth = await prisma.order.count({
      where: {
        studentId: student.id,
        createdAt: { gte: startOfMonth }
      }
    });

    const completedOrders = await prisma.order.count({
      where: {
        studentId: student.id,
        status: 'COMPLETED'
      }
    });

    const pendingOrders = await prisma.order.count({
      where: {
        studentId: student.id,
        status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] }
      }
    });

    // Active order if any
    const activeOrder = await prisma.order.findFirst({
      where: {
        studentId: student.id,
        status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] }
      },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' }
    });

    // Menu Preview (Today's top items)
    const todayMenuPreview = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      take: 6,
      orderBy: { createdAt: 'asc' }
    });

    return successResponse(res, 200, 'Student dashboard metrics fetched', {
      student: {
        id: student.id,
        studentIdStr: student.studentIdStr,
        name: student.user.name,
        email: student.user.email,
        hostel: student.hostel,
        roomNumber: student.roomNumber
      },
      credits: {
        remaining: creditAccount.remainingCredit,
        used: creditAccount.usedCredit,
        monthly: creditAccount.monthlyCredit
      },
      stats: {
        ordersThisMonth,
        completedOrders,
        pendingOrders
      },
      activeOrder,
      todayMenuPreview
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (req, res, next) => {
  try {
    const { name, phone, hostel, roomNumber } = req.body;

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    if (name || phone) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone })
        }
      });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: {
        ...(hostel && { hostel }),
        ...(roomNumber && { roomNumber })
      },
      include: { user: true, creditAccount: true }
    });

    return successResponse(res, 200, 'Profile updated successfully', updatedStudent);
  } catch (error) {
    next(error);
  }
};
