
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Eye, CheckCircle, XCircle, Send, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColorClass, OrderStatus } from "@/constants/order";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OrderTimer from "@/components/OrderTimer"; // Importado

const OrderTable = ({ orders, onEdit, onCancelOrder, onAcceptOrder, onViewDetails, onSendOrder, onPrintTicket, isHistory = false }) => {
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); 

  const handleConfirm = () => {
    if (orderToConfirm && confirmAction === 'cancel' && onCancelOrder) {
      onCancelOrder(orderToConfirm);
    } else if (orderToConfirm && confirmAction === 'deleteFromHistory' && onCancelOrder) { 
      onCancelOrder(orderToConfirm.id); 
    }
    setOrderToConfirm(null);
    setConfirmAction(null);
  };
  
  const getConfirmDialogDescription = () => {
    if (!orderToConfirm) return "";
    
    const orderIdDisplay = orderToConfirm.id ? orderToConfirm.id.substring(0, 8) : 'N/A';

    if (confirmAction === 'markPaid') {
      const realTotal = orderToConfirm.realTotal !== null ? orderToConfirm.realTotal : orderToConfirm.totalAmount;
      const paidWith = orderToConfirm.paidWith !== null ? orderToConfirm.paidWith : 0;
      const change = orderToConfirm.changeGiven !== null ? orderToConfirm.changeGiven : 0;

      let description = `¿Estás seguro de que quieres marcar el pedido ${orderIdDisplay} como pagado?\n\n`;
      description += `Cliente: ${orderToConfirm.customerName}\n`;
      description += `Total del Pedido: MXN${realTotal.toFixed(2)}\n`;
      if (orderToConfirm.paymentMethod === 'Efectivo' && paidWith > 0) {
        description += `Pagado con: MXN${paidWith.toFixed(2)}\n`;
        description += `Cambio Entregado: MXN${change.toFixed(2)}\n`;
      }
      if (orderToConfirm.deliveryPersonPays && orderToConfirm.deliveryPersonPays > 0) {
        description += `Repartidor Debe Liquidar: MXN${orderToConfirm.deliveryPersonPays.toFixed(2)}`;
      }
      return description;
    }
    if (confirmAction === 'cancel') {
      return `¿Estás seguro de que quieres cancelar el pedido ${orderIdDisplay}? El pedido se moverá al historial como cancelado.`;
    }
    if (confirmAction === 'deleteFromHistory') {
      return `¿Estás seguro de que quieres eliminar permanentemente el pedido ${orderIdDisplay} del historial? Esta acción no se puede deshacer.`;
    }
    return "";
  };

  return (
    <AlertDialog open={!!orderToConfirm} onOpenChange={() => {setOrderToConfirm(null); setConfirmAction(null);}}>
      <motion.div 
        layout
        className="overflow-hidden rounded-xl glass-card shadow-2xl"
      >
        <Table>
          <TableHeader className="bg-white/30">
            <TableRow>
              <TableHead className="text-white font-semibold">ID Pedido</TableHead>
              <TableHead className="text-white font-semibold">Cliente</TableHead>
              <TableHead className="text-white font-semibold text-center">Detalles</TableHead>
              <TableHead className="text-white font-semibold text-right">Total</TableHead>
              <TableHead className="text-white font-semibold text-center">Estado</TableHead>
              <TableHead className="text-white font-semibold text-center">Fecha</TableHead>
              <TableHead className="text-white font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover-scale border-b border-white/10 last:border-b-0"
                  >
                    <TableCell className="font-medium text-white">{order.id.substring(0,8)}</TableCell>
                    <TableCell className="text-white">{order.customerName}</TableCell>
                    <TableCell className="text-center text-white text-xs">{order.productDetails || `${order.itemsList.length} artículo(s)`}</TableCell>
                    <TableCell className="text-right text-white">MXN${(order.realTotal !== null ? order.realTotal : order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColorClass(order.status)}`}>
                          {order.status}
                        </span>
                        {(order.status === OrderStatus.PROCESSING || order.status === OrderStatus.PREPARING) && (
                          <OrderTimer 
                            startTime={order.preparationStartTime} 
                            initialElapsed={order.preparationTimeElapsed}
                            isActive={true} 
                          />
                        )}
                         {(order.status !== OrderStatus.PROCESSING && order.status !== OrderStatus.PREPARING) && order.preparationTimeElapsed > 0 && (
                           <OrderTimer 
                            startTime={null} 
                            initialElapsed={order.preparationTimeElapsed}
                            isActive={false} 
                          />
                         )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-white">{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {isHistory ? (
                        <>
                          {onViewDetails && (
                             <Button variant="ghost" size="sm" className="text-sky-300 hover:text-sky-100 p-1" onClick={() => onViewDetails(order)}>
                               <Eye className="h-4 w-4" />
                             </Button>
                          )}
                          {(order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) && onAcceptOrder && ( 
                             <Button variant="outline" size="sm" className="text-green-300 border-green-300 hover:bg-green-500/20 hover:text-green-100 p-1" onClick={() => {setOrderToConfirm(order); setConfirmAction('markPaid');}}>
                                Marcar Pagado
                              </Button>
                          )}
                          {order.status === OrderStatus.CANCELLED && onCancelOrder && ( 
                             <Button variant="destructive-outline" size="sm" className="p-1" onClick={() => {setOrderToConfirm(order); setConfirmAction('deleteFromHistory');}}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          )}
                           {onPrintTicket && (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.PAID) && (
                               <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-200 p-1" onClick={() => onPrintTicket(order)}>
                                   <Printer className="h-4 w-4" />
                               </Button>
                           )}
                        </>
                      ) : (
                        <>
                          {order.status === OrderStatus.NEW && onViewDetails && onAcceptOrder && onCancelOrder && (
                            <>
                              <Button variant="ghost" size="sm" className="text-sky-300 hover:text-sky-100 p-1" onClick={() => onViewDetails(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-200 p-1" onClick={() => onAcceptOrder(order)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-200 p-1" onClick={() => {setOrderToConfirm(order); setConfirmAction('cancel');}}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {(order.status === OrderStatus.PROCESSING || order.status === OrderStatus.PREPARING) && onSendOrder && (
                            <>
                              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-200 p-1" onClick={() => onPrintTicket && onPrintTicket(order)}>
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-200 p-1" onClick={() => onSendOrder(order)}>
                                <Send className="h-4 w-4 mr-1" /> Enviar
                              </Button>
                            </>
                          )}
                          {onEdit && (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.PAID && order.status !== OrderStatus.SHIPPED) && (
                             <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 p-1" onClick={() => onEdit(order)}>
                               <Edit className="h-4 w-4" />
                             </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white/80 py-10">
                    No se encontraron pedidos.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
      {orderToConfirm && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
                {confirmAction === 'cancel' && 'Confirmar Cancelación'}
                {confirmAction === 'deleteFromHistory' && 'Confirmar Eliminación Permanente'}
                {confirmAction === 'markPaid' && 'Confirmar Pago'}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {getConfirmDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setOrderToConfirm(null); setConfirmAction(null);}}>No</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (confirmAction === 'markPaid' && onAcceptOrder) { 
                    onAcceptOrder(orderToConfirm.id); 
                } else {
                    handleConfirm();
                }
                setOrderToConfirm(null); 
                setConfirmAction(null);
              }}
              className={confirmAction === 'cancel' || confirmAction === 'deleteFromHistory' ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {confirmAction === 'cancel' && 'Sí, Cancelar Pedido'}
              {confirmAction === 'deleteFromHistory' && 'Sí, Eliminar Permanentemente'}
              {confirmAction === 'markPaid' && 'Sí, Marcar como Pagado'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default OrderTable;
