import { useTranslation } from "react-i18next";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import stopPuppyImg from "src/assets/stop-puppy.png";
import { LoginButton } from "src/components/ui";
import { useAuthContext } from "src/contexts";

export function NotAuthorized() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const {
    values: { user },
    functions: { logout },
  } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="flex flex-col gap-8 sm:flex-row sm:gap-6 p-8 sm:p-12 lg:gap-8 lg:p-20 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 items-center border-b">
      <div className="w-full text-center sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl mb-5">{t("403")}</h1>
          <p className="text-4xl mb-5">{t("notAuthorized")}</p>
          <p className="text-2xl mb-5">{t("notAuthorizedParagraph")}</p>
          {user ? (
            <button
              onClick={handleLogout}
              className={`font-primary flex flex-row justify-center items-center p-2 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer`}
            >
              <CiLogout size={20} />
              <span className="ml-2">{t("Logout")}</span>
            </button>
          ) : (
            <LoginButton size="lg" />
          )}
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center">
        <img className="h-60 sm:h-80" src={stopPuppyImg} alt="sad puppy" />
      </div>
    </main>
  );
}
