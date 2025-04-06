import { Board, Cell } from 'src/utils/types';

const canMoveDiagonally = (srcCell: Cell, destCell: Cell, board: Board) => {
  const { r: srcR, c: srcC, piece } = srcCell;
  const { r: desR, c: desC } = destCell;

  // is diagonal movement
  if (srcR !== desR && Math.abs(desC - srcC) === Math.abs(desR - srcR)) {
    let r = srcR,
      c = srcC;

    // can't move if there's a piece on the way to destination cel
    while (Math.abs(r - desR) >= 1 && Math.abs(c - desC) >= 1) {
      if (r !== srcR && c !== srcC && Boolean(board[r][c].piece)) {
        return false;
      }

      r = desR > srcR ? r + 1 : r - 1;
      c = desC > srcC ? c + 1 : c - 1;
    }

    // can't move if destination piece is same color
    if (board[desR][desC].piece?.color === piece?.color) {
      return false;
    }

    return true;
  }

  return false;
};

const canMoveStraight = (srcCell: Cell, destCell: Cell, board: Board) => {
  const { r: srcR, c: srcC, piece } = srcCell;
  const { r: desR, c: desC } = destCell;

  let r = srcR,
    c = srcC;

  if (srcR - desR !== 0 && srcC - desC === 0) {
    // can't move if there's a piece in the way
    while (Math.abs(r - desR) >= 1) {
      if (r !== srcR && board[r][c].piece) {
        return false;
      }

      r = desR > srcR ? r + 1 : r - 1;
    }

    // can't move if destination piece is same color
    if (board[desR][desC].piece?.color === piece?.color) {
      return false;
    }

    return true;
  } else if (srcC - desC !== 0 && srcR - desR === 0) {
    // can't move if there's a piece in the way
    while (Math.abs(c - desC) >= 1) {
      if (c !== srcC && board[r][c].piece) {
        return false;
      }

      c = desC > srcC ? c + 1 : c - 1;
    }

    // can't move if destination piece is same color
    if (board[desR][desC].piece?.color === piece?.color) {
      return false;
    }

    return true;
  }

  return false;
};

const getUpdatedBoard = (
  srcCell: Cell,
  destCell: Cell,
  board: Board,
  numMoves: number,
): Board | null => {
  const { piece } = srcCell;
  if (!piece) return board;

  let isLegalMove = false;

  const { r: srcR, c: srcC } = srcCell;
  const { r: desR, c: desC, piece: destPiece } = destCell;

  const updatedBoard: Board = [...board];

  switch (piece.type) {
    case 'pawn':
      {
        if (piece.color === 'white') {
          if (desC === srcC) {
            if (desR === srcR + 1) {
              isLegalMove = true;
            } else if (desR === srcR + 2 && !piece.hasMoved) {
              isLegalMove = true;
            }
          }
          // moving diagonally as white
          else if (Math.abs(desC - srcC) === 1) {
            const enPassantPiece = updatedBoard[desR - 1][desC]?.piece;

            if (desR === srcR + 1) {
              if (destPiece && destPiece.color === 'black') {
                isLegalMove = true;
              } else if (
                enPassantPiece &&
                enPassantPiece.type === 'pawn' &&
                enPassantPiece.color === 'black' &&
                enPassantPiece.prevCell?.r === desR + 1 &&
                enPassantPiece.lastMoveNum === numMoves
              ) {
                isLegalMove = true;
                // remove the pawn that has been en-passanted
                updatedBoard[desR - 1][desC].piece = undefined;
              }
            }
          }
        } else {
          if (desC === srcC) {
            if (desR === srcR - 1) {
              isLegalMove = true;
            } else if (desR === srcR - 2 && !piece.hasMoved) {
              isLegalMove = true;
            }
          }
          // moving diagonally as black
          else if (Math.abs(desC - srcC) === 1) {
            const enPassantPiece = updatedBoard[desR + 1][desC]?.piece;

            if (desR === srcR - 1) {
              if (destPiece && destPiece.color === 'white') {
                isLegalMove = true;
              } else if (
                enPassantPiece &&
                enPassantPiece.type === 'pawn' &&
                enPassantPiece.color === 'white' &&
                enPassantPiece.prevCell?.r === desR - 1 &&
                enPassantPiece.lastMoveNum === numMoves
              ) {
                isLegalMove = true;
                // remove the pawn that has been en-passanted
                updatedBoard[desR + 1][desC].piece = undefined;
              }
            }
          }
        }
      }
      break;
    case 'bishop':
      isLegalMove = canMoveDiagonally(srcCell, destCell, updatedBoard);
      break;
    case 'rook':
      isLegalMove = canMoveStraight(srcCell, destCell, updatedBoard);
      break;
    default:
      break;
  }

  if (isLegalMove) {
    updatedBoard[srcR][srcC].piece = undefined;
    piece.hasMoved = true;
    piece.prevCell = { r: srcR, c: srcC };
    piece.lastMoveNum = numMoves + 1;
    updatedBoard[desR][desC].piece = piece;
    return updatedBoard;
  }

  return null;
};

export default getUpdatedBoard;
