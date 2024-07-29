import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import { Breadcrumbs } from "src/components/ui/Breadcrumbs";
import { PrimaryButton } from "src/components/ui/PrimaryButton";
import { Spinner } from "src/components/ui/Spinner";
import { UserTable } from "src/components/UserTable";
import { useSnackbar } from "src/contexts/snackbarContext";

import { fetchUsers } from "src/fetchers";
import { UserType } from "src/types";

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

  if (data === 401 || data === 403) {
    return <Navigate to="/not-authorized" />;
  }

  if (status === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const users: UserType[] = data?.users;

  const onAddUser = () => {
    navigate("/users/add-user");
  };

  const onEditUser = () => {
    if (!selectedUserId) return;
    navigate(`/users/edit-user/${selectedUserId}`);
  };

  return (
    <main className="flex flex-col p-5 sm:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
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

      {status === "pending" ? (
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
