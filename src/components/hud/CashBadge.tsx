import React, { useEffect, useRef, useState } from 'react';
import { audio } from '../../services/audioService';

interface CashBadgeProps {
  cash: number;
}

interface FloatTag {
  id: number;
  delta: number;
}

/**
 * Player cash pill that flashes green/red and floats a "+$100" / "-$50" tag
 * upward whenever the balance changes.
 */
export const CashBadge: React.FC<CashBadgeProps> = ({ cash }) => {
  const prev = useRef(cash);
  const nextId = useRef(0);
  const [tags, setTags] = useState<FloatTag[]>([]);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const delta = cash - prev.current;
    prev.current = cash;
    if (delta === 0) return;

    const id = nextId.current++;
    setTags((t) => [...t.slice(-3), { id, delta }]);
    setFlash(delta > 0 ? 'up' : 'down');
    if (delta > 0) audio.playCash();

    const removeTag = setTimeout(() => setTags((t) => t.filter((x) => x.id !== id)), 2200);
    const clearFlash = setTimeout(() => setFlash(null), 800);
    return () => {
      clearTimeout(removeTag);
      clearTimeout(clearFlash);
    };
  }, [cash]);

  return (
    <div className="relative">
      <div
        key={flash ? `${flash}-${cash}` : 'idle'}
        className={`px-2.5 py-0.5 rounded-full font-black text-sm tracking-tight border shadow-xs ${
          cash < 0
            ? 'bg-red-950/80 border-red-500/50 text-red-400 animate-pulse'
            : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
        } ${flash === 'up' ? 'animate-cash-up' : flash === 'down' ? 'animate-cash-down' : ''}`}
      >
        ${cash}
      </div>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`absolute right-0 -top-1 pointer-events-none z-30 font-black text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] animate-float-money ${
            tag.delta > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {tag.delta > 0 ? '+' : '-'}${Math.abs(tag.delta)}
        </span>
      ))}
    </div>
  );
};
