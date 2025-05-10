
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { printSimpleTicket } from '@/lib/ticketPrinter';
import { supabase } from '@/lib/supabaseClient';

export const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newOrderForReview, setNewOrderForReview] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isRainActive, setIsRainActive] = useState(() => {
    const storedRainStatus = localStorage.getItem('isRainActive');
    return storedRainStatus === 'true';
  });

  const [deliveryZones, setDeliveryZones] = useState([]);

  useEffect(() => {
    localStorage.setItem('isRainActive', isRainActive);
  }, [isRainActive]);

  useEffect(() => {
    const fetchDeliveryZones = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('delivery_zones').select('*');
      if (error) {
        console.error('Error fetching delivery zones:', error);
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
           toast({ title: "Error de Base de Datos", description: `La tabla 'delivery_zones' no existe. Por favor, ejecuta el script SQL de configuración.`, variant: "destructive", duration: 10000 });
        } else {
          toast({ title: "Error", description: `No se pudieron cargar las zonas de envío: ${error.message}`, variant: "destructive" });
        }
        setDeliveryZones([]);
      } else {
        setDeliveryZones(data || []);
      }
    };
    if (session) {
      fetchDeliveryZones();
    }
  }, [session, toast, supabase]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    const { data: authListenerData } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const showNewOrderNotification = (order) => {
    toast({
      title: "Nuevo Pedido Recibido",
      description: `Pedido ID: ${order.id ? order.id.substring(0,8) : 'N/A'} de ${order.customerName || 'Cliente Desconocido'}.`,
      duration: Infinity,
      action: (
        <div className="flex flex-col space-y-2 mt-2">
          <Button
            onClick={() => {
              setNewOrderForReview(order);
              navigate('/');
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
  };

  const contextValue = {
    session,
    isLoading,
    newOrderForReview,
    setNewOrderForReview,
    showNewOrderNotification,
    isRainActive,
    setIsRainActive,
    deliveryZones,
    setDeliveryZones,
    printSimpleTicket,
    supabase,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
