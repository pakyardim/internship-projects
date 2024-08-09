import { useTranslations } from "next-intl";
import { ChartDataType } from "src/types";

interface Props {
  label: string;
  data: ChartDataType[];
}

export function BarChart({ label, data }: Props) {
  const t = useTranslations();
  const maxCount = data && Math.max(...data.map((d: ChartDataType) => d.count));

  return (
    <div className="w-full md:w-1/2">
      <h2 className="dark:text-light text-base lg:text-lg mb-4 text-right">
        {t(label)}
      </h2>
      <div className="flex flex-col space-y-2">
        {data?.map((item: ChartDataType, index: number) => (
          <div key={index} className="flex items-center">
            <span className="w-24 pr-4 text-sm lg:text-base dark:text-light/90">
              {item.label}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-grayish h-6 relative">
              <div
                className="bg-primary bar bar-animate h-6 flex items-center justify-center"
                style={
                  {
                    "--bar-width": `${
                      (item.count / maxCount) * 100
                    }%` as string,
                  } as React.CSSProperties
                }
              >
                <p className="absolute right-2 top-0 text-white font-bold">
                  {item.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
