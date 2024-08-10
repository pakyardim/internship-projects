"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Breadcrumbs, Spinner } from "src/components/ui";
import { MessagesTable } from "src/components";

import { MessageType } from "src/types";
import { useSnackbar } from "src/contexts/snackbarContext";
import { useGetAllMessagesQuery } from "src/features/slices";

export default function Messages() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const router = useRouter();
  const t = useTranslations();

  const { data, isLoading, error, isSuccess } = useGetAllMessagesQuery(
    {
      page,
      limit,
      sort: "desc",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (error) {
      if ("status" in error && error.status === 401) {
        showSnackbar("User not authenticated", "error");
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.replace("/not-authenticated");
      } else {
        showSnackbar("", "error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const { showSnackbar } = useSnackbar();

  const messages: MessageType[] = data?.messages;

  const handleClick = (id: number) => {
    // mutate(id);
    // navigate(`/messages/${id}`);
  };

  return (
    <main className="flex flex-col p-1 sm:p-4 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <div className="py-1">
        <Breadcrumbs />
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : error || !messages || messages?.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-center text-gray-500 dark:text-gray-400">
            {t("No data available")}
          </p>
        </div>
      ) : (
        isSuccess && (
          <div>
            <MessagesTable
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              data={data}
              handleClick={handleClick}
            />
          </div>
        )
      )}
    </main>
  );
}
