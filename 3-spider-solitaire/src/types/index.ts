export type CardType = {
  id: string;
  rank: number;
  suit: number;
  imagePath: string;
  isOpen: boolean;
  targetColumnId?: string;
};

export type LayoutType = { [x: string]: { items: CardType[] } };
