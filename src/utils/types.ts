export type Piece = {
  type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  color: 'black' | 'white';
  img: string;
};

export type Cell = {
  color: 'white' | 'black';
  piece?: Piece;
};

export type Board = Cell[][];
