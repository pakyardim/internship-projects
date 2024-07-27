import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="flex flex-col gap-2 sm:gap-0 py-4 sm:py-0 sm:flex-row px-10 h-24 transition-colors duration-300 bg-darkBackground dark:bg-dark dark:border-t dark:border-secondary bg-darkBackground font-primary justify-between items-center">
      <h1 className="uppercase text-xl sm:text-2xl flex font-bold text-white">
        Contact
        <span className="text-primary">Form</span>
        Hub
      </h1>
      <p className="text-sm sm:text-base text-neutral-300 flex flex-col text-center">
        <span>© {new Date().getFullYear()}</span>
        <span>{t("reserved")}</span>
      </p>
    </footer>
  );
}