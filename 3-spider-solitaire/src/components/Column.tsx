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
    values: { draggableId, lastCompletedSuit, selectedMode },
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
            className="min-h-10 w-7 xs:min-h-12 xs:w-8 sm:min-h-16 sm:min-w-12 md:min-h-20 md:min-w-16 xl:min-w-24 xl:min-h-32 flex flex-col relative"
          >
            <div className="h-10 w-7 xs:h-12 xs:w-8 sm:w-12 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32 border border-gray-300 rounded-lg" />
            {cards.map((card: CardType, j: number) => {
              const lastCards = cards.slice(j);

              const dragDisabled = !isDescendingWithOneRankDifference(
                lastCards,
                selectedMode
              );

              return (
                <CardItem
                  marginBetweenCards={marginBetweenCards}
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
