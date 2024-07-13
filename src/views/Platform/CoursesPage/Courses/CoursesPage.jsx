"use client";

import {
  getCoursesNames,
  deleteCourse,
  getCourse,
  getCoursePaymentMethods,
} from "@/src/models/platform/course/course";
import {
  addStudentCourseEnrollment,
  getStudentCourseEnrollmentsSingleUser,
} from "@/src/models/platform/student_course_enrollment/student_course_enrollment";

import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import { FiDollarSign, FiClock } from "react-icons/fi";
import PaymentLinkModal from "./PaymentLinkModal";
import ConfirmEnrollmentModal from "./ConfirmEnrollmentModal";
import formatDate from "@/src/helpers/formatDate";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function CoursesPage() {
  const { user } = useUserInfoContext();

  const [coursesNames, setCoursesNames] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState("");
  const [selectedPaymentMethodCurrency, setSelectedPaymentMethodCurrency] = useState("");

  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const names = await getCoursesNames();
        setCoursesNames(names);

        const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
          parseInt(user.id, 10)
        );
        setEnrollments(userEnrollments);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    }

    fetchData();
  }, [user.id]);

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      setCoursesNames(coursesNames.filter((course) => course.id !== id));
      showNotification("¡Curso eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar el curso:", error.message);
    }
  };

  const isEnrolled = (id) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.course_id === id
    );
    return !!enrollment;
  };

  const isPending = (id) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.course_id === id
    );
    return enrollment && enrollment.platform_state_id === 2;
  };

  const isPaid = (id) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.course_id === id
    );
    return enrollment && enrollment.platform_state_id === 3;
  };

  const handleCourseEnrollement = async (id) => {
    if (!isEnrolled(id)) {
      try {
        const course_details = await getCourse(id);
        if (course_details) {
          if (course_details.is_paid) {
            setSelectedCourse(course_details);
            setPaymentMethods(course_details.payment_methods);
            setIsConfirmModalOpen(true);
          } else {
            await addStudentCourseEnrollment(user.id, course_details.id, 3, 0,formatDate(new Date(), "yyyy-MM-dd"),"No aplica");

            showNotification("¡Inscripcion realizada, exitosamente!", "success");

            const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
              parseInt(user.id, 10)
            );
            setEnrollments(userEnrollments);
          }
        } else {
          console.error("El curso no tiene detalles válidos");
        }
      } catch (error) {
        console.error(
          "Error al obtener los detalles del curso:",
          error.message
        );
      }
    }
  };

  const handleConfirmEnrollment = async () => {
    if (selectedCourse && selectedPaymentMethod && selectedPaymentMethodCurrency) {
      try {
        await addStudentCourseEnrollment(
          user.id,
          selectedCourse.id,
          2, 
          selectedPaymentMethod.price,
          formatDate(new Date(), "yyyy-MM-dd"),
          selectedPaymentMethodCurrency
        );
        const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
          parseInt(user.id, 10)
        );
        setEnrollments(userEnrollments);

        setIsConfirmModalOpen(false);
        setPaymentLink(selectedPaymentLink);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error("Error al inscribirse en el curso:", error.message);
      }
    }
  };

  const handleCoursePendingEnrollmentStatus = (id) => {
    if (!isEnrolled(id)) {
      // logic to pending course enrollment
    }
  };

  const shouldPendingButton = (id) => {
    if (isEnrolled(id)) {
      return isPending(id);
    }
    return false;
  };

  const shouldShowButton = (id) => {
    if (isEnrolled(id)) {
      return isPaid(id);
    }
    return false;
  };

  return (
    <>
      <PageHeader title="Cursos" />

      
      <ListWithTitle
        title=""
        items={coursesNames}
        hasAdd={user.user_role_id === 3 || user.user_role_id === 4}
        buttonAddRoute={
          user.user_role_id === 3 || user.user_role_id === 4
            ? `/platform/courses/new`
            : null
        }
        hasShow={(id) => shouldShowButton(id)}
        hasShowIcon={<FaChalkboardTeacher className="text-show-link" size={24}/>}
        buttonShowRoute={(id) => `/platform/courses/${id}`}
        hasEdit={user.user_role_id === 3 || user.user_role_id === 4}
        buttonEditRoute={(id) =>
          user.user_role_id === 3 || user.user_role_id === 4
            ? `/platform/courses/${id}/edit`
            : null
        }
        hasDelete={user.user_role_id === 3 || user.user_role_id === 4}
        buttonDeleteRoute={handleDeleteCourse}
        columnName="name"
        confirmModalText="¿Estás seguro de que deseas eliminar este curso?"
        hasExtraButton={(id) => !isEnrolled(id)}
        extraButtonTitle={(id) => (isEnrolled(id) ? "Inscrito" : "Matricular")}
        extraButtonIcon={<FiDollarSign className="text-yellow-500 hover:text-yellow-400" size={24} />}
        onExtraButtonClick={handleCourseEnrollement}
        hasExtraButton2={(id) => isPending(id)}
        extraButtonTitle2={(id) => isPending(id) && "Pendiente de aprobación"}
        extraButtonIcon2={
          <FiClock className="disabled text-gray-400 cursor-not-allowed" />
        }
        onExtraButtonClick2={handleCoursePendingEnrollmentStatus}
      />

      <ConfirmEnrollmentModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmEnrollment}
        paymentMethods={paymentMethods}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        setSelectedPaymentLink={setSelectedPaymentLink}
        setSelectedPaymentMethodCurrency={setSelectedPaymentMethodCurrency}
        message={`Continuar con la inscripción al curso "${selectedCourse?.name}"`}
      />

      <PaymentLinkModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentLink={selectedPaymentLink}
      />

    </>
  );
}
