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
    values: {
      paused,
      stock,
      layout,
      selectedCard,
      endGame,
      hint,
      deal10Animation,
      completedSuitNum,
    },
    setters: { setSuitTranslationValue, setSuitAnimation },
    functions: { deal10Cards, onDragEnd, onBeforeCapture, undo, provideHint },
  } = useGameContext();

  const [translationValue, setTranslationValue] = useState({ x: 0, y: 0 });

  const [dealAnimation, setDealAnimation] = useState<"start" | "end" | null>(
    null
  );

  const topSectionRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);
  const suitRef = useRef<HTMLDivElement>(null);

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

    if (topSectionRef.current && suitRef.current) {
      const topRect = topSectionRef.current.getBoundingClientRect();
      const suitRect = suitRef.current.getBoundingClientRect();
      const calculatedTranslationX = suitRect.left - topRect.left;
      const calculatedTranslationY = suitRect.top - topRect.top;
      setSuitTranslationValue({
        x: calculatedTranslationX,
        y: calculatedTranslationY,
      });
    }

    setTimeout(() => {
      setDealAnimation("start");
      setSuitAnimation("start");
    }, 50);
  }, [setSuitAnimation, setSuitTranslationValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDealAnimation("end");
    }, 2300);

    return () => clearTimeout(timeout);
  }, []);

  const columnLengths: { [key: string]: number } = Object.entries(
    layout!
  ).reduce((acc, [id, cards]) => {
    acc[id] = cards.items.length;
    return acc;
  }, {} as { [key: string]: number });

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
              <Column key={i} index={i} id={id} cards={cards.items} />
            ))}
        </div>
      </DragDropContext>

      <section className="px-5 items-end flex justify-around">
        <div ref={suitRef} className="flex relative h-32">
          {completedSuitNum > 0 &&
            Array.from({ length: completedSuitNum }).map((_, i) => (
              <div
                style={{ position: "absolute", left: `${i * 20}px` }}
                className="h-32 min-w-24"
              >
                <img
                  src={getImageURL("clubs/1.png")}
                  alt="classic background"
                  className="w-24 h-full"
                />
              </div>
            ))}
        </div>

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

          {deal10Animation && deal10Animation !== "end" && (
            <div className="relative">
              {stock[0].length > 0 ? (
                stock[0].map((card: CardType, i: number) => {
                  const columnLength = card.targetColumnId
                    ? columnLengths[card.targetColumnId]
                    : 0;

                  const marginBetweenCards =
                    columnLength > 15 ? 15 : columnLength > 9 ? 20 : 25;

                  return (
                    <div
                      key={i}
                      style={
                        {
                          "--final-x": `${-translationValue.x + i * 128}px`,
                          "--final-y": `${
                            -translationValue.y +
                            columnLength * marginBetweenCards
                          }px`,
                          animation:
                            deal10Animation == "start"
                              ? `dealCard 0.5s ease-out forwards`
                              : "none",
                          animationDelay:
                            deal10Animation === "start"
                              ? `${i * 0.05}s`
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
                        src={getImageURL(card.imagePath)}
                        alt="Card"
                        className="w-full h-full"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="w-24 h-32 border-2 border-gray-300 rounded" />
              )}
            </div>
          )}

          {stock.map((row: CardType[], i: number) => (
            <div
              onClick={() => {
                if (i === stock.length - 1) {
                  deal10Cards();
                }
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
