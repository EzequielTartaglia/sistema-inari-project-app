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
import Image from "next/image";
import { FiImage } from "react-icons/fi";

export default function StockProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const router = useRouter();

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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
    "image_path",
    "name",
    "product_category_id",
    "price",
    "product_measure_unit_id",
    "quantity",
  ];
  const columnAliases = {
    image_path: "Imagen",
    name: "Nombre",
    product_category_id: "Categoría",
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
        image_path: (
          <div className="flex justify-center">
            {product.image_path &&
            (product.image_path.startsWith("/") ||
              product.image_path.startsWith("http")) ? (
              <button onClick={() => openImageModal(product.image_path)}>
                <Image
                  src={product.image_path}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover border"
                />
              </button>
            ) : (
              <FiImage
                title="Imagen incompatible"
                className="text-red-400 text-2xl"
              />
            )}
          </div>
        ),
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
        buttonAddRoute={userHasAccess ? `/platform/stock/stock_products/new` : null}
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/platform/stock/stock_products/${id}/edit`}
        hasDelete={true}
        buttonDeleteRoute={handleDeleteProduct}
        hasApprove={hasApprove}
        confirmModalText={"¿Estás seguro de que deseas eliminar este producto?"}
      />

      {/* Image preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <Image
              src={selectedImage}
              alt="Imagen ampliada"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
