
export const OrderStatus = {
  NEW: "Nuevo",
  PENDING: "Pendiente", 
  PROCESSING: "Preparando",
  READY_FOR_SHIPPING: "Listo para Enviar", 
  SHIPPED: "Enviado",
  PAID: "Pagado",
  DELIVERED: "Entregado", 
  CANCELLED: "Cancelado",
};

export const PaymentMethods = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
};

export const initialOrderItems = [
  { id: 'ITEM001', quantity: 2, name: 'Corte de Res Premium (500g)', unitPrice: 125.375, itemTotal: 250.75 },
  { id: 'ITEM002', quantity: 1, name: 'Pechuga de Pollo Orgánica (1kg)', unitPrice: 120.00, itemTotal: 120.00 },
  { id: 'ITEM003', quantity: 3, name: 'Chorizo Argentino (250g)', unitPrice: 45.00, itemTotal: 135.00 },
];

export const initialOrdersData = [
  { 
    id: 'ORD001', 
    customerName: 'Alice Wonderland', 
    customerPhone: '555-1234',
    itemsList: [
      { id: 'LI001', quantity: 2, name: 'Corte de Res Premium (500g)', unitPrice: 125.375, itemTotal: 250.75 }
    ],
    productDetails: '2x Corte de Res Premium (500g)', // Kept for simple display, itemsList is source of truth
    total: 250.75, 
    paymentMethod: PaymentMethods.CARD,
    status: OrderStatus.NEW, 
    date: '2025-05-01',
    realTotal: null,
    paidWith: null,
    changeGiven: null,
    folioWeb: null,
    deliveryManCarriesChange: false,
    preparationStartTime: null,
    preparationTimeElapsed: 0,
  },
  { 
    id: 'ORD002', 
    customerName: 'Bob The Builder', 
    customerPhone: '555-5678',
    itemsList: [
      { id: 'LI002', quantity: 1, name: 'Pechuga de Pollo Orgánica (1kg)', unitPrice: 120.00, itemTotal: 120.00 },
      { id: 'LI003', quantity: 1, name: 'Arrachera Marinada (300g)', unitPrice: 90.50, itemTotal: 90.50 }
    ],
    productDetails: '1x Pechuga de Pollo Orgánica (1kg), 1x Arrachera Marinada (300g)',
    total: 210.50, 
    paymentMethod: PaymentMethods.CASH,
    status: OrderStatus.PROCESSING, 
    date: '2025-05-02',
    realTotal: 210.50,
    paidWith: 250.00,
    changeGiven: 39.50,
    folioWeb: 'WEB678',
    deliveryManCarriesChange: true,
    preparationStartTime: Date.now() - 3600000, 
    preparationTimeElapsed: 3600000,
  },
];

export const getStatusColorClass = (status) => {
  switch (status) {
    case OrderStatus.NEW: return "bg-sky-500/20 text-sky-700 border-sky-500";
    case OrderStatus.PENDING: return "bg-yellow-500/20 text-yellow-700 border-yellow-500";
    case OrderStatus.PROCESSING: return "bg-blue-500/20 text-blue-700 border-blue-500";
    case OrderStatus.READY_FOR_SHIPPING: return "bg-indigo-500/20 text-indigo-700 border-indigo-500";
    case OrderStatus.SHIPPED: return "bg-purple-500/20 text-purple-700 border-purple-500";
    case OrderStatus.PAID: return "bg-teal-500/20 text-teal-700 border-teal-500";
    case OrderStatus.DELIVERED: return "bg-green-500/20 text-green-700 border-green-500";
    case OrderStatus.CANCELLED: return "bg-red-500/20 text-red-700 border-red-500";
    default: return "bg-gray-500/20 text-gray-700 border-gray-500";
  }
};

export const generateProductDetailsString = (itemsList) => {
  if (!itemsList || itemsList.length === 0) return 'Sin productos detallados';
  return itemsList.map(item => `${item.quantity}x ${item.name}`).join(', ');
};
