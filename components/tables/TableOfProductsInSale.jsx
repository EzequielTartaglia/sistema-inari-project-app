"use client";

import { useEffect, useState } from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

export default function TableOfProductsInSale({
  columns,
  data,
  title,
  columnAliases,
  quantityToAdd,
  setQuantityToAdd,
  hasCustomButton = (item) => false,
  buttonCustomRoute,
  buttonCustomIcon = <FiCheck className="text-lg" size={24} />,
  quantityChangeEvent = (e) => setQuantityToAdd(Math.max(1, e.target.value)),
  customButton,
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(data.length === 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const PageNumbers = () => {
    if (data.length <= itemsPerPage) return null;

    return (
      <div className="flex justify-center my-4">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronsLeft />
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronRight />
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronsRight />
        </button>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="table-box font-semibold">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-white border-opacity-25 py-2 text-center"
                >
                  {columnAliases[column] || column}
                </th>
              ))}
              {hasCustomButton && (
                <th className="border border-white border-opacity-25 py-2 text-center">
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

  // No data state
  if (data.length === 0) {
    return (
      <div className={`${title ? "box-theme text-title-active-static" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-title-active-static">
            {title && title}
          </h3>
          {customButton && <>{customButton}</>}
        </div>
        <div className="table-box font-semibold">
          <table className="min-w-full border border-gray-200">
            {!isSmallScreen && (
              <thead>
                <tr className="box-theme">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-white border-opacity-25 py-2 text-center"
                    >
                      {columnAliases[column] || column}
                    </th>
                  ))}
                  {hasCustomButton && (
                    <th className="border border-white border-opacity-25 py-2 text-center">
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
                  className="text-center p-2 text-primary border border-white border-opacity-25 px-6 py-2"
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

  return (
    <div className={`${title ? "box-theme text-title-active-static" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-title-active-static">
          {title && title}
        </h3>
        {customButton && <>{customButton}</>}
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
              {hasCustomButton && (
                <th className="border border-white border-opacity-25 px-6 py-2">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-white border-opacity-25 px-6 py-2"
                  >
                    <span className="ml-2 break-words text-primary">
                      {item[column]}
                    </span>
                  </td>
                ))}
                {hasCustomButton && item.quantity > 0 && (
                  <td className="border border-white border-opacity-25 px-6 py-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProductId === item.id}
                        onChange={() => {
                          setSelectedProductId(
                            selectedProductId === item.id ? null : item.id
                          );
                          setQuantityToAdd(1);
                        }}
                        className="mr-2"
                      />
                      <input
                        type="number"
                        min="1"
                        max={item.quantity} 
                        value={
                          selectedProductId === item.id ? quantityToAdd : ""
                        }
                        onChange={(e) => {
                          const value = Math.max(1, e.target.value);
                          if (value <= item.quantity) {
                            setQuantityToAdd(value);
                          } else {
                            setQuantityToAdd(item.quantity);
                          }
                        }}
                        className="border border-gray-300 rounded p-1 w-16 mr-2"
                        disabled={selectedProductId !== item.id}
                        placeholder="1"
                      />
                      <button
                        onClick={() =>
                          buttonCustomRoute(item.id, quantityToAdd)
                        }
                        className="px-2 py-1 rounded-md shadow-md  transition duration-300 bg-primary border-primary-light hover:border-green-500 text-show-link font-semibold gradient-button"
                      >
                        {buttonCustomIcon}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <PageNumbers />
      </div>
    </div>
  );
}
