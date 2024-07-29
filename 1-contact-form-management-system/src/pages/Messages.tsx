import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";

import { Breadcrumbs } from "src/components/ui/Breadcrumbs";
import { MessagesTable } from "src/components/MessagesTable";
import { Spinner } from "src/components/ui/Spinner";
import { useSnackbar } from "src/contexts/snackbarContext";

import { fetchMessages, readMessage } from "src/fetchers";
import { MessageType } from "src/types";

export function Messages() {
  const navigate = useNavigate();

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

  const handleClick = (id: number) => {
    mutate(id);
    navigate(`/messages/${id}`);
  };

  return (
    <main className="flex flex-col p-1 sm:p-4 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <div className="py-1">
        <Breadcrumbs />
      </div>

      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <MessagesTable messages={messages} handleClick={handleClick} />
      )}
    </main>
  );
}
