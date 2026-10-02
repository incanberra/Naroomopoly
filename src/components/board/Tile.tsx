import React, { useState } from 'react';
import { BoardTile, COLOR_GROUP_CONFIG, ColorGroup } from '../../data/boardData';
import { PlayerState, PropertyState } from '../../engine/types';
import { TileArtIcon } from '../icons/icons';

interface TileProps {
  tile: BoardTile;
  propertyState?: PropertyState;
  owner?: PlayerState;
  isCurrentPlayerTile?: boolean;
  onClick: () => void;
  rotation?: 0 | 90 | 180 | -90;
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

export const Tile: React.FC<TileProps> = ({
  tile,
  propertyState,
  owner,
  isCurrentPlayerTile,
  onClick,
  rotation = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorGroup = tile.property?.colorGroup;
  const colorConfig = colorGroup ? COLOR_GROUP_CONFIG[colorGroup] : null;
  const groupLetter = colorGroup ? COLOR_GROUP_LETTERS[colorGroup] : null;

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${tile.name}${price ? `, $${price}` : ''}${owner ? `, Owned by ${owner.name}` : ''}`}
      className={`group relative w-full h-full select-none cursor-pointer transition-all duration-150 overflow-hidden rounded-lg border ${
        isCurrentPlayerTile
          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 border-amber-400 z-10 scale-[1.02]'
          : owner
          ? 'border-slate-600/90 shadow-sm'
          : 'border-slate-800/90 hover:border-slate-600'
      } ${
        isMortgaged ? 'opacity-65 grayscale-[50%]' : ''
      } bg-slate-900/95 hover:bg-slate-800/95 text-slate-100 flex flex-col justify-between`}
      style={{
        boxShadow: owner ? `inset 0 -3px 0 ${owner.color}, 0 2px 6px rgba(0,0,0,0.3)` : '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      {/* Rotatable Inner Container so text reads outward like a real Monopoly board */}
      <div
        className="w-full h-full flex flex-col justify-between p-1 relative overflow-hidden transition-transform duration-200"
        style={{
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: 'center center',
        }}
      >
        {/* 1. Colour Band (facing center) with 3D Houses/Hotels */}
        {colorConfig && (
          <div
            className="w-full h-3.5 sm:h-4 -mt-1 -mx-1 mb-0.5 rounded-t relative overflow-hidden flex items-center justify-between px-1 shadow-inner flex-shrink-0"
            style={{
              background: `linear-gradient(180deg, ${colorConfig.color} 0%, ${colorConfig.color}DD 100%)`,
            }}
          >
            {/* Color-blind group letter tag */}
            <span
              className="text-[8px] font-black tracking-tighter opacity-70 bg-black/30 rounded-xs px-0.5 text-white"
              title={`Group ${groupLetter}: ${colorConfig.name}`}
            >
              {groupLetter}
            </span>

            {/* 3D-styled Houses (1-4) or Hotel (5) */}
            <div className="flex items-center gap-0.5">
              {houses > 0 && houses < 5 && (
                <div className="flex gap-0.5 items-center">
                  {Array.from({ length: houses }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 bg-emerald-500 border border-emerald-800 rounded-xs shadow-sm flex items-center justify-center text-[6px] font-bold text-white relative"
                      title="House"
                      style={{
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.4)',
                      }}
                    >
                      <span className="w-1.5 h-0.5 bg-emerald-200/50 -mt-1 rounded-xs" />
                    </div>
                  ))}
                </div>
              )}
              {houses === 5 && (
                <div
                  className="px-1 py-0.2 bg-gradient-to-b from-red-500 to-red-700 border border-red-950 text-[7px] font-black tracking-tighter text-white rounded-xs shadow-sm flex items-center gap-0.5"
                  title="Hotel"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  ★ HOTEL
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hardware or Utility accent header */}
        {(tile.type === 'hardware' || tile.type === 'utility') && (
          <div
            className={`w-full h-1.5 -mt-1 -mx-1 mb-0.5 rounded-t flex-shrink-0 ${
              tile.type === 'hardware'
                ? tile.index === 5
                  ? 'bg-emerald-600' // Bunnings
                  : tile.index === 15
                  ? 'bg-blue-600' // Camerons
                  : tile.index === 25
                  ? 'bg-amber-800' // Woody's
                  : 'bg-red-600' // Mitre 10
                : 'bg-cyan-600'
            }`}
          />
        )}

        {/* 2. Tile Name (Full name, balanced across 2 lines max, never overlapping price) */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center px-0.5 my-auto">
          <span
            className="font-bold tracking-tight text-slate-100 leading-[1.1] text-balance break-words line-clamp-2 w-full select-none"
            style={{
              fontSize: 'clamp(8px, 1.05vw, 10.5px)',
            }}
          >
            {tile.name}
          </span>
        </div>

        {/* 3. Unique Hand-Drawn Illustrated SVG Icon */}
        <div className="flex items-center justify-center my-0.5 text-slate-300 group-hover:text-amber-300 transition-colors drop-shadow-xs flex-shrink-0">
          <TileArtIcon index={tile.index} size={18} />
        </div>

        {/* 4. Price or Type Badge at Bottom */}
        <div className="flex-shrink-0 text-center pt-0.5">
          {price !== undefined ? (
            <span
              className="inline-block font-extrabold text-emerald-400 bg-slate-950/70 border border-slate-800 px-1 py-0.2 rounded-xs tracking-tight"
              style={{ fontSize: 'clamp(7.5px, 0.9vw, 9.5px)' }}
            >
              ${price}
            </span>
          ) : (
            <span
              className="inline-block font-bold text-slate-400 text-[8px] uppercase tracking-wider"
            >
              {tile.type === 'notice' ? 'NOTICE' : tile.type === 'knowledge' ? 'LOCAL' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Mortgaged Overlay Ribbon */}
      {isMortgaged && (
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-10">
          <span className="bg-red-700/90 border border-red-500 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-md rotate-[-22deg]">
            MORTGAGED
          </span>
        </div>
      )}

      {/* Hover Detail Card on Desktop */}
      {isHovered && (
        <div className="absolute inset-0 z-30 bg-slate-900/95 p-1 flex flex-col justify-between text-center animate-in fade-in duration-100 pointer-events-none">
          <div className="text-[9px] font-extrabold text-amber-300 leading-tight">
            {tile.name}
          </div>
          <div className="text-[8px] text-slate-300 italic line-clamp-2">
            {tile.description}
          </div>
          <div className="text-[8px] font-bold text-emerald-400">
            {price ? `Price: $${price}` : ''}
            {owner ? ` • Owner: ${owner.name}` : ''}
          </div>
        </div>
      )}
    </div>
  );
};
