import React from 'react';
import { BoardTile, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { PlayerState, PropertyState } from '../../engine/types';
import { TileIcon } from '../icons/TileIcons';
import { TokenRenderer } from '../icons/TokenIcons';

interface TileProps {
  tile: BoardTile;
  propertyState?: PropertyState;
  playersOnTile: PlayerState[];
  owner?: PlayerState;
  onClick: () => void;
  isCurrentPlayerTile?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  tile,
  propertyState,
  playersOnTile,
  owner,
  onClick,
  isCurrentPlayerTile,
}) => {
  const isCorner = tile.type === 'go' || tile.type === 'jail' || tile.type === 'parking' || tile.type === 'gotojail';
  const colorGroup = tile.property?.colorGroup;
  const colorConfig = colorGroup ? COLOR_GROUP_CONFIG[colorGroup] : null;

  const houses = propertyState?.houses ?? 0;
  const isMortgaged = propertyState?.isMortgaged ?? false;
  const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? tile.tax?.amount;

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
      aria-label={`${tile.name}${price ? `, $${price}` : ''}${owner ? `, Owned by ${owner.name}` : ''}`}
      className={`relative flex flex-col justify-between p-1 select-none cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-95 border ${
        isCurrentPlayerTile
          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 border-amber-400 z-10'
          : owner
          ? 'border-slate-500/80 shadow-inner'
          : 'border-slate-800'
      } ${
        isMortgaged ? 'opacity-65 grayscale-[40%]' : ''
      } bg-slate-900/90 hover:bg-slate-800/90 rounded text-slate-100 overflow-hidden text-center group`}
      style={{
        boxShadow: owner ? `inset 0 -3px 0 ${owner.color}` : undefined,
      }}
    >
      {/* Colour Bar for Properties */}
      {colorConfig && (
        <div
          className="w-full h-3 sm:h-3.5 -mt-1 -mx-1 mb-1 rounded-t flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: colorConfig.color }}
        >
          {/* House / Hotel indicators */}
          {houses > 0 && houses < 5 && (
            <div className="flex gap-0.5 items-center justify-center">
              {Array.from({ length: houses }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 border border-emerald-700 rounded-xs shadow-sm"
                  title="House"
                />
              ))}
            </div>
          )}
          {houses === 5 && (
            <div
              className="px-1 py-0.2 bg-red-600 border border-red-900 text-[8px] font-black tracking-tight text-white rounded-xs shadow-sm"
              title="Hotel"
            >
              HOTEL
            </div>
          )}
        </div>
      )}

      {/* Hardware / Utility header band */}
      {(tile.type === 'hardware' || tile.type === 'utility') && (
        <div className="w-full h-2 bg-slate-700/80 -mt-1 -mx-1 mb-1 rounded-t" />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-0">
        <div className="text-slate-300 group-hover:text-amber-300 transition-colors">
          <TileIcon icon={tile.icon} size={isCorner ? 26 : 18} />
        </div>

        <span
          className={`leading-tight font-bold tracking-tight text-slate-200 line-clamp-2 px-0.5 ${
            isCorner ? 'text-[10px] sm:text-xs text-amber-300' : 'text-[9px] sm:text-[10px]'
          }`}
        >
          {tile.shortName || tile.name}
        </span>

        {/* Price / Action label */}
        {price !== undefined && (
          <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-400">
            ${price}
          </span>
        )}
      </div>

      {/* Mortgaged overlay label */}
      {isMortgaged && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
          <span className="bg-red-700 text-white text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded rotate-[-25deg]">
            MORTGAGED
          </span>
        </div>
      )}

      {/* Players on Tile Badge */}
      {playersOnTile.length > 0 && (
        <div className="absolute bottom-1 right-1 flex -space-x-1.5 z-20 pointer-events-none">
          {playersOnTile.map((p) => (
            <div
              key={p.id}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-125"
              style={{ backgroundColor: p.color }}
              title={`${p.name} (${p.token})`}
            >
              <TokenRenderer tokenId={p.token} size={14} color="#FFFFFF" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
