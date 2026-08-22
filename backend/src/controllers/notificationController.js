import { successResponse, errorResponse } from '../utils/response.js';
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    return successResponse(res, 200, 'Notifications retrieved', notifications);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await markNotificationRead(id, req.user.id);
    return successResponse(res, 200, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await markAllNotificationsRead(req.user.id);
    return successResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
