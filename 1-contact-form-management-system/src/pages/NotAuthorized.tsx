import { useTranslation } from "react-i18next";
import stopPuppyImg from "src/assets/stop-puppy.png";
import { LoginButton } from "src/components/ui/LoginButton";

export function NotAuthorized() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col gap-8 sm:flex-row sm:gap-6 p-8 sm:p-12 lg:gap-8 lg:p-20 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 items-center border-b">
      <div className="w-full text-center sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl mb-5">403</h1>
          <p className="text-4xl mb-5">{t("notAuthorized")}</p>
          <p className="text-2xl mb-5">{t("notAuthorizedParagraph")}</p>
          <LoginButton size="lg" />
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center">
        <img className="h-60 sm:h-80" src={stopPuppyImg} alt="sad puppy" />
      </div>
    </main>
  );
}
