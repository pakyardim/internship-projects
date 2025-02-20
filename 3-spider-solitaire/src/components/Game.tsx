import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

import {
  EndGameModal,
  PauseModal,
  GameHeader,
  Column,
  Buttons,
  StockCard,
} from "src/components";
import { useGameContext } from "src/contexts/gameContext";
import { getImageURL } from "src/utils/utilFunctions";
import { CardType } from "src/types";
import { useWindowSize } from "src/hooks/useWindowSize";

export function Game() {
  const {
    values: {
      paused,
      stock,
      layout,
      selectedCard,
      endGame,
      deal10Animation,
      completedSuitNum,
      dealAnimation,
    },
    setters: { setSuitTranslationValue, setSuitAnimation, setDealAnimation },
    functions: { onDragEnd, onBeforeCapture },
  } = useGameContext();

  const windowWidth = useWindowSize();

  const [translationValue, setTranslationValue] = useState({ x: 0, y: 0 });

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
    }, 50);
  }, [setDealAnimation, setSuitAnimation, setSuitTranslationValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDealAnimation("end");
    }, 2300);

    return () => clearTimeout(timeout);
  }, [setDealAnimation]);

  const columnLengths: { [key: string]: number } = Object.entries(
    layout!
  ).reduce((acc, [id, cards]) => {
    acc[id] = cards.items.length;
    return acc;
  }, {} as { [key: string]: number });

  const xMultiplier =
    windowWidth >= 1280
      ? 128
      : windowWidth >= 1024
      ? 96
      : windowWidth >= 768
      ? 80
      : windowWidth >= 640
      ? 64
      : windowWidth >= 400
      ? 40
      : 36;

  const yMultiplier = 25;

  const stockLeftMultiplier =
    windowWidth >= 768 ? 20 : windowWidth >= 400 ? 14 : 6;

  return (
    <div className="px-2 sm:px-5 py-10 md:px-5 xl:px-32 w-full h-full flex flex-col">
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
        <div
          ref={topSectionRef}
          className="flex-1 inline-flex gap-x-2 sm:gap-x-4 lg:gap-x-8"
        >
          {dealAnimation === "end" &&
            Object.entries(layout!).map(([id, cards], i) => (
              <Column key={i} index={i} id={id} cards={cards.items} />
            ))}
        </div>
      </DragDropContext>

      <section className="px-5 items-center flex justify-around">
        <div
          ref={suitRef}
          className="flex relative h-10 xs:h-12 sm:h-16 md:h-20 xl:h-32"
        >
          {completedSuitNum > 0 &&
            Array.from({ length: completedSuitNum }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${i * stockLeftMultiplier}px`,
                }}
                className="h-10 min-w-7 xs:h-12 xs:min-w-8 sm:h-16 sm:min-w-12 md:h-20 md:min-w-16 xl:min-w-24 xl:h-32"
              >
                <img
                  src={getImageURL("clubs/1.png")}
                  alt="classic background"
                  className="w-7 xs:w-8 sm:w-12 md:w-16 xl:w-24 h-full"
                />
              </div>
            ))}
        </div>

        <Buttons />

        <div
          ref={stockRef}
          className="flex relative h-10 xs:h-12 sm:h-16 md:h-20 xl:h-32"
        >
          {dealAnimation !== "end" &&
            layout &&
            Object.entries(layout)?.map(([, cards], i) => (
              <div key={i} className="relative">
                {cards.items.length > 0 ? (
                  cards.items.map((card: CardType, j: number) => (
                    <div
                      key={j}
                      style={
                        {
                          "--final-x": `${
                            -translationValue.x + i * xMultiplier
                          }px`,
                          "--final-y": `${
                            -translationValue.y + j * yMultiplier
                          }px`,
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
                      } h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32`}
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
                  <div className="w-7 h-10 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32 border-2 border-gray-300 rounded" />
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
                          "--final-x": `${
                            -translationValue.x + i * xMultiplier
                          }px`,
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
                      } h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32`}
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
                <div className="h-10 w-7 xs:h-12 xs:w-8 sm:h-16 sm:w-12 md:h-20 md:w-16 xl:w-24 xl:h-32 border-2 border-gray-300 rounded" />
              )}
            </div>
          )}

          {stock.map((_row: CardType[], i: number) => (
            <StockCard
              key={i}
              stockLeftMultiplier={stockLeftMultiplier}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
