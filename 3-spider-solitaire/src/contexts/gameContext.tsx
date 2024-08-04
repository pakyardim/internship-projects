/* eslint-disable react-refresh/only-export-components */
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

import cardDropSoundFile from "src/assets/sounds/card_drop.mp3";
import flipCardSoundFile from "src/assets/sounds/flip-card.mp3";
import shuffleCardsSoundFile from "src/assets/sounds/shuffle-cards.mp3";
import stockFlipSoundFile from "src/assets/sounds/stock_flip.mp3";
import undoSoundFile from "src/assets/sounds/undo.mp3";
import victorySoundFile from "src/assets/sounds/victory.mp3";

interface GameContextType {
  functions: {
    onBeforeCapture: (beforeCapture: { draggableId: string }) => void;
    handleStartGame: () => void;
    handleGoHome: () => void;
    deal10Cards: () => void;
    onDragEnd: (result: { destination: any; source?: any }) => void;
    handleRestart: () => void;
    undo: () => void;
    provideHint: () => void;
  };
  values: {
    suitAnimation: "start" | "end" | null;
    suitTranslationValue: { x: number; y: number };
    deal10Animation: "start" | "end" | null;
    lastCompletedSuit: { columnId: string; cards: CardType[] };
    timer: number;
    endGame: "lose" | "win" | null;
    completedSuitNum: number;
    score: number;
    hint: { from: string; to: string; cards: CardType[] } | undefined;
    draggableGroup: CardType[] | undefined;
    draggableId: string | undefined;
    stock: CardType[][];
    history: { layout: LayoutType; completedSuit: boolean }[];
    layout: LayoutType | undefined;
    selectedMode: "1" | "2" | "4";
    selectedCard: "blue" | "brown" | "green" | "red";
    activePage: "home" | "game";
    startGamePressed: boolean;
    paused: boolean;
  };
  setters: {
    setSuitAnimation: React.Dispatch<
      React.SetStateAction<"start" | "end" | null>
    >;
    setSuitTranslationValue: React.Dispatch<
      React.SetStateAction<{ x: number; y: number }>
    >;
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

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("The component must be wrapped by the provider!");
  }
  return context;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const cardDropSound = useMemo(() => new Audio(cardDropSoundFile), []);
  const undoSound = useMemo(() => new Audio(undoSoundFile), []);
  const flipCardSound = useMemo(() => new Audio(flipCardSoundFile), []);
  const shuffleCardsSound = useMemo(() => new Audio(shuffleCardsSoundFile), []);
  const stockFlipSound = useMemo(() => new Audio(stockFlipSoundFile), []);
  const victorySound = useMemo(() => new Audio(victorySoundFile), []);

  const [selectedMode, setSelectedMode] = useState<"1" | "2" | "4">("1");
  const [selectedCard, setSelectedCard] = useState<
    "blue" | "brown" | "green" | "red"
  >("blue");
  const [activePage, setActivePage] = useState<"home" | "game">("home");
  const [startGamePressed, setStartGamePressed] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [endGame, setEndGame] = useState<"lose" | "win" | null>(null);
  const [stock, setStock] = useState<CardType[][]>([[]]);
  const [layout, setLayout] = useState<LayoutType>();
  const [history, setHistory] = useState<
    { layout: LayoutType; completedSuit: boolean }[]
  >([]);
  const [completedSuitNum, setCompletedSuitNum] = useState<number>(0);
  const [score, setScore] = useState<number>(500);
  const [draggableGroup, setDraggableGroup] = useState<CardType[]>();
  const [timer, setTimer] = useState<number>(0);
  const [draggableId, setDraggableId] = useState<string>();
  const [hint, setHint] = useState<{
    from: string;
    to: string;
    cards: CardType[];
  }>({ from: "", to: "", cards: [] });

  const [deal10Animation, setDeal10Animation] = useState<
    "start" | "end" | null
  >(null);

