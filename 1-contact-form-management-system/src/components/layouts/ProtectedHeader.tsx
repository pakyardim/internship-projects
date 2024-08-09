"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  AnimatedLogo,
  LanguageDropdown,
  DarkModeToggle,
  UserProfileDropdown,
} from "src/components/ui";
import { MobileNavbar } from "src/components/mobile-nav";

import { RootState } from "src/features/store";

export function ProtectedHeader() {
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const strippedPath = pathname.replace(/^\/(en|tr)\//, "/");

  const t = useTranslations();
  const isActive = (path: string) => strippedPath === path;

  return (
    <header className="flex-none px-0 sm:px-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary border-collapse">
      <div className="flex flex-1 justify-between items-center">
        <div className="hidden md:block">
          <AnimatedLogo />
        </div>
        <nav>
          <ul className="flex w-full h-20 text-xs md:text-sm xl:text-base">
            <Link href="/dashboard">
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
            <Link href="/messages">
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
                <Link href="/users">
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
                <Link href="/reports">
                  <li
                    className={`nav-list-item dark:text-light ${
                      isActive("/reports")
                        ? "dark:text-primary bg-primary/10 border-primary border-b-4 text-primary"
                        : "hover:text-primaryDark"
                    } `}
                  >
                    {t("Reports")}
                  </li>
                </Link>
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
