import prisma from '../utils/prisma.js';
import { createNotification } from './notificationService.js';

export const getOrCreateCollectionToken = async (orderId, studentId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { collectionToken: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.studentId !== studentId) {
    throw new Error('Unauthorized access to order QR collection token');
  }

  if (order.status !== 'READY' && order.status !== 'COLLECTED') {
    throw new Error(`Order QR collection is only available when status is READY. Current status: ${order.status}`);
  }

  if (order.collectionToken) {
    return order.collectionToken;
  }

  // Create new 2-hour collection token
  const token = `QR-${Math.floor(100000 + Math.random() * 900000)}`;
  const expiresAt = new Date(Date.now() + 2 * 3600 * 1000);

  const collectionToken = await prisma.collectionToken.create({
    data: {
      orderId,
      token,
      expiresAt,
      status: 'ACTIVE'
    }
  });

  return collectionToken;
};

export const verifyCollectionTokenTransaction = async ({ tokenInput }) => {
  if (!tokenInput || typeof tokenInput !== 'string') {
    throw new Error('Valid QR collection token or Order ID is required');
  }

  const cleanToken = tokenInput.trim();

  // Find token by token string or by orderNumber
  let tokenRecord = await prisma.collectionToken.findFirst({
    where: {
      OR: [
        { token: cleanToken },
        { order: { orderNumber: cleanToken } }
      ]
    },
    include: {
      order: {
        include: {
          student: { include: { user: true } },
          orderItems: true
        }
      }
    }
  });

  if (!tokenRecord) {
    throw new Error('Invalid or non-existent QR collection token');
  }

  const order = tokenRecord.order;
  if (!order) {
    throw new Error('Associated order record not found');
  }

  if (tokenRecord.status === 'USED' || order.status === 'COLLECTED') {
    throw new Error(`Order #${order.orderNumber} has ALREADY been collected.`);
  }

  if (order.status !== 'READY') {
    throw new Error(`Order #${order.orderNumber} is not in READY status. Current status: ${order.status}`);
  }

  if (new Date() > new Date(tokenRecord.expiresAt)) {
    await prisma.collectionToken.update({
      where: { id: tokenRecord.id },
      data: { status: 'EXPIRED' }
    });
    throw new Error('Collection token has EXPIRED. Please ask student to re-generate.');
  }

  const now = new Date();

  // Atomically update order to COLLECTED and token to USED
  const [updatedOrder, updatedToken] = await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: 'COLLECTED' }
    }),
    prisma.collectionToken.update({
      where: { id: tokenRecord.id },
      data: { status: 'USED', usedAt: now }
    })
  ]);

  // Send push notification to student
  createNotification({
    userId: order.student.userId,
    title: 'Meal Collected Successfully',
    message: `Order #${order.orderNumber} collected at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Enjoy your meal!`,
    type: 'ORDER_UPDATE'
  }).catch((err) => console.error('Notification error:', err));

  return {
    studentName: order.student.user.name,
    studentIdStr: order.student.studentIdStr,
    orderNumber: order.orderNumber,
    collectedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: order.orderItems
  };
};

export const checkAndUpdateNoShows = async () => {
  const expiredReadyOrders = await prisma.order.findMany({
    where: {
      status: 'READY',
      collectionToken: {
        expiresAt: { lt: new Date() }
      }
    }
  });

  const updatedIds = [];
  for (const order of expiredReadyOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'NO_SHOW' }
    });
    updatedIds.push(order.id);
  }

  return updatedIds.length;
};
