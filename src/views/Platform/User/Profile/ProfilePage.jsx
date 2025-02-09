"use client";

import { getPlatformUserRole } from "@/src/controllers/platform/platform_user_role/platform_user_role";
import { getCountry } from "@/src/controllers/platform/country/country";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import UserCard from "./UserCard";

export default function ProfilePage() {
  const { user } = useUserInfoContext();
  const [userRole, setUserRole] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const role = await getPlatformUserRole(user.user_role_id);
        setUserRole(role);
        const country = await getCountry(user.country_id);
        setUserCountry(country);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user role:", error.message);
        setIsLoading(false);
      }
    }
    fetchUserRole();
  }, [user.country_id, user.user_role_id]);

  return (
    <>
      <PageHeader
        title={"Mi perfil"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <UserCard
        currentUser={user}
        currentUserRole={userRole}
        currentUserCountry={userCountry}
      />
    </>
  );
}
