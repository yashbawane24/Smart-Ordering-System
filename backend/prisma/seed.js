import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
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

  // 1. Create Primary Demo Users
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
      chef: {
        create: {
          chefIdStr: 'CHEF-001'
        }
      }
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
      admin: {
        create: {
          adminIdStr: 'ADM-001'
        }
      }
    }
  });

  console.log('✅ Created primary demo accounts (student@vit.edu, chef@vit.edu, admin@vit.edu)');

  // 2. Create Additional Students (20+)
  const studentNames = [
    'Aarav Patel', 'Ananya Gupta', 'Rohan Verma', 'Isha Reddy', 'Siddharth Rao',
    'Priya Nair', 'Vikram Singh', 'Kavya Joshi', 'Aditya Kumar', 'Neha Sharma',
    'Rahul Mehta', 'Sneha Kapoor', 'Devansh Jain', 'Riya Sen', 'Tanmay Agarwal',
    'Meera Iyer', 'Arjun Saxena', 'Pooja Bhat', 'Manish Chawla', 'Divya Pillai'
  ];

  const studentsList = [];
  studentsList.push(demoStudentUser.student);

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
            }
          }
        }
      },
      include: { student: { include: { creditAccount: true } } }
    });
    studentsList.push(studentUser.student);
  }
  console.log(`✅ Seeded ${studentsList.length} total students with credit accounts.`);

  // 3. Create Additional Chefs & Admins
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

  // 4. Create 25+ Realistic Indian Mess Menu Items
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
    {
      name: 'Puri Sambar Bhaji (4 pcs)',
      description: 'Golden deep-fried puffy bread served with spicy potato curry.',
      category: 'Breakfast',
      price: 55,
      availableQuantity: 0, // Sold out item test
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      isAvailable: false
    },
    {
      name: 'Meda Vada with Sambar (2 pcs)',
      description: 'Crispy savory fried lentil donuts served with tangy sambar.',
      category: 'Breakfast',
      price: 45,
      availableQuantity: 40,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
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
    {
      name: 'Whole Wheat Chapati Basket (4 pcs)',
      description: 'Freshly baked soft whole wheat chapatis with pure ghee topping.',
      category: 'Lunch',
      price: 30,
      availableQuantity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
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
    {
      name: 'Egg Curry Rice Bowl',
      description: '2 boiled eggs simmered in onion-tomato gravy served over steamed rice.',
      category: 'Dinner',
      price: 95,
      availableQuantity: 45,
      imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Chana Masala with Kulcha (2 pcs)',
      description: 'Spiced chickpeas cooked in Punjabi gravy served with soft tandoori kulchas.',
      category: 'Dinner',
      price: 100,
      availableQuantity: 60,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
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
      name: 'South Indian Filter Coffee',
      description: 'Strong hot coffee frothed with boiling milk in traditional brass decoction filter.',
      category: 'Beverages',
      price: 25,
      availableQuantity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
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
    {
      name: 'Fresh Mango Milkshake',
      description: 'Real Alphonso mango pulp blended with chilled milk and ice cream.',
      category: 'Beverages',
      price: 50,
      availableQuantity: 40,
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Spiced Buttermilk (Chaas)',
      description: 'Refreshing churned curd with coriander, green chillies, and roasted cumin.',
      category: 'Beverages',
      price: 20,
      availableQuantity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80',
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
    },
    {
      name: 'Veg Cheese Grilled Sandwich',
      description: 'Toasted bread loaded with sliced cucumber, tomato, cheese, and mint chutney.',
      category: 'Snacks',
      price: 60,
      availableQuantity: 55,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'French Fries with Dip',
      description: 'Crispy salted potato fries served with tomato ketchup and garlic mayo.',
      category: 'Snacks',
      price: 50,
      availableQuantity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      name: 'Pav Bhaji Plate',
      description: 'Spiced mashed vegetable curry garnished with butter, served with 2 soft buttered pavs.',
      category: 'Snacks',
      price: 75,
      availableQuantity: 40,
      imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ];

  const createdMenuItems = [];
  for (const item of menuItemsData) {
    const created = await prisma.menuItem.create({ data: item });
    createdMenuItems.push(created);
  }
  console.log(`✅ Created ${createdMenuItems.length} menu items across 5 categories.`);

  // 5. Seed Credit Transactions (Monthly Allocations)
  for (const student of studentsList) {
    await prisma.creditTransaction.create({
      data: {
        creditAccountId: student.creditAccount.id,
        type: 'MONTHLY_ALLOCATION',
        amount: 9000.0,
        balanceAfter: 9000.0,
        description: `Monthly Credit Grant for ${currentMonth}`,
        createdAt: new Date(Date.now() - 25 * 86400 * 1000)
      }
    });
  }

  // 6. Seed Orders & Order Items & Order Payment/Refund Transactions (100+ Orders)
  const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'READY', 'PREPARING', 'ACCEPTED', 'PENDING', 'CANCELLED'];
  let orderCounter = 1001;

  for (let i = 0; i < 110; i++) {
    const randomStudent = studentsList[i % studentsList.length];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    let totalCredits = 0;

    for (let j = 0; j < numItems; j++) {
      const item = createdMenuItems[(i * 3 + j) % createdMenuItems.length];
      const qty = Math.floor(Math.random() * 2) + 1;
      const subtotal = item.price * qty;
      totalCredits += subtotal;
      selectedItems.push({
        menuItemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        quantity: qty,
        subtotal
      });
    }

    const orderStatus = statuses[i % statuses.length];
    const orderDate = new Date(Date.now() - (110 - i) * 4 * 3600 * 1000); // Distributed over recent days

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-202608-${orderCounter++}`,
        studentId: randomStudent.id,
        totalCredits,
        status: orderStatus,
        createdAt: orderDate,
        updatedAt: orderDate,
        orderItems: {
          create: selectedItems
        }
      }
    });

    // Log corresponding credit transactions
    if (orderStatus !== 'CANCELLED') {
      const currentAccount = await prisma.creditAccount.findUnique({ where: { id: randomStudent.creditAccount.id } });
      const newUsed = currentAccount.usedCredit + totalCredits;
      const newRemaining = Math.max(0, currentAccount.remainingCredit - totalCredits);

      await prisma.creditAccount.update({
        where: { id: currentAccount.id },
        data: { usedCredit: newUsed, remainingCredit: newRemaining }
      });

      await prisma.creditTransaction.create({
        data: {
          creditAccountId: currentAccount.id,
          type: 'ORDER_PAYMENT',
          amount: -totalCredits,
          balanceAfter: newRemaining,
          description: `Payment for Order #${createdOrder.orderNumber}`,
          orderId: createdOrder.id,
          createdAt: orderDate
        }
      });
    } else {
      // Seed a cancelled order with payment + refund transaction pair
      await prisma.creditTransaction.create({
        data: {
          creditAccountId: randomStudent.creditAccount.id,
          type: 'ORDER_PAYMENT',
          amount: -totalCredits,
          balanceAfter: randomStudent.creditAccount.remainingCredit - totalCredits,
          description: `Payment for Order #${createdOrder.orderNumber}`,
          orderId: createdOrder.id,
          createdAt: orderDate
        }
      });

      await prisma.creditTransaction.create({
        data: {
          creditAccountId: randomStudent.creditAccount.id,
          type: 'REFUND',
          amount: totalCredits,
          balanceAfter: randomStudent.creditAccount.remainingCredit,
          description: `Refund for Cancelled Order #${createdOrder.orderNumber}`,
          orderId: createdOrder.id,
          createdAt: new Date(orderDate.getTime() + 15 * 60 * 1000)
        }
      });
    }
  }

  console.log('✅ Seeded 110+ orders and 200+ credit transaction records.');

  // 7. Seed Notifications
  const demoStudentUserRecord = await prisma.user.findUnique({ where: { email: 'student@vit.edu' } });
  await prisma.notification.createMany({
    data: [
      {
        userId: demoStudentUserRecord.id,
        title: 'Order Status Update',
        message: 'Your order #ORD-202608-1001 has been marked as READY for pickup at Counter 2!',
        type: 'ORDER_UPDATE',
        isRead: false
      },
      {
        userId: demoStudentUserRecord.id,
        title: 'Monthly Credit Refresh',
        message: '9000 credits allocated for the month of August 2026.',
        type: 'CREDIT_ALERT',
        isRead: true
      },
      {
        userId: demoStudentUserRecord.id,
        title: 'Welcome to Smart Mess System',
        message: 'Your account is active. Order your meal token-free!',
        type: 'GENERAL',
        isRead: true
      }
    ]
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
