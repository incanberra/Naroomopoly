import React, { useState, useEffect } from 'react';

interface DiceProps {
  dice: [number, number];
  isRolling?: boolean;
}

const PIP_LAYOUTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

const DieFace: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
  const pips = PIP_LAYOUTS[value] || PIP_LAYOUTS[1];

  return (
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md border-2 border-amber-200/90 p-2 relative grid grid-cols-3 grid-rows-3 transition-transform ${
        isRolling ? 'animate-bounce rotate-12 scale-105' : 'hover:scale-105'
      }`}
    >
      {pips.map(([row, col], idx) => (
        <div
          key={idx}
          className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-900 rounded-full shadow-inner m-auto"
          style={{
            gridRowStart: row + 1,
            gridColumnStart: col + 1,
          }}
        />
      ))}
    </div>
  );
};

export const DiceView: React.FC<DiceProps> = ({ dice, isRolling = false }) => {
  const [animating, setAnimating] = useState(isRolling);

  useEffect(() => {
    if (isRolling) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isRolling, dice]);

  const total = dice[0] + dice[1];
  const isDoubles = dice[0] === dice[1];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3">
        <DieFace value={dice[0]} isRolling={animating} />
        <DieFace value={dice[1]} isRolling={animating} />
      </div>
      <div className="text-center font-bold text-xs tracking-wider uppercase text-amber-300">
        Total: {total} {isDoubles && <span className="text-emerald-400 font-extrabold ml-1">Doubles!</span>}
      </div>
    </div>
  );
};
