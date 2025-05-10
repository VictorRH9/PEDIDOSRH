
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import SettingsPage from '@/pages/SettingsPage';
import { Toaster } from "@/components/ui/toaster";
import { useAppContext } from '@/context/AppContext.jsx';

function AppContent() {
  const context = useAppContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (context && context.newOrderForReview) {
      navigate('/'); 
    }
  }, [context, context?.newOrderForReview, navigate]);

  if (!context) {
     return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-xl">Error: Contexto no disponible. Asegúrate de que AppProvider esté configurado correctamente.</div>
      </div>
    );
  }

  const { 
    isAuthenticated, 
    isLoading, 
    newOrderForReview, 
  } = context;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default AppContent;
