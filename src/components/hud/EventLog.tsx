import React, { useRef, useEffect } from 'react';
import { GameEvent } from '../../engine/types';
import { ScrollText, Dices, DollarSign, Sparkles, ShieldAlert, ArrowLeftRight, Gavel, Trophy } from 'lucide-react';

interface EventLogProps {
  events: GameEvent[];
}

function getEventIcon(type: string) {
  switch (type) {
    case 'DICE_ROLLED':
      return <Dices className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
    case 'RENT_PAID':
    case 'PROPERTY_BOUGHT':
    case 'TAX_PAID':
    case 'PASSED_GO':
    case 'JACKPOT_WON':
      return <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
    case 'CARD_DRAWN':
      return <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
    case 'SENT_TO_JAIL':
    case 'JAIL_STAY':
    case 'JAIL_FORCED_PAY':
      return <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />;
    case 'TRADE_PROPOSED':
    case 'TRADE_ACCEPTED':
      return <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
    case 'AUCTION_STARTED':
    case 'AUCTION_BID':
    case 'AUCTION_WON':
      return <Gavel className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />;
    case 'GAME_OVER':
      return <Trophy className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />;
    default:
      return <ScrollText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />;
  }
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-44 sm:h-52 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Game History & Log
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold">{events.length} events</span>
      </div>

      {/* Events List */}
      <div
        ref={scrollRef}
        className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-xs text-slate-300 font-medium"
      >
        {events.length === 0 ? (
          <div className="text-slate-500 italic py-4 text-center">No game events yet.</div>
        ) : (
          events.map((evt, idx) => {
            const isLatest = idx === events.length - 1;
            const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={evt.id || idx}
                className={`flex items-start gap-2 p-1.5 rounded-lg transition-colors leading-relaxed ${
                  isLatest
                    ? 'bg-amber-500/10 border border-amber-500/30 text-slate-100 font-semibold'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="mt-0.5">{getEventIcon(evt.type)}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-500 font-mono mr-1.5">
                    [{timeStr}]
                  </span>
                  <span>{evt.message}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
