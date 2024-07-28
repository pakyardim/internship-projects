import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { MessageType } from "src/types";
import { Spinner } from "src/components/ui/Spinner";
import { transformDate } from "src/utils/dateTimeFunctions";
import { MdDeleteOutline } from "react-icons/md";
import { useAuthContext } from "src/contexts/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "src/fetchers";
import { useSnackbar } from "src/contexts/snackbarContext";
import { useNavigate } from "react-router-dom";

interface MessageCardProps {
  messageItem: MessageType;
}

export function MessageCard({ messageItem }: MessageCardProps) {
  const {
    values: { user },
  } = useAuthContext();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const isAdmin = user.role === "admin";

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  // showSnackbar("successMsg", "success");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMessage,
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      showSnackbar("successMsg", "success");
      navigate("/messages");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showSnackbar(error.response.data.error, "error");
    },
  });

  const handleDelete = () => {
    mutate(messageItem.id);
  };

  return (
    <div className="overflow-y-auto transition-colors duration-300 dark:bg-dark dark:text-light/90 dark:border-light border border-darkBackground flex-1 bg-light shadowedInput p-10">
      {!messageItem ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <>
          <table className="text-lg min-w-full border-collapse">
            <tbody>
              <tr>
                <th className="py-5 dark:text-light/90 text-dark/80 text-left">
                  <h2 className="text-2xl sm:text-3xl">{messageItem.name}</h2>
                </th>
                {isAdmin && (
                  <td className="py-5">
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="font-primary flex flex-row justify-center items-center text-xs sm:text-sm p-0.5 sm:p-1 border-2 text-primary border-primary font-semibold hover:text-white hover:bg-primary duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <MdDeleteOutline size={18} />
                      <span className="ml-2">{t("delete")}</span>
                    </button>
                  </td>
                )}
              </tr>
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
