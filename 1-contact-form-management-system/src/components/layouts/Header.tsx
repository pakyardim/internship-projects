"use client";

import {
  AnimatedLogo,
  LanguageDropdown,
  DarkModeToggle,
  LoginButton,
} from "src/components/ui";
import { MobileNavbar } from "src/components/mobile-nav";

export function Header() {
  return (
    <header className="px-5 sm:px-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary border-collapse">
      <div className="flex flex-1 justify-between items-center">
        <AnimatedLogo />
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex sm:gap-5 items-center">
            <DarkModeToggle />
            <LanguageDropdown />
          </div>
          <LoginButton />
        </div>
      </div>
      <MobileNavbar />
    </header>
  );
}
