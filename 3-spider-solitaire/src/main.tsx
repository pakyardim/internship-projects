import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";

import { GameProvider } from "./contexts/gameContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GameProvider>
    <App />
  </GameProvider>
);
