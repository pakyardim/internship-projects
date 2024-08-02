/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FaUndoAlt } from "react-icons/fa";

import { EndGameModal } from "src/components/modals/EndGameModal";
import { PauseModal } from "src/components/modals/PauseModal";
import { useGameContext } from "src/contexts/gameContext";
import { getImageURL } from "src/utils/utilFunctions";
import hintImg from "src/assets/hint.png";
import { CardType } from "src/types";
import { GameHeader } from "./GameHeader";
import { Column } from "./Column";

export function Game() {
  const {
    values: { paused, stock, layout, selectedCard, endGame, hint },
    functions: { deal10Cards, onDragEnd, onBeforeCapture, undo, provideHint },
  } = useGameContext();

  const [translationValue, setTranslationValue] = useState({ x: 0, y: 0 });
  const [dealAnimationStart, setDealAnimationStart] = useState(false);
  const [dealAnimationEnd, setDealAnimationEnd] = useState(false);

  const topSectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (topSectionRef.current) {
      const topRect = topSectionRef.current.getBoundingClientRect();
      const calculatedTranslationX = topRect.width;
      const calculatedTranslationY = topRect.bottom - topRect.top;
      setTranslationValue({
        x: calculatedTranslationX,
        y: calculatedTranslationY,
      });
    }

    setTimeout(() => {
      setDealAnimationStart(true);
    }, 50);
  }, []);

  useEffect(() => {
    const timeout = 4000;
    setTimeout(() => {
      setDealAnimationEnd(true);
    }, timeout);
  }, []);

  return (
    <div className={`w-full h-full flex flex-col md:px-0 md:py-10 lg:px-32`}>
      {paused && <PauseModal />}
      {endGame && <EndGameModal isWin={endGame === "win"} />}

      <GameHeader />

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
            <Column key={i} id={id} cards={cards.items} />
          ))}
        </div>
      </DragDropContext>

      <section className="px-5 items-end flex justify-around">
        <div className="flex space-x-20 items-center">
          <button onClick={provideHint}>
            <img
              src={hintImg}
              alt="Hint"
              className="hint w-10 cursor-pointer"
            />
          </button>

          <button onClick={undo}>
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
                i === stock.length - 1
                  ? `hover:scale-105 cursor-pointer ${
                      hint?.from === "stock" &&
                      "outline outline-yellow-500 rounded-lg"
                    }`
                  : ""
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
