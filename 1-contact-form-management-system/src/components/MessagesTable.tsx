import { useTranslations, useLocale } from "next-intl";
import React from "react";
import { FaSort } from "react-icons/fa";
import {
  LuArrowLeft,
  LuArrowLeftToLine,
  LuArrowRight,
  LuArrowRightToLine,
} from "react-icons/lu";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { MessageType } from "src/types";
import { transformDate } from "src/utils";

interface Props {
  page: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  data: { messages: MessageType[]; count: number };
  handleClick: (id: number) => void;
  pagination: boolean;
}

export function MessagesTable({
  page,
  sort,
  setSort,
  setPage,
  limit,
  setLimit,
  data,
  handleClick,
  pagination,
}: Props) {
  const { messages, count } = data;
  const t = useTranslations();
  const locale = useLocale();

  const isNextPage = count > page * limit;
  const isPreviousPage = page > 1;

  const last = count < page * limit ? count : page * limit;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full md:table-fixed divide-y dark:divide-light divide-gray-200 border">
        <thead className="hidden md:table-header-group bg-slate-300 dark:bg-slate-950">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light tracking-wider">
              {pagination ? (
                <button
                  onClick={() => {
                    setSort((prevSort) =>
                      prevSort === "nameA" ? "nameD" : "nameA"
                    );
                  }}
                  className="flex items-center uppercase"
                >
                  {t("name")}
                  {sort === "nameA" ? (
                    <TiArrowSortedUp />
                  ) : sort === "nameD" ? (
                    <TiArrowSortedDown />
                  ) : (
                    <FaSort />
                  )}
                </button>
              ) : (
                t("name")
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {pagination ? (
                <button
                  onClick={() => {
                    setSort((prevSort) =>
                      prevSort === "countryA" ? "countryD" : "countryA"
                    );
                  }}
                  className="flex items-center uppercase"
                >
                  {t("country")}
                  {sort === "countryA" ? (
                    <TiArrowSortedUp />
                  ) : sort === "countryD" ? (
                    <TiArrowSortedDown />
                  ) : (
                    <FaSort />
                  )}
                </button>
              ) : (
                t("country")
              )}
            </th>
            <th className="md:w-2/6 px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("message")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {pagination ? (
                <button
                  onClick={() => {
                    setSort((prevSort) =>
                      prevSort === "genderA" ? "genderD" : "genderA"
                    );
                  }}
                  className="flex items-center uppercase"
                >
                  {t("gender")}
                  {sort === "genderA" ? (
                    <TiArrowSortedUp />
                  ) : sort === "genderD" ? (
                    <TiArrowSortedDown />
                  ) : (
                    <FaSort />
                  )}
                </button>
              ) : (
                t("gender")
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("read")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {pagination ? (
                <button
                  onClick={() => {
                    setSort((prevSort) =>
                      prevSort === "creationDateA"
                        ? "creationDateD"
                        : "creationDateA"
                    );
                  }}
                  className="flex items-center uppercase"
                >
                  {t("date")}
                  {sort === "creationDateA" ? (
                    <TiArrowSortedUp />
                  ) : sort === "creationDateD" ? (
                    <TiArrowSortedDown />
                  ) : (
                    <FaSort />
                  )}
                </button>
              ) : (
                t("date")
              )}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-light divide-gray-200">
          {messages?.map((item: MessageType, index: number) => (
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
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 md:whitespace-nowrap text-xs xl:text-sm font-medium dark:text-white">
                <span className="block font-bold md:hidden cell-header">
                  {t("name")}:
                </span>
                {item.name}
              </td>
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 md:whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("country")}:
                </span>
                {item.country}
              </td>
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 truncate md:max-w-xl md:whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("message")}:
                </span>
                <span className="md:text-left truncate max-w-[16rem] sm:max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.message}
                </span>
              </td>
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("gender")}:
                </span>
                {t(item.gender)}
              </td>
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("read")}:
                </span>
                {item.read ? t("yes") : t("no")}
              </td>
              <td className="flex w-full justify-between md:table-cell px-1 sm:px-6 py-2 md:py-4 whitespace-nowrap text-xs xl:text-sm dark:text-light">
                <span className="block font-bold md:hidden cell-header">
                  {t("date")}:
                </span>
                {transformDate(item.creationDate, locale)}
              </td>
            </tr>
          ))}
        </tbody>
        {pagination && (
          <tfoot>
            <tr className="bg-tertiary text-dark/70 dark:bg-[#1e1e1e]">
              <td colSpan={4} className="px-6 py-3 flex w-full  md:table-cell">
                <span className="text-xs xl:text-sm dark:text-light">
                  {t("Rows per page:")}
                </span>
                <select
                  className="ml-2 text-xs xl:text-sm border rounded-md dark:bg-dark dark:text-light"
                  onChange={(e) => {
                    const selectedRowsPerPage = parseInt(e.target.value);
                    setLimit(selectedRowsPerPage);
                    setPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="100">100</option>
                </select>
              </td>
              <td colSpan={2} className="px-6 py-3 flex w-full md:table-cell">
                <div className="flex items-center gap-4 md:gap-0 justify-between">
                  <span className="text-xs xl:text-sm dark:text-light">
                    {(page - 1) * limit + 1} - {last} {t("of")} {count}
                  </span>
                  <button
                    disabled={!isPreviousPage}
                    onClick={() => setPage(1)}
                    className="disabled:border-primary/60 disabled:text-primary/60 p-1 rounded-full border border-primary text-primary hover:border-primaryDark hover:text-primaryDark"
                  >
                    <LuArrowLeftToLine size={12} />
                  </button>
                  <button
                    disabled={!isPreviousPage}
                    onClick={() => setPage((prevPage: number) => prevPage - 1)}
                    className="disabled:border-primary/60 disabled:text-primary/60 p-1 rounded-full border border-primary text-primary hover:border-primaryDark hover:text-primaryDark"
                  >
                    <LuArrowLeft size={12} />
                  </button>
                  <button
                    disabled={!isNextPage}
                    onClick={() => setPage((prevPage: number) => prevPage + 1)}
                    className="disabled:border-primary/60 disabled:text-primary/60 p-1 rounded-full border border-primary text-primary hover:border-primaryDark hover:text-primaryDark"
                  >
                    <LuArrowRight size={12} />
                  </button>
                  <button
                    disabled={!isNextPage}
                    onClick={() => {
                      setPage(Math.ceil(count / limit));
                    }}
                    className="disabled:border-primary/60 disabled:text-primary/60 p-1 rounded-full border border-primary text-primary hover:border-primaryDark hover:text-primaryDark"
                  >
                    <LuArrowRightToLine size={12} />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
