import { useEffect, useState } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";

import { AnimatedLogo } from "src/components/ui/AnimatedLogo";

export function Header() {
  const [dark, setDark] = useState<boolean>(false);

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
    <header className="h-20 flex justify-between items-center border-b border-darkBackground dark:border-secondary px-10 border-collapse">
      <AnimatedLogo />
      <button onClick={() => darkModeHandler()}>
        {dark && <IoSunny />}
        {!dark && <IoMoon />}
      </button>
      <button className="font-primary flex flex-row justify-center items-center p-3 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer group">
        <CiLogin size={20} />
        <span className="ml-2">Login</span>
      </button>
    </header>
  );
}
