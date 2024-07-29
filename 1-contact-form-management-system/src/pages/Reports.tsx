import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { Breadcrumbs, Spinner, BarChart, PieChart } from "src/components/ui";

import { useAuthContext, useSnackbar } from "src/contexts";
import { fetchMessages } from "src/fetchers";
import { ChartDataType, MessageType } from "src/types";

export function Reports() {
  const { t } = useTranslation();
  const {
    values: { user },
  } = useAuthContext();

  const { data, status } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    gcTime: 1000 * 60,
  });

  const { showSnackbar } = useSnackbar();

  if (data === 401 || user?.role === "reader") {
    return <Navigate to="/not-authorized" />;
  }

  if (status === "error") {
    showSnackbar("Something went wrong!", "error");
  }

  const messages = data?.messages;

  const barchartData = messages?.reduce(
    (acc: ChartDataType[], item: MessageType) => {
      const label = item.country;
      const existingCountry = acc.find(
        (entry: ChartDataType) => entry.label === label
      );

      if (existingCountry) {
        existingCountry.count += 1;
      } else {
        acc.push({ label, count: 1 });
      }

      return acc;
    },
    [] as ChartDataType[]
  );

  const piechartData = messages?.reduce(
    (acc: ChartDataType[], item: MessageType) => {
      const label = item.gender;
      const existingGender = acc.find(
        (entry: ChartDataType) => entry.label === label
      );

      if (existingGender) {
        existingGender.count += 1;
      } else {
        acc.push({ label, count: 1 });
      }
      return acc;
    },
    [] as ChartDataType[]
  );

  return (
    <main className="flex flex-col p-2 sm:p-4 xl:gap-4 md:p-5 lg:p-10 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 border-b">
      <Breadcrumbs />
      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <Spinner size={8} />
        </div>
      ) : status === "error" || !messages || messages?.length === 0 ? (
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
