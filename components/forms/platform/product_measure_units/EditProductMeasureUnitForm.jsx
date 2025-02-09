"use client";

import { getProductMeasureUnit,editProductMeasureUnit } from "@/src/controllers/platform/product_measure_unit/product_measure_unit";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";
import TextArea from "../../TextArea";


export default function EditProductMeasureUnitForm({ productMeasureUnitId }) {
  const [productMeasureUnit, setProductMeasureUnit] = useState({
    name: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProductMeasureUnit = async () => {
      try {
        const fetchedProductMeasureUnit = await getProductMeasureUnit(
          productMeasureUnitId
        );
        setProductMeasureUnit(fetchedProductMeasureUnit);
      } catch (error) {
        console.error("Error fetching the product measure unit:", error.message);
      }
    };
    fetchProductMeasureUnit();
  }, [productMeasureUnitId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!productMeasureUnit.name) {
      return;
    }

    setIsLoading(true);

    try {
      await editProductMeasureUnit(
        productMeasureUnitId,
        productMeasureUnit.name,
        productMeasureUnit.description
      );

      showNotification("¡Unidad de medida editada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/product_measure_units`);
      }, 2000);
    } catch (error) {
      console.error("Error editing product measure unit:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductMeasureUnit({ ...productMeasureUnit, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Editar unidad de medida"
        goBackRoute="/platform/product_measure_units"
        goBackText="Volver al listado de unidades de medida"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={productMeasureUnit.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={productMeasureUnit.description}
          placeholder="Escribe una breve descripción de la unidad de medida..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar unidad de medida
        </SubmitLoadingButton>
      </form>
    </>
  );
}
