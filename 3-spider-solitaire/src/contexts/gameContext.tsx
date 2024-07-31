import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

interface GameContextType {
  functions: {
    handleStartGame: () => void;
    handleGoHome: () => void;
  };
  values: {
    selectedMode: "1" | "2" | "4";
    selectedCard: "blue" | "brown" | "green" | "red";
    activePage: "home" | "game";
    startGamePressed: boolean;
    paused: boolean;
  };
  setters: {
    setSelectedCard: React.Dispatch<
      React.SetStateAction<"blue" | "brown" | "green" | "red">
    >;
    setSelectedMode: React.Dispatch<React.SetStateAction<"1" | "2" | "4">>;
    setActivePage: React.Dispatch<React.SetStateAction<"home" | "game">>;
    setStartGamePressed: React.Dispatch<React.SetStateAction<boolean>>;
    setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const GameContext = createContext<GameContextType>(null!);

// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("The component must be wrapped by the provider!");
  }
  return context;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [selectedMode, setSelectedMode] = useState<"1" | "2" | "4">("1");
  const [selectedCard, setSelectedCard] = useState<
    "blue" | "brown" | "green" | "red"
  >("blue");
  const [activePage, setActivePage] = useState<"home" | "game">("home");
  const [startGamePressed, setStartGamePressed] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  const handleStartGame = useCallback(() => {
    setStartGamePressed(true);
    setTimeout(() => {
      setActivePage("game");
    }, 300);
  }, []);

  const handleGoHome = useCallback(() => {
    setActivePage("home");
    setPaused(false);
    setStartGamePressed(false);
  }, []);

  const value = useMemo(() => {
    const functions = {
      handleStartGame,
      handleGoHome,
    };
    const values = {
      activePage,
      startGamePressed,
      paused,
      selectedCard,
      selectedMode,
    };
    const setters = {
      setActivePage,
      setStartGamePressed,
      setSelectedCard,
      setPaused,
      setSelectedMode,
    };
    return {
      functions,
      values,
      setters,
    };
  }, [
    handleStartGame,
    handleGoHome,
    activePage,
    startGamePressed,
    paused,
    selectedCard,
    selectedMode,
  ]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
