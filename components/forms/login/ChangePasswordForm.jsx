"use client";

import { changeUserPassword } from "@/src/models/platform/platform_user/platform_user";
import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import PageHeader from "@/components/page_formats/PageHeader";
import Input from "@/components/forms/Input";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function ChangePasswordForm() {
  const { user } = useUserInfoContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!currentPassword) {
      errors.currentPassword = "Campo obligatorio";
    }

    if (!newPassword) {
      errors.newPassword = "Campo obligatorio";
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Las nuevas contraseñas no coinciden";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      await changeUserPassword(user.id, currentPassword, newPassword);

      showNotification("¡Contraseña cambiada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/platform/user/profile");
      }, 2000);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error.message);

      if (error.message.includes("Contraseña actual incorrecta")) {
        setFormErrors({ currentPassword: "Contraseña actual incorrecta." });
      } else {
        setFormErrors({
          general: "Error al cambiar la contraseña. Inténtalo de nuevo.",
        });
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }

    setFormErrors({
      ...formErrors,
      [name]: undefined,
    });
  };

  return (
    <>
      <PageHeader
        title="Cambiar Contraseña"
        goBackRoute="/platform/user/profile"
        goBackText="Volver al perfil"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Contraseña Actual"
          name="currentPassword"
          type="password"
          value={currentPassword}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.currentPassword}
        />

        <Input
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          value={newPassword}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.newPassword}
        />

        <Input
          label="Confirmar Nueva Contraseña"
          name="confirmNewPassword"
          type="password"
          value={confirmNewPassword}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.confirmNewPassword}
        />

        {formErrors.general && (
          <p className="text-delete-link-active mt-2 font-semibold">
            {formErrors.general}
          </p>
        )}

        <SubmitLoadingButton
          type="submit"
          isLoading={isLoading}
          submitText="Cambiar Contraseña"
        >
          Cambiar Contraseña
        </SubmitLoadingButton>
      </form>
    </>
  );
}
