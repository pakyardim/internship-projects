/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { CardType, LayoutType } from "src/types";
import {
  createDeck,
  dealCards,
  getDraggableGroup,
  shuffleDeck,
} from "src/utils/deckFunctions";

interface GameContextType {
  functions: {
    onBeforeCapture: (beforeCapture: { draggableId: string }) => void;
    handleStartGame: () => void;
    handleGoHome: () => void;
    deal10Cards: () => void;
    onDragEnd: (result: { destination: any; source?: any }) => void;
    handleRestart: () => void;
  };
  values: {
    timer: number;
    endGame: "lose" | "win" | null;
    completedSuitNum: number;
    score: number;
    draggableGroup: CardType[] | undefined;
    draggableId: string | undefined;
    stock: CardType[][];
    layout: LayoutType | undefined;
    selectedMode: "1" | "2" | "4";
    selectedCard: "blue" | "brown" | "green" | "red";
    activePage: "home" | "game";
    startGamePressed: boolean;
    paused: boolean;
  };
  setters: {
    setTimer: React.Dispatch<React.SetStateAction<number>>;
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
  const [endGame, setEndGame] = useState<"lose" | "win" | null>("win");
  const [stock, setStock] = useState<CardType[][]>([[]]);
  const [layout, setLayout] = useState<LayoutType>();
  const [completedSuitNum, setCompletedSuitNum] = useState<number>(0);
  const [score, setScore] = useState<number>(500);
  const [draggableGroup, setDraggableGroup] = useState<CardType[]>();
  const [timer, setTimer] = useState<number>(0);
  const [draggableId, setDraggableId] = useState<string>();

  const deal10Cards = useCallback(() => {
    let newLayoutObj = {};
    Object.entries(layout!).map(([id, column]) => {
      const poppedCard = stock[0].pop();
      const newColumn = [...column.items, { ...poppedCard, isOpen: true }];

      const newItems = {
        ...column,
        items: newColumn,
      };

      newLayoutObj = {
        ...newLayoutObj,
        [id]: newItems,
      };
    });

    setLayout(newLayoutObj);

    const newStock = stock.splice(1);
    setStock(newStock);
  }, [stock, layout]);

  const checkCompletedSuit = useCallback(
    ({
      columnId,
      layout,
    }: {
      columnId: string;
      layout: { [x: string]: { items: CardType[] } };
    }) => {
      const column = layout[columnId].items;
      if (column.length < 13) return false;
      const last13Cards = column.slice(-13);

      for (let i = 0; i < last13Cards.length; i++) {
        if (last13Cards[i].rank !== 13 - i) {
          return false;
        }
      }

      return true;
    },
    []
  );

  const onDragEnd = useCallback(
    (result: { destination: any; source?: any }) => {
      if (!result.destination || !layout) return;
      const { source, destination } = result;
      let newColumns = {};
      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = layout[source.droppableId];
        const destColumn = layout[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];

        const lastDestItem = destItems[destItems.length - 1];

        if (
          lastDestItem &&
          sourceItems[source.index].rank + 1 !== lastDestItem.rank
        ) {
          return;
        }

        if (draggableGroup && draggableGroup.length > 1) {
          for (let i = source.index; i < sourceItems.length; i++) {
            destItems.splice(destItems.length, 0, sourceItems[i]);
          }

          sourceItems.splice(source.index, sourceItems.length - source.index);

          const prevItem = sourceItems[sourceItems.length - 1];
          if (prevItem) prevItem.isOpen = true;

          newColumns = {
            ...layout,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          };

          setLayout(newColumns);
        } else {
          const [removed] = sourceItems.splice(source.index, 1);
          const prevItem = sourceItems[sourceItems.length - 1];
          if (prevItem) prevItem.isOpen = true;

          destItems.splice(destItems.length, 0, removed);

          newColumns = {
            ...layout,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          };

          setLayout(newColumns);
        }

        setDraggableGroup(undefined);

        setTimeout(() => {
          const completedSuit = checkCompletedSuit({
            columnId: destination.droppableId,
            layout: newColumns,
          });

          if (completedSuit) {
            if (completedSuitNum === 7) setEndGame("win");

            setCompletedSuitNum(
              (prevCompletedSuitNum) => prevCompletedSuitNum + 1
            );

            setLayout((prevColumns: LayoutType | undefined) => {
              if (!prevColumns) return undefined;
              const newColumns = { ...prevColumns };
              const items = newColumns[destination.droppableId].items;
              items.splice(-13, 13);
              if (items[items.length - 1])
                items[items.length - 1].isOpen = true;
              return newColumns;
            });

            setScore((prevScore) => prevScore + 100);
          }
        }, 1000);
      }
    },
    [checkCompletedSuit, completedSuitNum, draggableGroup, layout]
  );

  useEffect(() => {
    if (paused || endGame || activePage !== "game") return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activePage, endGame, paused, setTimer]);

  const onBeforeCapture = useCallback(
    (beforeCapture: { draggableId: string }) => {
      const draggableGroup = getDraggableGroup(
        layout!,
        beforeCapture.draggableId
      );

      if (draggableGroup && draggableGroup.length > 1)
        setDraggableGroup(draggableGroup);

      setDraggableId(beforeCapture.draggableId);
    },
    [layout]
  );

  const prepareLayout = useCallback(() => {
    const deck = createDeck(+selectedMode);
    const shuffledDeck = shuffleDeck(deck);
    const { stock: initialStock, layout: initialLayout } =
      dealCards(shuffledDeck);

    setStock(initialStock);
    setLayout(initialLayout);
  }, [selectedMode]);

  const handleStartGame = useCallback(() => {
    setStartGamePressed(true);
    setTimeout(() => {
      prepareLayout();
      setActivePage("game");
    }, 300);
  }, [prepareLayout]);

  const handleRestart = useCallback(() => {
    setEndGame(null);
    setCompletedSuitNum(0);
    setTimer(0);
    setScore(500);
    prepareLayout();
  }, [prepareLayout]);

  const handleGoHome = useCallback(() => {
    setEndGame(null);
    setActivePage("home");
    setTimer(0);
    setScore(500);
    setPaused(false);
    setStartGamePressed(false);
  }, []);

  const value = useMemo(() => {
    const functions = {
      handleStartGame,
      handleGoHome,
      deal10Cards,
      onDragEnd,
      onBeforeCapture,
      handleRestart,
    };
    const values = {
      activePage,
      endGame,
      timer,
      draggableGroup,
      draggableId,
      score,
      completedSuitNum,
      layout,
      stock,
      startGamePressed,
      paused,
      selectedCard,
      selectedMode,
    };
    const setters = {
      setStock,
      setLayout,
      setActivePage,
      setTimer,
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
    deal10Cards,
    onDragEnd,
    onBeforeCapture,
    handleRestart,
    activePage,
    endGame,
    timer,
    draggableGroup,
    draggableId,
    score,
    completedSuitNum,
    layout,
    stock,
    startGamePressed,
    paused,
    selectedCard,
    selectedMode,
  ]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
