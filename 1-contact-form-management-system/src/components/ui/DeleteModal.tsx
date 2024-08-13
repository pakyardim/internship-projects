import { useTranslations } from "next-intl";
import React from "react";
import { MdDeleteOutline, MdOutlineCancel } from "react-icons/md";

interface Props {
  onDelete: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DeleteModal = ({ onDelete, onCancel, isLoading }: Props) => {
  const t = useTranslations();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="dark:border-light shadow-custom border border-darkBackground dark:bg-dark dark:text-light/90 bg-light flex flex-col gap-y-10 text-black font-primary p-8 shadow-lg max-w-xs sm:max-w-sm w-full">
        <div className="w-full flex justify-between">
          <div className="flex-1 text-center">
            <h2 className="font-bold text-xl">{t("Are you sure?")}</h2>
            <p className="text-sm mt-2">{t("This action cannot be undone")}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="font-primary flex flex-row justify-center items-center text-xs sm:text-sm p-0.5 sm:p-2 border-2 text-cyan-600 border-cyan-600 font-semibold hover:text-white hover:bg-cyan-600 duration-300 cursor-pointer disabled:opacity-50"
          >
            <MdOutlineCancel />
            <span className="ml-2">{t("cancel")}</span>
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="font-primary flex flex-row justify-center items-center text-xs sm:text-sm p-0.5 sm:p-2 border-2 text-primary border-primary font-semibold hover:text-white hover:bg-primary duration-300 cursor-pointer disabled:opacity-50"
          >
            <MdDeleteOutline size={18} />
            <span className="ml-2">{t("delete")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
