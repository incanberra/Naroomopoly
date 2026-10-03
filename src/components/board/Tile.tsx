import React, { useState } from 'react';
import { BoardTile, COLOR_GROUP_CONFIG, ColorGroup } from '../../data/boardData';
import { PlayerState, PropertyState } from '../../engine/types';
import { TileArtIcon } from '../icons/icons';
import { SquareIllustration } from './SquareIllustration';

interface TileProps {
  tile: BoardTile;
  propertyState?: PropertyState;
  owner?: PlayerState;
  isCurrentPlayerTile?: boolean;
  onClick: () => void;
  rotation?: 0 | 90 | 180 | -90;
  onHover?: () => void;
  onLeave?: () => void;
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
  onHover,
  onLeave,
}) => {
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
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      aria-label={`${tile.name}${price ? `, $${price}` : ''}${owner ? `, Owned by ${owner.name}` : ''}`}
      className={`group relative w-full h-full select-none cursor-pointer transition-all duration-150 overflow-hidden rounded-lg border ${
        isCurrentPlayerTile
          ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-slate-950 border-amber-500 z-10 scale-[1.03]'
          : owner
          ? 'border-[#C8BFAD] hover:border-amber-500/90 hover:scale-[1.03] hover:z-20'
          : 'border-[#DDD5C5] hover:border-amber-500/80 hover:scale-[1.03] hover:z-20'
      } ${
        isMortgaged ? 'opacity-65 grayscale-[50%]' : ''
      } bg-[#FAF7F0] hover:bg-[#FFFDF7] text-slate-900 flex flex-col justify-between`}
      style={{
        boxShadow: owner
          ? `inset 0 -3.5px 0 ${owner.color}, 0 2px 5px rgba(0,0,0,0.2)`
          : '0 1.5px 3.5px rgba(0,0,0,0.12)',
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
            className="w-full h-3.5 sm:h-4 -mt-1 -mx-1 mb-0.5 rounded-t relative overflow-hidden flex items-center justify-between px-1 shadow-inner border-b border-black/15 flex-shrink-0"
            style={{
              background: `linear-gradient(180deg, ${colorConfig.color} 0%, ${colorConfig.color}E6 100%)`,
            }}
          >
            {/* Color-blind group letter tag */}
            <span
              className="text-[8px] font-black tracking-tighter bg-black/40 rounded-xs px-0.5 text-white shadow-xs"
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
                      className="w-2.5 h-2.5 bg-emerald-600 border border-emerald-950 rounded-xs shadow-xs flex items-center justify-center text-[6px] font-bold text-white relative"
                      title="House"
                      style={{
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.4)',
                      }}
                    >
                      <span className="w-1.5 h-0.5 bg-emerald-200/60 -mt-1 rounded-xs" />
                    </div>
                  ))}
                </div>
              )}
              {houses === 5 && (
                <div
                  className="px-1 py-0.2 bg-gradient-to-b from-red-600 to-red-800 border border-red-950 text-[7px] font-black tracking-tighter text-white rounded-xs shadow-xs flex items-center gap-0.5"
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
            className={`w-full h-1.5 -mt-1 -mx-1 mb-0.5 rounded-t flex-shrink-0 shadow-inner ${
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
            className="font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance break-words line-clamp-2 w-full select-none"
            style={{
              fontSize: 'clamp(8px, 1.05vw, 10.5px)',
            }}
          >
            {tile.name}
          </span>
        </div>

        {/* 3. Bright Relevant Game Board Style Square Illustration (Prominent Centerpiece) */}
        <div className="flex items-center justify-center my-0.5 group-hover:scale-110 transition-transform drop-shadow-sm flex-1 min-h-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm overflow-hidden shadow-xs border border-amber-200/90 bg-white flex items-center justify-center">
            <SquareIllustration index={tile.index} size={32} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 4. Price or Type Badge at Bottom */}
        <div className="flex-shrink-0 text-center pt-0.5">
          {price !== undefined ? (
            <span
              className="inline-block font-black text-emerald-950 bg-emerald-100/90 border border-emerald-300/80 px-1 py-0.2 rounded-xs tracking-tight shadow-2xs"
              style={{ fontSize: 'clamp(7.5px, 0.9vw, 9.5px)' }}
            >
              ${price}
            </span>
          ) : (
            <span
              className="inline-block font-black text-slate-600 bg-slate-200/90 border border-slate-300/80 px-1 py-0.2 rounded-xs text-[7.5px] uppercase tracking-wider"
            >
              {tile.type === 'notice' ? 'NOTICE' : tile.type === 'knowledge' ? 'LOCAL' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Owner flag (top-right corner, in the owner's colour) */}
      {owner && (
        <div
          className="absolute top-0 right-0 w-3.5 h-3.5 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(225deg, ${owner.color} 50%, transparent 50%)`,
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
          }}
          title={`Owned by ${owner.name}`}
        />
      )}

      {/* Mortgaged Overlay Ribbon */}
      {isMortgaged && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-10">
          <span className="bg-red-700/95 border-2 border-red-400 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-lg rotate-[-22deg]">
            MORTGAGED
          </span>
        </div>
      )}

    </div>
  );
};
