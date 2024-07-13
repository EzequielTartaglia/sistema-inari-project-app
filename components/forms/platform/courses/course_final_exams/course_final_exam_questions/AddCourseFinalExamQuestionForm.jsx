'use client';

import { addCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddCourseFinalExamQuestionForm({ finalExamId, courseId }) {
  const [courseFinalExamTitle, setCourseFinalExamTitle] = useState("");
  const [courseFinalExamQuestion, setCourseFinalExamQuestion] = useState({
    question_text: "",
    points_assigned: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCourseFinalExam() {
      try {
        const courseFinalExamDetails = await getCourseFinalExam(courseId);
        setCourseFinalExamTitle(courseFinalExamDetails.title);
      } catch (error) {
        console.error("Error al obtener detalles del examen final:", error.message);
      }
    }

    fetchCourseFinalExam();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFinalExamQuestion((prevCourseFinalExamQuestion) => ({
      ...prevCourseFinalExamQuestion,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { question_text, points_assigned } = courseFinalExamQuestion;

    if (!question_text || !points_assigned) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true); 

    try {
      await addCourseFinalExamQuestion(finalExamId, question_text, points_assigned);
      
      showNotification("¡Pregunta del examen final agregada exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}/final_exam/manage`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar pregunta al examen final:", error.message);
      setIsLoading(false); 
    }
  };

  return (
    <>
      <PageHeader
        title={courseFinalExamTitle || "Cargando..."}
        subtitle="Nueva pregunta"
        goBackRoute={`/platform/courses/${courseId}/final_exam/manage`}
        goBackText="Volver a detalles del examen final"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Pregunta"
          name="question_text"
          value={courseFinalExamQuestion.question_text}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />
        <Input
          label="Puntos Asignados"
          name="points_assigned"
          value={courseFinalExamQuestion.points_assigned}
          required={true}
          placeholder="Ingrese los puntos asignados"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Pregunta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
