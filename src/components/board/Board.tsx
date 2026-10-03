import React, { useState } from 'react';
import { BOARD_TILES } from '../../data/boardData';
import { GameState } from '../../engine/types';
import { getCurrentPlayer } from '../../engine/rules';
import { Tile } from './Tile';
import { CornerTile } from './CornerTile';
import { DiceView } from './DiceView';
import { TileDetailCloseUp } from './TileDetailCloseUp';
import { useAnimatedPositions } from './useAnimatedPositions';
import { TokenRenderer } from '../icons/TokenIcons';
import { Sparkles, Coins, HelpCircle } from 'lucide-react';

interface BoardProps {
  state: GameState;
  onSelectTile: (tileIndex: number) => void;
  onAction?: (actionType: string) => void;
  isMyTurn: boolean;
  onOpenRules: () => void;
  hoveredTileIndex?: number | null;
  onHoverTile?: (index: number | null) => void;
}

function getGridPosition(tileIndex: number): {
  gridRow: number;
  gridColumn: number;
  rotation: 0 | 90 | 180 | -90;
  isCorner: boolean;
} {
  // 0: Bottom-right corner
  if (tileIndex === 0) return { gridRow: 11, gridColumn: 11, rotation: 0, isCorner: true };
  // 1 to 9: Bottom row (right to left)
  if (tileIndex > 0 && tileIndex < 10) {
    return { gridRow: 11, gridColumn: 11 - tileIndex, rotation: 0, isCorner: false };
  }
  // 10: Bottom-left corner
  if (tileIndex === 10) return { gridRow: 11, gridColumn: 1, rotation: 0, isCorner: true };
  // 11 to 19: Left column (bottom to top, rotated 90deg)
  if (tileIndex > 10 && tileIndex < 20) {
    return { gridRow: 11 - (tileIndex - 10), gridColumn: 1, rotation: 90, isCorner: false };
  }
  // 20: Top-left corner
  if (tileIndex === 20) return { gridRow: 1, gridColumn: 1, rotation: 0, isCorner: true };
  // 21 to 29: Top row (left to right, rotated 180deg)
  if (tileIndex > 20 && tileIndex < 30) {
    return { gridRow: 1, gridColumn: 1 + (tileIndex - 20), rotation: 180, isCorner: false };
  }
  // 30: Top-right corner
  if (tileIndex === 30) return { gridRow: 1, gridColumn: 11, rotation: 0, isCorner: true };
  // 31 to 39: Right column (top to bottom, rotated -90deg)
  return { gridRow: 1 + (tileIndex - 30), gridColumn: 11, rotation: -90, isCorner: false };
}

