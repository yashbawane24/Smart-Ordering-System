import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';
import { getStudentCreditAccount, adjustStudentCreditAdmin, resetMonthlyCredits } from '../services/creditService.js';

const prisma = new PrismaClient();

export const getStudentCreditWallet = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const creditAccount = await getStudentCreditAccount(student.id);
    return successResponse(res, 200, 'Credit wallet retrieved', creditAccount);
  } catch (error) {
    next(error);
  }
};

export const getStudentTransactions = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const creditAccount = await getStudentCreditAccount(student.id);
    const transactions = await prisma.creditTransaction.findMany({
      where: { creditAccountId: creditAccount.id },
      orderBy: { createdAt: 'desc' },
      include: {
        order: { select: { orderNumber: true, status: true } }
      }
    });

    return successResponse(res, 200, 'Credit transactions fetched', transactions);
  } catch (error) {
    next(error);
  }
};

export const adminAdjustCredit = async (req, res, next) => {
  try {
    const { studentId, amount, description } = req.body;
    if (!studentId || amount === undefined) {
      return errorResponse(res, 400, 'studentId and amount are required');
    }

    const result = await adjustStudentCreditAdmin({
      studentId,
      amount: parseFloat(amount),
      description
    });

    return successResponse(res, 200, 'Student credits adjusted successfully', result);
  } catch (error) {
    next(error);
  }
};

export const adminResetMonthlyCredits = async (req, res, next) => {
  try {
    const { monthYear } = req.body;
    const result = await resetMonthlyCredits(monthYear);
    return successResponse(res, 200, `Monthly credits reset for ${result.length} students`, result);
  } catch (error) {
    next(error);
  }
};

export const getAllStudentCreditsAdmin = async (req, res, next) => {
  try {
    const studentsWithCredits = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true } },
        creditAccount: {
          include: {
            transactions: { take: 5, orderBy: { createdAt: 'desc' } }
          }
        }
      }
    });

    return successResponse(res, 200, 'Student credits list fetched', studentsWithCredits);
  } catch (error) {
    next(error);
  }
};
