import prisma from '../utils/prisma.js';
import { successResponse } from '../utils/response.js';


export const getAdminReportsData = async (req, res, next) => {
  try {
    // 1. Most Ordered Food Items
    const topItemsGroup = await prisma.orderItem.groupBy({
      by: ['itemName'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 8
    });

    const mostOrderedItems = topItemsGroup.map(item => ({
      name: item.itemName,
      ordersCount: item._sum.quantity || 0,
      totalCredits: item._sum.subtotal || 0
    }));

    // 2. Order Status Distribution
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const statusDistribution = statusCounts.map(s => ({
      name: s.status,
      value: s._count.id
    }));

    // 3. Daily Orders & Credit Consumption (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, totalCredits: true, status: true }
    });

    const dailyMap = {};
    recentOrders.forEach(ord => {
      const dayLabel = new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyMap[dayLabel]) {
        dailyMap[dayLabel] = { day: dayLabel, totalOrders: 0, totalCredits: 0 };
      }
      dailyMap[dayLabel].totalOrders += 1;
      if (ord.status !== 'CANCELLED') {
        dailyMap[dayLabel].totalCredits += ord.totalCredits;
      }
    });

    const dailyOrdersData = Object.values(dailyMap);

    // 4. Peak Ordering Hours Distribution
    const allOrders = await prisma.order.findMany({
      select: { createdAt: true }
    });

    const hoursMap = {
      'Breakfast (7-10 AM)': 0,
      'Lunch (12-3 PM)': 0,
      'Snacks (4-6 PM)': 0,
      'Dinner (7-10 PM)': 0,
      'Late Night (11 PM-6 AM)': 0
    };

    allOrders.forEach(ord => {
      const hour = new Date(ord.createdAt).getHours();
      if (hour >= 7 && hour < 10) hoursMap['Breakfast (7-10 AM)'] += 1;
      else if (hour >= 12 && hour < 15) hoursMap['Lunch (12-3 PM)'] += 1;
      else if (hour >= 16 && hour < 18) hoursMap['Snacks (4-6 PM)'] += 1;
      else if (hour >= 19 && hour < 22) hoursMap['Dinner (7-10 PM)'] += 1;
      else hoursMap['Late Night (11 PM-6 AM)'] += 1;
    });

    const peakHoursData = Object.keys(hoursMap).map(key => ({
      timeSlot: key,
      ordersCount: hoursMap[key]
    }));

    return successResponse(res, 200, 'Admin reports and analytics data fetched', {
      mostOrderedItems,
      statusDistribution,
      dailyOrdersData,
      peakHoursData
    });
  } catch (error) {
    next(error);
  }
};
