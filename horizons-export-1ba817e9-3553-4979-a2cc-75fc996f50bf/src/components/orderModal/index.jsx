
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Printer } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatus, generateProductDetailsString, PaymentMethods } from "@/constants/order";
import { printFullTicket } from "@/lib/ticketPrinter";
import OrderForm from './OrderForm';
import OrderViewDetails from './OrderViewDetails';
import { useAppContext } from '@/contexts/AppContext';

const OrderModal = ({ isOpen, onClose, onSave, order, onAccept, onCancel, isDetailView = false, isHistoryView = false }) => {
  const { deliveryZones } = useAppContext();

  const initialItem = { 
    id: `ITEM_${Date.now()}`, 
    quantity: 1, 
    name: '', 
    unitPrice: 0, 
    itemTotal: 0, 
    productId: null, 
    category: null 
  };

  const initialFormData = {
    customerName: '',
    customerPhone: '',
    itemsList: [initialItem],
    subtotal: 0, 
    deliveryAddress: '',
    deliveryZoneId: null,
    deliveryCost: 0,
    total: 0, 
    paymentMethod: PaymentMethods.CASH,
    status: OrderStatus.NEW, 
    folioWeb: '',
    notes: '',
    paidWith: null,
    changeGiven: null,
    deliveryPersonPays: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const calculateItemTotal = (quantity, unitPrice) => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(unitPrice) || 0;
    return q * p;
  };
  
  const calculateOrderSubtotal = useCallback((itemsList) => {
    return itemsList.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
  }, []);

  const calculateGrandTotal = useCallback((subtotal, deliveryCost) => {
    return (parseFloat(subtotal) || 0) + (parseFloat(deliveryCost) || 0);
  }, []);


  useEffect(() => {
    if (order) {
      const items = (order.itemsList && order.itemsList.length > 0 
        ? order.itemsList 
        : [{ ...initialItem, id: `ITEM_ORD_${order.id}_${Date.now()}` }]
      ).map(item => ({...item, itemTotal: calculateItemTotal(item.quantity, item.unitPrice)}));
      
      const subtotal = calculateOrderSubtotal(items);
      const deliveryCost = Number(order.deliveryCost) || 0;
      const total = calculateGrandTotal(subtotal, deliveryCost);

      setFormData({
        id: order.id,
        customerName: order.customerName || '',
        customerPhone: order.customerPhone || '',
        deliveryAddress: order.deliveryAddress || '',
        deliveryZoneId: order.deliveryZoneId || null,
        deliveryCost: deliveryCost,
        itemsList: items,
        subtotal: subtotal,
        total: total, 
        paymentMethod: order.paymentMethod || PaymentMethods.CASH,
        status: order.status || OrderStatus.NEW, 
        folioWeb: order.folioWeb || '',
        notes: order.notes || '',
        date: order.date,
        paidWith: order.paidWith !== null ? Number(order.paidWith) : null,
        changeGiven: order.changeGiven !== null ? Number(order.changeGiven) : null,
        deliveryPersonPays: order.deliveryPersonPays !== null ? Number(order.deliveryPersonPays) : null,
        preparationStartTime: order.preparationStartTime,
        preparationTimeElapsed: order.preparationTimeElapsed,
        realTotal: order.realTotal, 
        totalAmount: order.totalAmount, 
      });
    } else {
      setFormData(initialFormData);
    }
  }, [order, calculateOrderSubtotal, calculateGrandTotal, initialItem]);

  const handleFormChange = (name, value) => {
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === "deliveryZoneId") {
        const selectedZone = deliveryZones.find(zone => zone.id === value);
        newFormData.deliveryCost = selectedZone ? Number(selectedZone.cost) : 0;
      }
      
      const subtotal = calculateOrderSubtotal(newFormData.itemsList);
      newFormData.subtotal = subtotal;
      newFormData.total = calculateGrandTotal(subtotal, newFormData.deliveryCost);
      return newFormData;
    });
  };
  
  const handleItemsListChange = (newItemsList) => {
    setFormData(prev => {
      const updatedItems = newItemsList.map(item => ({
        ...item,
        itemTotal: calculateItemTotal(item.quantity, item.unitPrice)
      }));
      const subtotal = calculateOrderSubtotal(updatedItems);
      const total = calculateGrandTotal(subtotal, prev.deliveryCost);
      return {
        ...prev,
        itemsList: updatedItems,
        subtotal: subtotal,
        total: total,
      };
    });
  };

  const addItem = () => {
    setFormData(prev => {
      const newItemsList = [...prev.itemsList, { ...initialItem, id: `ITEM_${Date.now()}_${prev.itemsList.length}` }];
      const subtotal = calculateOrderSubtotal(newItemsList.map(item => ({...item, itemTotal: calculateItemTotal(item.quantity, item.unitPrice)})));
      const total = calculateGrandTotal(subtotal, prev.deliveryCost);
      return {
        ...prev,
        itemsList: newItemsList,
        subtotal: subtotal,
        total: total
      };
    });
  };

  const removeItem = (index) => {
    if (formData.itemsList.length <= 1) return; 
    setFormData(prev => {
      const newItemsList = prev.itemsList.filter((_, i) => i !== index);
      const subtotal = calculateOrderSubtotal(newItemsList.map(item => ({...item, itemTotal: calculateItemTotal(item.quantity, item.unitPrice)})));
      const total = calculateGrandTotal(subtotal, prev.deliveryCost);
      return {
        ...prev,
        itemsList: newItemsList,
        subtotal: subtotal,
        total: total
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || formData.total < 0 || formData.itemsList.some(item => !item.name || item.quantity <= 0 || item.unitPrice < 0)) {
      alert("Por favor, complete todos los campos correctamente, incluyendo detalles de los productos y un costo de envío no negativo.");
      return;
    }
    const productDetailsString = generateProductDetailsString(formData.itemsList);
    const payload = {
      ...formData,
      productDetails: productDetailsString,
      realTotal: formData.total, 
      totalAmount: formData.subtotal, 
    };
    onSave(payload);
  };

  const handlePrintTicket = () => {
    if (order) { 
      printFullTicket(order);
    }
  };

  if (!isOpen) return null;

  const modalTitle = (isDetailView || isHistoryView) ? `Detalles del Pedido ${formData.id ? formData.id.substring(0,8) : ''}` : (order ? 'Editar Pedido' : 'Nuevo Pedido');
  const modalDescription = (isDetailView || isHistoryView) ? `Información detallada del pedido.` : (order ? `Actualiza los detalles del pedido ${formData.id ? formData.id.substring(0,8) : ''}.` : 'Completa los detalles del nuevo pedido.');
  const isEditable = !isDetailView && !isHistoryView;

  const currentDisplayOrder = isEditable ? formData : order;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="gradient-bg rounded-xl shadow-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-transparent border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{modalTitle}</CardTitle>
            <CardDescription className="text-white/80">
              {modalDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isEditable ? (
                <OrderForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  onItemsChange={handleItemsListChange}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  isEditable={isEditable}
                  deliveryZones={deliveryZones}
                />
              ) : (
                <OrderViewDetails order={currentDisplayOrder} />
              )}
              <CardFooter className="flex justify-between items-center p-0 pt-6">
                 <div>
                  {(isHistoryView || (isDetailView && order && order.status !== OrderStatus.NEW)) && (
                    <Button type="button" variant="outline" onClick={handlePrintTicket} className="text-white border-white/50 hover:bg-white/10 hover:text-white">
                      <Printer className="mr-2 h-4 w-4" /> Imprimir Ticket
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  {isDetailView && !isHistoryView && order?.status === OrderStatus.NEW && onAccept && onCancel && (
                    <>
                      <Button type="button" variant="destructive" onClick={() => onCancel(order)} className="hover-scale">
                        Cancelar Pedido
                      </Button>
                      <Button type="button" onClick={() => onAccept(order)} className="bg-green-500 hover:bg-green-600 text-white hover-scale">
                        Aceptar Pedido
                      </Button>
                    </>
                  )}
                  {isEditable && (
                    <>
                      <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">Cancelar</Button>
                      <Button type="submit" className="bg-white text-primary hover:bg-white/90 shadow-lg hover-scale">
                        {order ? 'Guardar Cambios' : 'Crear Pedido'}
                      </Button>
                    </>
                  )}
                  {((isDetailView && order?.status !== OrderStatus.NEW && !isHistoryView) || isHistoryView) && (
                      <Button type="button" variant="outline" onClick={onClose} className="text-white border-white/50 hover:bg-white/10 hover:text-white">
                        Cerrar
                      </Button>
                  )}
                </div>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OrderModal;
