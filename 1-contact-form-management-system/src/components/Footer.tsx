import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="transition-colors duration-300 bg-darkBackground dark:bg-dark dark:border-t dark:border-secondary bg-darkBackground font-primary flex justify-between items-center px-10 h-24">
      <h1 className="uppercase text-2xl flex font-bold text-white">
        Contact
        <span className="text-primary">Form</span>
        Hub
      </h1>
      <p className="text-neutral-300 flex flex-col text-center">
        <span>© {new Date().getFullYear()}</span>
        <span>{t("reserved")}</span>
      </p>
    </footer>
  );
}
