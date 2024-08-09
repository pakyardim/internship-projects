"use client";

import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useTranslations } from "next-intl";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

import { DarkModeToggle, LoginButton } from "src/components/ui";
// import { useAuthContext } from "src/contexts";
import { NavbarItemLocale } from "./NavbarItemLocale";
import Image from "next/image";

export function MobileNavbar() {
  // const {
  //   values: { user },
  //   functions: { logout },
  // } = useAuthContext();
  // const navigate = useNavigate();
  const t = useTranslations();

  const [navOpen, setNavOpen] = useState(false);

  const closeNav = (): void => {
    setNavOpen(false);
  };

  const handleLogout = async () => {
    // await logout();
    // navigate("/");
  };

  return (
    <>
      <div className="items-center justify-center">
        <div
          className="block w-12 p-2.5 cursor-pointer rounded sm:hidden z-40 scale-75 hover:mr-0 hover:ml-1"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="h-0.5 dark:bg-light bg-dark block menu__bar mb-1"></span>
          <span className="h-0.5 dark:bg-light bg-dark block menu__bar mb-1 mr-0 ml-1"></span>
          <span className="h-0.5 dark:bg-light bg-dark block menu__bar"></span>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 w-full h-full transition-all overflow-x-hidden z-50 bg-dark translate-x-full
          ${navOpen && "active"}`}
      >
        <div>
          <button
            className="absolute text-xl top-10 right-10 cursor-pointer text-light"
            onClick={closeNav}
          >
            x
          </button>
        </div>
        <div className="mt-32 flex flex-col gap-8">
          <ul className="p-0 m-0">
            <NavbarItemLocale closeNavbar={closeNav} />
          </ul>
          <div className="flex justify-center mt-8">
            <DarkModeToggle />
          </div>
          {/* {user?.base64Photo && (
            <div className="flex justify-center w-24 h-24 rounded items-center relative">
              <Image
              fill
                src={user.base64Photo}
                className="object-cover border border-light rounded-full font-primary text-light"
              />
            </div>
          )}
          {user?.username && (
            <div className="flex justify-center items-center">
              <h2 className="font-primary text-light">{user.username}</h2>
            </div>
          )}
          <div className="flex justify-center">
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
          </div> */}
        </div>
      </div>
    </>
  );
}
