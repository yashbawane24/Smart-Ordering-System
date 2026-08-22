import { PrismaClient } from '@prisma/client';
import { createNotification } from './notificationService.js';

const prisma = new PrismaClient();

export const createOrderTransaction = async ({ studentId, items }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order cart cannot be empty');
  }

  // Execute inside a single PostgreSQL / SQLite Prisma transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch Student & Credit Account
    const student = await tx.student.findUnique({
      where: { id: studentId },
      include: { creditAccount: true, user: true }
    });

    if (!student || !student.isActive) {
      throw new Error('Student account is invalid or inactive');
    }

    const creditAccount = student.creditAccount;
    if (!creditAccount) {
      throw new Error('Credit account not found for student');
    }

    // 2. Validate Menu Items Stock & Calculate Total
    let totalOrderCredits = 0;
    const validatedItems = [];

    for (const cartItem of items) {
      const menuItem = await tx.menuItem.findUnique({
        where: { id: cartItem.menuItemId }
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

    // 3. Check Student Remaining Credits
    if (creditAccount.remainingCredit < totalOrderCredits) {
      throw new Error(`Insufficient credits. Required: ${totalOrderCredits} credits, Available: ${creditAccount.remainingCredit} credits.`);
    }

    // 4. Generate Unique Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // 5. Create Order & OrderItems
    const order = await tx.order.create({
      data: {
        orderNumber,
        studentId: student.id,
        totalCredits: totalOrderCredits,
        status: 'PENDING',
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
      include: {
        orderItems: true
      }
    });

    // 6. Update Menu Item Stock Quantities & Auto-Disable if 0
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

    // 7. Deduct Student Credits
    const newUsedCredit = creditAccount.usedCredit + totalOrderCredits;
    const newRemainingCredit = creditAccount.remainingCredit - totalOrderCredits;

    await tx.creditAccount.update({
      where: { id: creditAccount.id },
      data: {
        usedCredit: newUsedCredit,
        remainingCredit: newRemainingCredit
      }
    });

    // 8. Log Credit Transaction Record
    await tx.creditTransaction.create({
      data: {
        creditAccountId: creditAccount.id,
        type: 'ORDER_PAYMENT',
        amount: -totalOrderCredits,
        balanceAfter: newRemainingCredit,
        description: `Payment for Order #${order.orderNumber}`,
        orderId: order.id
      }
    });

    // 9. Send Notification to Student
    await createNotification({
      userId: student.userId,
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} for ${totalOrderCredits} credits has been received by the kitchen.`,
      type: 'ORDER_UPDATE'
    });

    return order;
  });
};

export const cancelOrderTransaction = async ({ orderId, studentId }) => {
  return await prisma.$transaction(async (tx) => {
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

    // 1. Update Order Status
    const updatedOrder = await tx.order.update({
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

    // 3. Refund Credits
    const creditAccount = order.student.creditAccount;
    const newUsedCredit = Math.max(0, creditAccount.usedCredit - order.totalCredits);
    const newRemainingCredit = creditAccount.remainingCredit + order.totalCredits;

    await tx.creditAccount.update({
      where: { id: creditAccount.id },
      data: {
        usedCredit: newUsedCredit,
        remainingCredit: newRemainingCredit
      }
    });

    // 4. Log Refund Transaction Record
    await tx.creditTransaction.create({
      data: {
        creditAccountId: creditAccount.id,
        type: 'REFUND',
        amount: order.totalCredits,
        balanceAfter: newRemainingCredit,
        description: `Refund for Cancelled Order #${order.orderNumber}`,
        orderId: order.id
      }
    });

    // 5. Notify Student
    await createNotification({
      userId: order.student.userId,
      title: 'Order Cancelled & Refunded',
      message: `Order #${order.orderNumber} cancelled. ${order.totalCredits} credits refunded to your wallet.`,
      type: 'REFUND'
    });

    return updatedOrder;
  });
};

export const updateOrderStatusChef = async (orderId, newStatus) => {
  const allowedStatuses = ['ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid order status transition to ${newStatus}`);
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: { student: { include: { user: true } }, orderItems: true }
  });

  if (order?.student?.userId) {
    const statusMessages = {
      ACCEPTED: `Chef accepted your order #${order.orderNumber}.`,
      PREPARING: `Kitchen is now preparing your food for #${order.orderNumber}.`,
      READY: `Order #${order.orderNumber} is READY! Pick it up at Mess Counter.`,
      COMPLETED: `Order #${order.orderNumber} marked as completed. Enjoy your meal!`
    };

    if (statusMessages[newStatus]) {
      await createNotification({
        userId: order.student.userId,
        title: `Order Status: ${newStatus}`,
        message: statusMessages[newStatus],
        type: 'ORDER_UPDATE'
      });
    }
  }

  return order;
};
