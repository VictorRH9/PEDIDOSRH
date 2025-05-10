
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { printTicket as printTicketUtil } from '@/lib/printUtils.jsx';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined || context === null) {
    console.error('useAppContext must be used within an AppProvider and AppContext must have a non-null value.');
    throw new Error('useAppContext must be used within an AppProvider and AppContext must have a non-null value.');
  }
  return context;
};

const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newOrderForReview, setNewOrderForReview] = useState(null);
  const { toast } = useToast();

  const [isRainActive, setIsRainActive] = useState(() => {
    try {
      const storedRainStatus = localStorage.getItem('isRainActive');
      return storedRainStatus === 'true';
    } catch (error) {
      console.error("Failed to read isRainActive from localStorage", error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('isRainActive', isRainActive);
    } catch (error) {
      console.error("Failed to set isRainActive in localStorage", error);
    }
  }, [isRainActive]);

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    } catch (error) {
      console.error("Failed to read isAuthenticated from localStorage", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNewOrderNotification = useCallback((order) => {
    if (!order || !order.id || !order.customerName) {
      console.error("Invalid order data for notification:", order);
      return;
    }
    toast({
      title: "Nuevo Pedido Recibido",
      description: `Pedido ID: ${order.id} de ${order.customerName}.`,
      duration: Infinity,
      action: (
        <div className="flex flex-col space-y-2 mt-2">
          <Button
            onClick={() => {
              setNewOrderForReview(order);
              toast().dismiss();
            }}
            className="w-full"
          >
            Ver Pedido
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast().dismiss();
            }}
            className="w-full"
          >
            Enterado
          </Button>
        </div>
      ),
    });
  }, [toast, setNewOrderForReview]);

  const printTicket = useCallback((order, type) => {
    try {
      printTicketUtil(order, type);
    } catch (error) {
      console.error("Error printing ticket:", error);
      toast({
        title: "Error de Impresión",
        description: "No se pudo imprimir el ticket.",
        variant: "destructive",
      });
    }
  }, [printTicketUtil, toast]);

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    newOrderForReview,
    setNewOrderForReview,
    showNewOrderNotification,
    isRainActive,
    setIsRainActive,
    printTicket,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
