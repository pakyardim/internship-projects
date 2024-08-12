import { useLocale, useTranslations } from "next-intl";

import { Spinner } from "src/components/ui";
import { MessageType } from "src/types";
import { formatRelativeDate } from "src/utils";

interface Props {
  messages: MessageType[] | undefined;
  loading: boolean;
  onClickMessage: (id: number) => void;
  activeMessageId?: number | null;
  classname?: string;
}

export function MessageSidebar({
  activeMessageId = null,
  messages,
  loading,
  onClickMessage,
  classname,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div
      className={`w-1/4 dark:border-light transition-colors duration-300 bg-light dark:bg-dark border border-darkBackground shadow-custom flex-col ${classname}`}
    >
      <aside className="pb-2 scrollbar overflow-y-auto transition-colors duration-300 w-full dark:text-secondary font-bold">
        <div className="transition-colors duration-300 border-b p-2 text-center bg-light dark:bg-dark text-dark dark:text-light">
          <p className="text-md sm:text-xs md:text-sm lg:text-base lowercase">
            {messages?.length}{" "}
            {activeMessageId ? t("message(s)") : t("unread message(s)")}{" "}
          </p>
        </div>
        {!messages && loading && (
          <div className="w-full flex justify-center">
            <Spinner size={8} />
          </div>
        )}
        {messages &&
          messages?.map((message) => {
            const isActive = message.id === activeMessageId;
            return (
              <div
                key={message.id}
                onClick={() => {
                  onClickMessage(message.id);
                }}
                className={`${
                  isActive
                    ? "bg-primary/50 border-primary hover:border-primary"
                    : "dark:bg-dark border-light bg-light hover:border-light"
                } dark:hover:bg-primaryDark transition-colors duration-300 text-dark dark:text-light/90 cursor-pointer hover:bg-primary/50 p-2 flex justify-between dark:bg-darkSidebar items-center`}
              >
                <h3 className="text-base sm:text-sm md:text-base lg:text-lg font-semibold">
                  {message.name}
                </h3>
                <div className="relative">
                  <p className="text-sm md:text-xs pb-1">
                    {formatRelativeDate(message.creationDate, locale)}
                  </p>
                  {!message.read && !isActive && (
                    <div className="absolute -bottom-1 right-0 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            );
          })}
      </aside>
    </div>
  );
}
