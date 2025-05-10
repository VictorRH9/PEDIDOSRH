
import React from 'react';
import { OrderStatus } from '@/constants/order';

const OrderDeliveryPaymentInfo = ({ editedOrder, PaymentMethods }) => {
  if (!editedOrder.deliveryDetails) return null;

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-3">
      <h4 className="text-xl font-semibold text-sky-400">Detalles de Envío/Pago</h4>
      <p><strong>Método de Pago:</strong> {PaymentMethods[editedOrder.deliveryDetails.paymentMethod.toUpperCase()] || editedOrder.deliveryDetails.paymentMethod}</p>
      {editedOrder.deliveryDetails.paymentMethod === 'cash' && (
        <>
          <p><strong>Paga con:</strong> ${parseFloat(editedOrder.deliveryDetails.cashPaidAmount).toFixed(2)}</p>
          <p><strong>Cambio a entregar:</strong> ${parseFloat(editedOrder.deliveryDetails.cashChangeAmount).toFixed(2)}</p>
          <p><strong>¿Repartidor lleva cambio?:</strong> {editedOrder.deliveryDetails.driverHasChange ? 'Sí' : 'No'}</p>
        </>
      )}
      {editedOrder.deliveryDetails.deliveryPerson && <p><strong>Repartidor:</strong> {editedOrder.deliveryDetails.deliveryPerson}</p>}
      {editedOrder.deliveryDetails.notes && <p><strong>Notas de envío:</strong> {editedOrder.deliveryDetails.notes}</p>}
      {editedOrder.totalToSettleByDriver && editedOrder.status === OrderStatus.PAID && (
        <p className="text-lg font-semibold text-orange-400">
          Total a Liquidar por Repartidor: ${parseFloat(editedOrder.totalToSettleByDriver).toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default OrderDeliveryPaymentInfo;
