"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  useGetUnreadMessagesQuery,
  useReadMessageMutation,
} from "src/features/slices";
import { RootState } from "src/features/store";
import { Breadcrumbs } from "src/components/ui";
import { useSnackbar } from "src/contexts/snackbarContext";
import { MessageSidebar } from "src/components";
import { MessageType } from "src/types";

export default function Dashboard() {
  const t = useTranslations("DashboardPage");
  const { user } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, error } = useGetUnreadMessagesQuery("");

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

  const onClickMessage = async (id: number) => {
    try {
      await readMessage(id).unwrap();
      router.push(`/messages/${id}`);
    } catch (error: any) {
      showSnackbar(error.response.data.error, "error");
    }
  };

  const text = `${t("title")} ${user?.username}!`;
  const textArray = text.split(/(?!$)/);

  return (
    <main className="flex flex-col p-4 sm:p-8 lg:p-20 sm:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />

      <div className="flex py-5 flex-col gap-8 sm:flex-row sm:gap-6 lg:gap-8 transition-colors duration-300">
        <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl h-14 w-[90%]">
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
              {user && user.role === "admin"
                ? t.rich("descriptionAdmin", {
                    b: (chunks) => <b>{chunks}</b>,
                  })
                : t.rich("descriptionReader", {
                    b: (chunks) => <b>{chunks}</b>,
                  })}
            </p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <MessageSidebar
            messages={messages}
            onClickMessage={onClickMessage}
            loading={isLoading}
            classname="w-full md:w-2/4 max-h-96 flex"
          />
        </div>
      </div>
    </main>
  );
}
