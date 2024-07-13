"use client";

import { addCourseModule } from "@/src/models/platform/course_module/courses_module";
import { getCourse } from "@/src/models/platform/course/course";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddCourseFinalExamForm({ courseId }) {
  const [courseName, setCourseName] = useState("");
  const [courseModuleTitle, setCourseModuleTitle] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const courseDetails = await getCourse(courseId);
        setCourseName(courseDetails.name);
      } catch (error) {
        console.error("Error al obtener el nombre del curso:", error.message);
      }
    };

    fetchCourseName();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!courseModuleTitle) {
      return;
    }

    setIsLoading(true);

    try {
      await addCourseModule(courseModuleTitle, courseId);
      showNotification("¡Módulo agregado exitosamente!", "success");

      setTimeout(() => {
        router.push(`/platform/courses/${courseId}`);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error al agregar módulo:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={courseName || "Cargando..."}
        goBackRoute={`/platform/courses/${courseId}`}
        goBackText="Volver a detalles del curso"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Título"
          name="title"
          value={courseModuleTitle}
          required={true}
          placeholder=""
          onChange={(e) => setCourseModuleTitle(e.target.value)}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Agregar Módulo
        </SubmitLoadingButton>
      </form>
    </>
  );
}
