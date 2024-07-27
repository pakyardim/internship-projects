import { useTranslation } from "react-i18next";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export function LoginButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttonSize = {
    sm: "w-20 h-8",
    md: "w-20 h-8 sm:w-24 sm:h-10 lg:h-12 lg:w-28",
    lg: "w-28 h-12",
  };

  return (
    <button
      onClick={() => navigate("/login")}
      className={`${buttonSize[size]} font-primary flex flex-row justify-center items-center p-2 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer`}
    >
      <CiLogin size={20} />
      <span className="ml-2">{t("Log in")}</span>
    </button>
  );
}
