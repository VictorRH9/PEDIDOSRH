
import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, PackageSearch, Send, XCircle, Eye, CheckCircle, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "@/hooks/useOrders";
import OrderModal from "@/components/OrderModal";
import OrderTable from "@/components/OrderTable";
import OrderFilters from "@/components/OrderFilters";
import SendOrderModal from "@/components/SendOrderModal";
import { OrderStatus } from "@/constants/order";
import { useAppContext } from '@/contexts/AppContext';
import { printSimpleTicket, printFullTicket } from "@/lib/ticketPrinter";


const DashboardPage = () => {
  const { orders, addOrder, updateOrder } = useOrders();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isDetailViewModal, setIsDetailViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const appContext = useAppContext();


  useEffect(() => {
    if (appContext && appContext.newOrderForReview) {
      handleViewDetails(appContext.newOrderForReview);
      appContext.setNewOrderForReview(null); 
    }
  }, [appContext, appContext?.newOrderForReview]);

  const dashboardOrderStatuses = [OrderStatus.NEW, OrderStatus.PENDING, OrderStatus.PROCESSING];

  const filteredOrders = useMemo(() => {
    let tempOrders = orders.filter(order => dashboardOrderStatuses.includes(order.status));
    
    if (searchTerm) {
      tempOrders = tempOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === statusFilter);
    }
    return tempOrders.sort((a, b) => {
      if (a.status === OrderStatus.NEW && b.status !== OrderStatus.NEW) return -1;
      if (a.status !== OrderStatus.NEW && b.status === OrderStatus.NEW) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [orders, searchTerm, statusFilter]);

  const handleSaveOrder = (orderData) => {
    if (currentOrder && !isDetailViewModal) { 
      updateOrder(currentOrder.id, orderData);
    } else if (!currentOrder && !isDetailViewModal) { 
      const simulateExternal = !currentOrder; 
      const newOrder = addOrder({ ...orderData, status: orderData.status || OrderStatus.NEW }, simulateExternal);
      if (newOrder.status === OrderStatus.NEW && !simulateExternal) { 
         
      }
    }
    closeOrderModal();
  };


  const openOrderModalForEdit = (order = null) => {
    setCurrentOrder(order);
    setIsDetailViewModal(false);
    setIsOrderModalOpen(true);
  };
  
  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setIsDetailViewModal(true);
    setIsOrderModalOpen(true);
  };

  const handleAcceptOrder = (orderToAccept) => {
    updateOrder(orderToAccept.id, { ...orderToAccept, status: OrderStatus.PROCESSING });
    
    if (isOrderModalOpen && currentOrder && currentOrder.id === orderToAccept.id) {
      closeOrderModal();
    }
  };

  const handleCancelOrder = (orderToCancel) => {
     updateOrder(orderToCancel.id, { ...orderToCancel, status: OrderStatus.CANCELLED });
    if (isOrderModalOpen && currentOrder && currentOrder.id === orderToCancel.id) {
      closeOrderModal();
    }
  };


  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setCurrentOrder(null);
    setIsDetailViewModal(false);
  };

  const handleOpenSendModal = (order) => {
    setCurrentOrder(order);
    setIsSendModalOpen(true);
  };

  const handleConfirmSendOrder = (sendData) => {
    updateOrder(currentOrder.id, { 
      ...currentOrder, 
      status: OrderStatus.SHIPPED,
      realTotal: sendData.realTotal,
      paidWith: sendData.paidWith,
      changeGiven: sendData.changeGiven,
      paymentMethod: sendData.paymentMethod,
      folioWeb: sendData.folioWeb,
      deliveryManCarriesChange: sendData.deliveryManCarriesChange,
    });
    setIsSendModalOpen(false);
    setCurrentOrder(null);
  };

  const handlePrintProcessingTicket = (order) => {
    printFullTicket(order);
  };


  return (
    <>
      <div className="text-foreground">
        <header className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <PackageSearch size={40} className="text-white"/>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard de Pedidos</h1>
            </div>
            <Button onClick={() => openOrderModalForEdit()} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-scale">
              <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Pedido (Manual)
            </Button>
          </motion.div>
        </header>

        <OrderFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalOrders={orders.filter(order => dashboardOrderStatuses.includes(order.status)).length}
          filteredOrdersCount={filteredOrders.length}
          availableStatuses={dashboardOrderStatuses}
        />
        
        <OrderTable
          orders={filteredOrders}
          onEdit={openOrderModalForEdit}
          onCancelOrder={handleCancelOrder} 
          onAcceptOrder={handleAcceptOrder}
          onViewDetails={handleViewDetails}
          onSendOrder={handleOpenSendModal}
          onPrintTicket={handlePrintProcessingTicket}
          isHistory={false}
        />

        <AnimatePresence>
          {isOrderModalOpen && (
            <OrderModal
              isOpen={isOrderModalOpen}
              onClose={closeOrderModal}
              onSave={handleSaveOrder}
              order={currentOrder}
              onAccept={handleAcceptOrder}
              onCancel={handleCancelOrder}
              isDetailView={isDetailViewModal}
              isHistoryView={false}
            />
          )}
          {isSendModalOpen && currentOrder && (
            <SendOrderModal
              isOpen={isSendModalOpen}
              onClose={() => { setIsSendModalOpen(false); setCurrentOrder(null);}}
              onConfirm={handleConfirmSendOrder}
              order={currentOrder}
            />
          )}
        </AnimatePresence>
        
        <footer className="text-center mt-12 pb-4">
          <p className="text-sm text-white/70">
            Dashboard - CARNES RH © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
};

export default DashboardPage;
