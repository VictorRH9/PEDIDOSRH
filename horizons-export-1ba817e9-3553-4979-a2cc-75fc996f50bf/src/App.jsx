
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/contexts/AppContext';
import AppRoutes from '@/components/AppRoutes'; // Importado

function App() {
  return (
    <Router>
      <AppProvider>
        <Toaster />
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;
