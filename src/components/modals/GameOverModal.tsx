import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../../engine/types';
import { TokenRenderer } from '../icons/TokenIcons';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  state: GameState;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ state, onPlayAgain }) => {
  if (state.phase !== 'game_over') return null;

  const winner = state.winnerPlayerId
    ? state.players.find((p) => p.id === state.winnerPlayerId)
    : state.players.find((p) => !p.isBankrupt);

  useEffect(() => {
    // Launch festive confetti bursts
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F59E0B', '#38BDF8', '#10B981', '#EC4899'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F59E0B', '#38BDF8', '#10B981', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl p-6 text-center text-slate-100 flex flex-col items-center gap-4 animate-in fade-in zoom-in-90 duration-300">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase font-black tracking-widest text-amber-400">
            Game Over • Champion Crowned!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {winner?.name || 'Congratulations!'}
          </h2>
          <p className="text-xs text-slate-400">
            Last player standing and Tycoon of the NSW South Coast!
          </p>
        </div>

        {winner && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 w-full flex items-center justify-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: winner.color }}
            >
              <TokenRenderer tokenId={winner.token} size={28} color="#FFFFFF" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base text-slate-100">{winner.name}</div>
              <div className="text-xs font-extrabold text-emerald-400">
                Final Cash: ${winner.cash}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Play Another Game
        </button>
      </div>
    </div>
  );
};
