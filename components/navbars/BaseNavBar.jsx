import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAside } from "@/contexts/AsideContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import LoginForm from "../forms/login/LoginForm";
import ConfirmModal from "../ConfirmModal";
import Button from "../Button";
import Logo from "../Logo";
import SubMenu from "./Submenu";
import { FiChevronDown, FiUser } from "react-icons/fi";

import Link from "next/link";
import Image from "next/image";
import AsidePlatformMenu from "./platform/AsidePlatformMenu";

export default function BaseNavBar({ mainMenu, toggleMenuItems, loginInfo }) {
  const { user, userLogout } = useUserInfoContext();
  const { isAsideOpen, toggleAside, closeAside } = useAside();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState({});

  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes("/platform");

  useEffect(() => {
    document.body.style.overflow = isAsideOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAsideOpen]);

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
      <nav className="bg-primary p-2 flex items-center justify-between z-20">
        <div className="p-2 ml-3">{!isPlatformRoute && <Logo />}</div>
        <div className="flex items-center space-x-4">
          {mainMenu.map((item) => (
            <Button
              key={item.id}
              route={item.route}
              text={item.text}
              customClasses="block text-primary shadow-none py-2 px-4 text-title hover:bg-gold hover:text-primary"
            />
          ))}
          {!isPlatformRoute && (
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
          )}
          {isPlatformRoute && user && (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:flex text-primary">
                {getGreeting(user.platform_user_gender_id)}, <br />
                <span className="text-title-active-static">
                  {user.first_name} {user.last_name}
                </span>
                !
              </span>
              <span className="flex sm:hidden text-primary">
                <span className="text-title-active-static">
                  {user.first_name} {user.last_name}
                </span>
              </span>
              <Link href="/platform/user/profile" passHref>
                <button>
                  <Image
                    src="/account.png"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                </button>
              </Link>
            </div>
          )}
          {isPlatformRoute && !user && <Logo />}
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
      >
        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-center items-center p-4 pb-0">
              {user ? (
                <div className="flex flex-col items-center">
                  <Link href="/platform/user/profile" passHref>
                    <button>
                      <Image
                        src="/account.png"
                        alt="User Avatar"
                        width={100}
                        height={100}
                        className="rounded-full h-16 w-16 object-cover"
                      />
                    </button>
                  </Link>
                  <div className="text-center text-primary mt-2">
                    {getGreeting(user.platform_user_gender_id)}, <br />
                    <span className="text-title-active-static">
                      {user.first_name} {user.last_name}
                    </span>
                    !
                  </div>
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
              {toggleMenuItems.map((item) => (
                <div key={item.id} className="relative">
                  <Button
                    route={item.route}
                    text={item.text}
                    icon={item.subMenu && <FiChevronDown size={24} />}
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
      {isPlatformRoute && <AsidePlatformMenu menuItems={toggleMenuItems} />}
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
