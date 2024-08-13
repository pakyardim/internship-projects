"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MessageCard, MessageSidebar } from "src/components";
import { Breadcrumbs } from "src/components/ui";

import { useSnackbar } from "src/contexts/snackbarContext";
import {
  readMessageUpdate,
  useGetAllMessagesQuery,
  useGetMessageQuery,
  useReadMessageMutation,
} from "src/features/slices";
import { AppDispatch } from "src/features/store";
import { MessageType } from "src/types";

export default function MessageDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { data: messageData, error } = useGetMessageQuery(+id);
  const { data, isLoading: messagesLoading } = useGetAllMessagesQuery({
    page: 1,
    limit: 100,
    sort: "creationDateD",
  });

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

  const message: MessageType = messageData?.message;
  const messages: MessageType[] = data?.messages;

  const onClickMessage = async (id: number) => {
    try {
      await readMessage(id).unwrap();
      dispatch(readMessageUpdate(id) as any);

      router.push(`/messages/${id}`);
    } catch (err: any) {
      showSnackbar(err.response.data.error, "error");
    }
  };

  return (
    <main className="max-h-[calc(100vh-40px)] flex flex-col flex-1 p-0 sm:p-2 xl:gap-4 xl:p-5 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary border-b">
      <Breadcrumbs />

      <section className="max-h-[calc(100vh-120px)] flex flex-1">
        <MessageSidebar
          activeMessageId={+id!}
          messages={messages}
          onClickMessage={onClickMessage}
          loading={messagesLoading}
          classname="hidden sm:flex"
        />
        <MessageCard messageItem={message} />
      </section>
    </main>
  );
}
