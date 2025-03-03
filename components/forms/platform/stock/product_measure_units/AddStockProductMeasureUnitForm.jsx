"use client";

import { addProductMeasureUnit } from "@/src/controllers/platform/product_measure_unit/product_measure_unit";
import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../../SubmitLoadingButton";
import TextArea from "../../../TextArea";

export default function AddStockProductMeasureUnitForm() {
  const { user } = useUserInfoContext();

  const [productMeasureUnit, setProductMeasureUnit] = useState({
    name: "",
    description: "",
    platform_user_business_id: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!productMeasureUnit.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addProductMeasureUnit(
        productMeasureUnit.name,
        productMeasureUnit.description,
        user.platform_user_business_id
      );

      showNotification("¡Unidad de medida agregada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/stock/stock_product_measure_units`);
      }, 2000);
    } catch (error) {
      console.error("Error adding product measure unit:", error.message);
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
        title="Nueva unidad de medida"
        goBackRoute="/platform/stock/stock_product_measure_units"
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
          Agregar unidad de medida
        </SubmitLoadingButton>
      </form>
    </>
  );
}
