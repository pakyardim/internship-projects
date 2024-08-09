import { useTranslations } from "next-intl";
// import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  // const location = useLocation();
  // const pathnames = location.pathname.split("/").filter((x) => x);

  // const newPathnames = pathnames.map((value, index) => {
  //   const url = `/${pathnames.slice(0, index + 1).join("/")}`;
  //   const splittedVal = value.split("-");
  //   const capitalize = (word: string) =>
  //     word.charAt(0).toUpperCase() + word.slice(1);

  //   const label = splittedVal.map(capitalize).join(" ");

  //   return { label: label, url };
  // });

  const t = useTranslations();

  return (
    <nav aria-label="breadcrumb">
      {/* <ol className="flex items-center space-x-1 text-gray-500">
        {newPathnames.map((item, index) => (
          <li
            key={index}
            className="font-primary text-sm lg:text-base dark:text-light text-gray-700"
          >
            {index === newPathnames.length - 1 ? (
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
      </ol> */}
    </nav>
  );
}
