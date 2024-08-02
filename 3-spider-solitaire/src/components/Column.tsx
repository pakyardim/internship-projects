import { memo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { CardType } from "src/types";
import { CardItem } from "src/components/CardItem";
import { useGameContext } from "src/contexts/gameContext";

interface Props {
  id: string;
  cards: CardType[];
}

const isDescendingWithOneRankDifference = (cards: CardType[]) => {
  if (cards.length < 2) return true;

  for (let i = 0; i < cards.length - 1; i++) {
    const currentRank = cards[i].rank;
    const nextRank = cards[i + 1].rank;

    if (currentRank - nextRank !== 1) {
      return false;
    }
  }

  return true;
};

export const Column = memo(function Column({ id, cards }: Props) {
  const {
    values: { draggableGroup, draggableId },
  } = useGameContext();

  return (
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

            const dragDisabled = !isDescendingWithOneRankDifference(lastCards);

            return (
              <CardItem
                marginBetweenCards={cards.length > 9 ? 20 : 25}
                group={draggableGroup}
                draggableId={draggableId!}
                key={j}
                card={card}
                dragDisabled={dragDisabled}
                index={j}
              />
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});
