import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createNotification = async ({ userId, title, message, type = 'GENERAL' }) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30
  });
};

export const markNotificationRead = async (notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });
};

export const markAllNotificationsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};
