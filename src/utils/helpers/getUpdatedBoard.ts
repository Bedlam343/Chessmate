import { Board, Cell } from 'src/utils/types';

const canMoveDiagonally = (srcCell: Cell, destCell: Cell, board: Board) => {
  const { r: srcR, c: srcC, piece } = srcCell;
  const { r: desR, c: desC } = destCell;

  if (Math.abs(desC - srcC) === Math.abs(desR - srcR)) {
    let r = desR,
      c = desC;

    while (Math.abs(r - srcR) >= 1 && Math.abs(c - srcC) >= 1) {
      if (board[r][c].piece?.color === piece?.color) {
        return false;
      }

      r = desR > srcR ? r - 1 : r + 1;
      c = desC > srcC ? c - 1 : c + 1;
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
      isLegalMove = canMoveDiagonally(srcCell, destCell, board);
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
