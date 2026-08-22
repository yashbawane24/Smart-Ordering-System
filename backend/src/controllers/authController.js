import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'STUDENT', studentIdStr, hostel, roomNumber } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Name, email, and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = ['STUDENT', 'CHEF', 'ADMIN'].includes(role) ? role : 'STUDENT';

    // Create user record inside transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          phone: phone || null,
          role: userRole
        }
      });

      if (userRole === 'STUDENT') {
        const studentRegId = studentIdStr || `REG-${Math.floor(10000 + Math.random() * 90000)}`;
        const studentRecord = await tx.student.create({
          data: {
            userId: createdUser.id,
            studentIdStr: studentRegId,
            hostel: hostel || 'Block A, Mens Hostel',
            roomNumber: roomNumber || 'A-101',
            isActive: true
          }
        });

        // Auto-provision initial 9,000 monthly credits wallet for student
        const creditAcc = await tx.creditAccount.create({
          data: {
            studentId: studentRecord.id,
            monthlyCredit: 9000,
            usedCredit: 0,
            remainingCredit: 9000,
            monthYear: new Date().toISOString().slice(0, 7)
          }
        });

        // Log initial credit allocation transaction
        await tx.creditTransaction.create({
          data: {
            creditAccountId: creditAcc.id,
            type: 'MONTHLY_ALLOCATION',
            amount: 9000,
            balanceAfter: 9000,
            description: 'Initial Registration 9,000 Monthly Credit Allowance'
          }
        });
      } else if (userRole === 'CHEF') {
        await tx.chef.create({
          data: {
            userId: createdUser.id,
            kitchenSection: 'Main Kitchen Counter',
            isActive: true
          }
        });
      } else if (userRole === 'ADMIN') {
        await tx.admin.create({
          data: {
            userId: createdUser.id,
            permissions: 'FULL'
          }
        });
      }

      return tx.user.findUnique({
        where: { id: createdUser.id },
        include: {
          student: { include: { creditAccount: true } },
          chef: true,
          admin: true
        }
      });
    });

    const token = generateToken(newUser);
    const { password: _, ...userData } = newUser;

    return successResponse(res, 201, 'Account created successfully', {
      token,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        student: { include: { creditAccount: true } },
        chef: true,
        admin: true
      }
    });

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check account status if student or chef
    if (user.student && !user.student.isActive) {
      return errorResponse(res, 403, 'Student account has been deactivated. Please contact Mess Admin.');
    }
    if (user.chef && !user.chef.isActive) {
      return errorResponse(res, 403, 'Chef account has been deactivated. Please contact Mess Admin.');
    }

    const token = generateToken(user);

    // Omit password from response
    const { password: _, ...userData } = user;

    return successResponse(res, 200, 'Login successful', {
      token,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: { include: { creditAccount: true } },
        chef: true,
        admin: true
      }
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const { password: _, ...userData } = user;
    return successResponse(res, 200, 'User profile fetched', userData);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return successResponse(res, 200, 'Logout successful');
};

