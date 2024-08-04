import { useGameContext } from "src/contexts/gameContext";
import { CardType } from "src/types";
import { getImageURL } from "src/utils/utilFunctions";

interface Props {
  card: CardType;
  index: number;
  columnIndex: number;
  columnLength: number;
}

export function CompletedSuitCard({
  card,
  index,
  columnIndex,
  columnLength,
}: Props) {
  const {
    values: { suitTranslationValue, suitAnimation, completedSuitNum },
  } = useGameContext();

  const moveMargin = columnLength > 9 ? 20 : 25;

  const style = {
    zIndex: 100,
    "--finalSuit-x": `${
      suitTranslationValue.x + columnIndex * -128 + completedSuitNum * 20
    }px`,
    "--finalSuit-y": `${
      suitTranslationValue.y - (index + 1) * 20 + 20 - columnLength * moveMargin
    }px`,
    animation:
      suitAnimation == "start"
        ? `completedSuit 0.5s ease-out forwards`
        : "none",
    animationDelay: suitAnimation === "start" ? `${index * 0.05}s` : "none",
    position: "absolute",
    top: `${index * 20}px`,
  } as React.CSSProperties;

  return (
    <div style={style} className="h-32 min-w-24">
      <img
        src={getImageURL(card.imagePath)}
        alt="classic background"
        className="w-24 h-32 rounded"
      />
    </div>
  );
}
