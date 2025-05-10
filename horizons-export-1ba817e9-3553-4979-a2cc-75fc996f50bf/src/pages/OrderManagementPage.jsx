
import React from 'react';
import { Navigate } from 'react-router-dom';

const OrderManagementPage = () => {
  // This page is no longer directly used. Redirect to Dashboard.
  // The functionality is now split into DashboardPage and OrderHistoryPage.
  return <Navigate to="/" />;
};

export default OrderManagementPage;
