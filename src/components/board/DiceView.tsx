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

const DieFace: React.FC<{ value: number; isRolling: boolean; delay: number }> = ({
  value,
  isRolling,
  delay,
}) => {
  const pips = PIP_LAYOUTS[value] || PIP_LAYOUTS[1];

  return (
    <div
      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl p-2 relative grid grid-cols-3 grid-rows-3 select-none transition-transform duration-300 ${
        isRolling ? 'animate-dice-tumble' : 'hover:scale-105 active:scale-95'
      }`}
      style={{
        background: 'linear-gradient(135deg, #FFFDF7 0%, #F5EBE1 60%, #E6D5C3 100%)',
        boxShadow:
          'inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 10px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(217, 180, 140, 0.7)',
        animationDelay: `${delay}ms`,
      }}
    >
      {pips.map(([row, col], idx) => (
        <div
          key={idx}
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full m-auto shadow-inner"
          style={{
            gridRowStart: row + 1,
            gridColumnStart: col + 1,
            background: 'radial-gradient(circle at 35% 35%, #334155 0%, #0F172A 75%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 0.5px 0.5px rgba(255,255,255,0.6)',
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
      const timer = setTimeout(() => setAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isRolling, dice]);

  const total = dice[0] + dice[1];
  const isDoubles = dice[0] === dice[1];

  return (
    <div className="flex flex-col items-center gap-1.5 z-20">
      <div className="flex items-center gap-3 perspective-500">
        <DieFace value={dice[0]} isRolling={animating} delay={0} />
        <DieFace value={dice[1]} isRolling={animating} delay={80} />
      </div>

      <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-0.5 rounded-full shadow-md">
        <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase text-amber-300">
          Roll: {total}
        </span>
        {isDoubles && (
          <span className="text-[10px] font-black tracking-tight text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-500/50">
            DOUBLES!
          </span>
        )}
      </div>
    </div>
  );
};
