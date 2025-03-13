import { useState } from 'react';
import { initializeBoard } from 'src/utils/helpers';
import { Board } from 'src/utils/types';

function App() {
  const [board, setBoard] = useState<Board>(initializeBoard());

  return (
    <div className="flex items-center justify-center h-screen">
      <div id="board">
        {[...board].reverse().map((row) => (
          <div className="flex">
            {row.map((cell) => (
              <div
                className={`h-[100px] w-[100px] ${
                  cell.color === 'white' ? 'bg-white' : 'bg-slate-500'
                } ${cell.piece ? 'hover:cursor-grab' : ''}`}
              >
                {cell.piece && <img src={cell.piece.img} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
