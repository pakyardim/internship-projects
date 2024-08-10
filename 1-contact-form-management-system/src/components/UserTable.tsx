"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { UserType } from "src/types";

interface Props {
  users: UserType[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
}

export function UserTable({ users, selectedUserId, setSelectedUserId }: Props) {
  const t = useTranslations();
  const tableRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    setTimeout(() => {
      if (!tableRef.current?.contains(document.activeElement)) {
        setSelectedUserId("");
      }
    }, 150);
  };

  return (
    <div
      tabIndex={0}
      ref={tableRef}
      onBlur={handleBlur}
      className="overflow-x-auto w-full"
    >
      <table className="w-full divide-y dark:divide-light divide-gray-200 border">
        <thead className="hidden sm:table-header-group bg-slate-300 dark:bg-slate-950">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("photo")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("username")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("password")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium dark:text-light uppercase tracking-wider">
              {t("role")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-light divide-gray-200">
          {users.map((item: UserType, index: number) => (
            <tr
              key={index}
              onClick={() => {
                setSelectedUserId(item.id!);
              }}
              className={`${
                selectedUserId === item.id
                  ? "bg-primary dark:bg-primaryDark text-light"
                  : index % 2 === 0
                  ? "bg-white dark:bg-dark"
                  : "bg-tertiary dark:bg-[#1e1e1e]"
              } hover:bg-primary/90 dark:hover:bg-primaryDark cursor-pointer hover:text-light
                  `}
            >
              <td className="flex items-center w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                <span className="lowercase block font-bold sm:hidden cell-header">
                  {t("photo")}:
                </span>
                <div className="w-8 h-8 relative">
                  <Image
                    fill
                    src={item.base64Photo}
                    alt="user image"
                    className="object-cover rounded-full"
                  />
                </div>
              </td>
              <td className="flex w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                <span className="block font-bold sm:hidden cell-header">
                  {t("username")}:
                </span>
                {item.username}
              </td>
              <td className="flex w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                <span className="block font-bold sm:hidden cell-header">
                  {t("password")}:
                </span>
                ******
              </td>
              <td className="flex w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                <span className="lowercase block font-bold sm:hidden cell-header">
                  {t("role")}:
                </span>
                <span>{item.role}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
