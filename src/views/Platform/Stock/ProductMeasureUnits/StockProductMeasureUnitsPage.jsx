"use client";

import { getProductMeasureUnits, deleteProductMeasureUnit } from "@/src/controllers/platform/product_measure_unit/product_measure_unit";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";

export default function StockProductMeasureUnitsPage() {
  const { user } = useUserInfoContext();

  const [productMeasureUnitsNames, setProductMeasureUnitsNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchProductMeasureUnitsNames() {
      try {
        const names = await getProductMeasureUnits();
        setProductMeasureUnitsNames(names);
      } catch (error) {
        console.error("Error fetching product measure units:", error.message);
      }
    }
    fetchProductMeasureUnitsNames();
  }, []);

  const handleProductMeasureUnit = async (id) => {
    try {
      await deleteProductMeasureUnit(id);
      setProductMeasureUnitsNames((prevNames) =>
        prevNames.filter(
          (product_measure_unit) => product_measure_unit.id !== id
        )
      );
      showNotification("¡Unidad de medida eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete the measure unit:", error.message);
    }
  };

  const userHasAccess =
    user.user_role_id === 1 ||
    user.user_role_id === 2 ||
    user.user_role_id === 3 ||
    user.user_role_id === 4 ||
    user.user_role_id === 6 ||
    user.user_role_id === 7;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar las unidades de medida por el término de búsqueda
  const filteredMeasureUnits = productMeasureUnitsNames.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title={"Unidades de medida"}
        goBackRoute={`/platform/stock/stock_products`}
        goBackText={"Volver a la lista de productos"}
      />

      <SearchInput
        placeholder="Buscar unidad de medida..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <ListWithTitle
        title=""
        hasAdd={userHasAccess}
        buttonAddRoute={userHasAccess ? `/platform/stock/stock_product_measure_units/new` : null}
        items={filteredMeasureUnits}
        buttonShowRoute={(id) => `/platform/stock/stock_product_measure_units/${id}`}
        hasEdit={userHasAccess}
        buttonEditRoute={(id) =>
          userHasAccess ? `/platform/stock/stock_product_measure_units/${id}/edit` : null
        }
        hasDelete={userHasAccess}
        buttonDeleteRoute={handleProductMeasureUnit}
        columnName="name"
        confirmModalText="¿Estás seguro de que deseas eliminar esta unidad de medida?"
        hasShow={(id) => true}
      />
    </>
  );
}
