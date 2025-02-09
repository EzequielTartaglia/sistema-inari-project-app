"use client";

import {
  getProduct,
  editProduct,
} from "@/src/controllers/platform/product/product";
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
import CheckboxWithInput from "../../CheckboxWithInput";
import FileInput from "../../FileInput";
import CheckboxInput from "../../CheckboxInput";

export default function EditProductForm({ productId }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    has_image: false,
    image_path: "",
    product_category_id: "",
    price: "",
    product_measure_unit_id: "",
    quantity: "",
    has_bar_code: false,
    bar_code: "",
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
      (product.has_image && !product.image_path) ||
      !product.price ||
      !product.product_measure_unit_id ||
      !product.quantity ||
      (product.has_bar_code && !product.bar_code)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await editProduct(
        productId,
        product.name,
        product.description,
        product.has_image,
        product.has_image ? product.image_path : null,
        product.product_category_id,
        product.price,
        product.product_measure_unit_id,
        product.quantity,
        product.has_bar_code,
        product.has_bar_code ? product.bar_code : null
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
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setProduct({
      ...product,
      [name]: newValue,
    });
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess = (url) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      has_image: true,
      image_path: url,
    }));
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

        <CheckboxWithInput
          checkboxId="has_bar_code"
          checkboxChecked={product.has_bar_code}
          checkboxOnChange={handleInputChange}
          checkboxName="has_bar_code"
          checkboxLabel="¿Contiene codigo de barra?"
          inputName="bar_code"
          inputValue={product.bar_code}
          inputLabel="Codigo de barra"
          inputPlaceholder="Ingrese el codigo de barra del producto..."
          inputOnChange={handleInputChange}
          isSubmitted={isSubmitted}
          inputErrorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripción"
          name="description"
          value={product.description}
          placeholder="Escribe una breve descripción del producto..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <CheckboxInput
          id="has_image"
          name="has_image"
          label="¿Tiene imagen?"
          checked={product.has_image}
          onChange={handleInputChange}
        />

        {product.has_image && (
          <div className="mt-4">
            <FileInput
              name="checkpointImage"
              onChange={handleFileChange}
              onUploadSuccess={handleFileUploadSuccess}
              showPreview={false}
            />
          </div>
        )}

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
