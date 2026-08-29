import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Smart Campus Mess Operations...');

  // Clean existing data in reverse dependency order
  await prisma.menuVote.deleteMany();
  await prisma.menuPollOption.deleteMany();
  await prisma.menuPoll.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.mealFeedback.deleteMany();
  await prisma.collectionToken.deleteMany();
  await prisma.mealEntitlementUsage.deleteMany();
  await prisma.slotBooking.deleteMany();
  await prisma.mealSlot.deleteMany();
  await prisma.mealDeclaration.deleteMany();
  await prisma.studentMealPlan.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.creditAccount.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.student.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned up old database records.');

  const hashedPassword = await bcrypt.hash('Password123', 10);
  const currentMonth = '2026-08';
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  // 1. Create Default Institutional Meal Plan
  const defaultMealPlan = await prisma.mealPlan.create({
    data: {
      name: 'Standard Campus Institutional Meal Plan',
      monthlyCreditLimit: 9000.0,
      breakfastEntitlement: 1,
      lunchEntitlement: 1,
      dinnerEntitlement: 1,
      isActive: true
    }
  });

  // 2. Create Primary Demo Users
  // Demo Student
  const demoStudentUser = await prisma.user.create({
    data: {
      email: 'student@vit.edu',
      password: hashedPassword,
      name: 'Yash Sharma',
      phone: '+91 9876543210',
      role: 'STUDENT',
      student: {
        create: {
          studentIdStr: '21BCE1042',
          hostel: 'Block A, Mens Hostel',
          roomNumber: 'A-304',
          creditAccount: {
            create: {
              monthlyCredit: 9000.0,
              usedCredit: 300.0,
              remainingCredit: 8700.0,
              monthYear: currentMonth
            }
          },
          studentMealPlans: {
            create: {
              mealPlanId: defaultMealPlan.id,
              status: 'ACTIVE'
            }
          }
        }
      }
    },
    include: { student: { include: { creditAccount: true } } }
  });

  // Demo Chef
  const demoChefUser = await prisma.user.create({
    data: {
      email: 'chef@vit.edu',
      password: hashedPassword,
      name: 'Head Chef Rajesh',
      phone: '+91 9876543211',
      role: 'CHEF',
      chef: { create: { chefIdStr: 'CHEF-001' } }
    }
  });

  // Demo Admin
  const demoAdminUser = await prisma.user.create({
    data: {
      email: 'admin@vit.edu',
      password: hashedPassword,
      name: 'Mess Manager Suresh',
      phone: '+91 9876543212',
      role: 'ADMIN',
      admin: { create: { adminIdStr: 'ADM-001' } }
    }
  });

  console.log('✅ Created primary demo accounts (student@vit.edu, chef@vit.edu, admin@vit.edu)');

  // 3. Create Additional Students (20+)
  const studentNames = [
    'Aarav Patel', 'Ananya Gupta', 'Rohan Verma', 'Isha Reddy', 'Siddharth Rao',
    'Priya Nair', 'Vikram Singh', 'Kavya Joshi', 'Aditya Kumar', 'Neha Sharma',
    'Rahul Mehta', 'Sneha Kapoor', 'Devansh Jain', 'Riya Sen', 'Tanmay Agarwal',
    'Meera Iyer', 'Arjun Saxena', 'Pooja Bhat', 'Manish Chawla', 'Divya Pillai'
  ];

  const studentsList = [demoStudentUser.student];

  for (let i = 0; i < studentNames.length; i++) {
    const studentUser = await prisma.user.create({
      data: {
        email: `student${i + 1}@vit.edu`,
        password: hashedPassword,
        name: studentNames[i],
        phone: `+91 98765000${(i + 10).toString().padStart(2, '0')}`,
        role: 'STUDENT',
        student: {
          create: {
            studentIdStr: `21BCE${(1050 + i).toString()}`,
            hostel: `Block ${String.fromCharCode(65 + (i % 4))}, Mens Hostel`,
            roomNumber: `${(i % 5) + 1}0${(i % 9) + 1}`,
            creditAccount: {
              create: {
                monthlyCredit: 9000.0,
                usedCredit: Math.floor(Math.random() * 3000),
                remainingCredit: 9000 - Math.floor(Math.random() * 3000),
                monthYear: currentMonth
              }
            },
            studentMealPlans: {
              create: {
                mealPlanId: defaultMealPlan.id,
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      include: { student: { include: { creditAccount: true } } }
    });
    studentsList.push(studentUser.student);
  }
  console.log(`✅ Seeded ${studentsList.length} total students with credit accounts and meal plans.`);

  // 4. Create Chefs & Admins
  const chefNames = ['Chef Kumar', 'Chef Anthony', 'Chef Usman', 'Chef Murugan'];
  for (let i = 0; i < chefNames.length; i++) {
    await prisma.user.create({
      data: {
        email: `chef${i + 2}@vit.edu`,
        password: hashedPassword,
        name: chefNames[i],
        phone: `+91 98765111${i}`,
        role: 'CHEF',
        chef: { create: { chefIdStr: `CHEF-00${i + 2}` } }
      }
    });
  }

  await prisma.user.create({
    data: {
      email: 'admin2@vit.edu',
      password: hashedPassword,
      name: 'Assistant Manager Priya',
      phone: '+91 987652221',
      role: 'ADMIN',
      admin: { create: { adminIdStr: 'ADM-002' } }
    }
  });

  // 5. Create Realistic Indian Mess Menu Items
  const menuItemsData = [
    // Breakfast
    {
      name: 'Steamed Idli with Sambar & Chutney',
      description: '3 soft rice cakes served with hot lentil sambar and fresh coconut chutney.',
      category: 'Breakfast',
      price: 40,
      availableQuantity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Crispy Masala Dosa',
      description: 'Thin golden crepe stuffed with spiced potato filling, served with chutneys.',
      category: 'Breakfast',
      price: 60,
      availableQuantity: 60,
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Indori Poha with Sev',
      description: 'Flattened rice cooked with turmeric, mustard seeds, onions, topped with crunchy ratlami sev.',
      category: 'Breakfast',
      price: 35,
      availableQuantity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Double Egg Omelette Toast',
      description: 'Fluffy 2-egg omelette cooked with green chillies & onions, served with buttered bread slices.',
      category: 'Breakfast',
      price: 50,
      availableQuantity: 50,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    // Lunch
    {
      name: 'Special North Indian Veg Thali',
      description: 'Paneer Butter Masala, Dal Tadka, 3 Chapati, Jeera Rice, Salad & Gulab Jamun.',
      category: 'Lunch',
      price: 120,
      availableQuantity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Chicken Rice Thali Meal',
      description: 'Rich Chicken Curry, Steamed Basmati Rice, Rasam, Curd, Chapati & Papad.',
      category: 'Lunch',
      price: 140,
      availableQuantity: 75,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Paneer Butter Masala Combo',
      description: 'Cottage cheese cubes in rich tomato gravy served with 3 Butter Naan.',
      category: 'Lunch',
      price: 110,
      availableQuantity: 65,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Yellow Dal Fry with Jeera Rice',
      description: 'Comforting arhar dal tempered with garlic, ghee, and cumin, served with jeera rice.',
      category: 'Lunch',
      price: 80,
      availableQuantity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    // Dinner
    {
      name: 'Hyderabadi Veg Dum Biryani',
      description: 'Fragrant long-grain basmati rice layered with spiced vegetables, served with Raita.',
      category: 'Dinner',
      price: 130,
      availableQuantity: 70,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Chicken Dum Biryani',
      description: 'Authentic Hyderabadi chicken biryani cooked with aromatic spices, served with Mirchi ka Salan.',
      category: 'Dinner',
      price: 160,
      availableQuantity: 85,
      imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Schezwan Veg Fried Rice',
      description: 'Indo-Chinese style wok-tossed fried rice with crunchy veggies in Schezwan sauce.',
      category: 'Dinner',
      price: 90,
      availableQuantity: 50,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    // Beverages
    {
      name: 'Masala Chai',
      description: 'Hot brewed Indian milk tea infused with ginger and cardamom.',
      category: 'Beverages',
      price: 20,
      availableQuantity: 150,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Chilled Sweet Lassi',
      description: 'Thick creamy yogurt beverage flavored with cardamom and saffron.',
      category: 'Beverages',
      price: 40,
      availableQuantity: 60,
      imageUrl: 'https://images.unsplash.com/photo-1571006682860-39686411516e?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    // Snacks
    {
      name: 'Crispy Samosa (2 pcs)',
      description: 'Golden triangular pastry crust filled with spiced potatoes and peas, served with mint chutney.',
      category: 'Snacks',
      price: 30,
      availableQuantity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Paneer Pakora Basket',
      description: 'Deep-fried cottage cheese cubes dipped in seasoned gram flour batter.',
      category: 'Snacks',
      price: 65,
      availableQuantity: 45,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ];

  const createdMenuItems = [];
  for (const item of menuItemsData) {
    const created = await prisma.menuItem.create({ data: item });
    createdMenuItems.push(created);
  }
  console.log(`✅ Created ${createdMenuItems.length} menu items.`);

  // 6. Seed Meal Declarations (Today & Tomorrow)
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  for (const student of studentsList) {
    // Declarations for Today
    await prisma.mealDeclaration.createMany({
      data: [
        { studentId: student.id, mealDate: todayStr, mealType: 'Breakfast', status: 'DECLARED' },
        { studentId: student.id, mealDate: todayStr, mealType: 'Lunch', status: 'DECLARED' },
        { studentId: student.id, mealDate: todayStr, mealType: 'Dinner', status: Math.random() > 0.3 ? 'DECLARED' : 'SKIPPED' }
      ],
      skipDuplicates: true
    });

    // Declarations for Tomorrow
    await prisma.mealDeclaration.createMany({
      data: [
        { studentId: student.id, mealDate: tomorrowStr, mealType: 'Breakfast', status: 'DECLARED' },
        { studentId: student.id, mealDate: tomorrowStr, mealType: 'Lunch', status: 'DECLARED' },
        { studentId: student.id, mealDate: tomorrowStr, mealType: 'Dinner', status: Math.random() > 0.4 ? 'SKIPPED' : 'DECLARED' }
      ],
      skipDuplicates: true
    });
  }
  console.log('✅ Seeded Meal Declarations for Today and Tomorrow.');

  // 7. Seed Meal Slots for Today & Tomorrow (Lunch 15-min intervals)
  const timeRanges = [
    { start: '12:30', end: '12:45' },
    { start: '12:45', end: '1:00' },
    { start: '1:00', end: '1:15' },
    { start: '1:15', end: '1:30' }
  ];

  const createdTodaySlots = [];
  for (const tr of timeRanges) {
    const slot = await prisma.mealSlot.create({
      data: {
        mealType: 'Lunch',
        slotDate: todayStr,
        startTime: tr.start,
        endTime: tr.end,
        capacity: 50,
        bookedCount: Math.floor(Math.random() * 35) + 10,
        status: 'ACTIVE'
      }
    });
    createdTodaySlots.push(slot);
  }

  // Book Demo Student into 1:00 - 1:15 PM slot for Lunch today
  const demoSlot = createdTodaySlots[2];
  const demoBooking = await prisma.slotBooking.create({
    data: {
      studentId: demoStudentUser.student.id,
      slotId: demoSlot.id,
      mealDate: todayStr,
      status: 'BOOKED'
    }
  });

  console.log('✅ Seeded Meal Slots & Slot Booking for demo student.');

  // 8. Seed Orders, Collection Tokens, Feedbacks, and Transactions
  const statuses = ['COLLECTED', 'COLLECTED', 'READY', 'PREPARING', 'ACCEPTED', 'PENDING', 'NO_SHOW', 'CANCELLED'];
  let orderCounter = 1001;

  for (let i = 0; i < 50; i++) {
    const randomStudent = studentsList[i % studentsList.length];
    const item = createdMenuItems[i % createdMenuItems.length];
    const orderStatus = statuses[i % statuses.length];
    const orderDate = new Date(Date.now() - (50 - i) * 2 * 3600 * 1000);

    const orderNumber = `ORD-202608-${orderCounter++}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        studentId: randomStudent.id,
        totalCredits: item.price,
        status: orderStatus,
        slotBookingId: demoBooking.id,
        isEntitlementUsed: i % 2 === 0,
        createdAt: orderDate,
        updatedAt: orderDate,
        orderItems: {
          create: [{
            menuItemId: item.id,
            itemName: item.name,
            itemPrice: item.price,
            quantity: 1,
            subtotal: item.price
          }]
        }
      }
    });

    // Create CollectionToken for READY or COLLECTED orders
    if (orderStatus === 'READY' || orderStatus === 'COLLECTED') {
      await prisma.collectionToken.create({
        data: {
          orderId: order.id,
          token: `QR-TOK-${Math.floor(100000 + Math.random() * 900000)}`,
          expiresAt: new Date(Date.now() + 2 * 3600 * 1000),
          usedAt: orderStatus === 'COLLECTED' ? new Date(orderDate.getTime() + 20 * 60 * 1000) : null,
          status: orderStatus === 'COLLECTED' ? 'USED' : 'ACTIVE'
        }
      });
    }

    // Create MealFeedback for COLLECTED orders
    if (orderStatus === 'COLLECTED' && i % 3 === 0) {
      const feedback = await prisma.mealFeedback.create({
        data: {
          studentId: randomStudent.id,
          orderId: order.id,
          foodQualityRating: Math.floor(Math.random() * 2) + 4,
          quantityRating: 4,
          temperatureRating: Math.floor(Math.random() * 3) + 3,
          issues: i % 6 === 0 ? 'Too Cold' : null,
          comment: 'Food was prepared well and served warm at counter!'
        }
      });

      if (i % 6 === 0) {
        await prisma.complaint.create({
          data: {
            studentId: randomStudent.id,
            feedbackId: feedback.id,
            issueType: 'Food Temperature',
            description: 'Meal served was lukewarm during peak lunch hours.',
            status: i % 2 === 0 ? 'OPEN' : 'RESOLVED',
            resolutionNote: i % 2 === 0 ? null : 'Kitchen heating trays adjusted by Head Chef.'
          }
        });
      }
    }
  }

  console.log('✅ Seeded Orders, Collection Tokens, Meal Feedbacks & Complaints.');

  // 9. Seed Weekend Special Menu Poll
  const poll = await prisma.menuPoll.create({
    data: {
      title: 'Weekend Special Dish Selection',
      description: 'Vote for your preferred dish for this Sunday institutional special lunch!',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3 * 86400 * 1000),
      status: 'ACTIVE'
    }
  });

  const pollOption1 = await prisma.menuPollOption.create({
    data: { pollId: poll.id, optionName: 'Special Hyderabadi Chicken Biryani' }
  });
  const pollOption2 = await prisma.menuPollOption.create({
    data: { pollId: poll.id, optionName: 'Paneer Butter Masala with Garlic Naan' }
  });
  const pollOption3 = await prisma.menuPollOption.create({
    data: { pollId: poll.id, optionName: 'Amritsari Chole Bhature' }
  });

  // Cast sample votes
  for (let i = 0; i < studentsList.length; i++) {
    const option = [pollOption1, pollOption2, pollOption3][i % 3];
    await prisma.menuVote.create({
      data: {
        pollId: poll.id,
        optionId: option.id,
        studentId: studentsList[i].id
      }
    });
  }

  console.log('✅ Seeded Menu Poll and Votes.');

  // 10. Seed System Notifications
  const demoStudentUserRecord = await prisma.user.findUnique({ where: { email: 'student@vit.edu' } });
  await prisma.notification.createMany({
    data: [
      {
        userId: demoStudentUserRecord.id,
        title: 'Tomorrow Meal Declaration Open',
        message: 'Plan tomorrow’s meals before 11:00 AM cutoff to assist mess kitchen preparation.',
        type: 'MEAL_DECLARATION',
        isRead: false
      },
      {
        userId: demoStudentUserRecord.id,
        title: 'Lunch Pickup Slot Confirmed',
        message: 'Your pickup slot for Lunch is booked for 1:00 PM – 1:15 PM today.',
        type: 'SLOT_BOOKED',
        isRead: true
      },
      {
        userId: demoStudentUserRecord.id,
        title: 'Order Status Update',
        message: 'Your meal order #ORD-202608-1003 is READY! Show your QR code at Counter 1.',
        type: 'ORDER_UPDATE',
        isRead: false
      }
    ]
  });

  console.log('🎉 Full database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
