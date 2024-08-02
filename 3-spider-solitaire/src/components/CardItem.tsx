import ReactCardFlip from "react-card-flip";
import { Draggable } from "react-beautiful-dnd";

import { getImageURL } from "src/utils/utilFunctions";
import { useGameContext } from "src/contexts/gameContext";
import { CardType } from "src/types";

export function CardItem({
  marginBetweenCards,
  draggableId,
  card,
  group,
  index,
  dragDisabled,
}: {
  marginBetweenCards: number;
  draggableId: string;
  group: CardType[] | undefined;
  card: CardType;
  dragDisabled: boolean;
  index: number;
}) {
  const {
    values: { selectedCard },
  } = useGameContext();

  const isGroupDragging =
    group && group.length > 1 && group.some((item) => item.id === card.id);

  if (isGroupDragging && group[0].id !== card.id) {
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
            ? `calc(128px + ${(group!.length - 1) * marginBetweenCards}px)`
            : "128px",
          transform:
            isGroupDragging || card.id === draggableId
              ? provided.draggableProps.style?.transform
              : "none !important",
        };

        if (isGroupDragging && index !== 0) {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={style}
              className={`${
                isGroupDragging || dragSnapshot.isDragging
                  ? "scale-105 outline outline-blue-300 rounded-lg"
                  : ""
              } relative`}
            >
              {group.map((card, i) => (
                <img
                  key={card.id}
                  src={getImageURL(card.imagePath)}
                  alt="classic background"
                  style={{
                    top: `${i * marginBetweenCards}px`,
                  }}
                  className="w-24 h-32 absolute"
                />
              ))}
            </div>
          );
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
            className={`${
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
                className="w-24 h-32"
              />
              <img
                src={getImageURL(card.imagePath)}
                alt="classic background"
                className="w-24 h-32"
              />
            </ReactCardFlip>
          </div>
        );
      }}
    </Draggable>
  );
}
