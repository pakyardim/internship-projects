import { CiLogin } from "react-icons/ci";
import { useTranslation } from "react-i18next";

import { AnimatedLogo } from "src/components/ui/AnimatedLogo";
import { LanguageDropdown } from "src/components/ui/LanguageDropdown";
import { DarkModeToggle } from "./ui/DarkModeToggle";
import { MobileNavbar } from "./mobile-nav/MobileNavbar";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="px-5 sm:px-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary border-collapse">
      <div className="flex flex-1 justify-between items-center">
        <AnimatedLogo />
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex gap-3 sm:gap-5 items-center">
            <DarkModeToggle />
            <LanguageDropdown />
          </div>
          <button className="w-20 h-8 sm:w-24 sm:h-10 lg:h-12 lg:w-28 font-primary flex flex-row justify-center items-center p-3 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer group">
            <CiLogin size={20} />
            <span className="ml-2">{t("Login")}</span>
          </button>
        </div>
      </div>
      <MobileNavbar />
    </header>
  );
}
