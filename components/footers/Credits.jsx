"use client";

import Link from "next/link";

export default function Credits() {

  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME

  const developerInfo = {
    name: "Ezequiel",
    middleName: "Matias",
    surname: "Tartaglia",
    email: "ezequielmtartaglia@gmail.com",
    linkedin: "https://www.linkedin.com/in/ezequieltartaglia",
    github: "https://github.com/ezequieltartaglia",
  };

  const middleInitial = developerInfo.middleName ? developerInfo.middleName.charAt(0) : '';

  const currentYear = new Date().getFullYear();

  return (
      <div className="bg-secondary text-primary p-1 text-center font-semibold">
        {systemName}&#174; | Desarrollado por 
        <Link
          href={developerInfo.linkedin}
          className="text-title-active inline-flex items-center justify-center mx-1"
        >
           {developerInfo.name} {middleInitial}. {developerInfo.surname}
        </Link>
        | Todos los derechos reservados {currentYear}&copy;
      </div>
  );
}
