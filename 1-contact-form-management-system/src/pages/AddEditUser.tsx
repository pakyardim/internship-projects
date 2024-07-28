import { useQuery } from "@tanstack/react-query";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "src/components/ui/Breadcrumbs";

import { HighlightedText } from "src/components/ui/HighlightedText";
import { Spinner } from "src/components/ui/Spinner";
import { UserForm } from "src/components/UserForm";
import { fetchUser } from "src/fetchers";
import { UserType } from "src/types";

export function AddEditUser({ isEdit }: { isEdit: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { id } = useParams();

  const { data, status } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchUser(id!),
    enabled: isEdit && !!id,
    gcTime: 1000 * 60,
  });

  let user: UserType | null = null;

  if (status === "success" && isEdit) {
    user = data?.user;
  }

  const text = isEdit ? t("editUser") : t("addUser");
  const textArray = text.split(/(?!$)/u);

  return (
    <main className="flex flex-col p-4 sm:p-8 lg:p-20 sm:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />

      <div className="flex py-5 flex-col gap-8 sm:flex-row sm:gap-6 lg:gap-8 transition-colors duration-300">
        <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl w-[90%]">
              {textArray.map((char, index) => {
                if (locale === "en") {
                  if (isEdit && index > 8) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  } else if (!isEdit && index > 9) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  }
                } else if (locale === "tr") {
                  if (isEdit && index > 11 && index < 20) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  } else if (!isEdit && index > 8 && index < 18) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  }
                }
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
              {isEdit ? (
                <Trans i18nKey="editUserParagraph">
                  Bring a new <b>user</b> to the team. <b>Fill out</b> the form{" "}
                  and be sure to include all the necessary <b>information</b>.
                </Trans>
              ) : (
                <Trans i18nKey="userParagraph">
                  Bring a new <b>user</b> to the team. <b>Fill out</b> the form{" "}
                  and be sure to include all the necessary <b>information</b>.
                </Trans>
              )}
            </p>
            <p className="animated-text md:text-lg lg:text-xl">
              {isEdit ? (
                <Trans i18nKey="editUserParagraph2">
                  Keep in mind that you can not change the <b>username</b>.
                </Trans>
              ) : (
                <Trans i18nKey="userParagraph2">
                  Keep in mind that you can not change the <b>username</b> once
                  it is set.
                </Trans>
              )}
            </p>
          </div>
        </div>
        {isEdit && status === "pending" && (
          <div className="w-full sm:w-1/2 flex items-center justify-center">
            <Spinner size={20} />
          </div>
        )}

        {(!isEdit || status === "success") && (
          <UserForm isEdit={isEdit} user={user} />
        )}
      </div>
    </main>
  );
}
