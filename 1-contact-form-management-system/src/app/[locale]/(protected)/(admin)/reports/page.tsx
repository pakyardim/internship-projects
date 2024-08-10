"use client";

import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Breadcrumbs, Spinner, BarChart, PieChart } from "src/components/ui";
import { useSnackbar } from "src/contexts/snackbarContext";
import { ChartDataType, MessageType } from "src/types";
import { RootState } from "src/features/store";
import { useGetReportsQuery } from "src/features/slices";
import { useEffect } from "react";

export default function Reports() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useGetReportsQuery("");

  const { showSnackbar } = useSnackbar();

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

  const barchartData = data?.countries as ChartDataType[];
  const piechartData = data?.genders as ChartDataType[];

  return (
    <main className="flex flex-col p-2 sm:p-4 xl:gap-4 md:p-5 lg:p-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />
      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : error || !data.countries || data.countries?.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-center text-gray-500 dark:text-gray-400">
            {t("No data available")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row space-y-20 md:space-y-0 p-5 md:p-0">
          <BarChart label="Country Counts" data={barchartData} />

          <PieChart label="Gender Distribution" data={piechartData} />
        </div>
      )}
    </main>
  );
}
