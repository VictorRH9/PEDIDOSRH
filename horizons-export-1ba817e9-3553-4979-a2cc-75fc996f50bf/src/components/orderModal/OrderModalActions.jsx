
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog.jsx";
import { Printer, Send, CheckCircle, DollarSign } from 'lucide-react';
import { OrderStatus } from '@/constants/order';


const OrderModalActions = ({ 
  editedOrder, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  onSendOrder, 
  onMarkAsPaid, 
  printTicket,
  canEdit,
  canSend,
  canMarkPaid,
  onClose
}) => {
  return (
    <>
      <div className="flex gap-2 flex-wrap justify-start">
        <Button variant="outline" onClick={() => printTicket(editedOrder, 'order')} className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-gray-900">
          <Printer size={18} className="mr-2" /> Imprimir Pedido
        </Button>
        {editedOrder.status === OrderStatus.SHIPPED && (
           <Button variant="outline" onClick={() => printTicket(editedOrder, 'delivery')} className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-gray-900">
            <Printer size={18} className="mr-2" /> Imprimir Envío
          </Button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
        {isEditing ? (
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle size={18} className="mr-2" /> Guardar Cambios
          </Button>
        ) : (
          canEdit && <Button onClick={() => setIsEditing(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">Editar Pedido</Button>
        )}
        {canSend && !isEditing && (
          <Button onClick={() => onSendOrder(editedOrder)} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send size={18} className="mr-2" /> {editedOrder.status === OrderStatus.DELIVERED ? 'Reenviar Pedido' : 'Enviar Pedido'}
          </Button>
        )}
        {canMarkPaid && !isEditing && (
          <Button onClick={() => onMarkAsPaid(editedOrder)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <DollarSign size={18} className="mr-2" /> Marcar como Pagado
          </Button>
        )}
        <DialogClose asChild>
          <Button variant="ghost" onClick={onClose} className="hover:bg-gray-700">Cerrar</Button>
        </DialogClose>
      </div>
    </>
  );
};

export default OrderModalActions;
