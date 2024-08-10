"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import { Breadcrumbs, PrimaryButton, Spinner } from "src/components/ui";
import { UserTable } from "src/components/UserTable";
import { useSnackbar } from "src/contexts/snackbarContext";
import { useGetAllUsersQuery } from "src/features/slices";

import { UserType } from "src/types";

export default function Users() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  const { data, isLoading, error } = useGetAllUsersQuery("");

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      if ("status" in error && error.status === 401) {
        showSnackbar("User not authenticated", "error");
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.replace("/not-authenticated");
      } else if ("status" in error && error.status === 403) {
        showSnackbar("User not authorized", "error");
        router.replace("/not-authorized");
      } else {
        showSnackbar("", "error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const users: UserType[] = data?.users;

  const onAddUser = () => {
    router.push("/users/user");
  };

  const onEditUser = () => {
    if (!selectedUserId) return;
    router.push(`/users/user/${selectedUserId}`);
  };

  return (
    <main className="flex flex-col p-5 xl:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
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
              classname="h-6 px-1 lg:px-1 md:py-0 dark:bg-cyan-800 text-xs flex items-center space-x-2 disabled:bg-blue-300/50 bg-blue-300"
            >
              <MdOutlineEdit />
              {t("edit")}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <UserTable
          users={users}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
        />
      )}
    </main>
  );
}
