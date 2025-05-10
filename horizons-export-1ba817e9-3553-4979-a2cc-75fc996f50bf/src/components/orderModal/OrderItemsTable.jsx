
import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import OrderItemRow from './OrderItemRow';

const OrderItemsTable = ({ items, onUpdateItem, onRemoveItem, onAddItem, isEditable }) => {
  return (
    <div className="space-y-2">
      <div className="max-h-60 overflow-y-auto rounded-md border border-white/20 p-1">
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20">
              <TableHead className="text-white/80 w-2/12">Cant.</TableHead>
              <TableHead className="text-white/80 w-4/12">Producto</TableHead>
              <TableHead className="text-white/80 w-2/12 text-right">P. Unit.</TableHead>
              <TableHead className="text-white/80 w-3/12 text-right">Total</TableHead>
              {isEditable && <TableHead className="text-white/80 w-1/12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <OrderItemRow
                key={item.id || `item-${index}`} 
                item={item}
                index={index}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                isEditable={isEditable}
                canRemove={items.length > 1}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {isEditable && (
        <Button type="button" variant="outline" size="sm" onClick={onAddItem} className="mt-2 text-white border-white/30 hover:bg-white/10">
          <PlusCircle size={16} className="mr-2" /> Añadir Producto
        </Button>
      )}
    </div>
  );
};

export default OrderItemsTable;
