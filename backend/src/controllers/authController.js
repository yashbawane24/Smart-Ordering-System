import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';


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
