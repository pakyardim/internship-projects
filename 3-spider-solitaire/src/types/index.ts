export type CardType = {
  id: string;
  rank: number;
  suit: number;
  imagePath: string;
  isOpen: boolean;
};

export type LayoutType = { [x: string]: { items: CardType[] } };
