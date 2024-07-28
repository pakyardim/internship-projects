import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import { Breadcrumbs } from "src/components/ui/Breadcrumbs";
import { PrimaryButton } from "src/components/ui/PrimaryButton";
import { Spinner } from "src/components/ui/Spinner";
import { useSnackbar } from "src/contexts/snackbarContext";

import { fetchUsers } from "src/fetchers";
import { UserType } from "src/types";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useState } from "react";

export function Users() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, status } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    gcTime: 1000 * 60,
  });

  const { showSnackbar } = useSnackbar();

  if (data === 401) {
    return <Navigate to="/not-authorized" />;
  }

  if (status === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const users: UserType[] = data?.users;

  const onAddUser = () => {
    navigate("/add-user");
  };

  const onEditUser = () => {
    if (!selectedUserId) return;
    navigate(`/edit-user/${selectedUserId}`);
  };

  return (
    <main className="flex flex-col p-1 sm:p-4 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <div className="flex justify-between py-1">
        <Breadcrumbs />
        <div>
          <div className="mr-1 flex items-center space-x-2">
            <PrimaryButton
              onClick={onAddUser}
              classname="h-6 px-1 lg:px-1 md:py-0 bg-primary text-xs flex items-center dark:bg-primaryDark"
            >
              <IoAddOutline size={14} /> {t("add")}
            </PrimaryButton>
            <PrimaryButton
              onClick={onEditUser}
              isDisabled={!selectedUserId}
              classname="h-6 px-1 lg:px-1 md:py-0 bg-blue-300 dark:bg-cyan-800 text-xs flex items-center space-x-2 disabled:opacity-50"
            >
              <MdOutlineEdit />
              {t("edit")}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
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
                    setSelectedUserId(item.id);
                  }}
                  className={`${
                    selectedUserId === item.id
                      ? "bg-primary dark:bg-primaryDark text-light"
                      : index % 2 === 0
                      ? "bg-white dark:bg-dark"
                      : "bg-tertiary dark:bg-[#1e1e1e]"
                  } hover:bg-primary dark:hover:bg-primaryDark cursor-pointer hover:text-light
                  
                  `}
                >
                  <td className="flex w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                    <span className="block font-bold sm:hidden cell-header">
                      {t("photo")}:
                    </span>
                    <img
                      src={item.base64Photo}
                      alt="user image"
                      className="w-8 h-8 rounded-full"
                    />
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
                    {item.password}
                  </td>
                  <td className="flex w-full justify-between sm:table-cell sm:w-auto px-6 py-2 sm:py-4 text-xs xl:text-sm dark:text-light">
                    <span className="block font-bold sm:hidden cell-header">
                      {t("role")}:
                    </span>
                    <span>{item.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