export const Board: React.FC<BoardProps> = ({
  state,
  onSelectTile,
  isMyTurn,
  onOpenRules,
  hoveredTileIndex,
  onHoverTile,
}) => {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);
  const activeHoveredIndex = hoveredTileIndex !== undefined ? hoveredTileIndex : internalHoveredIndex;

  const setHover = (idx: number | null) => {
    setInternalHoveredIndex(idx);
    onHoverTile?.(idx);
  };

  const currentPlayer = getCurrentPlayer(state);
  const displayPositions = useAnimatedPositions(state.players);

  return (
    <div className="relative w-full aspect-square max-h-[68vh] max-w-[min(68vh,100%)] lg:max-h-[92vh] lg:max-w-[min(92vh,100%)] mx-auto p-1 sm:p-2 bg-slate-950/90 rounded-2xl shadow-2xl border border-slate-800/80 backdrop-blur-md select-none overflow-hidden touch-manipulation">
      {/* 11x11 CSS Grid with 1.6x Corners and 2px gutters */}
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: '1.6fr repeat(9, 1fr) 1.6fr',
          gridTemplateRows: '1.6fr repeat(9, 1fr) 1.6fr',
          gap: '2px',
        }}
      >
        {/* Render 40 Perimeter Tiles */}
        {BOARD_TILES.map((tile) => {
          const { gridRow, gridColumn, rotation, isCorner } = getGridPosition(tile.index);
          const propState = state.properties[tile.index];
          const owner = propState?.ownerId
            ? state.players.find((p) => p.id === propState.ownerId)
            : undefined;
          const playersHere = state.players.filter(
            (p) => !p.isBankrupt && displayPositions[p.id] === tile.index
          );
          const isCurrentTile = currentPlayer?.position === tile.index;

          return (
            <div
              key={tile.index}
              style={{
                gridRowStart: gridRow,
                gridColumnStart: gridColumn,
              }}
              className="relative w-full h-full min-w-0 min-h-0"
            >
              {isCorner ? (
                <CornerTile
                  tile={tile}
                  playersOnTile={playersHere}
                  isCurrentPlayerTile={isCurrentTile}
                  onClick={() => onSelectTile(tile.index)}
                  onHover={() => setHover(tile.index)}
                  onLeave={() => setHover(null)}
                />
              ) : (
                <Tile
                  tile={tile}
                  propertyState={propState}
                  owner={owner}
                  isCurrentPlayerTile={isCurrentTile}
                  rotation={rotation}
                  onClick={() => onSelectTile(tile.index)}
                  onHover={() => setHover(tile.index)}
                  onLeave={() => setHover(null)}
                />
              )}

              {/* Dedicated Non-Overlapping Token Cluster Layer (lower-corner 3x2 mini grid) */}
              {playersHere.length > 0 && (
                <div className="absolute bottom-1 right-1 z-30 pointer-events-none flex flex-wrap justify-end gap-0.5 max-w-[34px]">
                  {playersHere.map((p) => (
                    <div
                      key={`${p.id}-${tile.index}`}
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border shadow-lg flex items-center justify-center pointer-events-auto animate-token-hop ${
                        p.id === currentPlayer?.id ? 'border-amber-300 ring-2 ring-amber-400/70' : 'border-slate-900'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={`${p.name} (${p.token})`}
                    >
                      <TokenRenderer tokenId={p.token} size={11} color="#FFFFFF" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Center Area (Rows 2 to 10, Cols 2 to 10) */}
        <div
          style={{
            gridRow: '2 / span 9',
            gridColumn: '2 / span 9',
          }}
          className="relative m-0.5 rounded-xl bg-gradient-to-b from-[#0A192F] via-[#0F172A] to-[#06101E] border border-slate-800/80 p-3 sm:p-5 flex flex-col items-center justify-between overflow-hidden shadow-inner"
        >
          {/* Zoomed Detailed Close-Up Overlay when hovering any tile */}
          {activeHoveredIndex !== null && BOARD_TILES[activeHoveredIndex] && (
            <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-[3px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
              <TileDetailCloseUp
                tile={BOARD_TILES[activeHoveredIndex]}
                propertyState={state.properties[activeHoveredIndex]}
                owner={
                  state.properties[activeHoveredIndex]?.ownerId
                    ? state.players.find((p) => p.id === state.properties[activeHoveredIndex].ownerId)
                    : undefined
                }
              />
            </div>
          )}
          {/* Scenic Illustrated NSW South Coast Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            <svg viewBox="0 0 500 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* Montague Island and Headland Silhouettes */}
              <path d="M 0,380 Q 120,310 250,340 T 500,320 L 500,500 L 0,500 Z" fill="#0369A1" fillOpacity="0.4" />
              <path d="M 0,420 Q 180,360 320,400 T 500,380 L 500,500 L 0,500 Z" fill="#0284C7" fillOpacity="0.5" />
              {/* Montague Island profile */}
              <ellipse cx="380" cy="300" rx="45" ry="18" fill="#0B132B" fillOpacity="0.6" />
              <rect x="375" y="270" width="10" height="20" fill="#E2E8F0" fillOpacity="0.8" />
              <polygon points="373,270 380,258 387,270" fill="#DC2626" />
              <circle cx="380" cy="265" r="3" fill="#FDE047" />
              {/* Whale Tail Breaching */}
              <path d="M 120,330 C 135,305 145,280 155,290 C 145,305 135,315 125,325 C 115,315 105,305 95,290 C 105,280 115,305 120,330 Z" fill="#38BDF8" fillOpacity="0.8" />
              {/* Subtle Animated Idle Waves */}
              <path d="M 10,460 Q 60,450 120,460 T 240,460 T 360,460 T 480,460" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.6" className="animate-pulse" />
              <path d="M 0,480 Q 80,470 160,480 T 320,480 T 480,480" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          {/* Top Logo & Title */}
          <div className="flex flex-col items-center gap-0.5 z-10 text-center">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3 h-3" />
              NSW South Coast Edition
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent font-board drop-shadow-md">
              Naroom-opoly
            </h1>
            <p className="hidden sm:block text-[10px] sm:text-xs text-slate-400 font-medium tracking-tight">
              Batemans Bay to Narooma • Princes Highway
            </p>
          </div>

          {/* Card Decks & Center Dice Arena */}
          <div className="w-full flex items-center justify-between gap-2 z-10 px-2 sm:px-6 my-auto">
            {/* Community Notice Board 3D Card Stack (Left) */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-20 sm:w-18 sm:h-26 rounded-lg p-1.5 flex flex-col justify-between items-center text-center shadow-xl border border-amber-500/40 cursor-default"
                style={{
                  background: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
                  boxShadow: '0 4px 0 #451A03, 0 8px 15px rgba(0,0,0,0.5)',
                }}
              >
                <div className="w-full h-1 bg-amber-300/40 rounded-full" />
                <div className="text-[8px] sm:text-[9px] font-black text-amber-100 uppercase tracking-tighter leading-tight">
                  COMMUNITY NOTICE BOARD
                </div>
                <div className="text-[7px] text-amber-300 font-bold">
                  {state.noticeDeck?.length ?? 16} Cards
                </div>
              </div>
            </div>

            {/* Center Dice & Current Turn */}
            <div className="flex flex-col items-center gap-2">
              <DiceView dice={state.dice} />

              {/* Turn pill */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-md">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs"
                  style={{ backgroundColor: currentPlayer.color }}
                >
                  <TokenRenderer tokenId={currentPlayer.token} size={10} color="#FFFFFF" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-100 truncate max-w-[120px]">
                  {isMyTurn ? 'Your Turn' : `${currentPlayer.name}'s Turn`}
                </span>
              </div>
            </div>

            {/* Local Knowledge 3D Card Stack (Right) */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-20 sm:w-18 sm:h-26 rounded-lg p-1.5 flex flex-col justify-between items-center text-center shadow-xl border border-cyan-500/40 cursor-default"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  boxShadow: '0 4px 0 #082F49, 0 8px 15px rgba(0,0,0,0.5)',
                }}
              >
                <div className="w-full h-1 bg-cyan-300/40 rounded-full" />
                <div className="text-[8px] sm:text-[9px] font-black text-cyan-100 uppercase tracking-tighter leading-tight">
                  LOCAL KNOWLEDGE
                </div>
                <div className="text-[7px] text-cyan-300 font-bold">
                  {state.knowledgeDeck?.length ?? 16} Cards
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info: Free Parking Jackpot & Rules */}
          <div className="w-full flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 px-2 z-10">
            {state.settings.freeParkingJackpot ? (
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Coins className="w-3 h-3" />
                Jackpot: ${state.freeParkingJackpotPool}
              </div>
            ) : (
              <span>Bank: {state.bankHousesRemaining}H • {state.bankHotelsRemaining}M</span>
            )}

            <button
              onClick={onOpenRules}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors font-semibold"
            >
              <HelpCircle className="w-3 h-3" />
              Rules Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
