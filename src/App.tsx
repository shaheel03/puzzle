import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

function App() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const initializePuzzle = () => {
    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    numbers.push(0); // Empty tile represented by 0
    shuffleTiles(numbers);
  };

  const shuffleTiles = (array: number[]) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    // Ensure puzzle is solvable
    if (!isSolvable(array)) {
      [array[0], array[1]] = [array[1], array[0]];
    }
    setTiles(array);
    setIsWon(false);
    setMoves(0);
  };

  const isSolvable = (puzzle: number[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const canMoveTile = (index: number): boolean => {
    const emptyIndex = tiles.indexOf(0);
    const size = 4;
    const row = Math.floor(index / size);
    const emptyRow = Math.floor(emptyIndex / size);
    const col = index % size;
    const emptyCol = emptyIndex % size;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (index: number) => {
    if (!canMoveTile(index) || isWon) return;

    const newTiles = [...tiles];
    const emptyIndex = tiles.indexOf(0);
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    setMoves(moves + 1);

    // Check if puzzle is solved
    const isSolved = newTiles.every((tile, index) => 
      tile === 0 ? index === newTiles.length - 1 : tile === index + 1
    );
    setIsWon(isSolved);
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sliding Puzzle</h1>
          <p className="text-gray-600">Moves: {moves}</p>
          {isWon && (
            <div className="text-green-500 font-bold mt-2">
              Congratulations! You solved the puzzle!
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => moveTile(index)}
              className={`
                h-16 sm:h-20 rounded-lg font-bold text-xl 
                transition-all duration-200 
                ${tile === 0 
                  ? 'bg-gray-200' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                }
                ${canMoveTile(index) && !isWon ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              disabled={!canMoveTile(index) || isWon}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>

        <button
          onClick={() => initializePuzzle()}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg 
                     shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Shuffle size={20} />
          New Game
        </button>
      </div>
    </div>
  );
}

export default App;