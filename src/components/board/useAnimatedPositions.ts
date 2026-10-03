import { useEffect, useRef, useState } from 'react';
import { PlayerState } from '../../engine/types';

const BOARD_SIZE = 40;
const STEP_MS = 340;
const START_DELAY_MS = 1300; // matches dice tumble duration

/**
 * Returns a map of playerId -> position to *display*. When a player's real position
 * changes, the displayed position walks forward square by square so the token visibly
 * hops along the board. Moves to jail (or backwards movement) snap directly.
 */
export function useAnimatedPositions(players: PlayerState[]): Record<string, number> {
  const [display, setDisplay] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, p.position]))
  );
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const displayRef = useRef(display);
  displayRef.current = display;

  const signature = players.map((p) => `${p.id}:${p.position}:${p.inJail ? 1 : 0}`).join('|');

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    players.forEach((p) => {
      const current = displayRef.current[p.id];
      if (current === undefined || current === p.position) return;

      if (timers.current[p.id]) clearTimeout(timers.current[p.id]);

      const forward = (p.position - current + BOARD_SIZE) % BOARD_SIZE;
      // Snap when going to jail, reduced motion, or the "forward" path would be implausibly long
      // (i.e. the token actually moved backwards, e.g. "go back 3 spaces").
      if (reduceMotion || (p.inJail && p.position === 10) || forward === 0 || forward > 24) {
        setDisplay((prev) => ({ ...prev, [p.id]: p.position }));
        return;
      }

      // Slower, readable hops: up to STEP_MS per square, but cap the whole walk at ~2.4s
      const stepMs = Math.max(160, Math.min(STEP_MS, 2400 / forward));
      const target = p.position;
      const step = () => {
        const now = displayRef.current[p.id];
        const next = (now + 1) % BOARD_SIZE;
        displayRef.current = { ...displayRef.current, [p.id]: next };
        setDisplay(displayRef.current);
        if (next !== target) {
          timers.current[p.id] = setTimeout(step, stepMs);
        }
      };
      // Wait for the dice to finish tumbling before the token starts walking
      timers.current[p.id] = setTimeout(step, START_DELAY_MS);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  // Players not yet tracked (joined later) fall back to their real position
  const result: Record<string, number> = {};
  players.forEach((p) => {
    result[p.id] = display[p.id] ?? p.position;
  });
  return result;
}
