
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentMethods } from "@/constants/order";

const OrderViewDetails = ({ order }) => {
  if (!order) return null;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white/90">Nombre del Cliente</Label>
        <p className="text-white mt-1">{order.customerName}</p>
      </div>
      {order.customerPhone && (
        <div>
          <Label className="text-white/90">Número de Celular</Label>
          <p className="text-white mt-1">{order.customerPhone}</p>
        </div>
      )}
       {order.deliveryAddress && (
        <div>
          <Label className="text-white/90">Dirección de Entrega</Label>
          <p className="text-white mt-1">{order.deliveryAddress}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label className="text-white/90">Productos del Pedido</Label>
        <div className="max-h-60 overflow-y-auto rounded-md border border-white/20 p-1">
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/20">
                <TableHead className="text-white/80">Cant.</TableHead>
                <TableHead className="text-white/80">Producto</TableHead>
                <TableHead className="text-white/80 text-right">P. Unit.</TableHead>
                <TableHead className="text-white/80 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.itemsList.map((item, index) => (
                <TableRow key={item.id || `detail-item-${index}`} className="border-b-white/10 last:border-b-0">
                  <TableCell className="text-white/90">{item.quantity}</TableCell>
                  <TableCell className="text-white/90">{item.name}</TableCell>
                  <TableCell className="text-right text-white/90">MXN${(item.unitPrice || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right text-white/90">MXN${(item.itemTotal || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white/90">Forma de Pago</Label>
          <p className="text-white mt-1">{order.paymentMethod}</p>
        </div>
        <div>
          <Label className="text-white/90">Estado del Pedido</Label>
          <p className="text-white mt-1">{order.status}</p>
        </div>
      </div>
      
      {order.folioWeb && (
        <div>
          <Label className="text-white/90">Folio Web</Label>
          <p className="text-white mt-1">{order.folioWeb}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/20">
        <div>
          <Label className="text-white/70 text-xs">Subtotal</Label>
          <p className="text-lg font-semibold text-white">MXN${(Number(order.totalAmount) || 0).toFixed(2)}</p>
        </div>
         {order.deliveryCost > 0 && (
          <div>
            <Label className="text-white/70 text-xs">Costo de Envío</Label>
            <p className="text-lg font-semibold text-white">MXN${(Number(order.deliveryCost) || 0).toFixed(2)}</p>
          </div>
        )}
        <div>
          <Label className="text-white/70 text-xs">Total Real</Label>
          <p className="text-lg font-semibold text-orange-400">MXN${(Number(order.realTotal) || 0).toFixed(2)}</p>
        </div>
        {order.paymentMethod === PaymentMethods.CASH && (
          <>
            {order.paidWith > 0 && (
              <div>
                <Label className="text-white/70 text-xs">Pagado con</Label>
                <p className="text-lg font-semibold text-white">MXN${(Number(order.paidWith) || 0).toFixed(2)}</p>
              </div>
            )}
            {order.changeGiven > 0 && (
              <div>
                <Label className="text-white/70 text-xs">Cambio Entregado</Label>
                <p className="text-lg font-semibold text-white">MXN${(Number(order.changeGiven) || 0).toFixed(2)}</p>
              </div>
            )}
          </>
        )}
        {order.deliveryPersonPays > 0 && (
           <div>
              <Label className="text-white/70 text-xs">Repartidor Debe Liquidar</Label>
              <p className="text-lg font-semibold text-green-400">MXN${(Number(order.deliveryPersonPays) || 0).toFixed(2)}</p>
          </div>
        )}
      </div>
       {order.notes && (
        <div className="pt-4 border-t border-white/20">
          <Label className="text-white/90">Notas Adicionales</Label>
          <p className="text-white mt-1 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderViewDetails;
