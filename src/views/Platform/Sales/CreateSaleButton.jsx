"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { addSale, getLastSale } from "@/src/models/platform/sale/sale";
import Button from "@/components/Button";
import { FiPlus } from "react-icons/fi";

export default function CreateSaleButton({ onClick, text }) {
  const { user } = useUserInfoContext();
  const router = useRouter();

  const createNewSale = async () => {
    try {
      if (user) {
        await addSale(user.id, new Date().toISOString(), 0, false);

        const lastSale = await getLastSale(user.id);

        router.push(`/platform/sales/${lastSale.id}`);
      }
    } catch (error) {
      console.error("Error creating a new sale:", error);
    }
  };

  const handleButtonClick = async () => {
    try {
      if (onClick) {
        await onClick();
      }
      await createNewSale();
    } catch (error) {
      console.error("Error in handleButtonClick:", error);
    }
  };

  return (
    <button
      className={`p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2`}
      onClick={handleButtonClick}
      title={"Crear venta"}
    >
      {text} <FiPlus size={24} />
    </button>
  );
}
