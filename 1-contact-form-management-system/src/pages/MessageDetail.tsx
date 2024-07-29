import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { MessageCard, MessageSidebar } from "src/components";
import { Breadcrumbs } from "src/components/ui";

import { useSnackbar } from "src/contexts";
import { fetchMessage, fetchMessages, readMessage } from "src/fetchers";
import { MessageType } from "src/types";

export function MessageDetail() {
  const { id } = useParams();

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

  const onClickMessage = (id: number) => {
    mutate(id);
    navigate(`/messages/${id}`);
  };

  return (
    <main className="max-h-[calc(100vh-40px)] flex flex-col flex-1 p-0 sm:p-2 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary border-b">
      <Breadcrumbs />

      <section className="max-h-[calc(100vh-120px)] flex flex-1">
        <MessageSidebar
          activeMessageId={+id!}
          messages={messages}
          onClickMessage={onClickMessage}
          loading={messagesStatus === "pending"}
          classname="hidden sm:flex"
        />
        <MessageCard messageItem={message} />
      </section>
    </main>
  );
}
