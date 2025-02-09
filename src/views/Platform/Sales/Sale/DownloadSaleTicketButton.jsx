"use client";

import { getSale } from "@/src/controllers/platform/sale/sale";
import { getSaleItemsFromSale } from "@/src/controllers/platform/sale_item/sale_item";

import { useState } from "react";

function DownloadSaleTicketButton({ saleId }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadSaleTicketRoute = async (id) => {
    try {
      const sale = await getSale(id);
      const saleItems = await getSaleItemsFromSale(id);

      const totalSaleAmount = saleItems.reduce((total, item) => {
        const saleItemTotal = item.sale_item_total;

        if (!isNaN(saleItemTotal)) {
          return total + saleItemTotal;
        } else {
          return total;
        }
      }, 0);

      const saleItemsParam = encodeURIComponent(JSON.stringify(saleItems));

      const response = await fetch(
        `/api/sales/sale_ticket?saleItems=${saleItemsParam}&totalSaleAmount=${totalSaleAmount}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `SalesTicket_${id}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <h1>Sale Ticket</h1>
      <button
        onClick={handleDownloadSaleTicketRoute(saleId)}
        disabled={loading}
      >
        {loading ? "Generating PDF..." : "Generate Sale Ticket PDF"}
      </button>
    </div>
  );
}

export default DownloadSaleTicketButton;
