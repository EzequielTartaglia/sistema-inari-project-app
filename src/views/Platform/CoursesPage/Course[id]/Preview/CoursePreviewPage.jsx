"use client";

import { getCourse, getTotalTimeToComplete } from "@/src/models/platform/course/course";
import { getCourseLevels } from "@/src/models/platform/course_level/course_level";
import { getCourseModules } from "@/src/models/platform/course_module/courses_module";

import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";
import { useEffect, useState } from "react";

import CourseDetailsCard from "../CourseDetailsCard";
import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

const CoursePreviewPage = ({ courseId }) => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  const [courseLevels, setCourseLevels] = useState([]);
  const [courseModules, setCourseModules] = useState([]);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const details = await getCourse(courseId);
        setCourseDetails(details);

        const timeToComplete = await getTotalTimeToComplete(courseId);
        setTotalTime(timeToComplete);

        const courseLevelsFetched = await getCourseLevels();
        setCourseLevels(courseLevelsFetched);

        const modules = await getCourseModules(courseId);
        setCourseModules(modules);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del curso:", error.message);
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!courseDetails) {
    return <div>No se encontraron detalles del curso.</div>;
  }

  // Format total time to hours and minutes
  const formattedTime = formatTimeFromMinutesToHoursAndMinutes(totalTime);

  function findCourseLevel(courseLevelId, courseLevels) {
    const level = courseLevels.find(level => level.id === courseLevelId);
    return level ? level.name : "Nivel no especificado";
  }
  
  return (
    <>
      <PageHeader
        title={courseDetails.name}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />
      <CourseDetailsCard
        moduleList={courseModules}
        description={courseDetails.description}
        totalTime={totalTime > 0 ? `${formattedTime.hours} horas ${formattedTime.minutes} minutos` : ""}
        level={findCourseLevel(courseDetails.course_level_id, courseLevels)}
      />
    </>
  );
};

export default CoursePreviewPage;
