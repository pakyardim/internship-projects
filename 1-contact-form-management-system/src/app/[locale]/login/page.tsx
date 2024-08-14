import { DarkModeToggle, LanguageDropdown } from "src/components/common";

import { AuthSection, LoginForm } from "src/components/auth";
import { MobileNavbar } from "src/components/mobile-nav";

export default function Login() {
  return (
    <div className={`relative w-screen h-screen flex`}>
      <div className="absolute top-5 right-5 ">
        <div className="hidden sm:flex items-center gap-3">
          <DarkModeToggle />
          <LanguageDropdown />
        </div>
        <MobileNavbar />
      </div>
      <AuthSection />
      <div className="h-full w-full lg:w-3/5 bg-secondary transition-colors duration-300 dark:bg-darkBackground">
        <LoginForm />
      </div>
    </div>
  );
}
