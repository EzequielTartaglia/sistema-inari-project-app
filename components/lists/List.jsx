import { useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSettings } from "react-icons/fi";
import ConfirmModal from "../ConfirmModal";
import Link from "next/link";
import formatDate from "@/src/helpers/formatDate";

export default function List({
  list,
  buttonShowRoute = null,
  buttonEditRoute = null,
  buttonDeleteRoute = null,
  buttonAddRoute = null,
  columnName = "name",
  columnNameIsDate,
  labelColumnName2,
  columnName2,
  labelColumnName3,
  columnName3,
  confirmModalText,
  hasShow = (id) => false,
  hasShowIcon = <FiEye className="text-show-link" size={24}/>,
  hasEdit = true,
  hasDelete = true,
  hasExtraButton = () => false,
  extraButtonIcon = <FiSettings className="text-title-active" size={24}/>,
  extraButtonTitle = () => "",
  onExtraButtonClick,
  hasExtraButton2 = () => false,
  extraButtonIcon2 = <FiSettings className="text-title-active" size={24}/>,
  extraButtonTitle2 = () => "",
  onExtraButtonClick2,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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

  const sortedList = list.sort((a, b) => {
    const aValue = a[columnName] ? String(a[columnName]) : "";
    const bValue = b[columnName] ? String(b[columnName]) : "";
    return aValue.localeCompare(bValue);
  });

  return (
    <>
      <div className="relative">
        {buttonAddRoute && (
          <Link href={buttonAddRoute}>
            <button
              className="p-2 rounded-full bg-secondary text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 absolute top-0 right-0 mt-2 mr-2"
              title="Agregar"
            >
              <FiPlus size={24} />
            </button>
          </Link>
        )}
        <ul className="flex flex-col gap-5 text-primary list-none p-0 w-full">
          {sortedList.map((item) => (
            <li
              key={item.id}
              className="bg-primary rounded-md px-6 py-3 shadow-md transition duration-300 hover:-translate-y-1 bg-secondary w-full border-primary relative flex items-center justify-between"
            >
              <div className="flex items-center space-x-2 overflow-hidden truncate sm:truncate max-w-[400px]">
                <div className="pr-16 sm:pr-16 md:pr-0 lg:pr-0">
                  <span>{columnNameIsDate ? formatDate(item[columnName]) : item[columnName]}</span>{" "}
                  {labelColumnName2 && (
                    <span className="ml-3 mr-3">
                      {labelColumnName2}: {item[columnName2]}
                    </span>
                  )}
                  {labelColumnName3 && (
                    <span className="ml-3 mr-3">
                      {labelColumnName3}: {item[columnName3]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasExtraButton(item.id) && (
                  <button
                    className="ml-2"
                    title={extraButtonTitle(item.id)}
                    onClick={() => onExtraButtonClick(item.id)}
                  >
                    {extraButtonIcon}
                  </button>
                )}
                {hasExtraButton2(item.id) && (
                  <button
                    className="ml-2"
                    title={extraButtonTitle2(item.id)}
                    onClick={() => onExtraButtonClick2(item.id)}
                  >
                    {extraButtonIcon2}
                  </button>
                )}
                {hasShow(item.id) && (
                  <Link
                    href={buttonShowRoute(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Ver detalles"
                  >
                    {hasShowIcon}
                  </Link>
                )}
                {hasEdit && (
                  <Link
                    href={buttonEditRoute(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Editar"
                  >
                    <FiEdit className="text-edit-link" size={24}/>
                  </Link>
                )}
                {hasDelete && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Eliminar"
                  >
                    <FiTrash2 className="text-delete-link" size={24}/>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message={confirmModalText}
      />
    </>
  );
}
