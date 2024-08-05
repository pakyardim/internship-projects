import { FaUndoAlt } from "react-icons/fa";
import { useGameContext } from "src/contexts/gameContext";
import hintImg from "src/assets/hint.png";

export function Buttons() {
  const {
    functions: { undo, provideHint },
  } = useGameContext();

  return (
    <div className="flex space-x-20 items-center">
      <button onClick={provideHint}>
        <img
          src={hintImg}
          alt="Hint"
          className="hint w-6 xl:w-10 cursor-pointer"
        />
      </button>

      <button onClick={undo}>
        <FaUndoAlt className="w-6 h-6 xl:h-10 xl:w-10 text-white/80 hover:text-red-400" />
      </button>
    </div>
  );
}
