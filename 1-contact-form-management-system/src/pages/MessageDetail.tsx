import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { MessageCard } from "src/components";
import { Breadcrumbs, Spinner } from "src/components/ui";

import { useSnackbar } from "src/contexts";
import { fetchMessage, fetchMessages, readMessage } from "src/fetchers";
import { MessageType } from "src/types";
import { formatRelativeDate } from "src/utils";

export function MessageDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { showSnackbar } = useSnackbar();

  const { mutate } = useMutation({
    mutationFn: readMessage,
    retry: 1,
    onSuccess: () => {
      queryClient.setQueryData(
        ["messages"],
        (oldData: { messages: MessageType[] }) => {
          const updatedMessages = oldData.messages.map(
            (message: MessageType) => {
              if (message.id === +id!) {
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

  const { data: messagesData, status: messagesStatus } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    gcTime: 1000 * 60,
  });

  const { data, status } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchMessage(id!),
    gcTime: 1000 * 60,
  });

  if (data === 401 || messagesData === 401) {
    return <Navigate to="/not-authorized" />;
  } else if (data === 404) {
    return <Navigate to="/not-found" />;
  }

  if (status === "error" || messagesStatus === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const messages: MessageType[] = messagesData?.messages;
  const message: MessageType = data?.message;

  return (
    <main className="max-h-[calc(100vh-40px)] flex flex-col flex-1 p-0 sm:p-2 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary border-b">
      <Breadcrumbs />

      <section className="max-h-[calc(100vh-120px)] flex flex-1">
        <div className="dark:border-light transition-colors duration-300 bg-light dark:bg-dark hidden sm:flex border border-darkBackground shadow-custom flex-col w-1/4">
          <aside className="overflow-y-auto transition-colors duration-300 w-full dark:text-secondary font-bold">
            <div className="transition-colors duration-300 border-b p-2 text-center bg-light dark:bg-dark text-dark dark:text-light">
              <p className="text-xs md:text-sm lg:text-base">
                {messages?.length} {t("messages")}
              </p>
            </div>
            {!messages && messagesStatus === "pending" && (
              <div className="w-full flex justify-center">
                <Spinner size={8} />
              </div>
            )}
            {messages &&
              messages.map((message) => {
                const isActive = message.id === +id!;
                return (
                  <div
                    key={message.id}
                    onClick={() => {
                      mutate(message.id);
                      navigate("/messages/" + message.id);
                    }}
                    className={`${
                      isActive
                        ? "bg-primary/50 border-primary hover:border-primary"
                        : "dark:bg-dark border-light bg-light hover:border-light"
                    } dark:hover:bg-primaryDark transition-colors duration-300 text-dark dark:text-light/90 cursor-pointer hover:bg-primary/50 p-2 flex justify-between dark:bg-darkSidebar items-center`}
                  >
                    <h3 className="text-sm md:text-base lg:text-lg font-semibold">
                      {message.name}
                    </h3>
                    <div className="relative">
                      <p className="md:text-xs text-sm pb-1">
                        {formatRelativeDate(message.creationDate, locale)}
                      </p>
                      {message.read === "false" && !isActive && (
                        <div className="absolute -bottom-1 right-0 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
          </aside>
        </div>

        <MessageCard messageItem={message} />
      </section>
    </main>
  );
}
