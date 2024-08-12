"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathnames = usePathname();
  const splittedPathNames = pathnames.split("/").filter((x) => x);
  splittedPathNames.shift();

  const newPathnames = splittedPathNames.map((value, index) => {
    const url = `/${splittedPathNames.slice(0, index + 1).join("/")}`;
    const splittedVal = value.split("-");
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1);

    const label = splittedVal.map(capitalize).join(" ");

    return { label: label, url };
  });

  const t = useTranslations();

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-1 text-gray-500">
        {newPathnames.map((item, index) => (
          <li
            key={index}
            className="font-primary text-sm lg:text-base dark:text-light text-gray-700"
          >
            {index === newPathnames.length - 1 ? (
              <span>
                {typeof +item.label === "number" ? item.label : t(item.label)}
              </span>
            ) : (
              <>
                <Link href={item.url} className="hover:underline">
                  {t(item.label)}
                </Link>
                {" /"}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
