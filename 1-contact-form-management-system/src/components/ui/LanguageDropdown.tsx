"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FiChevronDown } from "react-icons/fi";
import { useTranslations } from "next-intl";

import { languages } from "src/utils";
import { Link, usePathname } from "src/navigation";

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = useTranslations();
  const pathname = usePathname();

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = (lang: string) => {
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
        <Image
          src={languages[selectedLang].flag}
          alt="Flag"
          className="mr-1 h-4 w-6 sm:h-5 sm:w-8"
        />
        <FiChevronDown className="dark:text-light" />
      </div>
      {isOpen && (
        <ul className="dark:bg-darkBackground dark:text-light w-32 absolute right-0 z-20 mt-1 bg-light border border-primary/30 shadow-lg max-h-60 ">
          {Object.keys(languages).map((option, index) => (
            <Link
              key={index}
              href={pathname}
              locale={option as "en" | "tr" | undefined}
            >
              <li
                onClick={() => changeLanguageAction(option)}
                className="flex items-center font-primary px-4 py-2 cursor-pointer hover:bg-primary/10"
              >
                <Image
                  height={16}
                  width={24}
                  src={languages[option].flag}
                  alt="Flag"
                  className="mr-1"
                />
                <p>{t(option)}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
