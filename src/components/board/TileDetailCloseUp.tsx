import React from 'react';
import { BoardTile, COLOR_GROUP_CONFIG, ColorGroup } from '../../data/boardData';
import { PlayerState, PropertyState } from '../../engine/types';
import { TileArtIcon } from '../icons/icons';
import { SquareIllustration } from './SquareIllustration';
import { TokenRenderer } from '../icons/TokenIcons';
import { Building2, Home, Landmark, Coins, ShieldAlert, Sparkles, X, Pin } from 'lucide-react';

interface TileDetailCloseUpProps {
  tile: BoardTile;
  propertyState?: PropertyState;
  owner?: PlayerState;
  isPinned?: boolean;
  onClose?: () => void;
}

const COLOR_GROUP_LETTERS: Record<ColorGroup, string> = {
  brown: 'A',
  lightBlue: 'B',
  pink: 'C',
  orange: 'D',
  red: 'E',
  yellow: 'F',
  green: 'G',
  darkBlue: 'H',
};

export const TileDetailCloseUp: React.FC<TileDetailCloseUpProps> = ({
  tile,
  propertyState,
  owner,
  isPinned,
  onClose,
}) => {
  const colorGroup = tile.property?.colorGroup;
  const colorConfig = colorGroup ? COLOR_GROUP_CONFIG[colorGroup] : null;
  const groupLetter = colorGroup ? COLOR_GROUP_LETTERS[colorGroup] : null;

  const houses = propertyState?.houses ?? 0;
  const isMortgaged = propertyState?.isMortgaged ?? false;
  const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? tile.tax?.amount;
  const mortgageValue = tile.property?.mortgageValue ?? tile.hardware?.mortgageValue ?? tile.utility?.mortgageValue;

  return (
    <div className="w-full max-w-[330px] sm:max-w-[370px] bg-slate-900/98 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85)] border-2 border-slate-700/90 text-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-90 duration-150 pointer-events-auto relative">
      {/* Pinned close button */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 z-30 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center transition-colors shadow-md"
          title="Close details"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      {/* 1. Header Banner */}
      {colorConfig ? (
        <div
          className="p-3 sm:p-3.5 text-center relative overflow-hidden flex flex-col items-center justify-center border-b border-black/30 shadow-sm"
          style={{
            background: `linear-gradient(180deg, ${colorConfig.color} 0%, ${colorConfig.color}E6 100%)`,
            color: colorConfig.textColor,
          }}
        >
          <div className="flex items-center justify-between w-full px-1 mb-0.5 opacity-90 text-[9px] font-black uppercase tracking-widest">
            <span className="px-1.5 py-0.2 rounded-xs bg-black/25 text-white">
              Group {groupLetter}
            </span>
            <span>TITLE DEED</span>
            <span className="font-bold">{colorConfig.name}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm leading-tight">
            {tile.name}
          </h3>
        </div>
      ) : tile.type === 'hardware' ? (
        <div
          className={`p-3 text-center border-b border-slate-800 text-white ${
            tile.index === 5
              ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900' // Bunnings
              : tile.index === 15
              ? 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900' // Camerons
              : tile.index === 25
              ? 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950' // Woody's
              : 'bg-gradient-to-r from-red-800 via-red-700 to-red-900' // Mitre 10
          }`}
        >
          <div className="text-[9px] uppercase font-black tracking-widest opacity-80 mb-0.5">
            Hardware & Building Supplies
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
            {tile.name}
          </h3>
        </div>
      ) : tile.type === 'utility' ? (
        <div className="p-3 text-center bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-900 text-cyan-100 border-b border-cyan-800">
          <div className="text-[9px] uppercase font-black tracking-widest opacity-80 mb-0.5">
            Public Utility
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
            {tile.name}
          </h3>
        </div>
      ) : tile.type === 'tax' ? (
        <div className="p-3 text-center bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-rose-100 border-b border-rose-900">
          <div className="text-[9px] uppercase font-black tracking-widest opacity-80 mb-0.5">
            Shire Assessment
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
            {tile.name}
          </h3>
        </div>
      ) : (
        <div className="p-3 text-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-slate-100 border-b border-slate-700">
          <div className="text-[9px] uppercase font-black tracking-widest text-amber-400 mb-0.5">
            South Coast Landmark
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
            {tile.name}
          </h3>
        </div>
      )}

      {/* 2. Artwork & Description */}
      <div className="p-2.5 sm:p-3 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-3 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800 shadow-md">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg border border-slate-700/80 flex-shrink-0 bg-slate-950">
            <SquareIllustration index={tile.index} size={64} className="w-full h-full object-cover" />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug italic line-clamp-3">
            {tile.description}
          </p>
        </div>

        {/* 3. Detailed Financial Rent Matrix */}
        {tile.property && (
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-[10.5px] space-y-1">
            <div className="flex justify-between py-0.5 border-b border-slate-800/80 text-slate-300">
              <span>Rent alone:</span>
              <span className="font-extrabold text-emerald-400">${tile.property.rent[0]}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-800/80 text-slate-400 text-[10px]">
              <span>With complete set (unimproved):</span>
              <span className="font-bold text-emerald-300">${tile.property.rent[0] * 2}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Home className="w-2.5 h-2.5 text-emerald-400" /> With 1 House:
              </span>
              <span className="font-extrabold text-emerald-400">${tile.property.rent[1]}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Home className="w-2.5 h-2.5 text-emerald-400" /> With 2 Houses:
              </span>
              <span className="font-extrabold text-emerald-400">${tile.property.rent[2]}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Home className="w-2.5 h-2.5 text-emerald-400" /> With 3 Houses:
              </span>
              <span className="font-extrabold text-emerald-400">${tile.property.rent[3]}</span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Home className="w-2.5 h-2.5 text-emerald-400" /> With 4 Houses:
              </span>
              <span className="font-extrabold text-emerald-400">${tile.property.rent[4]}</span>
            </div>
            <div className="flex justify-between py-0.5 pt-1 border-t border-slate-800 text-amber-300 font-bold">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3 h-3 text-red-500" /> With HOTEL:
              </span>
              <span className="font-black text-amber-300">${tile.property.rent[5]}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[9.5px] text-slate-400">
              <span>Houses: ${tile.property.houseCost} each</span>
              <span>Hotel: ${tile.property.houseCost} + 4 houses</span>
            </div>
          </div>
        )}

        {/* Hardware Store Rent Matrix */}
        {tile.hardware && (
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-[10.5px] space-y-1">
            <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
              <span>1 Hardware Store owned:</span>
              <span className="font-bold text-emerald-400">$25</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
              <span>2 Hardware Stores owned:</span>
              <span className="font-bold text-emerald-400">$50</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
              <span>3 Hardware Stores owned:</span>
              <span className="font-bold text-emerald-400">$100</span>
            </div>
            <div className="flex justify-between py-0.5 text-amber-300 font-bold">
              <span>4 Hardware Stores owned:</span>
              <span className="font-black text-amber-300">$200</span>
            </div>
          </div>
        )}

        {/* Utility Rent Matrix */}
        {tile.utility && (
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-[10.5px] space-y-1.5">
            <div className="text-slate-300">
              • If 1 Utility owned: Rent is <span className="font-bold text-emerald-400">4×</span> amount shown on dice.
            </div>
            <div className="text-amber-300 font-semibold">
              • If both Utilities owned: Rent is <span className="font-black text-amber-400">10×</span> amount shown on dice.
            </div>
          </div>
        )}

        {/* Corner / Special Square info */}
        {tile.type === 'go' && (
          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-800/60 text-[11px] text-emerald-200">
            Collect <span className="font-black text-emerald-400">$200</span> salary whenever you pass or land on this square.
          </div>
        )}
        {tile.type === 'jail' && (
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-[10.5px] text-slate-300 space-y-1">
            <p className="font-semibold text-amber-300">Moruya Courthouse Rules:</p>
            <p>• Just Visiting: Safe passage.</p>
            <p>• In Jail: Pay $50, roll doubles (up to 3 turns), or use a Get Out of Jail Free card.</p>
          </div>
        )}
        {tile.type === 'parking' && (
          <div className="bg-cyan-950/40 rounded-xl p-2.5 border border-cyan-800/60 text-[11px] text-cyan-200">
            Free resting place. No rent or penalties. Watch the ocean waves over Batehaven Beach!
          </div>
        )}
        {tile.type === 'gotojail' && (
          <div className="bg-rose-950/40 rounded-xl p-2.5 border border-rose-800/60 text-[11px] text-rose-200">
            Busted by NSW Highway Patrol! Go directly to Bodalla Police Station. Do not pass GO, do not collect $200.
          </div>
        )}
        {(tile.type === 'notice' || tile.type === 'knowledge') && (
          <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-800/60 text-[11px] text-amber-200">
            Draw the top card from the deck and follow its instructions immediately.
          </div>
        )}

        {/* 4. Current In-Game Ownership & Status Bar */}
        <div className="mt-auto pt-2 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
          {price !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-md">
                Price: ${price}
              </span>
              {mortgageValue && (
                <span className="text-[9.5px] text-slate-400">
                  Mortgage: ${mortgageValue}
                </span>
              )}
            </div>
          )}

          {owner ? (
            <div className="flex items-center gap-1.5 ml-auto">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: owner.color }}
              >
                <TokenRenderer tokenId={owner.token} size={10} color="#FFFFFF" />
              </div>
              <span className="font-bold text-slate-200 truncate max-w-[100px]">
                {owner.name}
              </span>
              {isMortgaged ? (
                <span className="text-[9px] font-black text-rose-400 bg-rose-950/80 px-1 rounded">
                  MORTGAGED
                </span>
              ) : houses > 0 ? (
                <span className="text-[9px] font-bold text-amber-300">
                  {houses === 5 ? '★ Hotel' : `${houses}H`}
                </span>
              ) : null}
            </div>
          ) : price !== undefined && tile.type !== 'tax' ? (
            <span className="ml-auto text-[10px] font-bold text-emerald-400/90">
              Available to buy
            </span>
          ) : null}
        </div>
        {isPinned && (
          <div className="bg-amber-500/15 border-t border-amber-500/30 px-3 py-1 flex items-center justify-between text-[9px] text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <Pin className="w-3 h-3 text-amber-400" />
              Pinned for detailed reading
            </span>
            <span className="text-slate-400 font-medium">Click square or (X) to unpin</span>
          </div>
        )}
      </div>
    </div>
  );
};
