import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type SnackbarType = "success" | "error";

interface Props {
  message: string;
  type: SnackbarType;
  onClose: () => void;
}

export function Snackbar({ message, type, onClose }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`snackbar z-30 fixed bottom-4 right-4 p-4 rounded shadow-md transition-opacity duration-500
        ${type === "success" ? "bg-green-500" : "bg-primary"} text-white`}
    >
      {t(message)}
    </div>
  );
}
