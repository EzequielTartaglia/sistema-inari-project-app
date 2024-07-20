"use client";

import { getProductCategory } from "@/src/models/platform/product_category/product_category";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductCategoryDetailsPage({ productCategoryId }) {
  const [productCategory, setProductCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProductCategory() {
      try {
        const category = await getProductCategory(productCategoryId);
        setProductCategory(category);
      } catch (error) {
        console.error("Error fetching product category:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductCategory();
  }, [productCategoryId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <PageHeader
        title={`${productCategory?.name}`}
        goBackRoute="/platform/product_categories"
        goBackText="Volver a la lista de categorías"
      />

      <div className="box-theme">
        <h2 className="text-xl font-semibold mb-4">Detalles de la Categoría</h2>
        <div className="mb-2">
          <strong>Nombre:</strong> {productCategory?.name}
        </div>
        <div className="mb-2">
          <strong>Descripción:</strong>{" "}
          {productCategory?.description || "No disponible"}
        </div>
      </div>
    </>
  );
}
