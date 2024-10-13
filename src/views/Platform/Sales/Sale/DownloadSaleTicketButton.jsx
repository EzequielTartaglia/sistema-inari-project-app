'use client'

import { useState } from 'react';

function DownloadSaleTicketButton() {
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setLoading(true);

    const saleItems = [
      { quantity: 2, description: "Item 1", price: 15.99 },
      { quantity: 1, description: "Item 2", price: 35.50 }
    ];
    const totalSaleAmount = saleItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const saleItemsParam = encodeURIComponent(JSON.stringify(saleItems));

    try {
      // Realiza la solicitud GET para generar el PDF
      const response = await fetch(`/api/sales/sale_ticket?saleItems=${saleItemsParam}&totalSaleAmount=${totalSaleAmount}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace para descargar el archivo PDF
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'SalesTicket.pdf'); // Nombre del archivo
        document.body.appendChild(link);
        link.click();

        // Limpia el enlace una vez que la descarga ha sido iniciada
        link.parentNode.removeChild(link);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sale Ticket</h1>
      <button onClick={handleGeneratePDF} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Generate Sale Ticket PDF'}
      </button>
    </div>
  );
}

export default DownloadSaleTicketButton;
