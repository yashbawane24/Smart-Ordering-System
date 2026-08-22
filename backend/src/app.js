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
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Smart Mess Digital Ordering API',
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
