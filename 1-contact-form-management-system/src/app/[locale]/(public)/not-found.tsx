"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import sadPuppyImg from "src/assets/sad-puppy.png";

export default function NotFound() {
  const t = useTranslations();

  return (
    <main className="flex flex-col gap-8 sm:flex-row sm:gap-6 p-8 sm:p-12 lg:gap-8 lg:p-20 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 items-center border-b">
      <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div>
          <h1 className="text-5xl mb-5">404</h1>
          <p className="text-4xl mb-5">{t("pageNotFound")}</p>
          <Link href="/" className="font-primary hover:underline">
            {t("go back")}
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center">
        <div className="h-60 w-60 sm:h-80 sm:w-80 relative">
          <Image fill src={sadPuppyImg} alt="sad puppy" />
        </div>
      </div>
    </main>
  );
}
