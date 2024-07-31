import { useState } from "react";
import { Home } from "./components/Home";
import { Game } from "./components/Game";

function App() {
  const [activePage, setActivePage] = useState<"home" | "game">("home");
  const [startGamePressed, setStartGamePressed] = useState(false);

  const handleStartGame = () => {
    setStartGamePressed(true);
    setTimeout(() => {
      setActivePage("game");
    }, 300);
  };

  return (
    <main className="font-primary flex flex-col items-center justify-center max-h-screen bg-green-900 text-white">
      {activePage === "home" && (
        <Home onClick={handleStartGame} pressed={startGamePressed} />
      )}
      {activePage === "game" && <Game />}
    </main>
  );
}

export default App;
