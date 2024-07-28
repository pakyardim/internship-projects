import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const newPathNames = pathnames.map((value, index) => {
    const url = `/${pathnames.slice(0, index + 1).join("/")}`;
    return { label: value.charAt(0).toUpperCase() + value.slice(1), url };
  });

  const { t } = useTranslation();

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-gray-500">
        {newPathNames.map((item, index) => (
          <li
            key={index}
            className="font-primary text-sm lg:text-base dark:text-light text-gray-700"
          >
            {index === newPathNames.length - 1 ? (
              <span>{t(item.label)}</span>
            ) : (
              <>
                <Link to={item.url} className="hover:underline">
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
