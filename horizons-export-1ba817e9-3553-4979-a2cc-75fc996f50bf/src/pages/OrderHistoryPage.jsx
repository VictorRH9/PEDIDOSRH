
import React, { useState, useMemo, useEffect } from 'react';
import { History, CreditCard, Eye, Trash2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "@/hooks/useOrders";
import OrderTable from "@/components/OrderTable";
import OrderModal from "@/components/OrderModal";
import OrderFilters from "@/components/OrderFilters";
import { OrderStatus } from "@/constants/order";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { printFullTicket } from "@/lib/ticketPrinter";


const OrderHistoryPage = () => {
  const { orders, updateOrder, deleteOrder } = useOrders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

  const historyOrderStatuses = [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.PAID, OrderStatus.CANCELLED];

  const filteredOrders = useMemo(() => {
    let tempOrders = orders.filter(order => historyOrderStatuses.includes(order.status));
    
    if (searchTerm) {
      tempOrders = tempOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === statusFilter);
    }
    return tempOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchTerm, statusFilter]);


  const handleMarkAsPaid = (orderId) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (orderToUpdate && (orderToUpdate.status === OrderStatus.SHIPPED || orderToUpdate.status === OrderStatus.DELIVERED)) {
      let liquidacionRepartidor = 0;
      let toastDescription = `El pedido ${orderId} ha sido marcado como pagado.`;

      if(orderToUpdate.deliveryManCarriesChange && orderToUpdate.changeGiven > 0 && orderToUpdate.realTotal !== null) {
        liquidacionRepartidor = (orderToUpdate.realTotal + orderToUpdate.changeGiven);
        toastDescription += ` El repartidor debe liquidar: MXN$${liquidacionRepartidor.toFixed(2)}.`;
      } else if (orderToUpdate.realTotal !== null) {
        toastDescription += ` Total cobrado: MXN$${orderToUpdate.realTotal.toFixed(2)}.`;
      }


      updateOrder(orderId, { ...orderToUpdate, status: OrderStatus.PAID, liquidacionRepartidor });
      
      toast({
        title: "Pedido Pagado",
        description: toastDescription,
        duration: 7000, // Increased duration for better readability of longer messages
      });

    } else {
       toast({
        title: "Acción no permitida",
        description: `El pedido ${orderId} no se puede marcar como pagado en su estado actual.`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteFromHistory = (orderId) => {
    deleteOrder(orderId);
  };

  const handleViewDetails = (order) => {
    setCurrentOrderDetails(order);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setCurrentOrderDetails(null);
  };

  return (
    <>
      <div className="text-foreground">
        <header className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <History size={40} className="text-white"/>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Historial de Pedidos</h1>
          </motion.div>
        </header>

        <OrderFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalOrders={orders.filter(order => historyOrderStatuses.includes(order.status)).length}
          filteredOrdersCount={filteredOrders.length}
          availableStatuses={historyOrderStatuses}
        />
        
        <OrderTable
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onAcceptOrder={handleMarkAsPaid} 
          onCancelOrder={handleDeleteFromHistory} 
          isHistory={true}
        />
        
        <footer className="text-center mt-12 pb-4">
          <p className="text-sm text-white/70">
            Historial de Pedidos - CARNES RH © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
       <AnimatePresence>
        {isDetailModalOpen && currentOrderDetails && (
          <OrderModal
            isOpen={isDetailModalOpen}
            onClose={closeDetailModal}
            order={currentOrderDetails}
            isDetailView={false} 
            isHistoryView={true} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderHistoryPage;
