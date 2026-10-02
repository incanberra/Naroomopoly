import React from 'react';
import { GameCard } from '../../data/boardData';
import { Sparkles, ClipboardList, CheckCircle } from 'lucide-react';

interface ActiveCardModalProps {
  card: GameCard | null;
  onDismiss: () => void;
}

export const ActiveCardModal: React.FC<ActiveCardModalProps> = ({ card, onDismiss }) => {
  if (!card) return null;

  const isNotice = card.deck === 'notice';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-200">
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
            <span className="text-[11px] font-black uppercase tracking-wider">
              {isNotice ? 'Community Notice Board' : 'Local Knowledge'}
            </span>
          </div>
          <h2 className="text-xl font-black">{card.title}</h2>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-base text-slate-200 font-medium leading-relaxed">
            {card.description}
          </p>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
