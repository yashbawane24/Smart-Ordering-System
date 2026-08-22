# Smart Digital Mess Ordering & Credit Management System

A production-quality, modern, responsive full-stack web application for college mess management. This project replaces traditional physical token-based ordering with a digital ordering platform and an automated 9,000 monthly credit management wallet system.

---

## 🌟 Key Features

### 1. 🎓 Student Portal
- **Dashboard**: Personal welcome card, student registration ID (`21BCE1042`), hostel room info, live remaining credit balance, and order stats.
- **Digital Food Ordering**: Browse categorised menus (*Breakfast, Lunch, Dinner, Beverages, Snacks*), search dishes, filter in-stock items, and sort by price.
- **Smart Cart & Credit Checkout**: Live credit calculation (`Remaining = Current Credits - Order Total`). Built-in credit balance verification prior to order placement.
- **Live Order Tracking**: Interactive 5-stage progress indicator (*PENDING → ACCEPTED → PREPARING → READY → COMPLETED*).
- **Order Cancellation**: Pending orders can be cancelled with automatic credit refunds back to the student wallet in a single database transaction.
- **Order History & Invoices**: Searchable table of past orders with printable modal invoice receipts.
- **Credit Wallet**: Visual glassmorphic credit card UI, transaction ledger logging (`MONTHLY_ALLOCATION`, `ORDER_PAYMENT`, `REFUND`, `ADMIN_ADJUSTMENT`).

### 2. 👨‍🍳 Chef Kitchen Display System (KDS)
- **Kanban Kitchen View**: Real-time order columns (*Incoming, Preparing, Ready for Pickup*).
- **Status Controls**: Advance orders through kitchen stages with single-click actions.
- **Menu Availability Manager**: Toggle item availability and adjust stock quantities. Automatically marks items as **Sold Out** when stock reaches zero.

### 3. 🛡️ Admin Management Console
- **Analytics & Reports (Recharts)**: Interactive charts for *Daily Order Volume*, *Most Ordered Food Items*, *Status Ratios*, and *Peak Ordering Meal Slots*. CSV export functionality included.
- **Student CRUD**: Full student directory management, room assignments, and active/deactivate toggles.
- **Chef Staff CRUD**: Manage kitchen staff accounts and permission access.
- **Menu Management**: Add, edit, price, and update stock for mess food items with image URLs.
- **Credit Administration**: View student balances, perform manual credit adjustments with mandatory audit logs, and trigger monthly 9,000 credit resets.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios, React Router v6.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs password hashing, Role-Based Access Control (RBAC).
- **Database**: PostgreSQL / SQLite with Prisma ORM.
- **Architecture**: REST API architecture with single-transaction database operations (`prisma.$transaction`).

---

## 🔐 Seeded Demo Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student** | `student@vit.edu` | `Password123` | Yash Sharma (Reg ID: `21BCE1042`, 8,700 Credits) |
| **Chef** | `chef@vit.edu` | `Password123` | Head Chef Rajesh (Staff ID: `CHEF-001`) |
| **Admin** | `admin@vit.edu` | `Password123` | Mess Manager Suresh (Admin ID: `ADM-001`) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Backend Setup
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev # Runs server on http://localhost:5055
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev # Runs Vite app on http://localhost:5173
```

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5055
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-vit-mess-2026-secure-token"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
```

---

## 📡 REST API Documentation

### Auth
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Fetch authenticated user profile
- `POST /api/auth/logout` - Logout user

### Student & Orders
- `GET /api/student/dashboard` - Get student metrics & credit balances
- `GET /api/menu` - Fetch menu items with search & category filters
- `POST /api/orders` - Atomic order placement inside Prisma transaction
- `GET /api/orders` - List student order history
- `PATCH /api/orders/:id/cancel` - Cancel pending order & issue refund
- `GET /api/credits` - Fetch credit wallet summary & transaction ledger

### Chef
- `GET /api/chef/orders` - Fetch kitchen order queue
- `PATCH /api/chef/orders/:id/status` - Advance order status (*ACCEPTED / PREPARING / READY / COMPLETED*)
- `PATCH /api/chef/menu/:id/availability` - Update stock quantity & toggle availability

### Admin
- `GET /api/admin/dashboard` - High-level mess statistics
- `GET /api/admin/reports` - Analytics dataset for Recharts
- `CRUD /api/admin/students` - Manage student accounts
- `CRUD /api/admin/chefs` - Manage chef staff
- `CRUD /api/admin/menu` - Manage mess food menu items
- `POST /api/admin/credits/allocate` - Execute monthly 9,000 credit reset for all students
- `PATCH /api/admin/credits/adjust` - Manual credit adjustment with audit log

---

## 📁 Project Folder Structure

```
Smart Ordering System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models (User, Student, Chef, Admin, CreditAccount, CreditTransaction, MenuItem, Order, OrderItem, Notification)
│   │   ├── seed.js            # Database seeder (21+ students, 26 menu items, 110+ orders, 200+ transactions)
│   │   └── dev.db
│   ├── src/
│   │   ├── controllers/       # Auth, Student, Chef, Admin, Menu, Order, Credit, Notification, Report
│   │   ├── services/          # Order transactions, credit wallet & notification services
│   │   ├── middlewares/       # JWT Auth, Role checking, Error handling
│   │   ├── routes/            # REST API endpoints
│   │   ├── utils/             # JWT sign/verify, response formatters
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/        # Navbar, Sidebar, Modal, DataTable, FoodCard, CreditCard, OrderProgressWidget, InvoiceModal
    │   ├── context/           # AuthContext, ThemeContext, CartContext, NotificationContext
    │   ├── layouts/           # LandingLayout, MainLayout
    │   ├── pages/             # Landing, Login, Student, Chef, and Admin Dashboards & Subpages
    │   ├── services/          # Axios API instance
    │   ├── utils/             # Formatters & Constants
    │   ├── index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 📝 License & Disclaimer
Created for College Major Project / Capstone evaluation. All food images sourced via Unsplash placeholders.
