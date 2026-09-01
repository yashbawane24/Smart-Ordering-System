import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createOrderTransaction, cancelOrderTransaction, updateOrderStatusChef } from '../services/orderService.js';


export const placeOrder = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const { items, slotBookingId, mealType, fulfillmentType, deliveryRoomNumber, deliveryHostel } = req.body;
    const order = await createOrderTransaction({
      studentId: student.id,
      items,
      slotBookingId,
      mealType,
      fulfillmentType,
      deliveryRoomNumber,
      deliveryHostel
    });

    return successResponse(res, 201, 'Order placed successfully', order);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to place order');
  }
};

export const getStudentOrders = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const { status, search } = req.query;
    const where = { studentId: student.id };

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.orderNumber = { contains: search };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, 200, 'Orders retrieved', orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        student: {
          include: {
            user: { select: { name: true, email: true, phone: true } }
          }
        },
        creditTransactions: true
      }
    });

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    return successResponse(res, 200, 'Order details fetched', order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return errorResponse(res, 404, 'Student account not found');
    }

    const cancelledOrder = await cancelOrderTransaction({ orderId: id, studentId: student.id });
    return successResponse(res, 200, 'Order cancelled successfully and credits refunded', cancelledOrder);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to cancel order');
  }
};

export const getChefOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: true,
        student: {
          include: {
            user: { select: { name: true, email: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, 200, 'Chef orders list retrieved', orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusByChef = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, 400, 'New order status is required');
    }

    const updatedOrder = await updateOrderStatusChef(id, status);
    return successResponse(res, 200, `Order status updated to ${status}`, updatedOrder);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to update order status');
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { student: { studentIdStr: { contains: search } } },
        { student: { user: { name: { contains: search } } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: true,
        student: {
          include: { user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return successResponse(res, 200, 'All orders retrieved for admin', orders);
  } catch (error) {
    next(error);
  }
};
