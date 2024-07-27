import { useState } from "react";

import { NavbarItemLocale } from "./NavbarItemLocale";
import { DarkModeToggle } from "../ui/DarkModeToggle";
import { LoginButton } from "../ui/LoginButton";

export function MobileNavbar() {
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = (): void => {
    setNavOpen(false);
  };

  return (
    <>
      <div className="items-center justify-center">
        <div
          className="block w-12 p-2.5 cursor-pointer rounded sm:hidden z-40 scale-75 hover:mr-0 hover:ml-1"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="h-0.5 bg-dark block menu__bar mb-1"></span>
          <span className="h-0.5 bg-dark block menu__bar mb-1 mr-0 ml-1"></span>
          <span className="h-0.5 bg-dark block menu__bar"></span>
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
          <div className="flex justify-center mt-8">
            <LoginButton size="lg" />
          </div>
        </div>
      </div>
    </>
  );
}
