"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { Breadcrumbs, HighlightedText } from "src/components/common";
import { UserForm } from "src/components/user";
import { RootState } from "src/features/store";
import { useSnackbar } from "src/contexts/snackbarContext";

export default function AddUser() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      showSnackbar("User not authenticated", "error");
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.replace("/not-authenticated");
    } else if (user.role !== "admin") {
      showSnackbar("User not authorized", "error");
      router.replace("/not-authorized");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const text = t("addUser");
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
                  if (index > 9) {
                    return (
                      <HighlightedText key={index}>{char}</HighlightedText>
                    );
                  }
                } else if (locale === "tr") {
                  if (index > 8 && index < 18) {
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
              {t.rich("userParagraph", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
            <p className="animated-text md:text-lg lg:text-xl">
              {t.rich("userParagraph2", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
          </div>
        </div>

        <UserForm isEdit={false} />
      </div>
    </main>
  );
}