  const [suitAnimation, setSuitAnimation] = useState<"start" | "end" | null>(
    null
  );

  const [suitTranslationValue, setSuitTranslationValue] = useState({
    x: 0,
    y: 0,
  });

  const [lastCompletedSuit, setLastCompletedSuit] = useState<{
    columnId: string;
    cards: CardType[];
  }>({ columnId: "", cards: [] });

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

      setScore(
        (prevScore) =>
          prevScore +
          (selectedMode === "1" ? 50 : selectedMode === "2" ? 100 : 150)
      );

      return true;
    },
    [selectedMode]
  );

  const findPossibleMoves = useCallback(
    (layout: LayoutType): { from: string; to: string; cards: CardType[] }[] => {
      const possibleMoves: { from: string; to: string; cards: CardType[] }[] =
        [];

      const isDescendingSequence = (cards: CardType[]) => {
        for (let i = 0; i < cards.length - 1; i++) {
          if (cards[i].rank !== cards[i + 1].rank + 1) {
            return false;
          }
        }
        return true;
      };

      const columns = Object.keys(layout);

      for (let i = 0; i < columns.length; i++) {
        const fromColumnId = columns[i];
        const fromColumn = layout[fromColumnId].items;

        if (!fromColumn.some((card) => card.isOpen)) continue;

        for (let j = 0; j < columns.length; j++) {
          if (i === j) continue;

          const toColumnId = columns[j];
          const toColumn = layout[toColumnId].items;

          const canMoveToColumn =
            toColumn.length === 0 || toColumn[toColumn.length - 1].isOpen;

          if (!canMoveToColumn) continue;

          for (let k = 0; k < fromColumn.length; k++) {
            const card = fromColumn[k];
            const previousCard = fromColumn[k - 1]?.isOpen
              ? fromColumn[k - 1]
              : null || null;

            const mockLayout = JSON.parse(JSON.stringify(layout));

            if (!card.isOpen) continue;

            if (k === fromColumn.length - 1) {
              const openToItems = toColumn.filter((card) => card.isOpen);
              const toItems = [...openToItems, card];

              const newColumns = {
                ...mockLayout,
                [toColumnId]: {
                  ...toColumn,
                  items: toItems,
                },
              };

              const completedSuit = checkCompletedSuit({
                columnId: toColumnId,
                layout: newColumns,
              });

              if (
                toColumn.length === 0 ||
                toColumn[toColumn.length - 1].rank === card.rank + 1
              ) {
                if (
                  !previousCard ||
                  (previousCard &&
                    previousCard.rank !==
                      toColumn[toColumn.length - 1]?.rank) ||
                  (previousCard &&
                    previousCard.rank === toColumn[toColumn.length - 1]?.rank &&
                    completedSuit)
                ) {
                  possibleMoves.push({
                    from: fromColumnId,
                    to: toColumnId,
                    cards: [card],
                  });
                }
              }
            } else {
              if (!card.isOpen) continue;

              const sequence: CardType[] = [card];
              for (let l = k + 1; l < fromColumn.length; l++) {
                const nextCard = fromColumn[l];
                sequence.push(nextCard);
              }

              if (
                sequence[0].rank + 1 === toColumn[toColumn.length - 1]?.rank &&
                sequence.length > 1 &&
                isDescendingSequence(sequence)
              ) {
                const openToItems = toColumn.filter((card) => card.isOpen);
                const toItems = [...openToItems, ...sequence];

                const newColumns = {
                  ...mockLayout,
                  [toColumnId]: {
                    ...toColumn,
                    items: toItems,
                  },
                };

                const completedSuit = checkCompletedSuit({
                  columnId: toColumnId,
                  layout: newColumns,
                });

                if (
                  !previousCard ||
                  (previousCard &&
                    previousCard.rank !== toColumn[toColumn.length - 1].rank) ||
                  (previousCard &&
                    previousCard.rank === toColumn[toColumn.length - 1].rank &&
                    completedSuit)
                ) {
                  const possibleMove = {
                    from: fromColumnId,
                    to: toColumnId,
                    cards: sequence,
                  };

                  const idx = possibleMoves.findIndex(
                    (move) => move === possibleMove
                  );

                  if (idx === -1)
                    possibleMoves.push({
                      from: fromColumnId,
                      to: toColumnId,
                      cards: sequence,
                    });
                }
              }
            }
          }
        }
      }

      return possibleMoves;
    },
    [checkCompletedSuit]
  );

  const checkGameLost = useCallback(
    (layout: LayoutType) => {
      const possibleMoves = findPossibleMoves(layout);
      if (
        (!possibleMoves && !stock) ||
        (possibleMoves?.length === 0 && !stock[0])
      ) {
        setEndGame("lose");
      }
    },
    [findPossibleMoves, stock]
  );

  const deal10Cards = useCallback(() => {
    let newLayoutObj = {};

    const minItemsLength = Math.min(
      ...Object.values(layout!).map((column) => column.items.length)
    );

    if (minItemsLength < 1) return;

    shuffleCardsSound.play();

    setDeal10Animation("start");

    setTimeout(() => {
      Object.entries(layout!).map(([id, column]) => {
        const poppedCard = stock[0].shift();
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

      setHistory((prevHistory) => [
        ...prevHistory,
        { layout: JSON.parse(JSON.stringify(layout)), completedSuit: false },
      ]);

      stockFlipSound.play();

      checkGameLost(newLayoutObj);

      setLayout(newLayoutObj);

      const newStock = stock.splice(1);
      setStock(newStock);
      setDeal10Animation("end");
    }, 1000);
  }, [layout, shuffleCardsSound, stockFlipSound, checkGameLost, stock]);

  const undo = useCallback(() => {
    if (history.length < 1) return;
    undoSound.play();

    const previousMove = history[history.length - 1];

    setScore((prevScore) => prevScore - 1);

    if (previousMove.completedSuit) {
      setCompletedSuitNum((prevSuits) => prevSuits - 1);
    }

    setLayout(previousMove.layout);

    setHistory((prevHistory) => prevHistory.slice(0, -1));
  }, [history, undoSound]);

  const onDragEnd = useCallback(
    (result: { destination: any; source?: any }) => {
      if (!result.destination || !layout) return;
      const { source, destination } = result;
      let newColumns = {};
      if (source.droppableId === destination.droppableId) {
        if (draggableGroup) setDraggableGroup(undefined);
        return;
      }

      cardDropSound.play();

      const sourceColumn = layout[source.droppableId];
      const destColumn = layout[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      const lastDestItem = destItems[destItems.length - 1];

      if (
        lastDestItem &&
        sourceItems[source.index].rank + 1 !== lastDestItem?.rank
      ) {
        return;
      }

      const prevLayout = JSON.parse(JSON.stringify(layout));

      if (draggableGroup && draggableGroup.length > 1) {
        for (let i = source.index; i < sourceItems.length; i++) {
          destItems.splice(destItems.length, 0, sourceItems[i]);
        }

        sourceItems.splice(source.index, sourceItems.length - source.index);

        const prevItem = sourceItems[sourceItems.length - 1];
        if (prevItem && !prevItem.isOpen) {
          setScore(
            (prevScore) =>
              prevScore +
              (selectedMode === "1" ? 2 : selectedMode === "2" ? 3 : 4)
          );
          flipCardSound.play();

          prevItem.isOpen = true;
        }

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
        if (prevItem && !prevItem.isOpen) {
          setScore(
            (prevScore) =>
              prevScore +
              (selectedMode === "1" ? 2 : selectedMode === "2" ? 3 : 4)
          );

          flipCardSound.play();

          prevItem.isOpen = true;
        }

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

      const completedSuit = checkCompletedSuit({
        columnId: destination.droppableId,
        layout: newColumns,
      });

      if (completedSuit) {
        setHistory((prevHistory) => [
          ...prevHistory,
          { layout: prevLayout, completedSuit: true },
        ]);

        setTimeout(() => {
          setSuitAnimation("start");
          shuffleCardsSound.play();

          setLayout((prevColumns: LayoutType | undefined) => {
            if (!prevColumns) return undefined;

            setHistory((prevHistory) => [
              ...prevHistory,
              JSON.parse(JSON.stringify(prevColumns)),
            ]);

            const newColumns = { ...prevColumns };
            const items = newColumns[destination.droppableId].items;

            const cards = items.splice(-13, 13);

            setLastCompletedSuit({ cards, columnId: destination.droppableId });

            if (items[items.length - 1] && !items[items.length - 1].isOpen) {
              setScore(
                (prevScore) =>
                  prevScore +
                  (selectedMode === "1" ? 2 : selectedMode === "2" ? 3 : 4)
              );

              flipCardSound.play();

              items[items.length - 1].isOpen = true;
            }

            if (completedSuitNum === 7) {
              victorySound.play();
              setEndGame("win");
            } else {
              checkGameLost(newColumns);
            }

            return newColumns;
          });

          setScore(
            (prevScore) =>
              prevScore +
              (selectedMode === "1" ? 50 : selectedMode === "2" ? 100 : 150)
          );
        }, 1000);

        setTimeout(() => {
          setSuitAnimation("end");
          setCompletedSuitNum(
            (prevCompletedSuitNum) => prevCompletedSuitNum + 1
          );
          setLastCompletedSuit({ columnId: "", cards: [] });
        }, 3000);
      } else {
        setHistory((prevHistory) => [
          ...prevHistory,
          { layout: prevLayout, completedSuit: false },
        ]);
      }
    },
    [
      cardDropSound,
      checkCompletedSuit,
      checkGameLost,
      completedSuitNum,
      draggableGroup,
      flipCardSound,
      layout,
      selectedMode,
      shuffleCardsSound,
      victorySound,
    ]
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

  const provideHint = useCallback(() => {
    if (layout) {
      const possibleMoves = findPossibleMoves(layout);
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const { from, to, cards } = possibleMoves[randomIndex];
        setHint({ from, to, cards });
      } else if (stock[0].length > 0) {
        setHint({ from: "stock", to: "layout", cards: [stock[0][0]] });
      }

      setTimeout(() => {
        setHint({ from: "", to: "", cards: [] });
      }, 2000);
    }
  }, [findPossibleMoves, layout, stock]);

  const prepareLayout = useCallback(() => {
    const deck = createDeck(+selectedMode);
    const shuffledDeck = shuffleDeck(deck);
    const { stock: initialStock, layout: initialLayout } =
      dealCards(shuffledDeck);

    setHistory([]);
    setStock(initialStock);
    setLayout(initialLayout);

    shuffleCardsSound.play();
  }, [selectedMode, shuffleCardsSound]);

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
      undo,
      onBeforeCapture,
      handleRestart,
      provideHint,
    };
    const values = {
      activePage,
      deal10Animation,
      endGame,
      timer,
      draggableGroup,
      draggableId,
      score,
      completedSuitNum,
      layout,
      suitTranslationValue,
      suitAnimation,
      lastCompletedSuit,
      history,
      stock,
      hint,
      startGamePressed,
      paused,
      selectedCard,
      selectedMode,
    };
    const setters = {
      setStock,
      setLayout,
      setSuitTranslationValue,
      setActivePage,
      setSuitAnimation,
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
    undo,
    onBeforeCapture,
    handleRestart,
    provideHint,
    activePage,
    deal10Animation,
    setSuitAnimation,
    endGame,
    timer,
    draggableGroup,
    draggableId,
    score,
    completedSuitNum,
    layout,
    suitTranslationValue,
    suitAnimation,
    lastCompletedSuit,
    history,
    stock,
    hint,
    startGamePressed,
    paused,
    selectedCard,
    selectedMode,
  ]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
