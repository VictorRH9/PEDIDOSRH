
import { OrderStatus, PaymentMethods } from '@/constants/order';

export const calculateSubtotal = (itemsList) => {
  if (!itemsList || !Array.isArray(itemsList)) return 0;
  return itemsList.reduce((sum, item) => sum + (Number(item.itemTotal) || 0), 0);
};

export const calculateRealTotal = (subtotal, deliveryCost) => {
  return (Number(subtotal) || 0) + (Number(deliveryCost) || 0);
};

export const generateProductDetailsString = (itemsList) => {
  if (!itemsList || itemsList.length === 0) return "N/A";
  return itemsList.map(item => `${item.quantity}x ${item.name}`).join(', ');
};

export const mapOrderFromDb = (dbOrder) => {
  const subtotal = calculateSubtotal(dbOrder.items_list);
  // real_total from DB should be prioritized if it exists, otherwise calculate.
  const realTotal = dbOrder.real_total !== null && dbOrder.real_total !== undefined 
                    ? Number(dbOrder.real_total) 
                    : calculateRealTotal(subtotal, dbOrder.delivery_cost);
  
  return {
    id: dbOrder.id,
    customerName: dbOrder.customer_name,
    customerPhone: dbOrder.customer_phone,
    deliveryAddress: dbOrder.delivery_address,
    deliveryZoneId: dbOrder.delivery_zone_id,
    deliveryCost: Number(dbOrder.delivery_cost) || 0,
    itemsList: dbOrder.items_list || [],
    subtotal: subtotal, // Calculated subtotal of products
    totalAmount: subtotal, // total_amount in DB is usually the subtotal.
    realTotal: realTotal, // real_total in DB is the final total including delivery.
    paymentMethod: dbOrder.payment_method || PaymentMethods.CASH,
    paymentStatus: dbOrder.payment_status || 'Pendiente',
    status: dbOrder.order_status || OrderStatus.NEW,
    notes: dbOrder.notes,
    productDetails: generateProductDetailsString(dbOrder.items_list),
    date: dbOrder.created_at, 
    updatedAt: dbOrder.updated_at,
    paidWith: dbOrder.paid_with !== null && dbOrder.paid_with !== undefined ? Number(dbOrder.paid_with) : null,
    changeGiven: dbOrder.change_given !== null && dbOrder.change_given !== undefined ? Number(dbOrder.change_given) : null,
    deliveryPersonPays: dbOrder.delivery_person_pays !== null && dbOrder.delivery_person_pays !== undefined ? Number(dbOrder.delivery_person_pays) : null,
    userId: dbOrder.user_id,
    // Ensure preparation_start_time and preparation_time_elapsed_ms are handled if they exist in dbOrder
    preparationStartTime: dbOrder.preparation_start_time ? new Date(dbOrder.preparation_start_time).getTime() : null,
    preparationTimeElapsed: dbOrder.preparation_time_elapsed_ms ? Number(dbOrder.preparation_time_elapsed_ms) : 0,
  };
};
