"use client";

import { useEffect, useState } from "react";
import { getCourseModuleClassSingle } from "@/src/models/platform/course_module_class/course_module_class";
import CourseModuleClassFormat from "../CourseModuleClassFormat";
import CourseModuleClassPlatformTool from "../CourseModuleClassPlatformTool";
import { getCourseModule } from "@/src/models/platform/course_module/courses_module";

import YouTubePreview from "@/components/YouTubeVideoPreview";
import PageHeader from "@/components/page_formats/PageHeader";
import Link from "next/link";
import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CourseModuleClassDetailsPage({
  courseId,
  moduleId,
  classId,
}) {
  const [classDetails, setClassDetails] = useState(null);
  const [courseModuleDetails, setModuleCourseDetails] = useState(null);

  useEffect(() => {
    async function fetchClassDetails() {
      try {
        const classDetailsResponse = await getCourseModuleClassSingle(classId);
        setClassDetails(classDetailsResponse);

        const details = await getCourseModule(moduleId);
        setModuleCourseDetails(details);
      } catch (error) {
        console.error(
          "Error al obtener los detalles de la clase:",
          error.message
        );
      }
    }

    fetchClassDetails();
  }, [courseId, moduleId, classId]);

  return (
    <>
      {courseModuleDetails && classDetails ? (
        <>
          <PageHeader
            title={courseModuleDetails.title || "Cargando..."}
            subtitle={classDetails.title}
            goBackRoute={`/platform/courses/${courseId}`}
            goBackText="Volver al curso"
          />
          {classDetails.has_video && classDetails.video_link && (
            <div className="box-theme">
              <YouTubePreview videoId={classDetails.video_link} />
            </div>
          )}
          <div className="box-theme">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Detalles de la Clase:
            </h3>
           
            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Tiempo estimado de la clase:
              </span>
              {classDetails.time_to_complete ? (
                <p className="text-primary">
                  {formatTimeFromMinutesToHoursAndMinutes(classDetails.time_to_complete).hours} horas{" "}
                  {formatTimeFromMinutesToHoursAndMinutes(classDetails.time_to_complete).minutes} minutos
                </p>
              ) : (
                <p className="text-primary">No especificado</p>
              )}
            </div>

            
            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Descripción:
              </span>
              <p className="text-primary">{classDetails.description}</p>
            </div>

            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Formato de clase:
              </span>
              {classDetails.course_format_id ? (
                <CourseModuleClassFormat
                  courseModuleClassFormatId={classDetails.course_format_id}
                  className="text-primary"
                />
              ) : (
                <span className="text-primary">Sin especificar</span>
              )}
            </div>

            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Plataforma:
              </span>
              {classDetails.course_platform_tool_id ? (
                <CourseModuleClassPlatformTool
                  courseModuleClassPlatformToolId={
                    classDetails.course_platform_tool_id
                  }
                  className="text-primary"
                />
              ) : (
                <span className="text-primary">Sin especificar</span>
              )}
            </div>

            {classDetails.drive_link && (
              <div className="mb-4">
                <p className="text-primary font-semibold mb-5">
                  Material complementario:
                  <br />
                  <span className="mr-3">-</span>
                  <Link
                    href={classDetails.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-title-active hover:text-gold"
                  >
                    Drive
                  </Link>
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <LoadingSpinner/>
      )}
    </>
  );
}
