import { useTranslations, useLocale } from "next-intl";

import { MessageType } from "src/types";
import { transformDate } from "src/utils";

interface Props {
  messages: MessageType[];
  handleClick: (id: number) => void;
}

export function MessagesTable({ messages, handleClick }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const sortedMessages = messages?.sort((a, b) => {
    return (
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    );
  });

  return (
    <div className="overflow-x-auto w-full">
      {/* <table className="w-full divide-y dark:divide-light divide-gray-200 border">
        <thead className="hidden md:table-header-group bg-slate-300 dark:bg-slate-950">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("country")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("message")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("gender")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("read")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("date")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-light divide-gray-200">
          {sortedMessages?.map((item: MessageType, index: number) => (
            <tr
              key={index}
              onClick={() => {
                handleClick(item.id);
              }}
              className={`${
                index % 2 === 0
                  ? "bg-white dark:bg-dark"
                  : "bg-tertiary dark:bg-[#1e1e1e]"
              } hover:bg-primary dark:hover:bg-primaryDark cursor-pointer hover:text-light`}
            >
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 md:whitespace-nowrap text-xs xl:text-sm font-medium dark:text-white text-gray-900">
                <span className="block font-bold md:hidden cell-header">
                  {t("name")}:
                </span>
                {item.name}
              </td>
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 md:whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("country")}:
                </span>
                {item.country}
              </td>
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 truncate md:max-w-xl md:whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("message")}:
                </span>
                <span className="md:text-left truncate max-w-[16rem] sm:max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.message}
                </span>
              </td>
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("gender")}:
                </span>
                {t(item.gender)}
              </td>
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("read")}:
                </span>
                {item.read === "true" ? t("yes") : t("no")}
              </td>
              <td className="flex w-full justify-between md:table-cell px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("date")}:
                </span>
                {transformDate(item.creationDate, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
