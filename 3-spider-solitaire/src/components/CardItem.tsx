import ReactCardFlip from "react-card-flip";
import { Draggable } from "react-beautiful-dnd";

import { getImageURL } from "src/utils/utilFunctions";
import { useGameContext } from "src/contexts/gameContext";
import { CardType } from "src/types";
import { useWindowSize } from "src/hooks/useWindowSize";

interface Props {
  marginBetweenCards: number;
  draggableId: string;
  card: CardType;
  index: number;
  dragDisabled: boolean;
}

export function CardItem({
  marginBetweenCards,
  draggableId,
  card,
  index,
  dragDisabled,
}: Props) {
  const {
    values: { selectedCard, hint, draggableGroup },
  } = useGameContext();

  const windowWidth = useWindowSize();

  const height =
    windowWidth >= 1280
      ? 128
      : windowWidth >= 768
      ? 80
      : windowWidth >= 640
      ? 64
      : windowWidth >= 400
      ? 48
      : 40;

  const isGroupDragging =
    draggableGroup &&
    draggableGroup.length > 1 &&
    draggableGroup.some((item) => item.id === card.id);

  if (isGroupDragging && draggableGroup[0].id !== card.id) {
    return null;
  }

  return (
    <Draggable
      isDragDisabled={dragDisabled}
      key={card.id}
      draggableId={card.id}
      index={index}
    >
      {(provided, dragSnapshot) => {
        const style = {
          top: `${index * marginBetweenCards}px`,
          ...provided.draggableProps.style,
          height: isGroupDragging
            ? `calc(${height}px + ${
                (draggableGroup!.length - 1) * marginBetweenCards
              }px)`
            : `${height}px`,
          transform:
            isGroupDragging || card.id === draggableId
              ? provided.draggableProps.style?.transform
              : "none !important",
        };

        if (isGroupDragging) {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={style}
              className={`${
                isGroupDragging || dragSnapshot.isDragging
                  ? "scale-105 outline outline-blue-300 rounded"
                  : ""
              } relative`}
            >
              {draggableGroup.map((card, i) => (
                <img
                  key={card.id}
                  src={getImageURL(card.imagePath)}
                  alt="classic background"
                  style={{
                    top: `${i * marginBetweenCards}px`,
                  }}
                  className="h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32 absolute"
                />
              ))}
            </div>
          );
        }

        const isHinted = hint && hint.cards.some((item) => item.id === card.id);

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
            className={`
              ${isHinted && "shadow-xl outline outline-yellow-400 rounded"} ${
              dragSnapshot.isDragging
                ? "scale-105 outline outline-blue-300 rounded"
                : ""
            } absolute`}
          >
            <ReactCardFlip isFlipped={card.isOpen} flipDirection="horizontal">
              <img
                src={getImageURL(
                  `card-backgrounds/classic_${selectedCard}.png`
                )}
                alt="classic background"
                className="h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32"
              />
              <img
                src={getImageURL(card.imagePath)}
                alt="classic background"
                className="h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32"
              />
            </ReactCardFlip>
          </div>
        );
      }}
    </Draggable>
  );
}
