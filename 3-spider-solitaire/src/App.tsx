import { Home } from "src/components/Home";
import { Game } from "src/components/Game";
import { useGameContext } from "src/contexts/gameContext";

function App() {
  const {
    values: { activePage },
  } = useGameContext();

  return (
    <main className="font-primary flex flex-col items-center justify-center max-h-screen bg-green-900 text-white">
      {activePage === "home" && <Home />}
      {activePage === "game" && <Game />}
    </main>
  );
}

export default App;
