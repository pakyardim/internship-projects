import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trans, useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { MessageSidebar } from "src/components";

import { Breadcrumbs } from "src/components/ui";
import { useAuthContext, useSnackbar } from "src/contexts";
import { fetchMessages, readMessage } from "src/fetchers";
import { MessageType } from "src/types";

export function Dashboard() {
  const {
    values: { user },
  } = useAuthContext();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { showSnackbar } = useSnackbar();

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

  if (data === 401) {
    return <Navigate to="/not-authorized" />;
  }

  if (status === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const messages: MessageType[] = data?.messages;

  const unreadMessages = messages?.filter(
    (message) => message.read === "false"
  );

  const onClickMessage = (id: number) => {
    mutate(id);
    navigate(`/messages/${id}`);
  };

  const text = `${t("welcome")} ${user?.username}!`;
  const textArray = text.split(/(?!$)/u);

  return (
    <main className="flex flex-col p-4 sm:p-8 lg:p-20 sm:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />

      <div className="flex py-5 flex-col gap-8 sm:flex-row sm:gap-6 lg:gap-8 transition-colors duration-300">
        <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl w-[90%]">
              {textArray.map((char, index) => {
                return (
                  <span
                    key={index}
                    className="inline-block"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                );
              })}
            </h1>
            <p className="animated-text text-lg md:text-xl lg:text-2xl">
              <Trans i18nKey="dashboardParagraph">
                This page allows you to manage your <b>unread messages</b>. You
                can go to the <b>Reports</b> page to review your data.
              </Trans>
            </p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <MessageSidebar
            messages={unreadMessages}
            onClickMessage={onClickMessage}
            loading={status === "pending"}
            classname="w-full md:w-2/4 max-h-96 flex"
          />
        </div>
      </div>
    </main>
  );
}
