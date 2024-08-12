"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type SnackbarType = "success" | "error";

interface Props {
  message: string;
  isVisible: boolean;
  type: SnackbarType;
  onClose: () => void;
}

export function Snackbar({ message, isVisible, type, onClose }: Props) {
  const t = useTranslations();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onAnimationEnd={onClose}
      className={`snackbar z-30 fixed bottom-4 right-4 p-4 rounded shadow-md transition-opacity duration-500
        ${type === "success" ? "bg-green-500" : "bg-primary"} text-white ${
        isVisible ? "show" : "hide"
      }`}
    >
      {message ? message : t("defaultError")}
    </div>
  );
}
