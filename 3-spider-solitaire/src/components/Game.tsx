/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FaPause, FaUndoAlt } from "react-icons/fa";

import { EndGameModal } from "src/components/modals/EndGameModal";
import { PauseModal } from "src/components/modals/PauseModal";
import { CardItem } from "src/components/CardItem";
import { useGameContext } from "src/contexts/gameContext";
import { convertSecsToTime, getImageURL } from "src/utils/utilFunctions";
import hintImg from "src/assets/hint.png";
import { CardType } from "src/types";

export function Game() {
  const {
    values: {
      paused,
      stock,
      layout,
      selectedCard,
      endGame,
      draggableGroup,
      score,
      timer,
      draggableId,
    },
    setters: { setPaused },
    functions: { deal10Cards, onDragEnd, onBeforeCapture },
  } = useGameContext();

  return (
    <div className={`w-full h-full flex flex-col md:px-0 md:py-10 lg:px-32`}>
      {paused && <PauseModal />}
      {endGame && <EndGameModal isWin={endGame === "win"} />}

      <div className="bg-green-900/90 flex justify-between mb-10">
        <div className="w-10">
          <p className="text-white text-2xl">{convertSecsToTime(timer)}</p>
        </div>
        <div className="w-30">
          <p className="text-white text-2xl">Score: {score}</p>
        </div>
        <button onClick={() => setPaused(true)}>
          <FaPause />
        </button>
      </div>

      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
        }}
        onBeforeCapture={(beforeCapture) => {
          onBeforeCapture(beforeCapture);
        }}
      >
        <div className="flex-1 inline-flex justify-between">
          {Object.entries(layout!).map(([id, cards], i) => (
            <Droppable key={i} droppableId={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-32 min-w-24 flex flex-col relative"
                >
                  <div className="h-32 w-24 border border-gray-300 rounded-lg" />
                  {cards.items.map((card: CardType, j: number) => {
                    const nextCard = cards.items[j + 1];
                    const dragDisabled = nextCard
                      ? card.isOpen
                        ? nextCard?.rank + 1 !== card.rank
                        : true
                      : false;

                    return (
                      <CardItem
                        marginBetweenCards={cards.items.length > 9 ? 20 : 25}
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
          ))}
        </div>
      </DragDropContext>

      <section className="px-5 items-end flex justify-around">
        <div className="flex space-x-20 items-center">
          <img src={hintImg} alt="Hint" className="hint w-10 cursor-pointer" />
          <button>
            <FaUndoAlt size={36} className="text-white/80 hover:text-red-400" />
          </button>
        </div>
        <div className="flex relative">
          {stock.map((row: CardType[], i: number) => (
            <div
              onClick={() => {
                if (i === stock.length - 1) deal10Cards();
              }}
              key={i}
              style={{
                position: i > 0 ? "absolute" : "static",
                left: i * 12,
              }}
              className={`w-24 h-32 ${
                i === stock.length - 1 ? "hover:scale-105 cursor-pointer" : ""
              }`}
            >
              <img
                src={getImageURL(
                  `card-backgrounds/classic_${selectedCard}.png`
                )}
                alt="Classic Blue Background"
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
