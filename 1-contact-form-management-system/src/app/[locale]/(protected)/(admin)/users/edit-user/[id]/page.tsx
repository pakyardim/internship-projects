"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Breadcrumbs, HighlightedText, Spinner } from "src/components/common";
import { UserForm } from "src/components/user";
import { useSnackbar } from "src/contexts/snackbarContext";
import { useGetUserByIdQuery } from "src/features/slices";

export default function EditUser({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { id } = params;
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, error, isSuccess } = useGetUserByIdQuery(id);

  useEffect(() => {
    if (error) {
      if ("status" in error && error.status === 401) {
        showSnackbar("User not authenticated", "error");
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.replace("/not-authenticated");
      } else if ("status" in error && error.status === 403) {
        showSnackbar("User not authorized", "error");
        router.replace("/not-authorized");
      } else {
        showSnackbar("", "error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const text = t("editUser");
  const textArray = text.split(/(?!$)/);

  return (
    <main className="flex flex-col p-4 sm:p-8 lg:p-20 sm:gap-4 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />

      <div className="flex py-5 flex-col gap-8 sm:flex-row sm:gap-6 lg:gap-8 transition-colors duration-300">
        <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-5">
            <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl w-[90%]">
              {textArray.map((char, index) => {
                if (locale === "en") {
                  if (index > 8) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  }
                } else if (locale === "tr") {
                  if (index > 11 && index < 20) {
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
              {t.rich("editUserParagraph", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
            <p className="animated-text md:text-lg lg:text-xl">
              {t.rich("editUserParagraph2", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
          </div>
        </div>
        {id && isLoading && (
          <div className="w-full sm:w-1/2 flex items-center justify-center">
            <Spinner size={20} />
          </div>
        )}

        {isSuccess && <UserForm isEdit={true} user={data?.user} />}
      </div>
    </main>
  );
}
