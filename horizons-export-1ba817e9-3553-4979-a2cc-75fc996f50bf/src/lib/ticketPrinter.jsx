
export const printSimpleTicket = (order) => {
  const itemsListString = order.itemsList && order.itemsList.length > 0 
    ? order.itemsList.map(item => `${item.quantity}x ${item.name}`).join('\n')
    : order.productDetails;

  const ticketContent = `
CARNES RH
--------------------------------
FOLIO: ${order.id}
FECHA: ${new Date(order.date).toLocaleDateString()} ${new Date().toLocaleTimeString()}
--------------------------------
PRODUCTOS:
${itemsListString}
--------------------------------
CLIENTE: ${order.customerName}
${order.customerPhone ? `TEL: ${order.customerPhone}` : ''}
`;
  printToThermalPrinter(ticketContent);
};

export const printFullTicket = (order) => {
  const itemsListString = order.itemsList && order.itemsList.length > 0 
    ? order.itemsList.map(item => {
        const name = item.name.padEnd(20, ' ').substring(0,20); // Adjust padding as needed
        const qty = String(item.quantity).padStart(3);
        const price = `MXN$${item.unitPrice.toFixed(2)}`.padStart(10);
        const total = `MXN$${item.itemTotal.toFixed(2)}`.padStart(10);
        return `${qty} ${name} ${price} ${total}`;
      }).join('\n')
    : order.productDetails;
  
  const itemsHeader = order.itemsList && order.itemsList.length > 0
    ? `CANT PRODUCTO             P.UNIT.    TOTAL\n----------------------------------------`
    : 'PRODUCTOS:';


  const ticketContent = `
      CARNES RH
--------------------------------
FOLIO PEDIDO: ${order.id}
FOLIO WEB: ${order.folioWeb || 'N/A'}
FECHA: ${new Date(order.date).toLocaleDateString()} ${new Date().toLocaleTimeString()}
--------------------------------
CLIENTE: ${order.customerName}
TEL: ${order.customerPhone || 'N/A'}
--------------------------------
${itemsHeader}
${itemsListString}
--------------------------------
FORMA DE PAGO: ${order.paymentMethod}
TOTAL PARCIAL: MXN$${order.total.toFixed(2)}
${order.realTotal !== null ? `TOTAL REAL:    MXN$${order.realTotal.toFixed(2)}` : ''}
${order.paidWith !== null ? `PAGA CON:      MXN$${order.paidWith.toFixed(2)}` : ''}
${order.changeGiven !== null ? `CAMBIO:        MXN$${order.changeGiven.toFixed(2)}` : ''}
--------------------------------
${order.status === 'Pagado' && order.deliveryManCarriesChange && order.changeGiven > 0 && order.realTotal !== null ? 
`LIQUIDACIÓN REPARTIDOR: MXN$${(order.realTotal + order.changeGiven).toFixed(2)}` : ''}
--------------------------------
¡GRACIAS POR SU COMPRA!
`;
  printToThermalPrinter(ticketContent);
};

const printToThermalPrinter = (content) => {
  const printWindow = window.open('', '_blank', 'width=302,height=500'); 
  if (!printWindow) {
    alert("No se pudo abrir la ventana de impresión. Por favor, deshabilite el bloqueador de pop-ups.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body { 
            font-family: 'Courier New', Courier, monospace; 
            font-size: 10px; 
            width: 72mm; 
            margin: 2mm;
            padding: 0;
            color: #000;
          }
          pre { 
            white-space: pre-wrap; 
            word-wrap: break-word;
            margin: 0;
            padding: 0;
            line-height: 1.2;
          }
          h3 {
            text-align: center;
            margin: 5px 0;
          }
          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 3px 0;
          }
        </style>
      </head>
      <body>
        <pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        <script>
          window.onload = function() {
            window.print();
            // window.close(); 
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
