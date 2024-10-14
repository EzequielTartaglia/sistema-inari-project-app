"use client";

import { deleteSale, getSale, getSales } from "@/src/models/platform/sale/sale";
import { getPlatformUsers } from "@/src/models/platform/platform_user/platform_user";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import PageHeader from "@/components/page_formats/PageHeader";
import TableOfSales from "@/components/tables/TableOfSales";
import SearchInput from "@/components/SearchInput";
import formatDate from "@/src/helpers/formatDate";
import CreateSaleButton from "./CreateSaleButton";
import { getSaleItemsFromSale } from "@/src/models/platform/sale_item/sale_item";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchSalesAndUsers() {
      try {
        const [fetchedSales, fetchedUsers] = await Promise.all([
          getSales(),
          getPlatformUsers(),
        ]);

        const sortedSales = fetchedSales.sort(
          (a, b) => new Date(b.sale_date) - new Date(a.sale_date)
        );

        setSales(sortedSales);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching sales or users:", error.message);
      }
    }
    fetchSalesAndUsers();
  }, []);

  const handleDeleteSale = async (id) => {
    try {
      await deleteSale(id);
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
      showNotification("¡Venta eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete sale:", error.message);
    }
  };


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
          method: 'GET',
        }
      );
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SalesTicket_${id}.pdf`);
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
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = ["id", "sale_date", "user_name", "sale_total", "is_closed"];

  const columnAliases = {
    id: "Venta",
    sale_date: "Fecha de venta",
    user_name: "Vendedor",
    sale_total: "Total de venta",
    is_closed: "¿Cerrada?",
  };

  const filteredData = sales
    .filter((sale) => {
      const saleUser = users.find((user) => user.id === sale.user_id);
      if (!saleUser) return false;

      const fullName =
        `${saleUser.first_name} ${saleUser.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .map((sale) => {
      const saleUser = users.find((user) => user.id === sale.user_id);
      const fullName = saleUser
        ? `${saleUser.first_name} ${saleUser.last_name}`
        : "N/A";

      return {
        ...sale,
        user_name: fullName,
        sale_date: formatDate(sale.sale_date),
        is_closed: sale.is_closed ? "Sí" : "No",
        sale_total: `$ ${sale.sale_total.toFixed(2)}`,
      };
    });

  const hasShow = (item) => {
    if (item.is_closed === "Sí") {
      return true;
    } else {
      return false;
    }
  };

  const hasEdit = (item) => {
    if (item.is_closed === "No") {
      return true;
    } else {
      return false;
    }
  };

  const hasApprove = (item) => {
    return;
  };

  const hasDownloadSaleTicket = (item) => {
    if (item.is_closed === "Sí") {
      return true;
    } else {
      return false;
    }
  };

  const hasDelete = (item) => {
    return;
  };

  

  const userHasAccess =
    user.user_role_id === 1 ||
    user.user_role_id === 2 ||
    user.user_role_id === 4 ||
    user.user_role_id === 6;

  return (
    <>
      <PageHeader
        title={"Ventas"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <SearchInput
        placeholder="Buscar venta por nombre del vendedor..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <TableOfSales
        title={"Ventas"}
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        buttonShowRoute={(id) => `/platform/sales/${id}`}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/platform/sales/${id}`}
        hasDelete={hasDelete}
        buttonDeleteRoute={handleDeleteSale}
        hasApprove={hasApprove}
        hasDownloadSaleTicket={hasDownloadSaleTicket}
        buttonDownloadSaleTicketRoute={handleDownloadSaleTicketRoute}
        confirmModalText={"¿Estás seguro de que deseas eliminar esta venta?"}
        customButton={<CreateSaleButton />}
      />
    </>
  );
}
