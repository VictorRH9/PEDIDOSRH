
export const printTicket = (order, type = 'simple') => {
  const businessName = "CARNES RH";
  const now = new Date();
  const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  let ticketContent = `
    <div style="font-family: 'Courier New', Courier, monospace; width: 300px; font-size: 12px; margin: 0 auto; padding: 10px; border: 1px solid #ccc;">
      <div style="text-align: center; margin-bottom: 10px;">
        <h2 style="margin: 0; font-size: 16px;">${businessName}</h2>
      </div>
      <p><strong>Folio Pedido:</strong> ${order.id}</p>
      <p><strong>Fecha:</strong> ${formattedDate}</p>
      <hr style="border-top: 1px dashed #000; margin: 10px 0;">
      <p><strong>Cliente:</strong> ${order.customerName}</p>
      ${order.customerPhone ? `<p><strong>Teléfono:</strong> ${order.customerPhone}</p>` : ''}
      <hr style="border-top: 1px dashed #000; margin: 10px 0;">
      <h3 style="text-align: center; margin: 5px 0; font-size: 14px;">PRODUCTOS</h3>
      <div style="margin-bottom: 10px;">
        ${order.productDetails.split('\n').map(line => `<p style="margin: 2px 0;">- ${line}</p>`).join('')}
      </div>
  `;

  if (type === 'full') {
    ticketContent += `
      <hr style="border-top: 1px dashed #000; margin: 10px 0;">
      <p><strong>Forma de Pago:</strong> ${order.paymentMethod}</p>
      ${order.webFolio ? `<p><strong>Folio Web:</strong> ${order.webFolio}</p>` : ''}
      <div style="text-align: right; margin-top: 10px;">
        <p style="margin: 2px 0;"><strong>Subtotal:</strong> MXN$ ${order.total.toFixed(2)}</p>
        ${order.realTotal !== null ? `<p style="margin: 2px 0;"><strong>Total Real:</strong> MXN$ ${order.realTotal.toFixed(2)}</p>` : ''}
        ${order.paidWith !== null ? `<p style="margin: 2px 0;"><strong>Pagó con:</strong> MXN$ ${order.paidWith.toFixed(2)}</p>` : ''}
        ${order.changeGiven !== null ? `<p style="margin: 2px 0;"><strong>Cambio:</strong> MXN$ ${order.changeGiven.toFixed(2)}</p>` : ''}
      </div>
    `;
  } else { // simple ticket
     ticketContent += `
      <hr style="border-top: 1px dashed #000; margin: 10px 0;">
      <p style="text-align: center; font-style: italic;">** Ticket de Preparación **</p>
     `;
  }
  
  ticketContent += `
      <hr style="border-top: 1px dashed #000; margin: 10px 0;">
      <p style="text-align: center; font-size: 10px; margin-top: 15px;">¡Gracias por su preferencia!</p>
    </div>
  `;

  const printWindow = window.open('', '_blank', 'width=320,height=600');
  if (printWindow) {
    printWindow.document.write('<html><head><title>Ticket</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @media print {
        @page { 
          size: 80mm auto; /* Approximate for 80mm thermal roll */
          margin: 2mm; 
        }
        body { 
          width: 76mm; /* Content width */
          margin: 0;
          padding: 0;
          font-family: 'Courier New', Courier, monospace;
          font-size: 10pt; /* Adjust as needed */
        }
        div {
          width: 100% !important;
        }
        h2, h3, p { margin: 0.5mm 0; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(ticketContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => { 
      printWindow.print();
      printWindow.close();
    }, 250);
  } else {
    alert("No se pudo abrir la ventana de impresión. Por favor, deshabilite los bloqueadores de ventanas emergentes.");
  }
};
