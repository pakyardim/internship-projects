"use client";

import { useEffect, useState } from "react";

export function DarkModeToggle() {
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
    <label className="cursor-pointer relative inline-block w-14 h-6">
      <input onClick={darkModeHandler} type="checkbox" className="sr-only" />
      <div
        className={`w-full h-full rounded-full ${
          dark ? "bg-dark" : "bg-light"
        } transition-colors duration-300`}
      ></div>
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transform ${
          dark && "translate-x-8"
        } transition-transform duration-300 flex items-center justify-center`}
      >
        {dark ? "🌜" : "🌞"}
      </div>
    </label>
  );
}
