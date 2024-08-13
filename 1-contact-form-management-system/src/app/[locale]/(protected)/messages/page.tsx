"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import Link from "next/link";

import { Breadcrumbs, Spinner } from "src/components/ui";
import { MessagesTable } from "src/components";

import { MessageType } from "src/types";
import { useSnackbar } from "src/contexts/snackbarContext";
import {
  readMessageUpdate,
  useGetAllMessagesQuery,
  useGetAllUsersQuery,
  useReadMessageMutation,
  userUpdate,
} from "src/features/slices";
import { AppDispatch } from "src/features/store";

export default function Messages() {
  const dispatch: AppDispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [sort, setSort] = useState<string>("creationDateD");
  const router = useRouter();
  const t = useTranslations();

  const { data, isLoading, error, isSuccess } = useGetAllMessagesQuery(
    {
      page,
      limit,
      sort,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { showSnackbar } = useSnackbar();

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

  const [readMessage] = useReadMessageMutation();

  const messages: MessageType[] = data?.messages;

  const handleClick = async (id: number) => {
    const isRead = messages?.find((message) => message.id === id)?.read;
    if (isRead) return router.push(`/messages/${id}`);
    try {
      await readMessage(id).unwrap();
      dispatch(readMessageUpdate(id) as any);

      router.push(`/messages/${id}`);
    } catch (err: any) {
      showSnackbar(err.response.data.error, "error");
    }
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
              sort={sort}
              setSort={setSort}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              data={data}
              handleClick={handleClick}
              pagination
            />
            <div className="w-full flex justify-end pt-2">
              <Link href="/messages/scroll">
                <p className="text-primary/80 text-sm hover:underline dark:text-primaryDark">
                  {t("see in scroll view")}
                </p>
              </Link>
            </div>
          </div>
        )
      )}
    </main>
  );
}
