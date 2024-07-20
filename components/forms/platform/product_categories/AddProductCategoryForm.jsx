"use client";

import { addProductCategory } from "@/src/models/platform/product_category/product_category";
import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";
import TextArea from "../../TextArea";

export default function AddProductCategoryForm() {
  const [productCategory, setProductCategory] = useState({
    name: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!productCategory.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addProductCategory(
        productCategory.name,
        productCategory.description
      );

      showNotification("Categoria agregada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/product_categories`);
      }, 2000);
    } catch (error) {
      console.error("Error adding product category:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductCategory({ ...productCategory, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nueva categoria"
        goBackRoute="/platform/product_categories"
        goBackText="Volver al listado de categorias"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={productCategory.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={productCategory.description}
          placeholder="Escribe una breve descripción de la categoria..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar categoria
        </SubmitLoadingButton>
      </form>
    </>
  );
}
