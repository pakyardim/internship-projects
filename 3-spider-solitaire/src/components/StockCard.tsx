import React from "react";
import { useGameContext } from "src/contexts/gameContext";
import { getImageURL } from "src/utils/utilFunctions";

interface Props {
  stockLeftMultiplier: number;
  index: number;
}

export function StockCard({ stockLeftMultiplier, index }: Props) {
  const {
    values: { stock, selectedCard, hint, dealAnimation },
    functions: { deal10Cards },
  } = useGameContext();

  return (
    <div
      onClick={() => {
        if (index === stock.length - 1) {
          deal10Cards();
        }
      }}
      key={index}
      style={
        {
          "--finalStock-x": `${index * stockLeftMultiplier}px`,
          animation:
            dealAnimation === "end"
              ? "stockCard 0.5s ease-out forwards"
              : "none",
          position: "absolute",
        } as React.CSSProperties
      }
      className={`h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32 ${
        index === stock.length - 1
          ? `hover:scale-105 cursor-pointer ${
              hint?.from === "stock" && "outline outline-yellow-400 rounded-lg"
            }`
          : ""
      }`}
    >
      <img
        src={getImageURL(`card-backgrounds/classic_${selectedCard}.png`)}
        alt="Classic Blue Background"
        className="w-full h-full"
      />
    </div>
  );
}
