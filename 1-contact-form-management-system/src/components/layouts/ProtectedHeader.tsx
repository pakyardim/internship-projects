import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AnimatedLogo } from "src/components/ui/AnimatedLogo";
import { LanguageDropdown } from "src/components/ui/LanguageDropdown";
import { DarkModeToggle } from "src/components/ui/DarkModeToggle";
import { UserProfileDropdown } from "src/components/ui/UserProfileDropdown";
import { MobileNavbar } from "src/components/mobile-nav/MobileNavbar";
import { useAuthContext } from "src/contexts/authContext";

export function ProtectedHeader() {
  const {
    values: { user },
  } = useAuthContext();

  const { t } = useTranslation();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="px-5 sm:px-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary border-collapse">
      <div className="flex flex-1 justify-between items-center">
        <div className="hidden md:block">
          <AnimatedLogo />
        </div>
        <nav>
          <ul className="flex w-full h-20 text-xs md:text-sm xl:text-base">
            <li
              className={`cursor-pointer text-dark font-primary h-full flex items-center justify-center px-4 xl:px-8 text-primary ${
                isActive("/dashboard") &&
                "bg-primary/10 border-primary border-b-4"
              } `}
            >
              <Link to="/dashboard">{t("Dashboard")}</Link>
            </li>
            <li className="dark:text-light cursor-pointer text-dark font-primary h-full flex items-center justify-center px-4 xl:px-8">
              {t("Messages")}
            </li>
            {user?.role === "admin" && (
              <>
                <li className="dark:text-light cursor-pointer text-dark font-primary h-full flex items-center justify-center px-4 xl:px-8">
                  {t("Users")}
                </li>
                <li className="dark:text-light cursor-pointer text-dark font-primary h-full flex items-center justify-center px-4 xl:px-8">
                  {t("Reports")}
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex sm:gap-5 items-center">
            <DarkModeToggle />
            <LanguageDropdown />
          </div>
          <div className="cursor-pointer w-8 h-8">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
      <MobileNavbar />
    </header>
  );
}
