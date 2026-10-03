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
  const [pinnedTileIndex, setPinnedTileIndex] = useState<number | null>(null);
  const activeHoveredIndex = pinnedTileIndex ?? (hoveredTileIndex !== undefined ? hoveredTileIndex : internalHoveredIndex);

  const setHover = (idx: number | null) => {
    setInternalHoveredIndex(idx);
    onHoverTile?.(idx);
  };

  const currentPlayer = getCurrentPlayer(state);
  const displayPositions = useAnimatedPositions(state.players);
  const latestEvent = state.events && state.events.length > 0 ? state.events[state.events.length - 1] : null;

  return (
    <div className="relative w-full aspect-square max-h-[68vh] max-w-[min(68vh,100%)] lg:max-h-[92vh] lg:max-w-[min(92vh,100%)] mx-auto p-2 sm:p-2.5 bg-gradient-to-br from-[#122438] via-[#091524] to-[#040A12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] border-2 border-slate-700/80 backdrop-blur-md select-none overflow-hidden touch-manipulation">
      {/* 11x11 CSS Grid with 1.6x Corners and 2.5px gutters */}
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: '1.6fr repeat(9, 1fr) 1.6fr',
          gridTemplateRows: '1.6fr repeat(9, 1fr) 1.6fr',
          gap: '2.5px',
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

              {/* Dedicated Non-Overlapping Enamel 3D Token Cluster Layer */}
              {playersHere.length > 0 && (
                <div className="absolute bottom-1 right-1 z-30 pointer-events-none flex flex-wrap justify-end gap-1 max-w-[48px]">
                  {playersHere.map((p) => {
                    const isTurn = p.id === currentPlayer?.id;
                    return (
                      <div
                        key={`${p.id}-${tile.index}`}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-[0_3px_6px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-auto transition-transform hover:scale-135 hover:z-40 animate-token-hop cursor-pointer ${
                          isTurn ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950 animate-pulse' : ''
                        }`}
                        style={{ backgroundColor: p.color }}
                        title={`${p.name} (${p.token})`}
                      >
                        <TokenRenderer tokenId={p.token} size={14} color="#FFFFFF" />
                      </div>
                    );
                  })}
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
          className="relative m-0.5 rounded-2xl bg-gradient-to-b from-[#081830] via-[#0E223D] to-[#040F1E] border border-cyan-800/40 p-2 sm:p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner"
        >
          {/* Zoomed Detailed Close-Up Overlay when hovering or pinning any tile */}
          {activeHoveredIndex !== null && BOARD_TILES[activeHoveredIndex] && (
            <div
              className={`absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-[3px] animate-in fade-in zoom-in-95 duration-150 ${
                pinnedTileIndex !== null ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <TileDetailCloseUp
                tile={BOARD_TILES[activeHoveredIndex]}
                propertyState={state.properties[activeHoveredIndex]}
                owner={
                  state.properties[activeHoveredIndex]?.ownerId
                    ? state.players.find((p) => p.id === state.properties[activeHoveredIndex].ownerId)
                    : undefined
                }
                isPinned={pinnedTileIndex !== null}
                onClose={() => setPinnedTileIndex(null)}
              />
            </div>
          )}

          {/* Scenic Illustrated NSW South Coast Background (Montague Island, Lighthouse Beam, Gulaga, Breaching Whale, Waves) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
            <svg viewBox="0 0 500 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="lighthouseBeam" x1="1" y1="0.5" x2="0" y2="0.5">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#FDE047" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="skyGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#0B1E38" />
                  <stop offset="60%" stopColor="#0F3254" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
              </defs>

              {/* Sky base */}
              <rect width="500" height="500" fill="url(#skyGrad)" opacity="0.3" />

              {/* Distant Golden Sun / Moon over horizon */}
              <circle cx="250" cy="230" r="32" fill="#FDE047" fillOpacity="0.15" />
              <circle cx="250" cy="230" r="20" fill="#FEF08A" fillOpacity="0.25" />

              {/* Nautical Compass Rose watermark */}
              <g transform="translate(250, 160)" opacity="0.15">
                <circle r="44" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="3 3" />
                <circle r="32" fill="none" stroke="#F59E0B" strokeWidth="1.2" />
                <polygon points="0,-44 5,-10 0,0 -5,-10" fill="#F59E0B" />
                <polygon points="0,44 5,10 0,0 -5,10" fill="#F59E0B" />
                <polygon points="44,0 10,5 0,0 10,-5" fill="#F59E0B" />
                <polygon points="-44,0 -10,5 0,0 -10,-5" fill="#F59E0B" />
              </g>

              {/* Gulaga (Mt Dromedary) coastal range silhouette */}
              <path d="M 0,270 Q 110,190 220,250 T 420,270 L 500,290 L 500,500 L 0,500 Z" fill="#07223D" fillOpacity="0.65" />
              <path d="M 0,310 Q 150,250 280,290 T 500,280 L 500,500 L 0,500 Z" fill="#034574" fillOpacity="0.55" />

              {/* Montague Island (Baranguba) */}
              <ellipse cx="370" cy="305" rx="55" ry="18" fill="#041220" fillOpacity="0.9" />
              <path d="M 320,305 Q 370,288 420,305 Z" fill="#0B2B47" />

              {/* Montague Island Lighthouse Tower */}
              <polygon points="367,302 369,262 376,262 378,302" fill="#F8FAFC" />
              <rect x="367" y="260" width="10" height="3" fill="#DC2626" rx="1" />
              <polygon points="365,260 372,248 379,260" fill="#991B1B" />
              <circle cx="372" cy="256" r="4.5" fill="#FEF08A" />

              {/* Radiating Lighthouse Beam sweeping across water */}
              <polygon points="372,256 0,230 0,370" fill="url(#lighthouseBeam)" />

              {/* Breaching Humpback Whale with tail & spray */}
              <path d="M 120,335 C 138,300 152,270 165,282 C 152,302 140,318 128,330 C 116,318 104,302 91,282 C 104,270 118,300 120,335 Z" fill="#38BDF8" fillOpacity="0.95" />
              <circle cx="120" cy="265" r="2.5" fill="#E0F2FE" opacity="0.8" />
              <path d="M 116,275 Q 120,260 124,275" stroke="#BAE6FD" strokeWidth="2" fill="none" opacity="0.8" />
              <ellipse cx="128" cy="342" rx="30" ry="6" fill="#38BDF8" fillOpacity="0.3" />

              {/* Layered Golden & Turquoise Surf Waves */}
              <path d="M 0,420 Q 60,405 120,420 T 240,420 T 360,420 T 480,420" fill="none" stroke="#38BDF8" strokeWidth="2.5" opacity="0.6" className="animate-pulse" />
              <path d="M 20,445 Q 80,432 160,445 T 320,445 T 480,445" fill="none" stroke="#FBBF24" strokeWidth="1.8" opacity="0.5" />
              <path d="M 0,470 Q 70,458 140,470 T 280,470 T 420,470" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.4" />
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
            {/* Community Notice Board 3D Stack (Left) */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-amber-950/70 rounded-lg border border-amber-900/40" />
                <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-amber-900/80 rounded-lg border border-amber-800/50" />
                <div
                  className="relative w-14 h-20 sm:w-18 sm:h-26 rounded-lg p-1.5 flex flex-col justify-between items-center text-center shadow-2xl border-2 border-amber-400/60"
                  style={{
                    background: 'linear-gradient(135deg, #B45309 0%, #78350F 60%, #451A03 100%)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.3)',
                  }}
                >
                  <div className="w-full h-1 bg-amber-300/60 rounded-full" />
                  <div className="text-[8px] sm:text-[9.5px] font-black text-amber-100 uppercase tracking-tighter leading-tight drop-shadow-sm">
                    COMMUNITY NOTICE BOARD
                  </div>
                  <div className="px-1.5 py-0.2 rounded-full bg-amber-950/80 border border-amber-500/40 text-[7px] sm:text-[8px] text-amber-300 font-extrabold">
                    {state.noticeDeck?.length ?? 16} Cards
                  </div>
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

            {/* Local Knowledge 3D Stack (Right) */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <div className="absolute inset-0 -translate-x-1.5 translate-y-1.5 bg-sky-950/70 rounded-lg border border-sky-900/40" />
                <div className="absolute inset-0 -translate-x-0.5 translate-y-0.5 bg-sky-900/80 rounded-lg border border-sky-800/50" />
                <div
                  className="relative w-14 h-20 sm:w-18 sm:h-26 rounded-lg p-1.5 flex flex-col justify-between items-center text-center shadow-2xl border-2 border-cyan-400/60"
                  style={{
                    background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 60%, #082F49 100%)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.3)',
                  }}
                >
                  <div className="w-full h-1 bg-cyan-300/60 rounded-full" />
                  <div className="text-[8px] sm:text-[9.5px] font-black text-cyan-100 uppercase tracking-tighter leading-tight drop-shadow-sm">
                    LOCAL KNOWLEDGE
                  </div>
                  <div className="px-1.5 py-0.2 rounded-full bg-sky-950/80 border border-cyan-500/40 text-[7px] sm:text-[8px] text-cyan-300 font-extrabold">
                    {state.knowledgeDeck?.length ?? 16} Cards
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Live Event Ticker (Immediate action clarity in board center) */}
          {latestEvent && (
            <div className="w-full max-w-[360px] z-10 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-lg flex items-center gap-2 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <span className="text-[9px] sm:text-[11px] text-slate-200 truncate font-semibold">
                {latestEvent.message}
              </span>
            </div>
          )}

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
