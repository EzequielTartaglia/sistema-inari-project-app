"use client";

import { addCourse } from "@/src/models/platform/course/course";
import { getCurrencyTypes } from "@/src/models/platform/currency_type/currency_type";
import { getCourseLevels } from "@/src/models/platform/course_level/course_level";
import { getPaymentMethods } from "@/src/models/platform/payment_method/payment_method";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxInput from "../../CheckboxInput";
import SubmitLoadingButton from "../../SubmitLoadingButton";
import TextArea from "../../TextArea";
import SelectInput from "../../SelectInput";
import Button from "@/components/Button";
import { FiTrash2 } from "react-icons/fi";

export default function AddCourseForm() {
  const [course, setCourse] = useState({
    name: "",
    has_final_exam: true,
    is_paid: true,
    payment_methods: [],
    course_level_id: null,
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const { showNotification } = useNotification();

  const [currencyTypesTable, setCurrencyTypesTable] = useState([]);
  const [courseLevelsTable, setCourseLevelsTable] = useState([]);
  const [paymentMethodsTable, setPaymentMethodsTable] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const currencyTypes = await getCurrencyTypes();
        setCurrencyTypesTable(currencyTypes.filter((type) => type.id !== 1));
        const courseLevels = await getCourseLevels();
        setCourseLevelsTable(courseLevels);
        const paymentMethods = await getPaymentMethods();
        setPaymentMethodsTable(paymentMethods);
      } catch (error) {
        console.error("Error al obtener datos de las tablas:", error.message);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!course.name) {
      errors.name = "Campo obligatorio";
    }

    if (course.is_paid) {
      if (course.payment_methods.length === 0) {
        errors.payment_methods = "Debes agregar al menos un método de pago.";
      } else {
        course.payment_methods.forEach((method, index) => {
          if (!method.price) {
            errors[`price-${index}`] = "El precio es obligatorio";
          }
        });
      }
    }

    if (!course.course_level_id) {
      errors.course_level_id = "Campo obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setFormErrors({});
    setIsSubmitted(false);
    setIsLoading(true);

    try {
      await addCourse(
        course.name,
        course.has_final_exam,
        course.is_paid,
        JSON.stringify(course.payment_methods),
        course.course_level_id,
        course.description
      );

      showNotification("¡Curso agregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/platform/courses");
      }, 2000);
    } catch (error) {
      console.error("Error al agregar curso:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset errors when inputs change
    setFormErrors({});
  };

  const handlePaymentMethodChange = (index, field, value) => {
    const updatedMethods = course.payment_methods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    );

    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: updatedMethods,
    }));

    // Reset errors for specific fields when they change
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [`${field}-${index}`]: undefined,
    }));
  };

  const handleAddPaymentMethod = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: [
        ...prevCourse.payment_methods,
        { method_id: "", currency_id: "", link: "", price: "" },
      ],
    }));
  };

  const handleRemovePaymentMethod = (index) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: prevCourse.payment_methods.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <PageHeader
        title="Nuevo curso"
        goBackRoute="/platform/courses"
        goBackText={"Volver al listado de cursos"}
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={course.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !course.name}
          errorMessage={formErrors.name}
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={course.description}
          placeholder="Escribe algo aqui..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          note="El texto ingresado aparecerá públicamente en el preview y en la información del curso."
        />

        <div className="mt-1 mb-[-10px]">
          <SelectInput
            label="Nivel"
            name="course_level_id"
            value={course.course_level_id}
            required={true}
            onChange={handleInputChange}
            isSubmitted={isSubmitted && !course.course_level_id}
            errorMessage={formErrors.course_level_id}
            table={courseLevelsTable}
            columnName="name"
            idColumn="id"
          />
        </div>

        <CheckboxInput
          id="has_final_exam"
          name="has_final_exam"
          label="¿Tiene evaluación final?"
          checked={course.has_final_exam}
          onChange={handleInputChange}
        />

        <CheckboxInput
          id="is_paid"
          name="is_paid"
          label="¿Es pago?"
          checked={course.is_paid}
          onChange={handleInputChange}
        />

        {course.is_paid && (
          <>
            <div className="mt-4 mb-4">
              <h3 className="text-lg font-medium">Métodos de Pago</h3>
              {course.payment_methods.map((method, index) => (
                <div key={index} className="mt-2 mb-2 border p-2 rounded">
                  <SelectInput
                    label="Método de Pago"
                    name={`method_id-${index}`}
                    value={method.method_id}
                    required={true}
                    onChange={(e) =>
                      handlePaymentMethodChange(
                        index,
                        "method_id",
                        e.target.value
                      )
                    }
                    isSubmitted={isSubmitted && !method.method_id}
                    errorMessage={formErrors[`method_id-${index}`]}
                    table={paymentMethodsTable}
                    columnName="name"
                    idColumn="id"
                  />
                  <SelectInput
                    label="Moneda"
                    name={`currency_id-${index}`}
                    value={method.currency_id}
                    required={true}
                    onChange={(e) =>
                      handlePaymentMethodChange(
                        index,
                        "currency_id",
                        e.target.value
                      )
                    }
                    isSubmitted={isSubmitted && !method.currency_id}
                    errorMessage={formErrors[`currency_id-${index}`]}
                    table={currencyTypesTable}
                    columnName="abbreviation"
                    idColumn="id"
                  />
                  <Input
                    label="Link de Pago"
                    name={`link-${index}`}
                    value={method.link}
                    required={true}
                    placeholder="https://example.com/payment_link"
                    onChange={(e) =>
                      handlePaymentMethodChange(index, "link", e.target.value)
                    }
                  />
                  <Input
                    label="Precio"
                    name={`price-${index}`}
                    value={method.price}
                    required={true}
                    placeholder="99.99"
                    onChange={(e) =>
                      handlePaymentMethodChange(index, "price", e.target.value)
                    }
                    isSubmitted={isSubmitted && !method.price}
                    errorMessage={formErrors[`price-${index}`]}
                  />
                  <Button
                    customClasses="text-danger mt-2 shadow-none"
                    customFunction={() => handleRemovePaymentMethod(index)}
                    isAnimated={false}
                    icon={<FiTrash2 className="text-lg" size={24}/>}
                  />
                </div>
              ))}
              <Button
                customClasses="text-title-active mt-2 shadow-none"
                customFunction={handleAddPaymentMethod}
                isAnimated={false}
                text={"+ Añadir Método de Pago"}
              />
            </div>
          </>
        )}

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Agregar Curso
        </SubmitLoadingButton>
      </form>
    </>
  );
}
