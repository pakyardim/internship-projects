import { useState } from "react";

import spiderImg from "src/assets/spider.png";
import { useGameContext } from "src/contexts/gameContext";
import { SettingsModal } from "src/components";

export function Home() {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const {
    values: { selectedMode, startGamePressed },
    functions: { handleStartGame },
    setters: { setSelectedMode },
  } = useGameContext();

  return (
    <div
      className={`flex flex-col gap-y-10 ${
        startGamePressed ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
    >
      {settingsOpen && <SettingsModal setSettingsOpen={setSettingsOpen} />}
      <div className="flex items-center gap-x-5">
        <h1 className="text-2xl sm:text-4xl font-semibold">Spider Solitaire</h1>
        <img
          src={spiderImg}
          alt="Spider Solitaire"
          className="w-16 h-16 sm:w-20 sm:h-20"
        />
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="flex justify-between">
          <label className="text-sm sm:text-base cursor-pointer flex items-center">
            <input
              type="radio"
              value="1"
              checked={selectedMode === "1"}
              onChange={() => setSelectedMode("1")}
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <span className="ml-2">1 Suit</span>
          </label>
          <label className={`cursor-pointer flex items-center`}>
            <input
              type="radio"
              value="2"
              checked={selectedMode === "2"}
              onChange={() => setSelectedMode("2")}
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <span className="ml-2">2 Suits</span>
          </label>
          <label className={`cursor-pointer flex items-center`}>
            <input
              type="radio"
              value="4"
              checked={selectedMode === "4"}
              onChange={() => setSelectedMode("4")}
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <span className="ml-2">4 Suits</span>
          </label>
        </div>

        <button
          onClick={handleStartGame}
          className="shadow-lg bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Game
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="text-rose-300 hover:underline"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
