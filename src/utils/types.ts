export type Piece = {
  type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  color: 'black' | 'white';
  img: string;
  hasMoved?: boolean;
  lastMoveNum?: number;
  prevCell?: {
    r: number;
    c: number;
  };
};

export type Cell = {
  r: number;
  c: number;
  color: 'white' | 'black';
  piece?: Piece;
};

export type Board = Cell[][];
