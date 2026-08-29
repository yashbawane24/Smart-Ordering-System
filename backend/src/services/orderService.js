import prisma from '../utils/prisma.js';
import { createNotification } from './notificationService.js';
import { checkAndConsumeEntitlement } from './entitlementService.js';
import { getOrCreateCollectionToken } from './collectionService.js';

export const createOrderTransaction = async ({ studentId, items, slotBookingId, mealType }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order cart cannot be empty');
  }

  let studentUserId = null;
  let totalOrderCredits = 0;

  const order = await prisma.$transaction(async (tx) => {
    // 1. Fetch Student & Credit Account
    const student = await tx.student.findUnique({
      where: { id: studentId },
      include: { creditAccount: true, user: true }
    });

    if (!student || !student.isActive) {
      throw new Error('Student account is invalid or inactive');
    }

    studentUserId = student.userId;

    const creditAccount = student.creditAccount;
    if (!creditAccount) {
      throw new Error('Credit account not found for student');
    }

    // 2. Validate Menu Items Stock & Calculate Total
    totalOrderCredits = 0;
    const validatedItems = [];

    for (const cartItem of items) {
      const targetId = cartItem.menuItemId || cartItem.id;
      const menuItem = await tx.menuItem.findUnique({
        where: { id: targetId }
      });

      if (!menuItem) {
        throw new Error(`Item "${cartItem.name || 'Unknown'}" does not exist`);
      }

      if (!menuItem.isAvailable || menuItem.availableQuantity < cartItem.quantity) {
        throw new Error(`Item "${menuItem.name}" is currently sold out or insufficient quantity available`);
      }

      const itemSubtotal = menuItem.price * cartItem.quantity;
      totalOrderCredits += itemSubtotal;

      validatedItems.push({
        menuItem,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal
      });
    }

    // 3. Entitlement Validation Engine
    const targetMealType = mealType || (validatedItems[0]?.menuItem?.category) || 'Lunch';

    const todayStr = new Date().toISOString().split('T')[0];
    const existingStandard = await tx.mealEntitlementUsage.findFirst({
      where: {
        studentId: student.id,
        usageDate: todayStr,
        mealType: targetMealType,
        usageType: 'STANDARD'
      }
    });

    const isEntitlementUsed = !existingStandard; // True if standard meal entitlement covers this

    // If standard entitlement is used for standard meal, zero out the required credits deduction
    const finalChargedCredits = isEntitlementUsed ? 0 : totalOrderCredits;

    // 4. Check Remaining Credits if charged
    if (finalChargedCredits > 0 && creditAccount.remainingCredit < finalChargedCredits) {
      throw new Error(`Insufficient credits. Required: ${finalChargedCredits} credits, Available: ${creditAccount.remainingCredit} credits.`);
    }

    // 5. Generate Unique Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // 6. Create Order & OrderItems
    const orderRecord = await tx.order.create({
      data: {
        orderNumber,
        studentId: student.id,
        totalCredits: totalOrderCredits,
        status: 'PENDING',
        slotBookingId: slotBookingId || null,
        isEntitlementUsed,
        orderItems: {
          create: validatedItems.map((v) => ({
            menuItemId: v.menuItem.id,
            itemName: v.menuItem.name,
            itemPrice: v.menuItem.price,
            quantity: v.quantity,
            subtotal: v.subtotal
          }))
        }
      },
      include: { orderItems: true }
    });

    // 7. Record Entitlement Usage Audit
    await tx.mealEntitlementUsage.create({
      data: {
        studentId: student.id,
        usageDate: todayStr,
        mealType: targetMealType,
        orderId: orderRecord.id,
        usageType: isEntitlementUsed ? 'STANDARD' : 'EXTRA'
      }
    });

    // 8. Update Menu Stock Quantities
    for (const v of validatedItems) {
      const newQty = v.menuItem.availableQuantity - v.quantity;
      await tx.menuItem.update({
        where: { id: v.menuItem.id },
        data: {
          availableQuantity: newQty,
          isAvailable: newQty > 0
        }
      });
    }

    // 9. Deduct Credits if applicable
    if (finalChargedCredits > 0) {
      const newUsedCredit = creditAccount.usedCredit + finalChargedCredits;
      const newRemainingCredit = creditAccount.remainingCredit - finalChargedCredits;

      await tx.creditAccount.update({
        where: { id: creditAccount.id },
        data: {
          usedCredit: newUsedCredit,
          remainingCredit: newRemainingCredit
        }
      });

      await tx.creditTransaction.create({
        data: {
          creditAccountId: creditAccount.id,
          type: 'ORDER_PAYMENT',
          amount: -finalChargedCredits,
          balanceAfter: newRemainingCredit,
          description: `Payment for Extra Meal Order #${orderRecord.orderNumber}`,
          orderId: orderRecord.id
        }
      });
    }

    return orderRecord;
  }, { timeout: 15000 });

  // 10. Send Notification
  if (studentUserId && order) {
    createNotification({
      userId: studentUserId,
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} has been received by the mess kitchen.`,
      type: 'ORDER_UPDATE'
    }).catch(err => console.error('Notification error:', err));
  }

  return order;
};

export const cancelOrderTransaction = async ({ orderId, studentId }) => {
  let studentUserId = null;
  let orderNumberStr = '';
  let refundedCredits = 0;

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        student: { include: { creditAccount: true, user: true } }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.studentId !== studentId) {
      throw new Error('Unauthorized to cancel this order');
    }

    if (order.status !== 'PENDING') {
      throw new Error(`Order cannot be cancelled. Current status is ${order.status}. Only PENDING orders can be cancelled.`);
    }

    studentUserId = order.student.userId;
    orderNumberStr = order.orderNumber;
    refundedCredits = order.isEntitlementUsed ? 0 : order.totalCredits;

    // 1. Update Order Status
    const result = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    // 2. Restore Menu Quantities
    for (const item of order.orderItems) {
      const menuItem = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (menuItem) {
        const restoredQty = menuItem.availableQuantity + item.quantity;
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: {
            availableQuantity: restoredQty,
            isAvailable: true
          }
        });
      }
    }

    // 3. Refund Credits if charged
    if (refundedCredits > 0) {
      const creditAccount = order.student.creditAccount;
      const newUsedCredit = Math.max(0, creditAccount.usedCredit - refundedCredits);
      const newRemainingCredit = creditAccount.remainingCredit + refundedCredits;

      await tx.creditAccount.update({
        where: { id: creditAccount.id },
        data: {
          usedCredit: newUsedCredit,
          remainingCredit: newRemainingCredit
        }
      });

      await tx.creditTransaction.create({
        data: {
          creditAccountId: creditAccount.id,
          type: 'REFUND',
          amount: refundedCredits,
          balanceAfter: newRemainingCredit,
          description: `Refund for Cancelled Order #${order.orderNumber}`,
          orderId: order.id
        }
      });
    }

    return result;
  }, { timeout: 15000 });

  if (studentUserId && updatedOrder) {
    createNotification({
      userId: studentUserId,
      title: 'Order Cancelled',
      message: `Order #${orderNumberStr} cancelled. ${refundedCredits > 0 ? `${refundedCredits} credits refunded.` : 'Daily entitlement restored.'}`,
      type: 'REFUND'
    }).catch(err => console.error('Notification error:', err));
  }

  return updatedOrder;
};

