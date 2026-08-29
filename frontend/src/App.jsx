import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import { LandingLayout } from './layouts/LandingLayout';
import { MainLayout } from './layouts/MainLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { MenuPage } from './pages/student/MenuPage';
import { CartPage } from './pages/student/CartPage';
import { CurrentOrderPage } from './pages/student/CurrentOrderPage';
import { OrderHistoryPage } from './pages/student/OrderHistoryPage';
import { CreditHistoryPage } from './pages/student/CreditHistoryPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { SettingsPage } from './pages/student/SettingsPage';
import { MyMealsPage } from './pages/student/MyMealsPage';
import { MealSlotsPage } from './pages/student/MealSlotsPage';
import { QRCollectionPage } from './pages/student/QRCollectionPage';
import { StudentFeedbackPage } from './pages/student/StudentFeedbackPage';
import { StudentPollsPage } from './pages/student/StudentPollsPage';

// Chef Pages
import { ChefDashboardPage } from './pages/chef/ChefDashboardPage';
import { ChefFilteredOrdersPage } from './pages/chef/ChefFilteredOrdersPage';
import { ChefMenuAvailabilityPage } from './pages/chef/ChefMenuAvailabilityPage';
import { ChefProfilePage } from './pages/chef/ChefProfilePage';
import { ChefVerifyQRPage } from './pages/chef/ChefVerifyQRPage';
import { ChefDemandPage } from './pages/chef/ChefDemandPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { ChefManagementPage } from './pages/admin/ChefManagementPage';
import { AdminMenuManagementPage } from './pages/admin/AdminMenuManagementPage';
import { CreditManagementPage } from './pages/admin/CreditManagementPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSlotsPage } from './pages/admin/AdminSlotsPage';
import { AdminDemandPlanningPage } from './pages/admin/AdminDemandPlanningPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminPollsPage } from './pages/admin/AdminPollsPage';

import { LoadingSpinner } from './components/common/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'STUDENT') return <Navigate to="/student" replace />;
    if (user.role === 'CHEF') return <Navigate to="/chef" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Landing Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
      </Route>

      {/* Protected Student Portal */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="meals" element={<MyMealsPage />} />
        <Route path="slots" element={<MealSlotsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="current-order" element={<CurrentOrderPage />} />
        <Route path="history" element={<OrderHistoryPage />} />
        <Route path="credits" element={<CreditHistoryPage />} />
        <Route path="qr-collection" element={<QRCollectionPage />} />
        <Route path="feedback" element={<StudentFeedbackPage />} />
        <Route path="polls" element={<StudentPollsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Protected Chef Portal */}
      <Route
        path="/chef"
        element={
          <ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ChefDashboardPage />} />
        <Route
          path="incoming"
          element={
            <ChefFilteredOrdersPage
              targetStatus="PENDING"
              title="Incoming Order Queue"
              description="New orders placed by students waiting for kitchen acceptance."
            />
          }
        />
        <Route
          path="preparing"
          element={
            <ChefFilteredOrdersPage
              targetStatus="PREPARING"
              title="Orders in Preparation"
              description="Orders currently being cooked by kitchen staff."
            />
          }
        />
        <Route
          path="ready"
          element={
            <ChefFilteredOrdersPage
              targetStatus="READY"
              title="Ready for Pickup"
              description="Orders cooked and waiting at counter for student pickup."
            />
          }
        />
        <Route path="verify-qr" element={<ChefVerifyQRPage />} />
        <Route path="demand" element={<ChefDemandPage />} />
        <Route path="availability" element={<ChefMenuAvailabilityPage />} />
        <Route path="profile" element={<ChefProfilePage />} />
      </Route>

      {/* Protected Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="chefs" element={<ChefManagementPage />} />
        <Route path="menu" element={<AdminMenuManagementPage />} />
        <Route path="slots" element={<AdminSlotsPage />} />
        <Route path="demand" element={<AdminDemandPlanningPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="polls" element={<AdminPollsPage />} />
        <Route path="credits" element={<CreditManagementPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
