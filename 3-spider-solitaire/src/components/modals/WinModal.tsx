import { IoMdHome } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";

import { useGameContext } from "../../contexts/gameContext";

export function WinModal() {
  const {
    values: { score },
    functions: { handleGoHome, handleRestart },
  } = useGameContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white/90 flex flex-col gap-y-10 text-black font-primary p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="w-full flex justify-between">
          <div className="flex-1 text-center">
            <h2 className="font-bold text-xl">YOU WON!</h2>
          </div>
        </div>
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg">Final Score:</h3>
          <h3 className="font-semibold text-lg">
            <span>{score}</span>
          </h3>
        </div>
        <div className="flex flex-col gap-y-3 w-28 mx-auto">
          <button
            onClick={handleRestart}
            className="w-full flex justify-between items-center gap-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-xl"
          >
            Restart <VscDebugRestart />
          </button>
          <button
            onClick={handleGoHome}
            className="w-full flex justify-between items-center gap-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-xl"
          >
            Exit <IoMdHome />
          </button>
        </div>
      </div>
    </div>
  );
}
