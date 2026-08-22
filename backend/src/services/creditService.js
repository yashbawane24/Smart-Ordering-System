import { PrismaClient } from '@prisma/client';
import { createNotification } from './notificationService.js';

const prisma = new PrismaClient();

export const getStudentCreditAccount = async (studentId) => {
  let creditAccount = await prisma.creditAccount.findUnique({
    where: { studentId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  });

  if (!creditAccount) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    creditAccount = await prisma.creditAccount.create({
      data: {
        studentId,
        monthlyCredit: 9000.0,
        usedCredit: 0.0,
        remainingCredit: 9000.0,
        monthYear: currentMonth
      },
      include: {
        transactions: true
      }
    });

    await prisma.creditTransaction.create({
      data: {
        creditAccountId: creditAccount.id,
        type: 'MONTHLY_ALLOCATION',
        amount: 9000.0,
        balanceAfter: 9000.0,
        description: `Initial Monthly Credit Grant for ${currentMonth}`
      }
    });
  }

  return creditAccount;
};

export const resetMonthlyCredits = async (monthYear = new Date().toISOString().slice(0, 7)) => {
  const students = await prisma.student.findMany({
    include: { creditAccount: true, user: true }
  });

  const updatedAccounts = [];

  for (const student of students) {
    if (!student.creditAccount) {
      const acc = await prisma.creditAccount.create({
        data: {
          studentId: student.id,
          monthlyCredit: 9000.0,
          usedCredit: 0.0,
          remainingCredit: 9000.0,
          monthYear
        }
      });
      await prisma.creditTransaction.create({
        data: {
          creditAccountId: acc.id,
          type: 'MONTHLY_ALLOCATION',
          amount: 9000.0,
          balanceAfter: 9000.0,
          description: `Monthly Credit Grant for ${monthYear}`
        }
      });
      updatedAccounts.push(acc);
    } else {
      const acc = await prisma.creditAccount.update({
        where: { id: student.creditAccount.id },
        data: {
          monthlyCredit: 9000.0,
          usedCredit: 0.0,
          remainingCredit: 9000.0,
          monthYear
        }
      });

      await prisma.creditTransaction.create({
        data: {
          creditAccountId: acc.id,
          type: 'MONTHLY_ALLOCATION',
          amount: 9000.0,
          balanceAfter: 9000.0,
          description: `Monthly Credit Reset & Allocation for ${monthYear}`
        }
      });

      await createNotification({
        userId: student.userId,
        title: 'Monthly Credits Allocated!',
        message: `Your wallet has been refreshed with 9,000 credits for ${monthYear}.`,
        type: 'CREDIT_ALERT'
      });

      updatedAccounts.push(acc);
    }
  }

  return updatedAccounts;
};

export const adjustStudentCreditAdmin = async ({ studentId, amount, type = 'ADMIN_ADJUSTMENT', description }) => {
  const creditAccount = await getStudentCreditAccount(studentId);
  const newRemaining = Math.max(0, creditAccount.remainingCredit + amount);
  const newUsed = amount < 0 ? creditAccount.usedCredit + Math.abs(amount) : Math.max(0, creditAccount.usedCredit - amount);

  const updatedAccount = await prisma.creditAccount.update({
    where: { id: creditAccount.id },
    data: {
      remainingCredit: newRemaining,
      usedCredit: newUsed
    }
  });

  const transaction = await prisma.creditTransaction.create({
    data: {
      creditAccountId: creditAccount.id,
      type,
      amount,
      balanceAfter: newRemaining,
      description: description || `Admin Credit Adjustment (${amount >= 0 ? '+' : ''}${amount} Credits)`
    }
  });

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true }
  });

  if (student?.userId) {
    await createNotification({
      userId: student.userId,
      title: 'Credit Wallet Updated',
      message: `Admin adjusted your wallet by ${amount >= 0 ? '+' : ''}${amount} credits. New balance: ${newRemaining} credits.`,
      type: 'CREDIT_ALERT'
    });
  }

  return { account: updatedAccount, transaction };
};
