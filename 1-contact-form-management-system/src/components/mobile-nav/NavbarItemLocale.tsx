"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";

import usFlag from "src/assets/us.jpg";
import trFlag from "src/assets/turkey.jpg";

import { Link, usePathname } from "src/navigation";
import { useTranslations } from "next-intl";

interface Props {
  closeNavbar: () => void;
}

export function NavbarItemLocale({ closeNavbar }: Props) {
  const [isActive, setIsActive] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const toggle = () => {
    setIsActive((prev) => !prev);
  };

  const changeLanguage = (lang: string) => {
    localStorage.setItem("I18N_LANGUAGE", lang);
    closeNavbar();
  };

  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      className={`localeItem cursor-pointer ${isActive && "active"}`}
    >
      <div className="flex px-5 items-center justify-between">
        <a href="#" className="block font-primary text-light relative">
          {t("Language")}
        </a>
        <span className="flex text-center w-8 h-8 text-light rounded-full items-center justify-center">
          <FiChevronDown />
        </span>
      </div>

      <ul className="dropdown-menu-item">
        {dropdown.map((item) => {
          return (
            <Link
              key={item.locale}
              href={pathname}
              locale={item.locale as "en" | "tr" | undefined}
            >
              <li onClick={changeLanguage.bind(null, item.locale)}>
                <div className="hover:text-white hover:opacity-100 hover:pl-6 pl-5 py-2 cursor-pointer opacity-80 font-primary flex items-center space-between w-1/2 text-light gap-2">
                  <span style={{ all: "unset" }}>{item.title}</span>{" "}
                  <Image
                    src={item.flag}
                    alt={item.title}
                    width={25}
                    height={16}
                  />
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </li>
  );
}

const dropdown = [
  { title: "English", locale: "en", flag: usFlag },
  { title: "Türkçe", locale: "tr", flag: trFlag },
];
