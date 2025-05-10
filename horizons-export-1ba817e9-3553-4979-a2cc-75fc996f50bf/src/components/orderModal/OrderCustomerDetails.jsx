
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const OrderCustomerDetails = ({ isEditing, editedOrder, handleInputChange }) => {
  return (
    <>
      <div>
        <Label htmlFor="customerName" className="text-lg font-semibold text-sky-400">Cliente</Label>
        {isEditing ? (
          <Input id="customerName" name="customerName" value={editedOrder.customerName} onChange={handleInputChange} className="mt-1 bg-gray-700 border-gray-600 focus:ring-sky-500 focus:border-sky-500" />
        ) : (
          <p className="text-lg mt-1">{editedOrder.customerName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="customerPhone" className="text-lg font-semibold text-sky-400">Teléfono</Label>
        {isEditing ? (
          <Input id="customerPhone" name="customerPhone" value={editedOrder.customerPhone} onChange={handleInputChange} className="mt-1 bg-gray-700 border-gray-600 focus:ring-sky-500 focus:border-sky-500" />
        ) : (
          <p className="text-lg mt-1">{editedOrder.customerPhone || 'No especificado'}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="deliveryAddress" className="text-lg font-semibold text-sky-400">Dirección de Entrega</Label>
        {isEditing ? (
          <Textarea id="deliveryAddress" name="deliveryAddress" value={editedOrder.deliveryAddress} onChange={handleInputChange} className="mt-1 bg-gray-700 border-gray-600 focus:ring-sky-500 focus:border-sky-500" />
        ) : (
          <p className="text-lg mt-1 whitespace-pre-wrap">{editedOrder.deliveryAddress || 'No especificada'}</p>
        )}
      </div>
    </>
  );
};

export default OrderCustomerDetails;
