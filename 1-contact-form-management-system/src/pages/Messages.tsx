import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import { Breadcrumbs } from "src/components/ui/Breadcrumbs";
import { Spinner } from "src/components/ui/Spinner";
import { useSnackbar } from "src/contexts/snackbarContext";

import { fetchMessages, readMessage } from "src/fetchers/messages";
import { MessageType } from "src/types/message";
import { transformDate } from "src/utils/dateTimeFunctions";

export function Messages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: readMessage,
    retry: 1,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["messages"],
        (oldData: { messages: MessageType[] }) => {
          const updatedMessages = oldData.messages.map(
            (message: MessageType) => {
              if (message.id === data.message.id) {
                return { ...message, read: "true" };
              }
              return message;
            }
          );
          return { messages: updatedMessages };
        }
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showSnackbar(error.response.data.error, "error");
    },
  });

  const { data, status } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    gcTime: 1000 * 60,
  });

  const { showSnackbar } = useSnackbar();

  if (data === 401) {
    return <Navigate to="/not-authorized" />;
  }

  if (status === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const messages: MessageType[] = data?.messages;

  return (
    <main className="flex flex-col p-1 sm:p-4 xl:gap-4 xl:p-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />

      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full divide-y dark:divide-light divide-gray-200 border">
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
              {messages?.map((item: MessageType, index: number) => (
                <tr
                  key={index}
                  onClick={() => {
                    mutate(item.id);
                    navigate(`/messages/${item.id}`);
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
          </table>
        </div>
      )}
    </main>
  );
}
