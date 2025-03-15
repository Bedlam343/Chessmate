import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { initializeBoard } from 'src/utils/helpers';
import { Board, Cell } from 'src/utils/types';

function App() {
  const [board, setBoard] = useState<Board>(initializeBoard());

  const boardRef = useRef<HTMLDivElement>(null);

  let grabbedPiece: HTMLElement | null = null;

  useEffect(() => {
    const handleMovePiece = (e: MouseEvent) =>
      movePiece(e.clientX, e.clientY, grabbedPiece);

    document.addEventListener('mousemove', handleMovePiece);
    return () => document.removeEventListener('mousemove', handleMovePiece);
  }, [grabbedPiece]);

  useEffect(() => {
    const handleMouseUp = () => {
      document.body.style.cursor = 'default';
      if (grabbedPiece) {
        grabbedPiece = null;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const movePiece = (
    clientX: number,
    clientY: number,
    grabbed: HTMLElement | null
  ) => {
    if (grabbed) {
      const left = clientX - 50;
      const top = clientY - 50;
      const boardRect = boardRef.current!.getBoundingClientRect();

      if (clientX > boardRect.x && clientX < boardRect.x + boardRect.width) {
        grabbed.style.left = `${left}px`;
      }
      if (clientY > boardRect.y && clientY < boardRect.y + boardRect.height) {
        grabbed.style.top = `${top}px`;
      }
    }
  };

  const handleMouseOver = () => {
    document.body.style.cursor = 'grab';
  };

  const handleMouseDown = (e: ReactMouseEvent, pieceId: string) => {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';

    const piece = document.getElementById(pieceId);

    if (!piece) return;

    grabbedPiece = piece;
    piece.style.position = 'absolute';
    movePiece(e.clientX, e.clientY, piece);
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
                  onMouseOver={cell.piece ? () => handleMouseOver() : () => {}}
                  onMouseDown={
                    cell.piece
                      ? (e: ReactMouseEvent) => handleMouseDown(e, pieceId)
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
                      className="h-[90px]"
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
