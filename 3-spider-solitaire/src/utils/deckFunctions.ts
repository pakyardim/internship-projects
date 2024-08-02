import { v4 as uuidv4 } from "uuid";
import { CardType } from "src/types";

const suits = ["clubs", "diamonds", "hearts", "spades"];

export const createDeck = (suitNum: number): CardType[] => {
  const ranks = Array.from({ length: 13 }, (_, i) => i + 1);

  const numCardsPerSuit = 104 / suitNum;
  const deck: CardType[] = [];

  for (let i = 0; i < suitNum; i++) {
    for (const rank of ranks) {
      for (let j = 0; j < numCardsPerSuit / 13; j++) {
        deck.push({
          id: `${i}-${rank}-${j}`,
          rank,
          suit: i,
          imagePath: `${suits[i]}/${rank}.png`,
          isOpen: false,
        });
      }
    }
  }

  return deck;
};

export const shuffleDeck = (deck: CardType[]): CardType[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const dealCards = (
  deck: CardType[]
): { stock: CardType[][]; layout: { [x: string]: { items: CardType[] } } } => {
  const numColumns = 10;
  const numRows = 5;
  const layout: CardType[][] = Array.from({ length: numColumns }, () =>
    Array(numRows).fill("")
  );

  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const card = deck.pop();
      if (card) {
        if (row === numRows - 1 && col > 3) card.isOpen = true;
        layout[col][row] = card;
      }
    }
  }

  for (let col = 0; col < 4; col++) {
    for (let row = 5; row < 6; row++) {
      const card = deck.pop();
      if (card) {
        card.isOpen = true;
        layout[col][row] = card;
      }
    }
  }

  const layoutWithIds = {
    [uuidv4()]: {
      items: layout[0],
    },
    [uuidv4()]: {
      items: layout[1],
    },
    [uuidv4()]: {
      items: layout[2],
    },
    [uuidv4()]: {
      items: layout[3],
    },
    [uuidv4()]: {
      items: layout[4],
    },
    [uuidv4()]: {
      items: layout[5],
    },
    [uuidv4()]: {
      items: layout[6],
    },
    [uuidv4()]: {
      items: layout[7],
    },
    [uuidv4()]: {
      items: layout[8],
    },
    [uuidv4()]: {
      items: layout[9],
    },
  };

  const stock: CardType[][] = Array.from({ length: 5 }, () =>
    Array(numRows).fill("")
  );

  for (let i = 0; i < 5; i++) {
    for (let row = 0; row < 10; row++) {
      const card = deck.pop();
      if (card) {
        stock[i][row] = card;
      }
    }
  }

  return { stock, layout: layoutWithIds };
};

export const getDraggableGroup = (
  layout: { [x: string]: { items: CardType[] } },
  draggableId: string
) => {
  for (const [, column] of Object.entries(layout)) {
    const index = column.items.findIndex((card) => card.id === draggableId);
    if (
      index !== -1 &&
      column.items[index]?.rank - 1 === column.items[index + 1]?.rank
    ) {
      return column.items.slice(index);
    }
  }
  return [];
};
