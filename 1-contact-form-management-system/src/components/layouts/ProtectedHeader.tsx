import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  AnimatedLogo,
  LanguageDropdown,
  DarkModeToggle,
  UserProfileDropdown,
} from "src/components/ui";
import { MobileNavbar } from "src/components/mobile-nav";
import { useAuthContext } from "src/contexts";

export function ProtectedHeader() {
  const {
    values: { user },
  } = useAuthContext();

  const navigate = useNavigate();

  const { t } = useTranslation();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="flex-none px-2 sm:px-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary border-collapse">
      <div className="flex flex-1 justify-between items-center">
        <div className="hidden md:block">
          <AnimatedLogo handleClick={handleClick} />
        </div>
        <nav>
          <ul className="flex w-full h-20 text-xs md:text-sm xl:text-base">
            <Link to="/dashboard">
              <li
                className={`nav-list-item dark:text-light ${
                  isActive("/dashboard")
                    ? "dark:text-primary bg-primary/10 border-primary border-b-4 text-primary"
                    : "hover:text-primaryDark"
                } `}
              >
                {t("Dashboard")}
              </li>
            </Link>
            <Link to="/messages">
              <li
                className={`nav-list-item dark:text-light ${
                  isActive("/messages")
                    ? "dark:text-primary bg-primary/10 border-primary border-b-4 text-primary"
                    : "hover:text-primaryDark"
                } `}
              >
                {t("Messages")}
              </li>
            </Link>
            {user?.role === "admin" && (
              <>
                <Link to="/users">
                  <li
                    className={`nav-list-item dark:text-light ${
                      isActive("/users")
                        ? "dark:text-primary bg-primary/10 border-primary border-b-4 text-primary"
                        : "hover:text-primaryDark"
                    } `}
                  >
                    {t("Users")}
                  </li>
                </Link>
                <li className="nav-list-item dark:text-light">
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
