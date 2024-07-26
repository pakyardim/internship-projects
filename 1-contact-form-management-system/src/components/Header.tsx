import { useEffect, useState } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { useTranslation } from "react-i18next";

import { AnimatedLogo } from "src/components/ui/AnimatedLogo";
import { LanguageDropdown } from "src/components/ui/LanguageDropdown";

export function Header() {
  const [dark, setDark] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDarkMode = JSON.parse(savedDarkMode) as boolean;
      setDark(isDarkMode);
      if (isDarkMode) {
        document.body.classList.add("dark");
        document.querySelector("body")?.setAttribute("data-theme", "dark");
      }
    }
  }, []);

  const darkModeHandler = () => {
    setDark((prevDark) => {
      const newDarkMode = !prevDark;
      document.body.classList.toggle("dark", newDarkMode);
      document
        .querySelector("body")
        ?.setAttribute("data-theme", newDarkMode ? "dark" : "light");
      localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
      return newDarkMode;
    });
  };

  return (
    <header className="transition-colors duration-300 bg-secondary dark:bg-darkBackground h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary px-10 border-collapse">
      <AnimatedLogo />
      <div className="flex gap-5 items-center">
        <button onClick={() => darkModeHandler()}>
          {dark && <IoSunny />}
          {!dark && <IoMoon />}
        </button>
        <LanguageDropdown />
      </div>
      <button className="w-28 font-primary flex flex-row justify-center items-center p-3 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer group">
        <CiLogin size={20} />
        <span className="ml-2">{t("Login")}</span>
      </button>
    </header>
  );
}
