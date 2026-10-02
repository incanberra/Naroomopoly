import React from 'react';
import { BOARD_TILES } from '../../data/boardData';
import { GameState, PlayerState } from '../../engine/types';
import { getCurrentPlayer } from '../../engine/rules';
import { Tile } from './Tile';
import { DiceView } from './DiceView';
import { TokenRenderer } from '../icons/TokenIcons';
import { Sparkles, Coins, HelpCircle } from 'lucide-react';

interface BoardProps {
  state: GameState;
  onSelectTile: (tileIndex: number) => void;
  onAction: (actionType: string) => void;
  isMyTurn: boolean;
  onOpenRules: () => void;
}

function getGridPosition(tileIndex: number): { gridRow: number; gridColumn: number } {
  if (tileIndex === 0) return { gridRow: 11, gridColumn: 11 };
  if (tileIndex > 0 && tileIndex < 10) {
    return { gridRow: 11, gridColumn: 11 - tileIndex };
  }
  if (tileIndex === 10) return { gridRow: 11, gridColumn: 1 };
  if (tileIndex > 10 && tileIndex < 20) {
    return { gridRow: 11 - (tileIndex - 10), gridColumn: 1 };
  }
  if (tileIndex === 20) return { gridRow: 1, gridColumn: 1 };
  if (tileIndex > 20 && tileIndex < 30) {
    return { gridRow: 1, gridColumn: 1 + (tileIndex - 20) };
  }
  if (tileIndex === 30) return { gridRow: 1, gridColumn: 11 };
  // 31 to 39
  return { gridRow: 1 + (tileIndex - 30), gridColumn: 11 };
}

export const Board: React.FC<BoardProps> = ({
  state,
  onSelectTile,
  onAction,
  isMyTurn,
  onOpenRules,
}) => {
  const currentPlayer = getCurrentPlayer(state);

  return (
    <div className="relative w-full max-w-[850px] aspect-square mx-auto p-2 sm:p-3 bg-slate-950/80 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md select-none">
      {/* 11x11 Grid for Monopoly Tiles */}
      <div className="w-full h-full grid grid-cols-11 grid-rows-11 gap-1">
        {BOARD_TILES.map((tile) => {
          const { gridRow, gridColumn } = getGridPosition(tile.index);
          const propState = state.properties[tile.index];
          const owner = propState?.ownerId
            ? state.players.find((p) => p.id === propState.ownerId)
            : undefined;
          const playersHere = state.players.filter(
            (p) => !p.isBankrupt && p.position === tile.index
          );
          const isCurrentTile = currentPlayer?.position === tile.index;

          return (
            <div
              key={tile.index}
              style={{
                gridRowStart: gridRow,
                gridColumnStart: gridColumn,
              }}
              className="w-full h-full"
            >
              <Tile
                tile={tile}
                propertyState={propState}
                playersOnTile={playersHere}
                owner={owner}
                isCurrentPlayerTile={isCurrentTile}
                onClick={() => onSelectTile(tile.index)}
              />
            </div>
          );
        })}

        {/* Center Area (Rows 2 to 10, Cols 2 to 10) */}
        <div
          style={{
            gridRow: '2 / span 9',
            gridColumn: '2 / span 9',
          }}
          className="relative m-1 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner"
        >
          {/* Subtle Coastal Wave Graphics */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-400">
              <path
                d="M 10,100 Q 50,50 100,100 T 190,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M 10,120 Q 50,70 100,120 T 190,120"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle cx="100" cy="70" r="28" fill="currentColor" fillOpacity="0.2" />
            </svg>
          </div>

          {/* Top Logo Banner */}
          <div className="flex flex-col items-center gap-0.5 z-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              NSW South Coast Edition
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent font-board drop-shadow-sm">
              Naroom-opoly
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Batemans Bay to Narooma • Princes Highway
            </p>
          </div>

          {/* Center Stage: Current Turn & Dice */}
          <div className="flex flex-col items-center gap-3 z-10 w-full max-w-sm">
            {/* Current Turn Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-lg w-full justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: currentPlayer.color }}
                >
                  <TokenRenderer tokenId={currentPlayer.token} size={18} color="#FFFFFF" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isMyTurn ? 'Your Turn' : "Current Turn"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {currentPlayer.name}
                    {currentPlayer.isBot && (
                      <span className="ml-1 text-[10px] text-amber-400 font-normal">
                        (Bot)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Free Parking Jackpot Badge (if enabled) */}
              {state.settings.freeParkingJackpot && (
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    ${state.freeParkingJackpotPool}
                  </span>
                </div>
              )}
            </div>

            {/* Dice Presentation */}
            <DiceView dice={state.dice} />
          </div>

          {/* Quick Info & Help Footer */}
          <div className="flex items-center justify-between w-full text-[10px] sm:text-xs text-slate-400 px-2 z-10">
            <span className="font-medium text-slate-400">
              Bank: {state.bankHousesRemaining} Houses • {state.bankHotelsRemaining} Hotels
            </span>
            <button
              onClick={onOpenRules}
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Rules Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
