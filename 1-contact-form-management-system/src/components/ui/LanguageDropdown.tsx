import { useState, useEffect, useRef } from "react";

import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import languages from "src/utils/languages";

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  };

  const toggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  return (
    <div className="relative">
      <div
        ref={dropdownRef}
        tabIndex={0}
        onClick={toggle}
        onBlur={handleBlur}
        className="flex cursor-pointer items-center"
      >
        <img
          src={languages[selectedLang].flag}
          alt="Flag"
          className="mr-1 h-5 w-8"
        />
        <FiChevronDown className="dark:text-light" />
      </div>
      {isOpen && (
        <ul className="dark:bg-darkBackground dark:text-light w-32 absolute right-0 z-20 mt-1 bg-light border border-primary/30 shadow-lg max-h-60 ">
          {Object.keys(languages).map((option, index) => (
            <li
              key={index}
              onClick={() => changeLanguageAction(option)}
              className="flex items-center font-primary px-4 py-2 cursor-pointer hover:bg-primary/10"
            >
              <img
                src={languages[option].flag}
                alt="Flag"
                className="mr-1 h-4 w-6"
              />
              <p>{t(option)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
