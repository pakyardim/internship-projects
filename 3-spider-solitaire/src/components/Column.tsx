import { memo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { CardType } from "src/types";
import { CardItem, CompletedSuitCard } from "src/components";
import { useGameContext } from "src/contexts/gameContext";
import { isDescendingWithOneRankDifference } from "src/utils/deckFunctions";

interface Props {
  index: number;
  id: string;
  cards: CardType[];
}

export const Column = memo(function Column({ index, id, cards }: Props) {
  const {
    values: { draggableGroup, draggableId, lastCompletedSuit },
  } = useGameContext();

  const marginBetweenCards =
    cards?.length > 15 ? 15 : cards?.length > 9 ? 20 : 25;

  return (
    <>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-32 min-w-24 flex flex-col relative"
          >
            <div className="h-32 w-24 border border-gray-300 rounded-lg" />
            {cards.map((card: CardType, j: number) => {
              const lastCards = cards.slice(j);

              const dragDisabled =
                !isDescendingWithOneRankDifference(lastCards);

              return (
                <CardItem
                  marginBetweenCards={marginBetweenCards}
                  group={draggableGroup}
                  draggableId={draggableId!}
                  key={j}
                  card={card}
                  dragDisabled={dragDisabled}
                  index={j}
                />
              );
            })}
            {lastCompletedSuit.columnId === id &&
              lastCompletedSuit.cards.length > 0 &&
              lastCompletedSuit.cards.map((card, i) => (
                <CompletedSuitCard
                  key={card.id}
                  columnLength={cards.length}
                  columnIndex={index}
                  card={card}
                  index={i}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
});
