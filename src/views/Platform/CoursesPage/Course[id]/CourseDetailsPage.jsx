"use client";

import {
  getCourse,
  getCourseModulesAndClasses,
  getTotalTimeToComplete,
} from "@/src/models/platform/course/course";
import { getCourseLevels } from "@/src/models/platform/course_level/course_level";
import { deleteCourseModuleClass } from "@/src/models/platform/course_module_class/course_module_class";
import { deleteCourseModule } from "@/src/models/platform/course_module/courses_module";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";
import { checkStudentCourseEnrollment } from "@/src/models/platform/student_course_enrollment/student_course_enrollment";
import {
  addStudentCourseEnrollmentFinalExamAttempt,
  checkStudentCourseEnrollmentFinalExamAttempt,
} from "@/src/models/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";

import { useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useNotification } from "@/contexts/NotificationContext";
import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";

import ModuleDropdownList from "./Module/CourseModuleDropdownList";
import { FiEdit, FiSettings } from "react-icons/fi";
import LiWithTitle from "@/components/lists/LiWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import CourseDetailsCard from "./CourseDetailsCard";
import { FaGraduationCap } from "react-icons/fa";

export default function CourseDetailsPage({ courseId }) {
  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();

  const [courseDetails, setCourseDetails] = useState(null);
  const [modulesWithClasses, setModulesWithClasses] = useState([]);
  const [courseFinalExamDetails, setCourseFinalExamDetails] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [courseLevels, setCourseLevels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const details = await getCourse(courseId);
        setCourseDetails(details);

        const courseLevelsFetched = await getCourseLevels();
        setCourseLevels(courseLevelsFetched);

        const timeToComplete = await getTotalTimeToComplete(courseId);
        setTotalTime(timeToComplete);

        const finalExamDetails = await getCourseFinalExam(courseId);
        setCourseFinalExamDetails(finalExamDetails);

        const modulesClasses = await getCourseModulesAndClasses(courseId);
        setModulesWithClasses(modulesClasses);

        const enrollment = await checkStudentCourseEnrollment(
          user.id,
          courseId
        );
        setEnrollmentDetails(enrollment);

        if (enrollment && details.has_final_exam) {
          const enrollmentId = enrollment.id;
          if (enrollmentId) {
            const hasAttempt =
              await checkStudentCourseEnrollmentFinalExamAttempt(enrollmentId);
            if (!hasAttempt) {
              await addStudentCourseEnrollmentFinalExamAttempt(
                0,
                0,
                0,
                enrollmentId,
                false
              );
            }
          } else {
            console.error("Invalid enrollment ID:", enrollmentId);
          }
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching course details:", error.message);
      }
    }

    fetchData();
  }, [courseId, user.id]);

  const handleDeleteCourseModuleClass = async (id) => {
    try {
      await deleteCourseModuleClass(id);
      showNotification("¡Clase eliminada exitosamente!", "info");

      setModulesWithClasses((prevModules) =>
        prevModules.map((module) => ({
          ...module,
          moduleClasses: module.moduleClasses.filter((cls) => cls.id !== id),
        }))
      );
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteCourseModule = async (moduleId) => {
    try {
      await deleteCourseModule(moduleId);
      showNotification("¡Modulo eliminado exitosamente!", "info");

      setModulesWithClasses((prevModules) =>
        prevModules.filter((module) => module.module.id !== moduleId)
      );
    } catch (error) {
      console.error("Error deleting module:", error.message);
    }
  };

  const formattedTime = formatTimeFromMinutesToHoursAndMinutes(totalTime);

  function findCourseLevel(courseLevelId, courseLevels) {
    const level = courseLevels.find((level) => level.id === courseLevelId);
    return level ? level.name : "Nivel no especificado";
  }

  return (
    <>
      {courseDetails && enrollmentDetails ? (
        <>
          <PageHeader
            title={courseDetails.name || "Cargando..."}
            goBackRoute={`/platform/courses/`}
            goBackText="Volver al listado de cursos"
          />

          {courseDetails.description && (
            <CourseDetailsCard
              description={courseDetails.description}
              totalTime={totalTime > 0 ? `${formattedTime.hours} horas ${formattedTime.minutes} minutos` : ""}
              level={findCourseLevel(
                courseDetails.course_level_id,
                courseLevels
              )}
            />
          )}

          <ModuleDropdownList
            title="Modulos"
            hasAddModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonAddModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
                ? `/platform/courses/${courseId}/modules/new`
                : "/platform"
            }
            modulesWithClasses={modulesWithClasses}
            hasAddClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonShowRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}`
            }
            hasEditModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonEditRouteModule={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/edit`
            }
            hasDeleteModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonDeleteModuleRoute={handleDeleteCourseModule}
            buttonAddRouteModuleClass={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/new`
            }
            hasEditClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonEditRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}/edit`
            }
            hasDeleteClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonDeleteRoute={handleDeleteCourseModuleClass}
            columnName="title"
          />

          {modulesWithClasses.length > 0 && courseDetails.has_final_exam && (
            <>
              <LiWithTitle
                title="Examen Final"
                buttonTitle="Editar"
                hasIconRight={
                  user && (user.user_role_id === 3 || user.user_role_id === 4)
                }
                items={[courseFinalExamDetails?.title]}
                buttonRouteTitle={
                  user && (user.user_role_id === 3 || user.user_role_id === 4)
                    ? `/platform/courses/${courseId}/final_exam/manage`
                    : "/platform"
                }
                buttonRoute={`/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/edit`}
                iconRightTitle={<FiSettings size={24} />}
                iconRight={<FiEdit size={24}/>}
                hasExtraLiButton={true}
                extraButtonRoute={`/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/attempt`}
                extraButtonRouteTitle="Realizar examen final"
                extraIconRight={<FaGraduationCap size={24}/>}
              />
            </>
          )}
        </>
      ) : (
        <div className="text-primary">No estas inscripto a este curso.</div>
      )}
    </>
  );
}
