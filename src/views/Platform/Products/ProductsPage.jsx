"use client";

import {
  getProducts,
  deleteProduct,
} from "@/src/controllers/platform/product/product";
import { getProductCategories } from "@/src/controllers/platform/product_category/product_category";
import { getProductMeasureUnits } from "@/src/controllers/platform/product_measure_unit/product_measure_unit";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();
        const fetchedProducts = await getProducts();

        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prevNames) =>
        prevNames.filter((product) => product.id !== id)
      );
      showNotification("¡Producto eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete product:", error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    "name",
    "product_category_id",
    "price",
    "product_measure_unit_id",
    "quantity",
  ];
  const columnAliases = {
    name: "Nombre",
    product_category_id: "Categoria",
    price: "Precio",
    product_measure_unit_id: "Unidad de medida",
    quantity: "Cantidad",
  };

  const filteredData = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((product) => {
      const productCategory = categories.find(
        (category) => category.id === product.product_category_id
      );
      const productMeasureUnit = measureUnits.find(
        (measure_unit) => measure_unit.id === product.product_measure_unit_id
      );
      return {
        id: product.id,
        name: product.name,
        product_category_id: productCategory ? productCategory.name : "N/A",
        price: parseFloat(product.price).toFixed(2),
        product_measure_unit_id: productMeasureUnit
          ? productMeasureUnit.name
          : "N/A",
        quantity: product.quantity,
      };
    });

  const hasShow = (item) => {
    return;
  };

  const hasEdit = (item) => {
    return true;
  };

  const hasApprove = (item) => {
    return;
  };

  const userHasAccess =
    user.user_role_id === 1 ||
    user.user_role_id === 2 ||
    user.user_role_id === 3 ||
    user.user_role_id === 4 ||
    user.user_role_id === 6;

  return (
    <>
      <PageHeader
        title={"Productos"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <SearchInput
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <Table
        title={"Inventario"}
        buttonAddRoute={userHasAccess ? `/platform/products/new` : null}
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/platform/products/${id}/edit`}
        hasDelete={true}
        buttonDeleteRoute={handleDeleteProduct}
        hasApprove={hasApprove}
        confirmModalText={"¿Estás seguro de que deseas eliminar este producto?"}
      />
    </>
  );
}
