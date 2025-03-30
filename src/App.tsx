import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import initializeBoard from 'src/utils/helpers/initializeBoard';
import getUpdatedBoard from 'src/utils/helpers/getUpdatedBoard';
import { Board, Cell } from 'src/utils/types';

function App() {
  const [numMoves, setNumMoves] = useState<number>(0);
  const [board, setBoard] = useState<Board>(initializeBoard());

  const boardRef = useRef<HTMLDivElement>(null);
  const grabbedPieceRef = useRef<HTMLDivElement>(null);

  const sourceCell = useRef<Cell>(null);
  const currentCell = useRef<Cell>(null);

  useEffect(() => {
    const handleMovePiece = (e: MouseEvent) => movePiece(e.clientX, e.clientY);

    document.addEventListener('mousemove', handleMovePiece);
    return () => document.removeEventListener('mousemove', handleMovePiece);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      document.body.style.cursor = 'default';

      if (
        grabbedPieceRef.current &&
        currentCell.current &&
        sourceCell.current
      ) {
        const srcCell = sourceCell.current;
        const curCell = currentCell.current;

        const updatedBoard = getUpdatedBoard(srcCell, curCell, board, numMoves);
        if (updatedBoard) {
          setBoard(updatedBoard);
          setNumMoves((prev) => prev + 1);
        }

        const pieceDiv = document.getElementById(
          grabbedPieceRef.current.id,
        ) as HTMLDivElement;
        pieceDiv.style = '';
        grabbedPieceRef.current = null;
        sourceCell.current = null;
        sourceCell.current = null;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [board, numMoves]);

  const movePiece = (clientX: number, clientY: number) => {
    if (grabbedPieceRef.current) {
      const left = clientX - 50;
      const top = clientY - 50;
      const boardRect = boardRef.current!.getBoundingClientRect();

      if (clientX > boardRect.x && clientX < boardRect.x + boardRect.width) {
        grabbedPieceRef.current.style.left = `${left}px`;
      }
      if (clientY > boardRect.y && clientY < boardRect.y + boardRect.height) {
        grabbedPieceRef.current.style.top = `${top}px`;
      }
    }
  };

  const handleMouseOver = (cell: Cell) => {
    if (cell.piece) {
      document.body.style.cursor = 'grab';
    } else {
      if (!grabbedPieceRef.current) document.body.style.cursor = 'default';
    }
    currentCell.current = cell;
  };

  const handleMouseDown = (e: ReactMouseEvent, cell: Cell, pieceId: string) => {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';

    const piece = document.getElementById(pieceId) as HTMLDivElement;

    if (!piece) return;

    sourceCell.current = cell;

    grabbedPieceRef.current = piece;
    piece.style.position = 'absolute';

    movePiece(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {};

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        onMouseLeave={handleMouseLeave}
        id="board"
        ref={boardRef}
        className=""
      >
        {[...board].reverse().map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const pieceId = `${c}-${r}-${cell.piece?.img}`;

              return (
                <div
                  key={`${r}${c}`}
                  onMouseOver={() => handleMouseOver(cell)}
                  onMouseDown={
                    cell.piece
                      ? (e: ReactMouseEvent) =>
                          handleMouseDown(e, cell, pieceId)
                      : () => {}
                  }
                  className={`h-[100px] w-[100px] ${
                    cell.color === 'white' ? 'bg-white' : 'bg-slate-500'
                  } flex items-center justify-center`}
                >
                  {cell.piece && (
                    <img
                      id={pieceId}
                      src={cell.piece.img}
                      className="h-[90px] pointer-events-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
