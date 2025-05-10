
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import SettingsPage from '@/pages/SettingsPage';
import { useAppContext } from '@/contexts/AppContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthRoute from '@/components/AuthRoute';

function AppRoutes() {
  const { isLoading, session } = useAppContext(); // session también se puede usar para una comprobación más directa

   if (isLoading && !sessionStorage.getItem('supabase.auth.token')) { 
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthRoute><LoginPage /></AuthRoute>}
      />
      <Route
        path="/"
        element={<ProtectedRoute><Layout /></ProtectedRoute>}
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
