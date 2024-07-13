"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheck, FiEdit, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../ConfirmModal";

export default function Table({
  columns,
  data,
  title,
  columnAliases,
  hasAdd = true,
  hasShow = true,
  hasEdit = true,
  hasDelete = true,
  hasApprove = (item) => false,
  buttonAddRoute,
  buttonShowRoute,
  buttonEditRoute,
  buttonDeleteRoute,
  buttonApproveRoute,
  confirmModalText,
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(data.length === 0);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleDelete = (id) => {
    setCurrentId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (buttonDeleteRoute) {
      buttonDeleteRoute(currentId);
    }
    setIsModalOpen(false);
    setCurrentId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentId(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      setIsMediumScreen(window.innerWidth >= 640 && window.innerWidth < 1224);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="table-box font-semibold">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-white border-opacity-25 px-6 py-2"
                >
                  {columnAliases[column] || column}
                </th>
              ))}
              {(hasShow || hasEdit || hasDelete || hasApprove) && (
                <th className="border border-white border-opacity-25 px-6 py-2">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center p-2 rounded-lg"
              >
                <div className="flex justify-center items-center h-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 spinner-border border-opacity-50"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${title ? "box-theme" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">
            {title && title}
          </h3>
          {hasAdd && buttonAddRoute && (
            <Link href={buttonAddRoute}>
              <button
                className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
                title="Agregar"
              >
                <FiPlus size={24} />
              </button>
            </Link>
          )}
        </div>
        <div className="table-box font-semibold">
          <table className="min-w-full border border-gray-200">
            {!isSmallScreen && !isMediumScreen && (
              <thead>
                <tr className="box-theme">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-white border-opacity-25 px-6 py-2"
                    >
                      {columnAliases[column] || column}
                    </th>
                  ))}
                  {(hasShow || hasEdit || hasDelete || hasApprove) && (
                    <th className="border border-white border-opacity-25 px-6 py-2">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
            )}
            <tbody>
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center p-2 text-primary bg-secondary"
                >
                  No hay nada que mostrar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isSmallScreen || isMediumScreen) {
    return (
      <div className={`${title ? "box-theme" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">
            {title && title}
          </h3>
          {hasAdd && buttonAddRoute && (
            <Link href={buttonAddRoute}>
              <button
                className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
                title="Agregar"
              >
                <FiPlus size={24} />
              </button>
            </Link>
          )}
        </div>
        <div className="border table-box font-semibold mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, rowIndex) => (
                <tr key={rowIndex} className="bg-black">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium table-row-primary">
                    {columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex flex-wrap items-center p-2"
                      >
                        <div className="text-sm font-medium">
                          {columnAliases[column] || column}:
                        </div>
                        <div className="text-sm ml-2 break-words text-title-active-static">
                          {item[column]}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center mt-4">
                      {(hasShow || hasEdit || hasDelete || hasApprove) && (
                        <>
                          {hasShow && (
                            <Link href={buttonShowRoute(item.id)}>
                              <a
                                className="text-blue-600 hover:text-blue-900 mr-4"
                                title="Ver"
                              >
                                <FiEye className="text-lg" size={24}/>
                              </a>
                            </Link>
                          )}
                          {hasEdit && (
                            <Link href={buttonEditRoute(item.id)}>
                              <a
                                className="text-yellow-600 hover:text-yellow-900 mr-4"
                                title="Editar"
                              >
                                <FiEdit className="text-lg" size={24}/>
                              </a>
                            </Link>
                          )}
                          {hasApprove(item) && (
                            <button
                              title="Aprobar"
                              onClick={() => buttonApproveRoute(item.id)}
                              className="text-green-500 hover:text-green-700"
                            >
                              <FiCheck className="ml-2 text-edit-link" size={24}/>
                            </button>
                          )}
                          {hasDelete && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <FiTrash2 className="text-lg" size={24}/>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={confirmDelete}
            message={confirmModalText}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${title ? "box-theme" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary">{title && title}</h3>
        {hasAdd && buttonAddRoute && (
          <Link href={buttonAddRoute}>
            <button
              className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
              title="Agregar"
            >
              <FiPlus size={24} />
            </button>
          </Link>
        )}
      </div>
      <div className="table-box font-semibold">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-white border-opacity-25 px-6 py-2"
                >
                  {columnAliases[column] || column}
                </th>
              ))}
              {(hasShow || hasEdit || hasDelete || hasApprove) && (
                <th className="border border-white border-opacity-25 px-6 py-2">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-white border-opacity-25 px-6 py-2 text-center"
                  >
                    {item[column]}
                  </td>
                ))}
                {(hasShow || hasEdit || hasDelete || hasApprove) && (
                  <td className="border border-white border-opacity-25 px-6 py-2">
                    <div className="flex justify-center space-x-4">
                      {hasShow && (
                        <Link href={buttonShowRoute(item.id)}>
                          <a
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver"
                          >
                            <FiEye className="text-lg" size={24}/>
                          </a>
                        </Link>
                      )}
                      {hasEdit && (
                        <Link href={buttonEditRoute(item.id)}>
                          <a
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <FiEdit className="text-lg" size={24}/>
                          </a>
                        </Link>
                      )}
                      {hasApprove(item) && (
                        <button
                          title="Aprobar"
                          onClick={() => buttonApproveRoute(item.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FiCheck className="ml-2 text-edit-link" size={24}/>
                        </button>
                      )}
                      {hasDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <FiTrash2 className="text-lg" size={24}/>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          message={confirmModalText}
        />
      </div>
    </div>
  );
}
