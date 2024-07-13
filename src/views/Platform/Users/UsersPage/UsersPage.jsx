"use client";

import {
  getPlatformUsers,
  deletePlatformUser,
} from "@/src/models/platform/platform_user/platform_user";
import { getPlatformUserRoles } from "@/src/models/platform/platform_user_role/platform_user_role";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import PageBody from "@/components/page_formats/PageBody";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchUsersAndRoles() {
      try {
        const fetchedUsers = await getPlatformUsers();
        const fetchedRoles = await getPlatformUserRoles();

        setUsers(fetchedUsers);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchUsersAndRoles();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const userToDelete = users.find((user) => user.id === id);
      if (userToDelete && userToDelete.user_role_id === 6) {
        showNotification("No se puede eliminar este usuario.", "danger");
        return;
      }

      await deletePlatformUser(id);

      showNotification("Usuario eliminado exitosamente!", "info");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const columns = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "user_role",
    "is_active",
  ];
  const columnAliases = {
    first_name: "Nombre",
    last_name: "Apellido",
    phone: "Celular",
    email: "Correo Electrónico",
    user_role: "Rol",
    is_active: "Actividad",
  };

  const filteredData = users.map((user) => {
    const userRole = roles.find((role) => role.id === user.user_role_id);
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      user_role: userRole ? userRole.name : "N/A",
      is_active: user.is_active ? "En linea" : "Desconectado",
    };
  });

  const hasApprove = (item) => {
    return;
  };

  return (
    <>
      <PageHeader title={"Usuarios"} />

      <PageBody>
        <Table
          title={"Usuarios registrados"}
          buttonAddRoute={
            user.user_role_id === 3 || user.user_role_id === 4
              ? `/platform/users/sign_up`
              : null
          }
          columns={columns}
          data={filteredData}
          columnAliases={columnAliases}
          hasShow={false}
          hasEdit={false}
          hasDelete={true}
          buttonDeleteRoute={handleDeleteUser}
          hasApprove={hasApprove}
          confirmModalText={
            "¿Estás seguro de que deseas eliminar este usuario?"
          }
        />
      </PageBody>
    </>
  );
}
