import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { MessageType } from "src/types/message";
import { Spinner } from "src/components/ui/Spinner";
import { transformDate } from "src/utils/dateTimeFunctions";

interface MessageCardProps {
  messageItem: MessageType;
}

export function MessageCard({ messageItem }: MessageCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <div className="overflow-y-auto transition-colors duration-300 dark:bg-dark dark:text-light/90 dark:border-light border border-darkBackground flex-1 bg-light shadowedInput p-10">
      {!messageItem ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl">{messageItem.name}</h2>
          <table className="text-lg mt-4 min-w-full border-collapse">
            <tbody>
              <tr>
                <th className="text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("submissionDate")}:
                </th>
                <td className="text-sm sm:text-base py-5">
                  {transformDate(messageItem.creationDate, locale)}
                </td>
              </tr>
              <tr>
                <th className="text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("name")}:
                </th>
                <td className="text-sm sm:text-base py-5">
                  {messageItem.name}
                </td>
              </tr>
              <tr>
                <th className="text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("country")}:
                </th>
                <td className="text-sm sm:text-base py-5">
                  {messageItem.country}
                </td>
              </tr>
              <tr>
                <th className="text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("message")}:
                </th>
                <td className="text-sm sm:text-base py-5">
                  {messageItem.message}
                </td>
              </tr>
              <tr>
                <th className="text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("gender")}:
                </th>
                <td className="text-sm sm:text-base py-5">
                  <div className="flex gap-x-1 items-center">
                    {t(messageItem.gender)}{" "}
                    {messageItem.gender === "male" ? (
                      <IoMaleOutline />
                    ) : (
                      <IoFemaleOutline />
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
