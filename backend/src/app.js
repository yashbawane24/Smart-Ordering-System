import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import chefRoutes from './routes/chefRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Institutional Mess Operations New Routes
import mealDeclarationRoutes from './routes/mealDeclarationRoutes.js';
import mealSlotRoutes from './routes/mealSlotRoutes.js';
import entitlementRoutes from './routes/entitlementRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import demandRoutes from './routes/demandRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import pollRoutes from './routes/pollRoutes.js';

import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Smart Campus Mess Operations & Meal Management System API',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/notifications', notificationRoutes);

// New Institutional Mess Operations Routes
app.use('/api/meals', mealDeclarationRoutes);
app.use('/api/meal-slots', mealSlotRoutes);
app.use('/api/entitlements', entitlementRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/polls', pollRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
