"use client";

import { getPlatformUserRole } from "@/src/models/platform/platform_user_role/platform_user_role";
import { getCountry } from "@/src/models/platform/country/country";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import Button from "@/components/Button";
import PageBody from "@/components/page_formats/PageBody";
import PageHeader from "@/components/page_formats/PageHeader";
import Image from "next/image";

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
        <div className="box-theme p-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image
                  src="/account.png"
                  alt="User Avatar"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-600">
                {userRole?.name}
              </p>
            </div>
            <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
              <Button
                customClasses="rounded-md bg-primary border-card-detail text-title-active-static font-semibold"
                route={"/platform/user/profile/settings"}
                isAnimated={false}
                title="Editar"
                text={"Editar"}
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl text-primary">
              Detalles de usuario
            </h3>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-title-active-static">Dirección de correo electrónico:</h3>
              <p className="text-primary">{user.email}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-title-active-static">País:</h3>
              <p className="text-primary">{userCountry?.name}</p>
            </div>
          </div>
        </div>
    </>
  );
}
