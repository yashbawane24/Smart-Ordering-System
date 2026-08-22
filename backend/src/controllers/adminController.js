import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalChefs = await prisma.chef.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await prisma.order.count({
      where: { createdAt: { gte: today } }
    });

    const pendingOrders = await prisma.order.count({
      where: { status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] } }
    });

    const availableMenuItems = await prisma.menuItem.count({
      where: { isAvailable: true, availableQuantity: { gt: 0 } }
    });

    // Total credits processed/spent overall
    const aggregateRevenue = await prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { totalCredits: true }
    });

    return successResponse(res, 200, 'Admin dashboard statistics retrieved', {
      totalStudents,
      totalChefs,
      ordersToday,
      pendingOrders,
      availableMenuItems,
      revenueInCredits: aggregateRevenue._sum.totalCredits || 0
    });
  } catch (error) {
    next(error);
  }
};

// --- Student CRUD ---
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, hostel, page = 1, limit = 50 } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { studentIdStr: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } }
      ];
    }
    if (hostel) {
      where.hostel = hostel;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        creditAccount: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    const total = await prisma.student.count({ where });

    return successResponse(res, 200, 'Students list retrieved', {
      students,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, studentIdStr, hostel, roomNumber } = req.body;

    if (!name || !email || !password || !studentIdStr) {
      return errorResponse(res, 400, 'Name, email, password, and student ID are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return errorResponse(res, 400, 'Email address is already registered');
    }

    const existingStudentId = await prisma.student.findUnique({ where: { studentIdStr } });
    if (existingStudentId) {
      return errorResponse(res, 400, 'Student ID string is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const newStudentUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        role: 'STUDENT',
        student: {
          create: {
            studentIdStr,
            hostel: hostel || 'Block A, Mens Hostel',
            roomNumber: roomNumber || '101',
            creditAccount: {
              create: {
                monthlyCredit: 9000.0,
                usedCredit: 0.0,
                remainingCredit: 9000.0,
                monthYear: currentMonth
              }
            }
          }
        }
      },
      include: {
        student: { include: { creditAccount: true } }
      }
    });

    return successResponse(res, 201, 'Student created successfully', newStudentUser.student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, hostel, roomNumber, isActive } = req.body;

    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    if (name || phone) {
      await prisma.user.update({
        where: { id: student.userId },
        data: {
          ...(name && { name }),
          ...(phone !== undefined && { phone })
        }
      });
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        ...(hostel && { hostel }),
        ...(roomNumber && { roomNumber }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      },
      include: { user: true, creditAccount: true }
    });

    return successResponse(res, 200, 'Student profile updated successfully', updatedStudent);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    await prisma.user.delete({ where: { id: student.userId } });
    return successResponse(res, 200, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

// --- Chef CRUD ---
export const getAllChefs = async (req, res, next) => {
  try {
    const chefs = await prisma.chef.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, 200, 'Chefs list retrieved', chefs);
  } catch (error) {
    next(error);
  }
};

export const createChef = async (req, res, next) => {
  try {
    const { name, email, password, phone, chefIdStr } = req.body;

    if (!name || !email || !password || !chefIdStr) {
      return errorResponse(res, 400, 'Name, email, password, and Chef ID are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return errorResponse(res, 400, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newChefUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        role: 'CHEF',
        chef: {
          create: {
            chefIdStr
          }
        }
      },
      include: { chef: true }
    });

    return successResponse(res, 201, 'Chef account created successfully', newChefUser.chef);
  } catch (error) {
    next(error);
  }
};

export const updateChefStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedChef = await prisma.chef.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      include: { user: true }
    });

    return successResponse(res, 200, `Chef status updated to ${isActive ? 'Active' : 'Inactive'}`, updatedChef);
  } catch (error) {
    next(error);
  }
};
