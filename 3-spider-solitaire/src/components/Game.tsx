/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FaUndoAlt } from "react-icons/fa";

import { EndGameModal, PauseModal, GameHeader, Column } from "src/components";

import { useGameContext } from "src/contexts/gameContext";
import { getImageURL } from "src/utils/utilFunctions";
import hintImg from "src/assets/hint.png";
import { CardType } from "src/types";

export function Game() {
  const {
    values: { paused, stock, layout, selectedCard, endGame, hint },
    functions: { deal10Cards, onDragEnd, onBeforeCapture, undo, provideHint },
  } = useGameContext();

  const [translationValue, setTranslationValue] = useState({ x: 0, y: 0 });
  const [dealAnimation, setDealAnimation] = useState<"start" | "end" | null>(
    null
  );

  const topSectionRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (topSectionRef.current && stockRef.current) {
      const topRect = topSectionRef.current.getBoundingClientRect();
      const stockRect = stockRef.current.getBoundingClientRect();
      const calculatedTranslationX = stockRect.left - topRect.left;
      const calculatedTranslationY = stockRect.top - topRect.top;
      setTranslationValue({
        x: calculatedTranslationX,
        y: calculatedTranslationY,
      });
    }

    setTimeout(() => {
      setDealAnimation("start");
    }, 50);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDealAnimation("end");
    }, 2300);

    return () => clearTimeout(timeout);
  }, []);

  const maxItemsLength = Math.max(
    ...Object.values(layout!).map((column) => column.items.length)
  );

  const marginBetweenCards =
    maxItemsLength > 15 ? 15 : maxItemsLength > 9 ? 20 : 25;

  return (
    <div className="md:container py-10 md:px-10 lg:px-32 mx-auto w-full h-full flex flex-col">
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
        <div ref={topSectionRef} className="flex-1 inline-flex gap-x-8">
          {dealAnimation === "end" &&
            Object.entries(layout!).map(([id, cards], i) => (
              <Column
                key={i}
                id={id}
                cards={cards.items}
                marginBetweenCards={marginBetweenCards}
              />
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
        <div ref={stockRef} className="flex relative h-32">
          {dealAnimation !== "end" &&
            Object.entries(layout!).map(([id, cards], i) => (
              <div key={i} className="relative">
                {cards.items.length > 0 ? (
                  cards.items.map((card: CardType, j: number) => (
                    <div
                      key={j}
                      style={
                        {
                          "--final-x": `${-translationValue.x + i * 128}px`,
                          "--final-y": `${-translationValue.y + j * 25}px`,
                          animation:
                            dealAnimation == "start"
                              ? `dealCard 0.5s ease-out forwards`
                              : "none",
                          animationDelay:
                            dealAnimation === "start"
                              ? `${(j * cards.items.length + i) * 0.05}s`
                              : "none",
                          position: "absolute",
                        } as React.CSSProperties
                      }
                      className={`${
                        card.isOpen &&
                        "hover:outline cursor-pointer hover:rounded outline-blue-300"
                      } w-24 h-32`}
                    >
                      <img
                        src={
                          card.isOpen
                            ? getImageURL(card.imagePath)
                            : getImageURL(
                                `card-backgrounds/classic_${selectedCard}.png`
                              )
                        }
                        alt="Card"
                        className="w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-24 h-32 border-2 border-gray-300 rounded" />
                )}
              </div>
            ))}

          {stock.map((row: CardType[], i: number) => (
            <div
              onClick={() => {
                if (i === stock.length - 1) deal10Cards();
              }}
              key={i}
              style={
                {
                  "--finalStock-x": `${i * 12}px`,
                  animation:
                    dealAnimation === "end"
                      ? "stockCard 0.5s ease-out forwards"
                      : "none",
                  position: "absolute",
                } as React.CSSProperties
              }
              className={`w-24 h-32 ${
                i === stock.length - 1
                  ? `hover:scale-105 cursor-pointer ${
                      hint?.from === "stock" &&
                      "outline outline-yellow-400 rounded-lg"
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
