import { Board, Cell, Piece } from 'src/utils/types';

const initializeBoard = (): Board => {
  const board: Board = Array.from({ length: 8 }, (_, r) =>
    Array.from(
      { length: 8 },
      (_, c) =>
        ({ color: (c + r) % 2 == 0 ? 'black' : 'white', r, c } satisfies Cell),
    ),
  );

  for (let c = 0; c < 8; ++c) {
    board[1][c].piece = {
      type: 'pawn',
      color: 'white',
      img: '/pawn-w.svg',
    } satisfies Piece;
    board[6][c].piece = {
      type: 'pawn',
      color: 'black',
      img: '/pawn-b.svg',
    } satisfies Piece;
  }

  for (let c = 0; c < 8; ++c) {
    if (c === 0 || c === 7) {
      board[0][c].piece = {
        type: 'rook',
        color: 'white',
        img: '/rook-w.svg',
      } satisfies Piece;
      board[7][c].piece = {
        type: 'rook',
        color: 'black',
        img: '/rook-b.svg',
      } satisfies Piece;
    } else if (c === 1 || c === 6) {
      board[0][c].piece = {
        type: 'knight',
        color: 'white',
        img: '/knight-w.svg',
      } satisfies Piece;
      board[7][c].piece = {
        type: 'knight',
        color: 'black',
        img: '/knight-b.svg',
      } satisfies Piece;
    } else if (c === 2 || c === 5) {
      board[0][c].piece = {
        type: 'bishop',
        color: 'white',
        img: '/bishop-w.svg',
      } satisfies Piece;
      board[7][c].piece = {
        type: 'bishop',
        color: 'black',
        img: '/bishop-b.svg',
      } satisfies Piece;
    } else if (c === 4) {
      board[0][c].piece = {
        type: 'king',
        color: 'white',
        img: '/king-w.svg',
      } satisfies Piece;
      board[7][c].piece = {
        type: 'king',
        color: 'black',
        img: '/king-b.svg',
      } satisfies Piece;
    } else {
      board[0][c].piece = {
        type: 'queen',
        color: 'white',
        img: '/queen-w.svg',
      } satisfies Piece;
      board[7][c].piece = {
        type: 'queen',
        color: 'black',
        img: '/queen-b.svg',
      } satisfies Piece;
    }
  }

  return board;
};

export default initializeBoard;
