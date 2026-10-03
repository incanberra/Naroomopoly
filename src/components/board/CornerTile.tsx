import React from 'react';
import { BoardTile } from '../../data/boardData';
import { PlayerState } from '../../engine/types';

interface CornerTileProps {
  tile: BoardTile;
  playersOnTile: PlayerState[];
  isCurrentPlayerTile?: boolean;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

export const CornerTile: React.FC<CornerTileProps> = ({
  tile,
  isCurrentPlayerTile,
  onClick,
  onHover,
  onLeave,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      aria-label={tile.name}
      className={`relative w-full h-full p-1.5 sm:p-2 rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-200 border flex flex-col items-center justify-between shadow-md ${
        isCurrentPlayerTile
          ? 'ring-3 ring-amber-500 ring-offset-2 ring-offset-slate-950 border-amber-500 z-20 scale-[1.02]'
          : 'border-[#D6CBB8] hover:border-amber-500/90 hover:shadow-xl'
      } bg-gradient-to-br from-[#FAF7F0] via-[#F5EFE3] to-[#ECE3D2] text-slate-900`}
    >
      {/* 1. Tile 0: Welcome to the South Coast (GO) */}
      {tile.index === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-between text-center relative z-10">
          <div className="w-full text-center">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white bg-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-700 shadow-xs">
              COLLECT $200
            </span>
          </div>

          {/* Sunrise beach scene with golden highway arrow */}
          <div className="relative my-auto flex flex-col items-center">
            <svg viewBox="0 0 72 48" className="w-14 h-10 sm:w-16 sm:h-12 drop-shadow-sm">
              {/* Sunrise rays */}
              <circle cx="36" cy="34" r="14" fill="#F59E0B" fillOpacity="0.5" />
              <line x1="36" y1="12" x2="36" y2="4" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="18" x2="16" y2="12" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="18" x2="56" y2="12" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              {/* Waves */}
              <path d="M4 36C14 32 24 38 36 34C48 30 58 36 68 34" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 42C18 39 28 44 40 41C50 38 60 42 66 41" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="flex items-center gap-1 font-black text-amber-700 text-xs sm:text-sm tracking-wider uppercase">
              <span>GO</span>
              <span className="text-emerald-600 font-extrabold text-base">➔</span>
            </div>
          </div>

          <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-tight leading-tight px-1">
            Welcome to the South Coast
          </div>
        </div>
      )}

      {/* 2. Tile 10: Moruya Courthouse / Just Visiting */}
      {tile.index === 10 && (
        <div className="w-full h-full flex flex-col items-center justify-between text-center relative z-10">
          <div className="w-full text-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-100 bg-slate-700 px-2 py-0.5 rounded-full border border-slate-800 shadow-xs">
              JUST VISITING
            </span>
          </div>

          {/* Courthouse building & Jail cell bars */}
          <div className="relative my-auto flex flex-col items-center">
            <svg viewBox="0 0 72 48" className="w-14 h-10 sm:w-16 sm:h-12 drop-shadow-sm">
              {/* Pediment & Columns */}
              <polygon points="12,14 36,4 60,14" fill="#94A3B8" fillOpacity="0.4" stroke="#475569" strokeWidth="2" />
              <line x1="10" y1="15" x2="62" y2="15" stroke="#475569" strokeWidth="2.5" />
              {/* Iron Bars */}
              <rect x="18" y="18" width="36" height="22" rx="1" fill="#1E293B" stroke="#334155" strokeWidth="2" />
              <line x1="24" y1="18" x2="24" y2="40" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="30" y1="18" x2="30" y2="40" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="36" y1="18" x2="36" y2="40" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="42" y1="18" x2="42" y2="40" stroke="#94A3B8" strokeWidth="2.5" />
              <line x1="48" y1="18" x2="48" y2="40" stroke="#94A3B8" strokeWidth="2.5" />
              <rect x="8" y="40" width="56" height="4" fill="#334155" />
            </svg>
            <span className="text-xs sm:text-sm font-black text-amber-800 uppercase tracking-tight">
              COURTHOUSE
            </span>
          </div>

          <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-tight leading-tight">
            Moruya Courthouse
          </div>
        </div>
      )}

      {/* 3. Tile 20: Free Parking at Batehaven Beach */}
      {tile.index === 20 && (
        <div className="w-full h-full flex flex-col items-center justify-between text-center relative z-10">
          <div className="w-full text-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-amber-600 px-2 py-0.5 rounded-full border border-amber-700 shadow-xs">
              FREE REST
            </span>
          </div>

          {/* Beach Ute & Palm Tree Scene */}
          <div className="relative my-auto flex flex-col items-center">
            <svg viewBox="0 0 72 48" className="w-14 h-10 sm:w-16 sm:h-12 drop-shadow-sm">
              {/* Palm Tree */}
              <path d="M52 38C52 26 48 18 42 12" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <path d="M42 12C36 10 30 12 28 16" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M42 12C46 8 52 8 56 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M42 12C44 16 48 18 52 18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              {/* Ute Truck */}
              <path d="M12 30H24L28 22H38V30H44V34H12V30Z" fill="#0284C7" fillOpacity="0.7" stroke="#0369A1" strokeWidth="2" />
              <circle cx="20" cy="35" r="4" fill="#0F172A" stroke="#475569" strokeWidth="2" />
              <circle cx="36" cy="35" r="4" fill="#0F172A" stroke="#475569" strokeWidth="2" />
              <path d="M6 40C16 38 28 42 42 40C54 38 62 41 68 40" stroke="#D97706" strokeWidth="2.5" />
            </svg>
            <span className="text-xs sm:text-sm font-black text-amber-800 uppercase tracking-wider">
              FREE PARKING
            </span>
          </div>

          <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-tight leading-tight">
            Batehaven Beach
          </div>
        </div>
      )}

      {/* 4. Tile 30: Go to Bodalla Police Station */}
      {tile.index === 30 && (
        <div className="w-full h-full flex flex-col items-center justify-between text-center relative z-10">
          <div className="w-full text-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-2 py-0.5 rounded-full border border-red-700 shadow-xs">
              DIRECTLY TO JAIL
            </span>
          </div>

          {/* Highway Speed 100 sign & Police Siren Light */}
          <div className="relative my-auto flex flex-col items-center">
            <svg viewBox="0 0 72 48" className="w-14 h-10 sm:w-16 sm:h-12 drop-shadow-sm">
              {/* Flashing Police Beacon */}
              <path d="M30 18C30 12 33 8 36 8C39 8 42 12 42 18H30Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" className="animate-pulse" />
              <rect x="28" y="18" width="16" height="5" rx="1" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              {/* Light rays */}
              <line x1="26" y1="12" x2="18" y2="8" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="46" y1="12" x2="54" y2="8" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              {/* Highway Speed 100 sign */}
              <circle cx="20" cy="30" r="10" fill="#FFFFFF" stroke="#DC2626" strokeWidth="3" />
              <text x="20" y="34" fontSize="9" fontWeight="900" textAnchor="middle" fill="#0F172A">100</text>
              {/* Speed Camera */}
              <rect x="42" y="24" width="12" height="10" rx="1" fill="#475569" stroke="#334155" strokeWidth="2" />
              <circle cx="48" cy="29" r="2.5" fill="#F8FAFC" />
              <line x1="48" y1="34" x2="48" y2="42" stroke="#64748B" strokeWidth="2.5" />
            </svg>
            <span className="text-xs sm:text-sm font-black text-red-600 uppercase tracking-wider">
              GO TO JAIL
            </span>
          </div>

          <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-tight leading-tight">
            Bodalla Police Station
          </div>
        </div>
      )}
    </div>
  );
};
