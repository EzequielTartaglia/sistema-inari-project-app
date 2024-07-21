"use client";

import { getProductCategories, deleteProductCategory } from "@/src/models/platform/product_category/product_category";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";

export default function ProductCategoriesPage() {
  const { user } = useUserInfoContext();

  const [productCategoriesNames, setProductCategoriesNames] = useState([]);
  
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchProductCategoriesNames() {
      try {
        const names = await getProductCategories();
        setProductCategoriesNames(names);
      } catch (error) {
        console.error(
          "Error fetching product categories:",
          error.message
        );
      }
    }
    fetchProductCategoriesNames();
  }, []);

  const handleDeleteProductCategory = async (id) => {
    try {
      await deleteProductCategory(id);
      setProductCategoriesNames((prevNames) =>
        prevNames.filter((product_category) => product_category.id !== id)
      );
      showNotification("¡Categoria eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete the category:", error.message);
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
      <PageHeader title={"Categorias"} 
      goBackRoute={`/platform/products`}
      goBackText={"Volver a la lista de productos"}/>

        <ListWithTitle
          title=""
          hasAdd={userHasAccess}
          buttonAddRoute={userHasAccess
              ? `/platform/product_categories/new`
              : null
          }
          items={productCategoriesNames}
          buttonShowRoute={(id) => `/platform/product_categories/${id}`}
          hasEdit={userHasAccess}
          buttonEditRoute={(id) => (userHasAccess) ? `/platform/product_categories/${id}/edit` : null}
          hasDelete={userHasAccess}
          buttonDeleteRoute={handleDeleteProductCategory}
          columnName="name"
          confirmModalText="¿Estás seguro de que deseas eliminar esta categoria?"
          hasShow={(id) => true}
        />
    </>
  );
}