export const updateOrderStatusChef = async (orderId, newStatus) => {
  const allowedStatuses = ['ACCEPTED', 'PREPARING', 'READY', 'COLLECTED', 'NO_SHOW', 'CANCELLED'];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid order status transition to ${newStatus}`);
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: { student: { include: { user: true } }, orderItems: true }
  });

  // Auto-generate QR Collection Token when READY
  if (newStatus === 'READY') {
    await getOrCreateCollectionToken(order.id, order.studentId).catch(err => console.error('Token gen error:', err));
  }

  if (order?.student?.userId) {
    const statusMessages = {
      ACCEPTED: `Chef accepted your order #${order.orderNumber}.`,
      PREPARING: `Kitchen is now preparing your food for #${order.orderNumber}.`,
      READY: `Order #${order.orderNumber} is READY! View your QR Code for collection.`,
      COLLECTED: `Order #${order.orderNumber} marked as collected. Enjoy your meal!`,
      NO_SHOW: `Order #${order.orderNumber} was marked as NO_SHOW (collection deadline passed).`
    };

    if (statusMessages[newStatus]) {
      createNotification({
        userId: order.student.userId,
        title: `Order Status: ${newStatus}`,
        message: statusMessages[newStatus],
        type: newStatus === 'NO_SHOW' ? 'NO_SHOW' : 'ORDER_UPDATE'
      }).catch(err => console.error('Notification error:', err));
    }
  }

  return order;
};
