import { useEffect, useState } from "react";

import blueBg from "../assets/card-icons/card-backgrounds/classic_blue.png";
import { createDeck, dealCards, shuffleDeck } from "../utils/deckFunctions";
import { CardType } from "../types";
import { convertSecsToTime } from "../utils/utilFunctions";
import hintImg from "../assets/hint.png";
import { FaPause, FaUndo, FaUndoAlt } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";

function getImageURL(name: string) {
  return new URL(`../assets/card-icons/${name}`, import.meta.url).href;
}

export function Game() {
  const numSuits = 1;

  const deck = createDeck(numSuits);
  const shuffledDeck = shuffleDeck(deck);
  const { stock: initialStock, layout: initialLayout } =
    dealCards(shuffledDeck);

  const [stock, setStock] = useState<CardType[][]>(initialStock);
  const [layout, setLayout] = useState<CardType[][]>(initialLayout);
  const [timer, setTimer] = useState<number>(0);
  const [score, setScore] = useState<number>(500);
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [paused]);

  return (
    <div className={`w-full h-full flex flex-col md:px-0 md:py-10 lg:px-32`}>
      <div className="bg-green-900/90 flex justify-between mb-10">
        <div className="w-10">
          <p className="text-white text-2xl">{convertSecsToTime(timer)}</p>
        </div>
        <div className="w-30">
          <p className="text-white text-2xl">Score: {score}</p>
        </div>
        <button>
          <FaPause />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <section className="flex justify-between">
          {layout.map((col, i) => (
            <div key={i} className="relative">
              {col.length > 0 ? (
                col.map((card: CardType, j: number) => (
                  <div
                    key={j}
                    style={{
                      position: j > 0 ? "absolute" : "static",
                      top: col.length > 8 ? j * 12 : j * 20,
                    }}
                    className={`${
                      card.isOpen &&
                      "hover:outline cursor-pointer hover:rounded outline-blue-300"
                    } w-24 h-32`}
                  >
                    <img
                      src={
                        card.isOpen
                          ? getImageURL(card.imagePath)
                          : getImageURL("card-backgrounds/classic_blue.png")
                      }
                      alt="Classic Blue Background"
                      className="w-full h-full"
                    />
                  </div>
                ))
              ) : (
                <div className="w-24 h-32 border-2 border-gray-300 rounded" />
              )}
            </div>
          ))}
        </section>
        <section className="px-5 items-end flex justify-between">
          <div className="flex space-x-20 items-center">
            <img
              src={hintImg}
              alt="Hint"
              className="hint w-12 cursor-pointer"
            />
            <button>
              <FaUndoAlt
                size={44}
                className="text-white/80 hover:text-red-400"
              />
            </button>
          </div>
          <div className="flex relative">
            {stock.map((row: CardType[], i: number) => (
              <div
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
                  src={blueBg}
                  alt="Classic Blue Background"
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
