import { useGameContext } from "../contexts/gameContext";
import blueBg from "../assets/card-icons/card-backgrounds/classic_blue.png";
import brownBg from "../assets/card-icons/card-backgrounds/classic_brown.png";
import greenBg from "../assets/card-icons/card-backgrounds/classic_green.png";
import redBg from "../assets/card-icons/card-backgrounds/classic_red.png";

export function SettingsModal({
  setSettingsOpen,
}: {
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    values: { selectedCard },
    setters: { setSelectedCard },
  } = useGameContext();

  const handleClose = () => {
    setSettingsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={() => {}}
        className="bg-white/90 flex flex-col gap-y-10 text-black font-primary p-8 rounded-xl shadow-lg max-w-xl w-full"
      >
        <div className="w-full flex justify-between">
          <div className="flex-1 text-center">
            <h2 className="font-bold text-xl">Settings</h2>
          </div>
          <button onClick={handleClose} className="font-bold">
            X
          </button>
        </div>
        <div className="flex justify-between">
          <label className="cursor-pointer flex items-center">
            <input
              checked={selectedCard === "blue"}
              onChange={() => setSelectedCard("blue")}
              type="radio"
              value="1"
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <img src={blueBg} alt="Blue Background" className="w-20" />
          </label>
          <label className="cursor-pointer flex items-center">
            <input
              checked={selectedCard === "brown"}
              onChange={() => setSelectedCard("brown")}
              type="radio"
              value="1"
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <img src={brownBg} alt="Brown Background" className="w-20" />
          </label>
          <label className="cursor-pointer flex items-center">
            <input
              checked={selectedCard === "green"}
              onChange={() => setSelectedCard("green")}
              type="radio"
              value="1"
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <img src={greenBg} alt="Green Background" className="w-20" />
          </label>
          <label className="cursor-pointer flex items-center">
            <input
              checked={selectedCard === "red"}
              onChange={() => setSelectedCard("red")}
              type="radio"
              value="1"
              className="hidden peer"
            />
            <span className="radio-custom"></span>
            <img src={redBg} alt="Red Background" className="w-20" />
          </label>
        </div>
      </div>
    </div>
  );
}
