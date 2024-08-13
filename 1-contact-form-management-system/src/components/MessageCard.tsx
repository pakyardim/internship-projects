import { useState } from "react";
import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { useDeleteMessageMutation } from "src/features/slices";
import { useSnackbar } from "src/contexts/snackbarContext";
import { RootState } from "src/features/store";
import { MessageType } from "src/types";
import { transformDate } from "src/utils";
import { Spinner } from "./ui";
import DeleteModal from "./ui/DeleteModal";

interface Props {
  messageItem: MessageType;
}

export function MessageCard({ messageItem }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const isAdmin = user?.role === "admin";

  const { showSnackbar } = useSnackbar();

  const [deleteMessage, { isLoading: isDeleteLoading }] =
    useDeleteMessageMutation();

  const handleDelete = async () => {
    try {
      await deleteMessage(messageItem.id).unwrap();
      showSnackbar("successMsg", "success");
      setOpen(false);
      router.replace("/messages");
    } catch (err: any) {
      showSnackbar(err.response.data.error, "error");
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <div className="scrollbar overflow-y-auto transition-colors duration-300 dark:bg-dark dark:text-light/90 dark:border-light sm:border border-darkBackground flex-1 bg-light shadow-custom p-10">
      {open && (
        <DeleteModal
          onCancel={onCancel}
          onDelete={handleDelete}
          isLoading={isDeleteLoading}
        />
      )}

      {!messageItem ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : (
        <>
          <table className="text-lg min-w-full border-collapse">
            <tbody>
              <tr>
                <th className="w-2/5 py-5 dark:text-light/90 text-dark/80 text-left">
                  <h2 className="text-2xl sm:text-3xl">{messageItem.name}</h2>
                </th>
                {isAdmin && (
                  <td className="w-3/5 py-5">
                    <button
                      onClick={() => setOpen(true)}
                      className="font-primary flex flex-row justify-center items-center text-xs sm:text-sm p-0.5 sm:p-1 border-2 text-primary border-primary font-semibold hover:text-white hover:bg-primary duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <MdDeleteOutline size={18} />
                      <span className="ml-2">{t("delete")}</span>
                    </button>
                  </td>
                )}
              </tr>
              <tr>
                <th className="w-2/5 text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("submissionDate")}:
                </th>
                <td className="w-3/5 text-sm sm:text-base py-5">
                  {transformDate(messageItem.creationDate, locale)}
                </td>
              </tr>
              <tr>
                <th className="w-2/5 text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("name")}:
                </th>
                <td className="w-3/5 text-sm sm:text-base py-5">
                  {messageItem.name}
                </td>
              </tr>
              <tr>
                <th className="w-2/5 text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("country")}:
                </th>
                <td className="w-3/5 text-sm sm:text-base py-5">
                  {messageItem.country}
                </td>
              </tr>
              <tr>
                <th className="w-2/5 text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("message")}:
                </th>
                <td className="w-3/5 text-sm sm:text-base py-5">
                  {messageItem.message}
                </td>
              </tr>
              <tr>
                <th className="w-2/5 text-sm sm:text-base py-5 dark:text-light/90 text-dark/80 text-left">
                  {t("gender")}:
                </th>
                <td className="w-3/5 text-sm sm:text-base py-5">
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
