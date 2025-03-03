"use client";

import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import {
  addSale,
  getLastSale,
  closeSale,
} from "@/src/controllers/platform/sale/sale";
import { FiPlus } from "react-icons/fi";

export default function ClosePreviusSaleAndCreateNewOneButton({
  saleId,
  customClasses = `p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2`,
  onClick,
  text,
  Icon = FiPlus,
  title = "Crear venta",
}) {
  const { user } = useUserInfoContext();
  const router = useRouter();

  const handleClosesale = async () => {
    try {
      await closeSale(saleId);
      console.log("Venta cerrada con éxito.");
    } catch (error) {
      console.error("Error trying to close sale:", error);
      throw error;
    }
  };

  const createNewSale = async () => {
    try {
      if (user) {
        await addSale(
          user.id,
          new Date().toISOString(),
          0,
          false,
          user.platform_user_business_id
        );
        const lastSale = await getLastSale(user.id);
        router.push(`/platform/sales/${lastSale.id}`);
      }
    } catch (error) {
      console.error("Error creating a new sale:", error);
    }
  };

  const handleButtonClick = async () => {
    try {
      await handleClosesale();

      setTimeout(async () => {
        await createNewSale();
      }, 2000);

      if (onClick) {
        await onClick();
      }
    } catch (error) {
      console.error("Error in handleButtonClick:", error);
    }
  };

  return (
    <button className={customClasses} onClick={handleButtonClick} title={title}>
      {text && text} <Icon size={20} />
    </button>
  );
}
