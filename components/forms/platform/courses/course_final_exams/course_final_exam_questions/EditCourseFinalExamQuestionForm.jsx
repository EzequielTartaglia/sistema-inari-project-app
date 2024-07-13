"use client";


import { getCourseFinalExamQuestion, editCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditCourseFinalExamQuestionForm({ courseId, finalExamId, questionId }) {
  const [courseFinalExamTitle, setCourseFinalExamTitle] = useState("");
  const [courseFinalExamQuestion, setCourseFinalExamQuestion] = useState({
    question_text: "",
    points_assigned: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseFinalExamQuestion = async () => {
      try {
        const fetchedCourseFinalExam = await getCourseFinalExam(courseId);
        setCourseFinalExamTitle(fetchedCourseFinalExam.title);
  
        const fetchedCourseFinalExamQuestion = await getCourseFinalExamQuestion(questionId);
        setCourseFinalExamQuestion(fetchedCourseFinalExamQuestion);
      } catch (error) {
        console.error("Error al obtener el examen final:", error.message);
      }
    };
    fetchCourseFinalExamQuestion();
  }, [courseId, finalExamId, questionId]);

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
      await editCourseFinalExamQuestion(
        questionId,
        question_text,
        points_assigned
      );

      showNotification("¡Pregunta editada exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}/final_exam/manage`);
      }, 2000);

    } catch (error) {
      console.error("Error al editar el examen:", error.message);
      setIsLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFinalExamQuestion({
      ...courseFinalExamQuestion,
      [name]: value
    });
  };

  return (
    <>
      <PageHeader
        title={courseFinalExamTitle || "Cargando..."}
        subtitle="Editar pregunta"
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
          value={courseFinalExamQuestion.question_text || ""}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <Input
          label="Puntos Asignados"
          name="points_assigned"
          value={courseFinalExamQuestion.points_assigned || ""}
          required={true}
          placeholder="Ingrese los puntos asignados"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar pregunta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
