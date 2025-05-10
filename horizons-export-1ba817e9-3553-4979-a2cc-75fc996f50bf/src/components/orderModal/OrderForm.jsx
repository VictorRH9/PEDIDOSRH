
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderItemsTable from './OrderItemsTable';
import { OrderStatus, PaymentMethods } from "@/constants/order";

const OrderForm = ({ formData, onFormChange, onItemsChange, onAddItem, onRemoveItem, isEditable }) => {
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    onFormChange(name, type === 'number' ? parseFloat(value) : value);
  };

  const handleSelectChange = (name, value) => {
    onFormChange(name, value);
  };

  const handleItemUpdate = (index, itemData) => {
    const newItemsList = [...formData.itemsList];
    newItemsList[index] = itemData;
    onItemsChange(newItemsList);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="customerName" className="text-white/90">Nombre del Cliente</Label>
        <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} required disabled={!isEditable} className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
      </div>
      <div>
        <Label htmlFor="customerPhone" className="text-white/90">Número de Celular</Label>
        <Input id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} disabled={!isEditable} className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white" />
      </div>
      
      <div>
        <Label className="text-white/90">Productos del Pedido</Label>
        <OrderItemsTable
          items={formData.itemsList}
          onUpdateItem={handleItemUpdate}
          onRemoveItem={onRemoveItem}
          onAddItem={onAddItem}
          isEditable={isEditable}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentMethod" className="text-white/90">Forma de Pago</Label>
          <Select name="paymentMethod" value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)} disabled={!isEditable}>
            <SelectTrigger id="paymentMethod" className="mt-1 w-full bg-white/20 text-white border-white/30 focus:bg-white/30 focus:border-white [&>span]:text-white">
              <SelectValue placeholder="Seleccionar forma de pago" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {Object.values(PaymentMethods).map(method => (
                <SelectItem key={method} value={method} className="hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-primary">
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="total" className="text-white/90">Total Parcial (MXN$)</Label>
          <Input id="total" name="total" type="number" step="0.01" value={formData.total.toFixed(2)} readOnly disabled className="mt-1 bg-white/20 text-white placeholder-white/50 border-white/30 focus:bg-white/30 focus:border-white font-bold" />
        </div>
      </div>

      {isEditable && (
        <div>
          <Label htmlFor="status" className="text-white/90">Estado</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger id="status" className="mt-1 w-full bg-white/20 text-white border-white/30 focus:bg-white/30 focus:border-white [&>span]:text-white">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {Object.values(OrderStatus).map(statusVal => (
                <SelectItem key={statusVal} value={statusVal} className="hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-primary">
                  {statusVal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
