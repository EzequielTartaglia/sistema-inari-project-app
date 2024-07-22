"use client";

import { addProduct } from "@/src/models/platform/product/product";
import { getProductCategories } from "@/src/models/platform/product_category/product_category";
import { getProductMeasureUnits } from "@/src/models/platform/product_measure_unit/product_measure_unit";
import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";
import TextArea from "../../TextArea";
import SelectInput from "@/components/forms/SelectInput";

export default function AddProductForm() {
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
    async function fetchData() {
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();
        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, []);

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
      await addProduct(
        product.name,
        product.description,
        product.image_path,
        product.product_category_id,
        product.price,
        product.product_measure_unit_id,
        product.quantity
      );

      showNotification("¡Producto agregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/products`);
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error.message);
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
        title="Nuevo Producto"
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
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Producto
        </SubmitLoadingButton>
      </form>
    </>
  );
}
