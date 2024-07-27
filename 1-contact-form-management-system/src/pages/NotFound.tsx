import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import sadPuppyImg from "src/assets/sad-puppy.png";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col gap-8 sm:flex-row sm:gap-6 p-8 sm:p-12 lg:gap-8 lg:p-20 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 items-center border-b">
      <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div>
          <h1 className="text-5xl mb-5">404</h1>
          <p className="text-4xl mb-5">{t("pageNotFound")}</p>
          <Link to="/" className="font-primary hover:underline">
            {t("go back")}
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center">
        <img className="h-60 sm:h-80" src={sadPuppyImg} alt="sad puppy" />
      </div>
    </main>
  );
}
