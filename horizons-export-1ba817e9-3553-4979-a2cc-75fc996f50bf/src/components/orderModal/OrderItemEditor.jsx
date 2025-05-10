
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from 'lucide-react';

const OrderItemEditor = ({ isEditing, editedOrder, products, handleItemChange, addItem, removeItem, toast }) => {
  return (
    <div>
      <Label className="text-lg font-semibold text-sky-400">Artículos</Label>
      {editedOrder.items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 mt-2 p-3 bg-gray-800 rounded-md">
          {isEditing ? (
            <>
              <Select value={item.productId} onValueChange={(value) => handleItemChange(index, 'productId', value)}>
                <SelectTrigger className="flex-grow bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-20 bg-gray-700 border-gray-600" />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400">
                <MinusCircle size={20} />
              </Button>
            </>
          ) : (
            <div className="flex-grow">
              <p className="font-medium">{item.name} <span className="text-gray-400">x {item.quantity}</span></p>
              <p className="text-sm text-gray-300">${item.price?.toFixed(2)} c/u</p>
            </div>
          )}
          <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      {isEditing && (
        <Button onClick={addItem} variant="outline" className="mt-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-gray-900">
          <PlusCircle size={18} className="mr-2" /> Agregar Artículo
        </Button>
      )}
    </div>
  );
};

export default OrderItemEditor;
