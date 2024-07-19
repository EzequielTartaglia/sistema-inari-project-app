"use client";

import { useState } from "react";
import LoginForm from "../forms/login/LoginForm";
import ConfirmModal from "../ConfirmModal";
import Button from "../Button";
import Logo from "../Logo";
import SubMenu from "./Submenu";
import { FiChevronDown } from "react-icons/fi";
import { useAside } from "@/contexts/AsideContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import Link from "next/link";
import Image from "next/image";

export default function BaseNavBar({ mainMenu, toggleMenuItems, loginInfo }) {
  const { user, userLogout } = useUserInfoContext();
  const { isAsideOpen, toggleAside, closeAside } = useAside();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [activeSubMenu, setActiveSubMenu] = useState({});

  const toggleSubMenu = (id) => {
    setActiveSubMenu((prevSubMenu) => ({
      ...prevSubMenu,
      [id]: !prevSubMenu[id],
    }));
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    userLogout();
    setIsModalOpen(false);
  };

  const getGreeting = (genderId) => {
    if (genderId === 1) {
      return "¡Bienvenido";
    } else if (genderId === 2) {
      return "¡Bienvenida";
    } else {
      return "Hola";
    }
  };

  return (
    <div className="header font-semibold">
      <nav className="bg-primary p-2 flex items-center justify-between">
        <div className="p-2 ml-3">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          {mainMenu.map((item) => (
            <Button
              key={item.id}
              route={item.route}
              text={item.text}
              customClasses="block text-primary shadow-none py-2 px-4 text-title hover:bg-gold hover:text-primary"
            />
          ))}
          <button
            id="hamburger-btn"
            className="text-primary focus:outline-none text-title px-3 py-2"
            onClick={toggleAside}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
      {isAsideOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeAside}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-primary bg-opacity-90 z-20 transition-transform transform ${
          isAsideOpen ? "translate-x-0" : "-translate-x-full"
        } w-4/5 sm:w-4/5 md:w-2/6 lg:w-1/4`}
        style={{ overflowY: "auto", maxHeight: "100vh" }}
        onMouseEnter={() => (document.body.style.overflow = "hidden")}
        onMouseLeave={() => (document.body.style.overflow = "auto")}
      >
        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-center items-center p-4 pb-0">
              {user ? (
                <div className="flex justify-center items-center">
                  <Link href="/platform/user/profile" passHref>
                    <button>
                      <Image
                        src="/account.png"
                        alt="User Avatar"
                        width={200}
                        height={200}
                        className="rounded-full h-16 w-16 object-cover"
                      />
                    </button>
                  </Link>
                </div>
              ) : (
                <Logo />
              )}

              <button
                className="text-primary focus:outline-none text-title px-3 py-2 absolute right-0 top-0"
                onClick={closeAside}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {user && (
                <div className="flex justify-center items-center mb-4">
                  <span className="text-center text-primary">
                    {getGreeting(user.platform_user_gender_id)}, <br />
                    <span className="text-title-active-static">
                      {user.first_name} {user.last_name}
                    </span>
                    !
                  </span>
                </div>
              )}
              {toggleMenuItems.map((item) => (
                <div key={item.id} className="relative">
                  <Button
                    route={item.route}
                    text={item.text}
                    icon={item.subMenu && <FiChevronDown size={24}/>}
                    customClasses="block text-primary py-2 px-4 shadow-none text-title border-none hover:bg-gold hover:text-primary"
                    customFunction={() => toggleSubMenu(item.id)}
                  />
                  {item.subMenu && (
                    <SubMenu
                      subMenuItems={item.subMenu}
                      isVisible={activeSubMenu[item.id]}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {loginInfo && !user && (
            <div className="p-4">
              <div className="flex justify-center items-center mb-4">
                <button
                  className="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
                  onClick={() =>
                    openModal(<LoginForm onCloseModal={closeModal} />)
                  }
                >
                  {loginInfo.text}
                </button>
              </div>
            </div>
          )}
          {user && (
            <div className="p-4">
              <div className="flex justify-center items-center mb-4">
                <Button
                  customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
                  customFunction={() =>
                    openModal(
                      <ConfirmModal
                        isOpen={true}
                        onClose={closeModal}
                        onConfirm={handleLogout}
                        message={"¿Estás seguro que deseas cerrar sesión?"}
                      />
                    )
                  }
                  text={"Salir"}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary p-6 rounded-lg shadow-lg text-center">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}
