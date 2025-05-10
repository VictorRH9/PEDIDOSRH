
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/contexts/AppContext';
import { OrderStatus, PaymentMethods } from '@/constants/order';
import { mapOrderFromDb, calculateSubtotal, calculateRealTotal, generateProductDetailsString } from '@/utils/orderUtils';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const supabase = appContext?.supabase;
  const session = appContext?.session;

  const fetchOrders = useCallback(async () => {
    if (!supabase || !session) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
         toast({ title: "Error de Base de Datos", description: `La tabla 'orders' no existe. Por favor, ejecuta el script SQL de configuración.`, variant: "destructive", duration: 10000 });
      } else {
        toast({ title: "Error", description: `No se pudieron cargar los pedidos: ${error.message}`, variant: "destructive" });
      }
      setOrders([]);
    } else {
      setOrders(data.map(mapOrderFromDb));
    }
  }, [supabase, session, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (orderData, simulateExternal = false) => {
    if (!supabase || !session) {
      toast({ title: "Error", description: "No autenticado. No se puede crear el pedido.", variant: "destructive" });
      return null;
    }
    
    const itemsList = orderData.itemsList || [];
    const subtotal = calculateSubtotal(itemsList);
    const deliveryCost = Number(orderData.deliveryCost) || 0;
    const finalTotal = calculateRealTotal(subtotal, deliveryCost);

    const newOrderPayload = {
      user_id: session.user.id,
      customer_name: orderData.customerName || 'N/A',
      customer_phone: orderData.customerPhone || null,
      delivery_address: orderData.deliveryAddress || null,
      delivery_zone_id: orderData.deliveryZoneId || null,
      delivery_cost: deliveryCost,
      items_list: itemsList,
      total_amount: subtotal, 
      real_total: finalTotal, 
      payment_method: orderData.paymentMethod || PaymentMethods.CASH,
      payment_status: orderData.paymentStatus || 'Pendiente',
      order_status: orderData.status || OrderStatus.NEW,
      notes: orderData.notes || null,
      product_details_string: generateProductDetailsString(itemsList),
      paid_with: orderData.paidWith !== null ? Number(orderData.paidWith) : null,
      change_given: orderData.changeGiven !== null ? Number(orderData.changeGiven) : null,
      delivery_person_pays: orderData.deliveryPersonPays !== null ? Number(orderData.deliveryPersonPays) : null,
      preparation_start_time: orderData.preparationStartTime ? new Date(orderData.preparationStartTime).toISOString() : null,
      preparation_time_elapsed_ms: orderData.preparationTimeElapsed || 0,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrderPayload])
      .select()
      .single();

    if (error) {
      console.error('Error adding order:', error);
      toast({ title: "Error al crear pedido", description: error.message, variant: "destructive" });
      return null;
    }
    
    const createdOrder = mapOrderFromDb(data);
    // No need to sort here, new orders go to the top due to Realtime logic or initial fetch order
    setOrders(prevOrders => [createdOrder, ...prevOrders.filter(o => o.id !== createdOrder.id)]);
    
    if (simulateExternal && appContext && appContext.showNewOrderNotification) {
      appContext.showNewOrderNotification(createdOrder);
    } else if (!simulateExternal) {
       toast({ title: "Pedido Creado", description: `El pedido ${createdOrder.id.substring(0,8)} ha sido creado.` });
    }
    return createdOrder;
  }, [supabase, session, toast, appContext]);

  const updateOrder = useCallback(async (orderId, orderData) => {
     if (!supabase || !session) {
      toast({ title: "Error", description: "No autenticado. No se puede actualizar el pedido.", variant: "destructive" });
      return null;
    }

    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) {
        toast({ title: "Error", description: "Pedido no encontrado.", variant: "destructive" });
        return null;
    }

    const itemsList = orderData.itemsList !== undefined ? orderData.itemsList : currentOrder.itemsList;
    const subtotal = calculateSubtotal(itemsList);
    const deliveryCost = orderData.deliveryCost !== undefined ? Number(orderData.deliveryCost) : currentOrder.deliveryCost;
    const finalTotal = calculateRealTotal(subtotal, deliveryCost);

    const updatePayload = {
      customer_name: orderData.customerName !== undefined ? orderData.customerName : currentOrder.customerName,
      customer_phone: orderData.customerPhone !== undefined ? orderData.customerPhone : currentOrder.customerPhone,
      delivery_address: orderData.deliveryAddress !== undefined ? orderData.deliveryAddress : currentOrder.deliveryAddress,
      delivery_zone_id: orderData.deliveryZoneId !== undefined ? orderData.deliveryZoneId : currentOrder.deliveryZoneId,
      delivery_cost: deliveryCost,
      items_list: itemsList,
      total_amount: subtotal,
      real_total: finalTotal,
      payment_method: orderData.paymentMethod !== undefined ? orderData.paymentMethod : currentOrder.paymentMethod,
      payment_status: orderData.paymentStatus !== undefined ? orderData.paymentStatus : currentOrder.paymentStatus,
      order_status: orderData.status !== undefined ? orderData.status : currentOrder.status,
      notes: orderData.notes !== undefined ? orderData.notes : currentOrder.notes,
      product_details_string: generateProductDetailsString(itemsList),
      paid_with: orderData.paidWith !== undefined ? Number(orderData.paidWith) : currentOrder.paidWith,
      change_given: orderData.changeGiven !== undefined ? Number(orderData.changeGiven) : currentOrder.changeGiven,
      delivery_person_pays: orderData.deliveryPersonPays !== undefined ? Number(orderData.deliveryPersonPays) : currentOrder.deliveryPersonPays,
      preparation_start_time: orderData.preparationStartTime ? new Date(orderData.preparationStartTime).toISOString() : currentOrder.preparationStartTime ? new Date(currentOrder.preparationStartTime).toISOString() : null,
      preparation_time_elapsed_ms: orderData.preparationTimeElapsed !== undefined ? Number(orderData.preparationTimeElapsed) : currentOrder.preparationTimeElapsed,
    };
    
    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      toast({ title: "Error al actualizar pedido", description: error.message, variant: "destructive" });
      return null;
    }

    const updatedOrder = mapOrderFromDb(data);
    setOrders(prevOrders => prevOrders.map(o => (o.id === orderId ? updatedOrder : o)));
    toast({ title: "Pedido Actualizado", description: `El pedido ${updatedOrder.id.substring(0,8)} ahora está ${updatedOrder.status}.` });
    return updatedOrder;

  }, [supabase, session, orders, toast]);

  const deleteOrder = useCallback(async (orderId) => {
    if (!supabase || !session) {
      toast({ title: "Error", description: "No autenticado. No se puede eliminar el pedido.", variant: "destructive" });
      return;
    }
    const orderToDelete = orders.find(order => order.id === orderId);
    if (!orderToDelete) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      toast({ title: "Error al eliminar pedido", description: error.message, variant: "destructive" });
    } else {
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
      toast({ title: "Pedido Eliminado", description: `El pedido ${orderToDelete.id.substring(0,8)} ha sido eliminado.`, variant: "destructive" });
    }
  }, [supabase, session, orders, toast]);
  
  useEffect(() => {
    if (!supabase) return;

    const ordersChannel = supabase.channel('custom-orders-channel-v2')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Realtime change received!', payload);
          if (payload.eventType === 'INSERT') {
            const newOrder = mapOrderFromDb(payload.new);
            setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)].sort((a,b) => new Date(b.date) - new Date(a.date)));
            if (appContext && appContext.showNewOrderNotification && payload.new.user_id !== session?.user?.id) {
              appContext.showNewOrderNotification(newOrder);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = mapOrderFromDb(payload.new);
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o).sort((a,b) => new Date(b.date) - new Date(a.date)));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to orders channel!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Channel error:', err);
          toast({title: 'Error de Conexión Realtime', description: `Error: ${err?.message}`, variant: 'destructive'});
        }
        if (status === 'TIMED_OUT') {
          console.warn('Channel timed out');
           toast({title: 'Conexión Realtime Interrumpida', description: 'Se perdió la conexión en tiempo real, intente recargar.', variant: 'destructive'});
        }
      });

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [supabase, appContext, session, toast]);


  return { orders, addOrder, updateOrder, deleteOrder, setOrders, fetchOrders };
}
