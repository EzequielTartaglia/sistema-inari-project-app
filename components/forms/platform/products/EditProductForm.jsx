"use client";

import { getProduct, editProduct } from "@/src/controllers/platform/product/product";
import { getProductCategories } from "@/src/controllers/platform/product_category/product_category";
import { getProductMeasureUnits } from "@/src/controllers/platform/product_measure_unit/product_measure_unit";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";
import TextArea from "../../TextArea";
import SelectInput from "@/components/forms/SelectInput";

export default function EditProductForm({ productId }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    image_path: "",
    product_category_id: "",
    price: "",
    product_measure_unit_id: "",
    quantity: "",
  });
  const [categories, setCategories] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const fetchedProduct = await getProduct(productId);
        setProduct({
          ...fetchedProduct,
          price: parseFloat(fetchedProduct.price).toFixed(2), 
        });

        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();
        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchProductData();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !product.name ||
      !product.product_category_id ||
      !product.price ||
      !product.product_measure_unit_id ||
      !product.quantity
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await editProduct(
        productId,
        product.name,
        product.description,
        product.image_path,
        product.product_category_id,
        parseFloat(product.price).toFixed(2), 
        product.product_measure_unit_id,
        product.quantity
      );

      showNotification("¡Producto editado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/products`);
      }, 2000);
    } catch (error) {
      console.error("Error editing product:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Editar Producto"
        subtitle={product.name || "Cargando..."}
        goBackRoute="/platform/products"
        goBackText="Volver al listado de productos"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={product.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripción"
          name="description"
          value={product.description}
          placeholder="Escribe una breve descripción del producto..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <Input
          label="Ruta de la Imagen"
          name="image_path"
          value={product.image_path}
          placeholder="Escribe la ruta de la imagen..."
          onChange={handleInputChange}
        />

        <SelectInput
          label="Categoría del Producto"
          name="product_category_id"
          value={product.product_category_id}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={categories}
          columnName="name"
          idColumn="id"
          required={true}
        />

        <Input
          label="Precio"
          name="price"
          value={product.price}
          required={true}
          placeholder="999.99"
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          type="number"
          step="0.01"
        />

        <SelectInput
          label="Unidad de Medida"
          name="product_measure_unit_id"
          value={product.product_measure_unit_id}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={measureUnits}
          columnName="name"
          idColumn="id"
          required={true}
        />

        <Input
          label="Cantidad"
          name="quantity"
          value={product.quantity}
          required={true}
          placeholder="Escribe la cantidad del producto..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          type="number"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar Producto
        </SubmitLoadingButton>
      </form>
    </>
  );
}
