import React, { useEffect } from 'react';
import { GameCard } from '../../data/boardData';
import { Sparkles, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { TokenRenderer } from '../icons/TokenIcons';

interface ActiveCardModalProps {
  card: GameCard | null;
  player?: {
    id: string;
    name: string;
    color: string;
    token: string;
    isBot?: boolean;
  } | null;
  isMyCard?: boolean;
  onDismiss: () => void;
}

export const ActiveCardModal: React.FC<ActiveCardModalProps> = ({
  card,
  player,
  isMyCard,
  onDismiss,
}) => {
  // Auto-dismiss countdown timer for human turns (3.5s duration)
  useEffect(() => {
    if (!card) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [card, onDismiss]);

  if (!card) return null;

  const isNotice = card.deck === 'notice';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-card-flip">
        {/* Drawer Banner */}
        {player && (
          <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: player.color }}
              >
                <TokenRenderer tokenId={player.token} size={12} color="#FFFFFF" />
              </div>
              <span className="text-xs font-bold text-slate-200 font-board">
                {isMyCard ? 'You drew an action card:' : `${player.name} drew an action card:`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 font-mono">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
              <span>3.5s</span>
            </div>
          </div>
        )}

        {/* Card Header */}
        <div
          className={`p-4 text-center ${
            isNotice
              ? 'bg-gradient-to-r from-amber-600 to-amber-700'
              : 'bg-gradient-to-r from-cyan-600 to-blue-700'
          } text-slate-950`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {isNotice ? <ClipboardList className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            <span className="text-[11px] font-black uppercase tracking-wider font-board">
              {isNotice ? 'Community Notice Board' : 'Local Knowledge'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-board">{card.title}</h2>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-base text-slate-200 font-medium leading-relaxed font-sans">
            {card.description}
          </p>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm font-board shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Continue
          </button>

          <p className="text-[11px] text-slate-400 font-medium">
            Automatically continuing in 3.5 seconds...
          </p>
        </div>

        {/* 3.5s Progress Countdown Bar */}
        <div className="w-full h-1.5 bg-slate-950 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 animate-flash-timer" />
        </div>
      </div>
    </div>
  );
};
