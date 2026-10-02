import React from 'react';
import { GameState, PlayerState } from '../../engine/types';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { TokenRenderer } from '../icons/TokenIcons';
import { getCurrentPlayer } from '../../engine/rules';
import { ArrowLeftRight, UserX, ShieldAlert } from 'lucide-react';

interface PlayersPanelProps {
  state: GameState;
  myPlayerId: string;
  onInitiateTrade: (targetPlayerId: string) => void;
  onKickPlayer: (targetPlayerId: string) => void;
  onSelectTile: (tileIndex: number) => void;
}

export const PlayersPanel: React.FC<PlayersPanelProps> = ({
  state,
  myPlayerId,
  onInitiateTrade,
  onKickPlayer,
  onSelectTile,
}) => {
  const currentPlayer = getCurrentPlayer(state);
  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost ?? false;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
        Players & Assets
      </h2>

      <div className="flex flex-col gap-2">
        {state.players.map((player) => {
          const isTurn = player.id === currentPlayer?.id;
          const isMe = player.id === myPlayerId;
          const ownedProps = Object.values(state.properties).filter(
            (p) => p.ownerId === player.id
          );

          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl border transition-all ${
                player.isBankrupt
                  ? 'bg-slate-900/40 border-slate-800/50 opacity-40'
                  : isTurn
                  ? 'bg-slate-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Player identity */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: player.color }}
                  >
                    <TokenRenderer tokenId={player.token} size={18} color="#FFFFFF" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                        {player.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                          You
                        </span>
                      )}
                      {player.isBot && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1 py-0.2 rounded">
                          Bot
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {BOARD_TILES[player.position]?.shortName || BOARD_TILES[player.position]?.name}
                    </div>
                  </div>
                </div>

                {/* Cash & Jail Status */}
                <div className="text-right flex-shrink-0">
                  {player.isBankrupt ? (
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                      Bankrupt
                    </span>
                  ) : (
                    <>
                      <div
                        className={`text-sm sm:text-base font-extrabold ${
                          player.cash < 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        ${player.cash}
                      </div>
                      {player.inJail && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                          <ShieldAlert className="w-3 h-3" />
                          In Jail ({player.jailTurns}/3)
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Properties Strip */}
              {!player.isBankrupt && ownedProps.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1">
                    Properties ({ownedProps.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ownedProps.map((prop) => {
                      const tile = BOARD_TILES[prop.tileIndex];
                      const color = tile.property
                        ? COLOR_GROUP_CONFIG[tile.property.colorGroup]?.color
                        : '#64748B';

                      return (
                        <button
                          key={prop.tileIndex}
                          onClick={() => onSelectTile(prop.tileIndex)}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-xs hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: color,
                            opacity: prop.isMortgaged ? 0.5 : 1,
                          }}
                          title={`${tile.name}${prop.houses > 0 ? ` (${prop.houses === 5 ? 'Hotel' : `${prop.houses}H`})` : ''}${prop.isMortgaged ? ' [Mortgaged]' : ''}`}
                        >
                          {tile.shortName || tile.name.split(' ')[0]}
                          {prop.houses > 0 && (
                            <span className="ml-1 text-[8px] bg-black/40 px-1 py-0.2 rounded">
                              {prop.houses === 5 ? 'H' : `${prop.houses}★`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions on this player */}
              {!player.isBankrupt && !isMe && state.phase !== 'lobby' && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onInitiateTrade(player.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors border border-slate-700/60"
                  >
                    <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                    Trade
                  </button>

                  {isHost && (
                    <button
                      onClick={() => onKickPlayer(player.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] font-semibold transition-colors border border-red-800/40"
                      title="Kick player"
                    >
                      <UserX className="w-3 h-3" />
                      Kick
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
