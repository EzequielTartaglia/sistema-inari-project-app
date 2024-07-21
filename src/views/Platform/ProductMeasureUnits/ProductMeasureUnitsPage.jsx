"use client";

import { getProductMeasureUnits,deleteProductMeasureUnit } from "@/src/models/platform/product_measure_unit/product_measure_unit";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";

export default function ProductMeasureUnitsPage() {
  const { user } = useUserInfoContext();

  const [productMeasureUnitsNames, setProductMeasureUnitsNames] = useState([]);
  
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchProductMeasureUnitsNames() {
      try {
        const names = await getProductMeasureUnits();
        setProductMeasureUnitsNames(names);
      } catch (error) {
        console.error(
          "Error fetching product measure units:",
          error.message
        );
      }
    }
    fetchProductMeasureUnitsNames();
  }, []);

  const handleProductMeasureUnit = async (id) => {
    try {
      await deleteProductMeasureUnit(id);
      setProductMeasureUnitsNames((prevNames) =>
        prevNames.filter((product_measure_unit) => product_measure_unit.id !== id)
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
  user.user_role_id === 6;

  return (
    <>
      <PageHeader title={"Unidades de medida"} 
      goBackRoute={`/platform/products`}
      goBackText={"Volver a la lista de productos"}/>

        <ListWithTitle
          title=""
          hasAdd={userHasAccess}
          buttonAddRoute={userHasAccess
              ? `/platform/product_measure_units/new`
              : null
          }
          items={productMeasureUnitsNames}
          buttonShowRoute={(id) => `/platform/product_measure_units/${id}`}
          hasEdit={userHasAccess}
          buttonEditRoute={(id) => (userHasAccess) ? `/platform/product_measure_units/${id}/edit` : null}
          hasDelete={userHasAccess}
          buttonDeleteRoute={handleProductMeasureUnit}
          columnName="name"
          confirmModalText="¿Estás seguro de que deseas eliminar esta unidad de medida?"
          hasShow={(id) => true}
        />
    </>
  );
}
