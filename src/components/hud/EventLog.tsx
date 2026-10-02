import React, { useRef, useEffect } from 'react';
import { GameEvent } from '../../engine/types';
import { ScrollText } from 'lucide-react';

interface EventLogProps {
  events: GameEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-48 sm:h-56 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
      <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-700/80 flex items-center gap-1.5">
        <ScrollText className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Game History & Log
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-[11px] sm:text-xs font-medium text-slate-300"
      >
        {events.length === 0 ? (
          <div className="text-slate-500 italic py-2 text-center">No game events yet.</div>
        ) : (
          events.map((evt, idx) => {
            const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div key={evt.id || idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 flex-shrink-0">
                  [{timeStr}]
                </span>
                <span className="text-slate-200">{evt.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
