"use client";

import {
  getStudentCourseEnrollments,
  deleteStudentCourseEnrollment,
  editStudentCourseEnrollmentStatus,
} from "@/src/models/platform/student_course_enrollment/student_course_enrollment";
import { getPlatformUser } from "@/src/models/platform/platform_user/platform_user";
import { getCourse } from "@/src/models/platform/course/course";
import { getPlatformState } from "@/src/models/platform/platform_state/platform_state";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import formatDate from "@/src/helpers/formatDate";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import PageBody from "@/components/page_formats/PageBody";
import Button from "@/components/Button";
import { addStudentCourseEnrollmentFinalExamAttempt } from "@/src/models/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";

export default function AdminCourseEnrollmentsPage() {
  const [coursesEnrollmentsStates, setCoursesEnrollmentsStates] = useState([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCoursesEnrollmentStates() {
      try {
        const courseEnrollments = await getStudentCourseEnrollments();
  
        const getUserPromises = courseEnrollments.map((enrollment) =>
          enrollment.platform_user_id && getPlatformUser(enrollment.platform_user_id)
        );
        const getCoursePromises = courseEnrollments.map((enrollment) =>
          enrollment.course_id && getCourse(enrollment.course_id)
        );
  
        const courses = await Promise.all(getCoursePromises);
  
        const filteredCourses = courses.filter(Boolean); 
  
        const getStatePromises = courseEnrollments.map((enrollment) =>
          getPlatformState(enrollment.platform_state_id)
        );
  
  
        const users = await Promise.all(getUserPromises);
        const states = await Promise.all(getStatePromises);
  
        const enrollmentsWithUsersAndCourses = courseEnrollments.map(
          (enrollment, index) => ({
            ...enrollment,
            user: users[index],
            course: filteredCourses[index], 
            state: states[index]
          })
        );
  
        console.log("Course Enrollments:", enrollmentsWithUsersAndCourses);
  
        setCoursesEnrollmentsStates(enrollmentsWithUsersAndCourses);
      } catch (error) {
        console.error("Error fetching course enrollments:", error.message);
      }
    }
    fetchCoursesEnrollmentStates();
  }, []);
  

  const handleDeleteCourseEnrollmentState = async (id) => {
    try {
      await deleteStudentCourseEnrollment(id);

      showNotification("Inscripcion eliminada exitosamente!", "info");

      setCoursesEnrollmentsStates((prevEnrollments) =>
        prevEnrollments.filter((enrollment) => enrollment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting enrollment:", error.message);
    }
  };

  const handleApproveCourseEnrollmentState = async (id) => {
    try {
      const enrollment = coursesEnrollmentsStates.find(
        (enrollment) => enrollment.id === id
      );
      if (!enrollment) {
        throw new Error("Enrollment not found");
      }
      const course = await getCourse(enrollment.course_id);

      if (course.has_final_exam) {
        await addStudentCourseEnrollmentFinalExamAttempt(0, 0, 0, id, false);
      }

      await editStudentCourseEnrollmentStatus(id, 3);

      setCoursesEnrollmentsStates((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment.id === id
            ? { ...enrollment, platform_state_id: 3, state: { name: "Pagado" } }
            : enrollment
        )
      );

      showNotification("Inscripcion aprobada exitosamente!", "success");
    } catch (error) {
      console.error("Error approving enrollment:", error.message);
    }
  };

  const columns = [
    "enrollment_date",
    "full_name",
    "email",
    "name",
    "currency_abbreviation",
    "price",
    "platform_state_id",
  ];
  const columnAliases = {
    enrollment_date: "Fecha de inscripción",
    full_name: "Nombre Completo",
    email: "Correo Electrónico",
    name: "Curso",
    platform_state_id: "Estado",
    currency_abbreviation: "Moneda",
    price: "Monto",
  };

  const filteredData = coursesEnrollmentsStates
    .filter((enrollment) => {
      if (filter === "all") {
        return true;
      } else if (filter === "pending") {
        return enrollment.platform_state_id !== 3;
      } else if (filter === "paid") {
        return enrollment.platform_state_id === 3;
      }
      return true;
    })
    .map((enrollment) => ({
      id: enrollment.id,
      enrollment_date: formatDate(enrollment.enrollment_date),
      full_name: `${enrollment?.user.first_name} ${enrollment?.user.last_name}`,
      email: enrollment?.user.email,
      name: enrollment?.course.name,
      currency_abbreviation: enrollment?.currency_abbreviation,
      price: enrollment.course.is_paid
        ? `$ ${enrollment?.payment.toFixed(2)}`
        : "Gratuito",
      platform_state_id: enrollment?.state?.name,
      hasApprove: enrollment.platform_state_id === 2,
    }));

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <>
      <PageHeader title={"Inscripciones"} />

      <PageBody>
        <div className="flex space-x-4 font-semibold">
          <Button
            text={"Todos"}
            route={"#"}
            openInNewTab={false}
            customClasses={
              filter === "all"
                ? "rounded-md bg-primary border-secondary-light text-title-active-static"
                : "rounded-md bg-secondary border-primary-light text-primary"
            }
            customFunction={() => handleFilterChange("all")}
          />

          <Button
            text={"Pendientes"}
            route={"#"}
            openInNewTab={false}
            customClasses={
              filter === "pending"
                ? "rounded-md bg-primary border-secondary-light text-title-active-static"
                : "rounded-md bg-secondary border-primary-light text-primary"
            }
            customFunction={() => handleFilterChange("pending")}
          />

          <Button
            text={"Pagados"}
            route={"#"}
            openInNewTab={false}
            customClasses={
              filter === "paid"
                ? "rounded-md bg-primary border-secondary-light text-title-active-static"
                : "rounded-md bg-secondary border-primary-light text-primary"
            }
            customFunction={() => handleFilterChange("paid")}
          />
        </div>

        <Table
          title={"Estados de inscripcion registrados"}
          columns={columns}
          data={filteredData}
          columnAliases={columnAliases}
          hasShow={false}
          hasEdit={false}
          hasDelete={true}
          hasApprove={(enrollment) =>
            enrollment.platform_state_id === "Pendiente"
          }
          buttonDeleteRoute={handleDeleteCourseEnrollmentState}
          buttonApproveRoute={handleApproveCourseEnrollmentState}
          confirmModalText={
            "¿Estás seguro de que deseas eliminar esta inscripción?"
          }
        />
      </PageBody>
    </>
  );
}
