"use client";

import {
  getCoursePlatformTools,
  deleteCoursePlatformTool,
} from "@/src/models/platform/course_platform_tool/course_platform_tool";

import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";

export default function CoursesPlatformToolsPage() {
  const { user } = useUserInfoContext();

  const [coursesPlatformToolsNames, setCoursesPlatformToolsNames] = useState(
    []
  );

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCoursesPlatformToolsNames() {
      try {
        const names = await getCoursePlatformTools();
        setCoursesPlatformToolsNames(names);
      } catch (error) {
        console.error(
          "Error al obtener los nombres de las herramientas:",
          error.message
        );
      }
    }
    fetchCoursesPlatformToolsNames();
  }, []);

  const handleDeleteCoursePlatformTool = async (id) => {
    try {
      await deleteCoursePlatformTool(id);
      setCoursesPlatformToolsNames((prevNames) =>
        prevNames.filter(
          (courses_platform_tool) => courses_platform_tool.id !== id
        )
      );
      showNotification("¡Herramienta eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar la herramienta:", error.message);
    }
  };

  return (
    <>
      <PageHeader title={"Herramientas"} />

        <ListWithTitle
          title=""
          items={coursesPlatformToolsNames}
          hasAdd={user.user_role_id === 3 || user.user_role_id === 4}
          buttonAddRoute={
            user.user_role_id === 3 || user.user_role_id === 4
              ? `/platform/course_platform_tools/new`
              : null
          }
          hasShow={(id) => null}
          buttonShowRoute={(id) => `/platform/course_platform_tools/${id}`}
          hasEdit={user.user_role_id === 3 || user.user_role_id === 4}
          buttonEditRoute={(id) =>
            user.user_role_id === 3 || user.user_role_id === 4
              ? `/platform/course_platform_tools/${id}/edit`
              : null
          }
          hasDelete={user.user_role_id === 3 || user.user_role_id === 4}
          buttonDeleteRoute={handleDeleteCoursePlatformTool}
          columnName="name"
          confirmModalText="¿Estás seguro de que deseas eliminar esta herramienta?"
        />
    </>
  );
}
