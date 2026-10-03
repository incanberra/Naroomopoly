import React, { useState } from 'react';
import { GameState } from '../../engine/types';
import { BOARD_TILES, COLOR_GROUP_CONFIG, ColorGroup } from '../../data/boardData';
import { TokenRenderer } from '../icons/TokenIcons';
import { CashBadge } from './CashBadge';
import { getCurrentPlayer, ownsFullGroup } from '../../engine/rules';
import { ArrowLeftRight, UserX, ShieldAlert, ChevronDown, ChevronUp, Crown } from 'lucide-react';

interface PlayersPanelProps {
  state: GameState;
  myPlayerId: string;
  onInitiateTrade: (targetPlayerId: string) => void;
  onKickPlayer: (targetPlayerId: string) => void;
  onSelectTile: (tileIndex: number) => void;
  onHoverTile?: (tileIndex: number | null) => void;
}

export const PlayersPanel: React.FC<PlayersPanelProps> = ({
  state,
  myPlayerId,
  onInitiateTrade,
  onKickPlayer,
  onSelectTile,
  onHoverTile,
}) => {
  const currentPlayer = getCurrentPlayer(state);
  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost ?? false;

  // Track collapsed property views
  const [collapsedPlayers, setCollapsedPlayers] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedPlayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Players & Assets ({state.players.length})
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {state.players.map((player) => {
          const isTurn = player.id === currentPlayer?.id;
          const isMe = player.id === myPlayerId;
          const isCollapsed = collapsedPlayers[player.id];

          const ownedProps = Object.values(state.properties).filter(
            (p) => p.ownerId === player.id
          );

          // Group owned properties by color group or type
          const groupedProps: Record<string, typeof ownedProps> = {};
          ownedProps.forEach((p) => {
            const tile = BOARD_TILES[p.tileIndex];
            const groupKey = tile.property?.colorGroup ?? tile.type;
            if (!groupedProps[groupKey]) groupedProps[groupKey] = [];
            groupedProps[groupKey].push(p);
          });

          return (
            <div
              key={player.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                player.isBankrupt
                  ? 'bg-slate-900/30 border-slate-800/40 opacity-40'
                  : isTurn
                  ? 'bg-slate-900/95 border-amber-400 shadow-xl ring-2 ring-amber-400/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
              style={{
                borderLeftWidth: '5px',
                borderLeftColor: player.color,
              }}
            >
              {/* Card Header & Player Stats */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md relative"
                      style={{ backgroundColor: player.color }}
                    >
                      <TokenRenderer tokenId={player.token} size={20} color="#FFFFFF" />
                      {isTurn && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900 animate-ping" />
                      )}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-extrabold text-sm text-slate-100 truncate">
                          {player.name}
                        </span>
                        {isMe && (
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-bold border border-slate-700">
                            You
                          </span>
                        )}
                        {player.isBot && (
                          <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1 py-0.2 rounded font-semibold">
                            Bot
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {BOARD_TILES[player.position]?.name}
                      </div>
                    </div>
                  </div>

                  {/* Cash Pill & Jail Badge */}
                  <div className="text-right flex-shrink-0">
                    {player.isBankrupt ? (
                      <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                        BANKRUPT
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        <CashBadge cash={player.cash} />
                        {player.inJail && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-800/40">
                            <ShieldAlert className="w-3 h-3" />
                            Jail ({player.jailTurns}/3)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Property Chips Grouped by Set */}
                {!player.isBankrupt && ownedProps.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleCollapse(player.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleCollapse(player.id);
                        }
                      }}
                      className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1 cursor-pointer hover:text-slate-200 select-none"
                    >
                      <span>Properties ({ownedProps.length})</span>
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </div>

                    {!isCollapsed && (
                      <div className="space-y-1.5 pt-0.5">
                        {Object.entries(groupedProps).map(([groupKey, props]) => {
                          const isPropertyColorGroup = groupKey in COLOR_GROUP_CONFIG;
                          const colorGroup = isPropertyColorGroup ? (groupKey as ColorGroup) : null;
                          const groupConfig = colorGroup ? COLOR_GROUP_CONFIG[colorGroup] : null;
                          const totalInGroup = groupConfig ? groupConfig.propertyCount : groupKey === 'hardware' ? 4 : 2;
                          const isFullMonopoly = Boolean(colorGroup && ownsFullGroup(state, player.id, colorGroup));

                          return (
                            <div key={groupKey} className="flex flex-col gap-0.5 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/60">
                              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                <span className="flex items-center gap-1">
                                  {isFullMonopoly && <Crown className="w-3 h-3 text-amber-400 inline" />}
                                  {groupConfig ? groupConfig.name : groupKey === 'hardware' ? 'Hardware Stores' : 'Utilities'}
                                </span>
                                <span className={isFullMonopoly ? 'text-amber-400 font-black' : 'text-slate-500'}>
                                  {props.length}/{totalInGroup} {isFullMonopoly ? '★ Full Set' : ''}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {props.map((prop) => {
                                  const tile = BOARD_TILES[prop.tileIndex];
                                  const tileColor = groupConfig ? groupConfig.color : '#475569';

                                  return (
                                    <button
                                      key={prop.tileIndex}
                                      onClick={() => onSelectTile(prop.tileIndex)}
                                      onMouseEnter={() => onHoverTile?.(prop.tileIndex)}
                                      onMouseLeave={() => onHoverTile?.(null)}
                                      className="px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-xs hover:scale-105 transition-transform flex items-center gap-1"
                                      style={{
                                        backgroundColor: tileColor,
                                        opacity: prop.isMortgaged ? 0.5 : 1,
                                      }}
                                      title={`${tile.name}${prop.houses > 0 ? ` (${prop.houses === 5 ? 'Hotel' : `${prop.houses}H`})` : ''}${prop.isMortgaged ? ' [Mortgaged]' : ''}`}
                                    >
                                      <span className="truncate max-w-[90px]">{tile.name}</span>
                                      {prop.houses > 0 && (
                                        <span className="text-[8px] bg-black/50 px-1 py-0.2 rounded font-black">
                                          {prop.houses === 5 ? 'H' : `${prop.houses}★`}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Trade & Kick Actions */}
                {!player.isBankrupt && !isMe && state.phase !== 'lobby' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onInitiateTrade(player.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold transition-colors border border-slate-700/80"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Trade
                    </button>

                    {isHost && (
                      <button
                        onClick={() => onKickPlayer(player.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold transition-colors border border-red-800/50"
                        title="Remove player from the game"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Kick
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
