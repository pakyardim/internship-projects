import { IoMdHome } from "react-icons/io";
import { VscTriangleRight } from "react-icons/vsc";

import { useGameContext } from "../../contexts/gameContext";

export function PauseModal() {
  const {
    setters: { setPaused },
    functions: { handleGoHome },
  } = useGameContext();

  const handleResume = () => {
    setPaused(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleResume();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white/90 flex flex-col gap-y-10 text-black font-primary p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="w-full flex justify-between">
          <div className="flex-1 text-center">
            <h2 className="font-bold text-xl">Game Paused</h2>
          </div>
          <button onClick={handleResume} className="font-bold">
            X
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleResume}
            className="flex items-center gap-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-xl"
          >
            Resume <VscTriangleRight />
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-xl"
          >
            Quit <IoMdHome />
          </button>
        </div>
      </div>
    </div>
  );
}
