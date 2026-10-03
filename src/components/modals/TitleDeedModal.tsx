import React from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState } from '../../engine/types';
import { TileArtIcon } from '../icons/icons';
import { SquareIllustration } from '../board/SquareIllustration';
import { X, Home, Building2 } from 'lucide-react';

interface TitleDeedModalProps {
  tileIndex: number | null;
  state: GameState;
  myPlayerId: string;
  onClose: () => void;
  onAction?: (action: any) => void;
}

export const TitleDeedModal: React.FC<TitleDeedModalProps> = ({
  tileIndex,
  state,
  myPlayerId,
  onClose,
  onAction,
}) => {
  if (tileIndex === null) return null;
  const tile = BOARD_TILES[tileIndex];
  if (!tile) return null;

  const propState = state.properties[tileIndex];
  const owner = propState?.ownerId
    ? state.players.find((p) => p.id === propState.ownerId)
    : null;
  const isMine = owner?.id === myPlayerId;
  const colorConfig = tile.property?.colorGroup ? COLOR_GROUP_CONFIG[tile.property.colorGroup] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-card-flip font-board">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        {colorConfig ? (
          <div
            className="p-4 text-center border-b border-black/20"
            style={{ backgroundColor: colorConfig.color }}
          >
            <div className="text-[10px] uppercase font-black tracking-widest text-white/90">
              Title Deed
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">{tile.name}</h2>
            <div className="text-xs text-white/80 font-medium">{colorConfig.name}</div>
          </div>
        ) : (
          <div className="p-4 bg-slate-800 text-center border-b border-slate-700 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-slate-600 mb-1.5">
              <SquareIllustration index={tile.index} size={56} className="w-full h-full object-cover" />
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              South Coast Landmark
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">{tile.name}</h2>
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {colorConfig && (
            <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 shadow-sm">
                <SquareIllustration index={tile.index} size={48} className="w-full h-full object-cover" />
              </div>
              <p className="text-slate-300 italic text-xs leading-snug">{tile.description}</p>
            </div>
          )}
          {!colorConfig && (
            <p className="text-slate-300 italic text-center text-xs">{tile.description}</p>
          )}

          {/* Standard Property Rent Table */}
          {tile.property && (
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-1.5 font-medium">
              <div className="flex justify-between py-0.5 border-b border-slate-800 text-slate-300">
                <span>Rent alone:</span>
                <span className="font-bold text-emerald-400">${tile.property.rent[0]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>With 1 House:</span>
                <span className="font-bold text-emerald-400">${tile.property.rent[1]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>With 2 Houses:</span>
                <span className="font-bold text-emerald-400">${tile.property.rent[2]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>With 3 Houses:</span>
                <span className="font-bold text-emerald-400">${tile.property.rent[3]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>With 4 Houses:</span>
                <span className="font-bold text-emerald-400">${tile.property.rent[4]}</span>
              </div>
              <div className="flex justify-between py-0.5 pt-1 border-t border-slate-800 text-amber-300 font-bold">
                <span>With HOTEL:</span>
                <span className="text-amber-300 font-extrabold">${tile.property.rent[5]}</span>
              </div>
            </div>
          )}

          {/* Hardware Stores Rent Table */}
          {tile.hardware && (
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-1.5 font-medium">
              <div className="text-[11px] font-bold text-slate-400 mb-1">
                Hardware Stores Rent:
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>If 1 hardware store owned:</span>
                <span className="font-bold text-emerald-400">${tile.hardware.rents[0]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>If 2 hardware stores owned:</span>
                <span className="font-bold text-emerald-400">${tile.hardware.rents[1]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300">
                <span>If 3 hardware stores owned:</span>
                <span className="font-bold text-emerald-400">${tile.hardware.rents[2]}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-300 font-bold">
                <span>If 4 hardware stores owned:</span>
                <span className="text-emerald-400 font-extrabold">${tile.hardware.rents[3]}</span>
              </div>
            </div>
          )}

          {/* Utility Multipliers */}
          {tile.utility && (
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-1.5 font-medium">
              <div className="text-[11px] font-bold text-slate-400 mb-1">Utility Charges:</div>
              <p className="text-slate-300 leading-normal">
                If 1 Utility is owned, rent is <strong>4 times</strong> the amount shown on the dice.
              </p>
              <p className="text-slate-300 leading-normal">
                If both Utilities are owned, rent is <strong>10 times</strong> the amount shown on the dice.
              </p>
            </div>
          )}

          {/* Financials: Mortgage & House Costs */}
          <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
            {tile.property && (
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="text-slate-400">House Cost</div>
                <div className="font-bold text-slate-100 text-sm">${tile.property.houseCost} each</div>
              </div>
            )}
            {(tile.property || tile.hardware || tile.utility) && (
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="text-slate-400">Mortgage Value</div>
                <div className="font-bold text-slate-100 text-sm">
                  ${tile.property?.mortgageValue ?? tile.hardware?.mortgageValue ?? tile.utility?.mortgageValue}
                </div>
              </div>
            )}
          </div>

          {/* Current Ownership Status */}
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Ownership:</span>
            {owner ? (
              <div className="flex items-center gap-1.5 font-bold" style={{ color: owner.color }}>
                <span>{owner.name}</span>
                {isMine && <span className="text-xs text-slate-400">(You)</span>}
              </div>
            ) : (
              <span className="text-emerald-400 font-bold">Unowned (Bank)</span>
            )}
          </div>

          {propState?.isMortgaged && (
            <div className="text-center font-bold text-red-400 bg-red-950/40 border border-red-900/60 py-1 rounded">
              This property is currently MORTGAGED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
