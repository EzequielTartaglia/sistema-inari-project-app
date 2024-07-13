"use client";

import {
  getCourseFormats,
  deleteCourseFormat,
} from "@/src/models/platform/course_format/course_format";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";

export default function CoursesFormatsPage() {
  const { user } = useUserInfoContext();

  const [coursesFormatsNames, setCoursesFormatsNames] = useState([]);
  
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCoursesFormatsNames() {
      try {
        const names = await getCourseFormats();
        setCoursesFormatsNames(names);
      } catch (error) {
        console.error(
          "Error al obtener los nombres de los formatos:",
          error.message
        );
      }
    }
    fetchCoursesFormatsNames();
  }, []);

  const handleDeleteCourseFormat = async (id) => {
    try {
      await deleteCourseFormat(id);
      setCoursesFormatsNames((prevNames) =>
        prevNames.filter((courses_format) => courses_format.id !== id)
      );
      showNotification("¡Formato eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar formato:", error.message);
    }
  };

  return (
    <>
      <PageHeader title={"Formatos"} />

        <ListWithTitle
          title=""
          hasAdd={user.user_role_id === 3 || user.user_role_id === 4}
          buttonAddRoute={
            user.user_role_id === 3 || user.user_role_id === 4
              ? `/platform/course_formats/new`
              : null
          }
          items={coursesFormatsNames}
          buttonShowRoute={(id) => `/platform/course_formats/${id}`}
          hasEdit={user.user_role_id === 3 || user.user_role_id === 4}
          buttonEditRoute={(id) => (user.user_role_id === 3 || user.user_role_id === 4) ? `/platform/course_formats/${id}/edit` : null}
          hasDelete={user.user_role_id === 3 || user.user_role_id === 4}
          buttonDeleteRoute={handleDeleteCourseFormat}
          columnName="name"
          confirmModalText="¿Estás seguro de que deseas eliminar este formato?"
          hasShow={(id) => null}
        />
    </>
  );
}
