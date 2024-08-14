import { useTranslations } from "next-intl";
import { ChartDataType } from "src/types";

interface Props {
  label: string;
  data: ChartDataType[];
}

export function PieChart({ label, data }: Props) {
  const t = useTranslations();
  const total = data?.reduce(
    (sum: number, item: ChartDataType) => sum + item.count,
    0
  );

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return { x, y };
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center">
      <h2 className="dark:text-light text-base lg:text-lg mb-4 text-right w-full">
        {t(label)}
      </h2>
      <svg
        viewBox="-1 -1 2 2"
        className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full shadow-xl"
        style={{ transform: "rotate(-90deg)" }}
      >
        {data?.map((item: ChartDataType, index: number) => {
          const slicePercent = item.count / total;
          const [startX, startY] = [
            getCoordinatesForPercent(cumulativePercent).x,
            getCoordinatesForPercent(cumulativePercent).y,
          ];
          cumulativePercent += slicePercent;
          const [endX, endY] = [
            getCoordinatesForPercent(cumulativePercent).x,
            getCoordinatesForPercent(cumulativePercent).y,
          ];
          const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

          return (
            <path
              key={index}
              d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`}
              className={`${
                item.label === "male" ? "fill-blue-900" : "fill-rose-400"
              }`}
            ></path>
          );
        })}
      </svg>
      <ul className="mt-4 self-end">
        {data?.map((item: ChartDataType, index: number) => (
          <li
            key={index}
            className="text-sm lg:text-base dark:text-light/90 flex items-center"
          >
            <span
              className={`w-4 h-4 mr-2 ${
                item.label === "male" ? "bg-blue-800" : "bg-rose-400"
              }`}
            ></span>
            {t(item.label)}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
