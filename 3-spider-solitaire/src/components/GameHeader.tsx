import { FaPause } from "react-icons/fa";
import { useGameContext } from "src/contexts/gameContext";
import { convertSecsToTime } from "src/utils/utilFunctions";

export function GameHeader() {
  const {
    values: { score, timer },
    setters: { setPaused },
  } = useGameContext();

  return (
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
  );
}